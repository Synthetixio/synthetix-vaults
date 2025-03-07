import { useNetwork, useProvider, useWallet } from '@snx-v3/useBlockchain';
import { useQuery } from '@tanstack/react-query';
import debug from 'debug';
import { ethers } from 'ethers';
import { useStaticAaveUSDC } from '@snx-v3/useStaticAaveUSDC';

const log = debug('snx:useStataUSDCBalance');

export function useStataUSDCBalance() {
  const { network } = useNetwork();
  const provider = useProvider();
  const { activeWallet } = useWallet();
  const walletAddress = activeWallet?.address;

  const { data: StaticAaveUSDC } = useStaticAaveUSDC();

  return useQuery({
    queryKey: [`${network?.id}-${network?.preset}`, 'StaticAaveUSDC Redeem'],
    enabled: Boolean(network && provider && walletAddress && StaticAaveUSDC),
    queryFn: async function () {
      if (!(network && provider && walletAddress && StaticAaveUSDC)) {
        throw new Error('OMFG');
      }
      const StaticAaveUSDCContract = new ethers.Contract(
        StaticAaveUSDC.address,
        StaticAaveUSDC.abi,
        provider
      );
      const maxRedeem = await StaticAaveUSDCContract.maxRedeem(walletAddress);
      const previewRedeem = await StaticAaveUSDCContract.previewRedeem(maxRedeem);

      log('maxRedeem', maxRedeem);
      log('previewRedeem', previewRedeem);

      return {
        maxRedeem,
        previewRedeem,
      };
    },
  });
}
