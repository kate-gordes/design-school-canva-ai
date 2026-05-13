import React from 'react';
import { starredItems, teamItems, recentItems } from '@/data/data';
import CollapsableSection from './CollapsableSection';

export default function HomeContextualNav(): React.ReactNode {
  return (
    <>
      <CollapsableSection title="Your starred" items={starredItems} hasPlus />
      <CollapsableSection title="Starred for Canva Team" items={teamItems} />
      <CollapsableSection title="Recent designs" items={recentItems} />
    </>
  );
}
