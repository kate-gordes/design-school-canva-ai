import React, { useState } from 'react';
import { Box, Rows, Button } from '@canva/easel';
import CollapsibleSection, { type ViewType } from '@/pages/Home/components/CollapsibleSection';
import ResponsiveCardGrid from '@/pages/home/components/ResponsiveCardGrid';
import FileCard from '@/pages/Home/Projects/components/FileCard';
import FileListItem from '@/pages/Home/Projects/components/FileListItem';

// File data interface
export interface FileData {
  id: string;
  name: string;
  fileType: string; // ZIP, TXT, AF, PSD, etc.
  size: string;
  lastModified: string;
  isPrivate?: boolean;
  thumbnailUrl?: string; // Optional thumbnail for design files
}

interface FilesSectionProps {
  files: FileData[];
  onFileClick?: (file: FileData) => void;
  onSeeAllClick?: () => void;
  onShowMoreClick?: () => void;
  initialExpanded?: boolean;
  initialItemsToShow?: number;
  itemsPerPage?: number;
  viewType?: ViewType;
  showAll?: boolean;
  hideHeader?: boolean;
}

export default function FilesSection({
  files,
  onFileClick = file => console.log('File clicked:', file.name),
  onSeeAllClick,
  onShowMoreClick,
  initialExpanded = true,
  initialItemsToShow = 12,
  itemsPerPage = 12,
  viewType = 'grid',
  showAll = false,
  hideHeader = false,
}: FilesSectionProps): React.ReactNode {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleShowMore = () => {
    setItemsToShow(prev => prev + itemsPerPage);
    onShowMoreClick?.();
  };

  const hasMoreItems = !showAll && itemsToShow < files.length;
  const displayedFiles = showAll ? files : files.slice(0, itemsToShow);

  // Grid view content
  const gridContent = (
    <Rows spacing="2u">
      {/* Files Grid */}
      <ResponsiveCardGrid spacing="3u">
        {displayedFiles.map(file => (
          <FileCard key={file.id} file={file} onClick={() => onFileClick(file)} />
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

  // List view content
  const listContent = (
    <Rows spacing="0">
      {displayedFiles.map(file => (
        <FileListItem key={file.id} file={file} onClick={() => onFileClick(file)} />
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
      title="Files"
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
