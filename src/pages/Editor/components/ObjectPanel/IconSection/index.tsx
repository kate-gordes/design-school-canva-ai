import React from 'react';
import { Box, Text, Spacer, Grid } from '@canva/easel';
import SeeAll from '@/shared_components/SeeAll';
import styles from './IconSection.module.css';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';

interface IconSectionProps {
  title?: string;
  items: Array<{
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
  }>;
  onSeeAllClick?: () => void;
}

export default function IconSection({
  title,
  items,
  onSeeAllClick,
}: IconSectionProps): React.ReactNode {
  return (
    <div>
      {title && (
        <>
          <Box display="flex" justifyContent="spaceBetween" alignItems="center">
            <Text weight="bold" size="medium" className={sharedStyles.sectionTitle}>
              {title}
            </Text>
            {onSeeAllClick && <SeeAll onClick={onSeeAllClick} />}
          </Box>
          <Spacer size="2u" />
        </>
      )}

      <Grid columns={4} spacing="2u">
        {items.map((item, index) => (
          <button key={index} className={styles.iconItem} onClick={item.onClick}>
            <Box
              className={styles.iconContainer}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {item.icon}
            </Box>
            <Spacer size="1u" />
            <Text size="small" alignment="center" className={styles.iconLabel}>
              {item.label}
            </Text>
          </button>
        ))}
      </Grid>
    </div>
  );
}
