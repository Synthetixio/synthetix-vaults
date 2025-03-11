import React from 'react';
import { Wei, wei } from '@synthetixio/wei';
import { useQuery } from '@tanstack/react-query';
import debug from 'debug';
import { ethers } from 'ethers';

import { POOL_ID, tokenOverrides } from '@snx-v3/constants';
import { contractsHash } from '@snx-v3/tsHelpers';
// import { useAllErrors } from '@snx-v3/useAllErrors';
import { type Network, useNetwork, useProvider } from '@snx-v3/useBlockchain';
import { useCollateralTypes } from '@snx-v3/useCollateralTypes';
import { useCoreProxy } from '@snx-v3/useCoreProxy';
import { useRewardsDistributors } from '@snx-v3/useRewardsDistributors';
import { useSynthTokens } from '@snx-v3/useSynthTokens';
import { useTrustedMulticallForwarder } from '@snx-v3/useTrustedMulticallForwarder';
import { useCollateralPrices } from '@snx-v3/useCollateralPrices';
import { usePythPrice } from '@snx-v3/usePythPrice';

const log = debug('snx:useRewards');

export function groupRewardsBySymbol({
  network,
  rewards,
  synthTokens,
}: {
  network: Network;
  rewards?: {
    distributor: {
      payoutToken: {
        address: string;
        symbol: string;
      };
    };
    claimableAmount: Wei;
  }[];
  synthTokens?: {
    address: string;
    token?: {
      address: string;
      symbol: string;
    };
  }[];
}):
  | undefined
  | {
      displaySymbol: string;
      claimableAmount: Wei;
    }[] {
  if (rewards && rewards.length > 0) {
    const map = new Map();
    rewards
      .filter(({ claimableAmount }) => claimableAmount.gt(0))
      .forEach(({ distributor, claimableAmount }) => {
        const synthToken = synthTokens?.find(
          (synth) => synth.address.toLowerCase() === distributor.payoutToken.address.toLowerCase()
        );
        const token = synthToken && synthToken.token ? synthToken.token : distributor.payoutToken;
        const displaySymbol =
          tokenOverrides[`${network.id}-${network.preset}`]?.[token.address]?.symbol ??
          token.symbol;
        if (map.has(displaySymbol)) {
          map.set(displaySymbol, map.get(displaySymbol).add(claimableAmount));
        } else {
          map.set(displaySymbol, claimableAmount);
        }
      });
    return Array.from(map.entries())
      .map(([displaySymbol, claimableAmount]) => ({
        displaySymbol,
        claimableAmount,
      }))
      .sort((a, b) => a.displaySymbol.localeCompare(b.displaySymbol))
      .sort((a, b) => b.claimableAmount.toNumber() - a.claimableAmount.toNumber());
  }
}

export function useRewards({ accountId }: { accountId?: string }) {
  const { network } = useNetwork();
  const provider = useProvider();
  const { data: synthTokens } = useSynthTokens();
  const { data: collateralTypes } = useCollateralTypes();
  const { data: Multicall3 } = useTrustedMulticallForwarder(network);
  const { data: CoreProxy } = useCoreProxy(network);
  // const { data: AllErrors } = useAllErrors(network);
  const { data: rewardsDistributors } = useRewardsDistributors(network);

  return useQuery({
    enabled: Boolean(
      network &&
        CoreProxy &&
        Multicall3 &&
        // AllErrors &&
        rewardsDistributors &&
        accountId &&
        collateralTypes &&
        synthTokens
    ),
    queryKey: [
      `${network?.id}-${network?.preset}`,
      'Rewards',
      { accountId },
      {
        contractsHash: contractsHash([
          CoreProxy,
          Multicall3,
          ...(rewardsDistributors ?? []),
          ...(synthTokens ?? []),
          ...(collateralTypes ?? []),
        ]),
      },
    ],
    queryFn: async () => {
      if (
        !(
          CoreProxy &&
          Multicall3 &&
          // AllErrors &&
          rewardsDistributors &&
          accountId &&
          collateralTypes &&
          synthTokens
        )
      ) {
        throw new Error('OMG');
      }

      const vaultDistributors = rewardsDistributors
        .map((distributor) => {
          if (distributor.collateralType) {
            return {
              method: 'getAvailableRewards',
              claimMethod: 'claimRewards',
              args: [
                ethers.BigNumber.from(accountId),
                ethers.BigNumber.from(POOL_ID),
                distributor.collateralType.address,
                distributor.address,
              ],
              distributor,
              collateralType: distributor.collateralType,
            };
          }
        })
        .filter((item) => item !== undefined);
      log('vaultDistributors', vaultDistributors);

      const poolDistributors = rewardsDistributors
        .filter((distributor) => !distributor.collateralType)
        .filter((distributor) => !distributor.name.includes('Liquidation Rewards'))
        .flatMap((distributor) => ({
          method: 'getAvailablePoolRewards',
          claimMethod: 'claimPoolRewards',
          args: [
            ethers.BigNumber.from(accountId),
            ethers.BigNumber.from(POOL_ID),
            ethers.constants.AddressZero,
            distributor.address,
          ],
          distributor,
          collateralType: undefined,
        }));
      log('poolDistributors', poolDistributors);

      const poolDistributorsPerCollateral = rewardsDistributors
        .filter((distributor) => !distributor.collateralType)
        .filter((distributor) => !distributor.name.includes('Liquidation Rewards'))
        .flatMap((distributor) =>
          collateralTypes.map((collateralType) => ({
            method: 'getAvailablePoolRewards',
            claimMethod: 'claimPoolRewards',
            args: [
              ethers.BigNumber.from(accountId),
              ethers.BigNumber.from(POOL_ID),
              collateralType.address,
              distributor.address,
            ],
            distributor,
            collateralType,
          }))
        );
      log('poolDistributorsPerCollateral', poolDistributorsPerCollateral);

      const liquidationRewardsDistributors = rewardsDistributors
        .filter((distributor) => !distributor.collateralType)
        .filter((distributor) => distributor.name.includes('Liquidation Rewards'))
        .flatMap((distributor) =>
          collateralTypes.map((collateralType) => ({
            method: 'getAvailableRewards',
            claimMethod: 'claimRewards',
            args: [
              ethers.BigNumber.from(accountId),
              ethers.BigNumber.from(POOL_ID),
              collateralType.address,
              distributor.address,
            ],
            distributor,
            collateralType,
          }))
        );
      log('liquidationRewardsDistributors', liquidationRewardsDistributors);

      const multicall = [
        ...vaultDistributors,
        ...poolDistributors,
        ...poolDistributorsPerCollateral,
        ...liquidationRewardsDistributors,
      ];
      log('multicall', multicall);

      const CoreProxyContract = new ethers.Contract(CoreProxy.address, CoreProxy.abi, provider);
      const calls = await Promise.all(
        multicall.map(async ({ method, args }) => {
          const { to, data } = await CoreProxyContract.populateTransaction[method](...args);
          return {
            target: to,
            callData: data,
            allowFailure: true,
          };
        })
      );
      log('calls', calls);

      const Multicall3Contract = new ethers.Contract(Multicall3.address, Multicall3.abi, provider);
      const multicallResponse = await Multicall3Contract.callStatic.aggregate3(calls);
      log('multicallResponse', multicallResponse);

      // const AllErrorsInterface = new ethers.utils.Interface(AllErrors.abi);
      const availableRewards = multicall
        .map(({ method, claimMethod, args, distributor, collateralType }, i) => {
          const { success, returnData } = multicallResponse[i];
          if (!success) {
            // log(
            //   `${method} call error for ${distributor.name}`,
            //   AllErrorsInterface.parseError(returnData)
            // );
            return;
          }
          const [amount] = CoreProxyContract.interface.decodeFunctionResult(method, returnData);
          return {
            method,
            claimMethod,
            args,
            distributor,
            collateralType,
            claimableAmount: wei(amount),
          };
        })
        .filter((info) => info !== undefined);
      log('availableRewards', availableRewards);
      return availableRewards;
    },
  });
}

export function useRewardsByCollateralType({ accountId }: { accountId?: string }) {
  const { network } = useNetwork();
  const { data: rewards } = useRewards({ accountId });
  const { data: collateralTypes } = useCollateralTypes();
  const { data: synthTokens } = useSynthTokens();

  const rewardsTokens = React.useMemo(() => {
    const result: Set<string> = new Set();
    if (rewards) {
      for (const reward of rewards) {
        if (reward.claimableAmount.gt(0)) {
          result.add(reward.distributor.payoutToken.address);
        }
      }
    }
    return result;
  }, [rewards]);

  const { data: rewardsTokenPrices, isPending: isPendingRewardsPrices } = useCollateralPrices(
    rewardsTokens,
    network
  );
  const { data: snxPrice, isPending: isPendingSnxPrice } = usePythPrice('SNX');

  if (
    !network ||
    isPendingRewardsPrices ||
    isPendingSnxPrice ||
    !rewards ||
    !collateralTypes ||
    !synthTokens ||
    !rewardsTokenPrices ||
    !snxPrice
  ) {
    return { isPending: true, data: undefined };
  }
  log('rewardsTokens', rewardsTokens);
  log('rewardsTokenPrices', rewardsTokenPrices);
  log('snxPrice', snxPrice);

  const data = collateralTypes.map((collateralType) => {
    const rewardsForCollateralType = rewards.filter(
      (reward) => reward.collateralType?.address === collateralType.address
    );
    const totalRewardsValue = rewardsForCollateralType.reduce((result, reward) => {
      // all rewards should have price except SNX as it is not a collateral on Base
      if (reward.distributor.payoutToken.symbol === 'SNX') {
        return result.add(reward.claimableAmount.mul(snxPrice));
      }
      if (rewardsTokenPrices.has(reward.distributor.payoutToken.address)) {
        return result.add(
          reward.claimableAmount.mul(rewardsTokenPrices.get(reward.distributor.payoutToken.address))
        );
      }
      return result;
    }, wei(0));

    return {
      collateralType,
      rewards: groupRewardsBySymbol({
        network: network,
        rewards: rewardsForCollateralType,
        synthTokens,
      }),
      totalRewardsValue,
    };
  });
  return { isPending: false, data };
}
