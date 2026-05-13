import React, { useState } from 'react';
import { Box, Rows, Button } from '@canva/easel';
import CollapsibleSection, { type ViewType } from '@/pages/Home/components/CollapsibleSection';
import ResponsiveCardGrid from '@/pages/home/components/ResponsiveCardGrid';
import { MediaCard, type MediaData } from '@/pages/home/components/CardThumbnails';
import VideoListItem from '@/pages/Home/Projects/components/VideoListItem';
import useIsMobile from '@/hooks/useIsMobile';

// Re-export VideoData as alias for MediaData for backward compatibility
export type VideoData = MediaData;

interface VideosSectionProps {
  videos: MediaData[];
  onVideoClick?: (video: MediaData) => void;
  onSeeAllClick?: () => void;
  onShowMoreClick?: () => void;
  initialExpanded?: boolean;
  initialItemsToShow?: number;
  itemsPerPage?: number;
  viewType?: ViewType;
  showAll?: boolean;
  hideHeader?: boolean;
}

export default function VideosSection({
  videos,
  onVideoClick = video => console.log('Video clicked:', video.name),
  onSeeAllClick,
  onShowMoreClick,
  initialExpanded = true,
  initialItemsToShow = 12,
  itemsPerPage = 12,
  viewType = 'grid',
  showAll = false,
  hideHeader = false,
}: VideosSectionProps): React.ReactNode {
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

  const hasMoreItems = !showAll && itemsToShow < videos.length;
  const displayedVideos = showAll ? videos : videos.slice(0, itemsToShow);

  // Grid view content
  const gridContent = (
    <Rows spacing="2u">
      {/* Videos Grid */}
      <ResponsiveCardGrid spacing="3u">
        {displayedVideos.map(video => (
          <MediaCard
            key={video.id}
            media={video}
            mediaType="video"
            onClick={() => onVideoClick(video)}
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

  // List view content - uses VideoListItem which expects VideoData (compatible with MediaData)
  const listContent = (
    <Rows spacing="0">
      {displayedVideos.map(video => (
        <VideoListItem key={video.id} video={video} onClick={() => onVideoClick(video)} />
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
      title="Videos"
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
