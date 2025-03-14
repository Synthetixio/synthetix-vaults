import { Flex, Heading, Text, Image, Button, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';

export const StakingSection = () => {
  return (
    <Flex mt={12} flexDirection="column" gap={4}>
      <Heading fontSize="30px" fontFamily="heading" lineHeight="36px">
        SNX Staking
      </Heading>
      <Text color="gray.500" fontSize="1rem" lineHeight={6} fontFamily="heading" mt="1rem">
        Stake your SNX in the new delegate staking pool to earn staking yield and extra rewards
      </Text>
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
          <Image
            src="https://assets.synthetix.io/snx/SNX.svg"
            height="40px"
            width="40px"
            boxShadow="0px 0px 15px 0px rgba(0, 209, 255, 0.60)"
            borderRadius="50%"
            alt="SNX"
          />

          <Flex flexDirection="column" ml={3}>
            <Text
              color="white"
              fontWeight={700}
              lineHeight="1.25rem"
              fontFamily="heading"
              fontSize="sm"
            >
              SNX 420 Pool
            </Text>
            <Text color="gray.500" fontFamily="heading" fontSize="0.75rem" lineHeight="1rem">
              The 420 pool starts generating yield for you from Ethena and other yield sources
              immediately
            </Text>
          </Flex>
        </Flex>

        <Flex width={['100px', '100px', '160px']} justifyContent="flex-end">
          <Button
            as={Link}
            href="https://420.synthetix.io/"
            target="_blank"
            variant="outline"
            color="cyan.500"
            size="sm"
            rightIcon={
              <ExternalLinkIcon
                color="cyan.500"
                _hover={{ color: 'cyan.500' }}
                _active={{ color: 'cyan.500' }}
              />
            }
          >
            Learn More
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
