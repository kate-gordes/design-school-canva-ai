import { Box, Rows } from '@canva/easel';
import BrandPageBanner from '@/pages/home/Brand/components/BrandComponents/BrandPageBanner';
import BrandHeader from '@/pages/home/Brand/components/BrandComponents/BrandHeader';
import ColorPaletteList from '@/pages/home/Brand/components/BrandComponents/ColorPaletteList';
import { colorPalettes } from './SampleData/ColorsSampleData';
import { useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import styles from '../Brand.module.css';
export default function Colors(): React.ReactNode {
  const { selectedBrandKit } = useAppContext();
  const [, setPalettes] = useState(colorPalettes);

  const handleColorClick = (color: { hex: string; name?: string }) => {
    // Copy to clipboard
    navigator.clipboard.writeText(color.hex);
    console.log('Copied to clipboard:', color.hex);
  };

  return (
    <Rows spacing="3u">
      <BrandPageBanner />

      <Box paddingTop="4u">
        {/* Brand Header */}
        <BrandHeader
          title="Colors"
          showAddNew={false}
          showMore={false}
          onAddNewClick={() => console.log('Add new palette')}
          onMoreClick={() => console.log('More options')}
        />

        {/* Color Palettes */}
        <ColorPaletteList
          palettes={colorPalettes}
          showLabels={true}
          editable={false}
          onPalettesChange={setPalettes}
          onColorClick={handleColorClick}
        />
      </Box>
    </Rows>
  );
}
