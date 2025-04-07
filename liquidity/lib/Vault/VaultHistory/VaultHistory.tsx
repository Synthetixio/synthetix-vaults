import { BorderBox } from "@snx-v3/BorderBox";
import {
	Tab,
	Table,
	TabList,
	Tabs,
	TabIndicator,
	Th,
	Thead,
	Tr,
	Tbody,
	Td,
	Box,
	Text,
} from "@chakra-ui/react";
import { useState } from "react";

export const VaultHistory = () => {
	const [index, setIndex] = useState(0);
	return (
		<BorderBox
			mt={6}
			alignSelf="self-start"
			flex={1}
			border="none"
			flexDir="column"
			p={6}
			gap={4}
		>
			<Tabs index={index}>
				<TabList overflow="auto">
					<Tab
						color={index === 0 ? "white" : "gray.500"}
						fontWeight={400}
						fontSize="sm"
						whiteSpace="nowrap"
						textDecoration="none"
						_hover={{ textDecoration: "none" }}
						onClick={() => setIndex(0)}
					>
						Deposits & Withdrawals
					</Tab>

					<Tab
						color={index === 1 ? "white" : "gray.500"}
						fontWeight={400}
						fontSize="sm"
						whiteSpace="nowrap"
						textDecoration="none"
						_hover={{ textDecoration: "none" }}
						onClick={() => setIndex(1)}
					>
						Positions (5)
					</Tab>

					<Tab
						color={index === 2 ? "white" : "gray.500"}
						fontWeight={400}
						fontSize="sm"
						whiteSpace="nowrap"
						textDecoration="none"
						_hover={{ textDecoration: "none" }}
						onClick={() => setIndex(2)}
					>
						Trade History
					</Tab>

					<Tab
						color={index === 3 ? "white" : "gray.500"}
						fontWeight={400}
						fontSize="sm"
						whiteSpace="nowrap"
						textDecoration="none"
						_hover={{ textDecoration: "none" }}
						onClick={() => setIndex(3)}
					>
						Funding History
					</Tab>
				</TabList>

				<Box
					overflow="auto"
					rounded="6px"
					mt={4}
					bg="whiteAlpha.50"
					borderWidth="1px"
					borderColor="whiteAlpha.200"
				>
					<Table>
						<Thead>
							<Tr>
								<Th
									py={2}
									textTransform="unset"
									color="gray.600"
									border="none"
									fontFamily="heading"
									fontSize="12px"
									lineHeight="16px"
									fontWeight={400}
								>
									Date
								</Th>
								<Th
									py={2}
									textTransform="unset"
									color="gray.600"
									border="none"
									fontFamily="heading"
									fontSize="12px"
									lineHeight="16px"
									fontWeight={400}
								>
									Address
								</Th>

								<Th
									py={2}
									textTransform="unset"
									color="gray.600"
									border="none"
									fontFamily="heading"
									fontSize="12px"
									lineHeight="16px"
									fontWeight={400}
								>
									Value
								</Th>
								<Th
									py={2}
									textTransform="unset"
									color="gray.600"
									border="none"
									fontFamily="heading"
									fontSize="12px"
									lineHeight="16px"
									fontWeight={400}
								>
									Realised PnL
								</Th>
								<Th
									py={2}
									textTransform="unset"
									color="gray.600"
									border="none"
									fontFamily="heading"
									fontSize="12px"
									lineHeight="16px"
									fontWeight={400}
								>
									Transaction
								</Th>
							</Tr>
						</Thead>

						<Tbody>
							<Tr
								border="none"
								borderTop="1px"
								borderTopColor="gray.900"
								width="100%"
								height="0px"
							>
								<Td height="0px" border="none" px={0} pt={0} pb={0} />
								<Td height="0px" border="none" px={0} pt={0} pb={0} />
								<Td height="0px" border="none" px={0} pt={0} pb={0} />
								<Td height="0px" border="none" px={0} pt={0} pb={0} />
								<Td height="0px" border="none" px={0} pt={0} pb={0} />
								<Td height="0px" border="none" px={0} pt={0} pb={0} />
								<Td height="0px" border="none" px={0} pt={0} pb={0} />
							</Tr>

							<Tr>
								<Td border="none" fontSize="12px" fontWeight={400} py={2}>
									02/24/2025
									<Text textColor="gray.500">14:03:21</Text>
								</Td>
								<Td border="none" fontSize="12px" fontWeight={400} py={2}>
									0x46f...ec8fc
								</Td>
								<Td border="none" fontSize="12px" fontWeight={400} py={2}>
									$1,200.0232
								</Td>
								<Td border="none" fontSize="12px" fontWeight={400} py={2}>
									-
								</Td>
								<Td
									textDecoration="underline"
									border="none"
									fontSize="12px"
									fontWeight={400}
									py={2}
								>
									0x46f...ec8fc
								</Td>
							</Tr>
							<Tr>
								<Td border="none" fontSize="12px" fontWeight={400} py={2}>
									02/24/2025
									<Text textColor="gray.500">14:03:21</Text>
								</Td>
								<Td border="none" fontSize="12px" fontWeight={400} py={2}>
									0x46f...ec8fc
								</Td>
								<Td border="none" fontSize="12px" fontWeight={400} py={2}>
									$1,200.0232
								</Td>
								<Td border="none" fontSize="12px" fontWeight={400} py={2}>
									-
								</Td>
								<Td
									textDecoration="underline"
									border="none"
									fontSize="12px"
									fontWeight={400}
									py={2}
								>
									0x46f...ec8fc
								</Td>
							</Tr>
						</Tbody>
					</Table>
				</Box>
			</Tabs>
		</BorderBox>
	);
};
