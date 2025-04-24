import {
  FundingRateVaultData,
  FundingRateVaultMarginEvent,
} from '../../useFundingRateVaultData/useFundingRateVaultData';
import { formatNumberShort } from '@snx-v3/formatters';
import { SortableTable } from './SortableTable';
import { wei } from '@synthetixio/wei';

interface Props {
  vaultData: FundingRateVaultData;
}

export const VaultMargin = ({ vaultData }: Props) => {
  return (
    <SortableTable
      headers={[
        {
          label: 'Type',
          key: 'type',
          sortable: true,
          sortFn: (a: any, b: any) => a.type.localeCompare(b.type),
        },
        {
          label: 'Asset',
          key: 'symbol',
          sortable: true,
          sortFn: (a: any, b: any) => a.symbol.localeCompare(b.symbol),
        },
        {
          label: 'Amount',
          key: 'amount',
          sortable: true,
          sortFn: (a: any, b: any) => b.amount.toNumber() - a.amount.toNumber(),
        },
      ]}
      rows={vaultData.marginEvents.map((event: FundingRateVaultMarginEvent) => ({
        date: event.timestamp,
        data: event,
        values: [
          event.type === 'added' ? 'Added' : 'Removed',
          event.symbol,
          formatNumberShort(wei(event.amount, 6).toNumber()),
        ],
        transactionHash: event.transactionHash,
      }))}
    />
  );
};
