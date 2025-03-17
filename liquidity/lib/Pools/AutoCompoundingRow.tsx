import { Flex, Text, Button, Image } from '@chakra-ui/react';
import { NetworkIcon, useNetwork } from '@snx-v3/useBlockchain';

import AutoCompoundIcon from './auto-compound.svg';

export const AutoCompoundingRow = () => {
  const { network } = useNetwork();

  return (
    <Flex
      flexDir="row"
      w="100%"
      border="1px solid"
      borderColor="gray.900"
      rounded="base"
      bg="navy.700"
      py={4}
      px={4}
      gap={4}
      alignItems={['flex-start', 'center']}
      flexDirection={['column', 'row']}
    >
      <Flex alignItems="center" flex="1" textDecoration="none" _hover={{ textDecoration: 'none' }}>
        <Flex position="relative">
          <Image
            src={AutoCompoundIcon}
            fallbackSrc="https://assets.synthetix.io/collateral/UNKNOWN.svg"
            style={{ width: 40, height: 40 }}
          />
          <NetworkIcon
            position="absolute"
            right={0}
            bottom={0}
            networkId={network?.id ?? 8453}
            size="14px"
          />
        </Flex>
        <Flex flexDirection="column" ml={3} mr="auto">
          <Text fontSize="md" color="white" fontWeight={700}>
            Auto-Compounding
          </Text>
          <Text textTransform="capitalize" fontSize="xs" color="gray.500">
            {network?.name} Network
          </Text>
        </Flex>
      </Flex>

      <Flex width={['100%', 'auto']} justifyContent="flex-end">
        <Button
          variant="solid"
          isDisabled
          width="100%"
          _disabled={{
            bg: 'gray.900',
            backgroundImage: 'none',
            color: 'gray.500',
            opacity: 0.5,
            cursor: 'not-allowed',
          }}
          color="gray.500"
          size="sm"
          minWidth="124px"
        >
          Coming Soon
        </Button>
      </Flex>
    </Flex>
  );
};
