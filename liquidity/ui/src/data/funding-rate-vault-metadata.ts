import { ContractInterface } from 'ethers';

import abi from '../../../lib/contracts/abis/funding-rate-vault-abi.json';

export interface AssetData {
  symbol: string;
  decimals: number;
}

export interface FundingRateVaultMetadata {
  description: string;
  abi: ContractInterface;
  perpsMarket: string;
  deployedBlock: number;
  assetData: Record<string, AssetData>;
}

export const FUNDING_RATE_VAULT_METADATA: Record<string, FundingRateVaultMetadata> = {
  '0xE51cc84D89b01dD3189458f5bDc69d9877f77119': {
    description:
      'A USDC-denominated vault on Base. Deposits are swapped for cbETH on Aerodrome, then deposited onto Synthetix Perps V3 to collateralise a short ETH perpetual derivative position of the equivalent size. The strategy therefore earns both the Coinbase staking yield (always positive) and the ETH perpetual funding rate on Perps V3.',
    abi,
    perpsMarket: 'ETH',
    deployedBlock: 29_014_954,
    assetData: {
      '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913': {
        symbol: 'USDC',
        decimals: 6,
      },
      '0x4200000000000000000000000000000000000006': {
        symbol: 'WETH',
        decimals: 18,
      },
      '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22': {
        symbol: 'cbETH',
        decimals: 18,
      },
      '0xc302f3f74ec19d0917C7F19Bca6775f7000a292a': {
        symbol: 'scbETH',
        decimals: 18,
      },
    },
  },
};

const getFundingRateVaultMetadata = (
  fundingRateVaultAddress: string
): FundingRateVaultMetadata | undefined => {
  return FUNDING_RATE_VAULT_METADATA[fundingRateVaultAddress];
};

export default getFundingRateVaultMetadata;
