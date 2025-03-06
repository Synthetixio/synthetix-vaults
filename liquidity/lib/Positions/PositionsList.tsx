import { Flex, Heading, Table, TableContainer, Tbody, Text, Tr } from '@chakra-ui/react';
import { POOL_ID } from '@snx-v3/constants';
import { NetworkIcon, useNetwork } from '@snx-v3/useBlockchain';
import React from 'react';
import { PositionRow } from './PositionsRow';
import { PositionTableHeader } from './PositionTableHeader';
import { TableDivider } from './TableDivider';
import { LiquidityPositionType } from '@snx-v3/useLiquidityPosition';

export const PositionsList = ({ positions }: { positions: LiquidityPositionType[] }) => {
  const { network } = useNetwork();

  return (
    <TableContainer
      maxW="100%"
      borderColor="gray.900"
      borderWidth="1px"
      borderRadius="5px"
      p={6}
      sx={{
        borderCollapse: 'separate !important',
        borderSpacing: 0,
      }}
      bg="navy.700"
    >
      <Heading
        as={Flex}
        alignItems="center"
        gap={2}
        fontSize="18px"
        fontWeight={700}
        lineHeight="28px"
        color="gray.50"
        mb={3}
      >
        {network ? (
          <>
            <NetworkIcon size="24px" networkId={network.id} mr={1} />
            <Text>{network.label} Network</Text>
          </>
        ) : null}
      </Heading>

      <Table variant="simple">
        <PositionTableHeader />
        <Tbody>
          <TableDivider />

          {positions?.map((liquidityPosition, i) => {
            return (
              <Tr
                key={`${POOL_ID}-${liquidityPosition.collateralType.tokenAddress}`}
                borderBottomWidth={i === positions.length - 1 ? 'none' : '1px'}
              >
                <PositionRow liquidityPosition={liquidityPosition} />
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
