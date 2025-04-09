import { CopyIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  Flex,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { prettyString, renderAccountId } from '@snx-v3/format';
import { WalletIcon } from '@snx-v3/icons';
import { Tooltip } from '@snx-v3/Tooltip';
import { useAccounts } from '@snx-v3/useAccounts';
import { NetworkIcon, NETWORKS, useNetwork, useWallet } from '@snx-v3/useBlockchain';
import { makeSearch, useParams } from '@snx-v3/useParams';
import { ethers } from 'ethers';
import React from 'react';

const mainnets = NETWORKS.filter(({ isSupported, isTestnet }) => isSupported && !isTestnet);

export function NetworkController() {
  const [params, setParams] = useParams();

  const [toolTipLabel, setTooltipLabel] = React.useState('Copy');
  const { activeWallet, walletsInfo, connect, disconnect } = useWallet();
  const { network: currentNetwork, setNetwork } = useNetwork();
  const { data: accounts, isPending: isPendingAccounts } = useAccounts();

  const paramsAccountId = React.useMemo(() => {
    try {
      if (params.accountId && params.accountId.length > 0) {
        return ethers.BigNumber.from(params.accountId);
      }
    } catch {
      // malformed account id in url
    }
  }, [params.accountId]);

  const notConnected = !activeWallet;
  const notSupported = activeWallet && !currentNetwork;

  React.useEffect(() => {
    if (notConnected) {
      const { accountId: _, ...newParams } = params;
      setParams(newParams);
      return;
    }
    if (!isPendingAccounts && accounts) {
      if (accounts.length > 0 && !params.accountId) {
        setParams({ ...params, accountId: accounts[0].toString() });
        return;
      }
      if (
        accounts.length > 0 &&
        paramsAccountId &&
        !accounts.some((account) => account.eq(paramsAccountId))
      ) {
        setParams({ ...params, accountId: accounts[0].toString() });
        return;
      }
      if (!accounts.length) {
        const { accountId: _, ...newParams } = params;
        setParams(newParams);
        return;
      }
    }
  }, [accounts, isPendingAccounts, notConnected, params, paramsAccountId, setParams]);

  React.useEffect(() => {
    if (window.$magicWallet) {
      connect({ autoSelect: { disableModals: true, label: 'MetaMask' } });
    }
  }, [connect]);

  if (!activeWallet) {
    return (
      <Button
        data-cy="connect wallet button"
        onClick={() => connect()}
        type="button"
        size="sm"
        ml={2}
        py={5}
      >
        Connect Wallet
      </Button>
    );
  }
  return (
    <Flex>
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          colorScheme="gray"
          sx={{ '> span': { display: 'flex', alignItems: 'center' } }}
          mr={1}
          px={3}
        >
          <NetworkIcon
            filter={currentNetwork?.isTestnet ? 'grayscale(1)' : ''}
            networkId={notConnected ? 8453 : notSupported ? 0 : currentNetwork?.id}
            size="20px"
          />
          <Text
            variant="nav"
            display={{ base: 'none', md: 'inline-block' }}
            ml={2}
            fontSize="xs"
            fontWeight="bold"
          >
            {notSupported ? '' : currentNetwork?.label}
          </Text>
        </MenuButton>
        <MenuList border="1px" borderColor="whiteAlpha.200" backgroundColor="navy.700">
          {mainnets.map(({ id, preset, label }) => (
            <MenuItem
              key={`${id}-${preset}`}
              onClick={() => setNetwork(id)}
              isDisabled={window.$chainId ? window.$chainId !== id : false}
              backgroundColor="transparent"
            >
              <NetworkIcon networkId={id} size="20px" />
              <Text variant="nav" ml={2} fontSize="sm">
                {label}
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Menu placement="bottom-end">
        <MenuButton
          as={Button}
          variant="outline"
          colorScheme="gray"
          ml={2}
          height={10}
          py="6px"
          px="9.5px"
          whiteSpace="nowrap"
          data-cy="wallet button"
        >
          <WalletIcon color="white" />
          <Text
            as="span"
            ml={1}
            color="white"
            fontWeight={700}
            fontSize="xs"
            userSelect="none"
            data-cy="short wallet address"
          >
            {activeWallet.ens?.name || prettyString(activeWallet.address)}
          </Text>
        </MenuButton>
        <MenuList>
          <Flex
            border="1px solid"
            rounded="base"
            borderColor="whiteAlpha.200"
            w="320px"
            _hover={{ bg: 'navy.700' }}
            backgroundColor="navy.700"
            opacity={1}
            p="4"
          >
            <Flex flexDir="column" w="100%" gap="2">
              <Flex justifyContent="space-between">
                <Text fontSize="14px" color="gray.500">
                  Connected with {walletsInfo?.label}
                </Text>
                <Button
                  onClick={() => {
                    if (walletsInfo) {
                      disconnect(walletsInfo);
                    }
                  }}
                  size="xs"
                  variant="outline"
                  colorScheme="gray"
                  color="white"
                >
                  Disconnect
                </Button>
              </Flex>
              <Flex
                p={3}
                bg="whiteAlpha.50"
                rounded="md"
                fontWeight={700}
                color="white"
                fontSize="16px"
                alignItems="center"
                justifyContent="center"
              >
                <Tooltip label={activeWallet.address} fontFamily="monospace" fontSize="0.9em">
                  <Text>{prettyString(activeWallet.address)}</Text>
                </Tooltip>
                <Tooltip label={toolTipLabel} closeOnClick={false}>
                  <CopyIcon
                    ml="2"
                    onClick={() => {
                      navigator.clipboard.writeText(activeWallet.address);
                      setTooltipLabel('Copied');
                      setTimeout(() => {
                        setTooltipLabel('Copy');
                      }, 10000);
                    }}
                  />
                </Tooltip>
              </Flex>

              {accounts && accounts.length > 0 ? (
                <Flex flexDir="column" p={3} rounded="base" gap={3} backgroundColor="whiteAlpha.50">
                  <Flex w="100%" justifyContent="space-between">
                    <Text fontWeight={400} fontSize="14px" color="gray.500">
                      {accounts.length > 1 ? 'Accounts' : 'Account'}
                    </Text>
                    <Link
                      href={`?${makeSearch({ page: 'settings', accountId: params.accountId })}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setParams({ page: 'settings', accountId: params.accountId });
                      }}
                    >
                      <IconButton
                        variant="outline"
                        colorScheme="gray"
                        size="xs"
                        icon={<SettingsIcon />}
                        aria-label="account settings"
                      />
                    </Link>
                  </Flex>
                  <Flex data-cy="accounts list" flexDir="column">
                    {accounts?.map((accountId) => (
                      <Text
                        key={accountId.toString()}
                        display="flex"
                        alignItems="center"
                        color="white"
                        fontSize="16px"
                        cursor="pointer"
                        data-cy="account id"
                        data-account-id={accountId}
                        _hover={{ bg: 'whiteAlpha.300' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setParams({ ...params, accountId: accountId.toString() });
                        }}
                      >
                        {renderAccountId(accountId)}
                        {paramsAccountId && accountId.eq(paramsAccountId) ? (
                          <Badge ml={2} colorScheme="cyan" variant="outline">
                            Connected
                          </Badge>
                        ) : null}
                      </Text>
                    ))}
                  </Flex>
                </Flex>
              ) : null}
            </Flex>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
