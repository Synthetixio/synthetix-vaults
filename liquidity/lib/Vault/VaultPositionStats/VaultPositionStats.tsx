import { Flex, Text } from '@chakra-ui/react';
import { BorderBox } from '@snx-v3/BorderBox';
import { useParams, VaultPositionPageSchemaType } from '@snx-v3/useParams';
import { useMemo } from 'react';
import { usePositionManagerDeltaNeutralETH } from '../../contracts/usePositionManagerDeltaNeutralETH';
import { usePositionManagerDeltaNeutralBTC } from '../../contracts/usePositionManagerDeltaNeutralBTC';
import { useStrategyPoolPosition } from '../../useStrategyPoolPosition';
import { Amount } from '@snx-v3/Amount';
import Wei, { wei } from '@synthetixio/wei';
import { StatsCard } from './StatsCard';
import { ChangeStat } from '@snx-v3/ChangeStat';
import { currency } from '@snx-v3/format';
import { ZEROWEI } from '@snx-v3/constants';
import { Rewards } from '@snx-v3/Rewards';
import { useStrategyPoolInfo } from '../../useStrategyPoolInfo';

export const VaultPositionStats = () => {
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

  const { data: position } = useStrategyPoolPosition(deltaNeutral?.address);
  const { data: poolInfo } = useStrategyPoolInfo(deltaNeutral?.address);

  return (
    <BorderBox border="none" flexDir="column" p={['4', '6']} gap={6}>
      <Flex gap={6}>
        <StatsCard
          label="Total Value of My Deposits"
          value={
            <Amount
              color="white"
              prefix="$"
              value={wei(position?.balance || '0').mul(poolInfo?.exchangeRate || '0')}
            />
          }
        />

        <StatsCard
          label="My PnL"
          value={<Amount color="green.500" prefix="$" value={wei('231.23')} />}
        />
      </Flex>
      <StatsCard
        label="Collateral"
        value={
          <ChangeStat
            value={wei(position?.balance || '0')}
            newValue={wei(position?.balance || '0').add(1000)}
            formatFn={(val?: Wei) => (
              <Text fontSize="20px" fontWeight={500} lineHeight="28px">
                ${currency(val ?? ZEROWEI)}
              </Text>
            )}
            hasChanges
            size="sm"
          />
        }
      />

      <Rewards bg="whiteAlpha.50" border="none" />
    </BorderBox>
  );
};
