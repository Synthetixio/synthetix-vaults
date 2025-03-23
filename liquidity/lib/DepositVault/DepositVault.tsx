import { Text, Flex, Button } from '@chakra-ui/react';
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
import { usePositionManagerDeltaNeutralETH } from '../contracts/usePositionManagerDeltaNeutralETH';
import { usePositionManagerDeltaNeutralBTC } from '../contracts/usePositionManagerDeltaNeutralBTC';
import { useApprove } from '@snx-v3/useApprove';
import { parseUnits } from '@snx-v3/format';
import { ethers } from 'ethers';
import { useNetwork, useProvider, useSigner } from '@snx-v3/useBlockchain';
import { withERC7412 } from '@snx-v3/withERC7412';
import debug from 'debug';

const log = debug('snx:DepositVault');

export const DepositVault = () => {
  const [params] = useParams<VaultPositionPageSchemaType>();
  const [amount, setAmount] = useState(ZEROWEI);
  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { network } = useNetwork();
  const signer = useSigner();
  const provider = useProvider();
  const { data: USDCToken } = useUSDC();
  const { data: DeltaNeutralETH } = usePositionManagerDeltaNeutralETH();
  const { data: DeltaNeutralBTC } = usePositionManagerDeltaNeutralBTC();

  const { data: usdcBalance } = useTokenBalance(USDCToken?.address);
  const deltaNeutral = useMemo(() => {
    if (params.symbol === 'BTC Delta Neutral') {
      return DeltaNeutralBTC;
    }
    if (params.symbol === 'ETH Delta Neutral') {
      return DeltaNeutralETH;
    }
  }, [DeltaNeutralBTC, DeltaNeutralETH, params.symbol]);

  const overAvailableBalance = amount.gt(usdcBalance || ZEROWEI);

  const { approve, requireApproval } = useApprove({
    contractAddress: USDCToken?.address,
    amount: parseUnits(amount.toString(), 6),
    spender: deltaNeutral?.address,
  });

  const handleSubmit = async () => {
    if (!(deltaNeutral && provider && network && signer)) {
      return;
    }

    if (requireApproval) {
      return approve(false);
    }

    const contract = new ethers.Contract(deltaNeutral?.address, deltaNeutral?.abi, signer);
    const walletAddress = await signer.getAddress();

    const depositTx = await contract.populateTransaction.deposit(
      parseUnits(amount.toString(), 6).toString(),
      walletAddress
    );

    const { multicallTxn: erc7412Tx, gasLimit } = await withERC7412(
      provider,
      network,
      [depositTx],
      'depositVault',
      walletAddress
    );

    const txn = await signer.sendTransaction({
      ...erc7412Tx,
      gasLimit: gasLimit.mul(15).div(10),
    });
    log('txn', txn);

    const receipt = await provider.waitForTransaction(txn.hash);
    log('receipt', receipt);
  };
  return (
    <BorderBox flexDir="column" p={4}>
      <Text color="gray./50" fontSize="sm" fontWeight="700" mb="3">
        Deposit and Lock Collateral
      </Text>
      <BorderBox w="100%" display="flex" p={3} mb="6">
        <Flex alignItems="flex-start" flexDir="column" gap="1">
          <BorderBox display="flex" py={1.5} px={2.5}>
            <Text display="flex" gap={2} alignItems="center" fontWeight="600">
              <TokenIcon
                symbol={collateralType?.symbol ?? params.collateralSymbol}
                width={16}
                height={16}
              />
              {collateralType?.displaySymbol ?? params.collateralSymbol}
            </Text>
          </BorderBox>
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
      >
        {amount.lte(0) ? 'Enter Amount' : 'Deposit and Lock Collateral'}
      </Button>
    </BorderBox>
  );
};
