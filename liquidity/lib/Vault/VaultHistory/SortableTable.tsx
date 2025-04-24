import { Table, Th, Thead, Tr, Tbody, Td, Text, Image, Box } from '@chakra-ui/react';
import { truncateAddress } from '@snx-v3/formatters';
import { etherscanLink } from '@snx-v3/etherscanLink';
import { useNetwork } from '@snx-v3/useBlockchain';
import sortIcon from './sort.svg';
import { useState } from 'react';

interface HeaderType {
  label: string;
  sortable: boolean;
  key?: string;
  sortFn?: (a: any, b: any) => number;
}

interface RowType {
  date: Date;
  data: any;
  values: string[];
  transactionHash: string;
}

interface Props {
  headers: HeaderType[];
  rows: RowType[];
}

export const SortableTable = ({ headers, rows }: Props) => {
  const { network } = useNetwork();
  const [sort, setSort] = useState<string>('timestamp');
  const [inverse, setInverse] = useState(true);

  const sortedRows = rows.sort((a: RowType, b: RowType) => {
    if (sort === 'timestamp') {
      return a.date.getTime() - b.date.getTime();
    }
    const sortFn = headers.find((h) => h.key === sort)?.sortFn;
    if (!sortFn) {
      throw new Error('Invalid sort');
    }
    return sortFn(a.data, b.data);
  });

  if (inverse) {
    sortedRows.reverse();
  }

  const SortByColumn = ({ sortType }: { sortType: string }) => {
    return (
      <button
        onClick={() => {
          if (sortType === sort) {
            setInverse(!inverse);
          } else {
            setSort(sortType);
            setInverse(false);
          }
        }}
      >
        <Image height="10px" marginLeft="10px" src={sortIcon} />
      </button>
    );
  };

  return (
    <Box maxHeight="300px" overflowY="auto">
      <Table>
        <Thead whiteSpace="nowrap" position="sticky" top={0} bg="navy.700" zIndex={1}>
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
              display="flex"
              alignItems="center"
            >
              Date
              <SortByColumn sortType="timestamp" />
            </Th>
            {headers.map((header) => (
              <Th
                key={header.key}
                py={2}
                textTransform="unset"
                color="gray.600"
                border="none"
                fontFamily="heading"
                fontSize="12px"
                lineHeight="16px"
                fontWeight={400}
              >
                {header.label}
                {header.sortable && header.key && <SortByColumn sortType={header.key} />}
              </Th>
            ))}
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

          {sortedRows.map((row, index) => (
            <Tr key={`${row.transactionHash}-${index}`}>
              <Td border="none" fontSize="12px" fontWeight={400} py={2}>
                {row.date.toLocaleDateString()}
                <Text textColor="gray.500">{row.date.toLocaleTimeString()}</Text>
              </Td>
              {row.values.map((value, index) => (
                <Td
                  key={`${row.transactionHash}-${value}-${index}`}
                  border="none"
                  fontSize="12px"
                  fontWeight={400}
                  py={2}
                >
                  {value}
                </Td>
              ))}
              <Td textDecoration="underline" border="none" fontSize="12px" fontWeight={400} py={2}>
                <a
                  href={etherscanLink({
                    chain: network?.name || '',
                    address: row.transactionHash,
                    isTx: true,
                  })}
                  target="_blank"
                  rel="noreferrer"
                >
                  {truncateAddress(row.transactionHash)}
                </a>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
