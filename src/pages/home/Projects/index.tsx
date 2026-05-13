import { Box, Rows, Columns, Column, Carousel, Text, Grid } from '@canva/easel';
import SectionTitle from '@/shared_components/SectionTitle';
import { BasicButton, Button, CircleButton } from '@canva/easel/button';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  PlusIcon,
  FolderIcon,
  StarIcon,
  MoreHorizontalIcon,
  SortIcon,
  ListBulletLtrIcon,
} from '@canva/easel/icons';
import { useEffect } from 'react';

import HomePageLayout from '@/pages/Home/components/HomePageLayout';
import HeroSection from '@/pages/Home/components/HeroSection';
import { DesignCard, type ProjectDesign } from '@/pages/home/components/CardThumbnails';
import DesignsSection from '@/pages/home/Projects/components/DesignsSection';
import DesignSection from '@/pages/home/components/DesignSection';
import FolderCard from '@/pages/Home/Projects/components/FolderCard';
import {
  CategoryDropdown,
  DateModifiedDropdown,
  TypeDropdown,
  OwnerDropdown,
} from '@/pages/Home/components/Dropdowns';
import type { DateSortType } from '@/pages/Home/components/Dropdowns/DateModifiedDropdown';
import ViewControls, { type ViewType } from '@/pages/Home/Projects/components/ViewControls';
import FoldersSection, { type FolderData } from '@/pages/Home/components/FoldersSection';
import ImagesSection, { type ImageData } from '@/pages/Home/Projects/components/ImagesSection';
import VideosSection, { type VideoData } from '@/pages/Home/Projects/components/VideosSection';
import FilesSection, { type FileData } from '@/pages/Home/Projects/components/FilesSection';
import { useState } from 'react';
import { projectData, imageData, videoData, fileData, recentsToProjectDesigns } from './SampleData';
import ListView from '@/pages/Home/Projects/components/ListView';
import { useAppContext } from '@/hooks/useAppContext';
import { useDesigns } from '@/hooks/useDesigns';
import { useFolders } from '@/hooks/useFolders';
import { useConnectLoading } from '@/hooks/useConnectLoading';
import useIsMobile from '@/hooks/useIsMobile';
import MobileProjectsPage from '@/pages/home/Projects/MobileProjectsPage';
import styles from './Projects.module.css';

export default function Projects(): React.ReactNode {
  const isMobile = useIsMobile();
  const { setSidebarVisible, setSecondaryNavVisible } = useAppContext();
  const recents = useDesigns();
  const projectsDesigns = recentsToProjectDesigns(recents);
  const folders = useFolders();
  const isLoading = useConnectLoading();

  useEffect(() => {
    setSidebarVisible(true);
    setSecondaryNavVisible(true);
  }, [setSidebarVisible, setSecondaryNavVisible]);
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [owner, setOwner] = useState('all');
  const [dateModified, setDateModified] = useState<DateSortType>('any');
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [nameSort, setNameSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [editedSort, setEditedSort] = useState<'none' | 'asc' | 'desc'>('desc');

  interface TableHeaderProps {
    onNameSort?: () => void;
    onEditedSort?: () => void;
    nameSort?: 'none' | 'asc' | 'desc';
    editedSort?: 'none' | 'asc' | 'desc';
    showViewControls?: boolean;
    viewType?: ViewType;
    onViewTypeChange?: (viewType: ViewType) => void;
  }

  const TableHeader = ({
    onNameSort = () => {},
    onEditedSort = () => {},
    nameSort = 'none',
    editedSort = 'none',
    showViewControls = true,
    viewType: currentViewType = 'grid',
    onViewTypeChange = () => {},
  }: TableHeaderProps) => {
    const getSortIcon = (sortState: 'none' | 'asc' | 'desc') => {
      if (sortState === 'asc') return ChevronUpIcon;
      if (sortState === 'desc') return ChevronDownIcon;
      return ChevronUpDownIcon;
    };

    const SortButton = ({
      label,
      sortState,
      onClick,
    }: {
      label: string;
      sortState: 'none' | 'asc' | 'desc';
      onClick: () => void;
    }) => {
      const Icon = getSortIcon(sortState);
      return (
        <BasicButton onClick={onClick}>
          <Columns spacing="0.5u" alignY="center">
            <Column width="content">
              <Text
                size="small"
                weight="bold"
                tone={sortState !== 'none' ? 'primary' : 'secondary'}
              >
                {label}
              </Text>
            </Column>
            <Column width="content">
              <Icon size="small" />
            </Column>
          </Columns>
        </BasicButton>
      );
    };

    return (
      <Box width="full" padding="2u" borderBottom="standard" background="surface">
        <Columns spacing="2u" alignY="center">
          {/* Name Column */}
          <Column width="fluid">
            <SortButton label="Name" sortState={nameSort} onClick={onNameSort} />
          </Column>

          {/* People Column */}
          <Column width="content">
            <Text size="small" weight="bold" tone="secondary">
              People
            </Text>
          </Column>

          {/* Type Column */}
          <Column width="content">
            <Text size="small" weight="bold" tone="secondary">
              Type
            </Text>
          </Column>

          {/* Edited Column */}
          <Column width="content">
            <SortButton label="Edited" sortState={editedSort} onClick={onEditedSort} />
          </Column>

          {/* View Controls */}
          {showViewControls && (
            <Column width="content">
              <ViewControls
                viewType={currentViewType}
                onViewTypeChange={onViewTypeChange}
                size="small"
                variant="tertiary"
              />
            </Column>
          )}
        </Columns>
      </Box>
    );
  };

  const handleAddNew = () => {
    console.log('Add new button clicked');
  };

  const handleViewTypeChange = (newViewType: ViewType) => {
    setViewType(newViewType);
    console.log('View type changed to:', newViewType);
  };

  const handleDateSortChange = (newDateSort: DateSortType) => {
    setDateModified(newDateSort);
    console.log('Date sort changed to:', newDateSort);
  };

  const handleTabChange = (tabId: string) => {
    console.log('Tab changed to:', tabId);
  };

  const handleNameSort = () => {
    const nextSort = nameSort === 'none' ? 'asc' : nameSort === 'asc' ? 'desc' : 'none';
    setNameSort(nextSort);
    console.log('Name sort changed to:', nextSort);
  };

  const handleEditedSort = () => {
    const nextSort = editedSort === 'none' ? 'desc' : editedSort === 'desc' ? 'asc' : 'none';
    setEditedSort(nextSort);
    console.log('Edited sort changed to:', nextSort);
  };

  const handleFolderClick = (folderName: string) => {
    console.log('Folder clicked:', folderName);
  };

  const handleSeeAllFolders = () => {
    console.log('See all folders clicked');
  };

  const handleDesignClick = (design: ProjectDesign) => {
    console.log('Design clicked:', design.title);
  };

  const handleShowMoreDesigns = () => {
    console.log('Show more designs clicked');
  };

  const handleImageClick = (image: ImageData) => {
    console.log('Image clicked:', image.name);
  };

  const handleShowMoreImages = () => {
    console.log('Show more images clicked');
  };

  const handleVideoClick = (video: VideoData) => {
    console.log('Video clicked:', video.name);
  };

  const handleShowMoreVideos = () => {
    console.log('Show more videos clicked');
  };

  const handleFileClick = (file: FileData) => {
    console.log('File clicked:', file.name);
  };

  const handleShowMoreFiles = () => {
    console.log('Show more files clicked');
  };

  if (isMobile) {
    return <MobileProjectsPage />;
  }

  return (
    <HomePageLayout>
      <HeroSection
        title="All projects"
        gradient={false}
        showWonderboxTabs={false}
        showWonderboxFocusFilters={false}
        wonderboxPlaceholder="Search across all content"
      />

      {/* Filter pills — centered on their own row, under the wonderbox */}
      <Box width="full" paddingTop="2u" display="flex" justifyContent="center">
        <Columns spacing="1u" alignY="center">
          <Column width="content">
            <TypeDropdown value={type} onChange={setType} />
          </Column>
          <Column width="content">
            <CategoryDropdown value={category} onChange={setCategory} />
          </Column>
          <Column width="content">
            <OwnerDropdown value={owner} onChange={setOwner} />
          </Column>
          <Column width="content">
            <DateModifiedDropdown
              value={dateModified}
              onChange={handleDateSortChange}
              onSortChange={handleDateSortChange}
            />
          </Column>
        </Columns>
      </Box>

      {/* Right-side controls — separate row, right-aligned.
          Plain div (not Easel Box) because 56px paddingTop is outside Easel's
          fixed space-token set (max 12u). */}
      <div className={styles.rightControlsRow}>
        <Columns spacing="1u" alignY="center">
          <Column width="content">
            <Button
              variant="tertiary"
              icon={SortIcon}
              onClick={() => console.log('Sort clicked')}
              tooltipLabel="Sort"
            />
          </Column>
          <Column width="content">
            <Button
              variant="tertiary"
              icon={ListBulletLtrIcon}
              onClick={() => handleViewTypeChange(viewType === 'grid' ? 'list' : 'grid')}
              tooltipLabel="Toggle view"
            />
          </Column>
          <Column width="content">
            <CircleButton
              variant="secondary"
              size="small"
              onClick={handleAddNew}
              icon={PlusIcon}
              tooltipLabel="Add new"
            />
          </Column>
        </Columns>
      </div>

      <Rows spacing="3u">
        {/* Recent Designs Carousel Section — always visible.
            Plain div (not Easel Box) because Box resets margin; the negative
            marginTop trims DesignSection's internal 32px top padding so the gap
            between controls and the Recents heading is tighter. */}
        <div className={styles.recentsTrim}>
          <Box width="full" paddingBottom="4u">
            <DesignSection
              title="Recents"
              designs={projectsDesigns}
              showAsCarousel={true}
              isLoading={isLoading}
            />
          </Box>
        </div>

        {/* View-specific content */}
        {viewType === 'list' ? (
          /* List View - New ListView Component */
          <ListView
            items={folders.map(folder => ({
              id: folder.id,
              title: folder.name,
              type: 'Folder',
              editedDate: '2 months ago',
              isPrivate: folder.isPrivate,
              resultDataType: 'realFolder',
            }))}
            onItemClick={item => handleFolderClick(item.title)}
            size="large"
            enableSelection={true}
            renderItemContent={item => {
              const folder = folders.find(f => f.id === item.id);
              if (!folder) return null;

              return (
                <div
                  style={{
                    minHeight: 'calc(var(--base-unit, 8px) * 4)',
                    height: 'fit-content',
                    display: 'grid',
                    alignItems: 'center',
                    gridTemplateColumns: '1fr auto auto auto auto',
                    gap: 'calc(var(--base-unit, 8px) * 2)',
                    width: '100%',
                    padding: 'calc(var(--base-unit, 8px) * 1.5)',
                  }}
                >
                  {/* Name Column */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'calc(var(--base-unit, 8px) * 1)',
                    }}
                  >
                    <FolderIcon size="medium" />
                    <Text weight="bold">{folder.name}</Text>
                  </div>

                  {/* Type Column */}
                  <span style={{ padding: '0 var(--base-unit, 8px)' }}>
                    <Text tone="secondary">Folder</Text>
                  </span>

                  {/* Edited Column */}
                  <span style={{ padding: '0 var(--base-unit, 8px)' }}>
                    <Text tone="secondary">2 months ago</Text>
                  </span>

                  {/* Actions Column */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'calc(var(--base-unit, 8px) * 0.5)',
                    }}
                  >
                    <BasicButton
                      onClick={e => {
                        e.stopPropagation();
                        console.log('Star folder');
                      }}
                    >
                      <StarIcon size="small" />
                    </BasicButton>
                    <BasicButton
                      onClick={e => {
                        e.stopPropagation();
                        console.log('Menu folder');
                      }}
                    >
                      <MoreHorizontalIcon size="small" />
                    </BasicButton>
                  </div>
                </div>
              );
            }}
          />
        ) : (
          /* Grid View - Show all sections */
          <>
            {/* Folders Section */}
            <FoldersSection
              folders={folders}
              onFolderClick={handleFolderClick}
              onSeeAllClick={handleSeeAllFolders}
              viewType={viewType}
              isLoading={isLoading}
            />

            {/* Designs Section */}
            <DesignsSection
              designs={projectsDesigns}
              onDesignClick={handleDesignClick}
              onShowMoreClick={handleShowMoreDesigns}
              viewType={viewType}
              isLoading={isLoading}
            />

            {/* Images Section */}
            <ImagesSection
              images={imageData}
              onImageClick={handleImageClick}
              onShowMoreClick={handleShowMoreImages}
              viewType={viewType}
            />

            {/* Videos Section */}
            <VideosSection
              videos={videoData}
              onVideoClick={handleVideoClick}
              onShowMoreClick={handleShowMoreVideos}
              viewType={viewType}
            />

            {/* Files Section */}
            <FilesSection
              files={fileData}
              onFileClick={handleFileClick}
              onShowMoreClick={handleShowMoreFiles}
              viewType={viewType}
            />
          </>
        )}
      </Rows>
    </HomePageLayout>
  );
}
