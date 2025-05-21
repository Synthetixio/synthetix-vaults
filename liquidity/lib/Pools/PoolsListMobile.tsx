import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { LiquidityPositionType } from '@snx-v3/useLiquidityPosition';
import { EnrichedPool } from '@snx-v3/usePoolsList';
import {
  PoolActionButton,
  PoolAPR,
  PoolHeader,
  PoolPerformance,
  PoolUnlockedCollateralValue,
} from './PoolElements';
import { formatNumberToUsd, formatNumberToUsdShort } from '@snx-v3/formatters';
import { InfoIcon } from '@chakra-ui/icons';
import Wei from '@synthetixio/wei';

function HeaderText({ ...props }) {
  return (
    <Flex
      color="gray.500"
      fontFamily="heading"
      fontSize="12px"
      lineHeight="120%"
      letterSpacing={0.6}
      fontWeight={700}
      alignItems="center"
      {...props}
    />
  );
}

export interface PoolWithPosition extends EnrichedPool {
  position: LiquidityPositionType | undefined;
  rewardsValue: Wei;
}

export function PoolsListMobile({ pools }: { pools: PoolWithPosition[] }) {
  return (
    <Flex direction="column" gap={4} mt={4} p={4} rounded="md" bg="navy.700">
      {pools.map(({ network, position, collateral, rewardsValue, totalValue }) => {
        const collateralValue = position?.collateralValue.mul(position.collateralPrice);
        return (
          <Flex
            key={`${network.id}-${collateral.address}`}
            flexDir="column"
            w="100%"
            rounded="md"
            bg="whiteAlpha.50"
            py={4}
            px={4}
            gap={4}
          >
            <PoolHeader network={network} collateral={collateral} />
            <Flex justifyContent="space-between">
              <HeaderText width="140px">Vault TVL</HeaderText>
              <Text
                fontFamily="heading"
                fontSize="14px"
                lineHeight="20px"
                fontWeight="medium"
                color="white"
              >
                {formatNumberToUsdShort(totalValue, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Flex alignItems="center" width="140px" color="gray.600">
                <HeaderText fontSize="xs" fontWeight="bold" mr={1}>
                  APR
                </HeaderText>
                <Tooltip
                  label={
                    <Text textAlign="left">
                      APR is averaged over the trailing 28 days and is comprised of both performance
                      and rewards
                    </Text>
                  }
                >
                  <InfoIcon w="10px" h="10px" />
                </Tooltip>
              </Flex>
              <PoolAPR network={network} collateral={collateral} />
            </Flex>
            {position && (
              <>
                <Flex justifyContent="space-between">
                  <Flex alignItems="center" width="140px" color="gray.600">
                    <HeaderText fontSize="xs" fontWeight="bold" mr={1}>
                      Deposited
                    </HeaderText>
                    <Tooltip
                      label={
                        <Text textAlign="left">
                          Deposits can be withdrawn 24h after unlocking or any subsequent account
                          activity
                        </Text>
                      }
                    >
                      <InfoIcon w="10px" h="10px" />
                    </Tooltip>
                  </Flex>
                  <Text
                    fontFamily="heading"
                    fontSize="14px"
                    fontWeight="medium"
                    lineHeight="28px"
                    color="white"
                  >
                    {collateralValue ? formatNumberToUsd(collateralValue.toNumber()) : '-'}
                  </Text>
                </Flex>

                <Flex justifyContent="space-between">
                  <Flex alignItems="center" width="140px" color="gray.600">
                    <HeaderText fontSize="xs" fontWeight="bold" mr={1}>
                      Unlocked
                    </HeaderText>
                    <Tooltip
                      label={
                        <Text textAlign="left">
                          Unlocked assets can be locked into a position at any time or withdrawn
                          after 24h since last activity
                        </Text>
                      }
                    >
                      <InfoIcon w="10px" h="10px" />
                    </Tooltip>
                  </Flex>
                  <Flex width="140px" direction="column" alignItems="flex-end">
                    <PoolUnlockedCollateralValue position={position} />
                  </Flex>
                </Flex>

                <Flex justifyContent="space-between">
                  <HeaderText width="140px">Performance</HeaderText>
                  <Flex width="140px" direction="column" alignItems="flex-end">
                    <PoolPerformance position={position} rewardsValue={rewardsValue} />
                  </Flex>
                </Flex>
              </>
            )}
            <PoolActionButton network={network} collateral={collateral} position={position} />
          </Flex>
        );
      })}
    </Flex>
  );
}
