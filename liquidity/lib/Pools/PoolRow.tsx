import { Button, Fade, Flex, Link, Text } from '@chakra-ui/react';
import { formatNumberToUsd, formatNumberToUsdShort } from '@snx-v3/formatters';
import { Sparkles } from '@snx-v3/icons';
import { TokenIcon } from '@snx-v3/TokenIcon';
import { Tooltip } from '@snx-v3/Tooltip';
import { useApr } from '@snx-v3/useApr';
import { useStataUSDCApr } from '@snx-v3/useApr/useStataUSDCApr';
import { Network, NetworkIcon, useNetwork } from '@snx-v3/useBlockchain';
import { CollateralType } from '@snx-v3/useCollateralTypes';
import { useIsAndromedaStataUSDC } from '@snx-v3/useIsAndromedaStataUSDC';
import { LiquidityPositionType } from '@snx-v3/useLiquidityPosition';
import { makeSearch, useParams } from '@snx-v3/useParams';
import { Wei, wei } from '@synthetixio/wei';
import React from 'react';

interface CollateralTypeWithDeposited extends CollateralType {
  collateralDeposited: string;
}

export function PoolRow({
  pool: _pool,
  network,
  collateralType,
  tvl,
  price,
  position,
}: {
  collateralType: CollateralTypeWithDeposited;
  pool: {
    name: string;
    id: string;
  };
  network: Network;
  tvl: number;
  price: Wei;
  position: LiquidityPositionType | undefined;
}) {
  const [params, setParams] = useParams();

  const { data: stataUSDCApr } = useStataUSDCApr(network.id, network.preset);

  const { network: currentNetwork, setNetwork } = useNetwork();

  const isAndromedaStataUSDC = useIsAndromedaStataUSDC({
    tokenAddress: collateralType?.tokenAddress,
    customNetwork: network,
  });

  const { data: apr, isPending: isPendingApr } = useApr(network);
  const positionApr = React.useMemo(() => {
    if (apr && collateralType) {
      return apr.find(
        (item) => item.collateralType.toLowerCase() === collateralType.tokenAddress.toLowerCase()
      );
    }
  }, [apr, collateralType]);

  const collateralValue = React.useMemo(() => {
    if (position) {
      return position.collateralValue.mul(position.collateralPrice);
    }
  }, [position]);

  const unlockedCollateralValue = React.useMemo(() => {
    if (position) {
      return position.availableCollateral.mul(position.collateralPrice);
    }
  }, [position]);

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
        collateralSymbol: collateralType.symbol,
        manageAction: 'deposit',
        accountId: params.accountId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const btnDisabled = !currentNetwork;
  const order = React.useMemo(
    () =>
      wei(collateralType.collateralDeposited, Number(collateralType.decimals), true)
        .mul(price)
        .toNumber()
        .toFixed(0),
    [collateralType.collateralDeposited, collateralType.decimals, price]
  );

  return (
    <Fade in style={{ order }}>
      <Flex
        flexDir="row"
        w="100%"
        border="1px solid"
        borderColor="gray.900"
        rounded="base"
        bg="navy.700"
        py={4}
        px={4}
        gap={4}
        alignItems="center"
      >
        <Flex
          as={Link}
          href={`?${makeSearch({
            page: 'position',
            collateralSymbol: collateralType.symbol,
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
            <TokenIcon w={40} h={40} symbol={collateralType.symbol} />
            <NetworkIcon
              position="absolute"
              right={0}
              bottom={0}
              networkId={network.id}
              size="14px"
            />
          </Flex>
          <Flex flexDirection="column" ml={3} mr="auto">
            <Text
              fontSize="14px"
              color="white"
              fontWeight={700}
              lineHeight="28px"
              fontFamily="heading"
            >
              {collateralType.displaySymbol}
            </Text>
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

        <Flex width="140px" alignItems="center" justifyContent="flex-end">
          <Text
            fontFamily="heading"
            fontSize="14px"
            lineHeight="20px"
            fontWeight={500}
            color="white"
            textAlign="right"
          >
            {formatNumberToUsdShort(tvl, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </Flex>

        <Flex width="140px" alignItems="center" justifyContent="flex-end">
          <Text
            fontFamily="heading"
            fontSize="14px"
            lineHeight="20px"
            fontWeight={500}
            color="white"
          >
            {isPendingApr ? '~' : null}
            {!isPendingApr && positionApr && positionApr.apr28d > 0
              ? (
                  positionApr.apr28d * 100 +
                  (isAndromedaStataUSDC && stataUSDCApr ? stataUSDCApr : 0)
                )
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
                      <Text>
                        {(positionApr.apr28dIncentiveRewards * 100).toFixed(2).concat('%')}
                      </Text>
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
        </Flex>

        <Flex width="140px" direction="column" alignItems="flex-end">
          <Text
            fontFamily="heading"
            fontSize="14px"
            fontWeight={500}
            lineHeight="28px"
            color="white"
          >
            {collateralValue ? formatNumberToUsd(collateralValue.toNumber()) : '-'}
          </Text>
        </Flex>

        <Flex width="140px" direction="column" alignItems="flex-end">
          <Text
            fontFamily="heading"
            fontSize="14px"
            fontWeight={500}
            lineHeight="28px"
            color="white"
          >
            {unlockedCollateralValue ? formatNumberToUsd(unlockedCollateralValue.toNumber()) : '-'}
          </Text>
          {position && unlockedCollateralValue?.gt(0) ? (
            <Link
              color="cyan.500"
              fontFamily="heading"
              fontSize="0.75rem"
              lineHeight="1rem"
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
        </Flex>

        <Flex width="140px" direction="column" alignItems="flex-end">
          <Text
            fontFamily="heading"
            fontSize="14px"
            fontWeight={500}
            lineHeight="20px"
            color="gray.500"
          >
            Debt{' '}
            <Text color="white" as="span">
              {position && position.debt.gt(0) ? formatNumberToUsd(position.debt.toNumber()) : '-'}
            </Text>
          </Text>
          <Text color="gray.500" fontFamily="heading" fontSize="12px" lineHeight="20px">
            Rewards{' '}
            <Text color="green.500" as="span">
              -
            </Text>
          </Text>
        </Flex>

        <Flex minW="120px" flex="1" justifyContent="flex-end">
          <Button
            as={Link}
            href={`?${makeSearch({
              page: 'position',
              collateralSymbol: collateralType.symbol,
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
          >
            {position ? 'Manage' : 'Deposit'}
          </Button>
        </Flex>
      </Flex>
    </Fade>
  );
}
