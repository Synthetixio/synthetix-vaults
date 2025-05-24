import { ArrowUpIcon, CheckIcon } from '@chakra-ui/icons';
import {
  Button,
  CircularProgress,
  Divider,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Amount } from '@snx-v3/Amount';
import { transactionLink } from '@snx-v3/etherscanLink';
import { ManagePositionContext } from '@snx-v3/ManagePositionContext';
import { useNetwork } from '@snx-v3/useBlockchain';
import { useSystemToken } from '@snx-v3/useSystemToken';
import { WithdrawIncrease } from '@snx-v3/WithdrawIncrease';
import { Wei, wei } from '@synthetixio/wei';
import React from 'react';

export function RepayModal({ txnStatus, txnHash }: { txnStatus: string; txnHash: string | null }) {
  const { debtChange, setCollateralChange, setDebtChange } =
    React.useContext(ManagePositionContext);
  const { data: systemToken } = useSystemToken();
  const [isOpen, setIsOpen] = React.useState(false);
  const { network } = useNetwork();

  React.useEffect(() => {
    if (txnStatus === 'prompting') {
      setIsOpen(true);
    }
    if (txnStatus === 'error') {
      setIsOpen(false);
    }
  }, [txnStatus]);

  // This caching is necessary to keep initial values after success and not reset them to zeroes
  const [repayAmount, setRepayAmount] = React.useState<Wei | undefined>();
  React.useEffect(() => {
    if (debtChange && debtChange.lt(0)) {
      setRepayAmount(debtChange.abs());
    }
  }, [debtChange]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setCollateralChange(wei(0));
        setDebtChange(wei(0));
        setIsOpen(false);
      }}
    >
      <ModalOverlay bg="#06061B80" />
      <ModalContent
        bg="navy.700"
        mt="10%"
        borderWidth="1px"
        borderColor="gray.900"
        minWidth="384px"
      >
        <ModalBody data-cy="repay dialog" p={6}>
          <Text color="white" fontSize="20px" fontWeight={700}>
            Repaying Debt
          </Text>

          <Divider my={4} />

          <Flex
            position="relative"
            alignItems="center"
            gap={4}
            mb={6}
            rounded="lg"
            mt="6"
            p="4"
            border="2px solid"
            transitionProperty="border-color"
            transitionDuration="normal"
            borderColor={txnStatus === 'success' ? 'green.500' : 'gray.900'}
          >
            <Flex
              justifyContent="center"
              alignItems="center"
              borderRadius="100px"
              bg={txnStatus === 'success' ? 'green.600' : 'gray.900'}
              width="40px"
              height="40px"
              p={3}
            >
              {txnStatus === 'success' ? (
                <CheckIcon color="white" />
              ) : (
                <CircularProgress size="25px" isIndeterminate color="gray.700" />
              )}
            </Flex>
            <Flex
              flexDirection="column"
              alignItems="space-between"
              justifyContent="space-between"
              ml={2}
              data-cy="claim rewards info"
            >
              {repayAmount ? (
                <Text fontSize="14px" fontWeight={700} lineHeight="20px" color="white">
                  <Amount
                    prefix={txnStatus === 'success' ? 'Repaid ' : 'Repaying '}
                    value={repayAmount}
                    suffix={` ${systemToken?.displaySymbol}`}
                  />
                </Text>
              ) : (
                <Text fontSize="12px" lineHeight="16px" color="gray.500">
                  Claim your rewards
                </Text>
              )}
            </Flex>
          </Flex>
          <WithdrawIncrease />
          {txnStatus === 'success' ? (
            <Button
              mt={5}
              variant="solid"
              justifyContent="center"
              px={3}
              py={3}
              width="100%"
              textAlign="center"
              onClick={() => setIsOpen(false)}
            >
              Done
            </Button>
          ) : null}
          <Flex
            justifyContent="center"
            px={3}
            py={3}
            mt={6}
            mb={1}
            borderTop="1px solid"
            borderTopColor="gray.900"
            data-cy="transaction hash"
          >
            <Flex
              as={Link}
              isExternal
              variant="outline"
              href={transactionLink({ chainId: network?.id, txnHash })}
              fontFamily="heading"
              color={txnHash ? 'cyan.500' : 'gray.700'}
              cursor={txnHash ? 'pointer' : 'default'}
              fontWeight={700}
              lineHeight="20px"
              fontSize="14px"
              target="_blank"
              mt={3}
              alignItems="center"
              gap={1}
            >
              {txnHash ? (
                <>
                  <Text>View Transaction</Text>
                  <ArrowUpIcon transform="rotate(45deg)" />
                </>
              ) : (
                <>
                  <Text>Signing Transaction</Text>
                </>
              )}
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
