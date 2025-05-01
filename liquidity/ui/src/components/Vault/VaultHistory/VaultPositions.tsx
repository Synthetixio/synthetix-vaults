import {
  FundingRateVaultData,
  FundingRateVaultPositionEvent,
} from '../../../../../lib/useFundingRateVaultData/useFundingRateVaultData';
import { formatNumber, formatNumberShort, truncateAddress } from '@snx-v3/formatters';
import { TransactionTable } from '@snx-v3/TransactionTable';
import { wei } from '@synthetixio/wei';

interface Props {
  vaultData?: FundingRateVaultData;
}

export const VaultPositions = ({ vaultData }: Props) => {
  return (
    <TransactionTable
      headers={[
        {
          label: 'Size Delta',
          key: 'sizeDelta',
          sortable: true,
          sortFn: (a: any, b: any) => b.sizeDelta - a.sizeDelta,
        },
        {
          label: 'Acceptable Price',
          key: 'acceptablePrice',
          sortable: true,
          sortFn: (a: any, b: any) => b.acceptablePrice.toNumber() - a.acceptablePrice.toNumber(),
        },
        {
          label: 'Referrer',
          key: 'referrer',
          sortable: true,
          sortFn: (a: any, b: any) => a.referrer.localeCompare(b.referrer),
        },
      ]}
      rows={
        vaultData
          ? vaultData.positionEvents.map((event: FundingRateVaultPositionEvent) => ({
              date: event.timestamp,
              data: event,
              values: [
                formatNumberShort(event.sizeDelta),
                formatNumber(wei(event.acceptablePrice).toNumber()),
                truncateAddress(event.referrer),
              ],
              transactionHash: event.transactionHash,
            }))
          : undefined
      }
    />
  );
};
