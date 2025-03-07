import { Flex, Heading, Text } from '@chakra-ui/react';
import { PoolsList } from '@snx-v3/Pools';
import { PositionsList } from '@snx-v3/Positions';
import { Rewards } from '@snx-v3/Rewards';
import { StatsTotalLocked } from '@snx-v3/StatsTotalLocked';
import { StatsTotalPnl } from '@snx-v3/StatsTotalPnl';
import { Synths } from '@snx-v3/Synths';
import { useNetwork, useWallet } from '@snx-v3/useBlockchain';
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { ConnectBox } from '@snx-v3/ConnectBox';
import { useLiquidityPositions } from '@snx-v3/useLiquidityPositions';
import { useParams } from '@snx-v3/useParams';
import { StakingSection } from './StakingSection';

export function DashboardPage() {
  const { activeWallet } = useWallet();

  const [params] = useParams();
  const { network } = useNetwork();

  const { data: liquidityPositions } = useLiquidityPositions({ accountId: params.accountId });

  const filteredLiquidityPositions = React.useMemo(
    () =>
      liquidityPositions
        ? liquidityPositions.filter((liquidityPosition) => {
            if (liquidityPosition.collateralAmount.gt(0)) {
              // there is some amount delegated
              return true;
            }

            if (liquidityPosition.availableCollateral.gt(0)) {
              // there is some amount deposited and available to withdraw
              return true;
            }

            if (
              network?.preset === 'andromeda' &&
              liquidityPosition.collateralType.displaySymbol === 'USDC' &&
              liquidityPosition.availableSystemToken.gt(0)
            ) {
              // special case for USDC on Andromeda to allow withdrawals of snxUSD
              return true;
            }

            return false;
          })
        : [],
    [liquidityPositions, network?.preset]
  );

  const hasPosition = useMemo(() => {
    return !!activeWallet?.address && filteredLiquidityPositions.length > 0;
  }, [activeWallet, filteredLiquidityPositions]);

  return (
    <>
      <Helmet>
        <title>Synthetix Vaults</title>
        <meta name="description" content="Synthetix Vaults" />
      </Helmet>
      <Flex pt={{ base: 2, sm: 10 }} flexDir="column" mb={16}>
        <Flex columnGap={20} flexWrap="wrap" justifyContent="space-between">
          <Flex flexDirection="column" minWidth={360}>
            <Heading
              mt={[6, 10]}
              color="gray.50"
              maxWidth="40rem"
              fontSize={['2rem', '3rem']}
              lineHeight="120%"
            >
              Vaults
            </Heading>
            <Text color="gray.500" fontSize="1rem" lineHeight={6} fontFamily="heading" mt="1rem">
              Deposit USDC to earn a privileged share of protocol performance
            </Text>
          </Flex>
          <Flex mt={10} gap={4} flex={1}>
            <StatsTotalLocked />
            <StatsTotalPnl />
          </Flex>
        </Flex>
        {!activeWallet && <ConnectBox />}

        {hasPosition && (
          <>
            <Flex mt={12} flexDirection="column" gap={4}>
              <Heading fontSize="1.25rem" fontFamily="heading" lineHeight="1.75rem">
                Positions
              </Heading>
              <PositionsList positions={filteredLiquidityPositions} />
            </Flex>
            <Flex mt={12} flexDirection={['column', 'column', 'row']} gap={4}>
              <Flex
                flex={1}
                flexDirection="column"
                borderColor="gray.900"
                borderWidth="1px"
                borderRadius="5px"
                p={6}
                sx={{
                  borderCollapse: 'separate !important',
                  borderSpacing: 0,
                }}
                bg="navy.700"
              >
                <Rewards />
              </Flex>
            </Flex>
          </>
        )}

        <Flex mt={12} flexDirection="column">
          <Heading fontSize="30px" fontFamily="heading" lineHeight="36px">
            Liquidity
          </Heading>
          <PoolsList />
        </Flex>

        <StakingSection />
        <Synths />
      </Flex>
    </>
  );
}
