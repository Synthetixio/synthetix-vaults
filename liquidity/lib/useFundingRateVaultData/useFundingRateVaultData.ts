import { useNetwork, useProviderForChain, useWallet } from '@snx-v3/useBlockchain';
import { useQuery } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';
import { useFundingRateVaultHelper } from '../contracts/useFundingRateVaultHelper';
import getFundingRateVaultMetadata, {
  FundingRateVaultMetadata,
} from '../../ui/src/data/funding-rate-vault-metadata';
import vaultAbi from '../contracts/abis/funding-rate-vault-abi.json';
import { wei } from '@synthetixio/wei';

const SECONDS_PER_BLOCK = 2;
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_YEAR = SECONDS_PER_DAY * 365;

export interface FundingRateVaultData extends FundingRateVaultMetadata {
  address: string;
  totalSupply: BigNumber;
  balanceOf: BigNumber;
  name: string;
  symbol: string;
  decimals: BigNumber;
  asset: string;
  totalAssets: BigNumber;
  exchangeRate: BigNumber;
  totalAssetsCap: BigNumber;
  maxAssetTransactionSize: BigNumber;
  minAssetTransactionSize: BigNumber;
  managementFee: BigNumber;
  keeperFee: BigNumber;
  performanceFee: BigNumber;
  depositFee: BigNumber;
  redemptionFee: BigNumber;
  maxRedemptionPercent: BigNumber;
  feesRecipient: string;
  paused: boolean;
  accountId: BigNumber;
  slippageBuffer: BigNumber;
  apr7d: number;
  apr30d: number;
  apr90d: number;
  apr1y: number;
}

export const useFundingRateVaultData = (fundingRateVaultAddress?: string) => {
  const { activeWallet } = useWallet();
  const { network } = useNetwork();
  const provider = useProviderForChain(network);
  const { data: FundingRateVaultHelper } = useFundingRateVaultHelper();
  const walletAddress = activeWallet?.address;

  return useQuery({
    enabled: Boolean(
      walletAddress && fundingRateVaultAddress && FundingRateVaultHelper && provider
    ),
    queryKey: [
      `${network?.id}-${network?.preset}-${activeWallet?.address}`,
      'FundingRateVaultData',
      { accountAddress: walletAddress, fundingRateVaultAddress },
    ],
    queryFn: async () => {
      if (!(walletAddress && fundingRateVaultAddress && FundingRateVaultHelper && provider)) {
        throw 'OMFG';
      }

      const FundingRateVaultHelperContract = new ethers.Contract(
        FundingRateVaultHelper.address,
        FundingRateVaultHelper.abi,
        provider
      );

      let data: FundingRateVaultData = await FundingRateVaultHelperContract.getData(
        fundingRateVaultAddress,
        walletAddress
      );

      const metadata = getFundingRateVaultMetadata(fundingRateVaultAddress);

      if (!metadata) {
        throw new Error(`No metadata found for vault ${fundingRateVaultAddress}`);
      }

      const currentBlock = await provider.getBlock('latest');

      const VaultContract = new ethers.Contract(fundingRateVaultAddress, vaultAbi, provider);
      // TODO: Change these back to 7, 30, 90, 365
      const aprs = await Promise.all(
        [1, 2, 3, 7].map(async (days) => {
          const seconds = days * SECONDS_PER_DAY;
          const blocks = seconds / SECONDS_PER_BLOCK;
          const blockNumber = currentBlock.number - blocks;
          if (blockNumber < metadata.deployedBlock) {
            return 0;
          }

          try {
            const exchangeRate: BigNumber = await VaultContract.exchangeRate({
              blockTag: blockNumber,
            });
            const exchangeRateIncrease =
              wei(data.exchangeRate).toNumber() - wei(exchangeRate).toNumber();
            const apr = (1 + exchangeRateIncrease) ** (SECONDS_PER_YEAR / seconds) - 1;
            return apr;
          } catch (e) {
            console.error('Error fetching block data:', e);
            return 0;
          }
        })
      );

      data = {
        ...data,
        address: fundingRateVaultAddress,
        ...metadata,
        apr7d: aprs[0],
        apr30d: aprs[1],
        apr90d: aprs[2],
        apr1y: aprs[3],
      };

      return data;
    },
    refetchInterval: 120_000,
  });
};
