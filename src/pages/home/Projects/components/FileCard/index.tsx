import React from 'react';
import useIsMobile from '@/hooks/useIsMobile';
import {
  Box,
  CardCheckbox,
  CardDescription,
  CardThumbnailContainer,
  CardTitle,
  Column,
  Columns,
  Rows,
  Badge,
} from '@canva/easel';
import { Card, CardDecorator } from '@canva/easel/card';
import { Button } from '@canva/easel/button';
import { MoreHorizontalIcon, StarIcon } from '@canva/easel/icons';
import { FileText, Image as ImageIcon, Archive, File } from 'lucide-react';
import type { FileData } from '@/pages/Home/Projects/components/FilesSection';
import styles from './FileCard.module.css';

interface FileCardProps {
  file: FileData;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onStar?: () => void;
  onMenuClick?: () => void;
  onClick?: () => void;
  hideActions?: boolean;
}

// Helper to get icon based on file type
const getFileIcon = (fileType: string) => {
  const type = fileType.toUpperCase();
  switch (type) {
    case 'ZIP':
    case 'RAR':
    case '7Z':
      return Archive;
    case 'TXT':
    case 'MD':
    case 'JSON':
    case 'CSV':
      return FileText;
    case 'AF':
    case 'PSD':
    case 'AI':
    case 'AFDESIGN':
      return ImageIcon;
    default:
      return File;
  }
};

// Helper to get badge tone based on file type
const getBadgeTone = (
  fileType: string,
): 'neutral' | 'info' | 'positive' | 'warning' | 'critical' => {
  const type = fileType.toUpperCase();
  switch (type) {
    case 'ZIP':
    case 'RAR':
    case '7Z':
      return 'info';
    case 'AF':
    case 'PSD':
    case 'AI':
    case 'AFDESIGN':
      return 'positive';
    default:
      return 'neutral';
  }
};

export default function FileCard({
  file,
  isSelected = false,
  onSelect = () => {},
  onStar = () => console.log('Star clicked for', file.name),
  onMenuClick = () => console.log('Menu clicked for', file.name),
  onClick = () => console.log('File clicked:', file.name),
  hideActions = false,
}: FileCardProps): React.ReactNode {
  const isMobile = useIsMobile();
  const FileTypeIcon = getFileIcon(file.fileType);
  const badgeTone = getBadgeTone(file.fileType);

  return (
    <Box className={styles.cardWrapper}>
      <Card
        content={({ titleId, descriptionId }) => (
          <Rows spacing="1u">
            <CardTitle id={titleId}>
              <span className={styles.singleLineTitle}>{file.name}</span>
            </CardTitle>
            <Columns spacing="1u" alignY="center">
              <Column width="content">
                <Badge tone={badgeTone} text={file.fileType} />
              </Column>
              <Column>
                <CardDescription id={descriptionId}>Uploaded {file.lastModified}</CardDescription>
              </Column>
            </Columns>
          </Rows>
        )}
        layout="vertical"
        hoverBoundary="thumbnail"
        hoverEffect="scaleThumbnail"
        stretchThumbnail={true}
        selectableMode="secondary"
        thumbnail={
          <CardThumbnailContainer aspectRatio={4 / 3} padding="none">
            <Box position="relative" width="full" height="full" background="subtle">
              <div className={styles.thumbnailContainer}>
                {file.thumbnailUrl ? (
                  <img src={file.thumbnailUrl} alt={file.name} className={styles.thumbnailImage} />
                ) : (
                  <Box
                    width="full"
                    height="full"
                    background="neutralSubtle"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <div className={styles.fileIconWrapper}>
                      <FileTypeIcon size={90} strokeWidth={1} />
                    </div>
                  </Box>
                )}
              </div>
            </Box>
          </CardThumbnailContainer>
        }
        decorators={
          <>
            {/* Action buttons - always visible on mobile, hover on desktop */}
            {!hideActions && (
              <CardDecorator
                location="top-end"
                visibility={isMobile ? 'always' : 'on-hover'}
                isInteractive={true}
              >
                {isMobile ? (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: '#fff',
                      boxShadow:
                        'rgba(64, 79, 109, 0.06) 0px 0px 0px 0.5px, rgba(24, 44, 89, 0.137) 0px 1px 2px 0px, rgba(24, 44, 89, 0.137) 0px 2px 4px 0px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={onMenuClick}
                  >
                    <MoreHorizontalIcon size="medium" />
                  </div>
                ) : (
                  <Box
                    shadow="surface"
                    background="surface"
                    borderRadius="element"
                    padding="0.5u"
                    display="flex"
                  >
                    <Button icon={StarIcon} variant="tertiary" size="small" onClick={onStar} />
                    <Button
                      icon={MoreHorizontalIcon}
                      variant="tertiary"
                      size="small"
                      onClick={onMenuClick}
                    />
                  </Box>
                )}
              </CardDecorator>
            )}

            {/* Checkbox on hover */}
            <CardDecorator location="top-start" visibility="on-hover" isInteractive={true}>
              <CardCheckbox
                label="Select file"
                selected={isSelected}
                onSelect={() => onSelect(!isSelected)}
              />
            </CardDecorator>
          </>
        }
        onClick={onClick}
      />
    </Box>
  );
}
