import { BorderBox } from '@snx-v3/BorderBox';
import { PositionTitle } from '@snx-v3/Manage';
import { Text, Flex, Skeleton, Box } from '@chakra-ui/react';
import { StatsCard } from './Vault/VaultPositionStats/StatsCard';
import { Amount } from '@snx-v3/Amount';
import { wei } from '@synthetixio/wei';
import { FundingRateVaultData } from '@snx-v3/useFundingRateVaultData';

interface Props {
  vaultData?: FundingRateVaultData;
}

export const FundingRateVaultInfo = ({ vaultData }: Props) => {
  return (
    <BorderBox
      alignSelf="self-start"
      flex={1}
      border="none"
      flexDir="column"
      p={['4', '6']}
      gap={6}
    >
      <Flex direction="column" gap={6}>
        <PositionTitle isVault name={vaultData?.name || null} />
        {vaultData ? (
          <Text color="gray.500" fontSize="14px" fontWeight={400}>
            {vaultData.description}
          </Text>
        ) : (
          <Box>
            <Flex gap={2} flexWrap="wrap">
              <Skeleton height="14px" width="100%" />
              <Skeleton height="14px" width="90%" />
              <Skeleton height="14px" width="100%" />
              <Skeleton height="14px" width="70%" />
            </Flex>
          </Box>
        )}
        <Flex gap={['4', '6']}>
          <StatsCard
            label="Total Value Locked"
            value={
              <Amount
                fontSize={['xl', '2xl']}
                fontWeight="medium"
                prefix="$"
                value={vaultData ? wei(vaultData.totalAssets || '0', 6) : undefined}
              />
            }
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          />
          <StatsCard
            label="APR"
            value={
              <Amount
                fontSize={['xl', '2xl']}
                fontWeight="medium"
                suffix="%"
                value={vaultData ? wei((vaultData.apr || 0) * 100) : undefined}
              />
            }
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          />
        </Flex>
        <Flex gap={['2', '3']}></Flex>
      </Flex>
    </BorderBox>
  );
};
