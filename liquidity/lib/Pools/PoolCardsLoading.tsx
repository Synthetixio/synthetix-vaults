import { Flex, Skeleton } from '@chakra-ui/react';

export const PoolCardsLoading = () => (
  <>
    {Array.from(Array(3).keys()).map((i) => (
      <Flex
        key={i}
        flexDir="row"
        w="100%"
        rounded="md"
        bg="whiteAlpha.50"
        py={4}
        px={4}
        gap={4}
        alignItems="center"
      >
        <Flex alignItems="center" justifyContent="flex-start" width="260px" gap={3}>
          <Skeleton width="40px" height="40px" rounded="full" />
          <Flex flex={1} flexDirection="column" gap={1}>
            <Skeleton height="24px" width="64px" />
            <Skeleton height="12px" width="104px" />
          </Flex>
        </Flex>
        <Flex justifyContent="flex-end" alignItems="center" width="140px">
          <Skeleton height={4} width="64px" />
        </Flex>
        <Flex justifyContent="flex-end" alignItems="center" width="140px">
          <Skeleton height={4} width="64px" />
        </Flex>
        <Flex justifyContent="flex-end" alignItems="center" width="140px">
          <Skeleton height={4} width="64px" />
        </Flex>
        <Flex justifyContent="flex-end" alignItems="center" width="140px">
          <Skeleton height={4} width="64px" />
        </Flex>
        <Flex justifyContent="flex-end" alignItems="center" width="140px">
          <Skeleton height={4} width="64px" />
        </Flex>
      </Flex>
    ))}
  </>
);
