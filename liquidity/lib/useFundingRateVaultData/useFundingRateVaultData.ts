import { useNetwork, useProviderForChain, useWallet } from '@snx-v3/useBlockchain';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useFundingRateVaultHelper } from '../contracts/useFundingRateVaultHelper';
import getFundingRateVaultMetadata, {
  FundingRateVaultMetadata,
} from '../../ui/src/data/funding-rate-vault-metadata';

export interface FundingRateVaultData extends FundingRateVaultMetadata {
  address: string;
  totalSupply: number;
  balanceOf: number;
  name: string;
  symbol: string;
  decimals: number;
  asset: string;
  totalAssets: number;
  exchangeRate: number;
  totalAssetsCap: number;
  maxAssetTransactionSize: number;
  minAssetTransactionSize: number;
  managementFee: number;
  keeperFee: number;
  performanceFee: number;
  depositFee: number;
  redemptionFee: number;
  maxRedemptionPercent: number;
  feesRecipient: string;
  paused: boolean;
  accountId: number;
  slippageBuffer: number;
}

export const useFundingRateVaultData = (fundingRateVaultAddress?: string) => {
  const { activeWallet } = useWallet();
  const { network } = useNetwork();
  const provider = useProviderForChain(network);
  const { data: FundingRateVaultHelper } = useFundingRateVaultHelper();
  const walletAddress = activeWallet?.address;

  return useQuery({
    enabled: Boolean(
      walletAddress && fundingRateVaultAddress && provider && FundingRateVaultHelper
    ),
    queryKey: [
      `${network?.id}-${network?.preset}`,
      'FundingRateVaultData',
      { accountAddress: walletAddress, fundingRateVaultAddress },
    ],
    queryFn: async () => {
      if (!(walletAddress && fundingRateVaultAddress && provider && FundingRateVaultHelper)) {
        throw 'OMFG';
      }

      const FundingRateVaultHelperContract = new ethers.Contract(
        FundingRateVaultHelper.address,
        FundingRateVaultHelper.abi,
        provider
      );

      let data: FundingRateVaultData =
        await FundingRateVaultHelperContract.getData(fundingRateVaultAddress);

      const metadata = getFundingRateVaultMetadata(fundingRateVaultAddress);

      if (!metadata) {
        throw new Error(`No metadata found for vault ${fundingRateVaultAddress}`);
      }

      data = {
        ...data,
        address: fundingRateVaultAddress,
        ...metadata,
      };

      return data;
    },
    refetchInterval: 120_000,
  });
};
