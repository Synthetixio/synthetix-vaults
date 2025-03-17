import { Flex, Text } from '@chakra-ui/react';
import { Amount } from '@snx-v3/Amount';
import { SynthIcon } from '@snx-v3/TokenIcon';
import Wei from '@synthetixio/wei';
import React from 'react';

export function SynthRow({
  synth,
  balance,
}: {
  synth: {
    address: string;
    symbol: string;
    name: string;
  };
  balance: Wei;
}) {
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
      alignItems="center"
    >
      <Flex alignItems="center" flex="1" textDecoration="none" _hover={{ textDecoration: 'none' }}>
        <SynthIcon height={30} width={30} symbol={synth.symbol} />
        <Flex flexDirection="column" ml={3}>
          <Text
            color="white"
            fontWeight={700}
            lineHeight="1.25rem"
            fontFamily="heading"
            fontSize="sm"
          >
            {synth.symbol}
          </Text>
          <Text color="gray.500" fontFamily="heading" fontSize="0.75rem" lineHeight="1rem">
            {synth.name}
          </Text>
        </Flex>
      </Flex>

      <Flex width={['100px', '100px', '160px']} direction="column" alignItems="flex-end">
        <Text color="white" fontSize="14px" fontFamily="heading" fontWeight={500} lineHeight="20px">
          <Amount value={balance} />
        </Text>
      </Flex>

      <Flex width={['70px', '100px', '160px']} justifyContent="flex-end"></Flex>
    </Flex>
  );
}
