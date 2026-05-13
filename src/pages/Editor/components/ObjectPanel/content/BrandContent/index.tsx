import React, { useState, useMemo } from 'react';
import { Box, Text, TreeMenu, TreeMenuItem } from '@canva/easel';
import { ArrowLeftIcon } from '@canva/easel/icons';
import BrandKitSelector from '@/pages/Home/Brand/components/BrandKitSelector';
import { RegularSearch } from '@/shared_components/Search';
import { useAppContext } from '@/hooks/useAppContext';
import useIsMobile from '@/hooks/useIsMobile';
import { getCategoriesBySection, categoryNameToViewId } from '@/pages/Home/Brand/data';
import AllAssetsView from './views/AllAssetsView';
import GuidelinesView from './views/GuidelinesView';
import LogosView from './views/LogosView';
import ColorsView from './views/ColorsView';
import FontsView from './views/FontsView';
import BrandVoiceView from './views/BrandVoiceView';
import PhotosView from './views/PhotosView';
import GraphicsView from './views/GraphicsView';
import IconsView from './views/IconsView';
import ChartsView from './views/ChartsView';
import EmojisView from '@/pages/Home/Brand/components/BrandPanel/views/EmojisView';
import PhotographyView from '@/pages/Home/Brand/components/BrandPanel/views/PhotographyView';
import MotionView from '@/pages/Home/Brand/components/BrandPanel/views/MotionView';
import UIView from '@/pages/Home/Brand/components/BrandPanel/views/UIView';
import VisualSuiteView from '@/pages/Home/Brand/components/BrandPanel/views/VisualSuiteView';
import BrandTemplatesPanelView from '@/pages/Home/Brand/components/BrandPanel/views/BrandTemplatesPanelView';
import CanvaValuesView from '@/pages/Home/Brand/components/BrandPanel/views/CanvaValuesView';
import StickersView from '@/pages/Home/Brand/components/BrandPanel/views/StickersView';
import ScriptMarksView from '@/pages/Home/Brand/components/BrandPanel/views/ScriptMarksView';
import CanvaPhotosView from '@/pages/Home/Brand/components/BrandPanel/views/CanvaPhotosView';
import { MobileBrandBackContext } from '@/contexts/MobileBrandBackContext';
import styles from './BrandContent.module.css';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';
import viewStyles from '@/pages/home/Brand/components/BrandPanel/BrandViews.module.css';

const viewsWithMobileSearch = new Set([
  'all-assets',
  'logos',
  'emojis',
  'photography',
  'motion',
  'ui',
  'visual-suite',
  'charts',
  'canva-values',
  'stickers',
  'script-marks',
  'canva-photos',
]);

const viewComponents: Record<string, React.ComponentType> = {
  'brand-templates': BrandTemplatesPanelView,
  'all-assets': AllAssetsView,
  guidelines: GuidelinesView,
  logos: LogosView,
  colors: ColorsView,
  fonts: FontsView,
  'brand-voice': BrandVoiceView,
  photos: PhotosView,
  graphics: GraphicsView,
  icons: IconsView,
  charts: ChartsView,
  emojis: EmojisView,
  photography: PhotographyView,
  motion: MotionView,
  ui: UIView,
  'visual-suite': VisualSuiteView,
  'canva-values': CanvaValuesView,
  stickers: StickersView,
  'script-marks': ScriptMarksView,
  'canva-photos': CanvaPhotosView,
};

const coreBrandOrder = [
  'Logos',
  'Emojis',
  'Photography',
  'Colors',
  'Fonts',
  'Motion',
  'UI',
  'Visual Suite',
  'Brand Voice',
  'Charts',
];
const internalBrandOrder = ['Stickers', 'Canva Values', 'Script Marks', 'Canva Photos'];

const sortByOrder = (items: { id: string; title: string; view: string }[], order: string[]) =>
  [...items].sort((a, b) => {
    const ai = order.indexOf(a.title);
    const bi = order.indexOf(b.title);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

export default function BrandContent(): React.ReactNode {
  const { brandKitData, selectedBrandKit } = useAppContext();
  const isMobile = useIsMobile();
  const [selectedView, setSelectedView] = useState('all-assets');
  const [mobileShowContent, setMobileShowContent] = useState(false);
  const [mobileSelectedLabel, setMobileSelectedLabel] = useState('All Brand Templates');
  const [searchValue, setSearchValue] = useState('');

  const { guidelinesItems, coreBrandItems, otherItems, internalBrandItems, allViewIds } =
    useMemo(() => {
      if (!brandKitData) {
        return {
          guidelinesItems: [],
          coreBrandItems: [],
          otherItems: [],
          internalBrandItems: [],
          allViewIds: [],
        };
      }

      const isExcluded = (categoryName: string) => categoryName === 'Canva AI';

      const toItem = (cat: any) => ({
        id: categoryNameToViewId(cat.categoryName),
        title: cat.categoryName,
        view: categoryNameToViewId(cat.categoryName),
      });

      const guidelines = getCategoriesBySection(brandKitData, 'Guidelines')
        .filter(cat => !isExcluded(cat.categoryName))
        .map(toItem);

      const coreBrand = sortByOrder(
        getCategoriesBySection(brandKitData, 'Core Brand')
          .filter(cat => !isExcluded(cat.categoryName))
          .map(toItem),
        coreBrandOrder,
      );

      const other = getCategoriesBySection(brandKitData, 'Other')
        .filter(cat => !isExcluded(cat.categoryName))
        .map(toItem);

      const internalBrand = sortByOrder(
        getCategoriesBySection(brandKitData, 'Internal Brand')
          .filter(cat => !isExcluded(cat.categoryName))
          .map(toItem),
        internalBrandOrder,
      );

      const allViews = [...guidelines, ...coreBrand, ...other, ...internalBrand].map(
        item => item.view,
      );

      return {
        guidelinesItems: guidelines,
        coreBrandItems: coreBrand,
        otherItems: other,
        internalBrandItems: internalBrand,
        allViewIds: allViews,
      };
    }, [brandKitData]);

  const viewLabelMap: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {
      'brand-templates': 'All Brand Templates',
      'all-assets': 'All assets',
    };
    guidelinesItems.forEach(item => {
      map[item.id] = item.title;
    });
    coreBrandItems.forEach(item => {
      map[item.id] = item.title;
    });
    otherItems.forEach(item => {
      map[item.id] = item.title;
    });
    internalBrandItems.forEach(item => {
      map[item.id] = item.title;
    });
    return map;
  }, [guidelinesItems, coreBrandItems, otherItems, internalBrandItems]);

  React.useEffect(() => {
    if (
      selectedView !== 'all-assets'
      && selectedView !== 'brand-templates'
      && !allViewIds.includes(selectedView)
    ) {
      setSelectedView('all-assets');
    }
  }, [selectedBrandKit, selectedView, allViewIds]);

  const handleItemClick = (view: string) => {
    setSelectedView(view);
    if (isMobile) {
      setMobileSelectedLabel(viewLabelMap[view] || view);
      setMobileShowContent(true);
    }
  };

  const handleMobileBack = () => {
    setMobileShowContent(false);
  };

  const ViewComponent = viewComponents[selectedView] || AllAssetsView;

  /* ── Mobile: matches desktop BrandPanel sidebar ── */
  if (isMobile) {
    if (mobileShowContent) {
      const showSearch = viewsWithMobileSearch.has(selectedView);
      const isAllAssets = selectedView === 'all-assets';
      return (
        <div className={styles.mobileContainer}>
          <div className={styles.mobileContentWrap}>
            <div className={styles.mobileStickyTop}>
              {showSearch && (
                <RegularSearch
                  value={searchValue}
                  onChange={setSearchValue}
                  placeholder="Search"
                  className={styles.mobileSearchBox}
                />
              )}
              <button className={styles.mobileBackButton} onClick={handleMobileBack}>
                <ArrowLeftIcon size="medium" />
                <Text weight="bold" size="medium" className={styles.mobileBackLabel}>
                  {mobileSelectedLabel}
                </Text>
              </button>
              {isAllAssets && (
                <div className={styles.mobileBrandKitWrap}>
                  <BrandKitSelector showLabel={false} />
                </div>
              )}
            </div>

            <MobileBrandBackContext.Provider value={{ onBack: handleMobileBack, hideTitle: true }}>
              <ViewComponent />
            </MobileBrandBackContext.Provider>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.mobileContainer}>
        <div className={styles.mobileStickySearchHeader}>
          <RegularSearch
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search"
            className={styles.mobileSearchBox}
          />
        </div>

        <TreeMenu
          role="list"
          className={styles.mobileNavMenu}
          itemCustomToggleWidth="1u"
          indentation="0"
        >
          <TreeMenuItem
            label="All Brand Templates"
            onClick={() => handleItemClick('brand-templates')}
          />
        </TreeMenu>

        <div className={styles.mobileDivider} />

        <div className={styles.mobileBrandKitWrap}>
          <BrandKitSelector showLabel={false} />
        </div>

        {guidelinesItems.length > 0 && (
          <TreeMenu
            role="list"
            className={styles.mobileNavMenu}
            itemCustomToggleWidth="1u"
            indentation="0"
          >
            {guidelinesItems.map(item => (
              <TreeMenuItem
                key={item.id}
                label={item.title}
                onClick={() => handleItemClick(item.view)}
              />
            ))}
          </TreeMenu>
        )}

        {coreBrandItems.length > 0 && (
          <>
            <div className={styles.mobileSectionHeadingLabel}>Core Brand</div>

            <TreeMenu
              role="list"
              className={styles.mobileNavMenu}
              itemCustomToggleWidth="1u"
              indentation="0"
            >
              {coreBrandItems.map(item => (
                <TreeMenuItem
                  key={item.id}
                  label={item.title}
                  onClick={() => handleItemClick(item.view)}
                />
              ))}
            </TreeMenu>
          </>
        )}

        {otherItems.length > 0 && (
          <TreeMenu
            role="list"
            className={styles.mobileNavMenu}
            itemCustomToggleWidth="1u"
            indentation="0"
          >
            {otherItems.map(item => (
              <TreeMenuItem
                key={item.id}
                label={item.title}
                onClick={() => handleItemClick(item.view)}
              />
            ))}
          </TreeMenu>
        )}

        {internalBrandItems.length > 0 && (
          <>
            <div className={styles.mobileSectionHeadingLabel}>Internal Brand</div>

            <TreeMenu
              role="list"
              className={styles.mobileNavMenu}
              itemCustomToggleWidth="1u"
              indentation="0"
            >
              {internalBrandItems.map(item => (
                <TreeMenuItem
                  key={item.id}
                  label={item.title}
                  onClick={() => handleItemClick(item.view)}
                />
              ))}
            </TreeMenu>
          </>
        )}
      </div>
    );
  }

  /* ── Desktop: two-column side-by-side layout ── */
  return (
    <Box display="flex" height="full" className={styles.brandPanelContainer}>
      <Box className={styles.leftSidebar}>
        <div className={styles.leftSidebarScrollable}>
          <div className={styles.sidebarSearchWrap}>
            <RegularSearch
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search"
              className={styles.sidebarSearchBox}
            />
          </div>

          <TreeMenu
            role="list"
            className={styles.navMenu}
            itemCustomToggleWidth="1u"
            indentation="0"
          >
            <TreeMenuItem
              label="All Brand Templates"
              selected={selectedView === 'brand-templates'}
              onClick={() => handleItemClick('brand-templates')}
            />
          </TreeMenu>

          <div className={styles.sidebarDivider} />

          <Box paddingY="2u">
            <BrandKitSelector showLabel={false} />
          </Box>

          {guidelinesItems.length > 0 && (
            <TreeMenu
              role="list"
              className={styles.navMenu}
              itemCustomToggleWidth="1u"
              indentation="0"
            >
              {guidelinesItems.map(item => (
                <TreeMenuItem
                  key={item.id}
                  label={item.title}
                  selected={selectedView === item.view}
                  onClick={() => handleItemClick(item.view)}
                />
              ))}
            </TreeMenu>
          )}

          {coreBrandItems.length > 0 && (
            <>
              <TreeMenu
                role="list"
                className={styles.navMenu}
                itemCustomToggleWidth="1u"
                indentation="0"
              >
                <TreeMenuItem label="Core Brand" className={styles.sectionHeading} />
              </TreeMenu>

              <TreeMenu
                role="list"
                className={styles.navMenu}
                itemCustomToggleWidth="1u"
                indentation="0"
              >
                {coreBrandItems.map(item => (
                  <TreeMenuItem
                    key={item.id}
                    label={item.title}
                    selected={selectedView === item.view}
                    onClick={() => handleItemClick(item.view)}
                  />
                ))}
              </TreeMenu>
            </>
          )}

          {otherItems.length > 0 && (
            <TreeMenu
              role="list"
              className={styles.navMenu}
              itemCustomToggleWidth="1u"
              indentation="0"
            >
              {otherItems.map(item => (
                <TreeMenuItem
                  key={item.id}
                  label={item.title}
                  selected={selectedView === item.view}
                  onClick={() => handleItemClick(item.view)}
                />
              ))}
            </TreeMenu>
          )}
        </div>
      </Box>

      <Box className={styles.rightContent}>
        <div className={`${sharedStyles.scrollableTabContent} ${styles.rightContentScroll}`}>
          <div className={viewStyles.brandViewContent}>
            <ViewComponent />
          </div>
        </div>
      </Box>
    </Box>
  );
}
