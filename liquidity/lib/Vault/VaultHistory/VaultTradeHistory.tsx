import { Table, Th, Thead, Tr, Tbody, Td, Text } from '@chakra-ui/react';
import {
  FundingRateVaultData,
  FundingRateVaultTradeEvent,
} from '../../useFundingRateVaultData/useFundingRateVaultData';
import { formatNumberShort, truncateAddress } from '@snx-v3/formatters';
import { etherscanLink } from '@snx-v3/etherscanLink';
import { useNetwork } from '@snx-v3/useBlockchain';

interface Props {
  vaultData: FundingRateVaultData;
}

export const VaultTradeHistory = ({ vaultData }: Props) => {
  const { network } = useNetwork();

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
            From
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
            To
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
            Amount In
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
            Amount Out
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

        {vaultData.trades.map((trade: FundingRateVaultTradeEvent) => (
          <Tr key={trade.transactionHash}>
            <Td border="none" fontSize="12px" fontWeight={400} py={2}>
              {trade.timestamp.toLocaleDateString()}
              <Text textColor="gray.500">{trade.timestamp.toLocaleTimeString()}</Text>
            </Td>
            <Td border="none" fontSize="12px" fontWeight={400} py={2}>
              {trade.fromSymbol}
            </Td>
            <Td border="none" fontSize="12px" fontWeight={400} py={2}>
              {trade.toSymbol}
            </Td>
            <Td border="none" fontSize="12px" fontWeight={400} py={2}>
              {formatNumberShort(trade.amountIn)}
            </Td>
            <Td border="none" fontSize="12px" fontWeight={400} py={2}>
              {formatNumberShort(trade.amountOut)}
            </Td>
            <Td textDecoration="underline" border="none" fontSize="12px" fontWeight={400} py={2}>
              <a
                href={etherscanLink({
                  chain: network?.name || '',
                  address: trade.transactionHash,
                  isTx: true,
                })}
                target="_blank"
                rel="noreferrer"
              >
                {truncateAddress(trade.transactionHash)}
              </a>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
