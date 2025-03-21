import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Text, Tooltip } from '@chakra-ui/react';
import { BorderBox } from '@snx-v3/BorderBox';
import { ChangeStat } from '@snx-v3/ChangeStat';
import { DebtAmount } from '@snx-v3/DebtAmount';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { useLiquidityPosition } from '@snx-v3/useLiquidityPosition';
import { type LiquidityPositionPageSchemaType, useParams } from '@snx-v3/useParams';
import { type Wei } from '@synthetixio/wei';

export function DebtStats({ newDebt, hasChanges }: { newDebt: Wei; hasChanges: boolean }) {
  const [params] = useParams<LiquidityPositionPageSchemaType>();

  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { data: liquidityPosition, isPending: isPendingLiquidityPosition } = useLiquidityPosition({
    accountId: params.accountId,
    collateralType,
  });

  return (
    <BorderBox p={6} flex="1" flexDirection="row" bg="navy.700">
      <Flex flexDirection="column" width="100%">
        <Flex alignItems="center" mb="4px">
          <Text color="gray.500" fontSize="sm" fontFamily="heading" lineHeight="16px">
            Debt
          </Text>
          <Tooltip
            label={
              <Text>
                Debt consists of:
                <br />
                - Your portion of the pool&apos;s total debt, which fluctuates based on trader
                performance and market conditions
                <br />- The amount you&apos;ve borrowed against your collateral without incurring
                interest
              </Text>
            }
            textAlign="start"
            py={2}
            px={3}
          >
            <Flex height="12px" width="12px" ml="4px" alignItems="center" justifyContent="center">
              <InfoIcon color="gray.500" height="10px" width="10px" />
            </Flex>
          </Tooltip>
        </Flex>
        <Flex width="100%">
          <ChangeStat
            value={liquidityPosition?.debt}
            isPending={Boolean(params.accountId && isPendingLiquidityPosition)}
            newValue={newDebt}
            formatFn={(val?: Wei) => <DebtAmount debt={val} as="span" />}
            hasChanges={hasChanges}
            data-cy="stats debt"
            size="xl"
          />
        </Flex>
      </Flex>
    </BorderBox>
  );
}
