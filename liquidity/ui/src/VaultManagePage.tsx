import { Box, Flex } from '@chakra-ui/react';
import { UnsupportedCollateralAlert } from '@snx-v3/CollateralAlert';
import { ManageStats, PositionTitle } from '@snx-v3/Manage';
import { ManagePositionProvider } from '@snx-v3/ManagePositionContext';
import { useCollateralType } from '@snx-v3/useCollateralTypes';

import { type VaultPositionPageSchemaType, useParams } from '@snx-v3/useParams';
import React from 'react';
import { Helmet } from 'react-helmet';

export const VaultManagePage = () => {
  const [params] = useParams<VaultPositionPageSchemaType>();

  const { data: collateralType, isPending: isPendingCollateralType } = useCollateralType(
    params.collateralSymbol
  );

  return (
    <ManagePositionProvider>
      <Helmet>
        <title>{`Synthetix ${params.symbol} Position`}</title>
        <meta name="description" content={`Synthetix Vaults - ${params.symbol} Position`} />
      </Helmet>
      <UnsupportedCollateralAlert isOpen={!isPendingCollateralType && !collateralType} />
      <Box mb={12} mt={6}>
        <Flex mt={6} flexDirection={['column', 'column', 'row']} gap={4}>
          <Flex flex={1} direction="column" gap={6}>
            <PositionTitle />

            <ManageStats />
          </Flex>
          <Flex width="100%" flex={1} alignSelf="flex-start" flexDirection="column">
            Deposit and Withdraw
          </Flex>
        </Flex>
      </Box>
    </ManagePositionProvider>
  );
};
