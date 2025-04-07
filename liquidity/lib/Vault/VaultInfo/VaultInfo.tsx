import { BorderBox } from '@snx-v3/BorderBox';
import { useParams, VaultPositionPageSchemaType } from '@snx-v3/useParams';
import { useMemo } from 'react';
import { usePositionManagerDeltaNeutralETH } from '../../contracts/usePositionManagerDeltaNeutralETH';
import { usePositionManagerDeltaNeutralBTC } from '../../contracts/usePositionManagerDeltaNeutralBTC';
import { useStrategyPoolInfo } from '../../useStrategyPoolInfo';
import { PositionTitle } from '@snx-v3/Manage';
import { Text, Flex } from '@chakra-ui/react';
import { StatsCard } from '../VaultPositionStats/StatsCard';
import { Amount } from '@snx-v3/Amount';
import { wei } from '@synthetixio/wei';

export const VaultInfo = () => {
  const [params] = useParams<VaultPositionPageSchemaType>();

  const { data: DeltaNeutralETH } = usePositionManagerDeltaNeutralETH();
  const { data: DeltaNeutralBTC } = usePositionManagerDeltaNeutralBTC();

  const deltaNeutral = useMemo(() => {
    if (params.symbol === 'BTC Delta Neutral') {
      return DeltaNeutralBTC;
    }
    if (params.symbol === 'ETH Delta Neutral') {
      return DeltaNeutralETH;
    }
  }, [DeltaNeutralBTC, DeltaNeutralETH, params.symbol]);

  const { data: poolInfo } = useStrategyPoolInfo(deltaNeutral?.address);

  return (
    <BorderBox alignSelf="self-start" flex={1} border="none" flexDir="column" p={6} gap={6}>
      <Flex direction="column" gap={6}>
        <PositionTitle isVault />

        <Text color="gray.500" fontSize="14px" fontWeight={400}>
          A USDC-denominated vault on Base. Deposits are swapped for wstETH on Aerodrome, then
          deposits onto Synthetix Perps V3 to collateralise a short ETH perpetual derivative
          position of the equivalent size. The strategy therefore earns both the Lido staking yield
          (always positive) and the ETH perpetual funding rate on Perps V3.
        </Text>

        <Flex gap={6}>
          <StatsCard
            label="Total Value Locked"
            value={
              <Amount
                fontSize="24px"
                fontWeight="medium"
                prefix="$"
                value={wei(poolInfo?.totalAssets || '0').mul(poolInfo?.exchangeRate || '1')}
              />
            }
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          />
          <StatsCard
            label="28d APR"
            value={<Amount fontSize="24px" fontWeight="medium" suffix="%" value={wei('55')} />}
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          />
        </Flex>
      </Flex>
    </BorderBox>
  );
};
