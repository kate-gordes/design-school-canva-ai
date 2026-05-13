import React from 'react';
import { Box, Card, CardThumbnail, CardDecorator, Inline, Link } from '@canva/easel';
import { AppCardTitle } from '@/pages/Home/Apps/components/AppCard/AppCardTitle/AppCardTitle';
import styles from './AppVisualCard.module.css';

export interface AppVisualCardInfo {
  name: string;
  cardColor: string;
  image: string;
  description: string;
  textColor: 'light' | 'dark';
  imageAltText?: string;
  onComponentMounted?: (element: HTMLElement) => undefined | (() => void);
  ProBadge?: React.ComponentType;
  externalLink?: string;
}

export interface AppVisualCardProps extends AppVisualCardInfo {
  onClick: () => void;
}

export const AppVisualCard: React.FC<AppVisualCardProps> = ({
  cardColor,
  image,
  description,
  textColor,
  onClick,
  imageAltText,
  onComponentMounted,
  ProBadge,
  externalLink,
}) => {
  const appContainer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (onComponentMounted && appContainer.current) {
      return onComponentMounted(appContainer.current);
    }
  }, [onComponentMounted]);

  const handleClick = () => {
    if (externalLink) {
      window.open(externalLink, '_blank', 'noopener,noreferrer');
    } else if (onClick) {
      onClick();
    }
  };

  const card = (
    <Box className={styles.container} borderRadius="legacyLarge" ref={appContainer}>
      <Card
        onClick={externalLink ? undefined : handleClick}
        buttonAriaLabel="Open app"
        thumbnail={
          <CardThumbnail>
            <div className={styles.content} style={{ backgroundColor: cardColor }}>
              <Inline spacing="0">
                <Box width="full" padding="2u" paddingBottom="1u" className={styles.titleContainer}>
                  <AppCardTitle
                    size="medium"
                    weight="bold"
                    title={description}
                    textColor={textColor}
                    isLink={!!externalLink}
                    lineClamp={3}
                  />
                </Box>
                <img draggable={false} src={image} alt={imageAltText} className={styles.image} />
              </Inline>
            </div>
          </CardThumbnail>
        }
        layout="vertical"
        decorators={
          ProBadge && (
            <CardDecorator visibility="always" location="bottom-end" isInteractive={true}>
              <ProBadge />
            </CardDecorator>
          )
        }
      />
    </Box>
  );

  if (externalLink) {
    return (
      <Link
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.link}
        onClick={handleClick}
      >
        {card}
      </Link>
    );
  }

  return card;
};

export default AppVisualCard;
