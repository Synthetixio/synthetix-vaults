import { wei } from '@synthetixio/wei';
import { validatePosition } from './validatePosition';
test('handles undefined values', () => {
  const result = validatePosition({
    issuanceRatioD18: undefined,
    collateralAmount: undefined,
    availableCollateral: undefined,
    collateralPrice: undefined,
    debt: undefined,
    collateralChange: wei(0),
    debtChange: wei(0),
  });
  expect(result).toEqual({
    isValid: true,
    hasChanges: false,
    newCRatio: wei(0),
    newCollateralAmount: wei(0),
    newAvailableCollateral: wei(0),
    newDebt: wei(0),
    maxDebt: wei(0),
  });
});
test('handles no changes', () => {
  const result = validatePosition({
    issuanceRatioD18: wei(3),
    collateralAmount: wei(10),
    availableCollateral: wei(5),
    collateralPrice: wei(2),
    debt: wei(1),
    collateralChange: wei(0),
    debtChange: wei(0),
  });
  expect(result).toEqual({
    isValid: true,
    hasChanges: false,
    newCRatio: wei(20),
    newCollateralAmount: wei(10),
    newAvailableCollateral: wei(5),
    newDebt: wei(1),
    maxDebt: wei('5.666666666666666666'),
  });
});
test('handles no debt and no changes', () => {
  const result = validatePosition({
    issuanceRatioD18: wei(3),
    collateralAmount: wei(10),
    availableCollateral: wei(5),
    collateralPrice: wei(2),
    debt: wei(0),
    collateralChange: wei(0),
    debtChange: wei(0),
  });
  expect(result).toEqual({
    isValid: true,
    hasChanges: false,
    newCRatio: wei(0),
    newCollateralAmount: wei(10),
    newAvailableCollateral: wei(5),
    newDebt: wei(0),
    maxDebt: wei('6.666666666666666666'),
  });
});
test('handles debt increase from no debt', () => {
  const result = validatePosition({
    issuanceRatioD18: wei(3),
    collateralAmount: wei(10),
    availableCollateral: wei(5),
    collateralPrice: wei(2),
    debt: wei(0),
    collateralChange: wei(0),
    debtChange: wei(2),
  });
  expect(result).toEqual({
    isValid: true,
    hasChanges: true,
    newCRatio: wei(10),
    newCollateralAmount: wei(10),
    newAvailableCollateral: wei(5),
    newDebt: wei(2),
    maxDebt: wei('6.666666666666666666'),
  });
});
test('handles debt increase with existing debt', () => {
  const result = validatePosition({
    issuanceRatioD18: wei(3),
    collateralAmount: wei(10),
    availableCollateral: wei(5),
    collateralPrice: wei(2),
    debt: wei(1),
    collateralChange: wei(0),
    debtChange: wei(1),
  });
  expect(result).toEqual({
    isValid: true,
    hasChanges: true,
    newCRatio: wei(10),
    newCollateralAmount: wei(10),
    newAvailableCollateral: wei(5),
    newDebt: wei(2),
    maxDebt: wei('5.666666666666666666'),
  });
});
test('handles debt decrease with existing debt', () => {
  const result = validatePosition({
    issuanceRatioD18: wei(3),
    collateralAmount: wei(10),
    availableCollateral: wei(5),
    collateralPrice: wei(2),
    debt: wei(1),
    collateralChange: wei(0),
    debtChange: wei(-1),
  });
  expect(result).toEqual({
    isValid: true,
    hasChanges: true,
    newCRatio: wei(0),
    newCollateralAmount: wei(10),
    newAvailableCollateral: wei(5),
    newDebt: wei(0),
    maxDebt: wei('5.666666666666666666'),
  });
});
test('handles collateral deposited with no collateral', () => {
  const result = validatePosition({
    issuanceRatioD18: wei(3),
    collateralAmount: wei(0),
    availableCollateral: wei(0),
    collateralPrice: wei(0),
    debt: wei(0),
    collateralChange: wei(10),
    debtChange: wei(0),
  });
  expect(result).toEqual({
    isValid: true,
    hasChanges: true,
    newCRatio: wei(0),
    newCollateralAmount: wei(10),
    newAvailableCollateral: wei(0),
    newDebt: wei(0),
    maxDebt: wei(0),
  });
});
test('handles collateral deposit with existing collateral', () => {
  const result = validatePosition({
    issuanceRatioD18: wei(3),
    collateralAmount: wei(10),
    availableCollateral: wei(5),
    collateralPrice: wei(0),
    debt: wei(0),
    collateralChange: wei(10),
    debtChange: wei(0),
  });
  expect(result).toEqual({
    isValid: true,
    hasChanges: true,
    newCRatio: wei(0),
    newCollateralAmount: wei(20),
    newAvailableCollateral: wei(5),
    newDebt: wei(0),
    maxDebt: wei(0),
  });
});
test('handles collateral withdrawal ', () => {
  const result = validatePosition({
    issuanceRatioD18: wei(3),
    collateralAmount: wei(10),
    availableCollateral: wei(5),
    collateralPrice: wei(0),
    debt: wei(0),
    collateralChange: wei(-10),
    debtChange: wei(0),
  });
  expect(result).toEqual({
    isValid: true,
    hasChanges: true,
    newCRatio: wei(0),
    newCollateralAmount: wei(0),
    newAvailableCollateral: wei(15),
    newDebt: wei(0),
    maxDebt: wei(0),
  });
});
test('handles collateral withdrawal for more than we have deposited', () => {
  const result = validatePosition({
    issuanceRatioD18: wei(3),
    collateralAmount: wei(10),
    collateralPrice: wei(0),
    debt: wei(10),
    collateralChange: wei(-30),
    debtChange: wei(0),
  });
  expect(result).toEqual({
    isValid: false,
    hasChanges: true,
    newCRatio: wei(0),
    newCollateralAmount: wei(-20),
    newAvailableCollateral: wei(30),
    newDebt: wei(10),
    maxDebt: wei(0),
  });
});
