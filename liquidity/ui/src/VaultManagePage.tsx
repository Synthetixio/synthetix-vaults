import { UnsupportedCollateralAlert } from '@snx-v3/CollateralAlert';
import { ManagePositionProvider } from '@snx-v3/ManagePositionContext';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { Box, Flex, Link, Tab, TabList, Tabs } from '@chakra-ui/react';

import { type VaultPositionPageSchemaType, makeSearch, useParams } from '@snx-v3/useParams';
import React from 'react';
import { Helmet } from 'react-helmet';
import { DepositVault } from '../../lib/Vault/DepositVault/DepositVault';
import { BorderBox } from '@snx-v3/BorderBox';
import { WithdrawVault } from '../../lib/Vault/WithdrawVault/WithdrawVault';
import { VaultPositionStats } from '../../lib/Vault/VaultPositionStats/VaultPositionStats';
import { VaultInfo } from '../../lib/Vault/VaultInfo/VaultInfo';
import { VaultHistory } from '../../lib/Vault/VaultHistory/VaultHistory';

export const VaultManagePage = () => {
  const [params, setParams] = useParams<VaultPositionPageSchemaType>();

  const { data: collateralType, isPending: isPendingCollateralType } = useCollateralType(
    params.collateralSymbol
  );

  return (
    <ManagePositionProvider>
      <Helmet>
        <title>{`Synthetix ${params.symbol} Position`}</title>
        <meta name="description" content={`Synthetix Vaults - ${params.symbol} Position`} />
      </Helmet>
      <UnsupportedCollateralAlert isOpen={!isPendingCollateralType && !collateralType} />
      <Box mb={12} mt={6}>
        <Flex mt={6} flexDirection={['column', 'column', 'row']} gap={4}>
          <VaultInfo />

          <Flex width="100%" flex={1} alignSelf="flex-start" flexDirection="column" gap={6}>
            <BorderBox border="none" flexDir="column" p={6}>
              <Tabs isFitted index={params.manageAction === 'deposit' ? 0 : 1}>
                <TabList>
                  <Tab
                    as={Link}
                    href={`?${makeSearch({
                      page: 'vault-position',
                      collateralSymbol: params.collateralSymbol,
                      symbol: params.symbol,
                      manageAction: 'deposit',
                      accountId: params.accountId,
                    })}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setParams({
                        page: 'vault-position',
                        collateralSymbol: params.collateralSymbol,
                        symbol: params.symbol,
                        manageAction: 'deposit',
                        accountId: params.accountId,
                      });
                    }}
                    color={params.manageAction === 'deposit' ? 'white' : 'gray.500'}
                    fontWeight={700}
                    fontSize={['12px', '16px']}
                    whiteSpace="nowrap"
                    textDecoration="none"
                    _hover={{ textDecoration: 'none' }}
                  >
                    Deposit
                  </Tab>
                  <Tab
                    as={Link}
                    href={`?${makeSearch({
                      page: 'vault-position',
                      collateralSymbol: params.collateralSymbol,
                      symbol: params.symbol,
                      manageAction: 'withdraw',
                      accountId: params.accountId,
                    })}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setParams({
                        page: 'vault-position',
                        collateralSymbol: params.collateralSymbol,
                        symbol: params.symbol,
                        manageAction: 'withdraw',
                        accountId: params.accountId,
                      });
                    }}
                    color={params.manageAction === 'withdraw' ? 'white' : 'gray.500'}
                    fontWeight={700}
                    fontSize={['12px', '16px']}
                    whiteSpace="nowrap"
                    textDecoration="none"
                    _hover={{ textDecoration: 'none' }}
                  >
                    Withdraw
                  </Tab>
                </TabList>
              </Tabs>

              {params.manageAction === 'deposit' && <DepositVault />}
              {params.manageAction === 'withdraw' && <WithdrawVault />}
            </BorderBox>

            <VaultPositionStats />
          </Flex>
        </Flex>

        <VaultHistory />
      </Box>
    </ManagePositionProvider>
  );
};
