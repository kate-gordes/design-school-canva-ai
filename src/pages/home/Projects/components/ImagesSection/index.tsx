import React, { useState } from 'react';
import { Box, Rows, Button } from '@canva/easel';
import CollapsibleSection, { type ViewType } from '@/pages/Home/components/CollapsibleSection';
import ResponsiveCardGrid from '@/pages/home/components/ResponsiveCardGrid';
import { MediaCard, type MediaData } from '@/pages/home/components/CardThumbnails';
import ImageListItem from '@/pages/Home/Projects/components/ImageListItem';
import useIsMobile from '@/hooks/useIsMobile';

// Re-export ImageData as alias for MediaData for backward compatibility
export type ImageData = MediaData;

interface ImagesSectionProps {
  images: MediaData[];
  onImageClick?: (image: MediaData) => void;
  onSeeAllClick?: () => void;
  onShowMoreClick?: () => void;
  initialExpanded?: boolean;
  initialItemsToShow?: number;
  itemsPerPage?: number;
  viewType?: ViewType;
  showAll?: boolean;
  hideHeader?: boolean;
}

export default function ImagesSection({
  images,
  onImageClick = image => console.log('Image clicked:', image.name),
  onSeeAllClick,
  onShowMoreClick,
  initialExpanded = true,
  initialItemsToShow = 12,
  itemsPerPage = 12,
  viewType = 'grid',
  showAll = false,
  hideHeader = false,
}: ImagesSectionProps): React.ReactNode {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleShowMore = () => {
    setItemsToShow(prev => prev + itemsPerPage);
    onShowMoreClick?.();
  };

  const hasMoreItems = !showAll && itemsToShow < images.length;
  const displayedImages = showAll ? images : images.slice(0, itemsToShow);

  // Grid view content
  const gridContent = (
    <Rows spacing="2u">
      {/* Images Grid */}
      <ResponsiveCardGrid spacing="3u">
        {displayedImages.map(image => (
          <MediaCard
            key={image.id}
            media={image}
            mediaType="image"
            onClick={() => onImageClick(image)}
          />
        ))}
      </ResponsiveCardGrid>

      {/* Show More Button */}
      {hasMoreItems && (
        <Box display="flex" justifyContent="center">
          <Button variant="secondary" onClick={handleShowMore}>
            Show more
          </Button>
        </Box>
      )}
    </Rows>
  );

  // List view content - uses ImageListItem which expects ImageData (compatible with MediaData)
  const listContent = (
    <Rows spacing="0">
      {displayedImages.map(image => (
        <ImageListItem key={image.id} image={image} onClick={() => onImageClick(image)} />
      ))}
      {/* Show More Button for list view */}
      {hasMoreItems && (
        <Box display="flex" justifyContent="center" paddingTop="2u">
          <Button variant="secondary" onClick={handleShowMore}>
            Show more
          </Button>
        </Box>
      )}
    </Rows>
  );

  return (
    <CollapsibleSection
      title="Images"
      isExpanded={isExpanded}
      onToggleExpanded={handleToggleExpanded}
      onSeeAllClick={onSeeAllClick}
      viewType={viewType}
      hideHeader={hideHeader}
      listContent={listContent}
    >
      {gridContent}
    </CollapsibleSection>
  );
}
