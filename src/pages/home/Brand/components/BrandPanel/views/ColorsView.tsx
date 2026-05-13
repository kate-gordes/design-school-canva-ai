import React, { useMemo } from 'react';
import { Box, Rows, Text, Spacer, Button } from '@canva/easel';
import { ArrowTopRightIcon } from '@canva/easel/icons';
import BrandPanelTitle, { BrandSectionTitle } from './BrandPanelTitle';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory, type BrandKit } from '@/pages/home/Brand/data';
import ColorPalette from '@/shared_components/ColorPalette';
import { cdn } from '@/utils/cdn';

interface ColorsViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

export default function ColorsView(_props: ColorsViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();

  const colorsCategory = useMemo(() => {
    return getCategory(brandKitData, 'Colors');
  }, [brandKitData]);

  // Extract color palettes from the category data
  const colorPalettes = useMemo(() => {
    // For now, return default palettes - in future this could be data-driven
    return [
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
  }, [colorsCategory]);

  return (
    <Box width="full">
      <BrandPanelTitle>Colors</BrandPanelTitle>
      <Spacer direction="horizontal" size="3u" />
      <Rows spacing="2u">
        <BrandSectionTitle>Palettes</BrandSectionTitle>
        {colorPalettes.length > 0 ? (
          colorPalettes.map((palette, index) => (
            <ColorPalette
              key={index}
              name={palette.name}
              colors={palette.colors}
              onClick={() => console.log(`Selected palette: ${palette.name}`)}
            />
          ))
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No color palettes available in this brand kit.</Text>
          </Box>
        )}
      </Rows>

      <Spacer direction="horizontal" size="3u" />

      <BrandSectionTitle>Styles</BrandSectionTitle>
      <Spacer direction="horizontal" size="2u" />
      <div
        style={{
          border: '2px dashed #d1d1d1',
          borderRadius: '16px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <img
          src={cdn('brand-images/color-styles.png')}
          alt="Color styles preview"
          style={{
            width: '148px',
            height: 'auto',
            borderRadius: '8px',
          }}
        />
        <Spacer direction="horizontal" size="2u" />
        <Text weight="bold" size="large">
          Apply colors together as a style
        </Text>
        <Spacer direction="horizontal" size="1u" />
        <Text size="small" tone="secondary">
          Generate background, text, and element colors to use them in one step.
        </Text>
        <Spacer direction="horizontal" size="2u" />
        <Button variant="secondary" size="small" icon={ArrowTopRightIcon} iconPosition="start">
          Show who I can ask
        </Button>
      </div>
    </Box>
  );
}
