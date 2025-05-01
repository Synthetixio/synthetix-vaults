import {
  EventType,
  FundingRateVaultData,
  FundingRateVaultPositionEvent,
  FundingRateVaultTradeEvent,
} from '@snx-v3/useFundingRateVaultData';
import { formatNumberToUsdShort } from '@snx-v3/formatters';
import { TransactionTable } from '@snx-v3/TransactionTable';
import { wei } from '@synthetixio/wei';
import { usePythPrice } from '@snx-v3/usePythPrice';
import { BigNumber } from 'ethers';

interface Props {
  vaultData?: FundingRateVaultData;
}

interface TradeOrPositionEvent extends EventType {
  type: 'trade' | 'position';
  tradeValue: number;
  fees: number;
  label: string;
}

const getTradeValue = (
  trade: FundingRateVaultTradeEvent,
  ethPrice?: BigNumber,
  btcPrice?: BigNumber
): number => {
  if (!ethPrice || !btcPrice) {
    return 0;
  }
  if (trade.fromSymbol.toLowerCase().includes('eth')) {
    return trade.amountIn * wei(ethPrice).toNumber();
  }
  if (trade.fromSymbol.toLowerCase().includes('btc')) {
    return trade.amountIn * wei(btcPrice).toNumber();
  }
  if (trade.toSymbol.toLowerCase().includes('eth')) {
    return trade.amountOut * wei(ethPrice).toNumber();
  }
  if (trade.toSymbol.toLowerCase().includes('btc')) {
    return trade.amountOut * wei(btcPrice).toNumber();
  }
  throw new Error('Invalid trade');
};

const getPositionValue = (
  position: FundingRateVaultPositionEvent,
  vaultData?: FundingRateVaultData,
  ethPrice?: BigNumber,
  btcPrice?: BigNumber
): number => {
  if (!vaultData) {
    return 0;
  }
  const { perpsMarket } = vaultData;
  if (perpsMarket.toLowerCase().includes('eth')) {
    if (!ethPrice) return 0;
    return position.sizeDelta * wei(ethPrice).toNumber();
  }
  if (perpsMarket.toLowerCase().includes('btc')) {
    if (!btcPrice) return 0;
    return position.sizeDelta * wei(btcPrice).toNumber();
  }
  throw new Error('Invalid perps market');
};

export const FundingRateVaultTrades = ({ vaultData }: Props) => {
  const { data: ethPrice } = usePythPrice('ETH');
  const { data: btcPrice } = usePythPrice('BTC');

  const { trades, positionEvents } = vaultData || { trades: [], positionEvents: [] };

  const events: TradeOrPositionEvent[] = [
    ...trades.map((trade: FundingRateVaultTradeEvent) => ({
      timestamp: trade.timestamp,
      transactionHash: trade.transactionHash,
      type: 'trade' as const,
      tradeValue: getTradeValue(trade, ethPrice, btcPrice),
      fees: getTradeValue(trade, ethPrice, btcPrice) * 0.001,
      label: `Aerodrome CL-${trade.fromSymbol}/${trade.toSymbol}`,
    })),
    ...positionEvents.map((position) => ({
      timestamp: position.timestamp,
      transactionHash: position.transactionHash,
      type: 'position' as const,
      tradeValue: getPositionValue(position, vaultData, ethPrice, btcPrice),
      fees: getPositionValue(position, vaultData, ethPrice, btcPrice) * 0.001 + 1,
      label: 'Synthetix Perps v3',
    })),
  ];

  return (
    <TransactionTable
      headers={[
        {
          label: 'Venue',
          key: 'venue',
          sortable: true,
          sortFn: (a: TradeOrPositionEvent, b: TradeOrPositionEvent) => {
            if (a.type === 'trade' && b.type === 'trade') {
              return a.label.localeCompare(b.label);
            }
            return a.type.localeCompare(b.type);
          },
        },
        {
          label: 'Trade Value',
          key: 'value',
          sortable: true,
          sortFn: (a: TradeOrPositionEvent, b: TradeOrPositionEvent) => {
            if (a.type === 'trade' && b.type === 'trade') {
              return b.tradeValue - a.tradeValue;
            } else if (a.type === 'position' && b.type === 'position') {
              return b.tradeValue - a.tradeValue;
            }
            return 0;
          },
        },
        {
          label: 'Fees',
          key: 'fees',
          sortable: true,
          sortFn: (a: TradeOrPositionEvent, b: TradeOrPositionEvent) => {
            if (a.type === 'position' && b.type === 'position') {
              return b.fees - a.fees;
            }
            return 0;
          },
        },
      ]}
      rows={
        vaultData
          ? events.map((event) => ({
              date: event.timestamp,
              data: event,
              values: [
                event.label,
                formatNumberToUsdShort(event.tradeValue),
                formatNumberToUsdShort(event.fees),
              ],
              transactionHash: event.transactionHash,
            }))
          : undefined
      }
    />
  );
};
