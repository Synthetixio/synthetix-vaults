import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { EnrichedPool, useEnrichedPoolsList } from '@snx-v3/usePoolsList';
import { useWindowSize } from '@snx-v3/useWindowSize';
import { Tooltip } from '@snx-v3/Tooltip';
import { InfoIcon } from '@chakra-ui/icons';
import { PoolCardsLoading } from './PoolCardsLoading';
import { PoolRow } from './PoolRow';
import { LiquidityPositionType } from '@snx-v3/useLiquidityPosition';
import { useShowMyPositionsOnly } from '@snx-v3/useShowMyPositionsOnly';
import { useRewardsByCollateralType } from '@snx-v3/useRewards';
import { useParams } from '@snx-v3/useParams';
import { ZEROWEI } from '@snx-v3/constants';
import { PoolsListMobile } from './PoolsListMobile';
import Wei from '@synthetixio/wei';

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

export interface PoolWithPosition extends EnrichedPool {
  position: LiquidityPositionType | undefined;
  rewardsValue: Wei;
}

export function PoolsList({ positions }: { positions: LiquidityPositionType[] }) {
  const [params] = useParams();
  const { isMobile } = useWindowSize();

  const { data: rewards } = useRewardsByCollateralType({
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
        rewardsValue:
          rewards?.find((r) => r.collateralType.address === pool.collateral.address)
            ?.totalRewardsValue ?? ZEROWEI,
        position,
      };
    });
  }, [enrichedPools, positions, rewards]);

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

  if (isMobile && filteredPools) {
    return <PoolsListMobile pools={filteredPools} />;
  }
  return (
    <Flex
      maxW="100%"
      overflowX="auto"
      direction="column"
      gap={4}
      p={['4', '6']}
      backgroundColor="navy.700"
      borderRadius="md"
      mt={0}
    >
      <Flex flexDir="row" minW="800px" gap={4} py={3} px={4} whiteSpace="nowrap">
        <HeaderText width="260px" justifyContent="left">
          Vault
        </HeaderText>
        <HeaderText width="140px">Vault TVL</HeaderText>
        <Flex justifyContent="flex-end" alignItems="center" width="140px" color="gray.600">
          <HeaderText fontSize="xs" fontWeight="bold" mr={1}>
            APR
          </HeaderText>
          <Tooltip
            label={
              <Text textAlign="left">
                APR is averaged over the trailing 28 days and is comprised of both performance and
                rewards
              </Text>
            }
          >
            <InfoIcon w="10px" h="10px" />
          </Tooltip>
        </Flex>
        <Flex justifyContent="flex-end" alignItems="center" width="140px" color="gray.600">
          <HeaderText fontSize="xs" fontWeight="bold" mr={1}>
            Deposited
          </HeaderText>
          <Tooltip
            label={
              <Text textAlign="left">
                Deposits can be withdrawn 24h after unlocking or any subsequent account activity
              </Text>
            }
          >
            <InfoIcon w="10px" h="10px" />
          </Tooltip>
        </Flex>
        <Flex justifyContent="flex-end" alignItems="center" width="140px" color="gray.600">
          <HeaderText fontSize="xs" fontWeight="bold" mr={1}>
            Unlocked
          </HeaderText>
          <Tooltip
            label={
              <Text textAlign="left">
                Unlocked assets can be locked into a position at any time or withdrawn after 24h
                since last activity
              </Text>
            }
          >
            <InfoIcon w="10px" h="10px" />
          </Tooltip>
        </Flex>
        <HeaderText width="140px">Performance</HeaderText>
        <Flex minW="120px" flex="1" />
      </Flex>

      {isPending ? <PoolCardsLoading /> : null}
      {!isPending && filteredPools ? (
        <Flex minW="800px" direction="column" gap={4}>
          {filteredPools?.map(
            ({ network, pool, collateral, totalValue, price, rewardsValue, position }) => (
              <PoolRow
                key={`${network.id}-${collateral.address}`}
                pool={pool}
                network={network}
                collateralType={collateral}
                tvl={totalValue}
                price={price}
                position={position}
                rewardsValue={rewardsValue}
              />
            )
          )}
        </Flex>
      ) : null}
    </Flex>
  );
}
