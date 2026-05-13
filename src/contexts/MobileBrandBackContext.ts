import { createContext } from 'react';

interface MobileBrandBackContextValue {
  onBack: () => void;
  hideTitle?: boolean;
}

export const MobileBrandBackContext = createContext<MobileBrandBackContextValue | null>(null);
