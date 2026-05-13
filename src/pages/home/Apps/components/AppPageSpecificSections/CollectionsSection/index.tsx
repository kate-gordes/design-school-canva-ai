import React from 'react';
import { Box, Rows, Text } from '@canva/easel';
import SectionTitle from '@/shared_components/SectionTitle';
import CollectionCard, { type CollectionCardData } from './CollectionCard';
import styles from './CollectionsSection.module.css';

const collections: CollectionCardData[] = [
  {
    id: 'design-where-you-work',
    title: 'Design where you work',
    subtitle: 'Integrate Canva into your favorite apps — no design skills needed.',
    thumbnailAlt: 'Design where you work',
    background: '#D7E4FF',
    appIcons: [
      { id: 'app-1', name: '' },
      { id: 'app-2', name: '' },
      { id: 'app-3', name: '' },
      { id: 'app-4', name: '' },
    ],
    hasMore: true,
  },
  {
    id: 'for-beautifully-visual-data',
    title: 'For beautifully visual data',
    subtitle: 'Turn numbers and stats into stunning visuals.',
    thumbnailAlt: 'For beautifully visual data',
    background: '#FFE4C9',
    appIcons: [
      { id: 'app-1', name: '' },
      { id: 'app-2', name: '' },
      { id: 'app-3', name: '' },
      { id: 'app-4', name: '' },
    ],
    hasMore: true,
  },
];

export default function CollectionsSection(): React.ReactNode {
  return (
    <Box width="full">
      <Rows spacing="2u">
        <Rows spacing="0">
          <SectionTitle>Collections</SectionTitle>
          <Text size="medium" tone="tertiary">
            Apps organized by theme to help you find your next favorite.
          </Text>
        </Rows>
        <div className={styles.cardsList}>
          {collections.map(card => (
            <CollectionCard key={card.id} card={card} />
          ))}
        </div>
      </Rows>
    </Box>
  );
}
