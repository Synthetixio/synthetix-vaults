import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js';
import { offchainMainnetEndpoint } from '@snx-v3/constants';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';

const priceService = new EvmPriceServiceConnection(offchainMainnetEndpoint, {
  timeout: 60_000,
  httpRetries: 5,
  verbose: true,
});

const priceFeeds: { [key: string]: string } = {
  SNX: '0x39d020f60982ed892abbcd4a06a276a9f9b7bfbce003204c110b6e488f502da3',
  BTC: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
  ETH: '0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace',
};

export async function fetchPythPrice(symbol: string, time?: number) {
  const feedId = priceFeeds[symbol];
  if (time) {
    const priceFeed = await priceService.getPriceFeed(feedId, time);
    const { price, expo } = priceFeed.getPriceUnchecked();
    return ethers.utils.parseUnits(price, 18 + expo);
  }
  const response = await priceService.getLatestPriceFeeds([feedId]);
  if (response) {
    const [priceFeed] = response;
    const { price, expo } = priceFeed.getPriceUnchecked();
    return ethers.utils.parseUnits(price, 18 + expo);
  }
}

export function usePythPrice(symbol?: string, time?: number) {
  return useQuery({
    queryKey: ['PythPrice', symbol, { time }],
    enabled: Boolean(symbol),
    queryFn: async () => {
      if (symbol && symbol in priceFeeds) {
        return fetchPythPrice(symbol, time);
      }
      return ethers.BigNumber.from(0);
    },
  });
}
