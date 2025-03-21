import { Box, Flex, Link, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { Borrow } from '@snx-v3/Borrow';
import { Claim } from '@snx-v3/Claim';
import { ClaimModal } from '@snx-v3/ClaimModal';
import { Deposit } from '@snx-v3/Deposit';
import { DepositModal } from '@snx-v3/DepositModal';
import { DepositModalAndromeda } from '@snx-v3/DepositModalAndromeda';
import { ManagePositionContext } from '@snx-v3/ManagePositionContext';
import { Repay, RepayAndromedaDebt } from '@snx-v3/Repay';
import { RepayModal } from '@snx-v3/RepayModal';
import { Undelegate } from '@snx-v3/Undelegate';
import { UndelegateModal } from '@snx-v3/UndelegateModal';
import { useNetwork } from '@snx-v3/useBlockchain';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { useLiquidityPosition } from '@snx-v3/useLiquidityPosition';
import {
  makeSearch,
  ManageActionSchema,
  ManageActionType,
  type LiquidityPositionPageSchemaType,
  useParams,
} from '@snx-v3/useParams';
import { validatePosition } from '@snx-v3/validatePosition';
import { Withdraw, WithdrawAndromeda } from '@snx-v3/Withdraw';
import { wei } from '@synthetixio/wei';
import React, { FormEvent, useCallback } from 'react';
import { COLLATERALACTIONS, DEBTACTIONS } from './actions';

export const ManageAction = ({
  setTxnModalOpen,
  txnModalOpen,
}: {
  setTxnModalOpen: (action?: ManageActionType) => void;
  txnModalOpen?: ManageActionType;
}) => {
  const [params, setParams] = useParams<LiquidityPositionPageSchemaType>();
  const { network } = useNetwork();

  const { debtChange, collateralChange, setCollateralChange, setDebtChange } =
    React.useContext(ManagePositionContext);

  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { data: liquidityPosition } = useLiquidityPosition({
    accountId: params.accountId,
    collateralType,
  });

  const { isValid } = validatePosition({
    issuanceRatioD18: collateralType?.issuanceRatioD18,
    collateralAmount: liquidityPosition?.collateralAmount,
    collateralPrice: liquidityPosition?.collateralPrice,
    debt: liquidityPosition?.debt,
    collateralChange,
    debtChange,
  });

  const manageActionParam = ManageActionSchema.safeParse(params.manageAction);
  const manageAction = manageActionParam.success ? manageActionParam.data : undefined;
  const debtActions = DEBTACTIONS(network?.preset === 'andromeda');
  const tab = debtActions.some((action) => action.link === manageAction) ? 'debt' : 'collateral';

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      if ((network?.preset === 'andromeda' || isValid) && form.reportValidity()) {
        setTxnModalOpen(manageAction);
      }
    },
    [isValid, manageAction, network?.preset, setTxnModalOpen]
  );

  return (
    <>
      {!txnModalOpen ? (
        <Box>
          <Tabs isFitted index={tab === 'collateral' ? 0 : 1}>
            <TabList>
              <Tab
                as={Link}
                href={`?${makeSearch({
                  page: 'position',
                  collateralSymbol: params.collateralSymbol,
                  manageAction: COLLATERALACTIONS[0].link,
                  accountId: params.accountId,
                })}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (tab !== 'collateral') {
                    setCollateralChange(wei(0));
                    setDebtChange(wei(0));
                  }
                  setParams({
                    page: 'position',
                    collateralSymbol: params.collateralSymbol,
                    manageAction: COLLATERALACTIONS[0].link,
                    accountId: params.accountId,
                  });
                }}
                color={tab === 'collateral' ? 'white' : 'gray.500'}
                fontWeight={700}
                fontSize={['12px', '16px']}
                whiteSpace="nowrap"
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
              >
                Manage Collateral
              </Tab>
              <Tab
                as={Link}
                href={`?${makeSearch({
                  page: 'position',
                  collateralSymbol: params.collateralSymbol,
                  manageAction: debtActions[0].link,
                  accountId: params.accountId,
                })}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (tab !== 'debt') {
                    setCollateralChange(wei(0));
                    setDebtChange(wei(0));
                  }
                  setParams({
                    page: 'position',
                    collateralSymbol: params.collateralSymbol,
                    manageAction: debtActions[0].link,
                    accountId: params.accountId,
                  });
                }}
                color={tab === 'debt' ? 'white' : 'gray.500'}
                fontWeight={700}
                fontSize={['12px', '16px']}
                whiteSpace="nowrap"
                textDecoration="none"
                _hover={{ textDecoration: 'none' }}
              >
                {network?.preset === 'andromeda' ? 'Manage PnL' : 'Manage Debt'}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel px="0">
                <Flex flexDir={['column', 'row']} gap={4}>
                  {COLLATERALACTIONS.map((action) => (
                    <Flex
                      as={Link}
                      href={`?${makeSearch({
                        page: 'position',
                        collateralSymbol: params.collateralSymbol,
                        manageAction: action.link,
                        accountId: params.accountId,
                      })}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setCollateralChange(wei(0));
                        setDebtChange(wei(0));
                        setParams({
                          page: 'position',
                          collateralSymbol: params.collateralSymbol,
                          manageAction: action.link,
                          accountId: params.accountId,
                        });
                      }}
                      h="84px"
                      minH={['90px', '84px']}
                      justifyContent="center"
                      key={action.title.concat('-tab-actions')}
                      border="1px solid"
                      flexDir="column"
                      alignItems="center"
                      borderColor={manageAction === action.link ? 'cyan.500' : 'gray.900'}
                      rounded="base"
                      flex="1"
                      minWidth={['100%', 'auto']}
                      textDecoration="none"
                      _hover={{ textDecoration: 'none' }}
                    >
                      {action.icon(manageAction === action.link ? 'cyan' : 'white')}
                      <Text
                        fontSize="14px"
                        fontWeight={700}
                        mt="2"
                        color={manageAction === action.link ? 'cyan.500' : 'white'}
                        textAlign="center"
                        lineHeight="1.1"
                      >
                        {action.title}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </TabPanel>
              <TabPanel px="0">
                <Flex flexDir={['column', 'row']} gap={4}>
                  {debtActions.map((action) => (
                    <Flex
                      as={Link}
                      href={`?${makeSearch({
                        page: 'position',
                        collateralSymbol: params.collateralSymbol,
                        manageAction: action.link,
                        accountId: params.accountId,
                      })}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setCollateralChange(wei(0));
                        setDebtChange(wei(0));
                        setParams({
                          page: 'position',
                          collateralSymbol: params.collateralSymbol,
                          manageAction: action.link,
                          accountId: params.accountId,
                        });
                      }}
                      flex="1"
                      h="84px"
                      minH={['90px', '84px']}
                      justifyContent="center"
                      key={action.title.concat('-tab-actions')}
                      border="1px solid"
                      flexDir="column"
                      alignItems="center"
                      borderColor={manageAction === action.link ? 'cyan.500' : 'gray.900'}
                      rounded="base"
                      cursor="pointer"
                      minWidth={['100%', 'auto']}
                      textDecoration="none"
                      _hover={{ textDecoration: 'none' }}
                    >
                      {action.icon(manageAction === action.link ? 'cyan' : 'white')}
                      <Text
                        fontSize="14px"
                        fontWeight={700}
                        mt="2"
                        color={manageAction === action.link ? 'cyan.500' : 'white'}
                        textAlign="center"
                        lineHeight="1.1"
                      >
                        {action.title}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </TabPanel>
            </TabPanels>
          </Tabs>

          {manageAction === 'repay' && network?.preset !== 'andromeda' ? (
            // These components do not set txnModalOpen
            <Flex direction="column">
              <Repay />
            </Flex>
          ) : manageAction === 'claim' && network?.preset !== 'andromeda' ? (
            <Flex direction="column">
              <Borrow />
            </Flex>
          ) : manageAction === 'withdraw' && network?.preset === 'andromeda' ? (
            <Flex direction="column">
              <WithdrawAndromeda />
            </Flex>
          ) : manageAction === 'withdraw' && network?.preset !== 'andromeda' ? (
            <Flex direction="column">
              <Withdraw />
            </Flex>
          ) : manageAction === 'withdraw-debt' && network?.preset !== 'andromeda' ? (
            <Flex direction="column">
              <Withdraw isDebtWithdrawal />
            </Flex>
          ) : (
            <Flex direction="column" as="form" onSubmit={onSubmit}>
              {manageAction === 'claim' ? <Claim /> : null}
              {manageAction === 'deposit' ? <Deposit /> : null}
              {manageAction === 'repay' && network?.preset === 'andromeda' ? (
                <RepayAndromedaDebt />
              ) : null}
              {manageAction === 'repay' && network?.preset !== 'andromeda' ? <Repay /> : null}
              {manageAction === 'undelegate' ? <Undelegate /> : null}
            </Flex>
          )}
        </Box>
      ) : null}

      {txnModalOpen === 'repay' && network?.preset === 'andromeda' ? (
        <RepayModal
          onClose={() => {
            setCollateralChange(wei(0));
            setDebtChange(wei(0));
            setTxnModalOpen(undefined);
          }}
        />
      ) : null}
      {txnModalOpen === 'claim' ? (
        <ClaimModal
          onClose={() => {
            setCollateralChange(wei(0));
            setDebtChange(wei(0));
            setTxnModalOpen(undefined);
          }}
        />
      ) : null}
      {txnModalOpen === 'deposit' && network?.preset !== 'andromeda' ? (
        <DepositModal
          onClose={() => {
            setCollateralChange(wei(0));
            setDebtChange(wei(0));
            setTxnModalOpen(undefined);
          }}
        />
      ) : null}
      {txnModalOpen === 'deposit' && network?.preset === 'andromeda' ? (
        <DepositModalAndromeda
          onClose={() => {
            setCollateralChange(wei(0));
            setDebtChange(wei(0));
            setTxnModalOpen(undefined);
          }}
        />
      ) : null}
      {txnModalOpen === 'undelegate' ? (
        <UndelegateModal
          onClose={() => {
            setCollateralChange(wei(0));
            setDebtChange(wei(0));
            setTxnModalOpen(undefined);
          }}
        />
      ) : null}
    </>
  );
};
