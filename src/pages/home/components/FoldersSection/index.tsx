import React, { useState } from 'react';
import { Divider, Rows, Box, Text, Button } from '@canva/easel';

import { Sheet } from '@canva/easel/surface/sheet';
import { Menu, MenuItem } from '@canva/easel/menu';
import {
  ArrowTopRightIcon,
  FolderIcon,
  InfoIcon,
  MoreHorizontalIcon,
  XIcon,
} from '@canva/easel/icons';
import CollapsibleSection, { type ViewType } from '@/pages/Home/components/CollapsibleSection';
import ResponsiveCardGrid from '@/pages/home/components/ResponsiveCardGrid';
import FolderCard from '@/pages/Home/Projects/components/FolderCard';
import FolderListItem from '@/pages/Home/Projects/components/FolderListItem';
import MobileFolderIcon from '@/shared_components/icons/MobileFolderIcon';
import { SkeletonFolderCard, SkeletonFolderGrid } from '@/shared_components/SkeletonCards';
import useIsMobile from '@/hooks/useIsMobile';
import styles from './FoldersSection.module.css';

interface FolderData {
  id: string;
  name: string;
  isPrivate: boolean;
  itemCount: number;
}

interface FoldersSectionProps {
  folders: FolderData[];
  onFolderClick?: (folderName: string) => void;
  onSeeAllClick?: () => void;
  initialExpanded?: boolean;
  viewType?: ViewType;
  hideHeader?: boolean;
  showHeading?: boolean;
  /** Simple vertical layout without collapsible header (for editor) */
  simpleVertical?: boolean;
  /** Max folders to show in simple vertical mode before "See all" */
  maxFolders?: number;
  /** Optional className applied to the section title text */
  titleClassName?: string;
  /** Grid/list: how many to render before a Show more button */
  initialItemsToShow?: number;
  /** Grid/list: how many more to reveal per Show more click */
  itemsPerPage?: number;
  /** Render placeholder cards instead of data while Connect hydrates */
  isLoading?: boolean;
}

export default function FoldersSection({
  folders,
  onFolderClick = folderName => console.log('Folder clicked:', folderName),
  onSeeAllClick = () => console.log('See all folders clicked'),
  initialExpanded = true,
  viewType = 'grid',
  hideHeader = false,
  showHeading = false,
  simpleVertical = false,
  maxFolders = 3,
  titleClassName,
  initialItemsToShow = 12,
  itemsPerPage = 12,
  isLoading = false,
}: FoldersSectionProps): React.ReactNode {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [showAllFolders, setShowAllFolders] = useState(false);
  const [activeFolder, setActiveFolder] = useState<FolderData | null>(null);
  const [itemsToShow, setItemsToShow] = useState(initialItemsToShow);

  // Mobile folder list rendering
  if (isMobile) {
    if (isLoading) {
      return (
        <Box width="full" className={styles.mobileListContainer}>
          <Rows spacing="0">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonFolderCard key={i} index={i} />
            ))}
          </Rows>
        </Box>
      );
    }
    if (folders.length === 0) return null;

    const visibleFolders = showAllFolders ? folders : folders.slice(0, 3);
    const hasMore = folders.length > 3 && !showAllFolders;

    return (
      <>
        <Box width="full" className={styles.mobileListContainer}>
          <Rows spacing="0">
            {visibleFolders.map(folder => (
              /* Plain <div>: Easel Box resets all margins/background via reset_f88b8e,
                 which would break the row gap/padding used for the tappable mobile row. */
              <div
                key={folder.id}
                onClick={() => onFolderClick(folder.name)}
                className={styles.mobileFolderRow}
              >
                <Box className={styles.mobileFolderIconSlot}>
                  <MobileFolderIcon size={56} />
                </Box>
                <Box className={styles.mobileFolderText}>
                  <Text weight="bold">{folder.name}</Text>
                  <Text size="small" tone="secondary">
                    {folder.itemCount} items
                  </Text>
                </Box>
                {/* Plain <div>: Easel Box resets background/box-shadow via reset_f88b8e,
                    wiping the white fill and elevation ring of this affordance button. */}
                <div
                  className={styles.mobileFolderMenuButton}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setActiveFolder(folder);
                  }}
                >
                  <MoreHorizontalIcon size="medium" />
                </div>
              </div>
            ))}
          </Rows>
          {hasMore && (
            <Box display="flex" justifyContent="center" paddingY="2u">
              <Button variant="secondary" size="small" onClick={() => setShowAllFolders(true)}>
                Show more
              </Button>
            </Box>
          )}
        </Box>

        {/* Folder Action Sheet */}
        <Sheet open={!!activeFolder} onRequestClose={() => setActiveFolder(null)} size="small">
          <Box padding="2u">
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="spaceBetween"
              paddingBottom="1u"
            >
              <Box className={styles.flexGrow}>
                <Text size="medium" weight="bold">
                  {activeFolder?.name}
                </Text>
                <Text size="small" tone="tertiary">
                  By {activeFolder?.isPrivate ? 'You' : 'Michael Musa'}
                </Text>
              </Box>
              <Button
                icon={XIcon}
                variant="tertiary"
                size="small"
                onClick={() => setActiveFolder(null)}
                aria-label="Close"
              />
            </Box>

            <Box paddingY="1u">
              <Divider />
            </Box>

            <Menu>
              <MenuItem
                start={<ArrowTopRightIcon size="medium" />}
                onClick={() => {
                  setActiveFolder(null);
                  console.log('Open in a new tab:', activeFolder?.name);
                }}
              >
                <Text size="medium">Open in a new tab</Text>
              </MenuItem>
              <MenuItem
                start={<InfoIcon size="medium" />}
                onClick={() => {
                  setActiveFolder(null);
                  console.log('Details:', activeFolder?.name);
                }}
              >
                <Text size="medium">Details</Text>
              </MenuItem>
              <MenuItem
                start={<FolderIcon size="medium" />}
                onClick={() => {
                  setActiveFolder(null);
                  console.log('Open in Projects:', activeFolder?.name);
                }}
              >
                <Text size="medium">Open in Projects</Text>
              </MenuItem>
            </Menu>
          </Box>
        </Sheet>
      </>
    );
  }

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Simple vertical layout for editor
  if (simpleVertical) {
    const displayedFolders = folders.slice(0, maxFolders);
    const hasMoreFolders = folders.length > maxFolders;

    return (
      <Box width="full">
        <Rows spacing="2u">
          {/* Heading with See all */}
          <Box display="flex" alignItems="center" justifyContent="spaceBetween">
            <Text size="medium" weight="bold" className={titleClassName}>
              Linked folders
            </Text>
            {hasMoreFolders && (
              /* Plain <button>: Easel Button would inject its own padding/background and
                 ignore the Text tone/weight we wrap here; this affordance is a transparent
                 text link styled entirely by the child Text. */
              <button onClick={onSeeAllClick} className={styles.seeAllButton}>
                <Text size="small" tone="secondary" weight="bold">
                  See all
                </Text>
              </button>
            )}
          </Box>

          {/* Vertical list of folders */}
          <Rows spacing="1u">
            {displayedFolders.map(folder => (
              <FolderCard
                key={folder.id}
                title={folder.name}
                itemCount={folder.itemCount}
                isPrivate={folder.isPrivate}
                onClick={() => onFolderClick(folder.name)}
              />
            ))}
          </Rows>
        </Rows>
      </Box>
    );
  }

  const hasMoreItems = itemsToShow < folders.length;
  const displayedFolders = folders.slice(0, itemsToShow);
  const handleShowMore = () => setItemsToShow(prev => prev + itemsPerPage);

  // Grid view content
  const gridContent = isLoading ? (
    <SkeletonFolderGrid count={6} />
  ) : (
    <Rows spacing="2u">
      <ResponsiveCardGrid spacing="2u">
        {displayedFolders.map(folder => (
          <FolderCard
            key={folder.id}
            title={folder.name}
            itemCount={folder.itemCount}
            onClick={() => onFolderClick(folder.name)}
            isPrivate={folder.isPrivate}
          />
        ))}
      </ResponsiveCardGrid>

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
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonFolderCard key={i} index={i} />
      ))}
    </Rows>
  ) : (
    <Rows spacing="0">
      {displayedFolders.map((folder, index) => (
        <FolderListItem
          key={folder.id}
          folder={folder}
          onClick={() => onFolderClick(folder.name)}
          isLast={index === displayedFolders.length - 1}
          size="large"
        />
      ))}
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
      title="Folders and courses"
      isExpanded={isExpanded}
      onToggleExpanded={handleToggleExpanded}
      onSeeAllClick={onSeeAllClick}
      viewType={viewType}
      hideHeader={hideHeader || showHeading}
      listContent={listContent}
    >
      {gridContent}
    </CollapsibleSection>
  );
}

export type { FolderData };
