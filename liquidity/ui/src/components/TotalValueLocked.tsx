import { Text } from '@chakra-ui/react';
import { Amount } from '@snx-v3/Amount';
import { StatsBox } from '@snx-v3/StatsBox';
import { useEnrichedPoolsList } from '@snx-v3/usePoolsList';
import { wei } from '@synthetixio/wei';
import React from 'react';

export function TotalValueLocked() {
  const { data: enrichedPools, isPending } = useEnrichedPoolsList();

  const totalLocked = React.useMemo(
    () =>
      enrichedPools
        ? enrichedPools.reduce((result, { totalValue }) => result.add(totalValue), wei(0))
        : undefined,
    [enrichedPools]
  );

  return (
    <StatsBox
      title="Total Value Locked"
      isLoading={isPending}
      value={<Amount prefix="$" value={totalLocked} average />}
      label={
        <>
          <Text textAlign="left">Total Value Locked for all vaults</Text>
        </>
      }
    />
  );
}
