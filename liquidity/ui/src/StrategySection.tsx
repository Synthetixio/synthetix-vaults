import { Flex, Heading, Text, Image, Button, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { TokenIcon } from '@snx-v3/TokenIcon';
import { NetworkIcon, useNetwork } from '@snx-v3/useBlockchain';

export const StrategySection = () => {
  const { network } = useNetwork();

  return (
    <Flex mt={12} flexDirection="column" gap={4}>
      <Heading fontSize="30px" fontFamily="heading" lineHeight="36px">
        Strategies
      </Heading>
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
            <TokenIcon w={40} h={40} symbol="USDC" />
            <NetworkIcon
              position="absolute"
              right={0}
              bottom={0}
              networkId={network?.id}
              size="14px"
            />
          </Flex>
          <Flex flexDirection="column" ml={3} mr="auto">
            <Text
              fontSize="14px"
              color="white"
              fontWeight={700}
              lineHeight="28px"
              fontFamily="heading"
            >
              Delta Neutral
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
          >
            Coming Soon
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
