import { Fade, Flex, Td, Text } from '@chakra-ui/react';
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
    <>
      <Td border="none">
        <Fade in>
          <Flex alignItems="center" textDecoration="none" _hover={{ textDecoration: 'none' }}>
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
        </Fade>
      </Td>
      <Td border="none">
        <Fade in>
          <Text
            color={balance.gt(0) ? 'green.500' : 'gray.50'}
            fontSize="14px"
            fontFamily="heading"
            fontWeight={500}
            lineHeight="20px"
          >
            <Amount value={balance} />
          </Text>
        </Fade>
      </Td>
    </>
  );
}
