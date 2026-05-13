import React from 'react';
import { Card, CardThumbnail, Box, CardDecorator, MoreHorizontalIcon, Button } from '@canva/easel';
import { AspectRatio } from '@canva/easel/aspect_ratio';
import useIsMobile from '@/hooks/useIsMobile';
import styles from './LogoAssetCard.module.css';

export interface LogoAssetCardProps {
  title: string;
  image: string;
  description?: string;
  onClick?: () => void;
  showMetadata?: boolean;
}

export const LogoAssetCard: React.FC<LogoAssetCardProps> = ({
  title,
  image,
  description,
  onClick,
  showMetadata = true,
}) => {
  const isMobile = useIsMobile();

  return (
    <AspectRatio ratio={4 / 4}>
      <Card
        title={showMetadata ? title : undefined}
        description={showMetadata ? description : undefined}
        layout="vertical"
        thumbnail={
          <CardThumbnail>
            <Box className={styles.imageContainer}>
              <img src={image} alt={title} className={styles.image} />
            </Box>
          </CardThumbnail>
        }
        onClick={onClick}
        hoverEffect="scaleThumbnail"
        borderRadius="element"
        decorators={
          <>
            <CardDecorator
              location="top-end"
              visibility={isMobile ? 'always' : 'on-hover'}
              isInteractive={true}
            >
              {isMobile ? (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: '#fff',
                    boxShadow:
                      'rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 89, 0.137) 0px 1px 2px 0px, rgba(24, 44, 89, 0.137) 0px 2px 4px 0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => {}}
                >
                  <MoreHorizontalIcon size="medium" />
                </div>
              ) : (
                <Box
                  shadow="surface"
                  background="surface"
                  borderRadius="element"
                  padding="0.5u"
                  display="flex"
                >
                  <Button
                    icon={MoreHorizontalIcon}
                    variant="tertiary"
                    size="small"
                    onClick={() => {}}
                  />
                </Box>
              )}
            </CardDecorator>
          </>
        }
        hoverBoundary="thumbnail"
      />
    </AspectRatio>
  );
};
