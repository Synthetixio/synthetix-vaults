import { Text } from '@chakra-ui/react';
import { Amount } from '@snx-v3/Amount';
import { StatsBox } from '@snx-v3/StatsBox';
import { useWallet } from '@snx-v3/useBlockchain';
import { useLiquidityPositions } from '@snx-v3/useLiquidityPositions';
import { useParams } from '@snx-v3/useParams';
import { wei } from '@synthetixio/wei';
import React from 'react';

export function MyDeposits() {
  const [params] = useParams();
  const { activeWallet } = useWallet();

  const { data: liquidityPositions, isPending: isPendingLiquidityPositions } =
    useLiquidityPositions({
      accountId: params.accountId,
    });

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

  return (
    <StatsBox
      title="Total Value of My Deposits"
      isLoading={!(!params.accountId || (params.accountId && !isPendingLiquidityPositions))}
      value={activeWallet && lpTotalLocked ? <Amount prefix="$" value={lpTotalLocked} /> : '-'}
      label={
        <>
          <Text textAlign="left">All assets locked in positions</Text>
        </>
      }
    />
  );
}
