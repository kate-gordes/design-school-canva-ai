import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import MobileDesignSchool from './MobileDesignSchool';
import DesktopDesignSchool from './DesktopDesignSchool';

/**
 * Design School landing page (`/design-school`). Switches between
 * `MobileDesignSchool` (compact, single-column, mobile chrome) and
 * `DesktopDesignSchool` (HomePageLayout chrome, multi-column carousels)
 * based on the viewport. Both surfaces render the same content via the
 * shared `./data.ts` module, so any catalog edit ships to both at once.
 */
export default function DesignSchool(): React.ReactNode {
  const isMobile = useIsMobile();
  return isMobile ? <MobileDesignSchool /> : <DesktopDesignSchool />;
}
