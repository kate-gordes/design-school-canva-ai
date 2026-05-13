import React, { useState } from 'react';
import { Box, Rows, Button } from '@canva/easel';
import CollapsibleSection, { type ViewType } from '@/pages/home/components/CollapsibleSection';
import ResponsiveCardGrid from '@/pages/home/components/ResponsiveCardGrid';
import { DesignCard, type ProjectDesign } from '@/pages/home/components/CardThumbnails';
import DesignListItem from '@/pages/home/Projects/components/DesignListItem';
import { SkeletonDesignGrid, SkeletonDesignCard } from '@/shared_components/SkeletonCards';

interface DesignsSectionProps {
  designs: ProjectDesign[];
  onDesignClick?: (design: ProjectDesign) => void;
  onSeeAllClick?: () => void;
  onShowMoreClick?: () => void;
  initialExpanded?: boolean;
  initialItemsToShow?: number;
  itemsPerPage?: number;
  viewType?: ViewType;
  showAll?: boolean;
  hideHeader?: boolean;
  /** Render placeholder cards instead of data while Connect hydrates */
  isLoading?: boolean;
}

export default function DesignsSection({
  designs,
  onDesignClick = design => console.log('Design clicked:', design.title),
  onSeeAllClick,
  onShowMoreClick,
  initialExpanded = true,
  initialItemsToShow = 12,
  itemsPerPage = 12,
  viewType = 'grid',
  showAll = false,
  hideHeader = false,
  isLoading = false,
}: DesignsSectionProps): React.ReactNode {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleShowMore = () => {
    setItemsToShow(prev => prev + itemsPerPage);
    onShowMoreClick?.();
  };

  const hasMoreItems = !showAll && itemsToShow < designs.length;
  const displayedDesigns = showAll ? designs : designs.slice(0, itemsToShow);

  const renderCard = (design: ProjectDesign) => (
    <DesignCard
      key={design.id}
      design={design}
      showBadge={false}
      variant="icon"
      onClick={() => onDesignClick(design)}
    />
  );

  // Grid view content
  const gridContent = isLoading ? (
    <SkeletonDesignGrid count={initialItemsToShow} />
  ) : (
    <Rows spacing="2u">
      {/* Designs Grid */}
      <ResponsiveCardGrid spacing="3u">
        {displayedDesigns.map(design => renderCard(design))}
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

  // List view content
  const listContent = isLoading ? (
    <Rows spacing="0">
      {Array.from({ length: initialItemsToShow }).map((_, i) => (
        <SkeletonDesignCard key={i} index={i} />
      ))}
    </Rows>
  ) : (
    <Rows spacing="0">
      {displayedDesigns.map(design => (
        <DesignListItem key={design.id} design={design} onClick={() => onDesignClick(design)} />
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
      title="Designs"
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
