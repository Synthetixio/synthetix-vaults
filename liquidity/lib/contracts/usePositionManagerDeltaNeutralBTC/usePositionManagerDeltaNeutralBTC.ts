import { importPositionManagerDeltaNeutralBTC } from '@snx-v3/contracts';
import { Network, useNetwork } from '@snx-v3/useBlockchain';
import { useQuery } from '@tanstack/react-query';

export function usePositionManagerDeltaNeutralBTC(customNetwork?: Network) {
  const { network } = useNetwork();
  const targetNetwork = customNetwork || network;

  return useQuery({
    queryKey: [`${targetNetwork?.id}-${targetNetwork?.preset}`, 'PositionManagerDeltaNeutralBTC'],
    enabled: Boolean(targetNetwork),
    queryFn: async function () {
      if (!targetNetwork) throw 'OMFG';
      return importPositionManagerDeltaNeutralBTC(targetNetwork.id, targetNetwork.preset);
    },
    staleTime: Infinity,
    // On some chains this is not available, and that is expected
    throwOnError: false,
  });
}
