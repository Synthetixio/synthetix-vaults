import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Flex, Text } from '@chakra-ui/react';
import Wei from '@synthetixio/wei';
import React from 'react';

const styles = {
  sm: {
    fontSize: '14px',
    fontWeight: '700',
    lineHeight: '14px',
  },
  md: {
    fontSize: '16px',
    fontWeight: '400',
    lineHeight: '16px',
  },
  lg: {
    fontSize: '18px',
    fontWeight: '800',
    lineHeight: '24px',
  },
  xl: {
    fontSize: '20px',
    fontWeight: '800',
    lineHeight: '28px',
  },
};

export function ChangeStat({
  formatFn,
  value,
  newValue,
  hasChanges,
  'data-cy': dataCy,
  size = 'lg',
  color = 'white',
  isPending,
}: {
  color?: string;
  value?: Wei;
  newValue: Wei;
  hasChanges: boolean;
  'data-cy'?: string;
  formatFn: (val?: Wei) => React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isPending?: boolean;
}) {
  return (
    <Flex
      gap="1"
      alignItems="center"
      color={color}
      fontSize={styles[size].fontSize}
      fontWeight={styles[size].fontWeight}
      lineHeight={styles[size].lineHeight}
      flexWrap="wrap"
      data-cy={dataCy}
    >
      <Text
        as="div"
        data-cy="change stats current"
        textAlign="center"
        color={value && value.eq(0) ? 'gray.500' : undefined}
        whiteSpace="nowrap"
      >
        {isPending ? '~' : formatFn(value)}
      </Text>
      {hasChanges && !isPending && (!value || !value.eq(newValue)) ? (
        <Flex gap="1" alignItems="center" isTruncated>
          <ArrowForwardIcon />
          <Text
            as="div"
            data-cy="change stats new"
            textAlign="center"
            opacity={newValue.eq(0) ? '70%' : undefined}
            whiteSpace="nowrap"
          >
            {formatFn(newValue)}
          </Text>
        </Flex>
      ) : null}
    </Flex>
  );
}
