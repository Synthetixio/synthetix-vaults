import { InfoIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { Tooltip } from '@snx-v3/Tooltip';
import { useNetwork } from '@snx-v3/useBlockchain';
import { useClaimAllRewards } from '@snx-v3/useClaimAllRewards';
import { type PositionPageSchemaType, useParams } from '@snx-v3/useParams';
import { groupRewardsBySymbol, useRewards } from '@snx-v3/useRewards';
import { useSynthTokens } from '@snx-v3/useSynthTokens';
import React from 'react';
import { AllRewardsModal } from './AllRewardsModal';
import { RewardsLoading } from './RewardsLoading';
import { RewardsRow } from './RewardsRow';
import { BorderBox } from '@snx-v3/BorderBox';

export function Rewards() {
  const [params] = useParams<PositionPageSchemaType>();
  const { data: rewards, isPending: isPendingRewards } = useRewards({
    accountId: params.accountId,
  });
  const { exec: claimAll, txnState } = useClaimAllRewards({ accountId: params.accountId });

  const { network } = useNetwork();

  const { data: synthTokens } = useSynthTokens();
  const groupedRewards = React.useMemo(
    () =>
      network && rewards && synthTokens
        ? groupRewardsBySymbol({ network, rewards, synthTokens })
        : undefined,
    [network, rewards, synthTokens]
  );

  return (
    <BorderBox p={6} flexDirection="row" bg="navy.700">
      <TableContainer width="100%">
        <AllRewardsModal txnStatus={txnState.txnStatus} txnHash={txnState.txnHash} />
        <Flex alignItems="center" justifyContent="space-between">
          <Heading fontSize="18px" fontWeight={700} lineHeight="28px" color="gray.50" mb={3}>
            Rewards
          </Heading>
          <Button
            size="sm"
            variant="solid"
            isDisabled={!(groupedRewards && groupedRewards.length > 0)}
            _disabled={{
              bg: 'gray.900',
              backgroundImage: 'none',
              color: 'gray.500',
              opacity: 0.5,
              cursor: 'not-allowed',
            }}
            data-cy="claim rewards submit"
            onClick={() => claimAll()}
          >
            Claim
          </Button>
        </Flex>

        <Table data-cy="rewards table">
          <Thead>
            <Tr borderBottom="1px solid #2D2D38">
              <Th
                textTransform="unset"
                color="gray.600"
                border="none"
                fontFamily="heading"
                fontSize="12px"
                lineHeight="16px"
                letterSpacing={0.6}
                fontWeight={700}
                px={4}
                py={3}
              >
                Token
                <Tooltip label="Claimable rewards from trader collateral liquidations and incentives. Liquidated collateral rewards offset debt accrued during trader liquidations.">
                  <InfoIcon ml={1} mb="1px" />
                </Tooltip>
              </Th>
              <Th
                textTransform="unset"
                color="gray.600"
                border="none"
                fontFamily="heading"
                fontSize="12px"
                lineHeight="16px"
                letterSpacing={0.6}
                fontWeight={700}
                px={4}
                py={3}
              >
                Earnings
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {!params.accountId ? (
              <Tr>
                <Td
                  display="table-cell"
                  alignItems="left"
                  px={4}
                  border="none"
                  w="100%"
                  colSpan={2}
                >
                  <Text color="gray.500" fontFamily="heading" fontSize="xs">
                    Create a Position to see your earnings
                  </Text>
                </Td>
              </Tr>
            ) : null}

            {params.accountId && isPendingRewards ? <RewardsLoading /> : null}

            {groupedRewards && groupedRewards.length === 0 ? (
              <Tr>
                <Td
                  display="table-cell"
                  alignItems="left"
                  px={4}
                  border="none"
                  w="100%"
                  colSpan={2}
                >
                  <Text color="gray.500" fontFamily="heading" fontSize="xs">
                    No Rewards Available
                  </Text>
                </Td>
              </Tr>
            ) : null}

            {groupedRewards && groupedRewards.length
              ? groupedRewards.map(({ displaySymbol, claimableAmount }) => (
                  <RewardsRow
                    key={displaySymbol}
                    displaySymbol={displaySymbol}
                    claimableAmount={claimableAmount}
                  />
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </BorderBox>
  );
}
