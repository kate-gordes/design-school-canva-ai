import React from 'react';
import { Box, Rows, Columns, Column, Button } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { ChevronDownIcon, ChevronRightIcon } from '@canva/easel/icons';
import SectionTitle from '@/shared_components/SectionTitle';
import useIsMobile from '@/hooks/useIsMobile';
import styles from './CollapsibleSection.module.css';

export type ViewType = 'grid' | 'list';

interface CollapsibleSectionProps {
  title: string;
  itemCount?: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onSeeAllClick?: () => void;
  showSeeAllOnDesktop?: boolean;
  viewType?: ViewType;
  hideHeader?: boolean;
  children: React.ReactNode;
  listContent?: React.ReactNode; // Content to show in list view
}

export default function CollapsibleSection({
  title,
  itemCount,
  isExpanded,
  onToggleExpanded,
  onSeeAllClick,
  showSeeAllOnDesktop = true,
  viewType = 'grid',
  hideHeader = false,
  children,
  listContent,
}: CollapsibleSectionProps): React.ReactNode {
  const isMobile = useIsMobile();

  return (
    <Box width="full">
      {hideHeader ? (
        /* No header, just content */
        <Box>{viewType === 'list' && listContent ? listContent : children}</Box>
      ) : (
        <Rows spacing="2u">
          {/* Section Header - Following Official Pattern */}
          <Columns spacing="1u" alignY="center" align="spaceBetween">
            <Column width="containedContent">
              <BasicButton onClick={onToggleExpanded} disclosure={true} active={isExpanded}>
                <Columns spacing="1u" alignY="center">
                  <Column width="content">
                    {isExpanded ? (
                      <ChevronDownIcon size="medium" />
                    ) : (
                      <ChevronRightIcon size="medium" />
                    )}
                  </Column>
                  <Column>
                    <SectionTitle size={isMobile ? 'small' : 'medium'}>
                      {/* Plain <span> nested inside SectionTitle (Easel Title) — Title wraps
                          an h3, so raw spans are the correct inline typography carrier. */}
                      <span>{title}</span>
                      {itemCount !== undefined && (
                        <span className={styles.itemCount}> ({itemCount})</span>
                      )}
                    </SectionTitle>
                  </Column>
                </Columns>
              </BasicButton>
            </Column>

            {/* See All Button - Only show on desktop */}
            {!isMobile && showSeeAllOnDesktop && onSeeAllClick && (
              <Column width="content">
                <Button variant="subtleLinkButton" onClick={onSeeAllClick}>
                  See all
                </Button>
              </Column>
            )}
          </Columns>

          {/* Section Content */}
          {isExpanded && (
            <Box paddingTop="2u">{viewType === 'list' && listContent ? listContent : children}</Box>
          )}
        </Rows>
      )}
    </Box>
  );
}
