import React from 'react';
import { Box, Columns, Column, Text } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { StarIcon, MoreHorizontalIcon, ImageIcon } from '@canva/easel/icons';

export interface ImageData {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  isPrivate?: boolean;
  thumbnailUrl?: string;
}

interface ImageListItemProps {
  image: ImageData;
  onClick?: () => void;
}

export default function ImageListItem({ image, onClick }: ImageListItemProps): React.ReactNode {
  return (
    <BasicButton onClick={onClick} style={{ width: '100%', textAlign: 'left' }}>
      <Box width="full" padding="2u" borderBottom="standard" style={{ cursor: 'pointer' }}>
        <Columns spacing="2u" alignY="center">
          {/* Name Column */}
          <Column width="fluid">
            <Columns spacing="1u" alignY="center">
              <Column width="content">
                <ImageIcon size="medium" />
              </Column>
              <Column>
                <Text weight="bold">{image.name}</Text>
              </Column>
            </Columns>
          </Column>

          {/* Type Column */}
          <Column width="content">
            <Text tone="secondary">
              {image.type} • {image.size}
            </Text>
          </Column>

          {/* Edited Column */}
          <Column width="content">
            <Text tone="secondary">{image.lastModified}</Text>
          </Column>

          {/* Actions */}
          <Column width="content">
            <Columns spacing="0.5u" alignY="center">
              <Column width="content">
                <BasicButton
                  onClick={e => {
                    e.stopPropagation();
                    console.log('Star image');
                  }}
                >
                  <StarIcon size="small" />
                </BasicButton>
              </Column>
              <Column width="content">
                <BasicButton
                  onClick={e => {
                    e.stopPropagation();
                    console.log('Menu image');
                  }}
                >
                  <MoreHorizontalIcon size="small" />
                </BasicButton>
              </Column>
            </Columns>
          </Column>
        </Columns>
      </Box>
    </BasicButton>
  );
}
