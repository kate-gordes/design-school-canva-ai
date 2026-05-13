import { Box, Rows } from '@canva/easel';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';
import ColorPaletteList from '@/pages/home/Brand/components/BrandComponents/ColorPaletteList';
import { chartColorPalettes } from './SampleData/ChartsSampleData';
import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { useCategoryEmptyState } from '@/hooks/useBrandKitState';
import EmptyBrandKitSection from '@/pages/home/Brand/components/EmptyBrandKitSection';
import { getCategoryImage } from '@/pages/home/Brand/data';
import styles from '../Brand.module.css';
export default function Charts(): React.ReactNode {
  const [, setPalettes] = useState(chartColorPalettes);
  const { selectedBrandKit } = useAppContext();

  // Use centralized empty state management
  const { shouldShowEmptyState, emptyStateMessage } = useCategoryEmptyState('Charts');

  const handleColorClick = (color: { hex: string; name?: string }) => {
    // Copy to clipboard
    navigator.clipboard.writeText(color.hex);
    console.log('Copied to clipboard:', color.hex);
  };

  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        <BrandHeader
          title="Charts"
          showAddNew={false}
          showMore={false}
          onAddNewClick={() => console.log('Add new charts')}
          onMoreClick={() => console.log('More options')}
        />

        {/* Color Palettes or Empty Section */}
        {shouldShowEmptyState ? (
          <EmptyBrandKitSection
            categoryName="Charts"
            imageUrl={getCategoryImage(selectedBrandKit, 'Charts')}
            title={emptyStateMessage.title}
            description={emptyStateMessage.description}
            buttonText="Show who I can ask"
            onButtonClick={() => console.log('Show who I can ask clicked')}
          />
        ) : (
          <ColorPaletteList
            palettes={chartColorPalettes}
            showLabels={true}
            editable={false}
            onPalettesChange={setPalettes}
            onColorClick={handleColorClick}
          />
        )}
      </Box>
    </Rows>
  );
}
