import { useSignals } from '@preact/signals-react/runtime';
import { useMemo } from 'react';
import { connectDesigns, isConnected } from '@/store';
import { recentDesigns, type RecentDesign } from '@/data/data';
import { connectDesignsToRecents } from '@/data/connectAdapter';

// Returns the user's real Canva designs when connected via Connect API,
// otherwise the fake fixtures used across home / projects.
export function useDesigns(): RecentDesign[] {
  useSignals();
  const connected = isConnected.value;
  const raw = connectDesigns.value;

  return useMemo(() => {
    if (!connected) return recentDesigns;
    if (raw.length === 0) return [];
    return connectDesignsToRecents(raw);
  }, [connected, raw]);
}
