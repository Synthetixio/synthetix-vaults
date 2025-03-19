import { tokenOverrides } from '@snx-v3/constants';
import { importCollateralTokens } from '@snx-v3/contracts';
import { contractsHash } from '@snx-v3/tsHelpers';
import { MAINNET, Network, OPTIMISM, useNetwork } from '@snx-v3/useBlockchain';
import { useSNX } from '@snx-v3/useSNX';
import { useSystemToken } from '@snx-v3/useSystemToken';
import { wei, Wei } from '@synthetixio/wei';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';

export type CollateralType = {
  address: string;
  symbol: string;
  displaySymbol: string;
  name: string;
  decimals: number;
  depositingEnabled: boolean;
  issuanceRatioD18: Wei;
  liquidationRatioD18: Wei;
  liquidationRewardD18: Wei;
  minDelegationD18: Wei;
  oracleNodeId: string;
  tokenAddress: string;
  oracle: {
    constPrice?: Wei;
    externalContract?: string;
    stalenessTolerance?: string;
    pythFeedId?: string;
  };
};

async function loadCollateralTypes(chainId: number, preset: string) {
  return (await importCollateralTokens(chainId, preset)).map((config) => ({
    address: config.address,
    symbol: config.symbol,
    displaySymbol: config.symbol,
    name: config.name,
    decimals: config.decimals,
    depositingEnabled: config.depositingEnabled,
    issuanceRatioD18: wei(config.issuanceRatioD18, 18, true),
    liquidationRatioD18: wei(config.liquidationRatioD18, 18, true),
    liquidationRewardD18: wei(config.liquidationRewardD18, 18, true),
    minDelegationD18: wei(config.minDelegationD18, 18, true),
    oracleNodeId: config.oracleNodeId,
    tokenAddress: config.tokenAddress,
    oracle: {
      constPrice: config.oracle.constPrice ? wei(config.oracle.constPrice, 18, true) : undefined,
      externalContract: config.oracle.externalContract,
      stalenessTolerance: config.oracle.stalenessTolerance,
      pythFeedId: config.oracle.pythFeedId,
    },
  }));
}

export function useCollateralTypes(includeDelegationOff = false, customNetwork?: Network) {
  const { network: currentNetwork } = useNetwork();
  const network = customNetwork ?? currentNetwork;
  const { data: systemToken } = useSystemToken(customNetwork);
  const { data: MainnetSNX } = useSNX(MAINNET);
  const { data: OptimismSNX } = useSNX(OPTIMISM);

  return useQuery({
    enabled: Boolean(network?.id && network?.preset && systemToken && MainnetSNX && OptimismSNX),
    queryKey: [
      `${network?.id}-${network?.preset}`,
      'CollateralTypes',
      { includeDelegationOff },
      { contractsHash: contractsHash([systemToken, MainnetSNX, OptimismSNX]) },
    ],
    queryFn: async () => {
      if (!(network?.id && network?.preset && systemToken && MainnetSNX && OptimismSNX))
        throw Error('useCollateralTypes should not be enabled when contracts missing');

      const collateralTypes = (await loadCollateralTypes(network.id, network.preset))
        .map((collateralType) => {
          if (network?.preset === 'andromeda' && collateralType.symbol === 'sUSDC') {
            return {
              ...collateralType,
              symbol: 'USDC',
              displaySymbol: 'USDC',
              name: 'USD Coin',
            };
          }
          if (network?.preset === 'andromeda' && collateralType.symbol === 'sStataUSDC') {
            return {
              ...collateralType,
              symbol: 'stataUSDC',
              displaySymbol: 'Static aUSDC',
              name: 'Static aUSDC',
            };
          }

          return {
            ...collateralType,
            displaySymbol:
              tokenOverrides[`${network.id}-${network.preset}`]?.[collateralType.address]
                ?.displaySymbol ??
              collateralType.displaySymbol ??
              collateralType.symbol,
          };
        })
        .filter((collateralType) => collateralType.tokenAddress !== systemToken.address);

      return collateralTypes
        .filter(
          (collateralType) =>
            collateralType.depositingEnabled ||
            (network.id === MAINNET.id && collateralType.address === MainnetSNX.address) ||
            (network.id === OPTIMISM.id && collateralType.address === OptimismSNX.address)
        )
        .filter(
          (collateralType) =>
            // Return collateral types that have minDelegationD18 < MaxUint256
            // When minDelegationD18 === MaxUint256, delegation is effectively disabled
            includeDelegationOff || collateralType.minDelegationD18.lt(ethers.constants.MaxUint256)
        );
    },
    // one hour in ms
    staleTime: 3_600_000,
  });
}

export function useCollateralType(collateralSymbol?: string, networkOverride?: Network) {
  const { network: currentNetwork } = useNetwork();
  const network = networkOverride || currentNetwork;
  const { data: collateralTypes } = useCollateralTypes(true, networkOverride);

  return useQuery({
    enabled: Boolean(network && collateralTypes && collateralSymbol),
    queryKey: [
      `${network?.id}-${network?.preset}`,
      'CollateralType',
      { collateralSymbol },
      { contractsHash: contractsHash(collateralTypes ?? []) },
    ],
    queryFn: async () => {
      if (!(network && collateralTypes && collateralSymbol)) {
        throw new Error('OMFG');
      }

      const collateralType = collateralTypes.find(
        (collateral) => `${collateral.symbol}`.toLowerCase() === `${collateralSymbol}`.toLowerCase()
      );
      if (!collateralType) {
        throw new Error('Unsupported collateral');
      }
      return collateralType;
    },
    // one hour in ms
    staleTime: 3_600_000,
    throwOnError: false,
  });
}
