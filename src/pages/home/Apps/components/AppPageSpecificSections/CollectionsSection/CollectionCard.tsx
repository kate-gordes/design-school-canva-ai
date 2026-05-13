import React from 'react';
import { Box, Rows, Inline, Title, Text, Badge } from '@canva/easel';
import styles from './CollectionCard.module.css';

export interface CollectionCardData {
  id: string;
  title: string;
  subtitle: string;
  thumbnailAlt: string;
  background: string;
  appIcons: { id: string; name: string }[];
  hasMore?: boolean;
}

interface Props {
  card: CollectionCardData;
  onClick?: () => void;
}

export default function CollectionCard({ card, onClick }: Props): React.ReactNode {
  return (
    <Box className={styles.container}>
      <button
        type="button"
        className={styles.cardButton}
        onClick={onClick}
        style={{ backgroundColor: card.background }}
      >
        <div className={styles.thumbnailWrapper}>
          {/* plain gray placeholder thumbnail per prototype policy */}
          <div className={styles.thumbnail} aria-label={card.thumbnailAlt} />
        </div>
        <div className={styles.contentWrapper}>
          <Box
            padding="2u"
            display="flex"
            flexDirection="column"
            justifyContent="spaceBetween"
            height="full"
            position="relative"
          >
            <Rows spacing="0.5u">
              <Title size="small" tone="primary" lineClamp={3}>
                {card.title}
              </Title>
              <Text size="small" tone="secondary" lineClamp={3}>
                {card.subtitle}
              </Text>
            </Rows>
            <Inline spacing="1u" alignY="center">
              {card.appIcons.map(icon => (
                <div key={icon.id} className={styles.appIcon} aria-label={icon.name} />
              ))}
              {card.hasMore && <Badge tone="feedbackOverlay" text="+ more" size="small" />}
            </Inline>
          </Box>
        </div>
      </button>
    </Box>
  );
}
