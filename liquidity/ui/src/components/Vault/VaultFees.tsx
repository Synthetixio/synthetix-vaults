import { BorderBox } from '@snx-v3/BorderBox';
import { Flex, Text, Heading } from '@chakra-ui/react';
import { FundingRateVaultData } from '@snx-v3/useFundingRateVaultData';
import { wei } from '@synthetixio/wei';
import { BigNumber } from 'ethers';
interface Props {
  vaultData: FundingRateVaultData;
}

interface FeeRowProps {
  title: string;
  description: string;
  value: string;
  isLast?: boolean;
}

const FeeRow = ({ title, description, value, isLast }: FeeRowProps) => (
  <Flex
    flexDirection="column"
    py={3}
    px={4}
    borderBottom={isLast ? 'none' : '1px solid'}
    borderColor="whiteAlpha.200"
  >
    <Flex justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" flex={1}>
        <Text color="white" fontSize="14px" fontWeight={500}>
          {title}
        </Text>
        <Text color="gray.500" fontSize="12px" mt="1px">
          {description}
        </Text>
      </Flex>
      <Text color="white" fontSize="14px" fontWeight={500} ml={4}>
        {value}
      </Text>
    </Flex>
  </Flex>
);

export const VaultFees = ({ vaultData }: Props) => {
  const formatPercentage = (value: BigNumber) => {
    const weiValue = wei(value);
    return `${weiValue.mul(100).toString(2)}%`; // Convert to percentage and show 2 decimal places
  };

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
      <Heading fontSize="xl" fontWeight="medium" color="white">
        Vault Fees
      </Heading>
      <Flex direction="column" bg="whiteAlpha.50" borderRadius="md">
        <FeeRow
          title="Management Fee"
          description="An annual percentage fee charged to all depositors"
          value={`${formatPercentage(vaultData.managementFee)} p.a.`}
        />
        <FeeRow
          title="Keeper Fee"
          description="A small fee that is charged per deposit and redemption"
          value={`$${wei(vaultData.keeperFee, 6).toString(2)}`}
        />
        <FeeRow
          title="Performance Fee"
          description="A percentage fee charged to all depositors based on the vault's performance"
          value={`${formatPercentage(vaultData.performanceFee)} p.a.`}
        />
        <FeeRow
          title="Deposit Fee"
          description="A percentage fee charged for each deposit into the vault"
          value={formatPercentage(vaultData.depositFee)}
        />
        <FeeRow
          title="Withdraw Fee"
          description="A percentage fee charged for each withdrawal from the vault"
          value={formatPercentage(vaultData.redemptionFee)}
          isLast
        />
      </Flex>
    </BorderBox>
  );
};
