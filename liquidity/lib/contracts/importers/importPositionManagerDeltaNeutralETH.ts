const abi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function asset() pure returns (address assetTokenAddress)',
  'function totalSupply() view returns (uint256)',
  'function totalAssets() view returns (uint256)',
  'function totalAssetsCap() view returns (uint256)',
  'function performanceFee() view returns (uint256)',
  'function exchangeRate() view returns (uint256)',
];
export async function importPositionManagerDeltaNeutralETH(
  chainId?: number,
  preset?: string
): Promise<{ address: string; abi: string[] }> {
  const deployment = `${Number(chainId).toFixed(0)}-${preset}`;
  switch (deployment) {
    case '8453-andromeda': {
      // https://basescan.org/address/0x038c33792237F1575136110480142073129bB7e6#code
      return { address: '0x038c33792237F1575136110480142073129bB7e6', abi };
    }
    default: {
      throw new Error(`Unsupported deployment ${deployment} for PositionManagerDeltaNeutralETH`);
    }
  }
}
