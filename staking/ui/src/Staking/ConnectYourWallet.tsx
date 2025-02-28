import { Flex } from '@chakra-ui/react';
import React from 'react';
import burn from './burn.webp';
import { ButtonConnect } from './ButtonConnect';
import { ButtonDocs } from './ButtonDocs';
import { LayoutWithImage } from './LayoutWithImage';
import { SubheaderMigrateAndEarn } from './SubheaderMigrateAndEarn';

export function ConnectYourWallet() {
  return (
    <LayoutWithImage
      imageSrc={burn}
      Subheader={() => <SubheaderMigrateAndEarn />}
      Content={() => (
        <>
          <ButtonConnect />

          <Flex gap={4} justifyContent="space-between">
            <ButtonDocs />
          </Flex>
        </>
      )}
    />
  );
}
