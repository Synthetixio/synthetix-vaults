import { BASE_ANDROMEDA, useNetwork, useProviderForChain } from '@snx-v3/useBlockchain';
import { usePositionManagerDeltaNeutralBTC } from '../contracts/usePositionManagerDeltaNeutralBTC';
import { usePositionManagerDeltaNeutralETH } from '../contracts/usePositionManagerDeltaNeutralETH';
import { useQuery } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';
import debug from 'debug';
const log = debug('snx:useStrategyPoolsList');

interface StrategyPool {
  name: string;
  symbol: string;
  displaySymbol: string;
  token: string;
  asset: string;
  totalSupply: BigNumber;
  totalAssets: number;
  totalAssetsCap: BigNumber;
  performanceFee: BigNumber;
  exchangeRate: BigNumber;
}

export function useStrategyPoolsList() {
  const { network } = useNetwork();
  const targetNetwork = network || BASE_ANDROMEDA;
  const provider = useProviderForChain(targetNetwork);

  const { data: DeltaNeutralETH } = usePositionManagerDeltaNeutralETH(targetNetwork);
  const { data: DeltaNeutralBTC } = usePositionManagerDeltaNeutralBTC(targetNetwork);

  return useQuery({
    queryKey: ['Strategy pools list'],
    enabled: Boolean(DeltaNeutralETH && DeltaNeutralBTC),
    queryFn: async function () {
      if (!DeltaNeutralETH || !DeltaNeutralBTC) {
        throw new Error('OMFG');
      }
      const DeltaNeutralBTCContract = new ethers.Contract(
        DeltaNeutralBTC.address,
        DeltaNeutralBTC.abi,
        provider
      );
      const DeltaNeutralETHContract = new ethers.Contract(
        DeltaNeutralETH.address,
        DeltaNeutralETH.abi,
        provider
      );

      const [
        btcName,
        btcSymbol,
        btcAsset,
        btcTotalSupply,
        btcTotalAssets,
        btcTotalAssetsCap,
        btcPerformanceFee,
        btcExchangeRate,
      ] = await Promise.all([
        DeltaNeutralBTCContract.name(),
        DeltaNeutralBTCContract.symbol(),
        DeltaNeutralBTCContract.asset(),
        DeltaNeutralBTCContract.totalSupply(),
        DeltaNeutralBTCContract.totalAssets(),
        DeltaNeutralBTCContract.totalAssetsCap(),
        DeltaNeutralBTCContract.performanceFee(),
        DeltaNeutralBTCContract.exchangeRate(),
      ]);

      const [
        ethName,
        ethSymbol,
        ethAsset,
        ethTotalSupply,
        ethTotalAssets,
        ethTotalAssetsCap,
        ethPerformanceFee,
        ethExchangeRate,
      ] = await Promise.all([
        DeltaNeutralETHContract.name(),
        DeltaNeutralETHContract.symbol(),
        DeltaNeutralETHContract.asset(),
        DeltaNeutralETHContract.totalSupply(),
        DeltaNeutralETHContract.totalAssets(),
        DeltaNeutralETHContract.totalAssetsCap(),
        DeltaNeutralETHContract.performanceFee(),
        DeltaNeutralETHContract.exchangeRate(),
      ]);

      log('ETH', {
        name: ethName,
        displaySymbol: 'ETH Delta Neutral',
        token: 'ETH',
        symbol: ethSymbol,
        asset: ethAsset,
        totalSupply: ethTotalSupply,
        totalAssets: ethTotalAssets,
        totalAssetsCap: ethTotalAssetsCap,
        performanceFee: ethPerformanceFee,
        exchangeRate: ethExchangeRate,
      });

      return [
        {
          name: btcName,
          symbol: btcSymbol,
          displaySymbol: 'BTC Delta Neutral',
          token: 'BTC',
          asset: btcAsset,
          totalSupply: btcTotalSupply,
          totalAssets: btcTotalAssets.toNumber() / 1e6,
          totalAssetsCap: btcTotalAssetsCap,
          performanceFee: btcPerformanceFee,
          exchangeRate: btcExchangeRate,
        },
        {
          name: ethName,
          displaySymbol: 'ETH Delta Neutral',
          token: 'ETH',
          symbol: ethSymbol,
          asset: ethAsset,
          totalSupply: ethTotalSupply,
          totalAssets: ethTotalAssets.toNumber() / 1e6,
          totalAssetsCap: ethTotalAssetsCap,
          performanceFee: ethPerformanceFee,
          exchangeRate: ethExchangeRate,
        },
      ] as StrategyPool[];
    },
  });
}
