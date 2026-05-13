import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Box, TreeMenu, TreeMenuItem, Button, Rows, Text } from '@canva/easel';
import FolderCard from '@/pages/Home/Projects/components/FolderCard';
import BrandKitSelector from '@/pages/home/Brand/components/BrandKitSelector';
import { RegularSearch } from '@/shared_components/Search';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategoriesBySection, categoryNameToViewId } from '@/pages/home/Brand/data';
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
import EmojisView from './views/EmojisView';
import PhotographyView from './views/PhotographyView';
import MotionView from './views/MotionView';
import UIView from './views/UIView';
import VisualSuiteView from './views/VisualSuiteView';
import CanvaValuesView from './views/CanvaValuesView';
import StickersView from './views/StickersView';
import ScriptMarksView from './views/ScriptMarksView';
import CanvaPhotosView from './views/CanvaPhotosView';
import BrandTemplatesPanelView from './views/BrandTemplatesPanelView';
import BrandTemplatesCategoryView from './views/BrandTemplatesCategoryView';
import styles from './BrandPanel.module.css';
import viewStyles from './BrandViews.module.css';

// View components mapping
const viewComponents: Record<string, React.ComponentType> = {
  'brand-templates': BrandTemplatesPanelView,
  'brand-templates-category': BrandTemplatesCategoryView,
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

interface BrandPanelProps {
  onClose: () => void;
  docked: boolean;
  onContentVisibilityChange?: (visible: boolean) => void;
}

export default function BrandPanel({
  onClose,
  docked,
  onContentVisibilityChange,
}: BrandPanelProps): React.ReactNode {
  const { brandKitData, selectedBrandKit } = useAppContext();
  const [selectedView, setSelectedView] = useState('brand-templates');
  const [contentVisible, setContentVisible] = useState(true);
  const [detailView, setDetailView] = useState<'folders' | null>(null);
  const [detailViewData, setDetailViewData] = useState<any>(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    setSelectedView('brand-templates');
    setContentVisible(true);
    setDetailView(null);
  }, []);

  const onContentVisibilityChangeRef = useRef(onContentVisibilityChange);
  onContentVisibilityChangeRef.current = onContentVisibilityChange;

  useEffect(() => {
    onContentVisibilityChangeRef.current?.(contentVisible);
  }, [contentVisible]);

  // Desired display order for each section
  const coreBrandOrder = [
    'Emojis',
    'Photography',
    'Logos',
    'Colors',
    'Fonts',
    'Motion',
    'UI',
    'Visual Suite',
    'Brand Voice',
    'Charts',
  ];
  const internalBrandOrder = ['Canva Photos', 'Stickers', 'Canva Values', 'Script Marks'];

  const sortByOrder = (items: any[], order: string[]) => {
    return [...items].sort((a, b) => {
      const ai = order.indexOf(a.title);
      const bi = order.indexOf(b.title);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  };

  // Dynamically build menu items from brand kit data
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

  // Reset to "all-assets" if the current view doesn't exist in the new brand kit
  React.useEffect(() => {
    if (
      selectedView !== 'all-assets'
      && selectedView !== 'brand-templates'
      && selectedView !== 'brand-templates-category'
      && !allViewIds.includes(selectedView)
    ) {
      setSelectedView('brand-templates');
    }
  }, [selectedBrandKit, selectedView, allViewIds]);

  const handleItemClick = (view: string) => {
    if (selectedView === view && contentVisible) {
      // Clicking the same category again hides the content
      setContentVisible(false);
    } else {
      // Clicking a different category or when content is hidden
      setSelectedView(view);
      setContentVisible(true);
      setDetailView(null); // Clear detail view when changing categories
    }
  };

  const handleNavigateToCategory = (categoryView: string) => {
    setSelectedView(categoryView);
    setContentVisible(true);
    setDetailView(null);
  };

  const handleShowAllFolders = (folders: any[]) => {
    setDetailView('folders');
    setDetailViewData(folders);
  };

  const handleBackToCategory = () => {
    setDetailView(null);
    setDetailViewData(null);
  };

  // Get the current view component
  const ViewComponent = viewComponents[selectedView] || AllAssetsView;

  // Render detail views
  const renderDetailView = () => {
    if (detailView === 'folders' && detailViewData) {
      return (
        <Box width="full">
          <Rows spacing="3u">
            {/* Back button header */}
            <Box display="flex" alignItems="center" paddingBottom="2u">
              <Button
                variant="tertiary"
                size="small"
                onClick={handleBackToCategory}
                className={styles.backButton}
                aria-label="Back to category"
              >
                <Box display="flex" alignItems="center">
                  <span style={{ fontSize: '18px', marginRight: '8px' }}>←</span>
                  <Text weight="bold" size="medium">
                    Linked folders
                  </Text>
                </Box>
              </Button>
            </Box>

            {/* All folders in vertical layout */}
            <Rows spacing="1u">
              {detailViewData.map((folder: any) => (
                <FolderCard
                  key={folder.id}
                  title={folder.name}
                  itemCount={folder.itemCount}
                  isPrivate={folder.isPrivate || false}
                  onClick={() => console.log('Folder clicked:', folder.name)}
                />
              ))}
            </Rows>
          </Rows>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box
      className={`${styles.brandPanel} ${docked ? styles.docked : styles.floating} ${!contentVisible ? styles.sidebarOnly : ''}`}
    >
      <Box display="flex" height="full" className={styles.panelContent}>
        {/* Left Navigation Sidebar - Always visible */}
        <Box className={styles.leftSidebar}>
          <div className={styles.leftSidebarSearchWrap}>
            <RegularSearch
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search"
              className={styles.searchBox}
            />
          </div>
          <div className={styles.leftSidebarScrollable}>
            <TreeMenu
              role="list"
              className={styles.navMenu}
              itemCustomToggleWidth="1u"
              indentation="0"
            >
              <TreeMenuItem
                label="All Brand Templates"
                selected={selectedView === 'brand-templates'}
                onClick={() => {
                  setSelectedView('brand-templates');
                  setContentVisible(true);
                  setDetailView(null);
                }}
              />
            </TreeMenu>

            <div className={styles.divider} />

            <div className={styles.brandKitSelectorWrap}>
              <BrandKitSelector showLabel={false} />
            </div>

            {/* Guidelines Section */}
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

            {/* Brand Templates category (standalone nav item) */}
            <TreeMenu
              role="list"
              className={styles.navMenu}
              itemCustomToggleWidth="1u"
              indentation="0"
            >
              <TreeMenuItem
                label="Brand Templates"
                selected={selectedView === 'brand-templates-category'}
                onClick={() => handleItemClick('brand-templates-category')}
              />
            </TreeMenu>

            {/* Core Brand Section */}
            {coreBrandItems.length > 0 && (
              <>
                <div className={styles.sectionHeadingLabel}>Core Brand</div>

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

            {/* Other Section (Photos, Graphics, Icons, Charts, etc.) */}
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

            {/* Internal Brand Section */}
            {internalBrandItems.length > 0 && (
              <>
                <div className={styles.sectionHeadingLabel}>Internal Brand</div>

                <TreeMenu
                  role="list"
                  className={styles.navMenu}
                  itemCustomToggleWidth="1u"
                  indentation="0"
                >
                  {internalBrandItems.map(item => (
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
          </div>
        </Box>

        {/* Right Content Area - Toggleable */}
        {contentVisible && (
          <Box className={`${styles.rightContent} ${detailView ? styles.detailViewActive : ''}`}>
            {/* Detail view slides in from right */}
            {detailView && (
              <div className={`${styles.detailViewSlide} ${styles.slideIn}`}>
                {renderDetailView()}
              </div>
            )}

            {/* Main category content */}
            <div
              className={`${styles.rightContentScrollable} ${detailView ? styles.slideOut : ''}`}
            >
              <div className={viewStyles.brandViewContent}>
                <ViewComponent
                  {...({
                    onShowAllFolders: handleShowAllFolders,
                    onNavigateToCategory: handleNavigateToCategory,
                  } as any)}
                />
              </div>
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
}
