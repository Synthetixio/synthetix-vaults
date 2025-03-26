import { BASE_ANDROMEDA, useNetwork, useProviderForChain } from '@snx-v3/useBlockchain';
import { usePositionManagerDeltaNeutralBTC } from '../contracts/usePositionManagerDeltaNeutralBTC';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import debug from 'debug';

const log = debug('snx:useStrategyPoolInfo');

export function useStrategyPoolInfo(address?: string) {
  const { network } = useNetwork();
  const targetNetwork = network || BASE_ANDROMEDA;
  const provider = useProviderForChain(targetNetwork);

  const { data: DeltaNeutralBTC } = usePositionManagerDeltaNeutralBTC(targetNetwork);

  return useQuery({
    queryKey: ['strategy-pool', address],
    enabled: Boolean(address && DeltaNeutralBTC && provider),
    queryFn: async function () {
      if (!address || !DeltaNeutralBTC || !provider) {
        throw new Error('OMFG');
      }
      const DeltaNeutralContract = new ethers.Contract(address, DeltaNeutralBTC.abi, provider);

      const [
        name,
        symbol,
        asset,
        totalSupply,
        totalAssets,
        totalAssetsCap,
        performanceFee,
        exchangeRate,
      ] = await Promise.all([
        DeltaNeutralContract.name(),
        DeltaNeutralContract.symbol(),
        DeltaNeutralContract.asset(),
        DeltaNeutralContract.totalSupply(),
        DeltaNeutralContract.totalAssets(),
        DeltaNeutralContract.totalAssetsCap(),
        DeltaNeutralContract.performanceFee(),
        DeltaNeutralContract.exchangeRate(),
      ]);

      log('DeltaNeutral', {
        name,
        symbol,
        asset,
        totalSupply,
        totalAssets,
        totalAssetsCap,
        performanceFee,
        exchangeRate,
      });

      return {
        name,
        symbol,
        asset,
        totalSupply,
        totalAssets: totalAssets.toNumber() / 1e6,
        totalAssetsCap,
        performanceFee,
        exchangeRate,
      };
    },
  });
}
