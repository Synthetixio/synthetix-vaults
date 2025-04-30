import formatHumanReadableAbi from '@snx-v3/format/human-readable-abi';
import fundingRateVaultAbi from '../abis/funding-rate-vault-abi.json';

export async function importPositionManagerDeltaNeutralBTC(
  chainId?: number,
  preset?: string
): Promise<{ address: string; abi: string[] }> {
  const deployment = `${Number(chainId).toFixed(0)}-${preset}`;
  switch (deployment) {
    case '8453-andromeda': {
      return {
        address: '0x00C95df398f5bcD9d9d5eDA23c3cD996cBb2F785',
        abi: formatHumanReadableAbi(fundingRateVaultAbi),
      };
    }
    default: {
      throw new Error(`Unsupported deployment ${deployment} for PositionManagerDeltaNeutralBTC`);
    }
  }
}
