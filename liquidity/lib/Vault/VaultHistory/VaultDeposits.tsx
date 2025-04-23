import { Table, Th, Thead, Tr, Tbody, Td, Text } from '@chakra-ui/react';
import { EventType, FundingRateVaultData } from '../../useFundingRateVaultData';
import { BigNumber } from 'ethers';
import { formatNumberToUsdShort } from '@snx-v3/formatters';
import { wei } from '@synthetixio/wei';
import { truncateAddress } from '../../formatters/string';
import { etherscanLink } from '../../etherscanLink/etherscanLink';
import { useNetwork } from '../../useBlockchain/useBlockchain';

interface Props {
  vaultData: FundingRateVaultData;
}

interface DepositOrWithdrawalEvent extends EventType {
  type: 'deposit' | 'withdrawal';
  user: string;
  assets: BigNumber;
}

export const VaultDeposits = ({ vaultData }: Props) => {
  const { deposits, withdrawals } = vaultData;
  const { network } = useNetwork();

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
    <Table>
      <Thead whiteSpace="nowrap">
        <Tr>
          <Th
            py={2}
            textTransform="unset"
            color="gray.600"
            border="none"
            fontFamily="heading"
            fontSize="12px"
            lineHeight="16px"
            fontWeight={400}
            width="160px"
          >
            Date
          </Th>
          <Th
            py={2}
            textTransform="unset"
            color="gray.600"
            border="none"
            fontFamily="heading"
            fontSize="12px"
            lineHeight="16px"
            fontWeight={400}
          >
            Address
          </Th>

          <Th
            py={2}
            textTransform="unset"
            color="gray.600"
            border="none"
            fontFamily="heading"
            fontSize="12px"
            lineHeight="16px"
            fontWeight={400}
          >
            Value
          </Th>
          <Th
            py={2}
            textTransform="unset"
            color="gray.600"
            border="none"
            fontFamily="heading"
            fontSize="12px"
            lineHeight="16px"
            fontWeight={400}
          >
            Realised PnL
          </Th>
          <Th
            py={2}
            textTransform="unset"
            color="gray.600"
            border="none"
            fontFamily="heading"
            fontSize="12px"
            lineHeight="16px"
            fontWeight={400}
          >
            Transaction
          </Th>
        </Tr>
      </Thead>

      <Tbody>
        <Tr border="none" borderTop="1px" borderTopColor="gray.900" width="100%" height="0px">
          <Td height="0px" border="none" px={0} pt={0} pb={0} />
          <Td height="0px" border="none" px={0} pt={0} pb={0} />
          <Td height="0px" border="none" px={0} pt={0} pb={0} />
          <Td height="0px" border="none" px={0} pt={0} pb={0} />
          <Td height="0px" border="none" px={0} pt={0} pb={0} />
          <Td height="0px" border="none" px={0} pt={0} pb={0} />
          <Td height="0px" border="none" px={0} pt={0} pb={0} />
        </Tr>

        {events.map((event) => (
          <Tr key={event.transactionHash}>
            <Td border="none" fontSize="12px" fontWeight={400} py={2}>
              {event.timestamp.toLocaleDateString()}
              <Text textColor="gray.500">{event.timestamp.toLocaleTimeString()}</Text>
            </Td>
            <Td border="none" fontSize="12px" fontWeight={400} py={2}>
              {truncateAddress(event.user)}
            </Td>
            <Td border="none" fontSize="12px" fontWeight={400} py={2}>
              {formatNumberToUsdShort(wei(event.assets, 6).toNumber())}
            </Td>
            <Td border="none" fontSize="12px" fontWeight={400} py={2}>
              -
            </Td>
            <Td textDecoration="underline" border="none" fontSize="12px" fontWeight={400} py={2}>
              <a
                href={etherscanLink({
                  chain: network?.name || '',
                  address: event.transactionHash,
                  isTx: true,
                })}
                target="_blank"
                rel="noreferrer"
              >
                {truncateAddress(event.transactionHash)}
              </a>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
