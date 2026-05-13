import React, { useState } from 'react';
import { Text, Spacer, Button, Rows } from '@canva/easel';
import BrandKitButton from '@/pages/Home/Brand/components/BrandKitButton';
import { TextIcon, MagicPencilIcon } from '@canva/easel/icons';
import ImageSectionColumns from '@/pages/Editor/components/ObjectPanel/ImageSectionColumns';
import ImageSectionCarousel from '@/pages/Editor/components/ObjectPanel/ImageSectionCarousel';
import FontSection from '@/pages/Editor/components/ObjectPanel/FontSection';
import { RegularSearch } from '@/shared_components/Search';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';
import styles from './TextContent.module.css';
import textAppFontstudio from '@/assets/text/apps/fontstudio.png';
import textAppTypecraft from '@/assets/text/apps/typecraft.svg';
import textAppMojoai from '@/assets/text/apps/mojoai.svg';
import textAppTypeextrude from '@/assets/text/apps/typeextrude.png';
import textAppTypecutout from '@/assets/text/apps/typecutout.png';
import textAppTypelettering from '@/assets/text/apps/typelettering.png';
import textAppTypegradient from '@/assets/text/apps/typegradient.png';

const recentlyUsedApps = [
  {
    id: 'recent-1',
    name: '',
    image: 'https://template.canva.com/EAEB6fKoJnY/5/0/354w-hFNaWbL3b-4.png',
  },
  {
    id: 'recent-2',
    name: '',
    image: 'https://template.canva.com/EAFxfyz1JRg/2/0/478w-JfoU1_w9Mh0.png',
  },
  {
    id: 'recent-3',
    name: '',
    image: 'https://template.canva.com/EAEB6b9Ce_w/1/0/370w-TUm2Q7zwIt0.png',
  },
  {
    id: 'recent-4',
    name: '',
    image: 'https://template.canva.com/EAGDHknJa-E/2/0/760w-ugE365vmA_E.png',
  },
  {
    id: 'recent-5',
    name: '',
    image: 'https://template.canva.com/EAFxkGCC_NY/3/0/758w-uZiR80ptRvA.png',
  },
  {
    id: 'recent-6',
    name: '',
    image: 'https://template.canva.com/EAGEx-n-GJM/2/0/792w-bqk0gvIhCPo.png',
  },
  {
    id: 'recent-7',
    name: '',
    image: 'https://template.canva.com/EAFxq-Xw3M8/2/0/790w-r5QjevDeW1s.png',
  },
  {
    id: 'recent-8',
    name: '',
    image: 'https://template.canva.com/EAEB6dhKZrQ/2/0/372w-2TTvjv_sXQE.png',
  },
];

const fontCombinations = [
  {
    id: 'font-combo-1',
    name: '',
    image: 'https://template.canva.com/EAGiJB-Lw_c/1/0/384w-eApsE9z_T78.png',
  },
  {
    id: 'font-combo-2',
    name: '',
    image: 'https://template.canva.com/EAEB6TMeq3o/2/0/286w-FOgriZoILzQ.png',
  },
  {
    id: 'font-combo-3',
    name: '',
    image: 'https://template.canva.com/EAGEx2kaAtw/2/0/784w-zHnzYHA9i1Q.png',
  },
  {
    id: 'font-combo-4',
    name: '',
    image: 'https://template.canva.com/EAD876-5-YQ/3/0/514w-1xmSEL7OCrM.png',
  },
  {
    id: 'font-combo-5',
    name: '',
    image: 'https://template.canva.com/EAFxf5AnnE8/2/0/340w-aS4NcEKJFLo.png',
  },
  {
    id: 'font-combo-6',
    name: '',
    image: 'https://template.canva.com/EAGDH_veAkY/2/0/320w-WUmhfnLMe1c.png',
  },
];

export default function TextContent(): React.ReactNode {
  const [searchValue, setSearchValue] = useState<string>('');

  return (
    <div className={styles.wrapper}>
      <div className={styles.fixedTop}>
        <Rows spacing="1u">
          <RegularSearch
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search fonts and combinations"
            className={sharedStyles.searchBox}
          />
          <Spacer size="0.5u" />
          <Button
            variant="primary"
            onClick={() => console.log('Add text box')}
            alignment="center"
            stretch
          >
            <TextIcon size="medium" /> <span className={styles.iconGap} /> Add a text box
          </Button>
          <Button
            variant="secondary"
            onClick={() => console.log('Magic write')}
            alignment="center"
            stretch
          >
            <MagicPencilIcon size="medium" /> <span className={styles.iconGap} /> Magic Write
          </Button>
          <Spacer size="1u" />
        </Rows>
      </div>

      <div className={styles.scrollArea}>
        <Rows spacing="2u">
          {/* Row 2: Font styles */}
          <FontSection
            customHeader={<BrandKitButton />}
            onHeadingClick={() => console.log('Heading')}
            onSubheadingClick={() => console.log('Subheading')}
            onBodyClick={() => console.log('Body')}
          />

          {/* Row 3: Dynamic text */}
          <div>
            <Text weight="bold" size="medium" className={sharedStyles.sectionTitle}>
              Dynamic text
            </Text>
            <Spacer size="1u" />
            <div
              className={styles.pageNumbersButton}
              onClick={() => console.log('Page numbers')}
              role="button"
              tabIndex={0}
            >
              <img
                src="https://static.canva.com/web/images/ccab74f416b7b44da49560c24527ea5a.png"
                alt="Page numbers"
                className={styles.pageNumbersImage}
              />
              <Text weight="bold" size="medium" className={sharedStyles.sectionTitle}>
                Page numbers
              </Text>
            </div>
          </div>

          {/* Row 4: Apps */}
          <ImageSectionCarousel
            title="Apps"
            cardWidth={96}
            cardHeight={96}
            templates={[
              { id: 'app-1', name: 'TypeStudio', image: textAppFontstudio },
              { id: 'app-2', name: 'TypeCraft', image: textAppTypecraft },
              { id: 'app-3', name: 'MotionText', image: textAppMojoai },
              { id: 'app-4', name: 'TypeExtrude', image: textAppTypeextrude },
              { id: 'app-5', name: 'TypeCutOut', image: textAppTypecutout },
              { id: 'app-6', name: 'TypeLettering', image: textAppTypelettering },
              { id: 'app-7', name: 'TypeGradient', image: textAppTypegradient },
            ]}
            onSeeAllClick={() => console.log('Apps see all')}
          />

          {/* Row 5: Recently used */}
          <ImageSectionCarousel
            title="Recently used"
            cardWidth={152}
            cardHeight={160}
            objectFit="contain"
            showProBadge
            templates={recentlyUsedApps}
            onSeeAllClick={() => console.log('Recently used see all')}
          />

          {/* Row 6: Font combinations */}
          <ImageSectionColumns
            title="Font combinations"
            cardWidth={200}
            cardHeight={160}
            objectFit="contain"
            showProBadge
            templates={fontCombinations}
            onSeeAllClick={() => console.log('Font combinations see all')}
          />
        </Rows>
      </div>
    </div>
  );
}
