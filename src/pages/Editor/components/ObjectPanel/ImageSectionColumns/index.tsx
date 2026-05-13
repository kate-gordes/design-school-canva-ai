import React, { useState, useCallback } from 'react';
import { Box, Text, Spacer, Card, Placeholder, Grid } from '@canva/easel';
import SeeAll from '@/shared_components/SeeAll';
import styles from './ImageSectionColumns.module.css';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';

interface TemplateItem {
  id: string;
  name: string;
  image: string;
  preview?: string;
}

interface ImageSectionColumnsProps {
  title?: string;
  cardWidth: number;
  cardHeight: number;
  itemCount?: number;
  templates?: TemplateItem[];
  objectFit?: 'cover' | 'contain';
  showProBadge?: boolean;
  onSeeAllClick?: () => void;
}

function ColumnImage({
  src,
  alt,
  height,
  objectFit = 'cover',
  showProBadge = false,
}: {
  src: string;
  alt: string;
  height: number;
  objectFit?: 'cover' | 'contain';
  showProBadge?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const onError = useCallback(() => setFailed(true), []);

  if (failed) {
    return (
      // Plain div: per-card dynamic height from props.
      <div className={styles.placeholderContainer} style={{ width: '100%', height }}>
        <Placeholder shape="rectangle" />
      </div>
    );
  }

  const isContain = objectFit === 'contain';
  const imgEl = (
    <img
      src={src}
      alt={alt}
      className={isContain ? styles.templateImageContain : styles.templateImage}
      style={{ height }}
      loading="lazy"
      onError={onError}
    />
  );

  if (showProBadge) {
    return (
      <div className={styles.cardWrapper}>
        {imgEl}
        <svg className={styles.proBadge} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"
            fill="#C4A052"
            stroke="#C4A052"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M5 19a1 1 0 011-1h12a1 1 0 011 1v0a1 1 0 01-1 1H6a1 1 0 01-1-1v0z"
            fill="#C4A052"
          />
        </svg>
      </div>
    );
  }

  return imgEl;
}

export default function ImageSectionColumns({
  title,
  cardWidth,
  cardHeight,
  itemCount = 2,
  templates,
  objectFit = 'cover',
  showProBadge = false,
  onSeeAllClick,
}: ImageSectionColumnsProps): React.ReactNode {
  const count = templates ? templates.length : itemCount;

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

          <Spacer size="1u" />
        </>
      )}

      <div className={styles.gridWrapper}>
        <Grid columns={count === 1 ? 1 : 2} spacing="1u">
          {Array.from({ length: count }, (_, index) => {
            const tmpl = templates?.[index];
            return (
              <Card
                key={tmpl?.id ?? index}
                thumbnail={
                  tmpl ? (
                    <ColumnImage
                      src={tmpl.preview ?? tmpl.image}
                      alt={tmpl.name}
                      height={cardHeight}
                      objectFit={objectFit}
                      showProBadge={showProBadge}
                    />
                  ) : (
                    // Plain div: per-card dynamic width/height from props.
                    <div
                      className={styles.placeholderContainer}
                      style={{ width: cardWidth, height: cardHeight }}
                    >
                      <Placeholder shape="rectangle" />
                    </div>
                  )
                }
              />
            );
          })}
        </Grid>
      </div>
    </div>
  );
}
