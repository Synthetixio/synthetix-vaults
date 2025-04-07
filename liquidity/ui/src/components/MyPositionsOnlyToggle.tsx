import React from 'react';
import { Flex, Switch } from '@chakra-ui/react';
import { useShowMyPositionsOnly } from '@snx-v3/useShowMyPositionsOnly';

export function MyPositionsOnlyToggle() {
  const [myPositionsOnly, setMyPositionsOnly] = useShowMyPositionsOnly();

  return (
    <Flex
      mt={4}
      py={2}
      px={4}
      bg="navy.700"
      rounded="md"
      fontSize={14}
      color="gray.500"
      gap={3}
    >
      Show my positions only
      <Switch isChecked={myPositionsOnly} onChange={() => setMyPositionsOnly(!myPositionsOnly)} />
    </Flex>
  );
}
