import React from 'react';
import { Box, Rows, Title, Text, Carousel } from '@canva/easel';
import AppVisualCard from '@/pages/Home/Apps/components/AppVisualCard';
import type { AppVisualCardInfo } from '@/pages/Home/Apps/components/AppVisualCard';
import styles from './CarouselBanner.module.css';

// Simple classNames utility function
const classNames = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface CarouselBannerCard extends AppVisualCardInfo {
  id: string;
  onClick?: () => void;
}

export interface CarouselBannerProps {
  title: string;
  subtitle: string;
  cards: CarouselBannerCard[];
  className?: string;
  variant?: 'default' | 'trending';
}

const CarouselBanner: React.FC<CarouselBannerProps> = ({
  title,
  subtitle,
  cards,
  className,
  variant = 'default',
}) => {
  return (
    <Box
      className={classNames(
        styles.bannerContainer,
        variant === 'trending' && styles.trending,
        className,
      )}
      width="full"
      paddingY="3u"
      paddingStart="4u"
      paddingEnd="0"
    >
      <Rows spacing="3u">
        {/* Header Section */}
        <Rows spacing="1u">
          <Title size="large" className={styles.bannerTitle}>
            {title}
          </Title>
          <Text size="large" className={styles.bannerSubtitle}>
            {subtitle}
          </Text>
        </Rows>

        {/* Carousel Section */}
        <Carousel name="trending-apps-carousel" gutter="medium" buttonVariant="circular">
          {cards.map(card => (
            <AppVisualCard
              key={card.id}
              name={card.name}
              cardColor={card.cardColor}
              image={card.image}
              description={card.description}
              textColor={card.textColor}
              imageAltText={card.imageAltText}
              onClick={card.onClick || (() => {})}
              externalLink={card.externalLink}
            />
          ))}
        </Carousel>
      </Rows>
    </Box>
  );
};

export default CarouselBanner;
