import { Flex } from '@chakra-ui/react';
import { useEnrichedPoolsList } from '@snx-v3/usePoolsList';
import React from 'react';
import { PoolCardsLoading } from './PoolCardsLoading';
import { PoolRow } from './PoolRow';

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

export function PoolsList() {
  const { data: enrichedPools, isPending } = useEnrichedPoolsList();

  return (
    <Flex mt={6} maxW="100%" overflowX="auto" direction="column" gap={4}>
      <Flex flexDir="row" minW="800px" gap={4} py={3} px={4} whiteSpace="nowrap">
        <HeaderText width="260px" justifyContent="left">
          Collateral / Network
        </HeaderText>
        <HeaderText width="240px">Wallet Balance</HeaderText>
        <HeaderText width="240px">TVL</HeaderText>
        <HeaderText width="164px">APR</HeaderText>
        <Flex minW="120px" flex="1" />
      </Flex>

      {isPending ? <PoolCardsLoading /> : null}
      {!isPending && enrichedPools ? (
        <Flex minW="800px" direction="column-reverse" gap={4}>
          {enrichedPools?.map(({ network, pool, collateral, totalValue, price }) => (
            <PoolRow
              key={`${network.id}-${collateral.address}`}
              pool={pool}
              network={network}
              collateralType={collateral}
              tvl={totalValue}
              price={price}
            />
          ))}
        </Flex>
      ) : null}
    </Flex>
  );
}
