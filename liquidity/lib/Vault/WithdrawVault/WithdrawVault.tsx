import { Text, Flex, Button, useToast } from '@chakra-ui/react';
import { TokenIcon } from '@snx-v3/TokenIcon';
import { BorderBox } from '@snx-v3/BorderBox';
import { useParams, VaultPositionPageSchemaType } from '@snx-v3/useParams';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { NumberInput } from '@snx-v3/NumberInput';
import { Amount } from '@snx-v3/Amount';
import { useTokenBalance } from '@snx-v3/useTokenBalance';
import { useState, useEffect, useRef } from 'react';
import { ZEROWEI } from '@snx-v3/constants';
import { parseUnits } from '@snx-v3/format';
import { ethers, BigNumber } from 'ethers';
import { useNetwork, useProvider, useSigner } from '@snx-v3/useBlockchain';
import debug from 'debug';
import { useContractErrorParser } from '@snx-v3/useContractErrorParser';
import { ContractError } from '@snx-v3/ContractError';
import { wei } from '@synthetixio/wei';
import { FundingRateVaultData } from '../../useFundingRateVaultData';

const log = debug('snx:WithdrawVault');

interface Props {
  vaultData: FundingRateVaultData;
}

export const WithdrawVault = ({ vaultData }: Props) => {
  const [params] = useParams<VaultPositionPageSchemaType>();
  const [amount, setAmount] = useState(ZEROWEI);
  const [isLoading, setIsLoading] = useState(false);
  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { network } = useNetwork();
  const signer = useSigner();
  const provider = useProvider();
  const errorParser = useContractErrorParser();
  const { data: lpBalance, refetch: refetchLpBalance } = useTokenBalance(vaultData.address);
  const [simulatedOut, setSimulatedOut] = useState<BigNumber | null>(null);
  const latestRequestIdRef = useRef<number>(0);

  const overAvailableBalance = amount.gt(lpBalance || ZEROWEI);
  const toast = useToast({ isClosable: true, duration: 9000 });

  const maxAmount = wei(vaultData.balanceOf || '0');

  useEffect(() => {
    const simulate = async () => {
      if (!provider || !signer || !amount || amount === ZEROWEI) {
        return;
      }

      // Generate a new request ID for this simulation
      const currentRequestId = ++latestRequestIdRef.current;

      try {
        const contract = new ethers.Contract(vaultData.address, vaultData.abi, signer);
        const walletAddress = await signer.getAddress();

        const simulatedOut_ = await contract.callStatic['redeem(uint256,address,address)'](
          parseUnits(amount.toString(), 18).toString(),
          walletAddress,
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
  }, [amount, provider, signer, vaultData.address, vaultData.abi]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!(provider && network && signer)) {
        return;
      }

      if (!simulatedOut) {
        return;
      }

      const contract = new ethers.Contract(vaultData.address, vaultData.abi, signer);
      const walletAddress = await signer.getAddress();

      // Add 1% markup to the simulated amount for minAmountOut
      const minAmountOut = simulatedOut.mul(99).div(100);

      const withdrawTx = await contract.populateTransaction[
        'redeem(uint256,address,address,uint256)'
      ](
        parseUnits(amount.toString(), 18).toString(),
        walletAddress,
        walletAddress,
        minAmountOut.toString()
      );

      const txn = await signer.sendTransaction({
        ...withdrawTx,
        gasLimit: withdrawTx?.gasLimit?.mul(3),
      });
      log('txn', txn);

      const receipt = await provider.waitForTransaction(txn.hash);

      refetchLpBalance();

      log('receipt', receipt);
    } catch (error) {
      const contractError = errorParser(error);
      if (contractError) {
        console.error(new Error(contractError.name), contractError);
      }

      toast.closeAll();
      toast({
        title: 'Withdraw',
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
            <Amount prefix="Balance: " value={maxAmount} />
            &nbsp;
            <Text
              as="span"
              cursor="pointer"
              onClick={() => setAmount(maxAmount)}
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
              'data-max': maxAmount?.toString(),
              min: 0,
            }}
            value={amount}
            onChange={(value) => {
              setAmount(value);
            }}
            max={maxAmount}
            min={ZEROWEI}
          />
          <Flex fontSize="xs" color="whiteAlpha.700" alignSelf="flex-end" gap="1">
            <Amount
              prefix="$"
              value={amount
                .abs()
                .mul(vaultData.exchangeRate || '1')
                .mul(1)}
            />
          </Flex>
        </Flex>
      </BorderBox>

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
            const inValue = wei(amount).toNumber() * wei(vaultData.exchangeRate).toNumber();
            const outValue = wei(simulatedOut, 6).toNumber();
            const withdrawFee = wei(vaultData.redemptionFee || 0).toNumber();
            const keeperFee = wei(vaultData.keeperFee || 0).toNumber();
            const inValueAfterFees = inValue * (1 - withdrawFee) - keeperFee;
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

      <Button
        type="submit"
        isDisabled={
          !(
            amount.gt(0) &&
            !overAvailableBalance &&
            collateralType &&
            amount.lte(maxAmount) &&
            simulatedOut
          )
        }
        onClick={handleSubmit}
        isLoading={isLoading}
      >
        {amount.lte(0) ? 'Enter Amount' : 'Withdraw'}
      </Button>
    </>
  );
};
