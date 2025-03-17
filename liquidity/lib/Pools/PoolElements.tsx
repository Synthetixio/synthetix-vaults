import { useMemo } from 'react';
import { Button, Flex, Link, Tag, Text, Tooltip } from '@chakra-ui/react';
import { TokenIcon } from '@snx-v3/TokenIcon';
import { Network, NetworkIcon, useNetwork } from '@snx-v3/useBlockchain';
import { LiquidityPositionType } from '@snx-v3/useLiquidityPosition';
import { makeSearch, useParams } from '@snx-v3/useParams';
import { EnrichedPool } from '@snx-v3/usePoolsList';
import { CollateralType } from '@snx-v3/useCollateralTypes';
import { useApr } from '@snx-v3/useApr';
import { Sparkles } from '@snx-v3/icons';
import { useStataUSDCApr } from '@snx-v3/useApr/useStataUSDCApr';
import { useIsAndromedaStataUSDC } from '@snx-v3/useIsAndromedaStataUSDC';
import { formatNumberToUsd } from '@snx-v3/formatters';
import Wei from '@synthetixio/wei';

export interface PoolWithPosition extends EnrichedPool {
  position: LiquidityPositionType | undefined;
}

export interface CollateralTypeWithDeposited extends CollateralType {
  collateralDeposited: string;
}

export function PoolHeader({
  network,
  collateral,
}: {
  network: Network;
  collateral: CollateralTypeWithDeposited;
}) {
  const [params, setParams] = useParams();
  const { network: currentNetwork, setNetwork } = useNetwork();

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (!currentNetwork) {
        return;
      }
      if (currentNetwork.id !== network.id) {
        if (!(await setNetwork(network.id))) {
          return;
        }
      }
      setParams({
        page: 'position',
        collateralSymbol: collateral.symbol,
        manageAction: 'deposit',
        accountId: params.accountId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex
      as={Link}
      href={`?${makeSearch({
        page: 'position',
        collateralSymbol: collateral.symbol,
        manageAction: 'deposit',
        accountId: params.accountId,
      })}`}
      onClick={onClick}
      width="260px"
      alignItems="center"
      textDecoration="none"
      _hover={{ textDecoration: 'none' }}
    >
      <Flex position="relative">
        <TokenIcon width={40} height={40} symbol={collateral.symbol} />
        <NetworkIcon position="absolute" right={0} bottom={0} networkId={network.id} size="14px" />
      </Flex>
      <Flex flexDirection="column" ml={3} mr="auto">
        <Flex gap={1} alignItems="center">
          <Text
            fontSize="16px"
            color="white"
            fontWeight={700}
            lineHeight="24px"
            fontFamily="heading"
          >
            {collateral.displaySymbol}
          </Text>
          <Tag
            size="sm"
            fontSize={10}
            height="16px"
            minHeight="16px"
            px={1}
            backgroundColor="gray.900"
            borderRadius="4px"
            color="gray.500"
            variant="solid"
          >
            LEGACY
          </Tag>
        </Flex>
        <Text
          textTransform="capitalize"
          fontSize="xs"
          color="gray.500"
          fontFamily="heading"
          lineHeight="20px"
        >
          {network.name} Network
        </Text>
      </Flex>
    </Flex>
  );
}

interface PoolAPRProps {
  network: Network;
  collateral: CollateralTypeWithDeposited;
}

export function PoolAPR({ network, collateral }: PoolAPRProps) {
  const { data: apr, isPending: isPendingApr } = useApr(network);
  const { data: stataUSDCApr } = useStataUSDCApr(network.id, network.preset);

  const positionApr = useMemo(() => {
    if (apr && collateral) {
      return apr.find(
        (item) => item.collateralType.toLowerCase() === collateral.tokenAddress.toLowerCase()
      );
    }
  }, [apr, collateral]);

  const isAndromedaStataUSDC = useIsAndromedaStataUSDC({
    tokenAddress: collateral?.tokenAddress,
    customNetwork: network,
  });

  return (
    <Text fontFamily="heading" fontSize="14px" lineHeight="20px" fontWeight={500} color="white">
      {isPendingApr ? '~' : null}
      {!isPendingApr && positionApr && positionApr.apr28d > 0
        ? (positionApr.apr28d * 100 + (isAndromedaStataUSDC && stataUSDCApr ? stataUSDCApr : 0))
            .toFixed(2)
            .concat('%')
        : '-'}
      {!isPendingApr && positionApr && positionApr.apr28d > 0 ? (
        <Tooltip
          label={
            <Flex direction="column">
              <Flex justifyContent="space-between">
                <Text mr={2}>Performance:</Text>
                <Text>{(positionApr.apr28dPerformance * 100).toFixed(2).concat('%')}</Text>
              </Flex>
              <Flex justifyContent="space-between">
                <Text mr={2}>Rewards: </Text>
                <Text>{(positionApr.apr28dIncentiveRewards * 100).toFixed(2).concat('%')}</Text>
              </Flex>
              {isAndromedaStataUSDC && stataUSDCApr ? (
                <Flex justifyContent="space-between">
                  <Text mr={2}>AAVE yield: </Text>
                  <Text>{stataUSDCApr.toFixed(2).concat('%')}</Text>
                </Flex>
              ) : null}
            </Flex>
          }
        >
          <Flex as="span" display="inline">
            <Sparkles w="14px" h="14px" mb={1} ml="0.5px" mt="1px" />
          </Flex>
        </Tooltip>
      ) : null}
    </Text>
  );
}

interface PoolActionButtonProps {
  collateral: CollateralTypeWithDeposited;
  position: LiquidityPositionType | undefined;
  network: Network;
}

export function PoolPerformance({
  position,
  rewardsValue,
}: {
  position: LiquidityPositionType | undefined;
  rewardsValue: Wei;
}) {
  const [params] = useParams();

  const totalRewards = useMemo(() => {
    // if debt is negative, it means that the position is in profit, add the profit to the rewards
    if (position && position.debt.lt(0)) {
      return rewardsValue.sub(position.debt);
    }
    return rewardsValue;
  }, [rewardsValue, position]);

  if (!params.accountId || !position) {
    return '-';
  }
  return (
    <>
      {position.debt.gt(0) && (
        <Text
          fontFamily="heading"
          fontSize="14px"
          fontWeight={500}
          lineHeight="20px"
          color="gray.500"
        >
          Debt{' '}
          <Text color="white" as="span">
            {formatNumberToUsd(position.debt.toNumber())}
          </Text>
        </Text>
      )}

      <Text color="gray.500" fontFamily="heading" fontSize="sm">
        Rewards{' '}
        <Text color={totalRewards.gt(0) ? 'green.500' : 'gray.500'} as="span">
          {totalRewards.gt(0) ? formatNumberToUsd(totalRewards.toNumber()) : '-'}
        </Text>
      </Text>
    </>
  );
}

export function PoolUnlockedCollateralValue({
  position,
}: {
  position: LiquidityPositionType | undefined;
}) {
  const [params, setParams] = useParams();

  const collateralValue = position?.collateralValue.mul(position.collateralPrice);
  const unlockedCollateralValue = position?.availableCollateral.mul(position.collateralPrice);

  return (
    <>
      <Text fontFamily="heading" fontSize="14px" fontWeight={500} color="white">
        {collateralValue ? formatNumberToUsd(collateralValue.toNumber()) : '-'}
      </Text>
      {position && unlockedCollateralValue?.gt(0) ? (
        <Link
          color="cyan.500"
          fontFamily="heading"
          fontSize="xs"
          href={`?${makeSearch({
            page: 'position',
            collateralSymbol: position.collateralType.symbol,
            manageAction: 'withdraw',
            accountId: params.accountId,
          })}`}
          onClick={(e) => {
            e.preventDefault();
            setParams({
              page: 'position',
              collateralSymbol: position.collateralType.symbol,
              manageAction: 'withdraw',
              accountId: params.accountId,
            });
          }}
        >
          Withdraw
        </Link>
      ) : null}
    </>
  );
}

export function PoolActionButton({ collateral, position, network }: PoolActionButtonProps) {
  const [params, setParams] = useParams();
  const { network: currentNetwork, setNetwork } = useNetwork();
  const btnDisabled = !currentNetwork;

  const onClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (!currentNetwork) {
        return;
      }
      if (currentNetwork.id !== network.id) {
        if (!(await setNetwork(network.id))) {
          return;
        }
      }
      setParams({
        page: 'position',
        collateralSymbol: collateral.symbol,
        manageAction: 'deposit',
        accountId: params.accountId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      as={Link}
      href={`?${makeSearch({
        page: 'position',
        collateralSymbol: collateral.symbol,
        manageAction: 'deposit',
        accountId: params.accountId,
      })}`}
      onClick={onClick}
      size="sm"
      height="32px"
      py="10px"
      px={2}
      whiteSpace="nowrap"
      borderRadius="4px"
      fontFamily="heading"
      fontWeight={700}
      fontSize="14px"
      lineHeight="20px"
      color="black"
      textDecoration="none"
      _hover={{ textDecoration: 'none', color: 'black' }}
      isDisabled={btnDisabled}
      _disabled={{
        bg: 'gray.900',
        backgroundImage: 'none',
        color: 'gray.500',
        opacity: 0.5,
        cursor: 'not-allowed',
      }}
      minWidth="96px"
    >
      {position ? 'Manage' : 'Deposit'}
    </Button>
  );
}
