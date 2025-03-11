import { Flex } from '@chakra-ui/react';
import { useEnrichedPoolsList } from '@snx-v3/usePoolsList';
import React from 'react';
import { PoolCardsLoading } from './PoolCardsLoading';
import { PoolRow } from './PoolRow';
import { AutoCompoundingRow } from './AutoCompoundingRow';
import { LiquidityPositionType } from '@snx-v3/useLiquidityPosition';
import { useShowMyPositionsOnly } from '@snx-v3/useShowMyPositionsOnly';
import { useRewardsByCollateralType } from '@snx-v3/useRewards';
import { useParams } from '@snx-v3/useParams';
import { ZEROWEI } from '@snx-v3/constants';

function HeaderText({ ...props }) {
  return (
    <Flex
      color="gray.600"
      fontFamily="heading"
      fontSize="12px"
      lineHeight="16px"
      letterSpacing={0.6}
      fontWeight={700}
      alignItems="center"
      justifyContent="right"
      {...props}
    />
  );
}

export function PoolsList({ positions }: { positions: LiquidityPositionType[] }) {
  const [params] = useParams();

  const { data: rewards, isPending: isPendingRewards } = useRewardsByCollateralType({
    accountId: params.accountId,
  });

  const { data: enrichedPools, isPending } = useEnrichedPoolsList();
  const [myPositionsOnly] = useShowMyPositionsOnly();

  const poolsWithPositions = React.useMemo(() => {
    if (!enrichedPools) {
      return;
    }
    return enrichedPools.map((pool) => {
      const position = positions.find(
        (position) => position.collateralType.tokenAddress === pool.collateral.address
      );
      return {
        ...pool,
        position,
      };
    });
  }, [enrichedPools, positions]);

  const filteredPools = React.useMemo(() => {
    if (!poolsWithPositions) {
      return;
    }
    return poolsWithPositions.filter((pool) => {
      if (myPositionsOnly) {
        return !!pool.position;
      }
      return true;
    });
  }, [poolsWithPositions, myPositionsOnly]);

  return (
    <Flex mt={6} maxW="100%" overflowX="auto" direction="column" gap={4}>
      <Flex flexDir="row" minW="800px" gap={4} py={3} px={4} whiteSpace="nowrap">
        <HeaderText width="260px" justifyContent="left">
          Collateral / Network
        </HeaderText>
        <HeaderText width="140px">Vault TVL</HeaderText>
        <HeaderText width="140px">28d APR</HeaderText>
        <HeaderText width="140px">Deposited</HeaderText>
        <HeaderText width="140px">Unlocked</HeaderText>
        <HeaderText width="140px">Performance</HeaderText>
        <Flex minW="120px" flex="1" />
      </Flex>

      {isPending || isPendingRewards ? <PoolCardsLoading /> : null}
      {!isPending && !isPendingRewards && filteredPools ? (
        <Flex minW="800px" direction="column-reverse" gap={4}>
          {filteredPools?.map(({ network, pool, collateral, totalValue, price, position }) => (
            <PoolRow
              key={`${network.id}-${collateral.address}`}
              pool={pool}
              network={network}
              collateralType={collateral}
              tvl={totalValue}
              price={price}
              position={position}
              rewardsValue={
                rewards?.find((r) => r.collateralType.address === collateral.address)
                  ?.totalRewardsValue ?? ZEROWEI
              }
            />
          ))}
          <AutoCompoundingRow />
        </Flex>
      ) : null}
    </Flex>
  );
}
