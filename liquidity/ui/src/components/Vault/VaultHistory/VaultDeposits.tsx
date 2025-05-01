import { EventType, FundingRateVaultData } from '@snx-v3/useFundingRateVaultData';
import { BigNumber } from 'ethers';
import { formatNumberToUsdShort } from '@snx-v3/formatters';
import { wei } from '@synthetixio/wei';
import { truncateAddress } from '@snx-v3/formatters';
import { TransactionTable } from '@snx-v3/TransactionTable';

interface Props {
  vaultData?: FundingRateVaultData;
}

interface DepositOrWithdrawalEvent extends EventType {
  type: 'deposit' | 'withdrawal';
  user: string;
  assets: BigNumber;
}

export const VaultDeposits = ({ vaultData }: Props) => {
  const { deposits, withdrawals } = vaultData || { deposits: [], withdrawals: [] };

  const events: DepositOrWithdrawalEvent[] = [
    ...deposits.map((deposit) => {
      const { timestamp, transactionHash, owner, assets } = deposit;
      const dowEvent: DepositOrWithdrawalEvent = {
        timestamp,
        transactionHash,
        type: 'deposit',
        user: owner,
        assets,
      };
      return dowEvent;
    }),
    ...withdrawals.map((withdrawal) => {
      const { timestamp, transactionHash, owner, assets } = withdrawal;
      const dowEvent: DepositOrWithdrawalEvent = {
        timestamp,
        transactionHash,
        type: 'withdrawal',
        user: owner,
        assets,
      };
      return dowEvent;
    }),
  ];

  return (
    <TransactionTable
      headers={[
        {
          label: 'Type',
          key: 'type',
          sortable: true,
          sortFn: (a: any, b: any) => a.type.localeCompare(b.type),
        },
        {
          label: 'Address',
          key: 'address',
          sortable: true,
          sortFn: (a: any, b: any) => a.user.localeCompare(b.user),
        },
        {
          label: 'Value',
          key: 'value',
          sortable: true,
          sortFn: (a: any, b: any) => b.assets.toNumber() - a.assets.toNumber(),
        },
      ]}
      rows={
        vaultData
          ? events.map((event) => ({
              date: event.timestamp,
              data: event,
              values: [
                event.type === 'deposit' ? 'Deposit' : 'Withdrawal',
                truncateAddress(event.user),
                formatNumberToUsdShort(wei(event.assets, 6).toNumber()),
              ],
              transactionHash: event.transactionHash,
            }))
          : undefined
      }
    />
  );
};
