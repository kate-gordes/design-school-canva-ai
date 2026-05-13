import React from 'react';
import { Box, Divider, Grid, Rows, Title, Text, Spacer } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { Sheet } from '@canva/easel/surface/sheet';
import { Menu, MenuItem } from '@canva/easel/menu';
import { TextInput } from '@canva/easel/form/text_input';
import {
  ArrowLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PrintPhotoBookIcon,
  MoreHorizontalIcon,
  SearchIcon,
  XIcon,
  BrandTemplateIcon,
  CanvaLetterLogoFilledColorIcon,
  GridViewIcon,
  ListBulletLtrIcon,
} from '@canva/easel/icons';
import GradientBanner from '@/shared_components/GradientBanner';
import {
  DesignCard,
  BrandKitCard,
  type BrandKitDesign,
} from '@/pages/Home/components/CardThumbnails';
import { ContentBrandIcon } from '@/shared_components/icons';
import MobileSearchBox from '@/pages/Home/components/MobileSearchBox';
import MobileCarousel from '@/pages/Home/components/MobileCarousel';
import MobileBrandTemplateRow from './components/MobileBrandTemplateRow';
import {
  CategoryDropdown,
  CreatorDropdown,
  DateModifiedDropdown,
} from '@/pages/home/components/Dropdowns';
import type { DateSortType } from '@/pages/home/components/Dropdowns/DateModifiedDropdown';
import { getCategoryImage } from './data/images';
import { getAllBrandKitNames, getBrandKitLogo, getBrandKitImageUrl } from './data';
import { useAppContext } from '@/hooks/useAppContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './MobileBrand.module.css';
import Guidelines from './views/Guidelines';
import Logos from './views/Logos';
import Colors from './views/Colors';
import Fonts from './views/Fonts';
import Emojis from './views/Emojis';
import Photography from './views/Photography';
import Motion from './views/Motion';
import UI from './views/UI';
import VisualSuite from './views/VisualSuite';
import BrandVoice from './views/BrandVoice';
import Graphics from './views/Graphics';
import Charts from './views/Charts';
import Photos from './views/Photos';
import Icons from './views/Icons';
import CanvaValues from './views/CanvaValues';
import Stickers from './views/Stickers';
import ScriptMarks from './views/ScriptMarks';
import CanvaPhotos from './views/CanvaPhotos';
import MobileCategoryAssetList from './views/MobileCategoryAssetList';

import { starredTemplates, allBrandTemplates } from './data/brandTemplates';

const viewLabels: Record<string, string> = {
  'brand-templates': 'All Brand Templates',
  'all-assets': 'All assets',
  guidelines: 'Guidelines',
  logos: 'Logos',
  colors: 'Colors',
  fonts: 'Fonts',
  emojis: 'Emojis',
  photography: 'Photography',
  motion: 'Motion',
  ui: 'UI',
  'visual-suite': 'Visual Suite',
  'brand-voice': 'Brand voice',
  graphics: 'Graphics',
  charts: 'Charts',
  photos: 'Photos',
  icons: 'Icons',
  'canva-values': 'Canva Values',
  stickers: 'Stickers',
  'script-marks': 'Script Marks',
  'canva-photos': 'Canva Photos',
};

const coreBrandViews = [
  'emojis',
  'ui',
  'photography',
  'logos',
  'colors',
  'fonts',
  'motion',
  'visual-suite',
  'brand-voice',
  'charts',
];

const internalBrandViews = ['canva-photos', 'stickers', 'canva-values', 'script-marks'];

/** Views that support a grid/list toggle in the mobile header. */
const viewModeSupportedViews = new Set<string>([
  'brand-templates',
  'emojis',
  'ui',
  'photography',
  'motion',
  'visual-suite',
  'canva-photos',
  'stickers',
  'canva-values',
  'script-marks',
]);

/** Maps the route view key to the brand-kit category name for list rendering. */
const viewCategoryNames: Record<string, string> = {
  emojis: 'Emojis',
  ui: 'UI',
  photography: 'Photography',
  motion: 'Motion',
  'visual-suite': 'Visual Suite',
  'canva-photos': 'Canva Photos',
  stickers: 'Stickers',
  'canva-values': 'Canva Values',
  'script-marks': 'Script Marks',
};

const coreBrandKitCards: BrandKitDesign[] = coreBrandViews.map(key => ({
  id: key,
  title: viewLabels[key],
  colors: [],
  logoUrl: getCategoryImage('Canva Brand Kit', viewLabels[key]),
}));

const internalBrandKitCards: BrandKitDesign[] = internalBrandViews.map(key => ({
  id: key,
  title: viewLabels[key],
  colors: [],
  logoUrl: getCategoryImage('Canva Brand Kit', viewLabels[key]),
}));

export default function MobileBrand(): React.ReactNode {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showHeader, setShowHeader] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [showBrandKitPicker, setShowBrandKitPicker] = React.useState(false);
  const [brandKitSearch, setBrandKitSearch] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState('all');
  const [filterCreator, setFilterCreator] = React.useState('all');
  const [filterDate, setFilterDate] = React.useState<DateSortType>('any');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const { selectedBrandKit, setSelectedBrandKit } = useAppContext();

  const currentView = searchParams.get('view') || 'brand-templates';
  const currentLabel = viewLabels[currentView] || 'All Brand Templates';
  const showViewToggle = viewModeSupportedViews.has(currentView);

  const allBrandKitNamesList = getAllBrandKitNames();
  const filteredBrandKits = brandKitSearch
    ? allBrandKitNamesList.filter(name => name.toLowerCase().includes(brandKitSearch.toLowerCase()))
    : allBrandKitNamesList;

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');
      if (scrollableElement) {
        const scrolled = scrollableElement.scrollTop > 0;
        setShowHeader(scrolled);
      }
    };

    const timer = setTimeout(() => {
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');
      if (scrollableElement) {
        scrollableElement.addEventListener('scroll', handleScroll);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      const scrollableElement = document.querySelector('[data-mobile-scroll-container="true"]');
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleBackClick = () => {
    navigate('/more');
  };

  const handleViewChange = (view: string) => {
    setSearchParams({ view });
    setSheetOpen(false);
  };

  // Wrap a desktop view component so its internal top padding is stripped on mobile.
  const wrapDesktopView = (view: React.ReactNode) => (
    <div className={styles.desktopViewReset}>{view}</div>
  );

  const renderContent = () => {
    // List-mode override for supported category sub-views.
    // Brand Templates list view is handled inside its own case (uses a
    // different row component + no folders), so skip it here.
    if (
      viewMode === 'list'
      && currentView !== 'brand-templates'
      && viewCategoryNames[currentView]
    ) {
      return <MobileCategoryAssetList categoryName={viewCategoryNames[currentView]} />;
    }

    switch (currentView) {
      case 'brand-templates':
        return (
          <>
            <MobileSearchBox placeholder="Search Brand Templates" />
            {/* Plain divs: horizontal overflow-x scroll container for filter pills on
               narrow viewports — Box doesn't expose overflow-x + hidden scrollbar. */}
            <div className={styles.filterPillsScroller}>
              <div className={styles.filterPillsRow}>
                <CategoryDropdown value={filterCategory} onChange={setFilterCategory} />
                <CreatorDropdown value={filterCreator} onChange={setFilterCreator} />
                <DateModifiedDropdown value={filterDate} onChange={setFilterDate} />
              </div>
            </div>
            <Box paddingX="2u" paddingBottom="4u">
              <Rows spacing="4u">
                <Rows spacing="1.5u">
                  <Box width="full">
                    <Title size="small" weight="normal">
                      Starred for team
                    </Title>
                  </Box>
                  {/* Plain div: Easel Box resets margin; need negative
                     margin-left to cancel the carousel's built-in 16px
                     padding-left so the first card aligns with the title,
                     while the right edge stays inside the parent Box's
                     paddingX="2u" (matches the content below). */}
                  <div className={styles.starredCarouselBleed}>
                    <MobileCarousel name="starred-for-team" rows={1} itemGap="12px">
                      {starredTemplates.map(design => (
                        <div key={design.id} className={styles.starredCardItem}>
                          <DesignCard design={design} variant="icon" showDoctype />
                        </div>
                      ))}
                    </MobileCarousel>
                  </div>
                </Rows>
                <Rows spacing="1.5u">
                  <Box width="full">
                    <Title size="small" weight="normal">
                      All Brand Templates
                    </Title>
                  </Box>
                  {viewMode === 'grid' ? (
                    /* Plain div: scoped wrapper so CSS can tighten card content padding
                       on mobile — Easel Box would reset our custom descendant rules. */
                    <div className={styles.mobileCardGrid}>
                      <Grid columns={2} spacing="1u">
                        {allBrandTemplates.map(design => (
                          <DesignCard key={design.id} design={design} variant="icon" showDoctype />
                        ))}
                      </Grid>
                    </div>
                  ) : (
                    <Rows spacing="1u">
                      {allBrandTemplates.map(design => (
                        <MobileBrandTemplateRow key={design.id} design={design} />
                      ))}
                    </Rows>
                  )}
                </Rows>
              </Rows>
            </Box>
          </>
        );
      case 'all-assets':
        return (
          <Box paddingX="2u" paddingBottom="4u">
            <Rows spacing="4u">
              <Rows spacing="1.5u">
                <Box width="full">
                  <Title size="medium" weight="normal">
                    Core Brand
                  </Title>
                </Box>
                <Grid columns={2} spacing="1u">
                  {coreBrandKitCards.map(card => (
                    <BrandKitCard
                      key={card.id}
                      brandKit={card}
                      onClick={() => handleViewChange(card.id)}
                    />
                  ))}
                </Grid>
              </Rows>

              <Rows spacing="1.5u">
                <Box width="full">
                  <Title size="medium" weight="normal">
                    Internal Brand
                  </Title>
                </Box>
                <Grid columns={2} spacing="1u">
                  {internalBrandKitCards.map(card => (
                    <BrandKitCard
                      key={card.id}
                      brandKit={card}
                      onClick={() => handleViewChange(card.id)}
                    />
                  ))}
                </Grid>
              </Rows>
            </Rows>
          </Box>
        );
      case 'guidelines':
        return wrapDesktopView(<Guidelines />);
      case 'logos':
        return wrapDesktopView(<Logos />);
      case 'colors':
        return wrapDesktopView(<Colors />);
      case 'fonts':
        return wrapDesktopView(<Fonts />);
      case 'emojis':
        return wrapDesktopView(<Emojis />);
      case 'photography':
        return wrapDesktopView(<Photography />);
      case 'motion':
        return wrapDesktopView(<Motion />);
      case 'ui':
        return wrapDesktopView(<UI />);
      case 'visual-suite':
        return wrapDesktopView(<VisualSuite />);
      case 'brand-voice':
        return wrapDesktopView(<BrandVoice />);
      case 'graphics':
        return wrapDesktopView(<Graphics />);
      case 'charts':
        return wrapDesktopView(<Charts />);
      case 'photos':
        return wrapDesktopView(<Photos />);
      case 'icons':
        return wrapDesktopView(<Icons />);
      case 'canva-values':
        return wrapDesktopView(<CanvaValues />);
      case 'stickers':
        return wrapDesktopView(<Stickers />);
      case 'script-marks':
        return wrapDesktopView(<ScriptMarks />);
      case 'canva-photos':
        return wrapDesktopView(<CanvaPhotos />);
      default:
        return (
          <>
            <MobileSearchBox placeholder="Search Brand Templates" />
            {/* Plain divs: horizontal overflow-x scroll container for filter pills on
               narrow viewports — Box doesn't expose overflow-x + hidden scrollbar. */}
            <div className={styles.filterPillsScroller}>
              <div className={styles.filterPillsRow}>
                <CategoryDropdown value={filterCategory} onChange={setFilterCategory} />
                <CreatorDropdown value={filterCreator} onChange={setFilterCreator} />
                <DateModifiedDropdown value={filterDate} onChange={setFilterDate} />
              </div>
            </div>
            <Box paddingX="2u" paddingBottom="4u">
              <Rows spacing="4u">
                <Rows spacing="1.5u">
                  <Box width="full">
                    <Title size="small" weight="normal">
                      Starred for team
                    </Title>
                  </Box>
                  {/* Plain div: Easel Box resets margin; need negative
                     margin-left to cancel the carousel's built-in 16px
                     padding-left so the first card aligns with the title,
                     while the right edge stays inside the parent Box's
                     paddingX="2u" (matches the content below). */}
                  <div className={styles.starredCarouselBleed}>
                    <MobileCarousel name="starred-for-team" rows={1} itemGap="12px">
                      {starredTemplates.map(design => (
                        <div key={design.id} className={styles.starredCardItem}>
                          <DesignCard design={design} variant="icon" showDoctype />
                        </div>
                      ))}
                    </MobileCarousel>
                  </div>
                </Rows>
                <Rows spacing="1.5u">
                  <Box width="full">
                    <Title size="small" weight="normal">
                      All Brand Templates
                    </Title>
                  </Box>
                  {viewMode === 'grid' ? (
                    /* Plain div: scoped wrapper so CSS can tighten card content padding
                       on mobile — Easel Box would reset our custom descendant rules. */
                    <div className={styles.mobileCardGrid}>
                      <Grid columns={2} spacing="1u">
                        {allBrandTemplates.map(design => (
                          <DesignCard key={design.id} design={design} variant="icon" showDoctype />
                        ))}
                      </Grid>
                    </div>
                  ) : (
                    <Rows spacing="1u">
                      {allBrandTemplates.map(design => (
                        <MobileBrandTemplateRow key={design.id} design={design} />
                      ))}
                    </Rows>
                  )}
                </Rows>
              </Rows>
            </Box>
          </>
        );
    }
  };

  return (
    <>
      {/* Plain divs: fixed-position mobile header chrome — Easel Box would reset the
         background/margin we need for the scroll-in fade. */}
      <div className={`${styles.headerBackground} ${showHeader ? styles.visible : ''}`} />

      <div className={styles.backButton}>
        <BasicButton onClick={handleBackClick}>
          <ArrowLeftIcon size="medium" />
        </BasicButton>
      </div>

      {showViewToggle && (
        /* Plain div: fixed-position top-right chrome — mirrors .backButton. */
        <div className={styles.viewToggleButton}>
          <BasicButton
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            aria-label={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
          >
            {viewMode === 'grid' ? (
              <ListBulletLtrIcon size="medium" />
            ) : (
              <GridViewIcon size="medium" />
            )}
          </BasicButton>
        </div>
      )}

      <div className={`${styles.headerTitle} ${showHeader ? styles.visible : ''}`}>
        {currentView === 'all-assets' && <CanvaLetterLogoFilledColorIcon size="large" />}
        <Text size="medium" weight="bold">
          {currentView === 'all-assets' ? 'Canva Brand Kit' : currentLabel}
        </Text>
      </div>

      {/* Plain div: Easel Box resets background; scroll container needs the
         box-shadow seam + GradientBanner child to paint correctly. */}
      <div className={styles.container} data-mobile-scroll-container="true">
        <GradientBanner height={160} />

        <div className={styles.contentWrapper}>
          <Box width="full" className={styles.headerArea}>
            <BasicButton onClick={() => setSheetOpen(true)}>
              <Box display="flex" className={styles.titleButtonLarge}>
                {currentView === 'all-assets' && <CanvaLetterLogoFilledColorIcon size="large" />}
                <Title size="large" weight="normal" className={styles.pageTitle}>
                  {currentView === 'all-assets' ? 'Canva Brand Kit' : currentLabel}
                </Title>
                <Box className={styles.dropdownIconCircleLarge}>
                  <ChevronDownIcon size="medium" />
                </Box>
              </Box>
            </BasicButton>
          </Box>

          <div className={styles.mobileViewContent}>{renderContent()}</div>
        </div>
      </div>

      {/* Brand Navigation Sheet */}
      <Sheet
        open={sheetOpen}
        onRequestClose={() => {
          setSheetOpen(false);
          setShowBrandKitPicker(false);
          setBrandKitSearch('');
        }}
        size="large"
      >
        <Box className={styles.sheetContainer}>
          {showBrandKitPicker ? (
            /* ── Brand Kit Picker Sub-Menu ── */
            <>
              <div className={styles.pickerHeader}>
                <div className={styles.pickerHeaderLeft}>
                  <BasicButton
                    onClick={() => {
                      setShowBrandKitPicker(false);
                      setBrandKitSearch('');
                    }}
                  >
                    <ArrowLeftIcon size="medium" />
                  </BasicButton>
                  <Text size="medium" weight="bold">
                    Canva Brand Kit
                  </Text>
                </div>
                <div className={styles.pickerHeaderRight}>
                  <BasicButton
                    onClick={() => {
                      setSheetOpen(false);
                      setShowBrandKitPicker(false);
                      setBrandKitSearch('');
                    }}
                  >
                    <XIcon size="medium" />
                  </BasicButton>
                </div>
              </div>

              <div className={styles.pickerDivider}>
                <Divider />
              </div>

              <div className={styles.pickerSearchWrapper}>
                <div className={styles.pickerSearchBox}>
                  <SearchIcon size="medium" />
                  <input
                    type="text"
                    className={`${styles.brandKitSearchInput} ${styles.pickerSearchInput}`}
                    value={brandKitSearch}
                    onChange={e => setBrandKitSearch(e.target.value)}
                    placeholder="Search Brand Kits"
                  />
                </div>
              </div>

              <div>
                {filteredBrandKits.map(name => {
                  const logoUrl = getBrandKitLogo(name);
                  const isSelected = name === selectedBrandKit;
                  const isCanva = name === 'Canva Brand Kit';
                  return (
                    <div
                      key={name}
                      onClick={() => {
                        setSelectedBrandKit(name);
                        setShowBrandKitPicker(false);
                        setBrandKitSearch('');
                      }}
                      className={styles.pickerItem}
                    >
                      <div
                        className={`${styles.pickerAvatar} ${isCanva ? '' : styles.pickerAvatarDefault}`}
                      >
                        {logoUrl ? (
                          <img
                            src={getBrandKitImageUrl(logoUrl)}
                            alt={`${name} logo`}
                            width={28}
                            height={28}
                            className={styles.pickerAvatarImage}
                          />
                        ) : isCanva ? (
                          <div className={styles.pickerAvatarCanvaLarge}>
                            <CanvaLetterLogoFilledColorIcon size="large" />
                          </div>
                        ) : (
                          <CanvaLetterLogoFilledColorIcon size="medium" />
                        )}
                      </div>
                      <div className={styles.pickerItemLabel}>
                        <Text size="medium">{name}</Text>
                      </div>
                      {isSelected && <CheckIcon size="medium" />}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* ── Main Navigation Menu ── */
            <>
              <div className={styles.sheetHeader}>
                <div className={styles.sheetHeaderClose}>
                  <BasicButton
                    onClick={() => {
                      setSheetOpen(false);
                      setShowBrandKitPicker(false);
                      setBrandKitSearch('');
                    }}
                  >
                    <XIcon size="medium" />
                  </BasicButton>
                </div>
              </div>

              <Box paddingBottom="1.5u">
                <Divider />
              </Box>

              {/* All Brand Templates */}
              <Menu className={styles.sheetIconMenu}>
                <MenuItem
                  onClick={() => handleViewChange('brand-templates')}
                  start={
                    <div className={styles.sheetMenuIconCircle}>
                      <BrandTemplateIcon size="medium" />
                    </div>
                  }
                  className={
                    currentView === 'brand-templates' ? styles.sheetItemSelected : undefined
                  }
                >
                  <Text size="medium" weight="bold">
                    All Brand Templates
                  </Text>
                </MenuItem>
              </Menu>

              <Spacer size="1u" />

              <Box paddingX="2u" paddingBottom="1u">
                <Text size="medium" weight="regular">
                  Brand Kit
                </Text>
              </Box>

              {/* Canva Brand Kit - opens picker */}
              <Menu className={styles.sheetIconMenu}>
                <MenuItem
                  onClick={() => setShowBrandKitPicker(true)}
                  start={
                    <div className={styles.sheetMenuIconCircle}>
                      <CanvaLetterLogoFilledColorIcon size="medium" />
                    </div>
                  }
                  end={<ChevronRightIcon size="medium" />}
                >
                  <Text size="medium" weight="bold">
                    {selectedBrandKit}
                  </Text>
                </MenuItem>
              </Menu>

              <Box paddingTop="0.5u" paddingBottom="1.5u">
                <Divider />
              </Box>

              {/* Top-level views */}
              <Menu>
                <MenuItem
                  onClick={() => handleViewChange('all-assets')}
                  className={currentView === 'all-assets' ? styles.sheetItemSelected : undefined}
                >
                  <Text size="medium">All assets</Text>
                </MenuItem>
                <MenuItem
                  onClick={() => handleViewChange('guidelines')}
                  className={currentView === 'guidelines' ? styles.sheetItemSelected : undefined}
                >
                  <Text size="medium">Guidelines</Text>
                </MenuItem>
              </Menu>

              <Spacer size="3u" />

              <Box paddingX="2u" paddingBottom="1u">
                <Text size="medium" weight="bold">
                  Core Brand
                </Text>
              </Box>

              <Menu>
                {coreBrandViews.map(view => (
                  <MenuItem
                    key={view}
                    onClick={() => handleViewChange(view)}
                    className={currentView === view ? styles.sheetItemSelected : undefined}
                  >
                    <Text size="medium">{viewLabels[view]}</Text>
                  </MenuItem>
                ))}
              </Menu>

              <Spacer size="3u" />

              <Box paddingX="2u" paddingBottom="1u">
                <Text size="medium" weight="bold">
                  Internal Brand
                </Text>
              </Box>

              <Menu>
                {internalBrandViews.map(view => (
                  <MenuItem
                    key={view}
                    onClick={() => handleViewChange(view)}
                    className={currentView === view ? styles.sheetItemSelected : undefined}
                  >
                    <Text size="medium">{viewLabels[view]}</Text>
                  </MenuItem>
                ))}
              </Menu>

              <Spacer size="4u" />
            </>
          )}
        </Box>
      </Sheet>
    </>
  );
}
