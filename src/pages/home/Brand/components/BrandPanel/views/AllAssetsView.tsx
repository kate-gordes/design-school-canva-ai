import React, { useMemo } from 'react';
import { Box, Rows, Text, Carousel } from '@canva/easel';
import { BrandTemplateIcon, MagicPencilIcon } from '@canva/easel/icons';
import { DesignCard, type ProjectDesign } from '@/pages/home/components/CardThumbnails';
import { brandKitAssetsToDesigns } from './brandAssetGridUtils';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import FolderCard from '@/pages/Home/Projects/components/FolderCard';
import ColorPalette from '@/shared_components/ColorPalette';
import styles from '@/pages/home/Brand/components/BrandPanel/BrandViews.module.css';

const brandTemplates: ProjectDesign[] = [
  {
    id: 'bt-1',
    title: 'Canva Deck Template',
    doctype: 'Presentation',
    private: false,
    lastModified: '1 month ago',
  },
  {
    id: 'bt-2',
    title: 'Dark Brand Template',
    doctype: 'Presentation',
    private: false,
    lastModified: '2 weeks ago',
  },
  {
    id: 'bt-3',
    title: 'Product Launch Template',
    doctype: 'Presentation',
    private: false,
    lastModified: '3 weeks ago',
  },
];

interface AllAssetsViewProps {
  onShowAllFolders?: (folders: any[]) => void;
  onNavigateToCategory?: (categoryView: string) => void;
}

export default function AllAssetsView({
  onNavigateToCategory,
}: AllAssetsViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  // Get all categories from brand kit
  const logosCategory = useMemo(() => getCategory(brandKitData, 'Logos'), [brandKitData]);
  const emojisCategory = useMemo(() => getCategory(brandKitData, 'Emojis'), [brandKitData]);
  const photographyCategory = useMemo(
    () => getCategory(brandKitData, 'Photography'),
    [brandKitData],
  );
  const motionCategory = useMemo(() => getCategory(brandKitData, 'Motion'), [brandKitData]);
  const uiCategory = useMemo(() => getCategory(brandKitData, 'UI'), [brandKitData]);
  const visualSuiteCategory = useMemo(
    () => getCategory(brandKitData, 'Visual Suite'),
    [brandKitData],
  );
  const chartsCategory = useMemo(() => getCategory(brandKitData, 'Charts'), [brandKitData]);
  const stickersCategory = useMemo(() => getCategory(brandKitData, 'Stickers'), [brandKitData]);
  const canvaValuesCategory = useMemo(
    () => getCategory(brandKitData, 'Canva Values'),
    [brandKitData],
  );
  const scriptMarksCategory = useMemo(
    () => getCategory(brandKitData, 'Script Marks'),
    [brandKitData],
  );
  const canvaPhotosCategory = useMemo(
    () => getCategory(brandKitData, 'Canva Photos'),
    [brandKitData],
  );

  const colorPalettes = [
    {
      name: 'Canva Glow Up – Secondary Solid Palette',
      colors: [
        '#4ECDC4',
        '#6B5B95',
        '#C44DCC',
        '#4A90E2',
        '#50E3C2',
        '#F5A623',
        '#D0021B',
        '#D548CC',
      ],
    },
    {
      name: 'Canva Glow Up – Tertiary Solid Palette',
      colors: [
        '#D4E8F2',
        '#E8D4F2',
        '#F2D4E8',
        '#D4F2E8',
        '#F2E8D4',
        '#E8F2D4',
        '#F2F2D4',
        '#D4D4F2',
      ],
    },
    {
      name: 'Neutral Palette',
      colors: [
        '#000000',
        '#4A4A4A',
        '#9B9B9B',
        '#FFFFFF',
        '#F5F5F5',
        '#E8E8E8',
        '#D1D1D1',
        '#B8B8B8',
      ],
    },
  ];

  const fontStyles = [
    { name: 'Heading', fontSize: '20px', fontWeight: 600 },
    { name: 'Subheading', fontSize: '17px', fontWeight: 400 },
    { name: 'Body', fontSize: '14px', fontWeight: 400 },
  ];

  // Helper to render section header with See all
  const SectionHeader = ({
    title,
    onSeeAll,
    folderCount,
    icon,
  }: {
    title: string;
    onSeeAll: () => void;
    folderCount?: number;
    icon?: React.ReactNode;
  }) => (
    <Box display="flex" justifyContent="spaceBetween" alignItems="center" paddingBottom="1u">
      <Box display="flex" alignItems="center">
        {icon && (
          <span style={{ marginRight: '6px', display: 'flex', alignItems: 'center' }}>{icon}</span>
        )}
        <Text weight="bold" size="medium" className={styles.sectionTitle}>
          {title}
        </Text>
        {folderCount !== undefined && folderCount > 0 && (
          <Text size="medium" tone="tertiary" weight="bold" className={styles.foldersText}>
            • {folderCount} folder{folderCount !== 1 ? 's' : ''}
          </Text>
        )}
      </Box>
      <button
        onClick={onSeeAll}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        <Text size="small" tone="secondary" weight="bold">
          See all
        </Text>
      </button>
    </Box>
  );

  return (
    <Box width="full">
      <Rows spacing="3u">
        {/* Brand Assist Section */}
        <div>
          <Box paddingBottom="1u">
            <Text weight="bold" size="medium" className={styles.sectionTitle}>
              Brand Assist
            </Text>
          </Box>
          <div
            style={{
              padding: '8px 12px',
              background: '#f5f5f5',
              borderRadius: '12px',
            }}
          >
            <Text size="medium" tone="secondary">
              No brand suggestions for now – great job.
            </Text>
          </div>
        </div>

        {/* All Brand Templates Section */}
        <div>
          <SectionHeader
            title="All Brand Templates"
            icon={<BrandTemplateIcon size="medium" />}
            onSeeAll={() => onNavigateToCategory?.('brand-templates')}
          />
          <Carousel ariaLabel="brand-templates" buttonVariant="chevron">
            {brandTemplates.map(design => (
              <div key={design.id} style={{ minWidth: '156px', width: '156px' }}>
                <DesignCard design={design} thumbnailOnly />
              </div>
            ))}
          </Carousel>
        </div>

        {/* Logos Section */}
        {logosCategory && logosCategory.assets?.length > 0 && (
          <div>
            <SectionHeader
              title="Logos"
              onSeeAll={() => onNavigateToCategory?.('logos')}
              folderCount={logosCategory.folders?.length}
            />
            <Carousel ariaLabel="logos" buttonVariant="chevron">
              {brandKitAssetsToDesigns(logosCategory.assets.slice(0, 6)).map(design => (
                <div key={design.id} style={{ minWidth: '156px', width: '156px' }}>
                  <DesignCard design={design} thumbnailOnly borderlessThumbnail />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Emojis Section */}
        {emojisCategory && emojisCategory.assets?.length > 0 && (
          <div>
            <SectionHeader
              title="Emojis"
              onSeeAll={() => onNavigateToCategory?.('emojis')}
              folderCount={emojisCategory.folders?.length}
            />
            <Carousel ariaLabel="emojis" buttonVariant="chevron">
              {brandKitAssetsToDesigns(emojisCategory.assets.slice(0, 6)).map(design => (
                <div key={design.id} style={{ minWidth: '156px', width: '156px' }}>
                  <DesignCard design={design} thumbnailOnly borderlessThumbnail />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Photography Section */}
        {photographyCategory && photographyCategory.assets?.length > 0 && (
          <div>
            <SectionHeader
              title="Photography"
              onSeeAll={() => onNavigateToCategory?.('photography')}
              folderCount={photographyCategory.folders?.length}
            />
            <Carousel ariaLabel="photography" buttonVariant="chevron">
              {brandKitAssetsToDesigns(photographyCategory.assets.slice(0, 6)).map(design => (
                <div key={design.id} style={{ minWidth: '156px', width: '156px' }}>
                  <DesignCard design={design} thumbnailOnly borderlessThumbnail />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Colors Section */}
        <div>
          <SectionHeader title="Colors" onSeeAll={() => onNavigateToCategory?.('colors')} />
          <Rows spacing="2u">
            {colorPalettes.map((palette, index) => (
              <ColorPalette key={index} name={palette.name} colors={palette.colors} />
            ))}
          </Rows>
        </div>

        {/* Fonts Section */}
        <div>
          <SectionHeader title="Fonts" onSeeAll={() => onNavigateToCategory?.('fonts')} />
          <Rows spacing="1u">
            {fontStyles.map((font, index) => (
              <button
                key={index}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 14px',
                  border: '1px solid rgba(57, 76, 96, 0.15)',
                  borderRadius: '8px',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: font.fontSize,
                  fontWeight: font.fontWeight,
                }}
              >
                {font.name}
              </button>
            ))}
          </Rows>
        </div>

        {/* Motion Section */}
        {motionCategory && motionCategory.folders?.length > 0 && (
          <div>
            <SectionHeader
              title="Motion"
              onSeeAll={() => onNavigateToCategory?.('motion')}
              folderCount={motionCategory.folders.length}
            />
            <Rows spacing="1u">
              {motionCategory.folders.slice(0, 3).map((folder: any) => (
                <FolderCard
                  key={folder.id}
                  title={folder.name}
                  itemCount={folder.itemCount}
                  isPrivate={false}
                />
              ))}
            </Rows>
          </div>
        )}

        {/* UI Section */}
        {uiCategory && uiCategory.assets?.length > 0 && (
          <div>
            <SectionHeader
              title="UI"
              onSeeAll={() => onNavigateToCategory?.('ui')}
              folderCount={uiCategory.folders?.length}
            />
            <Carousel ariaLabel="ui" buttonVariant="chevron">
              {brandKitAssetsToDesigns(uiCategory.assets.slice(0, 6)).map(design => (
                <div key={design.id} style={{ minWidth: '156px', width: '156px' }}>
                  <DesignCard design={design} thumbnailOnly borderlessThumbnail />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Visual Suite Section */}
        {visualSuiteCategory && visualSuiteCategory.assets?.length > 0 && (
          <div>
            <SectionHeader
              title="Visual Suite"
              onSeeAll={() => onNavigateToCategory?.('visual-suite')}
              folderCount={visualSuiteCategory.folders?.length}
            />
            <Carousel ariaLabel="visual-suite" buttonVariant="chevron">
              {brandKitAssetsToDesigns(visualSuiteCategory.assets.slice(0, 6)).map(design => (
                <div key={design.id} style={{ minWidth: '156px', width: '156px' }}>
                  <DesignCard design={design} thumbnailOnly borderlessThumbnail />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Brand Voice Section */}
        <div>
          <SectionHeader
            title="Brand Voice"
            onSeeAll={() => onNavigateToCategory?.('brand-voice')}
          />
          <Rows spacing="1.5u">
            <Box className={styles.brandVoiceBox} padding="1.5u" borderRadius="element">
              <Text tone="secondary" size="medium">
                Think of Canva like a person
              </Text>
            </Box>
            <Box className={styles.brandVoiceBox} padding="1.5u" borderRadius="element">
              <Text tone="secondary" size="medium">
                We have a core personality that stays true t...
              </Text>
            </Box>
            <button className={styles.brandAssistContainer}>
              <MagicPencilIcon size="medium" />
              <Text size="medium">Generate in this brand voice</Text>
            </button>
          </Rows>
        </div>

        {/* Charts Section */}
        {chartsCategory && chartsCategory.assets?.length > 0 && (
          <div>
            <SectionHeader title="Charts" onSeeAll={() => onNavigateToCategory?.('charts')} />
            <Carousel ariaLabel="charts" buttonVariant="chevron">
              {brandKitAssetsToDesigns(chartsCategory.assets.slice(0, 6)).map(design => (
                <div key={design.id} style={{ minWidth: '156px', width: '156px' }}>
                  <DesignCard design={design} borderlessThumbnail />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Stickers Section */}
        {stickersCategory && stickersCategory.assets?.length > 0 && (
          <div>
            <SectionHeader title="Stickers" onSeeAll={() => onNavigateToCategory?.('stickers')} />
            <Carousel ariaLabel="stickers" buttonVariant="chevron">
              {brandKitAssetsToDesigns(stickersCategory.assets.slice(0, 6)).map(design => (
                <div key={design.id} style={{ minWidth: '156px', width: '156px' }}>
                  <DesignCard design={design} thumbnailOnly borderlessThumbnail />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Canva Values Section */}
        {canvaValuesCategory && canvaValuesCategory.assets?.length > 0 && (
          <div>
            <SectionHeader
              title="Canva Values"
              onSeeAll={() => onNavigateToCategory?.('canva-values')}
              folderCount={canvaValuesCategory.folders?.length}
            />
            <Carousel ariaLabel="canva-values" buttonVariant="chevron">
              {brandKitAssetsToDesigns(canvaValuesCategory.assets.slice(0, 6)).map(design => (
                <div key={design.id} style={{ minWidth: '156px', width: '156px' }}>
                  <DesignCard design={design} thumbnailOnly borderlessThumbnail />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Script Marks Section */}
        {scriptMarksCategory && scriptMarksCategory.assets?.length > 0 && (
          <div>
            <SectionHeader
              title="Script Marks"
              onSeeAll={() => onNavigateToCategory?.('script-marks')}
            />
            <Carousel ariaLabel="script-marks" buttonVariant="chevron">
              {brandKitAssetsToDesigns(scriptMarksCategory.assets.slice(0, 6)).map(design => (
                <div key={design.id} style={{ minWidth: '156px', width: '156px' }}>
                  <DesignCard design={design} thumbnailOnly borderlessThumbnail />
                </div>
              ))}
            </Carousel>
          </div>
        )}

        {/* Canva Photos Section */}
        {canvaPhotosCategory && canvaPhotosCategory.folders?.length > 0 && (
          <div>
            <SectionHeader
              title="Canva Photos"
              onSeeAll={() => onNavigateToCategory?.('canva-photos')}
              folderCount={canvaPhotosCategory.folders.length}
            />
            <Rows spacing="1u">
              {canvaPhotosCategory.folders.slice(0, 3).map((folder: any) => (
                <FolderCard
                  key={folder.id}
                  title={folder.name}
                  itemCount={folder.itemCount}
                  isPrivate={false}
                />
              ))}
            </Rows>
          </div>
        )}
      </Rows>
    </Box>
  );
}
