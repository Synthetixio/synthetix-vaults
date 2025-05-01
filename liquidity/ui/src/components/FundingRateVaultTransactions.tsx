import { BorderBox } from '@snx-v3/BorderBox';
import { Tab, TabList, Tabs, TabPanel, TabPanels } from '@chakra-ui/react';
import { useState } from 'react';
import { FundingRateVaultDepositsAndWithdrawals } from './FundingRateVaultDepositsAndWithdrawals';
import { VaultTradeHistory } from './Vault/VaultHistory/VaultTradeHistory';
import { FundingRateVaultMargin } from './FundingRateVaultMargin';
import { FundingRateVaultData } from '@snx-v3/useFundingRateVaultData';
import { VaultPositions } from './Vault/VaultHistory/VaultPositions';

interface Props {
  vaultData?: FundingRateVaultData;
}

export const FundingRateVaultTransactions = ({ vaultData }: Props) => {
  const [index, setIndex] = useState(0);
  return (
    <BorderBox
      mt={6}
      alignSelf="self-start"
      flex={1}
      border="none"
      flexDir="column"
      p={['4', '6']}
      gap={4}
    >
      <Tabs index={index}>
        <TabList
          display="flex"
          alignItems="flex-end"
          overflowX="auto"
          overflowY="hidden"
          borderBottom="1px"
          borderColor="whiteAlpha.200"
          pb="2px"
          sx={{
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Tab
            color={index === 0 ? 'white' : 'gray.500'}
            fontWeight={400}
            fontSize="sm"
            px={6}
            whiteSpace="nowrap"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
            onClick={() => setIndex(0)}
          >
            Deposits & Withdrawals
          </Tab>

          <Tab
            color={index === 1 ? 'white' : 'gray.500'}
            fontWeight={400}
            fontSize="sm"
            px={6}
            whiteSpace="nowrap"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
            onClick={() => setIndex(1)}
          >
            Trades
          </Tab>

          <Tab
            color={index === 2 ? 'white' : 'gray.500'}
            fontWeight={400}
            fontSize="sm"
            px={6}
            whiteSpace="nowrap"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
            onClick={() => setIndex(2)}
          >
            Margin
          </Tab>

          <Tab
            color={index === 3 ? 'white' : 'gray.500'}
            fontWeight={400}
            fontSize="sm"
            px={6}
            whiteSpace="nowrap"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
            onClick={() => setIndex(3)}
          >
            Positions
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <FundingRateVaultDepositsAndWithdrawals vaultData={vaultData} />
          </TabPanel>
          <TabPanel>
            <VaultTradeHistory vaultData={vaultData} />
          </TabPanel>
          <TabPanel>
            <FundingRateVaultMargin vaultData={vaultData} />
          </TabPanel>
          <TabPanel>
            <VaultPositions vaultData={vaultData} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </BorderBox>
  );
};
