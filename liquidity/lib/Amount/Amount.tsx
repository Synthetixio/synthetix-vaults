import { Skeleton, Text, TextProps } from '@chakra-ui/react';
import { currency } from '@snx-v3/format';
import { wei, Wei } from '@synthetixio/wei';
import { constants } from 'ethers';
import React from 'react';

export function Amount({
  value,
  prefix = '',
  suffix = '',
  'data-cy': testId,
  average = false,
  ...props
}: {
  prefix?: string;
  value?: Wei;
  suffix?: string;
  'data-cy'?: string;
  average?: boolean;
} & TextProps) {
  const isMaxUint = value && wei(constants.MaxInt256).lte(value);
  const formattedValue = React.useMemo(() => currency(value, { average }), [value, average]);

  if (value === undefined) {
    return <Skeleton height="24px" width="100px" />;
  }

  return (
    <Text as="span" data-cy={testId} {...props}>
      {prefix}
      {isMaxUint ? 'Infinite' : formattedValue}
      {!isMaxUint && suffix}
    </Text>
  );
}
