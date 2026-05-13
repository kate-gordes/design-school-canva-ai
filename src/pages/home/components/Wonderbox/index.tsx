// Prototype transplanted from: pages/home/wonder_box/page/page.tsx
// Deviations: see .porter-workspace/Home/results/WONDER_BOX.json

import { Box, Inline, Spacer } from '@canva/easel';
import { useEffect, useRef, useState } from 'react';
import { WonderboxProvider, useWonderbox, type TabId } from './WonderboxContext';
import TabPill from './TabPill';
import MagicalSearchInput from './MagicalSearchInput';
import FolderIcon from './icons/FolderIcon';
import TemplateIcon from './icons/TemplateIcon';
import MagicIcon from './icons/MagicIcon';
import {
  CategoryDropdown,
  CreatorDropdown,
  DateModifiedDropdown,
  TypeDropdown,
} from '@/pages/home/components/Dropdowns';
import type { DateSortType } from '@/pages/home/components/Dropdowns/DateModifiedDropdown';
import styles from './Wonderbox.module.css';

const tabOptions: Array<{ id: TabId; label: string; icon: React.ReactNode }> = [
  { id: 'designs', label: 'Your designs', icon: <FolderIcon size={16} /> },
  { id: 'templates', label: 'Templates', icon: <TemplateIcon size={16} /> },
  { id: 'ai', label: 'Canva AI', icon: <MagicIcon size={16} /> },
];

interface WonderboxContentProps {
  showTabs: boolean;
  showFocusFilters: boolean;
  placeholder?: string;
}

function WonderboxContent({
  showTabs,
  showFocusFilters,
  placeholder,
}: WonderboxContentProps): React.ReactNode {
  const { state, setFocused } = useWonderbox();
  const { isExpanded, isFocused } = state;

  const containerRef = useRef<HTMLDivElement>(null);

  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [creator, setCreator] = useState('all');
  const [dateModified, setDateModified] = useState<DateSortType>('any');

  // Close filter row when clicking outside the wonderbox and outside any open dropdown menu.
  useEffect(() => {
    if (!isFocused) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (containerRef.current?.contains(target)) return;
      // Keep open while interacting with a portal-rendered menu/listbox/dialog.
      if (target.closest('[role="listbox"], [role="menu"], [role="dialog"]')) return;
      setFocused(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isFocused, setFocused]);

  return (
    <div ref={containerRef}>
      {/* WonderBoxPageContentPadding: responsive horizontal padding matching content_container.tsx
          paddingStart/End: default 2u=16px, smallUp 3u=24px, largeUp 4u=32px
          Source: pages/home/wonder_box/page/ui/content_container/content_container.tsx */}
      <div className={`${styles.fixedHeader} ${isExpanded ? styles.fixedHeaderExpanded : ''}`}>
        <Box width="full" className={styles.searchInputContainer}>
          {/* Filter Pills - Conditionally rendered */}
          {showTabs && (
            <Box display="flex" justifyContent="center" paddingBottom={isExpanded ? '2u' : '1.5u'}>
              <Inline spacing="1.5u">
                {tabOptions.map(option => (
                  <TabPill key={option.id} id={option.id} icon={option.icon} label={option.label} />
                ))}
              </Inline>
            </Box>
          )}

          {/* Magical Search Input */}
          <MagicalSearchInput placeholder={placeholder} />

          {/* Filter dropdown row — shown beneath the wonderbox when focused.
              Matches /projects filter dropdowns, but centered and with a smaller
              gap between the input and the row. */}
          {isFocused && showFocusFilters && (
            <Box
              display="flex"
              justifyContent="center"
              paddingTop="1.5u"
              className={styles.focusFilterRow}
            >
              <Inline spacing="1u">
                <TypeDropdown value={type} onChange={setType} />
                <CategoryDropdown value={category} onChange={setCategory} />
                <CreatorDropdown value={creator} onChange={setCreator} />
                <DateModifiedDropdown value={dateModified} onChange={setDateModified} />
              </Inline>
            </Box>
          )}
        </Box>
      </div>

      {/* Spacer between search input and page content.
          Source: page.tsx Spacer size={{ default: '3u', smallUp: layout=relaxed-detached ? '6u' : '8u' }}
          DEVIATION [logic]: Using smallUp: '6u' (relaxed-detached layout) since that is the active
          layout on canva.com per getWonderBoxRelaxedDetachedAdjustments() flag. */}
      <Spacer size="0" />
    </div>
  );
}

interface WonderboxProps {
  showTabs?: boolean;
  /** When false, hides the Type/Category/Creator/Date filter row that appears on focus. */
  showFocusFilters?: boolean;
  initialTab?: TabId;
  initialExpanded?: boolean;
  /** Override the search input placeholder (otherwise uses the current tab's default). */
  placeholder?: string;
}

export default function Wonderbox({
  showTabs = true,
  showFocusFilters = true,
  initialTab,
  initialExpanded = false,
  placeholder,
}: WonderboxProps): React.ReactNode {
  return (
    <WonderboxProvider initialTab={initialTab} initialExpanded={initialExpanded}>
      <WonderboxContent
        showTabs={showTabs}
        showFocusFilters={showFocusFilters}
        placeholder={placeholder}
      />
    </WonderboxProvider>
  );
}
