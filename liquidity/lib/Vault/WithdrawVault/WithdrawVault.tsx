import { Text, Flex, Button, useToast } from '@chakra-ui/react';
import { TokenIcon } from '@snx-v3/TokenIcon';
import { BorderBox } from '@snx-v3/BorderBox';
import { useParams, VaultPositionPageSchemaType } from '@snx-v3/useParams';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { NumberInput } from '@snx-v3/NumberInput';
import { Amount } from '@snx-v3/Amount';
import { useTokenBalance } from '@snx-v3/useTokenBalance';
import { useMemo, useState } from 'react';
import { ZEROWEI } from '@snx-v3/constants';
import { useUSDC } from '@snx-v3/useUSDC';
import { usePositionManagerDeltaNeutralETH } from '../../contracts/usePositionManagerDeltaNeutralETH';
import { usePositionManagerDeltaNeutralBTC } from '../../contracts/usePositionManagerDeltaNeutralBTC';
import { parseUnits } from '@snx-v3/format';
import { ethers } from 'ethers';
import { useNetwork, useProvider, useSigner } from '@snx-v3/useBlockchain';
import debug from 'debug';
import { useContractErrorParser } from '@snx-v3/useContractErrorParser';
import { ContractError } from '@snx-v3/ContractError';
import { wei } from '@synthetixio/wei';
import { useStrategyPoolPosition } from '../../useStrategyPoolPosition';
import { useStrategyPoolInfo } from '../../useStrategyPoolInfo';

const log = debug('snx:WithdrawVault');

export const WithdrawVault = () => {
  const [params] = useParams<VaultPositionPageSchemaType>();
  const [amount, setAmount] = useState(ZEROWEI);
  const [isLoading, setIsLoading] = useState(false);
  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { network } = useNetwork();
  const signer = useSigner();
  const provider = useProvider();
  const { data: USDCToken } = useUSDC();
  const { data: DeltaNeutralETH } = usePositionManagerDeltaNeutralETH();
  const { data: DeltaNeutralBTC } = usePositionManagerDeltaNeutralBTC();
  const errorParser = useContractErrorParser();
  const { data: usdcBalance, refetch: refetchUSDCBalance } = useTokenBalance(USDCToken?.address);

  const deltaNeutral = useMemo(() => {
    if (params.symbol === 'BTC Delta Neutral') {
      return DeltaNeutralBTC;
    }
    if (params.symbol === 'ETH Delta Neutral') {
      return DeltaNeutralETH;
    }
  }, [DeltaNeutralBTC, DeltaNeutralETH, params.symbol]);

  const { data: position, refetch: refetchPosition } = useStrategyPoolPosition(
    deltaNeutral?.address
  );
  const { data: poolInfo } = useStrategyPoolInfo(deltaNeutral?.address);

  const overAvailableBalance = amount.gt(usdcBalance || ZEROWEI);
  const toast = useToast({ isClosable: true, duration: 9000 });

  const maxAmount = wei(position?.balance || '0');

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      if (!(deltaNeutral && provider && network && signer)) {
        return;
      }

      const contract = new ethers.Contract(deltaNeutral?.address, deltaNeutral?.abi, signer);
      const walletAddress = await signer.getAddress();

      const withdrawTx = await contract.populateTransaction.redeem(
        parseUnits(amount.toString(), 18).toString(),
        walletAddress,
        walletAddress
      );

      const txn = await signer.sendTransaction({
        ...withdrawTx,
        gasLimit: withdrawTx?.gasLimit?.mul(15).div(10),
      });
      log('txn', txn);

      const receipt = await provider.waitForTransaction(txn.hash);

      refetchUSDCBalance();
      refetchPosition();

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
      <BorderBox mt={6} w="100%" display="flex" alignItems="center" p={3} mb="6" bg="whiteAlpha.50">
        <Flex alignItems="flex-start" flexDir="column" gap="1">
          <BorderBox bg="none" display="flex" py={1.5} px={2.5}>
            <Text display="flex" gap={2} alignItems="center" fontWeight="600">
              <TokenIcon
                symbol={collateralType?.symbol ?? params.collateralSymbol}
                width={16}
                height={16}
              />
              {collateralType?.displaySymbol ?? params.collateralSymbol}
            </Text>
          </BorderBox>
          <Flex fontSize="xs" color="whiteAlpha.700">
            <Amount prefix="Available: " value={maxAmount} />
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
                .mul(poolInfo?.exchangeRate || '1')
                .mul(1)}
            />
          </Flex>
        </Flex>
      </BorderBox>

      <Button
        type="submit"
        isDisabled={
          !(amount.gt(0) && !overAvailableBalance && collateralType && amount.lte(maxAmount))
        }
        onClick={handleSubmit}
        isLoading={isLoading}
      >
        {amount.lte(0) ? 'Enter Amount' : 'Withdraw'}
      </Button>
    </>
  );
};
