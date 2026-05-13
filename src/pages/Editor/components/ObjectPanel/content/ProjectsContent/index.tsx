import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Spacer,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Rows,
  Masonry,
  MasonryItem,
  Text,
  Button,
} from '@canva/easel';
import { FolderIcon, ChevronDownIcon, CheckIcon, UsersIcon } from '@canva/easel/icons';
import { RegularSearch } from '@/shared_components/Search';
import { DesignCard } from '@/pages/home/components/CardThumbnails';
import ImageSectionColumns from '@/pages/Editor/components/ObjectPanel/ImageSectionColumns';
import FolderCard from '@/pages/Home/Projects/components/FolderCard';
import styles from './ProjectsContent.module.css';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';
import SeeAll from '@/shared_components/SeeAll';
import { imageData, videoData, recentsToProjectDesigns } from '@/pages/home/Projects/SampleData';
import { useDesigns } from '@/hooks/useDesigns';
import { useFolders } from '@/hooks/useFolders';

const USER_AVATAR_URL =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';

const imageTemplates = imageData.map(img => ({
  id: img.id,
  name: img.name,
  image: img.thumbnailUrl || '',
}));

type ProjectOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const projectOptions: ProjectOption[] = [
  {
    value: 'all-projects',
    label: 'All projects',
    icon: <FolderIcon size="medium" />,
  },
  {
    value: 'your-projects',
    label: 'Your projects',
    icon: <img src={USER_AVATAR_URL} alt="" className={styles.optionAvatar} />,
  },
  {
    value: 'shared-with-you',
    label: 'Shared with you',
    icon: <UsersIcon size="medium" />,
  },
];

export default function ProjectsContent(): React.ReactNode {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('your-projects');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Switch to real Connect data when signed in; falls back to fixtures.
  const recents = useDesigns();
  const projectData = recentsToProjectDesigns(recents);
  const folderData = useFolders();

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const selectedOption = projectOptions.find(o => o.value === selectedProject) ?? projectOptions[1];

  const renderVideoGrid = (videos: typeof videoData) => (
    <Masonry targetRowHeightPx={180} gutterPx={8}>
      {videos.map((video, index) => {
        const heights = [120, 160, 180, 140, 200, 150];
        const widths = [160, 180, 140, 200, 170, 190];
        return (
          <MasonryItem
            key={video.id}
            targetWidthPx={widths[index % widths.length]}
            targetHeightPx={heights[index % heights.length]}
          >
            <div className={styles.videoContainer}>
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.name}
                  className={styles.videoThumbnail}
                  loading="lazy"
                />
              ) : (
                <div className={styles.videoPlaceholder} />
              )}
              <div className={styles.videoDuration}>{video.size}</div>
            </div>
          </MasonryItem>
        );
      })}
    </Masonry>
  );

  return (
    // Plain div: viewport-height flex column (outer scroll panel); Easel Box reset
    // would wipe the calc() height constraint.
    <div className={styles.panel}>
      <Tabs defaultActiveId="all">
        {/* Plain div: non-scrolling header band (flex-shrink:0 + bottom padding). */}
        <div className={styles.searchHeader}>
          <Rows spacing="1u">
            <RegularSearch
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search your content"
              className={sharedStyles.searchBox}
            />

            <div className={styles.projectDropdown} ref={dropdownRef}>
              <button
                className={styles.dropdownTrigger}
                onClick={() => setDropdownOpen(prev => !prev)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
              >
                <span className={styles.triggerIcon}>{selectedOption.icon}</span>
                <Text size="medium" className={styles.triggerLabel}>
                  {selectedOption.label}
                </Text>
                <ChevronDownIcon
                  size="small"
                  className={`${styles.triggerChevron} ${dropdownOpen ? styles.triggerChevronOpen : ''}`}
                />
              </button>

              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  {projectOptions.map(option => (
                    <button
                      key={option.value}
                      className={`${styles.dropdownOption} ${option.value === selectedProject ? styles.dropdownOptionSelected : ''}`}
                      onClick={() => {
                        setSelectedProject(option.value);
                        setDropdownOpen(false);
                      }}
                      role="option"
                      aria-selected={option.value === selectedProject}
                    >
                      <span className={styles.optionIcon}>{option.icon}</span>
                      <Text size="medium" className={styles.optionLabel}>
                        {option.label}
                      </Text>
                      {option.value === selectedProject && (
                        <CheckIcon size="small" className={styles.checkIcon} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Rows>

          <Spacer size="2u" />

          <TabList align="stretch" spacing="0">
            <Tab id="all">All</Tab>
            <Tab id="designs">Designs</Tab>
            <Tab id="folders">Folders</Tab>
            <Tab id="images">Images</Tab>
            <Tab id="videos">Videos</Tab>
          </TabList>
        </div>

        {/* Plain div: scroll body composes sharedStyles.scrollableTabContent
            plus local margin-right bleed for scrollbar-gutter. */}
        <div className={`${sharedStyles.scrollableTabContent} ${styles.scrollBody}`}>
          <TabPanels>
            <TabPanel id="all">
              <Rows spacing="2u">
                <div>
                  <Box display="flex" justifyContent="spaceBetween" alignItems="center">
                    <Text weight="bold" size="medium" className={sharedStyles.sectionTitle}>
                      Designs
                    </Text>
                    <SeeAll onClick={() => console.log('Designs see all')} />
                  </Box>
                  <Spacer size="1u" />
                  <Grid columns={2} spacing="1u">
                    {projectData.slice(0, 4).map(design => (
                      <DesignCard
                        key={design.id}
                        design={design}
                        showBadge={false}
                        hideActions
                        showDoctype
                        hideIcon
                      />
                    ))}
                  </Grid>
                </div>

                <div>
                  <Box display="flex" justifyContent="spaceBetween" alignItems="center">
                    <Text weight="bold" size="medium" className={sharedStyles.sectionTitle}>
                      Folders
                    </Text>
                    <SeeAll onClick={() => console.log('Folders see all')} />
                  </Box>
                  <Spacer size="1u" />
                  <Rows spacing="1u">
                    {folderData.slice(0, 4).map(folder => (
                      <FolderCard
                        key={folder.id}
                        title={folder.name}
                        itemCount={folder.itemCount}
                        onClick={() => console.log(`${folder.name} folder clicked`)}
                      />
                    ))}
                  </Rows>
                </div>

                <ImageSectionColumns
                  title="Images"
                  cardWidth={160}
                  cardHeight={173}
                  templates={imageTemplates.slice(0, 4)}
                  onSeeAllClick={() => console.log('Images see all')}
                />

                <div>
                  <Box display="flex" justifyContent="spaceBetween" alignItems="center">
                    <Text weight="bold" size="medium" className={sharedStyles.sectionTitle}>
                      Videos
                    </Text>
                    <SeeAll onClick={() => console.log('Videos see all')} />
                  </Box>
                  <Spacer size="1u" />
                  {renderVideoGrid(videoData.slice(0, 8))}
                </div>
              </Rows>
            </TabPanel>

            <TabPanel id="designs">
              <Grid columns={2} spacing="1u">
                {projectData.map(design => (
                  <DesignCard
                    key={design.id}
                    design={design}
                    showBadge={false}
                    hideActions
                    showDoctype
                    hideIcon
                  />
                ))}
              </Grid>
            </TabPanel>

            <TabPanel id="folders">
              <Rows spacing="1u">
                <Button
                  variant="secondary"
                  onClick={() => console.log('Create folder clicked')}
                  alignment="start"
                  stretch
                >
                  <FolderIcon size="medium" /> Create folder
                </Button>

                {folderData.map(folder => (
                  <FolderCard
                    key={folder.id}
                    title={folder.name}
                    itemCount={folder.itemCount}
                    onClick={() => console.log(`${folder.name} folder clicked`)}
                  />
                ))}
              </Rows>
            </TabPanel>

            <TabPanel id="images">
              <ImageSectionColumns cardWidth={160} cardHeight={173} templates={imageTemplates} />
            </TabPanel>

            <TabPanel id="videos">{renderVideoGrid(videoData)}</TabPanel>
          </TabPanels>
        </div>
      </Tabs>
    </div>
  );
}
