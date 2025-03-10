import { LOCAL_STORAGE_KEYS } from '@snx-v3/constants';
import { useLocalStorage } from '@snx-v3/useLocalStorage';

export function useShowMyPositionsOnly() {
  return useLocalStorage<boolean>(LOCAL_STORAGE_KEYS.SHOW_MY_POSITIONS_ONLY, false);
}
