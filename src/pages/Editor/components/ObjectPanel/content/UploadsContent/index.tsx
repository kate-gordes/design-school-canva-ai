import React, { useState, useRef, useEffect } from 'react';
import {
  Spacer,
  Button,
  Rows,
  Masonry,
  MasonryItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@canva/easel';
import {
  MoreHorizontalIcon,
  CheckIcon,
  InfoIcon,
  FolderIcon,
  DownloadIcon,
  CopyIcon,
  CheckCircleIcon,
  XIcon,
  TrashIcon,
  PencilIcon,
} from '@canva/easel/icons';
import { RegularSearch } from '@/shared_components/Search';
import CreateFolder from '@/pages/Editor/components/ObjectPanel/CreateFolder';
import { imageData, videoData } from '@/pages/home/Projects/SampleData';
import styles from './UploadsContent.module.css';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';

const imageHeights = [140, 180, 120, 160, 200, 150, 170, 130, 190, 145];
const videoHeights = [120, 160, 180, 140, 200, 150];
const videoDurations = [
  '8.0s',
  '4.0s',
  '12.3s',
  '22.7s',
  '14.3s',
  '55.0s',
  '12.1s',
  '23.2s',
  '36.0s',
  '5.3s',
  '11.1s',
  '1:09',
];

const uploadedAgo = [
  '7 days ago',
  '2 weeks ago',
  '3 weeks ago',
  '1 month ago',
  '2 months ago',
  '2 months ago',
  '3 months ago',
  '3 months ago',
  '3 months ago',
  '4 months ago',
  '4 months ago',
  '5 months ago',
  '5 months ago',
  '5 months ago',
  '6 months ago',
  '6 months ago',
  '6 months ago',
  '6 months ago',
];

interface UploadItemCardProps {
  name: string;
  thumbnailUrl?: string;
  uploadedTime: string;
  isSelected?: boolean;
  onSelect?: () => void;
  children?: React.ReactNode;
}

function UploadItemCard({
  name,
  thumbnailUrl,
  uploadedTime,
  isSelected = false,
  onSelect,
  children,
}: UploadItemCardProps) {
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flyoutOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setFlyoutOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [flyoutOpen]);

  const menuItems = [
    { icon: <InfoIcon size="small" />, label: 'Details' },
    { icon: <FolderIcon size="small" />, label: 'Move' },
    { icon: <DownloadIcon size="small" />, label: 'Download' },
    { icon: <CopyIcon size="small" />, label: 'Copy to another team' },
    { icon: <CheckCircleIcon size="small" />, label: 'Select items' },
    { icon: <XIcon size="small" />, label: 'Remove from folder' },
    { icon: <TrashIcon size="small" />, label: 'Move to Trash' },
  ];

  return (
    <div className={styles.uploadCard} ref={cardRef}>
      {children || (
        <img src={thumbnailUrl} alt={name} className={styles.uploadedImage} loading="lazy" />
      )}

      <div className={styles.hoverOverlay}>
        <div className={styles.checkboxArea}>
          <button
            className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''}`}
            onClick={e => {
              e.stopPropagation();
              onSelect?.();
            }}
          >
            {isSelected && <CheckIcon size="tiny" />}
          </button>
        </div>

        <div className={styles.moreButtonArea}>
          <button
            className={styles.moreButton}
            onClick={e => {
              e.stopPropagation();
              setFlyoutOpen(true);
            }}
          >
            <MoreHorizontalIcon size="small" />
          </button>
        </div>
      </div>

      {flyoutOpen && (
        <>
          <div className={styles.flyoutBackdrop} onClick={() => setFlyoutOpen(false)} />
          <div className={styles.flyout}>
            <div className={styles.flyoutHeader}>
              <div className={styles.flyoutTitleRow}>
                <span className={styles.flyoutTitle}>{name}</span>
                <button className={styles.flyoutEditButton} onClick={() => setFlyoutOpen(false)}>
                  <PencilIcon size="small" />
                </button>
              </div>
              <div className={styles.flyoutSubtitle}>
                Uploaded by Valentina Solis {uploadedTime}
              </div>
            </div>
            <div className={styles.flyoutDivider} />
            <div className={styles.flyoutMenuItems}>
              {menuItems.map(item => (
                <button
                  key={item.label}
                  className={styles.flyoutMenuItem}
                  onClick={() => {
                    console.log(`${item.label}: ${name}`);
                    setFlyoutOpen(false);
                  }}
                >
                  <span className={styles.flyoutMenuIcon}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function UploadsContent(): React.ReactNode {
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    // Plain div: viewport-height flex column (outer scroll panel); Easel Box reset
    // would wipe the calc() height constraint.
    <div className={styles.panel}>
      <Tabs defaultActiveId="images">
        {/* Plain div: non-scrolling header band (flex-shrink:0 + bottom padding). */}
        <div className={styles.searchHeader}>
          <Rows spacing="1u">
            <RegularSearch
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search keywords, tags, color"
              className={sharedStyles.searchBox}
            />

            {/* Plain div: flex row hosting a stretching primary button + fixed icon button. */}
            <div className={styles.uploadActionsRow}>
              {/* Plain div: flex:1 wrapper so Upload files button stretches while sibling stays auto-width. */}
              <div className={styles.uploadActionPrimary}>
                <Button
                  variant="primary"
                  onClick={() => console.log('Upload files')}
                  alignment="center"
                  stretch
                >
                  Upload files
                </Button>
              </div>
              <Button
                variant="primary"
                onClick={() => console.log('Upload more options')}
                icon={MoreHorizontalIcon}
                tooltipLabel="More upload options"
              />
            </div>

            <Button
              variant="secondary"
              onClick={() => console.log('Record yourself')}
              alignment="center"
              stretch
            >
              Record yourself
            </Button>
          </Rows>

          <Spacer size="1u" />

          <TabList align="start" spacing="2u">
            <Tab id="images">Images</Tab>
            <Tab id="videos">Videos</Tab>
            <Tab id="folders">Folders</Tab>
          </TabList>
        </div>

        {/* Plain div: scroll body composes sharedStyles.scrollableTabContent
            plus local margin-right bleed for scrollbar-gutter. */}
        <div className={`${sharedStyles.scrollableTabContent} ${styles.scrollBody}`}>
          <TabPanels>
            <TabPanel id="images">
              <Masonry targetRowHeightPx={160} gutterPx={8}>
                {imageData.map((img, index) => (
                  <MasonryItem
                    key={img.id}
                    targetWidthPx={160}
                    targetHeightPx={imageHeights[index % imageHeights.length]}
                  >
                    <UploadItemCard
                      name={img.name}
                      thumbnailUrl={img.thumbnailUrl}
                      uploadedTime={uploadedAgo[index % uploadedAgo.length]}
                    />
                  </MasonryItem>
                ))}
              </Masonry>
            </TabPanel>

            <TabPanel id="videos">
              <Masonry targetRowHeightPx={180} gutterPx={8}>
                {videoData.map((video, index) => (
                  <MasonryItem
                    key={video.id}
                    targetWidthPx={160}
                    targetHeightPx={videoHeights[index % videoHeights.length]}
                  >
                    <UploadItemCard
                      name={video.name}
                      thumbnailUrl={video.thumbnailUrl}
                      uploadedTime={uploadedAgo[index % uploadedAgo.length]}
                    >
                      <img
                        src={video.thumbnailUrl}
                        alt={video.name}
                        className={styles.uploadedImage}
                        loading="lazy"
                      />
                      <div className={styles.videoDuration}>
                        {videoDurations[index % videoDurations.length]}
                      </div>
                    </UploadItemCard>
                  </MasonryItem>
                ))}
              </Masonry>
            </TabPanel>

            <TabPanel id="folders">
              <CreateFolder onCreateFolder={() => console.log('Create folder clicked')} />
            </TabPanel>
          </TabPanels>
        </div>
      </Tabs>
    </div>
  );
}
