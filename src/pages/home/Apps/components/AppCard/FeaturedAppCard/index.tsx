import React from 'react';
import { Box, Rows, Columns, Column, Text, StaticImage } from '@canva/easel';
import AppVisualCard from '@/pages/Home/Apps/components/AppVisualCard';
import styles from './FeaturedAppCard.module.css';

export interface FeaturedAppCardData {
  // App visual card properties
  name: string;
  cardColor: string;
  image: string;
  description: string;
  textColor: 'light' | 'dark';
  imageAltText?: string;
  onComponentMounted?: (element: HTMLElement) => undefined | (() => void);
  ProBadge?: React.ComponentType;
  externalLink?: string;
  onClick: () => void;

  // Additional app info for bottom extension
  appIcon: string;
  appTitle: string;
  category: string;
}

export interface FeaturedAppCardProps {
  app: FeaturedAppCardData;
  onClick?: () => void;
}

export const FeaturedAppCard: React.FC<FeaturedAppCardProps> = ({ app, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (app.onClick) {
      app.onClick();
    }
  };

  const textColorClass = app.textColor === 'light' ? styles.lightText : styles.darkText;

  return (
    <Box className={styles.featuredCard}>
      {/* Top: App Visual Card */}
      <AppVisualCard
        name={app.name}
        cardColor={app.cardColor}
        image={app.image}
        description={app.description}
        textColor={app.textColor}
        imageAltText={app.imageAltText}
        onClick={handleClick}
        onComponentMounted={app.onComponentMounted}
        ProBadge={app.ProBadge}
        externalLink={app.externalLink}
      />

      {/* Bottom: Card Extension with App Info */}
      <Box padding="2u" className={styles.cardExtension}>
        <Columns spacing="1.5u" alignY="center">
          {/* App Icon */}
          <Column width="content">
            <div className={styles.iconContainer}>
              <StaticImage
                src={app.appIcon}
                alt={`${app.appTitle} icon`}
                className={styles.appIcon}
              />
            </div>
          </Column>

          {/* App Info */}
          <Column>
            <Rows spacing="0.5u">
              <Text size="medium" weight="bold" className={textColorClass} lineClamp={1}>
                {app.appTitle}
              </Text>
              <Text size="small" className={`${textColorClass} ${styles.category}`} lineClamp={1}>
                {app.category}
              </Text>
            </Rows>
          </Column>
        </Columns>
      </Box>
    </Box>
  );
};

export default FeaturedAppCard;
