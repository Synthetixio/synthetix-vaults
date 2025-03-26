import { BASE_ANDROMEDA, useNetwork } from '@snx-v3/useBlockchain';
import { usePositionManagerDeltaNeutralBTC } from '../contracts/usePositionManagerDeltaNeutralBTC';
import { usePositionManagerDeltaNeutralETH } from '../contracts/usePositionManagerDeltaNeutralETH';
import { BigNumber } from 'ethers';
import { useStrategyPoolInfo } from '../useStrategyPoolInfo';
import { useMemo } from 'react';

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

  const { data: DeltaNeutralETH } = usePositionManagerDeltaNeutralETH(targetNetwork);
  const { data: DeltaNeutralBTC } = usePositionManagerDeltaNeutralBTC(targetNetwork);

  const { data: btcPool } = useStrategyPoolInfo(DeltaNeutralBTC?.address);
  const { data: ethPool } = useStrategyPoolInfo(DeltaNeutralETH?.address);

  return useMemo(() => {
    return [
      {
        displaySymbol: 'BTC Delta Neutral',
        token: 'BTC',
        ...btcPool,
      },
      {
        displaySymbol: 'ETH Delta Neutral',
        token: 'ETH',
        ...ethPool,
      },
    ] as StrategyPool[];
  }, [btcPool, ethPool]);
}
