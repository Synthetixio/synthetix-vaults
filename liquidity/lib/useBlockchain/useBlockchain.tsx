import { IconProps } from '@chakra-ui/react';
import { INFURA_KEY } from '@snx-v3/constants';
import { importPythERC7412Wrapper } from '@snx-v3/contracts';
import {
  ArbitrumIcon,
  BaseIcon,
  EthereumIcon,
  FailedIcon,
  LogoIcon,
  OptimismIcon,
  SNXChainIcon,
} from '@snx-v3/icons';
import { useQuery } from '@tanstack/react-query';
import { useConnectWallet, useSetChain } from '@web3-onboard/react';
import { ethers } from 'ethers';
import React, { useCallback } from 'react';
import { MagicProvider } from './magic';
import SynthetixIcon from './SynthetixIcon.svg';
import SynthetixLogo from './SynthetixLogo.svg';

export function getMagicProvider(): ethers.providers.JsonRpcProvider | undefined {
  if (window.$magicWallet && window.$chainId) {
    return new MagicProvider();
  }
}

export type Network = {
  id: number;
  preset: string;
  hexId: string;
  token: string;
  name: string;
  rpcUrl: string;
  label: string;
  isSupported: boolean;
  publicRpcUrl: string;
  isTestnet: boolean;
};

export const UNSUPPORTED_NETWORK: Network = {
  id: 0,
  preset: 'main',
  hexId: `0x${Number(0).toString(16)}`,
  token: 'ETH',
  name: 'unsupported',
  rpcUrl: '',
  publicRpcUrl: '',
  label: 'Unsupported',
  isSupported: false,
  isTestnet: false,
};

interface NetworkIconProps extends IconProps {
  networkId?: Network['id'];
  size?: string;
}

export const NetworkIcon = ({ networkId, size = '24px', ...props }: NetworkIconProps) => {
  switch (networkId) {
    case 1:
      return <EthereumIcon w={size} h={size} {...props} />;
    case 10:
      return <OptimismIcon w={size} h={size} {...props} />;
    case 11155111:
      return <EthereumIcon w={size} h={size} {...props} />;
    case 84531:
      return <BaseIcon w={size} h={size} {...props} />;
    case 84532:
      return <BaseIcon w={size} h={size} {...props} />;
    case 13370:
      return <LogoIcon w="29px" h="21px" {...props} />;
    case 8453:
      return <BaseIcon w={size} h={size} {...props} />;
    case 11155420:
      return <OptimismIcon w={size} h={size} {...props} />;
    case 421614:
      return <ArbitrumIcon w={size} h={size} {...props} />;
    case 42161:
      return <ArbitrumIcon w={size} h={size} {...props} />;
    case 2192:
      return <SNXChainIcon w={size} h={size} {...props} />;
    case 13001:
      return <SNXChainIcon w={size} h={size} {...props} />;
    default: {
      return <FailedIcon w={size} h={size} {...props} />;
    }
  }
};

export const BASE_ANDROMEDA: Network = {
  id: 8453,
  preset: 'andromeda',
  hexId: `0x${Number(8453).toString(16)}`,
  token: 'ETH',
  name: 'base',
  rpcUrl: `https://base-mainnet.infura.io/v3/${INFURA_KEY}`,
  label: 'Base',
  isSupported: true,
  publicRpcUrl: 'https://base.publicnode.com',
  isTestnet: false,
};

export const MAINNET: Network = {
  id: 1,
  preset: 'main',
  hexId: `0x${Number(1).toString(16)}`,
  token: 'ETH',
  name: 'mainnet',
  rpcUrl: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  label: 'Ethereum',
  isSupported: true,
  publicRpcUrl: 'https://ethereum.publicnode.com',
  isTestnet: false,
};

export const OPTIMISM: Network = {
  id: 10,
  preset: 'main',
  hexId: `0x${Number(10).toString(16)}`,
  token: 'ETH',
  name: 'optimism-mainnet',
  rpcUrl: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
  label: 'Optimism',
  isSupported: true,
  publicRpcUrl: 'https://mainnet.optimism.io',
  isTestnet: false,
};

export const NETWORKS: Network[] = [BASE_ANDROMEDA];

export async function deploymentHasERC7412(chainId: number, preset: string) {
  return importPythERC7412Wrapper(chainId, preset).then(
    () => true,
    () => false
  );
}

export const DEFAULT_NETWORK =
  NETWORKS.find(
    (network) =>
      `${network.id}-${network.preset}` === window.localStorage.getItem('DEFAULT_NETWORK')
  ) ?? NETWORKS[1];

export const appMetadata = {
  name: 'Synthetix',
  icon: SynthetixIcon,
  logo: SynthetixLogo,
  description: 'Synthetix | The derivatives liquidity protocol.',
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'Brave Wallet', url: 'https://brave.com/wallet' },
  ],
  gettingStartedGuide: 'https://synthetix.io',
  explore: 'https://blog.synthetix.io',
};

export function useProviderForChain(customNetwork?: Network) {
  const { network: currentNetwork } = useNetwork();
  const network = customNetwork ?? currentNetwork;
  const isDefaultChain =
    customNetwork?.id === currentNetwork?.id && customNetwork?.preset === currentNetwork?.preset;
  const { data: provider } = useQuery({
    queryKey: [`${network?.id}-${network?.preset}`, 'ProviderForChain', { isDefaultChain }],
    enabled: Boolean(network),
    queryFn: () => {
      if (!network) throw 'OMFG';
      if (isDefaultChain) {
        const provider = getMagicProvider();
        if (provider) {
          return provider;
        }
      }
      return new ethers.providers.JsonRpcProvider(network.rpcUrl);
    },
  });

  return provider;
}

export function useWallet() {
  const [{ wallet }, connect, disconnect] = useConnectWallet();

  if (!wallet) {
    return {
      activeWallet: undefined,
      walletsInfo: undefined,
      connect,
      disconnect,
    };
  }

  const activeWallet = wallet?.accounts[0];

  return {
    activeWallet: activeWallet,
    walletsInfo: wallet,
    connect,
    disconnect,
  };
}

export function useNetwork() {
  const [{ connectedChain }, setChain] = useSetChain();

  const setNetwork = useCallback(
    async (networkId: number) => {
      const newNetwork = NETWORKS.find((n) => n.id === networkId);
      if (!newNetwork) return;
      return await setChain({ chainId: newNetwork?.hexId });
    },
    [setChain]
  );

  // Hydrate the network info
  const network = NETWORKS.find((n) => n.hexId === connectedChain?.id);

  if (!network) {
    return {
      network: undefined,
      setNetwork,
    };
  }

  return {
    network,
    setNetwork,
  };
}

export function useSigner() {
  const { network } = useNetwork();
  const [{ wallet }] = useConnectWallet();
  const activeWallet = wallet?.accounts?.[0];
  const { data: signer } = useQuery({
    queryKey: [`${network?.id}-${network?.preset}`, 'Signer', activeWallet?.address],
    enabled: Boolean(wallet && activeWallet),
    queryFn: () => {
      if (!(wallet && activeWallet)) throw 'OMFG';
      const provider =
        getMagicProvider() ?? new ethers.providers.Web3Provider(wallet.provider, 'any');
      return provider.getSigner(activeWallet.address);
    },
  });
  return signer;
}

export function useProvider() {
  const { network } = useNetwork();
  return useProviderForChain(network);
}
