import { type RecentDesign } from '@/data/data';
import { DesignCard, type ProjectDesign } from '@/pages/home/components/CardThumbnails';
import ResponsiveCardGrid from '@/pages/home/components/ResponsiveCardGrid';
import useIsMobile from '@/hooks/useIsMobile';
import { Box, Button, Carousel, Rows } from '@canva/easel';
import React from 'react';
import SectionTitle from '@/shared_components/SectionTitle';
import { SkeletonDesignCard } from '@/shared_components/SkeletonCards';
import styles from './DesignSection.module.css';

// Union type to support both RecentDesign and ProjectDesign
type DesignType = RecentDesign | ProjectDesign;

interface DesignSectionProps {
  title: string;
  designs: DesignType[];
  showAsCarousel?: boolean;
  hideActions?: boolean;
  borderlessThumbnail?: boolean;
  /** Render placeholder cards instead of data while Connect hydrates */
  isLoading?: boolean;
}

const DesignSection: React.FC<DesignSectionProps> = ({
  title,
  designs,
  showAsCarousel = false,
  hideActions = false,
  borderlessThumbnail = false,
  isLoading = false,
}) => {
  const isMobile = useIsMobile();

  const renderCard = (design: DesignType) => {
    // Convert to ProjectDesign format
    const projectDesign: ProjectDesign = {
      id: design.id,
      title: design.title,
      doctype: design.doctype,
      private: design.private,
      lastModified:
        ('editedTime' in design && design.editedTime)
        || ('lastModified' in design && design.lastModified)
        || 'Recently edited',
      // Pass through thumbnailUrl if it exists (from either ProjectDesign or RecentDesign)
      thumbnailUrl: 'thumbnailUrl' in design ? (design as any).thumbnailUrl : undefined,
      // Pass through containedDoctypes for multi-design
      containedDoctypes:
        'containedDoctypes' in design ? (design as any).containedDoctypes : undefined,
    };

    // Extract imageUrl if it exists (for Brand assets)
    const imageUrl = 'imageUrl' in design ? (design as any).imageUrl : undefined;

    // Use multi-icon display (variant="image") for Multi-design to show contained doctype icons
    // Use single doctype icon for other types
    const cardVariant = projectDesign.doctype.toLowerCase().includes('multi') ? 'image' : 'icon';

    return (
      <DesignCard
        key={design.id}
        design={projectDesign}
        showBadge={false}
        variant={cardVariant}
        imageUrl={imageUrl}
        hideActions={hideActions}
        borderlessThumbnail={borderlessThumbnail}
      />
    );
  };

  const renderMobileRecentAsCarousel = () => {
    const pairs: DesignType[][] = [];
    for (let i = 0; i < designs.length; i += 2) {
      pairs.push(designs.slice(i, i + 2));
    }
    return (
      <Carousel name="recent-designs" gutter="small" buttonVariant="chevron">
        {pairs.map((pair, idx) => (
          /* Plain <div>: Carousel measures children's intrinsic width; Easel Box would
             reset width/margin via reset_f88b8e and break the 150px slot measurement. */
          <div key={idx} className={styles.mobilePairSlot}>
            <div className={styles.pairColumn}>{pair.map(d => renderCard(d))}</div>
          </div>
        ))}
      </Carousel>
    );
  };

  // Desktop carousel for Projects page Recents section
  const renderDesktopCarousel = () => {
    return (
      <Carousel name={`${title.toLowerCase()}-carousel`} gutter="medium" buttonVariant="circular">
        {designs.map(design => (
          /* Plain <div>: Carousel measures children's intrinsic width; Easel Box would
             reset width/margin via reset_f88b8e and break the fixed 200px slot sizing. */
          <div key={design.id} className={styles.desktopCarouselSlot}>
            {renderCard(design)}
          </div>
        ))}
      </Carousel>
    );
  };

  // On mobile brand pages (hideActions=true), don't show the "Assets (XX)" title
  const showTitle = !(isMobile && hideActions);

  const skeletonCount = 8;
  const skeletonGrid = (
    <ResponsiveCardGrid spacing="3u">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <SkeletonDesignCard key={i} index={i} />
      ))}
    </ResponsiveCardGrid>
  );

  return (
    <Box className={styles.container}>
      <Rows spacing="2u">
        {showTitle && <SectionTitle>{title}</SectionTitle>}
        {isLoading ? (
          skeletonGrid
        ) : isMobile
          && (title.toLowerCase() === 'recent designs' || title.toLowerCase() === 'recents') ? (
          renderMobileRecentAsCarousel()
        ) : showAsCarousel && !isMobile ? (
          renderDesktopCarousel()
        ) : (
          <ResponsiveCardGrid spacing="3u">
            {designs.map(design => renderCard(design))}
          </ResponsiveCardGrid>
        )}
      </Rows>
    </Box>
  );
};

export default DesignSection;
