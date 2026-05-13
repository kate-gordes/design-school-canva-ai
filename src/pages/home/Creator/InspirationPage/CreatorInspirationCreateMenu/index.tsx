import React, { useState } from 'react';
import { Spacer, Carousel, Menu, MenuItem, Masonry, MasonryItem, Placeholder } from '@canva/easel';
import { Dialog, DialogContent } from '@canva/easel/dialog';
import { Card, CardPlaceholder } from '@canva/easel/card';
import { Grid } from '@canva/easel/layout';
import RegularSearch from '@/shared_components/Search/RegularSearch';
import styles from './CreatorInspirationCreateMenu.module.css';
import { getNavItems, makeCreateNewItems, brandTitles } from './shared.tsx';

interface CreatorInspirationCreateMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function CreatorInspirationCreateMenu({
  open,
  onClose,
}: CreatorInspirationCreateMenuProps): React.ReactNode {
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('for-you');

  const navItems = getNavItems();
  const createNewItems = makeCreateNewItems(20);
  const cardSize = { width: 260, height: 168 };

  return (
    <Dialog open={open} onRequestClose={onClose}>
      <DialogContent>
        <div className={styles.container}>
          {/* Sidebar with title + categories */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3 className={styles.sidebarTitle}>Create a design</h3>
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
              {/* Create New Section - Carousel */}
              <h4 className={styles.sectionTitle}>Create new</h4>
              <Carousel name="create-new" buttonVariant="chevron" gutter="small">
                {createNewItems.map((item, idx) => (
                  <div key={idx} className={styles.carouselItemFixed}>
                    <Card
                      thumbnail={
                        <div
                          style={{
                            width: cardSize.width,
                            height: cardSize.height,
                            borderRadius: 8,
                            overflow: 'hidden',
                          }}
                        >
                          <CardPlaceholder aspectRatio={4 / 3} />
                        </div>
                      }
                      title={item.label}
                      description="Auto size"
                    />
                  </div>
                ))}
              </Carousel>

              <Spacer size="2u" />

              {/* Brand Templates starred for Canva Team - single item carousel */}
              <h4 className={styles.sectionTitle}>Brand Templates starred for Canva Team</h4>
              <Carousel name="brand-starred" buttonVariant="chevron" gutter="small">
                {[
                  <div key="starred-0" className={styles.carouselItemFixed}>
                    <Card
                      thumbnail={
                        <div
                          style={{
                            width: cardSize.width,
                            height: cardSize.height,
                            borderRadius: 8,
                            overflow: 'hidden',
                          }}
                        >
                          <CardPlaceholder aspectRatio={16 / 9} />
                        </div>
                      }
                      title="Canva Deck Template"
                      description="Presentation"
                    />
                  </div>,
                ]}
              </Carousel>

              <Spacer size="2u" />

              {/* Brand Templates - grid using same 219px items (11) */}
              <h4 className={styles.sectionTitle}>Brand Templates</h4>
              <Grid columns={4} spacing="1u">
                {Array.from({ length: 11 }).map((_, i) => (
                  <Card
                    key={`brand-${i}`}
                    thumbnail={
                      <div
                        style={{
                          width: cardSize.width,
                          height: cardSize.height,
                          borderRadius: 8,
                          overflow: 'hidden',
                        }}
                      >
                        <CardPlaceholder aspectRatio={16 / 9} />
                      </div>
                    }
                    title={brandTitles[i % brandTitles.length]}
                    description={i % 4 === 3 ? 'Doc' : 'Presentation'}
                  />
                ))}
              </Grid>

              <Spacer size="2u" />

              {/* Templates for you - 21 items */}
              <h4 className={styles.sectionTitle}>Templates for you</h4>
              <Masonry targetRowHeightPx={180} gutterPx={12}>
                {Array.from({ length: 21 }).map((_, i) => {
                  const widths = [220, 240, 260, 200, 230];
                  const heights = [140, 180, 200, 160, 220, 170];
                  const w = widths[i % widths.length];
                  const h = heights[i % heights.length];
                  return (
                    <MasonryItem key={`template-${i}`} targetWidthPx={w} targetHeightPx={h}>
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: 8,
                          overflow: 'hidden',
                        }}
                      >
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
