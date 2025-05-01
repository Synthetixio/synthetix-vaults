import formatHumanReadableAbi from '@snx-v3/format/human-readable-abi';
import fundingRateVaultAbi from '../abis/funding-rate-vault-abi.json';

export async function importPositionManagerDeltaNeutralETH(
  chainId?: number,
  preset?: string
): Promise<{ address: string; abi: string[] }> {
  const deployment = `${Number(chainId).toFixed(0)}-${preset}`;

  switch (deployment) {
    case '8453-andromeda': {
      return {
        address: '0xE51cc84D89b01dD3189458f5bDc69d9877f77119',
        abi: formatHumanReadableAbi(fundingRateVaultAbi),
      };
    }
    default: {
      throw new Error(`Unsupported deployment ${deployment} for PositionManagerDeltaNeutralETH`);
    }
  }
}
