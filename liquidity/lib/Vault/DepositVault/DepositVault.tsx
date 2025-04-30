/* eslint-disable no-console */
import { Text, Flex, Button, useToast, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react';
import { TokenIcon } from '@snx-v3/TokenIcon';
import { BorderBox } from '@snx-v3/BorderBox';
import { useParams, VaultPositionPageSchemaType } from '@snx-v3/useParams';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { NumberInput } from '@snx-v3/NumberInput';
import { Amount } from '@snx-v3/Amount';
import { useTokenBalance } from '@snx-v3/useTokenBalance';
import { useEffect, useState, useRef } from 'react';
import { ZEROWEI } from '@snx-v3/constants';
import { useUSDC } from '@snx-v3/useUSDC';
import { useApprove } from '@snx-v3/useApprove';
import { parseUnits } from '@snx-v3/format';
import { BigNumber, ethers } from 'ethers';
import { useNetwork, useProvider, useSigner } from '@snx-v3/useBlockchain';
import debug from 'debug';
import { useContractErrorParser } from '@snx-v3/useContractErrorParser';
import { ContractError } from '@snx-v3/ContractError';
import { FundingRateVaultData } from '../../useFundingRateVaultData';
import { wei } from '@synthetixio/wei';
import { formatNumberShort } from '@snx-v3/formatters';

const log = debug('snx:DepositVault');

interface Props {
  vaultData?: FundingRateVaultData;
}

type ValidationType = 'error' | 'info';

export const DepositVault = ({ vaultData }: Props) => {
  const [params] = useParams<VaultPositionPageSchemaType>();
  const [amount, setAmount] = useState(ZEROWEI);
  const [touched, setTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { network } = useNetwork();
  const signer = useSigner();
  const provider = useProvider();
  const { data: USDCToken } = useUSDC();
  const errorParser = useContractErrorParser();
  const [simulatedOut, setSimulatedOut] = useState<BigNumber | null>(null);
  const latestRequestIdRef = useRef<number>(0);

  const { data: usdcBalance, refetch: refetchUSDCBalance } = useTokenBalance(USDCToken?.address);

  const toast = useToast({ isClosable: true, duration: 9000 });

  const { approve, requireApproval, refetchAllowance } = useApprove({
    contractAddress: USDCToken?.address,
    amount: parseUnits(amount.toString(), 6),
    spender: vaultData?.address,
  });

  const vaultAddress = vaultData?.address;
  const vaultAbi = vaultData?.abi;

  useEffect(() => {
    const simulate = async () => {
      if (
        !provider ||
        requireApproval ||
        !signer ||
        !amount ||
        amount === ZEROWEI ||
        !vaultAddress ||
        !vaultAbi
      ) {
        return;
      }

      // Generate a new request ID for this simulation
      const currentRequestId = ++latestRequestIdRef.current;

      try {
        const contract = new ethers.Contract(vaultAddress, vaultAbi, signer);
        const walletAddress = await signer.getAddress();

        const simulatedOut_ = await contract.callStatic['deposit(uint256,address)'](
          parseUnits(amount.toString(), 6).toString(),
          walletAddress
        );

        // Only update state if this is still the latest request
        if (currentRequestId === latestRequestIdRef.current) {
          setSimulatedOut(simulatedOut_);
        }
      } catch (error) {
        // Only log errors if this is still the latest request
        if (currentRequestId === latestRequestIdRef.current) {
          console.error('Simulation error:', error);
        }
      }
    };

    simulate();
  }, [amount, provider, requireApproval, signer, vaultAddress, vaultAbi]);

  const handleSubmit = async () => {
    try {
      if (!(provider && network && signer && vaultAddress && vaultAbi)) {
        return;
      }

      if (requireApproval) {
        setIsLoading(true);
        await approve(true);

        refetchAllowance();
      } else {
        if (!simulatedOut) {
          return;
        }

        setIsLoading(true);

        const contract = new ethers.Contract(vaultAddress, vaultAbi, signer);
        const walletAddress = await signer.getAddress();

        const depositTx = await contract.populateTransaction['deposit(uint256,address,uint256)'](
          parseUnits(amount.toString(), 6).toString(),
          walletAddress,
          simulatedOut.mul(99).div(100).toString()
        );

        const txn = await signer.sendTransaction({
          ...depositTx,
          gasLimit: depositTx?.gasLimit?.mul(3),
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

  // Validation helper
  function getDepositValidation({
    amount,
    touched,
    vaultData,
    usdcBalance,
  }: {
    amount: any;
    touched: boolean;
    vaultData?: FundingRateVaultData;
    usdcBalance: any;
  }): { type: ValidationType; message: string } | null {
    if (!touched || !amount || amount.eq(0) || amount.eq(ZEROWEI) || !vaultData) return null;

    // Paused
    if (vaultData.paused) {
      return {
        type: 'info',
        message: 'Vault deposits are temporarily paused. Please check back soon.',
      };
    }

    // Cap
    if (wei(amount).add(wei(vaultData.totalAssets, 6)).gt(wei(vaultData.totalAssetsCap, 6))) {
      return {
        type: 'info',
        message: `This vault has reached its maximum deposit cap of $${formatNumberShort(
          wei(vaultData.totalAssetsCap, 6).toNumber()
        )}. No additional deposits are allowed at this time.`,
      };
    }

    // Max
    if (wei(amount).gt(wei(vaultData.maxAssetTransactionSize, 6))) {
      return {
        type: 'error',
        message: `The deposit amount exceeds the maximum transaction size of $${formatNumberShort(
          wei(vaultData.maxAssetTransactionSize, 6).toNumber()
        )}. Please split your deposit into smaller amounts.`,
      };
    }

    // Min
    if (wei(amount).lt(wei(vaultData.minAssetTransactionSize, 6))) {
      return {
        type: 'error',
        message: `The minimum deposit amount is $${formatNumberShort(
          wei(vaultData.minAssetTransactionSize, 6).toNumber()
        )} per deposit.`,
      };
    }

    // Exceeds balance
    if (usdcBalance && wei(amount).gt(wei(usdcBalance, 6))) {
      return {
        type: 'error',
        message: 'The deposit amount exceeds your available balance.',
      };
    }

    return null;
  }

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
              onBlur: () => setTouched(true),
            }}
            value={amount}
            onChange={(value) => {
              setAmount(value);
              if (!touched) setTouched(true);
            }}
            max={usdcBalance}
            min={ZEROWEI}
          />
          <Flex fontSize="xs" color="whiteAlpha.700" alignSelf="flex-end" gap="1">
            <Amount prefix="$" value={amount.abs().mul(1)} />
          </Flex>
        </Flex>
      </BorderBox>

      {/* Validation Section */}
      {(() => {
        if (!vaultData) return null;
        const validation = getDepositValidation({ amount, touched, vaultData, usdcBalance });
        if (!validation) return null;
        return (
          <Alert mb={6} status={validation.type} borderRadius="6px">
            <AlertIcon />
            <AlertDescription>{validation.message}</AlertDescription>
          </Alert>
        );
      })()}

      {/* Price Impact Section */}
      {!!amount && amount.gt(0) && simulatedOut ? (
        <Flex
          w="100%"
          justifyContent="space-between"
          alignItems="center"
          px={4}
          py={3}
          mb={4}
          borderRadius="md"
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.200"
        >
          <Text color="whiteAlpha.700" fontWeight="500">
            Price Impact
          </Text>
          {(() => {
            if (!amount) return;
            if (amount === ZEROWEI) return;
            if (!vaultData) return;
            const inValue = wei(amount).toNumber();
            const outValue = wei(simulatedOut).toNumber() * wei(vaultData.exchangeRate).toNumber();
            const depositFee = wei(vaultData.depositFee).toNumber();
            const keeperFee = wei(vaultData.keeperFee).toNumber();
            const inValueAfterFees = inValue * (1 - depositFee) - keeperFee;
            const priceImpact = ((outValue - inValueAfterFees) / inValueAfterFees) * 100;
            const isNegative = priceImpact < 0;
            return (
              <Text fontWeight="bold" color={isNegative ? 'red.400' : 'green.400'} fontSize="lg">
                {priceImpact > 0 ? '+' : ''}
                {priceImpact.toFixed(2)}%
              </Text>
            );
          })()}
        </Flex>
      ) : null}

      {/* Submit Button */}
      <Button
        data-cy="deposit submit"
        type="submit"
        isDisabled={
          amount.eq(0) ||
          !(amount.gt(0) && collateralType) ||
          !!getDepositValidation({ amount, touched, vaultData, usdcBalance })
        }
        onClick={handleSubmit}
        isLoading={isLoading}
      >
        {amount.lte(0) ? 'Enter Amount' : requireApproval ? 'Approve USDC' : 'Deposit into Vault'}
      </Button>
    </>
  );
};
