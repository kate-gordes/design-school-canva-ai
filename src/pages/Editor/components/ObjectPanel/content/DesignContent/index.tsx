import React, { useCallback, useMemo, useState } from 'react';
import { Rows, BrandKitIcon } from '@canva/easel';
import ImageSectionColumns from '@/pages/Editor/components/ObjectPanel/ImageSectionColumns';
import ImageSectionCarousel from '@/pages/Editor/components/ObjectPanel/ImageSectionCarousel';
import ElementsSearchInput from '@/pages/Editor/components/ObjectPanel/content/ElementsContent/ElementsSearchInput';
import SearchActionBar from '@/pages/Editor/components/ObjectPanel/content/SearchActionBar';
import {
  getRandomTemplates,
  getTrendingTemplates,
  getTemplatesBySubcategory,
} from '@/pages/home/Templates/data/templateLoader';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';
import styles from './DesignContent.module.css';

export default function DesignContent(): React.ReactNode {
  const [searchQuery, setSearchQuery] = useState('');

  const recentTemplates = useMemo(() => getTemplatesBySubcategory('Brochures').slice(0, 1), []);
  const brandTemplates = useMemo(() => getTrendingTemplates(6), []);
  const allTemplates = useMemo(() => getRandomTemplates(12, 999), []);

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
    // Plain div: outer scroll panel; Easel Box reset would wipe viewport-height
    // calc constraints required for sticky scroll layout.
    <div className={styles.panel}>
      {/* Plain div: non-scrolling header band; sibling of scroll body relies on
          flex-shrink:0 which Easel Box does not expose. */}
      <div className={styles.searchHeader}>
        <Rows spacing="2u">
          <ElementsSearchInput
            placeholder="Describe your ideal design"
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onKeyDown={handleKeyDown}
          />
          <SearchActionBar onSearch={handleSearch} />
        </Rows>
      </div>
      {/* Plain div: scroll body composes sharedStyles.scrollableTabContent + local
          margin-right bleed; Easel Box reset would wipe both. */}
      <div className={`${sharedStyles.scrollableTabContent} ${styles.scrollBody}`}>
        <Rows spacing="2u">
          <ImageSectionColumns
            title="Recently used"
            cardWidth={200}
            cardHeight={130}
            templates={recentTemplates}
            onSeeAllClick={() => console.log('Recently used see all')}
          />

          <ImageSectionCarousel
            title="Brand Templates"
            titleIcon={<BrandKitIcon />}
            cardWidth={160}
            cardHeight={120}
            templates={brandTemplates}
            onSeeAllClick={() => console.log('Brand templates see all')}
          />

          <ImageSectionColumns
            title="All results"
            cardWidth={200}
            cardHeight={200}
            templates={allTemplates}
            onSeeAllClick={() => console.log('All results see all')}
          />
        </Rows>
      </div>
    </div>
  );
}
