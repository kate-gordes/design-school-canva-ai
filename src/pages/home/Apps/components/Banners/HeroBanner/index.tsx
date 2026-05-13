import React from 'react';
import { Text, Title, Badge, Box, Columns, Column } from '@canva/easel';
import styles from './HeroBanner.module.css';

export interface MarketplaceBanner {
  type: 'APP_BANNER' | 'INTEGRATION_BANNER';
  appId?: string;
  integrationId?: string;
  creator?: string;
  base: {
    name: string;
    description: string;
    callToAction: string;
    tag?: string;
    imageUrl?: string;
    images?: string[];
  };
}

export interface HeroBannerProps {
  marketplaceBanner?: MarketplaceBanner;
  onClick?: () => void;
  ButtonIcon?: React.ComponentType<{ size?: string }>;
  onImageLoad?: () => void;
  observeHeroBanner?: (name: string, appOrIntegrationId: string, element: HTMLElement) => void;

  badgeText?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonVariant?: 'primary' | 'secondary' | 'tertiary';
  onButtonClick?: () => void;
  images?: string[];
  textColor?: 'light' | 'dark';
  backgroundColor?: string;
  reducedHeight?: boolean;
  showBadge?: boolean;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  marketplaceBanner,
  onClick,

  badgeText,
  title,
  subtitle,
  buttonText,
  onButtonClick,
  images = [],
  textColor = 'light',
  backgroundColor = '#2196F3',
  showBadge = true,
}) => {
  const isOfficialMode = !!marketplaceBanner;

  const displayData = isOfficialMode
    ? {
        badgeText: marketplaceBanner!.base.tag || '',
        title: marketplaceBanner!.base.name,
        subtitle: marketplaceBanner!.base.description,
        buttonText: marketplaceBanner!.base.callToAction,
        images:
          marketplaceBanner!.base.images
          || (marketplaceBanner!.base.imageUrl ? [marketplaceBanner!.base.imageUrl] : []),
        showBadge: !!marketplaceBanner!.base.tag,
      }
    : {
        badgeText: badgeText || '',
        title: title || '',
        subtitle: subtitle || '',
        buttonText: buttonText || '',
        images,
        showBadge,
      };

  const handleClick = () => {
    if (isOfficialMode && onClick) {
      onClick();
    } else if (onButtonClick) {
      onButtonClick();
    }
  };

  const textStyle = textColor === 'light' ? styles.whiteFont : styles.blackFont;

  return (
    <div className={styles.container} style={{ backgroundColor }}>
      <Box className={styles.content}>
        {displayData.showBadge && (
          <Box className={styles.badge}>
            <Badge tone="feedbackOverlay" text={displayData.badgeText} />
          </Box>
        )}
        <Box className={`${styles.title} ${textStyle}`}>
          <Title size="large" tone="InheritColor">
            {displayData.title}
          </Title>
        </Box>
        <Box className={textStyle}>
          <Text size="large" tone="InheritColor">
            {displayData.subtitle}
          </Text>
        </Box>
        <Box className={styles.buttonContainer}>
          <button type="button" className={styles.ctaButton} onClick={handleClick}>
            <Columns spacing="1u" alignY="center">
              <Column>
                <Text tone="InheritColor" weight="bold" size="medium" alignment="center">
                  {displayData.buttonText}
                </Text>
              </Column>
            </Columns>
          </button>
        </Box>
      </Box>
    </div>
  );
};

export const HeroBannerPlaceholder: React.FC = () => {
  return <div className={styles.container} />;
};

export default HeroBanner;
