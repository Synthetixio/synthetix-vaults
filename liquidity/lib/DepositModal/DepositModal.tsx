import { ArrowBackIcon } from '@chakra-ui/icons';
import { Button, Divider, Link, Text, useToast } from '@chakra-ui/react';
import { Amount } from '@snx-v3/Amount';
import { ChangeStat } from '@snx-v3/ChangeStat';
import { ZEROWEI } from '@snx-v3/constants';
import { ContractError } from '@snx-v3/ContractError';
import { CRatioChangeStat } from '@snx-v3/CRatioBar';
import { currency } from '@snx-v3/format';
import { LiquidityPositionUpdated } from '@snx-v3/Manage';
import { ManagePositionContext } from '@snx-v3/ManagePositionContext';
import { Multistep } from '@snx-v3/Multistep';
import { TransactionSummary } from '@snx-v3/TransactionSummary';
import { useApprove } from '@snx-v3/useApprove';
import { useCollateralType } from '@snx-v3/useCollateralTypes';
import { useContractErrorParser } from '@snx-v3/useContractErrorParser';
import { useCoreProxy } from '@snx-v3/useCoreProxy';
import { useDeposit } from '@snx-v3/useDeposit';
import { useLiquidityPosition } from '@snx-v3/useLiquidityPosition';
import { type PositionPageSchemaType, useParams } from '@snx-v3/useParams';
import { useWrapEth } from '@snx-v3/useWrapEth';
import { Wei, wei } from '@synthetixio/wei';
import { useMachine } from '@xstate/react';
import React from 'react';
import { DepositMachine, Events, ServiceNames, State } from './DepositMachine';

export function DepositModal({ onClose }: { onClose: () => void }) {
  const [params, setParams] = useParams<PositionPageSchemaType>();
  const { collateralChange, setCollateralChange } = React.useContext(ManagePositionContext);
  const { data: CoreProxy } = useCoreProxy();

  const { data: collateralType } = useCollateralType(params.collateralSymbol);
  const { data: liquidityPosition } = useLiquidityPosition({
    accountId: params.accountId,
    collateralType,
  });

  const currentCollateral = liquidityPosition?.collateralAmount ?? ZEROWEI;
  const availableCollateral = liquidityPosition?.availableCollateral ?? ZEROWEI;

  const [txSummary, setTxSummary] = React.useState({
    currentCollateral: ZEROWEI,
    collateralChange: ZEROWEI,
    currentDebt: ZEROWEI,
  });

  const synthNeeded = React.useMemo(() => {
    const amount = collateralChange.sub(availableCollateral);
    return amount.lt(0) ? ZEROWEI : amount;
  }, [availableCollateral, collateralChange]);

  const collateralNeeded = React.useMemo(() => {
    const amount = synthNeeded;
    return amount.gt(0) ? amount : ZEROWEI;
  }, [synthNeeded]);

  //Preparing wETH
  const { exec: wrapEth, wethBalance } = useWrapEth();
  const wrapETHAmount =
    (collateralType?.displaySymbol ?? params.collateralSymbol) === 'WETH' &&
    collateralNeeded.gt(wethBalance || 0)
      ? collateralNeeded.sub(wethBalance || 0)
      : ZEROWEI;
  //Preparing wETH done

  //Collateral Approval
  const {
    approve,
    requireApproval,
    isReady: isReadyApprove,
  } = useApprove({
    contractAddress: collateralType?.tokenAddress,
    amount: collateralChange.lte(availableCollateral)
      ? wei(0).toBN()
      : collateralChange.sub(availableCollateral).toBN(),
    spender: CoreProxy?.address,
  });
  //Collateral Approval Done

  //Deposit
  const newAccountId = React.useMemo(() => `${Math.floor(Math.random() * 1000000000000)}`, []);
  const { exec: execDeposit, isReady: isReadyDeposit } = useDeposit({
    accountId: params.accountId,
    newAccountId,
    collateralTypeAddress: collateralType?.tokenAddress,
    collateralChange,
    currentCollateral,
    availableCollateral,
  });
  //Deposit done

  const toast = useToast({ isClosable: true, duration: 9000 });

  const errorParser = useContractErrorParser();

  const [state, send] = useMachine(DepositMachine, {
    services: {
      [ServiceNames.wrapEth]: async () => {
        try {
          await wrapEth(state.context.wrapAmount);
        } catch (error: any) {
          const contractError = errorParser(error);
          if (contractError) {
            console.error(new Error(contractError.name), contractError);
          }

          toast.closeAll();
          toast({
            title: 'Wrapping ETH failed',
            description: contractError ? (
              <ContractError contractError={contractError} />
            ) : (
              error.message || 'Please try again.'
            ),
            status: 'error',
            variant: 'left-accent',
            duration: 3_600_000,
          });
          throw Error('Wrapping failed', { cause: error });
        }
      },

      [ServiceNames.approveCollateral]: async () => {
        try {
          if (!requireApproval) {
            return;
          }
          toast({
            title: `Approve collateral for transfer`,
            description: `Approve ${collateralType?.displaySymbol} transfer`,
            status: 'info',
            variant: 'left-accent',
          });

          await approve(Boolean(state.context.infiniteApproval));
        } catch (error: any) {
          const contractError = errorParser(error);
          if (contractError) {
            console.error(new Error(contractError.name), contractError);
          }
          toast.closeAll();
          toast({
            title: 'Approval failed',
            description: contractError ? (
              <ContractError contractError={contractError} />
            ) : (
              'Please try again.'
            ),
            status: 'error',
            variant: 'left-accent',
            duration: 3_600_000,
          });
          throw Error('Approve failed', { cause: error });
        }
      },

      [ServiceNames.executeDeposit]: async () => {
        try {
          toast.closeAll();
          toast({
            title: Boolean(params.accountId)
              ? 'Locking your collateral'
              : 'Creating your account and locking your collateral',
            description: '',
            variant: 'left-accent',
          });

          setTxSummary({
            currentCollateral,
            currentDebt: liquidityPosition?.debt || ZEROWEI,
            collateralChange,
          });

          await execDeposit();

          setCollateralChange(ZEROWEI);

          toast.closeAll();
          toast({
            title: 'Success',
            description: 'Your locked collateral amount has been updated.',
            status: 'success',
            duration: 5000,
            variant: 'left-accent',
          });
        } catch (error: any) {
          const contractError = errorParser(error);
          if (contractError) {
            console.error(new Error(contractError.name), contractError);
          }
          toast.closeAll();
          toast({
            title: 'Could not complete locking collateral',
            description: contractError ? (
              <ContractError contractError={contractError} />
            ) : (
              'Please try again.'
            ),
            status: 'error',
            variant: 'left-accent',
            duration: 3_600_000,
          });
          throw Error('Lock collateral failed', { cause: error });
        }
      },
    },
  });

  const wrapAmountString = wrapETHAmount.toString();
  const isSuccessOrDeposit = state.matches(State.success) || state.matches(State.deposit);
  React.useEffect(() => {
    if (isSuccessOrDeposit) {
      // We do this to ensure the success state displays the wrap amount used before deposit
      return;
    }
    send(Events.SET_WRAP_AMOUNT, { wrapAmount: wei(wrapAmountString || '0') });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessOrDeposit, wrapAmountString]);

  React.useEffect(() => {
    send(Events.SET_REQUIRE_APPROVAL, { requireApproval });
  }, [requireApproval, send]);

  const handleClose = React.useCallback(() => {
    const isSuccess = state.matches(State.success);

    if (isSuccess && params.accountId && collateralType?.symbol) {
      send(Events.RESET);
      onClose();
      setParams({
        page: 'position',
        collateralSymbol: collateralType.symbol,
        manageAction: 'deposit',
        accountId: params.accountId,
      });
      return;
    }
    send(Events.RESET);
    onClose();
  }, [state, params.accountId, collateralType?.symbol, send, onClose, setParams]);

  const onSubmit = React.useCallback(async () => {
    if (state.matches(State.success)) {
      handleClose();
      return;
    }
    if (state.context.error) {
      send(Events.RETRY);
      return;
    }

    send(Events.RUN);
  }, [handleClose, send, state]);

  const txSummaryItems = React.useMemo(() => {
    const items = [
      {
        label: `Locked ${collateralType?.displaySymbol ?? params.collateralSymbol}`,
        value: (
          <ChangeStat
            value={txSummary.currentCollateral}
            newValue={txSummary.currentCollateral.add(txSummary.collateralChange)}
            formatFn={(val?: Wei) => currency(val ?? ZEROWEI)}
            hasChanges={txSummary.collateralChange.abs().gt(0)}
            size="sm"
          />
        ),
      },
    ];

    return [
      ...items,
      {
        label: 'C-ratio',
        value: (
          <CRatioChangeStat
            currentCollateral={txSummary.currentCollateral}
            currentDebt={txSummary.currentDebt}
            collateralChange={txSummary.collateralChange}
            collateralPrice={liquidityPosition?.collateralPrice ?? ZEROWEI}
            debtChange={ZEROWEI}
            size="sm"
          />
        ),
      },
    ];
  }, [
    collateralType?.displaySymbol,
    params.collateralSymbol,
    txSummary.currentCollateral,
    txSummary.collateralChange,
    txSummary.currentDebt,
    liquidityPosition?.collateralPrice,
  ]);

  const symbol = collateralType?.displaySymbol;

  const isProcessing =
    state.matches(State.approveCollateral) ||
    state.matches(State.deposit) ||
    state.matches(State.wrap);

  const isWETH = (collateralType?.displaySymbol ?? params.collateralSymbol) === 'WETH';

  const stepNumbers = {
    wrap: isWETH ? 1 : 0,
    approve: isWETH ? 2 : 1,
    deposit: isWETH ? 3 : 2,
  };

  if (state.matches(State.success)) {
    return (
      <LiquidityPositionUpdated
        onClose={onSubmit}
        title="Collateral successfully updated"
        subline={
          <>
            Your <b>collateral</b> has been updated. To learn more, visit the{' '}
            <Link href="https://docs.synthetix.io/" target="_blank" color="cyan.500">
              Synthetix V3 Documentation
            </Link>
          </>
        }
        alertText={
          <>
            <b>Collateral</b> successfully updated
          </>
        }
        summary={<TransactionSummary items={txSummaryItems} />}
      />
    );
  }

  return (
    <div data-cy="deposit multistep">
      <Text color="gray.50" fontSize="20px" fontWeight={700}>
        <ArrowBackIcon cursor="pointer" onClick={onClose} mr={2} />
        Manage Collateral
      </Text>
      <Divider my={4} />
      {isWETH ? (
        <Multistep
          step={stepNumbers.wrap}
          title="Wrap"
          subtitle={
            state.context.wrapAmount.eq(0) ? (
              <Text as="div">
                <Amount
                  value={collateralChange}
                  suffix={` ${collateralType?.displaySymbol ?? params.collateralSymbol}`}
                />{' '}
                from balance will be used.
              </Text>
            ) : (
              <Text as="div">
                You must wrap additional <Amount value={state.context.wrapAmount} suffix=" ETH" />{' '}
                before depositing.
              </Text>
            )
          }
          status={{
            failed: state.context.error?.step === State.wrap,
            disabled: (collateralType?.displaySymbol ?? params.collateralSymbol) !== 'WETH',
            success: state.context.wrapAmount.eq(0) || state.matches(State.success),
            loading: state.matches(State.wrap) && !state.context.error,
          }}
        />
      ) : null}

      <Multistep
        step={stepNumbers.approve}
        title={`Approve ${symbol} transfer`}
        status={{
          failed: state.context.error?.step === State.approveCollateral,
          success: !state.context.requireApproval || state.matches(State.success),
          loading: state.matches(State.approveCollateral) && !state.context.error,
        }}
        checkboxLabel={
          state.context.requireApproval
            ? `Approve unlimited ${symbol} transfers to Synthetix`
            : undefined
        }
        checkboxProps={{
          isChecked: state.context.infiniteApproval,
          onChange: (e) =>
            send(Events.SET_INFINITE_APPROVAL, { infiniteApproval: e.target.checked }),
        }}
      />
      <Multistep
        step={stepNumbers.deposit}
        title={`Deposit and Lock ${symbol}`}
        subtitle={
          <>
            {state.matches(State.success) ? (
              <Amount
                value={collateralChange}
                suffix={` ${
                  collateralType?.displaySymbol ?? params.collateralSymbol
                } deposited and locked.`}
              />
            ) : (
              <>
                {availableCollateral && availableCollateral.gt(ZEROWEI) ? (
                  <>
                    {availableCollateral.gte(collateralChange) ? (
                      <Amount
                        prefix={`This will deposit and lock `}
                        value={collateralChange}
                        suffix={` ${collateralType?.displaySymbol ?? params.collateralSymbol}.`}
                      />
                    ) : (
                      <>
                        <Text>
                          <Amount
                            prefix={`This will deposit and lock `}
                            value={availableCollateral}
                            suffix={` ${collateralType?.displaySymbol ?? params.collateralSymbol}.`}
                          />
                        </Text>
                        <Text>
                          <Amount
                            prefix={`An additional `}
                            value={collateralChange.sub(availableCollateral)}
                            suffix={` ${
                              collateralType?.displaySymbol ?? params.collateralSymbol
                            } will be deposited and locked from your wallet.`}
                          />
                        </Text>
                      </>
                    )}
                  </>
                ) : (
                  <Amount
                    prefix={`This will deposit and lock `}
                    value={collateralChange}
                    suffix={` ${collateralType?.displaySymbol ?? params.collateralSymbol}.`}
                  />
                )}
              </>
            )}
          </>
        }
        status={{
          failed: state.context.error?.step === State.deposit,
          disabled: state.matches(State.success) && state.context.requireApproval,
          success: state.matches(State.success),
          loading: state.matches(State.deposit) && !state.context.error,
        }}
      />
      <Button
        isDisabled={isProcessing || !isReadyDeposit || !isReadyApprove}
        onClick={() => {
          window?._paq?.push([
            'trackEvent',
            'liquidity',
            'v3_staking',
            `submit_deposit_${collateralType?.symbol?.toLowerCase()}_v3`,
          ]);
          onSubmit();
        }}
        width="100%"
        mt="6"
        data-cy="deposit confirm button"
      >
        {(() => {
          switch (true) {
            case Boolean(state.context.error):
              return 'Retry';
            case isProcessing:
              return 'Processing...';
            case state.matches(State.success):
              return 'Continue';
            default:
              return 'Execute Transaction';
          }
        })()}
      </Button>
    </div>
  );
}
