import { BorderBox } from '@snx-v3/BorderBox';
import { PositionTitle } from '@snx-v3/Manage';
import { Text, Flex } from '@chakra-ui/react';
import { StatsCard } from '../VaultPositionStats/StatsCard';
import { Amount } from '@snx-v3/Amount';
import { wei } from '@synthetixio/wei';
import { FundingRateVaultData } from '../../useFundingRateVaultData';

interface Props {
  vaultData: FundingRateVaultData;
}

export const VaultInfo = ({ vaultData }: Props) => {
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
        <PositionTitle isVault />

        <Text color="gray.500" fontSize="14px" fontWeight={400}>
          {vaultData.description}
        </Text>

        <Flex gap={['4', '6']}>
          <StatsCard
            label="Total Value Locked"
            value={
              <Amount
                fontSize={['xl', '2xl']}
                fontWeight="medium"
                prefix="$"
                value={wei(vaultData.totalAssets || '0', 6)}
              />
            }
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          />
          <StatsCard
            label="28d APR"
            value={
              <Amount fontSize={['xl', '2xl']} fontWeight="medium" suffix="%" value={wei('55')} />
            }
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          />
        </Flex>
      </Flex>
    </BorderBox>
  );
};
