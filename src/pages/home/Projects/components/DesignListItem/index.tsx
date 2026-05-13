import React from 'react';
import { Box, Columns, Column, Text, AvatarGroup } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { StarIcon, MoreHorizontalIcon } from '@canva/easel/icons';
import type { ProjectDesign } from '@/pages/Home/components/CardThumbnails';

interface DesignListItemProps {
  design: ProjectDesign;
  onClick?: () => void;
}

export default function DesignListItem({ design, onClick }: DesignListItemProps): React.ReactNode {
  const collaborators = [
    { backgroundColor: '#F55353', name: 'Jane doe' },
    { backgroundColor: '#FEB139', name: 'Jason Bull' },
  ];

  return (
    <BasicButton onClick={onClick} style={{ width: '100%', textAlign: 'left' }}>
      <Box width="full" padding="2u" borderBottom="standard" style={{ cursor: 'pointer' }}>
        <Columns spacing="2u" alignY="center">
          {/* Name Column */}
          <Column width="fluid">
            <Columns spacing="1u" alignY="center">
              <Column width="content">
                <Box
                  width="32px"
                  height="24px"
                  background="neutral"
                  borderRadius="element"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text size="xsmall">📄</Text>
                </Box>
              </Column>
              <Column>
                <Text weight="bold">{design.title}</Text>
              </Column>
            </Columns>
          </Column>

          {/* People Column */}
          <Column width="content">
            <AvatarGroup size="xxsmall" overflowCount={2} avatars={collaborators} />
          </Column>

          {/* Type Column */}
          <Column width="content">
            <Text tone="secondary">{design.doctype}</Text>
          </Column>

          {/* Edited Column */}
          <Column width="content">
            <Text tone="secondary">{design.lastModified}</Text>
          </Column>

          {/* Actions */}
          <Column width="content">
            <Columns spacing="0.5u" alignY="center">
              <Column width="content">
                <BasicButton
                  onClick={e => {
                    e.stopPropagation();
                    console.log('Star design');
                  }}
                >
                  <StarIcon size="small" />
                </BasicButton>
              </Column>
              <Column width="content">
                <BasicButton
                  onClick={e => {
                    e.stopPropagation();
                    console.log('Menu design');
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
