import { BASE_ANDROMEDA, useNetwork } from '@snx-v3/useBlockchain';
import { usePositionManagerDeltaNeutralBTC } from '../contracts/usePositionManagerDeltaNeutralBTC';
import { usePositionManagerDeltaNeutralETH } from '../contracts/usePositionManagerDeltaNeutralETH';
import { useMemo } from 'react';
import { FundingRateVaultData, useFundingRateVaultData } from '../useFundingRateVaultData';

export function useStrategyPoolsList(): FundingRateVaultData[] | undefined {
  const { network } = useNetwork();
  const targetNetwork = network || BASE_ANDROMEDA;

  const { data: DeltaNeutralETH } = usePositionManagerDeltaNeutralETH(targetNetwork);
  const { data: DeltaNeutralBTC } = usePositionManagerDeltaNeutralBTC(targetNetwork);

  const { data: btcData } = useFundingRateVaultData(DeltaNeutralBTC?.address);
  const { data: ethData } = useFundingRateVaultData(DeltaNeutralETH?.address);

  return useMemo(() => {
    if (!ethData || !btcData) {
      return undefined;
    }
    return [ethData, btcData];
  }, [ethData, btcData]);
}
