import formatHumanReadableAbi from '@snx-v3/format/human-readable-abi';
import abi from '../abis/funding-rate-vault-helper-abi.json';

const ADDRESS = '0xC9179E7B3BCFc818322A647C1562FCFa6fF272F7';

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
