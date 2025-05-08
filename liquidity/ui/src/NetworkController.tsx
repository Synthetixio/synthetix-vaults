import { CopyIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Badge,
  Button,
  Divider,
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
      <>
        <Button
          data-cy="connect wallet button"
          onClick={() => connect()}
          type="button"
          size="sm"
          ml={2}
          py={5}
          display={{ base: 'none', md: 'flex' }}
        >
          Connect Wallet
        </Button>
        <IconButton
          aria-label="Wallet"
          data-cy="connect wallet button"
          icon={<WalletIcon />}
          variant="outline"
          borderColor="whiteAlpha.200"
          _hover={{ bg: 'whiteAlpha.200' }}
          display={{ base: 'flex', md: 'none' }}
          onClick={() => connect()}
        />
      </>
    );
  }
  return (
    <Flex>
      <Menu>
        <MenuButton
          as={Button}
          variant="outline"
          colorScheme="gray"
          borderColor="whiteAlpha.200"
          sx={{ '> span': { display: 'flex', alignItems: 'center' } }}
          mr={1}
          px={3}
          display={{ base: 'none', md: 'flex' }}
        >
          <NetworkIcon
            filter={currentNetwork?.isTestnet ? 'grayscale(1)' : ''}
            networkId={notConnected ? 8453 : notSupported ? 0 : currentNetwork?.id}
            size="20px"
          />
          <Text
            fontSize="xs"
            fontWeight={700}
            variant="nav"
            ml={2}
            display={{ base: 'none', md: 'inline-block' }}
          >
            {notSupported ? '' : currentNetwork?.label}
          </Text>
        </MenuButton>
        <MenuList border="1px" borderColor="whiteAlpha.200">
          {mainnets.map(({ id, preset, label }) => (
            <MenuItem
              key={`${id}-${preset}`}
              onClick={() => setNetwork(id)}
              isDisabled={window.$chainId ? window.$chainId !== id : false}
            >
              <NetworkIcon networkId={id} size="20px" />
              <Text variant="nav" ml={4} fontSize="sm">
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
          borderColor="whiteAlpha.200"
          ml={2}
          height={10}
          py="6px"
          px="9.5px"
          whiteSpace="nowrap"
          data-cy="wallet button"
        >
          <Flex alignItems="center" gap={1}>
            <WalletIcon color="white" aria-label="Connected Wallet" />
            <Text
              as="span"
              ml={1}
              color="white"
              fontWeight={700}
              fontSize="xs"
              userSelect="none"
              data-cy="short wallet address"
              display={{ base: 'none', md: 'flex' }}
            >
              {activeWallet.ens?.name || prettyString(activeWallet.address)}
            </Text>
          </Flex>
        </MenuButton>
        <MenuList
          borderStyle="solid"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
          borderRadius="base"
          p={4}
          mt={0}
          mr={{ base: -2, md: 'auto' }}
          w={{ base: 'calc(100vw - 16px)', md: 'auto' }}
        >
          <Flex flexDir="column" w="100%" gap="3">
            <Flex direction="column" gap={2} display={{ base: 'flex', md: 'none' }}>
              <Text fontSize="14px" color="gray.500">
                Network
              </Text>
              <Flex
                direction="row"
                alignItems="center"
                borderRadius="base"
                backgroundColor="whiteAlpha.50"
                p={3}
                justifyContent="flex-start"
                gap={3}
              >
                {mainnets.map(({ id, preset, label }) => (
                  <Flex
                    alignItems="center"
                    key={`${id}-${preset}`}
                    onClick={() => setNetwork(id)}
                    backgroundColor="transparent"
                    gap="8px"
                    borderColor="whiteAlpha.200"
                    bg={currentNetwork?.id === id ? 'whiteAlpha.400' : 'auto'}
                    borderWidth="1px"
                    borderStyle="solid"
                    borderRadius="base"
                    p="8px"
                  >
                    <NetworkIcon networkId={id} size="20px" />
                    <Text
                      variant="nav"
                      color={currentNetwork?.id === id ? 'white' : 'gray.500'}
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      {label}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Flex>
            <Divider display={{ base: 'flex', md: 'none' }} />
            <Flex justifyContent="space-between" gap={3}>
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
              fontWeight={700}
              color="white"
              fontSize="16px"
              alignItems="center"
              border="base"
              backgroundColor="whiteAlpha.50"
              p={3}
              justifyContent="center"
            >
              <Tooltip
                hasArrow
                label={activeWallet.address}
                fontFamily="monospace"
                fontSize="xs"
                placement="top-end"
                closeOnClick={false}
              >
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
              <Flex
                flexDir="column"
                p="2"
                border="1px solid"
                borderColor="gray.900"
                rounded="base"
                gap="2"
              >
                <Flex w="100%" justifyContent="space-between">
                  <Text fontWeight={400} fontSize="14px">
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
                      fontWeight={700}
                      fontSize="16px"
                      cursor="pointer"
                      p="3"
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
        </MenuList>
      </Menu>
    </Flex>
  );
}
