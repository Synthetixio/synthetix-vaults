import { Button, Flex, SystemProps, Text, useBreakpointValue } from '@chakra-ui/react';
import { useWallet } from '@snx-v3/useBlockchain';

export const PositionsNotConnected = () => {
  const { connect } = useWallet();
  const direction = useBreakpointValue({ base: 'column', md: 'row' });
  const alignment = useBreakpointValue({ base: 'flex-start', md: 'baseline' });

  return (
    <Flex
      w="100%"
      justifyContent={direction === 'row' ? 'space-between' : 'flex-start'}
      direction={direction as SystemProps['flexDirection']}
      alignItems={alignment}
    >
      <Text
        color="gray.500"
        fontWeight={500}
        fontSize="14px"
        lineHeight="14px"
        my="4"
        pl="3"
        whiteSpace={{ base: 'normal', md: 'nowrap' }}
      >
        Please connect wallet to view active positions
      </Text>
      <Button
        size="sm"
        data-cy="connect wallet button"
        onClick={() => {
          connect();
        }}
      >
        Connect Wallet
      </Button>
    </Flex>
  );
};
