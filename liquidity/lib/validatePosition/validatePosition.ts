import { calculateCRatio } from '@snx-v3/calculations';
import { Wei, wei } from '@synthetixio/wei';

export const validatePosition = ({
  issuanceRatioD18,
  collateralAmount,
  availableCollateral,
  collateralPrice,
  debt,
  collateralChange,
  debtChange,
}: {
  issuanceRatioD18?: Wei;
  collateralAmount?: Wei;
  availableCollateral?: Wei;
  collateralPrice?: Wei;
  debt?: Wei;
  collateralChange: Wei;
  debtChange: Wei;
}) => {
  const targetCRatio = issuanceRatioD18 ? issuanceRatioD18 : wei(1);
  const newDebt = wei(debt || 0).add(debtChange);
  const newCollateralAmount = wei(collateralAmount || 0).add(collateralChange);
  const newCollateralValue = newCollateralAmount.mul(collateralPrice || 0);
  const newAvailableCollateral = wei(availableCollateral || 0).sub(
    collateralChange.gte(0) ? wei(0) : collateralChange
  );

  const newCRatio = calculateCRatio(newDebt, newCollateralValue);

  const maybeMaxDebt = wei(newCollateralAmount)
    .mul(collateralPrice || 0)
    .div(targetCRatio)
    .sub(debt || 0);

  const maxDebt = maybeMaxDebt.gte(0) ? maybeMaxDebt : wei(0);

  const isValid =
    (debtChange.lte(0) && collateralChange.gte(0)) ||
    ((newCRatio.gte(targetCRatio) || newCRatio.lte(0)) &&
      (newDebt.lte(0) || newCollateralAmount.gt(0)));

  return {
    isValid,
    hasChanges: !collateralChange.eq(0) || !debtChange.eq(0),
    newCRatio,
    newDebt,
    newCollateralAmount,
    newAvailableCollateral,
    maxDebt,
  };
};
