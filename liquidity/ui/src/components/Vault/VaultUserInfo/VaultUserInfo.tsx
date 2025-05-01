import { BorderBox } from '@snx-v3/BorderBox';
import { Flex } from '@chakra-ui/react';
import { StatsCard } from '@snx-v3/StatsCard';
import { Amount } from '@snx-v3/Amount';
import { wei } from '@synthetixio/wei';
import { FundingRateVaultData } from '@snx-v3/useFundingRateVaultData';

interface Props {
  vaultData?: FundingRateVaultData;
}

export const VaultUserInfo = ({ vaultData }: Props) => {
  return (
    <BorderBox
      alignSelf="self-start"
      flex={1}
      border="none"
      flexDir="column"
      p={['4', '6']}
      gap={6}
      width="100%"
    >
      <Flex direction="column" gap={6} width="100%">
        <Flex gap={['4', '6']}>
          <StatsCard
            label="My deposits"
            value={
              <Amount
                fontSize={['xl', '2xl']}
                fontWeight="medium"
                prefix="$"
                value={
                  vaultData
                    ? wei(vaultData.balanceOf || '0', 18).mul(vaultData.exchangeRate || '1')
                    : undefined
                }
              />
            }
            justifyContent="center"
            alignItems="center"
            textAlign="center"
          />
          <StatsCard
            label="My PnL"
            value={
              <Amount
                color={vaultData && vaultData.pnl > 0 ? 'green.500' : undefined}
                fontSize={['xl', '2xl']}
                fontWeight="medium"
                prefix="$"
                value={vaultData ? wei(vaultData.pnl || '0') : undefined}
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
