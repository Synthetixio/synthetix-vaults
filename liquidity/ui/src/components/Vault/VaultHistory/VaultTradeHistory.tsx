import { FundingRateVaultData, FundingRateVaultTradeEvent } from '@snx-v3/useFundingRateVaultData';
import { formatNumberShort } from '@snx-v3/formatters';
import { TransactionTable } from '@snx-v3/TransactionTable';

interface Props {
  vaultData?: FundingRateVaultData;
}

export const VaultTradeHistory = ({ vaultData }: Props) => {
  return (
    <TransactionTable
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
