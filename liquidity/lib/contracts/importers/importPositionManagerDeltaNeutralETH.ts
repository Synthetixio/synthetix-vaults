import formatHumanReadableAbi from '../../format/human-readable-abi';
import fundingRateVaultAbi from '../abis/funding-rate-vault-abi.json';

export async function importPositionManagerDeltaNeutralETH(
  chainId?: number,
  preset?: string
): Promise<{ address: string; abi: string[] }> {
  const deployment = `${Number(chainId).toFixed(0)}-${preset}`;

  switch (deployment) {
    case '8453-andromeda': {
      // https://basescan.org/address/0x038c33792237F1575136110480142073129bB7e6#code
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
