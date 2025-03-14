import React from 'react';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { PoolsList } from '@snx-v3/Pools';
import { Synths } from '@snx-v3/Synths';
import { useNetwork, useWallet } from '@snx-v3/useBlockchain';
import { Helmet } from 'react-helmet';
import { ConnectBox } from '@snx-v3/ConnectBox';
import { useLiquidityPositions } from '@snx-v3/useLiquidityPositions';
import { useParams } from '@snx-v3/useParams';
import { StakingSection } from './StakingSection';
import { MyDeposits, StatsTotalPnl } from './components';
import { TotalValueLocked } from './components/TotalValueLocked';
import { StrategySection } from './StrategySection';
import { MyPositionsOnlyToggle } from './components/MyPositionsOnlyToggle';

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

  return (
    <>
      <Helmet>
        <title>Synthetix Vaults</title>
        <meta name="description" content="Synthetix Vaults" />
      </Helmet>
      <Flex pt={{ base: 2, sm: 10 }} flexDir="column" mb={16}>
        <Flex flexDirection="column" columnGap={20} justifyContent="space-between">
          <Flex flexDirection="column" minWidth={360}>
            <Heading
              mt={[6, 10]}
              color="gray.50"
              maxWidth="40rem"
              fontSize={['2rem', '3rem']}
              lineHeight="120%"
            >
              Synthetix Vaults
            </Heading>
            <Text color="gray.500" fontSize="1rem" lineHeight={6} fontFamily="heading" mt="1rem">
              A selection of high-quality yield products powering the Synthetix Ecosystem. Brought
              to you by Synthetix
            </Text>
          </Flex>
          <Flex mt={6} gap={4} flex={1}>
            <TotalValueLocked />
            <MyDeposits />
            <StatsTotalPnl />
          </Flex>
          {!!activeWallet && (
            <Flex flexDirection="row-reverse">
              <MyPositionsOnlyToggle />
            </Flex>
          )}
        </Flex>

        {!activeWallet && <ConnectBox />}

        <Flex mt={12} flexDirection="column">
          <Heading fontSize="30px" fontFamily="heading" lineHeight="36px">
            Liquidity Providing
          </Heading>
          <Text color="gray.500" fontSize="1rem" lineHeight={6} fontFamily="heading" mt="1rem">
            Provide liquidity to Synthetix Exchange to earn trading fees and liquidation rewards
          </Text>
          <PoolsList positions={filteredLiquidityPositions} />
        </Flex>
        <StrategySection />
        <StakingSection />
        <Synths />
      </Flex>
    </>
  );
}
