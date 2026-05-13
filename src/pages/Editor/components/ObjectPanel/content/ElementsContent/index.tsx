import React, { useCallback, useState } from 'react';
import { Rows, Text } from '@canva/easel';
import ElementsSearchInput from './ElementsSearchInput';
import SearchActionBar from '@/pages/Editor/components/ObjectPanel/content/SearchActionBar';
import ImageSectionCarousel from '@/pages/Editor/components/ObjectPanel/ImageSectionCarousel';
import styles from './ElementsContent.module.css';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';

const categoryImages = import.meta.glob('@/assets/elements/categories/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const categoryImage = (slug: string, side: 'front' | 'back'): string =>
  categoryImages[
    Object.keys(categoryImages).find(k => k.endsWith(`/category-card-${slug}-${side}.png`))!
  ];

const browseCategories = [
  {
    id: 'shapes',
    label: 'Shapes',
    frontBg: '#BBFBFD',
    gradStart: '#CDEFDB',
    gradEnd: '#00C4CC',
    slug: 'shapes',
  },
  {
    id: 'graphics',
    label: 'Graphics',
    frontBg: '#FFF0AC',
    gradStart: '#FFF5C8',
    gradEnd: '#FF9D00',
    slug: 'graphics',
  },
  {
    id: 'photos',
    label: 'Photos',
    frontBg: '#D5EDFF',
    gradStart: '#C3E2FF',
    gradEnd: '#0070D8',
    slug: 'photos',
  },
  {
    id: 'videos',
    label: 'Videos',
    frontBg: '#FCDBFF',
    gradStart: '#FBD3FF',
    gradEnd: '#E000F4',
    slug: 'video',
  },
  {
    id: '3d',
    label: '3D',
    frontBg: '#E9DEFF',
    gradStart: '#D6C2FF',
    gradEnd: '#7D2AE8',
    slug: '3D',
  },
  {
    id: 'forms',
    label: 'Forms',
    frontBg: '#C2FFDA',
    gradStart: '#9EDCB7',
    gradEnd: '#0CA84A',
    slug: 'forms',
  },
  {
    id: 'animations',
    label: 'Animations',
    frontBg: '#C2FFDA',
    gradStart: '#9EDCB7',
    gradEnd: '#0CA84A',
    slug: 'stickers',
  },
  {
    id: 'audio',
    label: 'Audio',
    frontBg: '#FFDEE2',
    gradStart: '#FFA5F0',
    gradEnd: '#FF3B4B',
    slug: 'audio',
  },
  {
    id: 'sheets',
    label: 'Sheets',
    frontBg: '#D5EDFF',
    gradStart: '#C3E2FF',
    gradEnd: '#0070D8',
    slug: 'sheets',
  },
  {
    id: 'tables',
    label: 'Tables',
    frontBg: '#FFE0CE',
    gradStart: '#FEC19C',
    gradEnd: '#FF6108',
    slug: 'table',
  },
  {
    id: 'charts',
    label: 'Charts',
    frontBg: '#BBFBFD',
    gradStart: '#CDEFDB',
    gradEnd: '#00C4CC',
    slug: 'charts',
  },
  {
    id: 'frames',
    label: 'Frames',
    frontBg: '#C2FFDA',
    gradStart: '#9EDCB7',
    gradEnd: '#0CA84A',
    slug: 'frames',
  },
  {
    id: 'grids',
    label: 'Grids',
    frontBg: '#FCDBFF',
    gradStart: '#FBD3FF',
    gradEnd: '#E000F4',
    slug: 'grids',
  },
  {
    id: 'mockups',
    label: 'Mockups',
    frontBg: '#BBFBFD',
    gradStart: '#CDEFDB',
    gradEnd: '#00C4CC',
    slug: 'mocks',
  },
];

import recentLineDiamondBlack from '@/assets/elements/recent/line-diamond-black.svg';
import recentThinBlackLine from '@/assets/elements/recent/thin-black-line.png';
import recentStickFigure from '@/assets/elements/recent/stick-figure.png';
import recentSquare from '@/assets/elements/recent/square.png';
import recentRetroFrame from '@/assets/elements/recent/retro-frame.png';
import recentProfileFrame from '@/assets/elements/recent/profile-frame.png';
import recentRetroRoundFrame from '@/assets/elements/recent/retro-round-frame.png';
import recentLineArrow from '@/assets/elements/recent/line-arrow.svg';
import recentOrangeStickyNote from '@/assets/elements/recent/orange-sticky-note.png';
import recentArrowRight from '@/assets/elements/recent/arrow-right.png';

const recentlyUsedItems = [
  { id: 'line-diamond', name: 'Line', image: recentLineDiamondBlack },
  { id: 'thin-black-line', name: 'Thin Black Horizontal Line', image: recentThinBlackLine },
  { id: 'stick-figure', name: 'Stick Figure Walking', image: recentStickFigure },
  { id: 'square', name: 'Square', image: recentSquare },
  { id: 'retro-frame', name: 'Profile Picture Retro Rounded Frame', image: recentRetroFrame },
  { id: 'profile-frame', name: 'Profile Frame', image: recentProfileFrame },
  {
    id: 'retro-round-frame',
    name: 'Profile Picture Retro Round Frame',
    image: recentRetroRoundFrame,
  },
  { id: 'line-arrow', name: 'Line with Arrow', image: recentLineArrow },
  { id: 'orange-sticky-note', name: 'Orange Sticky Note', image: recentOrangeStickyNote },
  { id: 'arrow-right', name: 'Arrow Right', image: recentArrowRight },
];

export default function ElementsContent(): React.ReactNode {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback(() => {
    // Search not wired to results view in this prototype.
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        handleSearch();
      }
    },
    [handleSearch],
  );

  return (
    // Plain div: viewport-height flex column (outer scroll panel); Easel Box reset
    // would wipe the calc() height constraint.
    <div className={styles.panel}>
      {/* Plain div: non-scrolling header band (flex-shrink:0 + bottom padding). */}
      <div className={styles.searchHeader}>
        <Rows spacing="2u">
          <ElementsSearchInput
            placeholder="Describe your ideal element"
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />
          <SearchActionBar onSearch={handleSearch} />
        </Rows>
      </div>
      {/* Plain div: scroll body composes sharedStyles.scrollableTabContent
          plus local margin-right bleed for scrollbar-gutter. */}
      <div className={`${sharedStyles.scrollableTabContent} ${styles.scrollBody}`}>
        <div className={styles.sectionRows}>
          {/* Row 2: Recently used */}
          <ImageSectionCarousel
            title="Recently used"
            cardWidth={80}
            cardHeight={80}
            templates={recentlyUsedItems}
            onSeeAllClick={() => console.log('Recently used see all')}
          />

          {/* Row 3: Browse categories */}
          <div>
            <Text
              weight="bold"
              size="medium"
              className={`${sharedStyles.sectionTitle} ${styles.browseCategoriesTitle}`}
            >
              Browse categories
            </Text>
            <div className={styles.categoryGrid}>
              {browseCategories.map(cat => (
                <button key={cat.id} className={styles.categoryItem}>
                  {/* Plain div: decorative 2-card stack with per-category dynamic backgrounds;
                      Easel Box reset would wipe the background set via inline style. */}
                  <div className={styles.cardStack}>
                    <div
                      className={styles.backCard}
                      style={{
                        background: `linear-gradient(135deg, ${cat.gradStart}, ${cat.gradEnd})`,
                      }}
                    >
                      <img
                        src={categoryImage(cat.slug, 'back')}
                        alt=""
                        className={styles.cardImg}
                      />
                    </div>
                    {/* Plain div: front card inherits category-specific solid background
                        via inline style; Easel Box would wipe it. */}
                    <div className={styles.frontCard} style={{ background: cat.frontBg }}>
                      <img
                        src={categoryImage(cat.slug, 'front')}
                        alt=""
                        className={styles.cardImg}
                      />
                    </div>
                  </div>
                  <Text size="small" alignment="center">
                    {cat.label}
                  </Text>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
