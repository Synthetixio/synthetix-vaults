import { InfoIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  FlexProps,
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
import { useClaimAllRewards } from '@snx-v3/useClaimAllRewards';
import { type LiquidityPositionPageSchemaType, useParams } from '@snx-v3/useParams';
import { useRewardsByCollateralType } from '@snx-v3/useRewards';
import React from 'react';
import { AllRewardsModal } from './AllRewardsModal';
import { RewardsLoading } from './RewardsLoading';
import { RewardsRow } from './RewardsRow';
import { BorderBox } from '@snx-v3/BorderBox';
import { formatNumberToUsd } from '@snx-v3/formatters';

export function Rewards({ ...props }: FlexProps) {
  const [params] = useParams<LiquidityPositionPageSchemaType>();

  const { data: rewards, isPending: isPendingRewards } = useRewardsByCollateralType({
    accountId: params.accountId,
  });

  const { exec: claimAll, txnState } = useClaimAllRewards({
    accountId: params.accountId,
    collateralSymbol: params.collateralSymbol,
  });

  const rewardsForCollateral = React.useMemo(
    () =>
      rewards
        ? rewards.find((reward) => reward.collateralType?.symbol === params.collateralSymbol)
        : undefined,
    [rewards, params.collateralSymbol]
  );

  return (
    <BorderBox p={6} flexDirection="row" bg="navy.700" {...props}>
      <TableContainer width="100%">
        <AllRewardsModal
          txnStatus={txnState.txnStatus}
          txnHash={txnState.txnHash}
          collateralSymbol={params.collateralSymbol}
        />
        <Flex alignItems="center" justifyContent="space-between">
          <Flex flexDirection="column">
            <Text color="gray.500" fontSize="sm" fontFamily="heading" lineHeight="16px">
              Rewards
            </Text>
            <Text
              color="white"
              fontSize="20px"
              fontWeight="medium"
              fontFamily="heading"
              lineHeight="28px"
            >
              {formatNumberToUsd(rewardsForCollateral?.totalRewardsValue.toNumber() ?? 0)}
            </Text>
          </Flex>

          <Button
            size="sm"
            variant="solid"
            isDisabled={!(rewardsForCollateral?.rewards && rewardsForCollateral.rewards.length > 0)}
            _disabled={{
              bg: 'gray.900',
              backgroundImage: 'none',
              color: 'gray.500',
              opacity: 0.5,
              cursor: 'not-allowed',
            }}
            data-cy="claim rewards submit"
            onClick={() => {
              window?._paq?.push([
                'trackEvent',
                'liquidity',
                'v3_staking',
                `submit_claim_rewards_v3`,
              ]);
              claimAll();
            }}
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

            {rewardsForCollateral?.rewards && rewardsForCollateral.rewards.length === 0 ? (
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

            {rewardsForCollateral?.rewards && rewardsForCollateral.rewards.length
              ? rewardsForCollateral.rewards.map(({ displaySymbol, claimableAmount }) => (
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
