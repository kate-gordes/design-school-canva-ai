import React from 'react';
import { Box, Columns, Column, Rows, Text, Badge, Avatar } from '@canva/easel';
import { MoreHorizontalIcon } from '@canva/easel/icons';
import MobileFolderIcon from '@/shared_components/icons/MobileFolderIcon';
import styles from './MobileBrandAssetRow.module.css';

interface MobileBrandAssetRowProps {
  title: string;
  thumbnailUrl?: string;
  /** If provided, render the folder-style meta row: "View only · avatar · +N · N items" */
  folderMeta?: {
    itemCount: number;
    overflowCount?: number;
    isViewOnly?: boolean;
  };
  onClick?: () => void;
  onMenuClick?: () => void;
}

export default function MobileBrandAssetRow({
  title,
  thumbnailUrl,
  folderMeta,
  onClick,
  onMenuClick,
}: MobileBrandAssetRowProps): React.ReactNode {
  const isFolder = !!folderMeta;

  return (
    <Box width="full" paddingY="1u">
      <Columns spacing="1.5u" alignY="center">
        {/* Thumbnail */}
        <Column width="content">
          {/* Plain div: Easel Box resets background; we need rounded corners +
             optional image background + folder icon fallback. */}
          {isFolder && !thumbnailUrl ? (
            /* Plain wrapper: MobileFolderIcon is an inline SVG sized directly;
               no background/border-radius needed around it. */
            <div className={styles.folderIconSlot} onClick={onClick}>
              <MobileFolderIcon size={48} />
            </div>
          ) : (
            <div
              className={styles.thumbnail}
              onClick={onClick}
              style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : undefined}
            />
          )}
        </Column>

        {/* Title + meta */}
        <Column width="fluid">
          {isFolder ? (
            <Rows spacing="0.5u">
              <Text size="medium" weight="bold">
                {title}
              </Text>
              <Columns spacing="1u" alignY="center">
                {folderMeta.isViewOnly !== false && (
                  <Column width="content">
                    <Badge text="View only" tone="neutral" />
                  </Column>
                )}
                <Column width="content">
                  <div className={styles.avatarCluster}>
                    <Avatar size="xxsmall" backgroundColor="#F55353" name="T" />
                    <div className={styles.overflowAvatar}>
                      <Text
                        size="xsmall"
                        tone="secondary"
                      >{`+${folderMeta.overflowCount ?? 12}`}</Text>
                    </div>
                  </div>
                </Column>
                <Column width="content">
                  <Text size="small" tone="tertiary">
                    {`• ${folderMeta.itemCount} items`}
                  </Text>
                </Column>
              </Columns>
            </Rows>
          ) : (
            <Text size="medium" weight="bold">
              {title}
            </Text>
          )}
        </Column>

        {/* Overflow menu */}
        <Column width="content">
          {/* Plain div: Easel Box/Button reset background/box-shadow via
             reset_f88b8e, wiping the white fill and elevation ring. */}
          <div
            className={styles.menuButton}
            onClick={e => {
              e.stopPropagation();
              onMenuClick?.();
            }}
          >
            <MoreHorizontalIcon size="medium" />
          </div>
        </Column>
      </Columns>
    </Box>
  );
}
