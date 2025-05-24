import { ArrowUpIcon } from '@chakra-ui/icons';
import { Flex, Heading, Link, Skeleton, Text } from '@chakra-ui/react';
import { formatNumberToUsd } from '@snx-v3/formatters';
import { getStatsUrl } from '@snx-v3/getStatsUrl';
import { TokenIcon } from '@snx-v3/TokenIcon';
import { NetworkIcon, useNetwork } from '@snx-v3/useBlockchain';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { type LiquidityPositionPageSchemaType, useParams } from '@snx-v3/useParams';
import { useVaultsData } from '@snx-v3/useVaultsData';
import React from 'react';

// import { useApr } from '@snx-v3/useApr';

export function PositionTitle({ isVault, name }: { isVault?: boolean; name?: string | null }) {
  const { network } = useNetwork();

  const [params] = useParams<LiquidityPositionPageSchemaType>();
  const { data: collateralType } = useCollateralType(params.collateralSymbol);

  const { data: vaultsData, isPending: isPendingVaultsData } = useVaultsData(network);

  // const { data: aprData, isPending: isAprLoading } = useApr(network);
  // const { collateral: totalCollateral, debt: totalDebt } = React.useMemo(() => {
  //   const zeroValues = { collateral: { value: wei(0), amount: wei(0) }, debt: wei(0) };
  //   if (!vaultsData) return zeroValues;
  //
  //   return vaultsData.reduce((acc, { collateral, debt }) => {
  //     acc.collateral = {
  //       value: acc.collateral.value.add(collateral.value),
  //       amount: acc.collateral.amount.add(collateral.amount),
  //     };
  //     acc.debt = acc.debt.add(debt);
  //     return acc;
  //   }, zeroValues);
  // }, [vaultsData]);

  const vaultData = React.useMemo(() => {
    if (vaultsData && collateralType) {
      return vaultsData.find(
        (item) => item.collateralType.address.toLowerCase() === collateralType.address.toLowerCase()
      );
    }
  }, [collateralType, vaultsData]);

  return (
    <Flex alignItems="top">
      <Flex
        justifyContent="center"
        alignItems="top"
        borderRadius="100%"
        display="flex"
        flexShrink={0}
      >
        <TokenIcon
          symbol={collateralType?.symbol ?? params.collateralSymbol}
          height={64}
          width={64}
          fill="#0B0B22"
          color="#00D1FF"
        />
      </Flex>
      <Flex direction="column" gap={0.5}>
        <Heading
          ml={4}
          mb={1}
          fontWeight="medium"
          fontSize={['24px', '30px']}
          color="white"
          display="flex"
          alignItems="center"
          letterSpacing="tight"
        >
          {name !== undefined ? (
            name !== null ? (
              name
            ) : (
              <Skeleton height="33px" width="350px" />
            )
          ) : (
            `${collateralType?.displaySymbol ?? params.collateralSymbol} Liquidity Position`
          )}
        </Heading>
        <Flex
          ml={4}
          fontWeight={700}
          fontSize="xs"
          color="white"
          alignItems="center"
          gap={2}
          lineHeight="14px"
          flexWrap="wrap"
        >
          <Flex
            mt={0.25}
            alignItems="center"
            color="gray.500"
            fontWeight="500"
            borderWidth={1}
            borderRadius={4}
            px={1}
            py={0.5}
            gap={1}
          >
            <NetworkIcon size="14px" networkId={network?.id} />
            <Text>{network?.label} Network</Text>
          </Flex>
          {!isVault && (
            <Flex
              alignItems="center"
              color="gray.500"
              fontWeight="500"
              borderWidth={1}
              borderRadius={4}
              px={1}
              py={0.5}
              gap={1}
            >
              <Text>TVL</Text>
              <Text>
                {isPendingVaultsData
                  ? '~'
                  : vaultData
                    ? formatNumberToUsd(vaultData.collateral.value.toNumber(), {
                        maximumFractionDigits: 0,
                      })
                    : '-'}
              </Text>
            </Flex>
          )}
          {!isVault && (
            <Flex
              as={Link}
              isExternal
              href={getStatsUrl(network?.id)}
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
              cursor="pointer"
              alignItems="center"
              color="gray.500"
              fontWeight="500"
              borderWidth={1}
              borderRadius={4}
              px={1}
              py={0.5}
              gap={1}
            >
              <Text>More Stats</Text>
              <ArrowUpIcon transform="rotate(45deg)" />
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
