import { useSignals } from '@preact/signals-react/runtime';
import { useMemo } from 'react';
import { connectFolders, isConnected } from '@/store';
import { folderData } from '@/pages/home/Projects/SampleData';
import type { FolderData } from '@/pages/Home/components/FoldersSection';
import { connectFoldersToFolderData } from '@/data/connectAdapter';

// Returns the user's real Canva folders when connected via Connect API,
// otherwise the fake fixtures used across home / projects.
export function useFolders(): FolderData[] {
  useSignals();
  const connected = isConnected.value;
  const raw = connectFolders.value;

  return useMemo(() => {
    if (!connected) return folderData;
    if (raw.length === 0) return [];
    return connectFoldersToFolderData(raw);
  }, [connected, raw]);
}
