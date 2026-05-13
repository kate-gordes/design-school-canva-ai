import React, { useState, useCallback } from 'react';
import { Box, Text, Spacer, Placeholder, Carousel, Card } from '@canva/easel';
import { ArrowRightIcon } from '@canva/easel/icons';
import SeeAll from '@/shared_components/SeeAll';
import styles from './ImageSectionCarousel.module.css';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';

interface TemplateItem {
  id: string;
  name: string;
  image: string;
  preview?: string;
}

interface ImageSectionCarouselProps {
  title?: string;
  titleIcon?: React.ReactNode;
  customHeader?: React.ReactNode;
  cardWidth: number;
  cardHeight: number;
  itemCount?: number;
  templates?: TemplateItem[];
  objectFit?: 'cover' | 'contain';
  showProBadge?: boolean;
  onSeeAllClick?: () => void;
}

function CarouselImage({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  showProBadge = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  objectFit?: 'cover' | 'contain';
  showProBadge?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const onError = useCallback(() => setFailed(true), []);

  if (failed) {
    return (
      // Plain div: per-card dynamic width/height from props.
      <div className={styles.placeholderContainer} style={{ width, height }}>
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
      style={isContain ? { height } : { width, height }}
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

export default function ImageSectionCarousel({
  title,
  titleIcon,
  customHeader,
  cardWidth,
  cardHeight,
  itemCount = 8,
  templates,
  objectFit = 'cover',
  showProBadge = false,
  onSeeAllClick,
}: ImageSectionCarouselProps): React.ReactNode {
  const count = templates ? templates.length : itemCount;

  return (
    <div>
      {customHeader ? (
        customHeader
      ) : (
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <Box display="flex" alignItems="center" gap="1u">
            {titleIcon}
            <Text weight="bold" size="medium" className={sharedStyles.sectionTitle}>
              {title}
            </Text>
          </Box>
          {onSeeAllClick && <SeeAll onClick={onSeeAllClick} />}
        </Box>
      )}

      <Spacer size="1u" />

      <Carousel name={title || 'carousel'} buttonVariant="chevron" gutter="small">
        {Array.from({ length: count }, (_, index) => {
          const tmpl = templates?.[index];
          const isContain = objectFit === 'contain';

          if (!tmpl) {
            return (
              // Plain div: per-card dynamic width/height from props.
              <div
                key={index}
                className={styles.placeholderContainer}
                style={{ width: cardWidth, minWidth: cardWidth, flexShrink: 0, height: cardHeight }}
              >
                <Placeholder shape="rectangle" />
              </div>
            );
          }

          const image = (
            <CarouselImage
              src={tmpl.preview ?? tmpl.image}
              alt={tmpl.name}
              width={cardWidth}
              height={cardHeight}
              objectFit={objectFit}
              showProBadge={showProBadge}
            />
          );

          if (isContain) {
            return (
              // Plain div: per-card dynamic width from props.
              <div key={tmpl.id} style={{ width: cardWidth, minWidth: cardWidth, flexShrink: 0 }}>
                <Card thumbnail={image} />
              </div>
            );
          }

          return (
            // Plain div: per-card dynamic width from props.
            <div
              key={tmpl.id}
              className={tmpl.name ? styles.itemWithLabel : undefined}
              style={{ width: cardWidth, minWidth: cardWidth, flexShrink: 0 }}
            >
              {image}
              {tmpl.name && (
                <Text size="small" className={styles.itemLabel}>
                  {tmpl.name}
                </Text>
              )}
            </div>
          );
        })}
        {onSeeAllClick && (
          <button
            key="see-all-arrow"
            className={styles.carouselArrowButton}
            onClick={onSeeAllClick}
            aria-label="See all"
          >
            <ArrowRightIcon size="medium" />
          </button>
        )}
      </Carousel>
    </div>
  );
}
