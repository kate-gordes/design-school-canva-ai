import React from 'react';
import { Box, Columns, Column, Rows, Text, Avatar } from '@canva/easel';
import { MoreHorizontalIcon } from '@canva/easel/icons';
import type { ProjectDesign } from '@/pages/Home/components/CardThumbnails';
import styles from './MobileBrandTemplateRow.module.css';

interface MobileBrandTemplateRowProps {
  design: ProjectDesign;
  overflowCount?: number;
  onClick?: () => void;
  onMenuClick?: () => void;
}

export default function MobileBrandTemplateRow({
  design,
  overflowCount = 16,
  onClick,
  onMenuClick,
}: MobileBrandTemplateRowProps): React.ReactNode {
  return (
    <Box width="full" paddingY="1u">
      <Columns spacing="1.5u" alignY="center">
        {/* Thumbnail */}
        <Column width="content">
          {/* Plain div: Easel Box resets background; we need rounded corners +
             image background for the square 64px template thumbnail. */}
          <div
            className={styles.thumbnail}
            onClick={onClick}
            style={
              design.thumbnailUrl ? { backgroundImage: `url(${design.thumbnailUrl})` } : undefined
            }
          />
        </Column>

        {/* Title + meta */}
        <Column width="fluid">
          <Rows spacing="0.5u">
            <Text size="medium" weight="bold">
              {design.title}
            </Text>
            <Columns spacing="1u" alignY="center">
              <Column width="content">
                <div className={styles.avatarCluster}>
                  <Avatar size="xxsmall" backgroundColor="#F55353" name={design.owner ?? 'T'} />
                  <div className={styles.overflowAvatar}>
                    <Text size="xsmall" tone="secondary">{`+${overflowCount}`}</Text>
                  </div>
                </div>
              </Column>
              <Column width="content">
                <Text size="small" tone="tertiary">
                  • Brand Template
                </Text>
              </Column>
            </Columns>
          </Rows>
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
