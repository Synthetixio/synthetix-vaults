import { Button, Flex, Text, useToast } from '@chakra-ui/react';
import { Amount } from '@snx-v3/Amount';
import { ContractError } from '@snx-v3/ContractError';
import { TokenIcon } from '@snx-v3/TokenIcon';
import { useNetwork, useProvider, useSigner, useWallet } from '@snx-v3/useBlockchain';
import { useContractErrorParser } from '@snx-v3/useContractErrorParser';
import { useStaticAaveUSDC } from '@snx-v3/useStaticAaveUSDC';
import { useStataUSDCBalance } from '@snx-v3/useStataUSDCBalance';
import { wei } from '@synthetixio/wei';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import debug from 'debug';
import { ethers } from 'ethers';
import React from 'react';

const log = debug('snx:StataUSDC');

export function StataUSDC() {
  const { network } = useNetwork();
  const provider = useProvider();
  const signer = useSigner();
  const { activeWallet } = useWallet();
  const walletAddress = activeWallet?.address;

  const { data: StaticAaveUSDC } = useStaticAaveUSDC();

  const { data: stataBalance } = useStataUSDCBalance();

  const toast = useToast({ isClosable: true, duration: 9000 });
  const queryClient = useQueryClient();
  const errorParser = useContractErrorParser();
  const isReady = network && provider && signer && walletAddress && StaticAaveUSDC && true;
  const { mutateAsync: unwrapStaticAaveUSDC, isPending } = useMutation({
    mutationFn: async function () {
      if (!isReady) {
        throw new Error('Not ready');
      }
      const StaticAaveUSDCContract = new ethers.Contract(
        StaticAaveUSDC.address,
        StaticAaveUSDC.abi,
        signer
      );
      const maxRedeem = await StaticAaveUSDCContract.maxRedeem(walletAddress);
      log('maxRedeem', maxRedeem);

      const shares = maxRedeem;
      log('shares', shares);
      const receiver = walletAddress;
      log('receiver', receiver);
      const owner = walletAddress;
      log('owner', owner);
      const withdrawFromAave = true;
      log('withdrawFromAave', withdrawFromAave);

      const args = [
        //
        shares,
        receiver,
        owner,
        withdrawFromAave,
      ];
      const gasLimit = await StaticAaveUSDCContract.estimateGas[
        'redeem(uint256,address,address,bool)'
      ](...args);
      const txn = await StaticAaveUSDCContract['redeem(uint256,address,address,bool)'](...args, {
        gasLimit: gasLimit.mul(15).div(10),
      });
      log('txn', txn);

      const receipt = await provider.waitForTransaction(txn.hash);
      log('receipt', receipt);
      return receipt;
    },

    onSuccess: async () => {
      const deployment = `${network?.id}-${network?.preset}`;
      await Promise.all(
        [
          //
          'StaticAaveUSDC Redeem',
        ].map((key) => queryClient.invalidateQueries({ queryKey: [deployment, key] }))
      );

      toast.closeAll();
      toast({
        title: 'Success',
        description: 'Your USDC via Aave has been unwrapped to USDC.',
        status: 'success',
        duration: 5000,
        variant: 'left-accent',
      });
    },

    onError: (error) => {
      const contractError = errorParser(error);
      if (contractError) {
        console.error(new Error(contractError.name), contractError);
      }
      toast.closeAll();
      toast({
        title: 'Transaction failed',
        variant: 'left-accent',
        description: contractError ? (
          <ContractError contractError={contractError} />
        ) : (
          'Please try again.'
        ),
        status: 'error',
        duration: 3_600_000,
      });
      throw Error('Transaction failed', { cause: error });
    },
  });

  if (!(stataBalance && stataBalance.maxRedeem.gt(0))) {
    return null;
  }

  return (
    <Flex
      flexDir="row"
      w="100%"
      border="1px solid"
      borderColor="gray.900"
      rounded="base"
      bg="navy.700"
      py={4}
      px={4}
      gap={4}
      alignItems="center"
    >
      <Flex alignItems="center" flex="1" textDecoration="none" _hover={{ textDecoration: 'none' }}>
        <TokenIcon height={30} width={30} symbol="stataUSDC" />
        <Flex flexDirection="column" ml={3}>
          <Text
            color="white"
            fontWeight={700}
            lineHeight="1.25rem"
            fontFamily="heading"
            fontSize="sm"
          >
            USDC via Aave
          </Text>
        </Flex>
      </Flex>
      <Flex width={['100px', '100px', '160px']} direction="column" alignItems="flex-end">
        <Text color="white" fontSize="14px" fontFamily="heading" fontWeight={500} lineHeight="20px">
          <Amount prefix="$" value={wei(stataBalance.previewRedeem, 6)} />
        </Text>
      </Flex>
      <Flex width={['70px', '100px', '160px']} justifyContent="flex-end">
        <Button
          size="sm"
          variant="solid"
          isDisabled={!isReady}
          isLoading={isPending}
          _disabled={{
            bg: 'gray.900',
            backgroundImage: 'none',
            color: 'gray.500',
            opacity: 0.5,
            cursor: 'not-allowed',
          }}
          data-cy="unwrap stata submit"
          onClick={() => {
            window?._paq?.push(['trackEvent', 'liquidity', 'v3_staking', `submit_unwrap_stata_v3`]);
            unwrapStaticAaveUSDC();
          }}
        >
          Unwrap
        </Button>
      </Flex>
    </Flex>
  );
}
