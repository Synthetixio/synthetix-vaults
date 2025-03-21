import { Flex, Heading, Text, Button, Image, Tooltip, Link } from '@chakra-ui/react';
import { BASE_ANDROMEDA, NetworkIcon, useNetwork } from '@snx-v3/useBlockchain';
import { useStrategyPoolsList } from '@snx-v3/useStrategyPoolsList';

import DeltaNeutralIcon from './assets/delta-neutral.svg';
import { InfoIcon } from '@chakra-ui/icons';
import { makeSearch, useParams } from '@snx-v3/useParams';
import { formatNumberToUsdShort } from '@snx-v3/formatters';

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

  const [params] = useParams();
  const btnDisabled = !network;

  const { data: pools } = useStrategyPoolsList();

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
      <Flex mt={6} maxW="100%" overflowX="auto" direction="column" gap={4}>
        <Flex flexDir="row" minW="800px" gap={4} py={3} px={4} whiteSpace="nowrap">
          <HeaderText width="260px" justifyContent="left">
            Vault
          </HeaderText>
          <HeaderText width="140px">Vault TVL</HeaderText>
          <Flex justifyContent="flex-end" alignItems="center" width="140px" color="gray.600">
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
          <Flex justifyContent="flex-end" alignItems="center" width="140px" color="gray.600">
            <HeaderText fontSize="xs" fontWeight="bold" mr={1}>
              Deposited
            </HeaderText>
            <Tooltip
              label={
                <Text textAlign="left">
                  Deposits can be withdrawn 24h after unlocking or any subsequent account activity
                </Text>
              }
            >
              <InfoIcon w="10px" h="10px" />
            </Tooltip>
          </Flex>
          <HeaderText width="260px">Performance</HeaderText>
          <Flex minW="120px" flex="1" />
        </Flex>
      </Flex>
      <Flex
        w="100%"
        border="1px solid"
        borderColor="gray.900"
        rounded="base"
        bg="navy.700"
        py={4}
        px={4}
        gap={4}
        flexDirection={['column', 'row']}
        alignItems={['flex-start', 'center']}
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
              {targetNetwork?.name} Network
            </Text>
          </Flex>
        </Flex>

        <Flex width={['100%', 'auto']} justifyContent="flex-end">
          <Button
            variant="solid"
            width="100%"
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
      {pools?.map((pool) => (
        <Flex
          key={pool.name}
          w="100%"
          border="1px solid"
          borderColor="gray.900"
          rounded="base"
          bg="navy.700"
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
              page: 'vault-position',
              collateralSymbol: 'USDC',
              symbol: pool.displaySymbol,
              manageAction: 'deposit',
              accountId: params.accountId,
            })}`}
          >
            <Flex position="relative">
              <Image
                src={`https://assets.synthetix.io/markets/${pool.token}.svg`}
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
                {pool.displaySymbol}
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
            width="140px"
            justifyContent="flex-end"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            {formatNumberToUsdShort(pool.totalAssets, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Flex>
          <Flex
            width="140px"
            justifyContent="flex-end"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            -
          </Flex>
          <Flex
            width="140px"
            justifyContent="flex-end"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            -
          </Flex>
          <Flex
            width="260px"
            justifyContent="flex-end"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            -
          </Flex>

          <Flex width={['100%', '120px']} flex="auto" justifyContent="flex-end">
            <Button
              as={Link}
              href={`?${makeSearch({
                page: 'vault-position',
                collateralSymbol: 'USDC',
                symbol: pool.displaySymbol,
                manageAction: 'deposit',
                accountId: params.accountId,
              })}`}
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
              minWidth="96px"
            >
              Deposit
            </Button>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
