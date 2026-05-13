import React, { useState } from 'react';
import { Spacer, Carousel, Menu, MenuItem, Masonry, MasonryItem, Placeholder } from '@canva/easel';
import { Dialog, DialogContent } from '@canva/easel/dialog';
import { Card } from '@canva/easel/card';
import { Grid } from '@canva/easel/layout';
import { Title, Text } from '@canva/easel/typography';
import RegularSearch from '@/shared_components/Search/RegularSearch';
import styles from './CreateMenu.module.css';
import { getNavItems, makeCreateNewItems, brandTitles } from './shared.tsx';
export { default as MobileCreateMenu } from './MobileCreateMenu';

interface CreateMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateMenu({ open, onClose }: CreateMenuProps): React.ReactNode {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('for-you');

  const navItems = getNavItems();
  const createNewItems = makeCreateNewItems(20);

  return (
    <Dialog open={open} onRequestClose={onClose}>
      <DialogContent>
        <div className={styles.container}>
          {/* Sidebar with title + categories */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <Title size="large">Create a design</Title>
            </div>
            <Menu role="menu" variant="rounded">
              {navItems.map(item => (
                <MenuItem
                  key={item.id}
                  selected={selectedCategory === item.id}
                  onClick={() => setSelectedCategory(item.id)}
                  start={item.renderIcon()}
                >
                  {item.label}
                </MenuItem>
              ))}
            </Menu>
          </div>

          {/* Right side: search + content */}
          <div className={styles.rightPane}>
            <div className={styles.searchContainer}>
              <RegularSearch
                value={searchValue}
                onChange={setSearchValue}
                placeholder="What would you like to create?"
                className={styles.searchInput}
              />
            </div>

            <div className={styles.content}>
              {/* Quick actions section */}
              <div className={styles.quickActionsSection}>
                <Title size="small">Quick actions</Title>
                <Spacer size="2u" />
                <div className={styles.quickActionsGrid}>
                  {[
                    'Screen recorder',
                    'Canva Code',
                    'Magic Write',
                    'Translate',
                    'Brand Kit',
                    'Content planner',
                    'Mockups',
                  ].map((label, i) => (
                    <div key={`quick-action-${i}`} className={styles.quickActionItem}>
                      <div className={styles.quickActionIcon} />
                      <Text size="small" align="center" tone="secondary">
                        {label}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>

              <Spacer size="4u" />

              {/* Create New Section - Carousel */}
              <Title size="small">Create new</Title>
              <Spacer size="2u" />
              <Carousel name="create-new" buttonVariant="chevron" gutter="small">
                {createNewItems.map((item, idx) => (
                  <div key={idx} className={`${styles.carouselItemFixed} ${styles.createNewItem}`}>
                    <Card
                      thumbnail={
                        // Plain div: Easel Box's reset_f88b8e would wipe the
                        // 8px border-radius + overflow:hidden that crop the
                        // Placeholder to the card thumbnail box.
                        <div className={styles.cardThumb}>
                          <Placeholder shape="sharpRectangle" />
                        </div>
                      }
                      title={item.label}
                    />
                  </div>
                ))}
              </Carousel>

              <Spacer size="4u" />

              {/* Brand Templates starred for Canva Team - single item carousel */}
              <Title size="small">Brand Templates starred for Canva Team</Title>
              <Spacer size="2u" />
              <Carousel name="brand-starred" buttonVariant="chevron" gutter="small">
                {[
                  <div key="starred-0" className={styles.carouselItemFixed}>
                    <Card
                      thumbnail={
                        // Plain div: see .cardThumb rationale above.
                        <div className={styles.cardThumb}>
                          <Placeholder shape="sharpRectangle" />
                        </div>
                      }
                      title="Canva Deck Template"
                      description="Presentation"
                    />
                  </div>,
                ]}
              </Carousel>

              <Spacer size="4u" />

              {/* Brand Templates - grid using same 219px items (11) */}
              <Title size="small">Brand Templates</Title>
              <Spacer size="2u" />
              <Grid columns={4} spacing="1u">
                {Array.from({ length: 11 }).map((_, i) => (
                  <Card
                    key={`brand-${i}`}
                    thumbnail={
                      // Plain div: see .cardThumb rationale above.
                      <div className={styles.cardThumb}>
                        <Placeholder shape="sharpRectangle" />
                      </div>
                    }
                    title={brandTitles[i % brandTitles.length]}
                    description={i % 4 === 3 ? 'Doc' : 'Presentation'}
                  />
                ))}
              </Grid>

              <Spacer size="4u" />

              {/* Templates for you - 21 items */}
              <Title size="small">Templates for you</Title>
              <Spacer size="2u" />
              <Masonry targetRowHeightPx={180} gutterPx={12}>
                {Array.from({ length: 21 }).map((_, i) => {
                  const widths = [220, 240, 260, 200, 230];
                  const heights = [140, 180, 200, 160, 220, 170];
                  const w = widths[i % widths.length];
                  const h = heights[i % heights.length];
                  return (
                    <MasonryItem key={`template-${i}`} targetWidthPx={w} targetHeightPx={h}>
                      {/* Plain div: Easel Box would reset the border-radius
                          + overflow:hidden clipping the MasonryItem placeholder. */}
                      <div className={styles.masonryThumb}>
                        <Placeholder shape="sharpRectangle" />
                      </div>
                    </MasonryItem>
                  );
                })}
              </Masonry>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
