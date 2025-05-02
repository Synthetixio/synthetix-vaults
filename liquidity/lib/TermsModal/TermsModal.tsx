import {
  Box,
  Button,
  Link,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { SESSION_STORAGE_KEYS } from '@snx-v3/constants';
import { useState } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

interface TermsModalProps {
  defaultOpen: boolean;
}

export const TermsModal = ({ defaultOpen = true }: TermsModalProps) => {
  const [isOpen, setOpen] = useState(defaultOpen);
  const [enabled, setEnabled] = useState(false);

  const onSubmit = () => {
    if (enabled) {
      localStorage.setItem(SESSION_STORAGE_KEYS.TERMS_CONDITIONS_ACCEPTED, JSON.stringify(true));
      setOpen(false);
    }
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Modal isOpen={isOpen} onClose={() => {}} isCentered>
      <ModalOverlay background="blackAlpha.800" />
      <ModalContent
        background="navy.900"
        pt="10"
        pb="3"
        borderWidth="1px"
        borderColor="gray.900"
        data-cy="transaction modal"
      >
        <ModalHeader py={0} textAlign="center">
          Synthetix Terms of Service
        </ModalHeader>
        <ModalBody fontSize="xs" color="gray.500">
          <Text fontSize="sm">
            By clicking “I Agree” below, you agree to be bound by the terms of this Agreement. As
            such, you fully understand that:
          </Text>
          <Box
            position="relative"
            onScroll={(e) => {
              const div = e.currentTarget;
              const scrollTopWithTolerance = div.scrollTop + 10;
              if (scrollTopWithTolerance >= div.scrollHeight - div.offsetHeight) {
                setEnabled(true);
              } else {
                setEnabled(false);
              }
            }}
            as="div"
            my={4}
            height="360px"
            overflow="auto"
            sx={{
              '&::-webkit-scrollbar': {
                width: '8px',
                borderRadius: '8px',
                backgroundColor: 'whiteAlpha.50',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'whiteAlpha.300',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: 'whiteAlpha.400',
                },
              },
            }}
          >
            <UnorderedList px={2}>
              <Text fontSize="14px">
                <ListItem>
                  <Link
                    href="https://synthetix.io/"
                    target="_blank"
                    color="cyan.500"
                    _focusVisible={{ outline: 'none' }}
                  >
                    Synthetix
                  </Link>{' '}
                  is a blockchain-based decentralized finance project. You are participating at your
                  own risk.
                </ListItem>
                <ListItem mt={2}>
                  Synthetix is offered for use “as is” and without any guarantees regarding
                  security. The protocol is made up of immutable code and can be accessed through a
                  variety of user interfaces.
                </ListItem>
                <ListItem mt={2}>
                  No central entity operates the Synthetix protocol. Decisions related to the
                  protocol are governed by a dispersed group of participants who collectively govern
                  and maintain the protocol.
                </ListItem>
                <ListItem mt={2}>
                  Synthetix DAO does not unilaterally offer, maintain, operate, administer, or
                  control any trading interfaces. The only user interfaces maintained by Synthetix
                  DAO are the governance and liquidity interfaces herein.
                </ListItem>
                <ListItem mt={2}>
                  You can participate in the governance process by staking SNX tokens in accordance
                  with the rules and parameters summarized{' '}
                  <Link
                    href="https://governance.synthetix.io/"
                    target="_blank"
                    color="cyan.500"
                    _focusVisible={{ outline: 'none' }}
                  >
                    here
                  </Link>
                  , and/or joining the{' '}
                  <Link
                    color="cyan.500"
                    target="_blank"
                    href="https://discord.com/invite/synthetix"
                    _focusVisible={{ outline: 'none' }}
                  >
                    Synthetix Discord
                  </Link>{' '}
                  and contributing to the conversation.
                </ListItem>
                <ListItem mt={2}>
                  The rules and parameters associated with the Synthetix protocol and Synthetix DAO
                  governance are subject to change at any time.
                </ListItem>
                <ListItem mt={2}>
                  Your use of Synthetix is conditioned upon your acceptance to be bound by the
                  Synthetix Term of Use, which can be found{' '}
                  <Link
                    as={ReactRouterLink}
                    to="/terms"
                    target="_blank"
                    color="cyan.500"
                    _focusVisible={{ outline: 'none' }}
                  >
                    here
                  </Link>
                  .
                </ListItem>
                <ListItem mt={2}>
                  The laws that apply to your use of Synthetix may vary based upon the jurisdiction
                  in which you are located. We strongly encourage you to speak with legal counsel in
                  your jurisdiction if you have any questions regarding your use of Synthetix.
                </ListItem>
                <ListItem mt={2}>
                  By entering into this agreement, you are not agreeing to enter into a partnership.
                  You understand that Synthetix is a decentralized protocol provided on an “as is”
                  basis.
                </ListItem>
                <ListItem mt={2}>
                  You hereby release all present and future claims against Synthetix DAO related to
                  your use of the protocol, the SNX token, SNX DAO governance, and any other facet
                  of the protocol.
                </ListItem>
                <ListItem mt={2}>
                  You agree to indemnify and hold harmless SNX DAO and its affiliates for any costs
                  arising out of or relating to your use of the Synthetix protocol.
                </ListItem>
                <ListItem mt={2}>
                  You are not accessing the protocol from Burma (Myanmar), Cuba, Iran, Sudan, Syria,
                  the Western Balkans, Belarus, Côte d’Ivoire, Democratic Republic of the Congo,
                  Iraq, Lebanon, Liberia, Libya, North Korea, Russia, certain sanctioned areas of
                  Ukraine, Somalia, Venezuela, Yemen, or Zimbabwe (collectively, “Prohibited
                  Jurisdictions”), or any other jurisdiction listed as a Specially Designated
                  National by the United States Office of Foreign Asset Control (“OFAC”).
                </ListItem>
              </Text>
            </UnorderedList>
            <Box
              position="sticky"
              bottom="0"
              left="0"
              right="0"
              height="48px"
              bgGradient="linear(to-t, navy.900, transparent)"
              pointerEvents="none"
              opacity={!enabled ? 1 : 0}
              transition="opacity 300ms ease-out"
            />
          </Box>
        </ModalBody>
        <Button
          variant="outline"
          _focusVisible={{ outline: 'none' }}
          mt={0}
          mb={4}
          mx={6}
          onClick={onSubmit}
          isDisabled={!enabled}
        >
          I agree
        </Button>
      </ModalContent>
    </Modal>
  );
};
