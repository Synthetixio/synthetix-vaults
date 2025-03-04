import { Box, Button, Flex, Link, SystemProps, Text, useBreakpointValue } from '@chakra-ui/react';
import { makeSearch, useParams } from '@snx-v3/useParams';

export const PositionsEmpty = () => {
  const [params, setParams] = useParams();
  const direction = useBreakpointValue({ base: 'column', md: 'row' });
  const alignment = useBreakpointValue({ base: 'flex-start', md: 'baseline' });

  return (
    <Flex
      justifyContent={direction === 'row' ? 'space-between' : 'flex-start'}
      direction={direction as SystemProps['flexDirection']}
      alignItems={alignment}
    >
      <Box overflow="hidden">
        <Text
          color="gray.500"
          fontWeight={500}
          fontSize="14px"
          my="4"
          pl="3"
          maxWidth="100%"
          overflowWrap="break-word"
          wordBreak="break-word"
          whiteSpace={{ base: 'normal', md: 'nowrap' }}
        >
          You can open a new position by choosing a vault for collateral type
        </Text>
      </Box>
      <Button
        as={Link}
        href={`?${makeSearch({ accountId: params.accountId })}`}
        onClick={(e) => {
          e.preventDefault();
          setParams({ accountId: params.accountId });
        }}
        size="sm"
        data-cy="all pools button"
      >
        Explore all Vaults
      </Button>
    </Flex>
  );
};
