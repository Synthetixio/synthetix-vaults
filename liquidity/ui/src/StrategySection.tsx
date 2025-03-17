import { Flex, Heading, Text, Button, Image } from '@chakra-ui/react';
import { NetworkIcon, useNetwork } from '@snx-v3/useBlockchain';

import DeltaNeutralIcon from './assets/delta-neutral.svg';

export const StrategySection = () => {
  const { network } = useNetwork();

  return (
    <Flex mt={16} flexDirection="column" gap={4}>
      <Flex flexDirection="column">
        <Heading
          fontSize="3xl"
          fontFamily="heading"
          fontWeight="medium"
          letterSpacing="tight"
          color="white"
        >
          Interest Rate Strategies
        </Heading>
        <Text color="gray.500" fontSize="1rem" lineHeight={6} fontFamily="heading" mt="1rem">
          Capture the funding rates on Synthetix Exchange across a range of assets and any staking
          yield
        </Text>
      </Flex>
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
        <Flex
          alignItems="center"
          flex="1"
          textDecoration="none"
          _hover={{ textDecoration: 'none' }}
        >
          <Flex position="relative">
            <Image
              src={DeltaNeutralIcon}
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
            <Text fontSize="md" color="white" fontWeight={700} fontFamily="heading">
              Mega Vault
            </Text>
            <Text
              textTransform="capitalize"
              fontSize="xs"
              color="gray.500"
              fontFamily="heading"
              lineHeight="20px"
            >
              {network?.name} Network
            </Text>
          </Flex>
        </Flex>

        <Flex width={['100px', '100px', '160px']} justifyContent="flex-end">
          <Button
            variant="solid"
            isDisabled
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
    </Flex>
  );
};
