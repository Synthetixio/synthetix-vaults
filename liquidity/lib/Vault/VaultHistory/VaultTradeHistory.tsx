import { Table, Th, Thead, Tr, Tbody, Td, Text } from '@chakra-ui/react';

export const VaultTradeHistory = () => {
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
            Venue
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
            Trade Value
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
            Fees
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

        <Tr>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            02/24/2025
            <Text textColor="gray.500">14:03:21</Text>
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            Synthetix Perps v3
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            $1,200.0232
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            $0.3234
          </Td>
          <Td textDecoration="underline" border="none" fontSize="12px" fontWeight={400} py={2}>
            0x46f...ec8fc
          </Td>
        </Tr>
        <Tr>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            02/24/2025
            <Text textColor="gray.500">14:03:21</Text>
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            0x46f...ec8fc
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            $1,200.0232
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            -
          </Td>
          <Td textDecoration="underline" border="none" fontSize="12px" fontWeight={400} py={2}>
            0x46f...ec8fc
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
