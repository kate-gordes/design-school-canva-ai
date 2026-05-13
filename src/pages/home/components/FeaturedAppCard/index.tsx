import React from 'react';
import { Box, Rows, Columns, Column, Text, ChevronRightIcon, StaticImage } from '@canva/easel';
import styles from './FeaturedAppCard.module.css';

export interface EditorialFeaturedAppDetails {
  imageUrl: string;
  heading: string;
  headingColor: 'dark' | 'light';
  subheading: string;
  backgroundColor: string;
  backgroundColorSimple?: string;
  externalLink?: string;
  appTitle?: string;
  appIcon?: string;
}

export interface FeaturedAppCardProps {
  app: EditorialFeaturedAppDetails;
  onClick?: () => void;
}

export const FeaturedAppCard: React.FC<FeaturedAppCardProps> = ({ app, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    // Handle external links if provided
    if (app.externalLink) {
      window.open(app.externalLink, '_blank');
    }
  };

  const textColorClass = app.headingColor === 'light' ? styles.lightText : styles.darkText;

  // Use appTitle if provided, otherwise derive from heading
  const displayTitle = app.appTitle || app.heading.split(' ').slice(0, 2).join(' ');

  return (
    /* Plain <div>: Easel Box resets background via reset_f88b8e, which would wipe
       the dynamic app.backgroundColor passed in via the --card-bg CSS variable. */
    <div
      className={styles.card}
      onClick={handleClick}
      style={{ '--card-bg': app.backgroundColor } as React.CSSProperties}
    >
      {/* Main Visual Area with Description Overlay */}
      <Box className={styles.visualArea}>
        {/* Description Text Overlay */}
        <Box className={styles.descriptionOverlay}>
          <Text
            size="medium"
            weight="bold"
            className={`${textColorClass} ${styles.descriptionText}`}
            lineClamp={3}
          >
            {app.heading}
            <ChevronRightIcon size="small" className={styles.inlineChevron} />
          </Text>
        </Box>

        {/* Background Visual */}
        <Box className={styles.visualImageContainer}>
          <StaticImage
            src={app.imageUrl}
            alt={`${displayTitle} illustration`}
            className={styles.visualImage}
          />
        </Box>
      </Box>

      {/* Bottom Info Section */}
      <Box padding="2u" className={styles.infoSection}>
        <Columns spacing="1.5u" alignY="center">
          {/* App Icon */}
          <Column width="content">
            <Box className={styles.iconContainer}>
              {app.appIcon ? (
                <StaticImage
                  src={app.appIcon}
                  alt={`${displayTitle} icon`}
                  className={styles.appIcon}
                />
              ) : (
                <Box className={styles.placeholderIcon}>{displayTitle.charAt(0)}</Box>
              )}
            </Box>
          </Column>

          {/* App Info */}
          <Column>
            <Rows spacing="0.5u">
              <Text size="medium" weight="bold" className={textColorClass} lineClamp={1}>
                {displayTitle}
              </Text>
              <Text size="small" className={`${textColorClass} ${styles.category}`} lineClamp={1}>
                {app.subheading}
              </Text>
            </Rows>
          </Column>
        </Columns>
      </Box>

      {/* Full Description (Hidden, for screen readers) */}
      <Box className={styles.hiddenDescription}>{app.heading}</Box>
    </div>
  );
};

export default FeaturedAppCard;
