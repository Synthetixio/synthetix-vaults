import { InfoIcon } from '@chakra-ui/icons';
import { Flex, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Tooltip } from '@snx-v3/Tooltip';
import { useNetwork } from '@snx-v3/useBlockchain';

export function PositionTableHeader() {
  const { network } = useNetwork();
  return (
    <Thead>
      <Tr>
        <Th
          py={5}
          textTransform="unset"
          color="gray.600"
          border="none"
          fontFamily="heading"
          fontSize="12px"
          lineHeight="16px"
        >
          Collateral
        </Th>
        <Th textAlign="right" border="none" textTransform="unset" py={5}>
          <Flex justifyContent="flex-end" alignItems="center">
            <Text color="gray.600" fontFamily="heading" fontSize="12px" lineHeight="16px" mr={1}>
              Locked
            </Text>
            <Tooltip
              label={
                <Text textAlign="left">
                  Unlocked assets can be locked into a position at any time or withdrawn after 24h
                  since last activity
                </Text>
              }
            >
              <InfoIcon w="10px" h="10px" />
            </Tooltip>
          </Flex>
        </Th>
        <Th textAlign="right" border="none" textTransform="unset" py={5}>
          <Text color="gray.600" fontFamily="heading" fontSize="12px" lineHeight="16px" mr={1}>
            Unlocked
          </Text>
        </Th>
        <Th border="none" textTransform="unset" py={5}>
          <Flex justifyContent="flex-end" alignItems="center">
            <Text color="gray.600" fontFamily="heading" fontSize="12px" lineHeight="16px" mr={1}>
              APR
            </Text>
            <Tooltip
              label={
                <Flex flexDirection="column" alignItems="start">
                  <Text textAlign="left" fontSize="14px">
                    APR is averaged over the trailing 28 days and is comprised of both performance
                    and rewards
                  </Text>
                </Flex>
              }
            >
              <InfoIcon w="10px" h="10px" />
            </Tooltip>
          </Flex>
        </Th>
        <Th border="none" textTransform="unset" py={5}>
          <Flex justifyContent="flex-end" alignItems="center">
            <Text color="gray.600" fontFamily="heading" fontSize="12px" lineHeight="16px" mr={1}>
              {network?.preset === 'andromeda' ? 'PNL' : 'Debt'}
            </Text>
            <Tooltip
              label={
                network?.preset === 'andromeda' ? (
                  "Your portion of the pool's total debt, which fluctuates based on trader performance and market conditions. This PNL is not inclusive liquidated trader collateral rewards."
                ) : (
                  <Text textAlign="left">
                    Debt consists of:
                    <br />
                    - Your portion of the pool&apos;s total debt, which fluctuates based on trader
                    performance and market conditions
                    <br />- The amount you&apos;ve borrowed against your collateral without
                    incurring interest
                  </Text>
                )
              }
            >
              <InfoIcon w="10px" h="10px" />
            </Tooltip>
          </Flex>
        </Th>
        {network?.preset === 'andromeda' ? null : (
          <Th border="none" textTransform="unset" py={5}>
            <Flex justifyContent="flex-end" alignItems="center">
              <Text color="gray.600" fontFamily="heading" fontSize="12px" lineHeight="16px" mr={1}>
                C-Ratio
              </Text>
              <Tooltip
                label={
                  <Flex flexDirection="column" alignItems="start">
                    <Text textAlign="left" fontSize="14px">
                      C-ratio is a dynamic number that represents a ratio between your locked
                      collateral and your debt
                    </Text>
                  </Flex>
                }
              >
                <InfoIcon w="10px" h="10px" />
              </Tooltip>
            </Flex>
          </Th>
        )}
        <Th
          py={5}
          textTransform="unset"
          color="gray.600"
          border="none"
          fontFamily="heading"
          fontSize="12px"
          lineHeight="16px"
        >
          {' '}
        </Th>
      </Tr>
    </Thead>
  );
}
