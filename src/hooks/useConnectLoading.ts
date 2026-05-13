import { useSignals } from '@preact/signals-react/runtime';
import { connectLoading } from '@/store';

// True while the Connect API is hydrating user data. Consumers flip from
// fixture data to skeleton UI during this window so the prototype doesn't
// look broken on first paint after sign-in.
export function useConnectLoading(): boolean {
  useSignals();
  return connectLoading.value;
}
