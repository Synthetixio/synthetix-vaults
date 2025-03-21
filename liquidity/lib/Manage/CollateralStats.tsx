import { Flex, Link, Text } from '@chakra-ui/react';
import { Amount } from '@snx-v3/Amount';
import { BorderBox } from '@snx-v3/BorderBox';
import { ChangeStat } from '@snx-v3/ChangeStat';
import { ZEROWEI } from '@snx-v3/constants';
import { currency } from '@snx-v3/format';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { useLiquidityPosition } from '@snx-v3/useLiquidityPosition';
import { makeSearch, type LiquidityPositionPageSchemaType, useParams } from '@snx-v3/useParams';
import { type Wei } from '@synthetixio/wei';

export function CollateralStats({
  newCollateralAmount,
  hasChanges,
}: {
  newCollateralAmount: Wei;
  hasChanges: boolean;
}) {
  const [params, setParams] = useParams<LiquidityPositionPageSchemaType>();
  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { data: liquidityPosition, isPending: isPendingLiquidityPosition } = useLiquidityPosition({
    accountId: params.accountId,
    collateralType,
  });

  return (
    <BorderBox maxW={['100%', '50%']} p={6} flex="1" flexDirection="row" bg="navy.700">
      <Flex
        opacity={!liquidityPosition && !hasChanges ? '40%' : '100%'}
        flexDirection="column"
        width="100%"
      >
        <Flex alignItems="center" mb="4px">
          <Text color="gray.500" fontSize="sm" fontFamily="heading" lineHeight="16px">
            Collateral
          </Text>
        </Flex>
        <Flex width="100%" isTruncated>
          <Flex width="100%" direction="column" gap="1">
            <ChangeStat
              isPending={Boolean(params.accountId && isPendingLiquidityPosition)}
              value={liquidityPosition?.collateralAmount}
              newValue={newCollateralAmount}
              formatFn={(val?: Wei) =>
                `${currency(val ?? ZEROWEI)} ${
                  collateralType?.displaySymbol ?? params.collateralSymbol
                }`
              }
              hasChanges={hasChanges}
              data-cy="stats collateral"
              size="xl"
            />
            {liquidityPosition ? (
              <ChangeStat
                isPending={Boolean(params.accountId && isPendingLiquidityPosition)}
                value={
                  liquidityPosition
                    ? liquidityPosition.collateralAmount.mul(liquidityPosition.collateralPrice)
                    : ZEROWEI
                }
                newValue={newCollateralAmount.mul(liquidityPosition?.collateralPrice ?? ZEROWEI)}
                formatFn={(val?: Wei) => `$${currency(val ?? ZEROWEI)}`}
                size="md"
                hasChanges={hasChanges}
                data-cy="stats collateral value"
                color="gray.500"
              />
            ) : null}
          </Flex>
        </Flex>

        {liquidityPosition && liquidityPosition.totalLocked.gt(0) ? (
          <Flex data-cy="locked amount" mt={4} alignItems="center" gap={2} alignContent="center">
            <Text color="gray.500" fontSize="sm" fontFamily="heading" lineHeight="16px">
              Escrowed
            </Text>{' '}
            <Link
              data-cy="locked amount link"
              color="white"
              fontSize="sm"
              fontFamily="heading"
              lineHeight="16px"
              fontWeight={700}
              ml={1}
              href={`?${makeSearch({
                ...params,
                page: 'position',
                manageAction: 'locked',
              })}`}
              onClick={(e) => {
                e.preventDefault();
                setParams({ ...params, page: 'position', manageAction: 'locked' });
              }}
            >
              <Amount
                value={liquidityPosition.totalLocked}
                suffix={` ${collateralType?.displaySymbol}`}
              />
            </Link>
          </Flex>
        ) : null}
      </Flex>
    </BorderBox>
  );
}
