import { BorderBox } from '@snx-v3/BorderBox';
import { Tab, TabList, Tabs, Box } from '@chakra-ui/react';
import { useState } from 'react';
import { VaultDeposits } from './VaultDeposits';
import { VaultPositions } from './VaultPositions';
import { VaultTradeHistory } from './VaultTradeHistory';
import { VaultFunding } from './VaultFunding';
import { FundingRateVaultData } from '../../useFundingRateVaultData';

interface Props {
  vaultData: FundingRateVaultData;
}

export const VaultHistory = ({ vaultData }: Props) => {
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
            whiteSpace="nowrap"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
            onClick={() => setIndex(1)}
          >
            Positions (2)
          </Tab>

          <Tab
            color={index === 2 ? 'white' : 'gray.500'}
            fontWeight={400}
            fontSize="sm"
            whiteSpace="nowrap"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
            onClick={() => setIndex(2)}
          >
            Trade History
          </Tab>

          <Tab
            color={index === 3 ? 'white' : 'gray.500'}
            fontWeight={400}
            fontSize="sm"
            whiteSpace="nowrap"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
            onClick={() => setIndex(3)}
          >
            Funding History
          </Tab>
        </TabList>

        <Box
          overflow="auto"
          rounded="6px"
          mt={4}
          bg="whiteAlpha.50"
          borderWidth="1px"
          borderColor="whiteAlpha.200"
        >
          {index === 0 && <VaultDeposits vaultData={vaultData} />}
          {index === 1 && <VaultPositions />}
          {index === 2 && <VaultTradeHistory />}
          {index === 3 && <VaultFunding />}
        </Box>
      </Tabs>
    </BorderBox>
  );
};
