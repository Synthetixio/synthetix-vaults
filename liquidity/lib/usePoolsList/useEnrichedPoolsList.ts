import { useMemo } from 'react';
import { BASE_ANDROMEDA, MAINNET, Network } from '@snx-v3/useBlockchain';
import { useOfflinePrices } from '@snx-v3/useCollateralPriceUpdates';
import { CollateralType, useCollateralTypes } from '@snx-v3/useCollateralTypes';
import { useOraclePrice } from '@snx-v3/useOraclePrice';
import Wei, { wei } from '@synthetixio/wei';
import { usePoolsList } from './usePoolsList';

type CollateralTypeWithDeposited = CollateralType & {
  collateralDeposited: string;
};

export type EnrichedPool = {
  network: Network;
  pool: {
    name: string;
    id: string;
  };
  collateral: CollateralTypeWithDeposited;
  price: Wei;
  totalValue: number;
};

export function useEnrichedPoolsList() {
  const { data: poolsList, isPending: isPendingPoolsList } = usePoolsList();
  const { data: baseCollateralTypes, isPending: isPendingBaseCollateralTypes } = useCollateralTypes(
    false,
    BASE_ANDROMEDA
  );
  const { data: mainnetCollateralTypes, isPending: isPendingMainnetCollateralTypes } =
    useCollateralTypes(false, MAINNET);

  const allCollaterals: CollateralType[] = useMemo(() => {
    // We want to filter out assets that don't have a pyth price feed
    return [...(baseCollateralTypes ?? []), ...(mainnetCollateralTypes ?? [])].filter(
      (item) => item.symbol !== 'stataUSDC'
    );
  }, [baseCollateralTypes, mainnetCollateralTypes]);

  const { data: collateralPrices, isPending: isPendingCollateralPrices } = useOfflinePrices(
    allCollaterals.map((item) => ({
      id: item.tokenAddress,
      oracleId: item.oracleNodeId,
      symbol: item.symbol,
    }))
  );

  // Fetch stata price from oracle manager
  const stata = baseCollateralTypes?.find((item) => item.symbol === 'stataUSDC');

  const { data: stataPrice, isPending: isStataPriceLoading } = useOraclePrice(
    stata?.oracleNodeId,
    BASE_ANDROMEDA
  );

  const isPending =
    isPendingPoolsList ||
    isPendingCollateralPrices ||
    isPendingBaseCollateralTypes ||
    isPendingMainnetCollateralTypes ||
    isStataPriceLoading;

  const filteredPools = useMemo(() => {
    if (!poolsList) {
      return [];
    }

    return poolsList.map(({ network, poolInfo }) => {
      const collateralDeposited = poolInfo.map(({ collateral_type }) => ({
        collateralDeposited: collateral_type.total_amount_deposited,
        tokenAddress: collateral_type.id,
      }));

      let collaterals: typeof baseCollateralTypes = [];

      if (network.id === BASE_ANDROMEDA.id) {
        collaterals = baseCollateralTypes;
      } else if (network.id === MAINNET.id) {
        collaterals = mainnetCollateralTypes;
      }

      const collateralTypes = collaterals?.map((item) => ({
        ...item,
        collateralDeposited:
          collateralDeposited.find(
            ({ tokenAddress }) => tokenAddress.toLowerCase() === item.tokenAddress.toLowerCase()
          )?.collateralDeposited || '0',
      }));

      return {
        network,
        poolInfo,
        collateralDeposited,
        collateralTypes,
      };
    });
  }, [poolsList, baseCollateralTypes, mainnetCollateralTypes]);

  const allCollateralPrices = useMemo(() => {
    if (stata && stataPrice) {
      return collateralPrices?.concat({ symbol: 'stataUSDC', price: stataPrice?.price.toBN() });
    }
  }, [stata, collateralPrices, stataPrice]);

  const data: EnrichedPool[] = filteredPools
    .flatMap(({ network, poolInfo, collateralTypes }) => {
      return collateralTypes?.map((collateral) => {
        const price = wei(
          allCollateralPrices?.find(
            (price) => price.symbol.toUpperCase() === collateral.symbol.toUpperCase()
          )?.price ?? 0
        );

        const collateralDeposited = wei(collateral.collateralDeposited, collateral.decimals, true);
        const totalValue = price.mul(collateralDeposited).toNumber();

        return {
          pool: poolInfo?.[0]?.pool,
          network,
          collateral,
          price,
          totalValue,
        };
      });
    })
    .filter((item) => !!item);

  return {
    data,
    isPending,
  };
}
