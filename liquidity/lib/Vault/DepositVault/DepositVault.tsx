/* eslint-disable no-console */
import { Text, Flex, Button, useToast } from '@chakra-ui/react';
import { TokenIcon } from '@snx-v3/TokenIcon';
import { BorderBox } from '@snx-v3/BorderBox';
import { useParams, VaultPositionPageSchemaType } from '@snx-v3/useParams';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { NumberInput } from '@snx-v3/NumberInput';
import { Amount } from '@snx-v3/Amount';
import { useTokenBalance } from '@snx-v3/useTokenBalance';
import { useState } from 'react';
import { ZEROWEI } from '@snx-v3/constants';
import { useUSDC } from '@snx-v3/useUSDC';
import { useApprove } from '@snx-v3/useApprove';
import { parseUnits } from '@snx-v3/format';
import { ethers } from 'ethers';
import { useNetwork, useProvider, useSigner } from '@snx-v3/useBlockchain';
import debug from 'debug';
import { useContractErrorParser } from '@snx-v3/useContractErrorParser';
import { ContractError } from '@snx-v3/ContractError';
import { FundingRateVaultData } from '../../useFundingRateVaultData';

const log = debug('snx:DepositVault');

interface Props {
  vaultData: FundingRateVaultData;
}

export const DepositVault = ({ vaultData }: Props) => {
  const [params] = useParams<VaultPositionPageSchemaType>();
  const [amount, setAmount] = useState(ZEROWEI);
  const [isLoading, setIsLoading] = useState(false);
  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { network } = useNetwork();
  const signer = useSigner();
  const provider = useProvider();
  const { data: USDCToken } = useUSDC();
  const errorParser = useContractErrorParser();

  const { data: usdcBalance, refetch: refetchUSDCBalance } = useTokenBalance(USDCToken?.address);

  const overAvailableBalance = amount.gt(usdcBalance || ZEROWEI);
  const toast = useToast({ isClosable: true, duration: 9000 });

  const { approve, requireApproval, refetchAllowance } = useApprove({
    contractAddress: USDCToken?.address,
    amount: parseUnits(amount.toString(), 6),
    spender: vaultData.address,
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!(provider && network && signer)) {
        return;
      }

      if (requireApproval) {
        await approve(false);

        refetchAllowance();
      } else {
        const contract = new ethers.Contract(vaultData.address, vaultData.abi, signer);
        const walletAddress = await signer.getAddress();

        const depositTx = await contract.populateTransaction['deposit(uint256,address)'](
          parseUnits(amount.toString(), 6).toString(),
          walletAddress
        );

        const txn = await signer.sendTransaction({
          ...depositTx,
          gasLimit: depositTx?.gasLimit?.mul(15).div(10),
        });
        log('txn', txn);

        const receipt = await provider.waitForTransaction(txn.hash);

        refetchUSDCBalance();

        log('receipt', receipt);
      }
    } catch (error) {
      const contractError = errorParser(error);
      if (contractError) {
        console.error(new Error(contractError.name), contractError);
      }

      toast.closeAll();
      toast({
        title: 'Deposit',
        description: contractError ? (
          <ContractError contractError={contractError} />
        ) : (
          'Please try again.'
        ),
        status: 'error',
        variant: 'left-accent',
        duration: 3_600_000,
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <BorderBox
        mt={6}
        w="100%"
        display="flex"
        p={3}
        mb="6"
        bg="whiteAlpha.50"
        borderColor="whiteAlpha.200"
      >
        <Flex alignItems="flex-start" flexDir="column" gap="1">
          <BorderBox bg="none" display="flex" py={1.5} px={2.5} borderColor="whiteAlpha.200">
            <Text display="flex" gap={2} alignItems="center" fontWeight="600">
              <TokenIcon
                symbol={collateralType?.symbol ?? params.collateralSymbol}
                width={16}
                height={16}
              />
              {collateralType?.displaySymbol ?? params.collateralSymbol}
            </Text>
          </BorderBox>
          <Flex minW="110px" fontSize="xs" color="whiteAlpha.700">
            <Amount prefix="Balance: " value={usdcBalance || ZEROWEI} />
            &nbsp;
            <Text
              as="span"
              cursor="pointer"
              onClick={() => setAmount(usdcBalance || ZEROWEI)}
              color="cyan.500"
              fontWeight={700}
            >
              Max
            </Text>
          </Flex>
        </Flex>

        <Flex flexDir="column" flexGrow={1}>
          <NumberInput
            InputProps={{
              'data-max': usdcBalance?.toString(),
              min: 0,
            }}
            value={amount}
            onChange={(value) => {
              setAmount(value);
            }}
            max={usdcBalance}
            min={ZEROWEI}
          />
          <Flex fontSize="xs" color="whiteAlpha.700" alignSelf="flex-end" gap="1">
            <Amount prefix="$" value={amount.abs().mul(1)} />
          </Flex>
        </Flex>
      </BorderBox>

      <Button
        data-cy="deposit submit"
        type="submit"
        isDisabled={!(amount.gt(0) && !overAvailableBalance && collateralType)}
        onClick={handleSubmit}
        isLoading={isLoading}
      >
        {amount.lte(0)
          ? 'Enter Amount'
          : requireApproval
            ? 'Approve USDC'
            : 'Deposit and Lock Collateral'}
      </Button>
    </>
  );
};
