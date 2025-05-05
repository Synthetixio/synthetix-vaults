import { Container, Flex, useDisclosure, Image } from '@chakra-ui/react';
import { useEffect } from 'react';
import { NavLink as RouterLink, useLocation } from 'react-router-dom';
import { NetworkController } from './NetworkController';
import { NavDropdown } from './NavDropdown';
import snxVaultsIcon from './assets/snx-vaults.svg';

export default function Header() {
  const { onClose } = useDisclosure();
  const location = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to close if location changes for any reason
  useEffect(() => {
    onClose();
  }, [location, onClose]);

  return (
    <Flex 
      bg="navy.700" 
      mb="4" 
      py="3" 
      borderBottomWidth="1px" 
      borderBottomColor="whiteAlpha.200"
      top="0"
      position="sticky"
      zIndex="10"
    >
      <Container
        maxW="1236px"
        as={Flex}
        justifyContent="space-between"
        alignItems="center"
        position="relative"
        px={{ base: '16px', md: 'auto' }}
      >
        <Flex 
          direction={{ base: "row-reverse", md: "row" }} 
          justifyContent="start" 
          alignItems="center"
        >
          <Flex
            as={RouterLink}
            to="/"
            direction="row"
            justifyContent="start"
            alignItems="center"
            height="100%"
            position={{ base: 'absolute', md: 'static' }}
            left={{ base: '50%', md: 'auto' }}
            transform={{ base: 'translateX(-50%)', md: 'none' }}
          >
            <Image src={snxVaultsIcon} alt="Logo" width="126px" height="22px" />
          </Flex>
          <NavDropdown />
        </Flex>
        <Flex gap={3} flexWrap="wrap-reverse" justifyContent="center" alignItems="center">
          <NetworkController />
        </Flex>
      </Container>
    </Flex>
  );
}
