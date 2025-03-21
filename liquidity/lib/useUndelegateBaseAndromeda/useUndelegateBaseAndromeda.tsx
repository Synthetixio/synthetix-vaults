import { POOL_ID } from '@snx-v3/constants';
import { USDC_BASE_MARKET } from '@snx-v3/isBaseAndromeda';
import { notNil } from '@snx-v3/tsHelpers';
import { initialState, reducer } from '@snx-v3/txnReducer';
import { useAccountProxy } from '@snx-v3/useAccountProxy';
import { useNetwork, useProvider, useSigner } from '@snx-v3/useBlockchain';
import { useCollateralPriceUpdates } from '@snx-v3/useCollateralPriceUpdates';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { useCoreProxy } from '@snx-v3/useCoreProxy';
import { useDebtRepayer } from '@snx-v3/useDebtRepayer';
import { useLiquidityPosition } from '@snx-v3/useLiquidityPosition';
import { type LiquidityPositionPageSchemaType, useParams } from '@snx-v3/useParams';
import { useSpotMarketProxy } from '@snx-v3/useSpotMarketProxy';
import { withERC7412 } from '@snx-v3/withERC7412';
import { Wei, wei } from '@synthetixio/wei';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import debug from 'debug';
import { ethers } from 'ethers';
import React from 'react';

const log = debug('snx:useUndelegateBaseAndromeda');

export function useUndelegateBaseAndromeda({ undelegateAmount }: { undelegateAmount?: Wei }) {
  const [params] = useParams<LiquidityPositionPageSchemaType>();

  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { data: liquidityPosition } = useLiquidityPosition({
    accountId: params.accountId,
    collateralType,
  });

  const collateralTypeAddress = collateralType?.tokenAddress;
  const currentCollateral = liquidityPosition?.collateralAmount || wei(0);

  const [txnState, dispatch] = React.useReducer(reducer, initialState);
  const { data: CoreProxy } = useCoreProxy();
  const { data: SpotMarketProxy } = useSpotMarketProxy();
  const { data: priceUpdateTx } = useCollateralPriceUpdates();

  const signer = useSigner();
  const provider = useProvider();
  const { network } = useNetwork();

  const { data: AccountProxy } = useAccountProxy();
  const { data: DebtRepayer } = useDebtRepayer();

  const queryClient = useQueryClient();

  const canUndelegate =
    liquidityPosition &&
    liquidityPosition.collateralAmount.gt(0) &&
    undelegateAmount &&
    liquidityPosition.collateralAmount.gte(undelegateAmount);

  const isReady =
    canUndelegate &&
    network &&
    provider &&
    signer &&
    CoreProxy &&
    AccountProxy &&
    DebtRepayer &&
    SpotMarketProxy &&
    params.accountId &&
    collateralTypeAddress &&
    // Make it boolean
    true;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!isReady) {
        throw new Error('Not ready');
      }

      dispatch({ type: 'prompting' });

      const AccountProxyContract = new ethers.Contract(
        AccountProxy.address,
        AccountProxy.abi,
        signer
      );

      const DebtRepayerContract = new ethers.Contract(DebtRepayer.address, DebtRepayer.abi, signer);

      const approveAccountTx = AccountProxyContract.populateTransaction.approve(
        DebtRepayer.address,
        params.accountId
      );

      const depositDebtToRepay = DebtRepayerContract.populateTransaction.depositDebtToRepay(
        CoreProxy.address,
        SpotMarketProxy.address,
        AccountProxy.address,
        params.accountId,
        POOL_ID,
        collateralTypeAddress,
        USDC_BASE_MARKET
      );

      const CoreProxyContract = new ethers.Contract(CoreProxy.address, CoreProxy.abi, signer);

      const delegateTx = CoreProxyContract.populateTransaction.delegateCollateral(
        ethers.BigNumber.from(params.accountId),
        ethers.BigNumber.from(POOL_ID),
        collateralTypeAddress,
        currentCollateral.sub(undelegateAmount).toBN(),
        wei(1).toBN()
      );

      const callsPromise: Promise<(ethers.PopulatedTransaction & { requireSuccess?: boolean })[]> =
        Promise.all([approveAccountTx, depositDebtToRepay, delegateTx].filter(notNil));

      const [calls] = await Promise.all([callsPromise]);

      if (priceUpdateTx) {
        calls.unshift(priceUpdateTx as any);
      }

      const walletAddress = await signer.getAddress();

      const { multicallTxn: erc7412Tx, gasLimit } = await withERC7412(
        provider,
        network,
        calls,
        'useUndelegateBase',
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

    onSuccess: async () => {
      const deployment = `${network?.id}-${network?.preset}`;
      await Promise.all(
        [
          //
          'PriceUpdates',
          'LiquidityPosition',
          'LiquidityPositions',
          'TokenBalance',
          'SynthBalances',
          'EthBalance',
          'Allowance',
          'AccountCollateralUnlockDate',
        ].map((key) => queryClient.invalidateQueries({ queryKey: [deployment, key] }))
      );
      dispatch({ type: 'success' });
    },

    onError: (error) => {
      dispatch({ type: 'error', payload: { error } });
      throw error;
    },
  });
  return {
    mutation,
    txnState,
    settle: () => dispatch({ type: 'settled' }),
    isLoading: mutation.isPending,
    exec: mutation.mutateAsync,
    isReady,
  };
}
