import { FC } from 'react';
import { Button, Flex, Heading, Text, Image } from '@chakra-ui/react';
import { useWallet } from '@snx-v3/useBlockchain';
import BackgroundImage from './background.png';

export const ConnectBox: FC = () => {
  const { connect } = useWallet();

  return (
    <Flex
      flexWrap="wrap"
      columnGap={10}
      mt={12}
      justifyContent="space-between"
      borderRadius="md"
      backgroundColor="navy.700"
      position="relative"
    >
      <Flex p={10} flexDirection="column" gap="24px" justifyContent="center">
        <Flex flexDirection="column">
          <Heading
            color="white"
            fontSize={['2xl', '3xl']}
            letterSpacing="tight"
            fontWeight="medium"
          >
            Connect your wallet to get started
          </Heading>
          <Text color="gray.500" fontSize="1rem" lineHeight={6} fontFamily="heading" mt="1rem">
            Get access to Liquidity, Strategies, Staking and more
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
      <Flex
        flex={{ base: 0, sm: 0, md: 1 }}
        h={['auto', 80]}
        direction="column"
        display={{ base: 'none', sm: 'none', md: 'flex' }}
        position="relative"
        overflow="hidden"
      >
        <Image
          rounded="6px"
          src={BackgroundImage}
          width="100%"
          height="100%"
          objectFit="cover"
          style={{
            maskImage: 'linear-gradient(270deg, #000000 50%, rgba(0, 0, 0, 0) 100%)',
          }}
        />
      </Flex>
    </Flex>
  );
};
