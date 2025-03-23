const abi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function asset() pure returns (address assetTokenAddress)',
  'function totalSupply() view returns (uint256)',
  'function totalAssets() view returns (uint256)',
  'function totalAssetsCap() view returns (uint256)',
  'function performanceFee() view returns (uint256)',
  'function exchangeRate() view returns (uint256)',
  'function deposit(uint256, address)',
  'function redeem(uint256, address, address)',
];

export async function importPositionManagerDeltaNeutralBTC(
  chainId?: number,
  preset?: string
): Promise<{ address: string; abi: string[] }> {
  const deployment = `${Number(chainId).toFixed(0)}-${preset}`;
  switch (deployment) {
    case '8453-andromeda': {
      // https://basescan.org/address/0xa6618dB1b8a869c3f2476dE116e861D818Bd2369#code
      return { address: '0xa6618dB1b8a869c3f2476dE116e861D818Bd2369', abi };
    }
    default: {
      throw new Error(`Unsupported deployment ${deployment} for PositionManagerDeltaNeutralBTC`);
    }
  }
}
