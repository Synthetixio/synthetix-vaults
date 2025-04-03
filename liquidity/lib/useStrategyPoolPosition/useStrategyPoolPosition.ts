import { BASE_ANDROMEDA, useNetwork, useProviderForChain, useWallet } from '@snx-v3/useBlockchain';
import { usePositionManagerDeltaNeutralBTC } from '../contracts/usePositionManagerDeltaNeutralBTC';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import debug from 'debug';

const log = debug('snx:useStrategyPoolPosition');

export function useStrategyPoolPosition(address?: string) {
  const { network } = useNetwork();
  const targetNetwork = network || BASE_ANDROMEDA;
  const provider = useProviderForChain(targetNetwork);
  const { activeWallet } = useWallet();

  const { data: DeltaNeutralBTC } = usePositionManagerDeltaNeutralBTC(targetNetwork);

  return useQuery({
    queryKey: ['strategy-pool-position', address, activeWallet?.address],
    enabled: Boolean(address && DeltaNeutralBTC && provider && activeWallet?.address),
    queryFn: async function () {
      if (!address || !DeltaNeutralBTC || !provider || !activeWallet?.address) {
        throw new Error('OMFG');
      }
      const DeltaNeutralContract = new ethers.Contract(address, DeltaNeutralBTC.abi, provider);

      const [balance] = await Promise.all([DeltaNeutralContract.balanceOf(activeWallet.address)]);

      log('DeltaNeutral', {
        balance,
      });

      return {
        balance,
      };
    },
  });
}
