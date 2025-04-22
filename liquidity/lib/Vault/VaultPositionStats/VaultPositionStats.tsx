import { Flex } from '@chakra-ui/react';
import { BorderBox } from '@snx-v3/BorderBox';
import { Amount } from '@snx-v3/Amount';
import Wei, { wei } from '@synthetixio/wei';
import { StatsCard } from './StatsCard';
import { ChangeStat } from '@snx-v3/ChangeStat';
import { currency } from '@snx-v3/format';
import { ZEROWEI } from '@snx-v3/constants';
import { Rewards } from '@snx-v3/Rewards';
import { FundingRateVaultData } from '../../useFundingRateVaultData';

interface Props {
  vaultData: FundingRateVaultData;
}

export const VaultPositionStats = ({ vaultData }: Props) => {
  return (
    <BorderBox border="none" flexDir="column" p={['4', '6']} gap={6}>
      <Flex gap={6}>
        <StatsCard
          label="Total Value of My Deposits"
          value={
            <Amount
              color="white"
              prefix="$"
              value={wei(vaultData.balanceOf || '0').mul(vaultData.exchangeRate || '0')}
            />
          }
        />

        <StatsCard
          label="My PnL"
          value={<Amount color="green.500" prefix="$" value={wei('231.23')} />}
        />
      </Flex>
      <StatsCard
        label="Collateral"
        value={
          <ChangeStat
            value={wei(vaultData.balanceOf || '0')}
            newValue={wei(vaultData.balanceOf || '0').add(1000)}
            formatFn={(val?: Wei) => (
              <span style={{ fontSize: '20px', fontWeight: 500, lineHeight: '28px' }}>
                ${currency(val ?? ZEROWEI)}
              </span>
            )}
            hasChanges
            size="sm"
          />
        }
      />

      <Rewards bg="whiteAlpha.50" border="none" />
    </BorderBox>
  );
};
