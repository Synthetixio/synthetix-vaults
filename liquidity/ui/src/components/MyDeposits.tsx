import { Text } from '@chakra-ui/react';
import { Amount } from '@snx-v3/Amount';
import { StatsBox } from '@snx-v3/StatsBox';
import { useWallet } from '@snx-v3/useBlockchain';
import { useLiquidityPositions } from '@snx-v3/useLiquidityPositions';
import { useParams } from '@snx-v3/useParams';
import { useStrategyPoolsList } from '@snx-v3/useStrategyPoolsList';
import Wei, { wei } from '@synthetixio/wei';
import React from 'react';
import { FundingRateVaultData } from '../../../lib/useFundingRateVaultData';
import { BigNumber } from 'ethers';

export function MyDeposits() {
  const [params] = useParams();
  const { activeWallet } = useWallet();

  const { data: liquidityPositions, isPending: isPendingLiquidityPositions } =
    useLiquidityPositions({
      accountId: params.accountId,
    });

  const strategyPoolsList = useStrategyPoolsList();

  const lpTotalLocked = React.useMemo(
    () =>
      liquidityPositions
        ? liquidityPositions.reduce(
            (result, liquidityPosition) =>
              result.add(liquidityPosition.collateralAmount.mul(liquidityPosition.collateralPrice)),
            wei(0)
          )
        : wei(0),
    [liquidityPositions]
  );
  const fundingRateTotalLocked = React.useMemo(
    () =>
      strategyPoolsList
        ? strategyPoolsList.reduce(
            (result: Wei, strategyPool: FundingRateVaultData) =>
              result.add(
                strategyPool.balanceOf
                  .mul(strategyPool.exchangeRate)
                  .div(BigNumber.from(10).pow(18))
              ),
            wei(0)
          )
        : wei(0),
    [strategyPoolsList]
  );

  const totalLocked = React.useMemo(() => {
    return lpTotalLocked.add(fundingRateTotalLocked);
  }, [lpTotalLocked, fundingRateTotalLocked]);

  return (
    <StatsBox
      title="Total Value of My Deposits"
      isLoading={!(!params.accountId || (params.accountId && !isPendingLiquidityPositions))}
      value={activeWallet && totalLocked ? <Amount prefix="$" value={totalLocked} /> : '-'}
      label={
        <>
          <Text textAlign="left">All assets locked in positions</Text>
        </>
      }
    />
  );
}
