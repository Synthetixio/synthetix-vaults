import { FlexProps, Text } from '@chakra-ui/react';
import { BorderBox } from '@snx-v3/BorderBox';
import { ReactNode } from 'react';

interface StatsCardProps extends FlexProps {
  label?: ReactNode;
  value?: ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ label, value, ...props }) => {
  return (
    <BorderBox
      display="flex"
      flexDir="column"
      gap={1}
      border="none"
      flex={1}
      p={6}
      bg="whiteAlpha.50"
      {...props}
    >
      <Text
        color="gray.500"
        fontSize="14px"
        fontFamily="heading"
        lineHeight="16px"
        fontWeight={400}
      >
        {label}
      </Text>
      <Text as="div" fontSize="20px" lineHeight="28px" fontWeight="medium">
        {value}
      </Text>
    </BorderBox>
  );
};
