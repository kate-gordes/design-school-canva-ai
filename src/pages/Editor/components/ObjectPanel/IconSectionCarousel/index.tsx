import React from 'react';
import { Box, Carousel, Spacer, Rows } from '@canva/easel';
import { Text } from '@canva/easel';
import SeeAll from '@/shared_components/SeeAll';
import styles from './IconSectionCarousel.module.css';

interface IconItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface IconSectionCarouselProps {
  title: string;
  items: IconItem[];
  onSeeAllClick?: () => void;
}

export default function IconSectionCarousel({
  title,
  items,
  onSeeAllClick,
}: IconSectionCarouselProps): React.ReactNode {
  return (
    <Rows spacing="2u">
      {/* Header */}
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        <Text size="medium" weight="bold">
          {title}
        </Text>
        {onSeeAllClick && <SeeAll onClick={onSeeAllClick} />}
      </Box>

      {/* Icons Carousel */}
      <Carousel name={title} buttonVariant="chevron" gutter="small">
        {items.map((item, index) => (
          <button key={index} className={styles.iconItem} onClick={item.onClick}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              className={styles.iconContainer}
            >
              {item.icon}
            </Box>
            <Spacer size="1u" />
            <Text size="small" className={styles.iconLabel}>
              {item.label}
            </Text>
          </button>
        ))}
      </Carousel>
    </Rows>
  );
}
