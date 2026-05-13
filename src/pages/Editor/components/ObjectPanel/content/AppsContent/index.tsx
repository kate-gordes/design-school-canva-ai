import React, { useState } from 'react';
import { Spacer, Tabs, TabList, Tab, TabPanels, TabPanel, Rows } from '@canva/easel';
import {
  InvoiceIcon,
  ChartIcon,
  PhotosProIcon,
  GridIcon,
  FlashIcon,
  AudioIcon,
  BackgroundProIcon,
  DatabaseIcon,
} from '@canva/easel/icons';
import { RegularSearch } from '@/shared_components/Search';
import SearchPills from '@/shared_components/SearchPills';
import ImageSectionCarousel from '@/pages/Editor/components/ObjectPanel/ImageSectionCarousel';
import IconSection from '@/pages/Editor/components/ObjectPanel/IconSection';
import IconSectionCarousel from '@/pages/Editor/components/ObjectPanel/IconSectionCarousel';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';
import styles from './AppsContent.module.css';

export default function AppsContent(): React.ReactNode {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('For you');

  // Filter categories for SearchPills
  const filterCategories = [
    'For you',
    'AI generation',
    'Audio and voiceover',
    'Communication',
    'File and data management',
    'Graphic design',
    'Marketing',
    'Photo editing',
    'Project management',
    'Text styling',
    'Video and animation',
  ];

  // More from Canva icons data
  const moreFromCanvaItems = [
    {
      icon: <InvoiceIcon size="medium" />,
      label: 'AI Voice',
      onClick: () => console.log('AI Voice clicked'),
    },
    {
      icon: <ChartIcon size="medium" />,
      label: 'Charts',
      onClick: () => console.log('Charts clicked'),
    },
    {
      icon: <PhotosProIcon size="medium" />,
      label: 'Photos',
      onClick: () => console.log('Photos clicked'),
    },
    {
      icon: <GridIcon size="medium" />,
      label: 'Bulk create',
      onClick: () => console.log('Bulk create clicked'),
    },
    {
      icon: <FlashIcon size="medium" />,
      label: 'Labs',
      onClick: () => console.log('Labs clicked'),
    },
    {
      icon: <AudioIcon size="medium" />,
      label: 'Audio',
      onClick: () => console.log('Audio clicked'),
    },
    {
      icon: <BackgroundProIcon size="medium" />,
      label: 'Background remover',
      onClick: () => console.log('Background remover clicked'),
    },
    {
      icon: <DatabaseIcon size="medium" />,
      label: 'Data autofill',
      onClick: () => console.log('Data autofill clicked'),
    },
  ];

  // Draft apps icons data (2 items)
  const draftAppsItems = [
    {
      icon: <InvoiceIcon size="medium" />,
      label: 'Draft App 1',
      onClick: () => console.log('Draft App 1 clicked'),
    },
    {
      icon: <ChartIcon size="medium" />,
      label: 'Draft App 2',
      onClick: () => console.log('Draft App 2 clicked'),
    },
  ];

  // Your team apps icons data (12 items)
  const yourTeamAppsItems = [
    {
      icon: <InvoiceIcon size="medium" />,
      label: 'Team App 1',
      onClick: () => console.log('Team App 1 clicked'),
    },
    {
      icon: <ChartIcon size="medium" />,
      label: 'Team App 2',
      onClick: () => console.log('Team App 2 clicked'),
    },
    {
      icon: <PhotosProIcon size="medium" />,
      label: 'Team App 3',
      onClick: () => console.log('Team App 3 clicked'),
    },
    {
      icon: <GridIcon size="medium" />,
      label: 'Team App 4',
      onClick: () => console.log('Team App 4 clicked'),
    },
    {
      icon: <FlashIcon size="medium" />,
      label: 'Team App 5',
      onClick: () => console.log('Team App 5 clicked'),
    },
    {
      icon: <AudioIcon size="medium" />,
      label: 'Team App 6',
      onClick: () => console.log('Team App 6 clicked'),
    },
    {
      icon: <BackgroundProIcon size="medium" />,
      label: 'Team App 7',
      onClick: () => console.log('Team App 7 clicked'),
    },
    {
      icon: <DatabaseIcon size="medium" />,
      label: 'Team App 8',
      onClick: () => console.log('Team App 8 clicked'),
    },
    {
      icon: <InvoiceIcon size="medium" />,
      label: 'Team App 9',
      onClick: () => console.log('Team App 9 clicked'),
    },
    {
      icon: <ChartIcon size="medium" />,
      label: 'Team App 10',
      onClick: () => console.log('Team App 10 clicked'),
    },
    {
      icon: <PhotosProIcon size="medium" />,
      label: 'Team App 11',
      onClick: () => console.log('Team App 11 clicked'),
    },
    {
      icon: <GridIcon size="medium" />,
      label: 'Team App 12',
      onClick: () => console.log('Team App 12 clicked'),
    },
  ];

  // Popular apps icons data (carousel)
  const popularAppsItems = [
    {
      icon: <InvoiceIcon size="medium" />,
      label: 'Popular App 1',
      onClick: () => console.log('Popular App 1 clicked'),
    },
    {
      icon: <ChartIcon size="medium" />,
      label: 'Popular App 2',
      onClick: () => console.log('Popular App 2 clicked'),
    },
    {
      icon: <PhotosProIcon size="medium" />,
      label: 'Popular App 3',
      onClick: () => console.log('Popular App 3 clicked'),
    },
    {
      icon: <GridIcon size="medium" />,
      label: 'Popular App 4',
      onClick: () => console.log('Popular App 4 clicked'),
    },
    {
      icon: <FlashIcon size="medium" />,
      label: 'Popular App 5',
      onClick: () => console.log('Popular App 5 clicked'),
    },
    {
      icon: <AudioIcon size="medium" />,
      label: 'Popular App 6',
      onClick: () => console.log('Popular App 6 clicked'),
    },
    {
      icon: <BackgroundProIcon size="medium" />,
      label: 'Popular App 7',
      onClick: () => console.log('Popular App 7 clicked'),
    },
    {
      icon: <DatabaseIcon size="medium" />,
      label: 'Popular App 8',
      onClick: () => console.log('Popular App 8 clicked'),
    },
  ];

  // AI generation apps icons data (not carousel)
  const aiGenerationAppsItems = [
    {
      icon: <InvoiceIcon size="medium" />,
      label: 'AI App 1',
      onClick: () => console.log('AI App 1 clicked'),
    },
    {
      icon: <ChartIcon size="medium" />,
      label: 'AI App 2',
      onClick: () => console.log('AI App 2 clicked'),
    },
    {
      icon: <PhotosProIcon size="medium" />,
      label: 'AI App 3',
      onClick: () => console.log('AI App 3 clicked'),
    },
    {
      icon: <GridIcon size="medium" />,
      label: 'AI App 4',
      onClick: () => console.log('AI App 4 clicked'),
    },
    {
      icon: <FlashIcon size="medium" />,
      label: 'AI App 5',
      onClick: () => console.log('AI App 5 clicked'),
    },
    {
      icon: <AudioIcon size="medium" />,
      label: 'AI App 6',
      onClick: () => console.log('AI App 6 clicked'),
    },
  ];

  // Your apps tab data (10 items, no title)
  const yourAppsItems = [
    {
      icon: <InvoiceIcon size="medium" />,
      label: 'Mockups',
      onClick: () => console.log('Mockups clicked'),
    },
    {
      icon: <ChartIcon size="medium" />,
      label: 'Magic Morph',
      onClick: () => console.log('Magic Morph clicked'),
    },
    {
      icon: <PhotosProIcon size="medium" />,
      label: 'PhotoTools',
      onClick: () => console.log('PhotoTools clicked'),
    },
    {
      icon: <GridIcon size="medium" />,
      label: 'Canvawork',
      onClick: () => console.log('Canvawork clicked'),
    },
    {
      icon: <FlashIcon size="medium" />,
      label: 'Hexdrop',
      onClick: () => console.log('Hexdrop clicked'),
    },
    {
      icon: <AudioIcon size="medium" />,
      label: 'Canva Next',
      onClick: () => console.log('Canva Next clicked'),
    },
    {
      icon: <BackgroundProIcon size="medium" />,
      label: 'TypeCraft',
      onClick: () => console.log('TypeCraft clicked'),
    },
    {
      icon: <DatabaseIcon size="medium" />,
      label: 'Magic Icons',
      onClick: () => console.log('Magic Icons clicked'),
    },
    {
      icon: <InvoiceIcon size="medium" />,
      label: 'Text 2 Emoji',
      onClick: () => console.log('Text 2 Emoji clicked'),
    },
    {
      icon: <ChartIcon size="medium" />,
      label: 'DALL-E',
      onClick: () => console.log('DALL-E clicked'),
    },
  ];

  return (
    // Plain div: viewport-height flex column (outer scroll panel); Easel Box reset
    // would wipe the calc() height constraint.
    <div className={styles.panel}>
      <Tabs defaultActiveId="discover">
        {/* Plain div: non-scrolling header band (flex-shrink:0 + bottom padding). */}
        <div className={styles.searchHeader}>
          <RegularSearch
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search Canva apps"
            className={sharedStyles.searchBox}
          />

          <Spacer size="2u" />

          <TabList align="stretch" spacing="0">
            <Tab id="discover">Discover</Tab>
            <Tab id="your-apps">Your apps</Tab>
          </TabList>
        </div>

        {/* Plain div: scroll body composes sharedStyles.scrollableTabContent
            plus local margin-right bleed for scrollbar-gutter. */}
        <div className={`${sharedStyles.scrollableTabContent} ${styles.scrollBody}`}>
          <TabPanels>
            <TabPanel id="discover">
              <Rows spacing="2u">
                <SearchPills
                  categories={filterCategories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />

                <ImageSectionCarousel
                  title="Made for presentations"
                  cardWidth={264}
                  cardHeight={287}
                  itemCount={3}
                  onSeeAllClick={() => console.log('Made for presentations see all')}
                />

                <ImageSectionCarousel
                  title="Trending"
                  cardWidth={223}
                  cardHeight={180}
                  itemCount={4}
                  onSeeAllClick={() => console.log('Trending see all')}
                />

                <IconSection
                  title="More from Canva"
                  items={moreFromCanvaItems}
                  onSeeAllClick={() => console.log('More from Canva see all')}
                />

                <IconSection
                  title="Draft apps"
                  items={draftAppsItems}
                  onSeeAllClick={() => console.log('Draft apps see all')}
                />

                <IconSection
                  title="Your team apps"
                  items={yourTeamAppsItems}
                  onSeeAllClick={() => console.log('Your team apps see all')}
                />

                <IconSectionCarousel
                  title="Popular"
                  items={popularAppsItems}
                  onSeeAllClick={() => console.log('Popular see all')}
                />

                <IconSection
                  title="AI generation"
                  items={aiGenerationAppsItems}
                  onSeeAllClick={() => console.log('AI generation see all')}
                />
              </Rows>
            </TabPanel>

            <TabPanel id="your-apps">
              <IconSection items={yourAppsItems} />
            </TabPanel>
          </TabPanels>
        </div>
      </Tabs>
    </div>
  );
}
