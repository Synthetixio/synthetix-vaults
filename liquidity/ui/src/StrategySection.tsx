import { Flex, Heading, Text, Button, Image, Tooltip, Link } from '@chakra-ui/react';
import { BASE_ANDROMEDA, NetworkIcon, useNetwork } from '@snx-v3/useBlockchain';
import { useStrategyPoolsList } from '@snx-v3/useStrategyPoolsList';

import { InfoIcon } from '@chakra-ui/icons';
import { makeSearch, useParams } from '@snx-v3/useParams';
import { currency } from '@snx-v3/format';
import { wei } from '@synthetixio/wei';
import { formatNumberShort } from '@snx-v3/formatters';
import { PoolCardsLoading } from '@snx-v3/Pools/PoolCardsLoading';

function HeaderText({ ...props }) {
  return (
    <Flex
      color="gray.600"
      fontFamily="heading"
      fontSize="12px"
      lineHeight="16px"
      letterSpacing={0.6}
      fontWeight={700}
      alignItems="center"
      justifyContent="right"
      {...props}
    />
  );
}

export const StrategySection = () => {
  const { network } = useNetwork();
  const targetNetwork = network || BASE_ANDROMEDA;

  const [params, setParams] = useParams();
  const btnDisabled = !network;

  const pools = useStrategyPoolsList();

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
        maxW="100%"
        overflowX="auto"
        direction="column"
        gap={4}
        p={['4', '6']}
        backgroundColor="navy.700"
        borderRadius="md"
      >
        <Flex flexDir="row" gap={4} py={3} px={4} whiteSpace="nowrap">
          <HeaderText width="260px" justifyContent="left">
            Vault
          </HeaderText>
          <HeaderText width="180px" display={['none', 'flex']}>
            Vault TVL
          </HeaderText>
          <Flex
            justifyContent="flex-end"
            alignItems="center"
            width="180px"
            color="gray.600"
            display={['none', 'flex']}
          >
            <HeaderText fontSize="xs" fontWeight="bold" mr={1}>
              APR
            </HeaderText>
            <Tooltip
              label={
                <Text textAlign="left">
                  APR is averaged over the trailing 28 days and is comprised of both performance and
                  rewards
                </Text>
              }
            >
              <InfoIcon w="10px" h="10px" />
            </Tooltip>
          </Flex>
          <Flex
            justifyContent="flex-end"
            alignItems="center"
            width="180px"
            color="gray.600"
            display={['none', 'flex']}
          >
            <HeaderText fontSize="xs" fontWeight="bold" mr={1}>
              Deposited
            </HeaderText>
          </Flex>
          <Flex minW="120px" flex="1" />
        </Flex>
        {!pools && <PoolCardsLoading />}
        {pools &&
          pools.map((pool) => (
            <Flex
              key={`${pool.symbol}`}
              w="100%"
              rounded="md"
              bg="whiteAlpha.50"
              py={4}
              px={4}
              gap={4}
              flexDirection={['column', 'row']}
              alignItems={['flex-start', 'center']}
            >
              <Flex
                alignItems="center"
                width="260px"
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
                as={Link}
                href={`?${makeSearch({
                  page: 'funding-rate-vault',
                  collateralSymbol: 'USDC',
                  manageAction: 'deposit',
                  accountId: params.accountId,
                  vaultAddress: pool.address,
                })}`}
              >
                <Flex position="relative" flexShrink={0}>
                  <Image
                    src={`https://assets.synthetix.io/markets/${pool.perpsMarket}.svg`}
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
                    {pool.name}
                  </Text>
                  <Text
                    textTransform="capitalize"
                    fontSize="xs"
                    color="gray.500"
                    fontFamily="heading"
                    lineHeight="20px"
                  >
                    {targetNetwork?.name} Network
                  </Text>
                </Flex>
              </Flex>
              <Flex
                width="180px"
                alignItems="center"
                justifyContent="flex-end"
                display={['none', 'flex']}
              >
                <Text
                  fontFamily="heading"
                  fontSize="14px"
                  lineHeight="20px"
                  fontWeight="medium"
                  color="white"
                  textAlign="right"
                >
                  {`$${currency(wei(pool.totalAssets, 6))}`}
                </Text>
              </Flex>
              <Flex
                width="180px"
                justifyContent="flex-end"
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
                display={['none', 'flex']}
              >
                {`${formatNumberShort(pool.apr * 100)}%`}
              </Flex>
              <Flex
                width="180px"
                justifyContent="flex-end"
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
                display={['none', 'flex']}
              >
                {`$${currency(wei(pool.balanceOf).mul(pool.exchangeRate))}`}
              </Flex>

              <Flex width={['100%', '120px']} flex="auto" justifyContent="flex-end">
                <Button
                  as={Link}
                  href={`?${makeSearch({
                    page: 'funding-rate-vault',
                    vaultAddress: pool.address,
                    collateralSymbol: 'USDC',
                    manageAction: 'deposit',
                    accountId: params.accountId,
                  })}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setParams({
                      page: 'funding-rate-vault',
                      vaultAddress: pool.address,
                      collateralSymbol: 'USDC',
                      manageAction: 'deposit',
                      accountId: params.accountId,
                    });
                  }}
                  size="sm"
                  height="32px"
                  py="10px"
                  px={2}
                  whiteSpace="nowrap"
                  borderRadius="4px"
                  fontFamily="heading"
                  fontWeight={700}
                  fontSize="14px"
                  lineHeight="20px"
                  color="black"
                  textDecoration="none"
                  _hover={{ textDecoration: 'none', color: 'black' }}
                  isDisabled={btnDisabled}
                  _disabled={{
                    bg: 'gray.900',
                    backgroundImage: 'none',
                    color: 'gray.500',
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  }}
                  minWidth={['100%', '96px']}
                  width={['100%', 'auto']}
                >
                  Deposit
                </Button>
              </Flex>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};
