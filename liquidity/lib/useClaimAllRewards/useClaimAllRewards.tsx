import { useToast } from '@chakra-ui/react';
import { D18 } from '@snx-v3/constants';
import { ContractError } from '@snx-v3/ContractError';
import { initialState, reducer } from '@snx-v3/txnReducer';
import { useNetwork, useProvider, useSigner } from '@snx-v3/useBlockchain';
import { useCollateralPriceUpdates } from '@snx-v3/useCollateralPriceUpdates';
import { useContractErrorParser } from '@snx-v3/useContractErrorParser';
import { useCoreProxy } from '@snx-v3/useCoreProxy';
import { useRewards } from '@snx-v3/useRewards';
import { useSpotMarketProxy } from '@snx-v3/useSpotMarketProxy';
import { useSynthTokens } from '@snx-v3/useSynthTokens';
import { withERC7412 } from '@snx-v3/withERC7412';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import debug from 'debug';
import { ethers } from 'ethers';
import React from 'react';

const log = debug('snx:useClaimAllRewards');

export function useClaimAllRewards({
  accountId,
  collateralSymbol,
}: {
  accountId?: string;
  collateralSymbol?: string;
}) {
  const { data: rewards } = useRewards({ accountId });

  const toast = useToast({ isClosable: true, duration: 9000 });

  const { network } = useNetwork();
  const { data: SpotMarketProxy } = useSpotMarketProxy();
  const signer = useSigner();
  const { data: CoreProxy } = useCoreProxy();
  const [txnState, dispatch] = React.useReducer(reducer, initialState);
  const queryClient = useQueryClient();
  const provider = useProvider();
  const { data: synthTokens } = useSynthTokens();

  const { data: priceUpdateTx } = useCollateralPriceUpdates();

  const errorParser = useContractErrorParser();

  const mutation = useMutation({
    mutationFn: async function () {
      if (
        !(network && provider && signer && SpotMarketProxy && CoreProxy && rewards && synthTokens)
      ) {
        throw new Error('Not ready');
      }

      dispatch({ type: 'prompting' });

      const transactions: Promise<ethers.PopulatedTransaction>[] = [];

      const CoreProxyContract = new ethers.Contract(CoreProxy.address, CoreProxy.abi, signer);
      const SpotMarketProxyContract = new ethers.Contract(
        SpotMarketProxy.address,
        SpotMarketProxy.abi,
        signer
      );

      rewards
        .filter((reward) => !collateralSymbol || reward.collateralType?.symbol === collateralSymbol)
        .forEach(({ distributor, claimableAmount, claimMethod, args }) => {
          if (claimableAmount.gt(0)) {
            transactions.push(CoreProxyContract.populateTransaction[claimMethod](...args));

            const synthToken = synthTokens.find(
              (synth) =>
                synth.address.toLowerCase() === distributor.payoutToken.address.toLowerCase()
            );
            if (synthToken && synthToken.token) {
              const minAmountReceived = claimableAmount
                .toBN()
                .sub(claimableAmount.toBN().div(100))
                // Adjust precision for underlying token
                .mul(ethers.utils.parseUnits('1', synthToken.token.decimals))
                .div(D18);

              transactions.push(
                SpotMarketProxyContract.populateTransaction.unwrap(
                  synthToken.synthMarketId,
                  claimableAmount.toBN(),
                  minAmountReceived
                )
              );
            }
          }
        });

      const calls = await Promise.all(transactions);
      log('calls', calls);

      if (priceUpdateTx) {
        calls.unshift(priceUpdateTx as any);
      }

      const walletAddress = await signer.getAddress();
      const { multicallTxn: erc7412Tx, gasLimit } = await withERC7412(
        provider,
        network,
        calls,
        'useClaimAllRewards',
        walletAddress
      );
      const txn = await signer.sendTransaction({
        ...erc7412Tx,
        gasLimit: gasLimit.mul(15).div(10),
      });
      log('txn', txn);
      dispatch({ type: 'pending', payload: { txnHash: txn.hash } });
      const receipt = await provider.waitForTransaction(txn.hash);
      log('receipt', receipt);
      return receipt;
    },

    onError(error) {
      const contractError = errorParser(error);
      if (contractError) {
        console.error(new Error(contractError.name), contractError);
      }

      dispatch({ type: 'error', payload: { error } });

      toast.closeAll();
      toast({
        title: 'Claiming failed',
        description: contractError ? (
          <ContractError contractError={contractError} />
        ) : (
          'Please try again.'
        ),
        status: 'error',
        variant: 'left-accent',
        duration: 3_600_000,
      });
    },

    onSuccess: async () => {
      const deployment = `${network?.id}-${network?.preset}`;
      await Promise.all(
        [
          //
          'PriceUpdates',
          'Rewards',
          'TokenBalance',
          'SynthBalances',
          'EthBalance',
        ].map((key) => queryClient.invalidateQueries({ queryKey: [deployment, key] }))
      );
      dispatch({ type: 'success' });

      toast.closeAll();
      toast({
        title: 'Success',
        description: 'Your rewards have been claimed',
        status: 'success',
        duration: 5000,
        variant: 'left-accent',
      });
    },
  });

  return {
    mutation,
    txnState,
    settle: () => dispatch({ type: 'settled' }),
    isLoading: mutation.isPending,
    exec: mutation.mutateAsync,
  };
}
