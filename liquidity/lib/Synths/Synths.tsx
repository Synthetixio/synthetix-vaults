import { Button, Divider, Flex, Heading, Table, TableContainer, Tbody } from '@chakra-ui/react';
import { useWallet } from '@snx-v3/useBlockchain';
import { useSynthBalances } from '@snx-v3/useSynthBalances';
import { useUnwrapAllSynths } from '@snx-v3/useUnwrapAllSynths';
import { wei } from '@synthetixio/wei';
import React from 'react';
import { SynthRow } from './SynthRow';
import { SynthsLoading } from './SynthsLoading';
import { SynthsUnwrapModal } from './SynthsUnwrapModal';
import { StataUSDC } from './StataUSDC';
import { useStataUSDCBalance } from '@snx-v3/useStataUSDCBalance';

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

export function Synths() {
  const { activeWallet } = useWallet();
  const walletAddress = activeWallet?.address;

  const { data: synthBalances, isPending: isPendingSynthBalances } = useSynthBalances();
  const { exec: unwrapAll, txnState } = useUnwrapAllSynths();

  const { data: stataBalance } = useStataUSDCBalance();

  const filteredSynths = React.useMemo(() => {
    if (!synthBalances || !synthBalances.length) {
      return;
    }
    return synthBalances
      .filter(({ balance }) => balance.gt(wei(0.01))) // ignore the dust
      .sort((a, b) => a.synth.symbol.localeCompare(b.synth.symbol))
      .sort((a, b) => b.balance.toNumber() - a.balance.toNumber());
  }, [synthBalances]);

  const hasSynths = React.useMemo(() => {
    return filteredSynths && filteredSynths.length > 0;
  }, [filteredSynths]);

  const hasStata = React.useMemo(() => {
    return stataBalance && stataBalance.maxRedeem.gt(0);
  }, [stataBalance]);

  if (!walletAddress || (!hasSynths && !hasStata)) {
    return null;
  }
  return (
    <Flex mt={12} flexDirection="column" overflowX="auto">
      <TableContainer minW={550}>
        <SynthsUnwrapModal txnStatus={txnState.txnStatus} txnHash={txnState.txnHash} />
        <Flex alignItems="center" justifyContent="space-between">
          <Heading fontSize="1.25rem" fontWeight={700} lineHeight="28px" color="gray.50" mb={3}>
            Synths
          </Heading>
        </Flex>
        <Flex maxW="100%" direction="column" gap={4}>
          <Flex flexDir="row" gap={4} py={3} px={4} whiteSpace="nowrap">
            <HeaderText flex="1" justifyContent="left">
              Token
            </HeaderText>
            <HeaderText width={['100px', '100px', '160px']}>Balance</HeaderText>
            <Flex width={['100px', '100px', '160px']} justifyContent="flex-end">
              {hasSynths && (
                <Button
                  size="sm"
                  variant="solid"
                  data-cy="unwrap synths submit"
                  onClick={() => unwrapAll()}
                >
                  Unwrap All
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Table variant="simple" data-cy="synths table">
          <Tbody>
            {walletAddress && isPendingSynthBalances ? <SynthsLoading /> : null}
            <Flex direction="column" gap={4}>
              {filteredSynths
                ? filteredSynths.map(({ synth, balance }) => (
                    <SynthRow key={synth.symbol} synth={synth} balance={balance} />
                  ))
                : null}
              {hasSynths && hasStata && <Divider bg="gray.900" />}
              <StataUSDC />
            </Flex>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}
