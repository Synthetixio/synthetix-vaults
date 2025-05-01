import { UnsupportedCollateralAlert } from '@snx-v3/CollateralAlert';
import { ManagePositionProvider } from '@snx-v3/ManagePositionContext';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { Box, Flex, Link, Tab, TabList, Tabs } from '@chakra-ui/react';

import { type VaultPositionPageSchemaType, makeSearch, useParams } from '@snx-v3/useParams';
import React from 'react';
import { Helmet } from 'react-helmet';
import { FundingRateVaultDeposit } from './components/FundingRateVaultDeposit';
import { BorderBox } from '@snx-v3/BorderBox';
import { FundingRateVaultWithdraw } from './components/FundingRateVaultWithdraw';
import { FundingRateVaultInfo } from './components/FundingRateVaultInfo';
import { FundingRateVaultTransactions } from './components/FundingRateVaultTransactions';
import { FundingRateVaultFees } from './components/FundingRateVaultFees';
import { useFundingRateVaultData } from '@snx-v3/useFundingRateVaultData';
import { FundingRateVaultUserInfo } from './components/FundingRateVaultUserInfo';
// import { TvlChart } from '../../lib/Vault/TVLChart/TVLChart';

export const FundingRateVaultPage = () => {
  const [params, setParams] = useParams<VaultPositionPageSchemaType>();

  const { data: vaultData } = useFundingRateVaultData(params.vaultAddress);
  const { data: collateralType, isPending: isPendingCollateralType } = useCollateralType(
    params.collateralSymbol
  );

  return (
    <ManagePositionProvider>
      {vaultData && (
        <Helmet>
          <title>{vaultData.name}</title>
          <meta name="description" content={`Synthetix Vaults - ${vaultData.name}`} />
        </Helmet>
      )}
      <UnsupportedCollateralAlert isOpen={!isPendingCollateralType && !collateralType} />
      <Box mb={12} mt={6}>
        <Flex mt={['0', '6']} flexDirection={['column', 'column', 'row']} gap={4}>
          <Flex width="100%" flex={1} alignSelf="flex-start" flexDirection="column" gap={6}>
            <FundingRateVaultInfo vaultData={vaultData} />
            {/* <TvlChart /> */}
          </Flex>

          <Flex width="100%" flex={1} alignSelf="flex-start" flexDirection="column" gap={6}>
            <BorderBox border="none" flexDir="column" p={['4', '6']}>
              <Tabs isFitted index={params.manageAction === 'deposit' ? 0 : 1}>
                <TabList borderBottomColor="whiteAlpha.200">
                  <Tab
                    as={Link}
                    href={`?${makeSearch({
                      page: 'vault-position',
                      collateralSymbol: params.collateralSymbol,
                      vaultAddress: params.vaultAddress,
                      manageAction: 'deposit',
                      accountId: params.accountId,
                    })}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setParams({
                        page: 'vault-position',
                        collateralSymbol: params.collateralSymbol,
                        vaultAddress: params.vaultAddress,
                        manageAction: 'deposit',
                        accountId: params.accountId,
                      });
                    }}
                    color={params.manageAction === 'deposit' ? 'white' : 'gray.500'}
                    fontWeight={700}
                    fontSize="md"
                    whiteSpace="nowrap"
                    textDecoration="none"
                    _hover={{ textDecoration: 'none' }}
                    _focus={{ outline: 'none', boxShadow: 'none' }}
                  >
                    Deposit
                  </Tab>
                  <Tab
                    as={Link}
                    href={`?${makeSearch({
                      page: 'vault-position',
                      collateralSymbol: params.collateralSymbol,
                      vaultAddress: params.vaultAddress,
                      manageAction: 'withdraw',
                      accountId: params.accountId,
                    })}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setParams({
                        page: 'vault-position',
                        collateralSymbol: params.collateralSymbol,
                        vaultAddress: params.vaultAddress,
                        manageAction: 'withdraw',
                        accountId: params.accountId,
                      });
                    }}
                    color={params.manageAction === 'withdraw' ? 'white' : 'gray.500'}
                    fontWeight={700}
                    fontSize="md"
                    whiteSpace="nowrap"
                    textDecoration="none"
                    _hover={{ textDecoration: 'none' }}
                    _focus={{ outline: 'none', boxShadow: 'none' }}
                  >
                    Withdraw
                  </Tab>
                </TabList>
              </Tabs>

              {params.manageAction === 'deposit' && (
                <FundingRateVaultDeposit vaultData={vaultData} />
              )}
              {params.manageAction === 'withdraw' && (
                <FundingRateVaultWithdraw vaultData={vaultData} />
              )}
            </BorderBox>
            <FundingRateVaultUserInfo vaultData={vaultData} />
          </Flex>
        </Flex>

        <FundingRateVaultTransactions vaultData={vaultData} />
        {vaultData && <FundingRateVaultFees vaultData={vaultData} />}
      </Box>
    </ManagePositionProvider>
  );
};
