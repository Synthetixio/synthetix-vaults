import { UnsupportedCollateralAlert } from '@snx-v3/CollateralAlert';
import { ManageStats, PositionTitle } from '@snx-v3/Manage';
import { ManagePositionProvider } from '@snx-v3/ManagePositionContext';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { Box, Flex, Link, Text } from '@chakra-ui/react';

import { type VaultPositionPageSchemaType, makeSearch, useParams } from '@snx-v3/useParams';
import React from 'react';
import { Helmet } from 'react-helmet';
import { DepositVault } from '../../lib/DepositVault/DepositVault';
import { BorderBox } from '@snx-v3/BorderBox';
import { WithdrawVault } from '../../lib/WithdrawVault/WithdrawVault';

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
          <Flex flex={1} direction="column" gap={6}>
            <PositionTitle />

            <ManageStats />
          </Flex>
          <Flex width="100%" flex={1} alignSelf="flex-start" flexDirection="column">
            <BorderBox flexDir="column" p={4}>
              <Flex mb={4} flexDir={['column', 'row']} gap={4}>
                <Flex
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
                  h="84px"
                  minH={['90px', '84px']}
                  justifyContent="center"
                  border="1px solid"
                  flexDir="column"
                  alignItems="center"
                  borderColor={params.manageAction === 'deposit' ? 'cyan.500' : 'gray.900'}
                  rounded="base"
                  flex="1"
                  minWidth={['100%', 'auto']}
                  textDecoration="none"
                  _hover={{ textDecoration: 'none' }}
                >
                  <svg
                    width="37"
                    height="36"
                    viewBox="0 0 37 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.875 18C6.875 15.7218 8.72183 13.875 11 13.875H26C28.2782 13.875 30.125 15.7218 30.125 18V27C30.125 29.2782 28.2782 31.125 26 31.125H11C8.72183 31.125 6.875 29.2782 6.875 27V18ZM11 16.125C9.96447 16.125 9.125 16.9645 9.125 18V27C9.125 28.0355 9.96447 28.875 11 28.875H26C27.0355 28.875 27.875 28.0355 27.875 27V18C27.875 16.9645 27.0355 16.125 26 16.125H11Z"
                      fill={params.manageAction === 'deposit' ? '#00D1FF' : 'white'}
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.375 12C11.375 8.06497 14.565 4.875 18.5 4.875C22.435 4.875 25.625 8.06497 25.625 12V16.125H11.375V12ZM18.5 7.125C15.8076 7.125 13.625 9.30761 13.625 12V13.875H23.375V12C23.375 9.30761 21.1924 7.125 18.5 7.125Z"
                      fill={params.manageAction === 'deposit' ? '#00D1FF' : 'white'}
                    />
                  </svg>
                  <Text
                    fontSize="14px"
                    fontWeight={700}
                    mt="2"
                    color={params.manageAction === 'deposit' ? 'cyan.500' : 'white'}
                    textAlign="center"
                    lineHeight="1.1"
                  >
                    Deposit
                  </Text>
                </Flex>
                <Flex
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
                  h="84px"
                  minH={['90px', '84px']}
                  justifyContent="center"
                  border="1px solid"
                  flexDir="column"
                  alignItems="center"
                  borderColor={params.manageAction === 'withdraw' ? 'cyan.500' : 'gray.900'}
                  rounded="base"
                  flex="1"
                  minWidth={['100%', 'auto']}
                  textDecoration="none"
                  _hover={{ textDecoration: 'none' }}
                >
                  <svg
                    width="37"
                    height="36"
                    viewBox="0 0 37 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.60986 29.7349C6.60986 29.942 6.77776 30.1099 6.98486 30.1099L28.7349 30.1099C28.942 30.1099 29.1099 29.942 29.1099 29.7349L29.1099 21.1099L31.3599 21.1099L31.3599 29.7349C31.3599 31.1846 30.1846 32.3599 28.7349 32.3599L6.98486 32.3599C5.53512 32.3599 4.35986 31.1846 4.35986 29.7349L4.35986 21.1099L6.60986 21.1099L6.60986 22.2348L6.60986 29.7349Z"
                      fill={params.manageAction === 'withdraw' ? '#00D1FF' : 'white'}
                    />
                    <path
                      d="M18.9849 26.7349L16.7349 26.7349L16.7349 7.94653L12.3555 12.3259L10.8728 10.6273L17.8599 3.64019L24.8469 10.6273L23.3643 12.3259L18.9849 7.94653L18.9849 26.7349Z"
                      fill={params.manageAction === 'withdraw' ? '#00D1FF' : 'white'}
                    />
                  </svg>

                  <Text
                    fontSize="14px"
                    fontWeight={700}
                    mt="2"
                    color={params.manageAction === 'withdraw' ? 'cyan.500' : 'white'}
                    textAlign="center"
                    lineHeight="1.1"
                  >
                    Withdraw
                  </Text>
                </Flex>
              </Flex>

              {params.manageAction === 'deposit' && <DepositVault />}
              {params.manageAction === 'withdraw' && <WithdrawVault />}
            </BorderBox>
          </Flex>
        </Flex>
      </Box>
    </ManagePositionProvider>
  );
};
