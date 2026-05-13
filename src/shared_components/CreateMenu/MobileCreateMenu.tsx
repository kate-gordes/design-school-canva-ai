import React, { useState, useRef } from 'react';
import { Box, Spacer, Carousel, Pill, Text, Columns, Column } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { XIcon } from '@canva/easel/icons';
import { Sheet } from '@canva/easel/surface/sheet';
import RegularSearch from '@/shared_components/Search/RegularSearch';
import { Card, CardPlaceholder } from '@canva/easel/card';
import { getNavItems, makeCreateNewItems } from './shared.tsx';
import styles from './MobileCreateMenu.module.css';

interface MobileCreateMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileCreateMenu({
  open,
  onClose,
}: MobileCreateMenuProps): React.ReactNode {
  const [searchValue, setSearchValue] = useState('');
  const [selected, setSelected] = useState('for-you');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const navItems = getNavItems();
  const createNewItems = makeCreateNewItems(12);

  const renderPills = () => (
    <Carousel name="create-pills" gutter="small" buttonVariant="chevron">
      {navItems
        .filter(n => n.id !== 'custom-size' && n.id !== 'upload' && n.id !== 'more')
        .map(item => (
          <div key={item.id} className={styles.pillWrap}>
            <Pill
              text={item.label}
              size="medium"
              selected={selected === item.id}
              onClick={() => setSelected(item.id)}
              start={item.renderIcon()}
            />
          </div>
        ))}
    </Carousel>
  );

  // Plain div wrappers below: Easel Box's reset_f88b8e would wipe the
  // border-radius + overflow:hidden that clip the CardPlaceholder thumbnails.
  const SmallCard = ({ title }: { title: string }) => (
    <Card
      thumbnail={
        <div className={styles.smallCardThumb}>
          <CardPlaceholder aspectRatio={4 / 3} />
        </div>
      }
      title={title}
      description="Auto size"
    />
  );

  const LargeThumb = ({ ratio = 16 / 9 }: { ratio?: number }) => (
    <div className={styles.largeThumb}>
      <CardPlaceholder aspectRatio={ratio} />
    </div>
  );

  const stopWheelPropagation = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const stopTouchPropagation = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Sheet open={open} onRequestClose={onClose} size="large">
      <Box className={styles.sheetInner}>
        <div className={styles.header}>
          <Columns align="spaceBetween" spacing="2u">
            <Column>
              <RegularSearch
                value={searchValue}
                onChange={setSearchValue}
                placeholder="What would you like to create?"
                autoFocus
              />
            </Column>
            <Column width="content">
              <Box display="flex" alignItems="center" justifyContent="center" width="content">
                <BasicButton ariaLabel="Close" onClick={onClose} className={styles.closeBtn}>
                  <XIcon size="medium" />
                </BasicButton>
              </Box>
            </Column>
          </Columns>
          <Spacer size="1u" />
          {renderPills()}
        </div>

        <Box
          ref={scrollRef}
          className={styles.scrollArea}
          onWheelCapture={stopWheelPropagation}
          onTouchMoveCapture={stopTouchPropagation}
        >
          <div className={styles.sections}>
            <button className={styles.customSize} type="button">
              <span>{navItems.find(n => n.id === 'custom-size')?.renderIcon?.()}</span>
              <Text>Custom size</Text>
            </button>

            <Box>
              <h4 className={styles.sectionHeading}>Create new</h4>
              <Carousel name="mobile-create-new" gutter="small" buttonVariant="chevron">
                {createNewItems.map((i, idx) => (
                  <div key={idx} className={styles.smallCarouselItem}>
                    <SmallCard title={i.label} />
                  </div>
                ))}
              </Carousel>
            </Box>

            <Box>
              <h4 className={styles.sectionHeading}>Brand Templates starred for Canva Team</h4>
              <Carousel name="mobile-brand-starred" gutter="small" buttonVariant="chevron">
                {[
                  <div key="starred-0" className={styles.starredCarouselItem}>
                    <Card
                      thumbnail={<LargeThumb ratio={16 / 9} />}
                      title="Canva Deck Template"
                      description="Presentation"
                    />
                  </div>,
                ]}
              </Carousel>
            </Box>

            <Box>
              <h4 className={styles.sectionHeading}>Create using your photos and videos</h4>
              <Carousel name="mobile-photos-videos" gutter="small" buttonVariant="chevron">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className={styles.largeCarouselItem}>
                    <LargeThumb ratio={4 / 3} />
                  </div>
                ))}
              </Carousel>
            </Box>

            <Spacer size="2u" />
          </div>
        </Box>
      </Box>
    </Sheet>
  );
}
