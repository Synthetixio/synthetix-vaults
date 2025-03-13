import { Flex } from '@chakra-ui/react';
import { BorderBox } from '@snx-v3/BorderBox';
import { calculateCRatio } from '@snx-v3/calculations';
import { D27 } from '@snx-v3/constants';
import { Rewards } from '@snx-v3/Rewards';
import { CRatioBar } from '@snx-v3/CRatioBar';
import { ManagePositionContext } from '@snx-v3/ManagePositionContext';
import { useNetwork } from '@snx-v3/useBlockchain';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { useIsAndromedaStataUSDC } from '@snx-v3/useIsAndromedaStataUSDC';
import { useLiquidityPosition } from '@snx-v3/useLiquidityPosition';
import { type PositionPageSchemaType, useParams } from '@snx-v3/useParams';
import { useStaticAaveUSDCRate } from '@snx-v3/useStaticAaveUSDCRate';
import { validatePosition } from '@snx-v3/validatePosition';
import React from 'react';
import { CollateralStats } from './CollateralStats';
import { DebtStats } from './DebtStats';
import { PnlStats } from './PnlStats';
import { WithdrableBalance } from './WithdrableBalance';

export function ManageStats() {
  const [params] = useParams<PositionPageSchemaType>();
  const { network } = useNetwork();

  const { debtChange, collateralChange } = React.useContext(ManagePositionContext);

  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { data: liquidityPosition } = useLiquidityPosition({
    accountId: params.accountId,
    collateralType,
  });

  const isAndromedaStataUSDC = useIsAndromedaStataUSDC({
    tokenAddress: collateralType?.tokenAddress,
  });
  const { data: stataRate } = useStaticAaveUSDCRate();
  const adjustedCollateralChange = React.useMemo(() => {
    // Temporary adjustment until UI fully moves to show only USDC and avoid stata conversion
    if (isAndromedaStataUSDC && stataRate) {
      return collateralChange.div(stataRate).mul(D27);
    }
    return collateralChange;
  }, [collateralChange, isAndromedaStataUSDC, stataRate]);

  const cRatio = calculateCRatio(liquidityPosition?.debt, liquidityPosition?.collateralValue);
  const { newCRatio, newCollateralAmount, newAvailableCollateral, newDebt, hasChanges } =
    validatePosition({
      issuanceRatioD18: collateralType?.issuanceRatioD18,
      collateralAmount: liquidityPosition?.collateralAmount,
      availableCollateral: liquidityPosition?.availableCollateral,
      collateralPrice: liquidityPosition?.collateralPrice,
      debt: liquidityPosition?.debt,
      collateralChange: adjustedCollateralChange,
      debtChange,
    });

  return (
    <Flex direction="column" gap={6}>
      <Flex flexWrap="wrap" direction={['column', 'row']} gap={6}>
        <CollateralStats newCollateralAmount={newCollateralAmount} hasChanges={hasChanges} />
        {network?.preset === 'andromeda' ? (
          <PnlStats newDebt={newDebt} hasChanges={hasChanges} />
        ) : (
          <DebtStats newDebt={newDebt} hasChanges={hasChanges} />
        )}
      </Flex>
      <WithdrableBalance newAvailableCollateral={newAvailableCollateral} hasChanges={hasChanges} />
      <Rewards />

      {network?.preset === 'andromeda' ? null : (
        <BorderBox py={4} px={6} flexDirection="column" bg="navy.700">
          <CRatioBar
            hasChanges={hasChanges}
            currentCRatio={
              liquidityPosition?.collateralValue.gt(0) && liquidityPosition?.debt.eq(0)
                ? Number.MAX_SAFE_INTEGER
                : cRatio.toNumber() * 100
            }
            liquidationCratio={(collateralType?.liquidationRatioD18?.toNumber() || 0) * 100}
            newCRatio={
              newCollateralAmount.gt(0) && newDebt.eq(0)
                ? Number.MAX_SAFE_INTEGER
                : newCRatio.toNumber() * 100
            }
            targetCratio={(collateralType?.issuanceRatioD18.toNumber() || 0) * 100}
          />
        </BorderBox>
      )}
    </Flex>
  );
}
