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

export interface EventType {
  timestamp: Date;
  transactionHash: string;
}

export interface FundingRateVaultDepositEvent extends EventType {
  sender: string;
  owner: string;
  assets: BigNumber;
  shares: BigNumber;
}

export interface FundingRateVaultWithdrawEvent extends EventType {
  sender: string;
  receiver: string;
  owner: string;
  assets: BigNumber;
  shares: BigNumber;
}

export interface FundingRateVaultTradeEvent extends EventType {
  fromAsset: string;
  fromSymbol: string;
  toAsset: string;
  toSymbol: string;
  amountIn: number;
  amountOut: number;
}

export interface FundingRateVaultMarginEvent extends EventType {
  asset: string;
  symbol: string;
  amount: number;
  type: 'added' | 'removed';
}

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
  pnl: number;
  deposits: FundingRateVaultDepositEvent[];
  withdrawals: FundingRateVaultWithdrawEvent[];
  trades: FundingRateVaultTradeEvent[];
  marginEvents: FundingRateVaultMarginEvent[];
}

const getTimeFromBlockNumber = (currentBlock: number, blockNumber: number) => {
  const now = new Date();
  const blocksPast = currentBlock - blockNumber;
  const secondsPast = blocksPast * SECONDS_PER_BLOCK;
  const blockTimestamp = now.getTime() / 1000 - secondsPast;
  return new Date(blockTimestamp * 1000);
};

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

      // Get Vault Data
      const FundingRateVaultHelperContract = new ethers.Contract(
        FundingRateVaultHelper.address,
        FundingRateVaultHelper.abi,
        provider
      );
      let data: FundingRateVaultData = await FundingRateVaultHelperContract.getData(
        fundingRateVaultAddress,
        walletAddress
      );

      // Get Vault Metadata
      const metadata = getFundingRateVaultMetadata(fundingRateVaultAddress);
      if (!metadata) {
        throw new Error(`No metadata found for vault ${fundingRateVaultAddress}`);
      }

      // Get Vault APRs
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

      // Get Vault Deposit events
      const filter = VaultContract.filters.Deposit(null, null);
      const events = await VaultContract.queryFilter(filter);
      const deposits: FundingRateVaultDepositEvent[] = events.map((event) => {
        const { args, transactionHash, blockNumber } = event;
        const { sender, owner, assets, shares } = args as any;
        return {
          sender,
          owner,
          assets: assets,
          shares: shares,
          timestamp: getTimeFromBlockNumber(currentBlock.number, blockNumber),
          transactionHash,
        };
      });

      // Get Vault Withdraw events
      const withdrawFilter = VaultContract.filters.Withdraw(null, null, null);
      const withdrawEvents = await VaultContract.queryFilter(withdrawFilter);
      const withdrawals: FundingRateVaultWithdrawEvent[] = withdrawEvents.map((event) => {
        const { args, transactionHash, blockNumber } = event;

        const { sender, receiver, owner, assets, shares } = args as any;
        return {
          sender,
          receiver,
          owner,
          assets: assets,
          shares: shares,
          timestamp: getTimeFromBlockNumber(currentBlock.number, blockNumber),
          transactionHash,
        };
      });

      // Get Vault Trade events
      const tradeFilter = VaultContract.filters.AssetsSwapped(null, null);
      const tradeEvents = await VaultContract.queryFilter(tradeFilter);
      const trades: FundingRateVaultTradeEvent[] = tradeEvents.map((event) => {
        const { args, transactionHash, blockNumber } = event;
        const { fromAsset, toAsset, amountIn, amountOut } = args as any;
        const fromAssetData = metadata.assetData[fromAsset];
        const toAssetData = metadata.assetData[toAsset];
        if (!fromAssetData) {
          throw new Error(`No asset data found for asset ${fromAsset}`);
        }
        if (!toAssetData) {
          throw new Error(`No asset data found for asset ${toAsset}`);
        }
        return {
          fromAsset,
          fromSymbol: fromAssetData.symbol,
          toAsset,
          toSymbol: toAssetData.symbol,
          amountIn: wei(amountIn, fromAssetData.decimals).toNumber(),
          amountOut: wei(amountOut, toAssetData.decimals).toNumber(),
          timestamp: getTimeFromBlockNumber(currentBlock.number, blockNumber),
          transactionHash,
        };
      });

      // Get Vault Margin events
      const marginAddedFilter = VaultContract.filters.MarginAdded(null, null);
      const marginAddedEvents = await VaultContract.queryFilter(marginAddedFilter);
      const marginAdded: FundingRateVaultMarginEvent[] = marginAddedEvents.map((event) => {
        const { args, transactionHash, blockNumber } = event;
        const { asset, amount } = args as any;
        const assetData = metadata.assetData[asset];
        if (!assetData) {
          throw new Error(`No asset data found for asset ${asset}`);
        }
        return {
          asset,
          symbol: assetData.symbol,
          amount: wei(amount, assetData.decimals).toNumber(),
          type: 'added',
          timestamp: getTimeFromBlockNumber(currentBlock.number, blockNumber),
          transactionHash,
        };
      });

      const marginRemovedFilter = VaultContract.filters.MarginRemoved(null, null);
      const marginRemovedEvents = await VaultContract.queryFilter(marginRemovedFilter);
      const marginRemoved: FundingRateVaultMarginEvent[] = marginRemovedEvents.map((event) => {
        const { args, transactionHash, blockNumber } = event;
        const { asset, amount } = args as any;
        const assetData = metadata.assetData[asset];
        if (!assetData) {
          throw new Error(`No asset data found for asset ${asset}`);
        }
        return {
          asset,
          symbol: assetData.symbol,
          amount: wei(amount, assetData.decimals).toNumber(),
          type: 'removed',
          timestamp: getTimeFromBlockNumber(currentBlock.number, blockNumber),
          transactionHash,
        };
      });

      const marginEvents = [...marginAdded, ...marginRemoved];

      // Get PnL
      const userDeposits = deposits.filter(
        (deposit) => deposit.owner.toLowerCase() === walletAddress.toLowerCase()
      );
      const userWithdrawals = withdrawals.filter(
        (withdrawal) => withdrawal.owner.toLowerCase() === walletAddress.toLowerCase()
      );
      const netDeposited = userDeposits.reduce(
        (acc, deposit) => acc.add(deposit.assets),
        BigNumber.from(0)
      );
      const netWithdrawn = userWithdrawals.reduce(
        (acc, withdrawal) => acc.add(withdrawal.assets),
        BigNumber.from(0)
      );
      const depositsValue = netDeposited.sub(netWithdrawn);
      const currentValue = data.balanceOf.mul(data.exchangeRate).div(BigNumber.from(10).pow(18));
      const pnl = wei(currentValue).toNumber() - wei(depositsValue, 6).toNumber();

      data = {
        ...data,
        address: fundingRateVaultAddress,
        ...metadata,
        apr7d: aprs[0],
        apr30d: aprs[1],
        apr90d: aprs[2],
        apr1y: aprs[3],
        deposits,
        withdrawals,
        trades,
        marginEvents,
        pnl,
      };

      return data;
    },
    refetchInterval: 120_000,
  });
};
