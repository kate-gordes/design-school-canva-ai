import type { ReactNode } from 'react';
import { Pill, Box } from '@canva/easel';
import { useWonderbox, type TabId } from './WonderboxContext';

interface TabPillProps {
  id: TabId;
  icon: ReactNode;
  label: string;
}

export default function TabPill({ id, icon, label }: TabPillProps): React.ReactNode {
  const { state, setSelectedTab, deactivateFilter, setExpanded } = useWonderbox();
  const { selectedTab, isExpanded } = state;
  const isActive = selectedTab === id;

  const handleTabClick = () => {
    setSelectedTab(id);
    setExpanded(true); // Always expand when tab is clicked
    // Reset active filter when switching tabs
    if (state.activeFilter) {
      deactivateFilter();
    }
  };

  const handleRemoveClick = () => {
    // Collapse the Wonderbox when X button is clicked
    if (isActive && isExpanded) {
      setExpanded(false);
      deactivateFilter();
    }
  };

  return (
    <Pill
      size="small"
      role="combobox"
      text={label}
      start={<Box paddingRight="0.25u">{icon}</Box>}
      selected={isActive}
      onClick={handleTabClick}
      onRemoveClick={isActive && isExpanded ? handleRemoveClick : undefined}
    />
  );
}
