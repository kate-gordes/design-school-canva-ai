import React from 'react';
import { Box, Rows, Columns, Column, Text, StaticImage, AspectRatio, Inline } from '@canva/easel';
import { AppCardTitle } from '@/pages/Home/Apps/components/AppCard/AppCardTitle/AppCardTitle';
import styles from './FeaturedAppsCard.module.css';

export interface FeaturedAppsCardProps {
  id: string;
  heading: string;
  headingColor: 'light' | 'dark';
  subheading: string;
  backgroundColor: string;
  imageUrl: string;
  iconUrl: string;
  title: string;
  onClick: () => void;
  onComponentMounted?: (element: HTMLElement) => undefined | (() => void);
}

export const FeaturedAppsCard: React.FC<FeaturedAppsCardProps> = ({
  heading,
  headingColor,
  subheading,
  backgroundColor,
  imageUrl,
  iconUrl,
  title,
  onClick,
  onComponentMounted,
}) => {
  const appContainer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (onComponentMounted && appContainer.current) {
      return onComponentMounted(appContainer.current);
    }
  }, [appContainer, onComponentMounted]);

  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <div ref={appContainer} className={styles.card} onClick={onClick}>
      <div className={`${styles.background} ${styles.border}`}>
        <Rows spacing="0">
          {/* Top: Colored background with heading and image */}
          <div style={{ backgroundColor, position: 'relative' }}>
            <Rows spacing="0">
              <Box padding="2u">
                <Inline spacing="0" alignY="center">
                  <AppCardTitle
                    title={heading}
                    size="large"
                    weight="bold"
                    textColor={headingColor}
                    feature={true}
                    isLink={false}
                  />
                </Inline>
              </Box>
              <AspectRatio ratio={133 / 71}>
                <StaticImage src={imageUrl} className={styles.cardImage} alt={title} />
              </AspectRatio>
            </Rows>
          </div>

          {/* Bottom: Details section */}
          <Box paddingX="2u" paddingY="1.5u" className={styles.details}>
            <Columns alignY="start" spacing="1u">
              <Column width="content">
                <Box paddingEnd="0.5u" paddingTop="0.5u">
                  <StaticImage src={iconUrl} className={styles.appIcon} alt={title} />
                </Box>
              </Column>
              <Column>
                <Text weight="bold" size="small" lineClamp={1} id={titleId}>
                  {title}
                </Text>
                <Text size="small" tone="secondary" lineClamp={1} id={descriptionId}>
                  {subheading}
                </Text>
              </Column>
            </Columns>
          </Box>
        </Rows>
      </div>
    </div>
  );
};

export default FeaturedAppsCard;
