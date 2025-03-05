import { FC } from 'react';
import { Button, Flex, Heading, Text, Image } from '@chakra-ui/react';
import { useWallet } from '@snx-v3/useBlockchain';

export const ConnectBox: FC = () => {
  const { connect } = useWallet();

  return (
    <Flex
      flexWrap="wrap"
      columnGap={10}
      mt={12}
      p={10}
      justifyContent="space-between"
      border="1px solid"
      borderColor="gray.900"
      borderRadius="6px"
      backgroundColor="navy.700"
      position="relative"
    >
      <Flex flexDirection="column" gap="24px" justifyContent="center">
        <Flex flexDirection="column">
          <Heading color="gray.50" maxWidth="40rem" fontSize={['24px', '30px']}>
            Connect your wallet to get started
          </Heading>
          <Text color="gray.500" fontSize="1rem" lineHeight={6} fontFamily="heading" mt="1rem">
            Get access to Liquidity, Strategies and Staking
          </Text>
        </Flex>
        <Button
          maxW="360px"
          onClick={() => {
            connect();
          }}
        >
          Connect Wallet
        </Button>
      </Flex>
      <Flex h={['auto', 60]}>
        <Image
          display={['none', 'block']}
          position="absolute"
          top={0}
          right={0}
          height="100%"
          rounded="8px"
          src="start-background.png"
          width={610}
        />
      </Flex>
    </Flex>
  );
};
