import { Fade, Flex, Text } from "@chakra-ui/react";
import { formatNumberToUsd, formatNumberToUsdShort } from "@snx-v3/formatters";
import { Network } from "@snx-v3/useBlockchain";
import { LiquidityPositionType } from "@snx-v3/useLiquidityPosition";
import { Wei, wei } from "@synthetixio/wei";
import React from "react";
import {
	CollateralTypeWithDeposited,
	PoolActionButton,
	PoolAPR,
	PoolHeader,
	PoolPerformance,
	PoolUnlockedCollateralValue,
} from "./PoolElements";

export function PoolRow({
	pool: _pool,
	network,
	collateralType,
	tvl,
	price,
	position,
	rewardsValue,
}: {
	collateralType: CollateralTypeWithDeposited;
	pool: {
		name: string;
		id: string;
	};
	network: Network;
	tvl: number;
	price: Wei;
	position: LiquidityPositionType | undefined;
	rewardsValue: Wei;
}) {
	const order = React.useMemo(
		() =>
			wei(
				collateralType.collateralDeposited,
				Number(collateralType.decimals),
				true,
			)
				.mul(price)
				.toNumber()
				.toFixed(0),
		[collateralType.collateralDeposited, collateralType.decimals, price],
	);

	return (
		<Fade in style={{ order }}>
			<Flex
				flexDir="row"
				w="100%"
				rounded="md"
				bg="whiteAlpha.50"
				py={4}
				px={4}
				gap={4}
				alignItems="center"
			>
				<PoolHeader network={network} collateral={collateralType} />

				<Flex width="140px" alignItems="center" justifyContent="flex-end">
					<Text
						fontFamily="heading"
						fontSize="14px"
						lineHeight="20px"
						fontWeight="medium"
						color="white"
						textAlign="right"
					>
						{formatNumberToUsdShort(tvl, {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</Text>
				</Flex>

				<Flex width="140px" alignItems="center" justifyContent="flex-end">
					<PoolAPR network={network} collateral={collateralType} />
				</Flex>

				<Flex width="140px" direction="column" alignItems="flex-end">
					<Text
						fontFamily="heading"
						fontSize="14px"
						fontWeight="medium"
						lineHeight="28px"
						color="white"
					>
						{position?.collateralValue
							? formatNumberToUsd(position.collateralValue.toNumber())
							: "-"}
					</Text>
				</Flex>

				<Flex width="140px" direction="column" alignItems="flex-end">
					<PoolUnlockedCollateralValue position={position} />
				</Flex>

				<Flex width="140px" direction="column" alignItems="flex-end">
					<PoolPerformance position={position} rewardsValue={rewardsValue} />
				</Flex>

				<Flex minW="120px" flex="1" justifyContent="flex-end">
					<PoolActionButton
						network={network}
						collateral={collateralType}
						position={position}
					/>
				</Flex>
			</Flex>
		</Fade>
	);
}
