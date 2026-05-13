import { Box, Rows } from '@canva/easel';
import ColorPalette, {
  type ColorItem,
} from '@/pages/home/Brand/components/BrandComponents/ColorPalette';
import useIsMobile from '@/hooks/useIsMobile';
import { useState } from 'react';

export interface ColorPaletteData {
  id: string;
  name?: string;
  colors: ColorItem[];
}

export interface ColorPaletteListProps {
  /** Array of color palettes */
  palettes: ColorPaletteData[];
  /** Whether to show labels under swatches */
  showLabels?: boolean;
  /** Whether palettes are editable */
  editable?: boolean;
  /** Callback when palettes are updated */
  onPalettesChange?: (palettes: ColorPaletteData[]) => void;
  /** Callback when a color is clicked (for copy to clipboard) */
  onColorClick?: (color: ColorItem, paletteId: string) => void;
}

export default function ColorPaletteList({
  palettes: initialPalettes,
  showLabels = false,
  editable = true,
  onPalettesChange,
  onColorClick,
}: ColorPaletteListProps) {
  const isMobile = useIsMobile();
  const [palettes, setPalettes] = useState(initialPalettes);

  const updatePalettes = (newPalettes: ColorPaletteData[]) => {
    setPalettes(newPalettes);
    onPalettesChange?.(newPalettes);
  };

  const handleNameChange = (paletteId: string, newName: string) => {
    const updated = palettes.map(p => (p.id === paletteId ? { ...p, name: newName } : p));
    updatePalettes(updated);
  };

  const handleColorDelete = (paletteId: string, colorId: string) => {
    const updated = palettes.map(p =>
      p.id === paletteId ? { ...p, colors: p.colors.filter(c => c.id !== colorId) } : p,
    );
    updatePalettes(updated);
  };

  const handleAddColor = (paletteId: string) => {
    // Generate random color
    const randomHex =
      '#'
      + Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');
    const newColor: ColorItem = {
      id: `color-${Date.now()}`,
      hex: randomHex,
    };

    const updated = palettes.map(p =>
      p.id === paletteId ? { ...p, colors: [...p.colors, newColor] } : p,
    );
    updatePalettes(updated);
  };

  const handlePaletteMenu = (paletteId: string) => {
    // Simple implementation - could add delete, duplicate, reorder
    const action = confirm('Delete this palette?');
    if (action) {
      const updated = palettes.filter(p => p.id !== paletteId);
      updatePalettes(updated);
    }
  };

  return (
    <Box width="full" paddingX={isMobile ? '2u' : '0'}>
      <Rows spacing="4u">
        {palettes.map(palette => (
          <ColorPalette
            key={palette.id}
            name={palette.name}
            colors={palette.colors}
            showLabels={showLabels}
            editable={editable}
            onNameChange={newName => handleNameChange(palette.id, newName)}
            onColorClick={onColorClick ? color => onColorClick(color, palette.id) : undefined}
            onColorDelete={colorId => handleColorDelete(palette.id, colorId)}
            onAddColor={() => handleAddColor(palette.id)}
            onMenuClick={() => handlePaletteMenu(palette.id)}
          />
        ))}
      </Rows>
    </Box>
  );
}
