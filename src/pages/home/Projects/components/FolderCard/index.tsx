import React from 'react';
import { Box, Text, Button, CardCheckbox } from '@canva/easel';
import { Card, CardDecorator } from '@canva/easel/card';
import { MoreHorizontalIcon } from '@canva/easel/icons';
import FolderIcon from '@/shared_components/icons/FolderIcon';
import MobileFolderIcon from '@/shared_components/icons/MobileFolderIcon';
import useIsMobile from '@/hooks/useIsMobile';

interface FolderCardProps {
  title: string;
  itemCount: number;
  onClick?: () => void;
  isPrivate?: boolean;
  onMenuClick?: () => void;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

export default function FolderCard({
  title,
  itemCount,
  onClick,
  isPrivate = false,
  onMenuClick = () => console.log('Menu clicked for folder', title),
  isSelected = false,
  onSelect = () => {},
}: FolderCardProps): React.ReactNode {
  const isMobile = useIsMobile();

  return (
    <Card
      title={title}
      description={<Text tone="secondary">{itemCount} items</Text>}
      thumbnail={
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="full"
          height="full"
          style={{ minHeight: isMobile ? '200px' : 'auto' }}
        >
          {isMobile ? <MobileFolderIcon size={280} /> : <FolderIcon size={56} />}
        </Box>
      }
      layout={isMobile ? 'vertical' : 'horizontal'}
      padding={isMobile ? '0' : '1u'}
      hoverEffect="bgColorTransition"
      hoverBoundary="card"
      onClick={onClick}
      decorators={
        <>
          {/* Menu button - always visible on mobile, hover on desktop */}
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
                <Button
                  icon={MoreHorizontalIcon}
                  variant="tertiary"
                  size="small"
                  onClick={onMenuClick}
                />
              </Box>
            )}
          </CardDecorator>

          {/* Checkbox on hover */}
          <CardDecorator location="top-start" visibility="on-hover" isInteractive={true}>
            <CardCheckbox
              label="Select folder"
              selected={isSelected}
              onSelect={() => onSelect(!isSelected)}
            />
          </CardDecorator>
        </>
      }
    />
  );
}
