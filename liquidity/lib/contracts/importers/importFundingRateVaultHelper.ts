import formatHumanReadableAbi from '@snx-v3/format/human-readable-abi';
import abi from '../abis/funding-rate-vault-helper-abi.json';

const ADDRESS = '0xd7dB65427e8a80649f057249F681f4c330C4A081';

export async function importFundingRateVaultHelper(
  chainId?: number,
  preset?: string
): Promise<{ address: string; abi: string[] }> {
  const deployment = `${Number(chainId).toFixed(0)}-${preset}`;

  switch (deployment) {
    case '8453-andromeda': {
      return {
        address: ADDRESS,
        abi: formatHumanReadableAbi(abi),
      };
    }
    default: {
      throw new Error(`Unsupported deployment ${deployment} for FundingRateVaultHelper`);
    }
  }
}
