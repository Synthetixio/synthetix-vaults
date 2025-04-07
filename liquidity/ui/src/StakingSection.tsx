import { Flex, Heading, Text, Image, Button, Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

export const StakingSection = () => {
	return (
		<Flex mt={16} flexDirection="column" gap={4}>
			<Flex flexDirection="column">
				<Heading
					fontSize="3xl"
					fontFamily="heading"
					fontWeight="medium"
					letterSpacing="tight"
					color="white"
				>
					SNX Staking
				</Heading>
				<Text
					color="gray.500"
					fontSize="1rem"
					lineHeight={6}
					fontFamily="heading"
					mt="1rem"
				>
					Stake your SNX in the new delegate staking pool to earn staking yield
					and extra rewards
				</Text>
			</Flex>
			<Flex p={["4", "6"]} rounded="md" bg="navy.700">
				<Flex
					flexDir={["column", "row"]}
					w="100%"
					rounded="md"
					bg="whiteAlpha.50"
					py={6}
					px={4}
					gap={4}
					alignItems="center"
				>
					<Flex
						flexDir={["column", "row"]}
						alignItems={["start", "center"]}
						flex="1"
						textDecoration="none"
						_hover={{ textDecoration: "none" }}
						gap={3}
					>
						<Image
							src="https://assets.synthetix.io/snx/SNX.svg"
							height="40px"
							width="40px"
							boxShadow="0px 0px 15px 0px rgba(0, 209, 255, 0.60)"
							borderRadius="50%"
							alt="SNX"
						/>

						<Flex flexDirection="column">
							<Text
								color="white"
								fontWeight={700}
								lineHeight="1.25rem"
								fontFamily="heading"
								fontSize="sm"
							>
								SNX 420 Pool
							</Text>
							<Text
								color="gray.500"
								fontFamily="heading"
								fontSize="0.75rem"
								lineHeight="1rem"
							>
								The 420 pool starts generating yield for you from Ethena and
								other yield sources immediately
							</Text>
						</Flex>
					</Flex>

					<Flex width={["100%", "160px"]} justifyContent="flex-end">
						<Button
							as={Link}
							href="https://420.synthetix.io/"
							target="_blank"
							variant="outline"
							color="cyan.500"
							width={["100%", "fit-content"]}
							size="sm"
							rightIcon={
								<ExternalLinkIcon
									color="cyan.500"
									_hover={{ color: "cyan.500" }}
									_active={{ color: "cyan.500" }}
								/>
							}
						>
							Learn More
						</Button>
					</Flex>
				</Flex>
			</Flex>
		</Flex>
	);
};
