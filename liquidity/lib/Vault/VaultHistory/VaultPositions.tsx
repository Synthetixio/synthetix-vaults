import { Table, Th, Thead, Tr, Tbody, Td } from '@chakra-ui/react';

export const VaultPositions = () => {
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
            Market
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
            Size
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
            Position Value
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
            PnL
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
            Synthetix Perps v3
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            wstETH
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            1.488
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            $1,200.0232
          </Td>
          <Td color="green.500" border="none" fontSize="12px" fontWeight={400} py={2}>
            +$86.0485
          </Td>
        </Tr>
        <Tr>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            Synthetix Perps v3
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            wstETH
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            1.488
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            $1,200.0232
          </Td>
          <Td border="none" fontSize="12px" fontWeight={400} py={2}>
            -
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};
