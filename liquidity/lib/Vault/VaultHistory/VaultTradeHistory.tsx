import {
  FundingRateVaultData,
  FundingRateVaultTradeEvent,
} from '../../useFundingRateVaultData/useFundingRateVaultData';
import { formatNumberShort } from '@snx-v3/formatters';
import { SortableTable } from './SortableTable';

interface Props {
  vaultData?: FundingRateVaultData;
}

export const VaultTradeHistory = ({ vaultData }: Props) => {
  return (
    <SortableTable
      headers={[
        {
          label: 'From',
          key: 'fromSymbol',
          sortable: true,
          sortFn: (a: any, b: any) => a.fromSymbol.localeCompare(b.fromSymbol),
        },
        {
          label: 'To',
          key: 'toSymbol',
          sortable: true,
          sortFn: (a: any, b: any) => a.toSymbol.localeCompare(b.toSymbol),
        },
        {
          label: 'Amount In',
          key: 'amountIn',
          sortable: true,
          sortFn: (a: any, b: any) => b.amountIn - a.amountIn,
        },
        {
          label: 'Amount Out',
          key: 'amountOut',
          sortable: true,
          sortFn: (a: any, b: any) => b.amountOut - a.amountOut,
        },
      ]}
      rows={
        vaultData
          ? vaultData.trades.map((trade: FundingRateVaultTradeEvent) => ({
              date: trade.timestamp,
              data: trade,
              values: [
                trade.fromSymbol,
                trade.toSymbol,
                formatNumberShort(trade.amountIn),
                formatNumberShort(trade.amountOut),
              ],
              transactionHash: trade.transactionHash,
            }))
          : undefined
      }
    />
  );
};
