import { Box, Rows, Inline, Text, Button } from '@canva/easel';
import { MoreHorizontalIcon, PencilIcon } from '@canva/easel/icons';
import ColorSwatch from '@/pages/home/Brand/components/BrandComponents/ColorSwatch';
import AddColorButton from '@/pages/home/Brand/components/BrandComponents/AddColorButton';
import useIsMobile from '@/hooks/useIsMobile';
import styles from './ColorPalette.module.css';

export interface ColorItem {
  id: string;
  hex: string;
  name?: string;
}

export interface ColorPaletteProps {
  /** Palette name */
  name?: string;
  /** Array of colors in the palette */
  colors: ColorItem[];
  /** Whether to show labels under swatches */
  showLabels?: boolean;
  /** Whether the palette is editable */
  editable?: boolean;
  /** Callback when palette name is edited */
  onNameChange?: (name: string) => void;
  /** Callback when a color is clicked (copy to clipboard) */
  onColorClick?: (color: ColorItem) => void;
  /** Callback when a color is deleted */
  onColorDelete?: (colorId: string) => void;
  /** Callback when "Add new" is clicked */
  onAddColor?: () => void;
  /** Callback when palette menu is clicked */
  onMenuClick?: () => void;
}

export default function ColorPalette({
  name = 'Color palette',
  colors,
  showLabels = false,
  editable = true,
  onNameChange,
  onColorClick,
  onColorDelete,
  onAddColor,
  onMenuClick,
}: ColorPaletteProps) {
  const isMobile = useIsMobile();
  return (
    <Box width="full" className={styles.paletteContainer}>
      <Rows spacing={isMobile ? '0.5u' : '1u'}>
        {/* Palette Header */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="spaceBetween"
          paddingBottom={isMobile ? '0' : '1u'}
        >
          <Box display="flex" alignItems="center" className={styles.nameContainer}>
            <Text size="large" weight="bold">
              {name}
            </Text>
            {editable && onNameChange && (
              <Button
                variant="tertiary"
                icon={PencilIcon}
                aria-label="Edit palette name"
                onClick={() => {
                  const newName = prompt('Enter palette name:', name);
                  if (newName) onNameChange(newName);
                }}
                className={styles.editButton}
              />
            )}
          </Box>
          {editable && onMenuClick && (
            <Button
              variant="tertiary"
              icon={MoreHorizontalIcon}
              aria-label="Palette options"
              onClick={onMenuClick}
            />
          )}
        </Box>

        {/* Swatches */}
        <Box border="low" borderRadius="baseUnit" padding="4u" className={styles.swatchGrid}>
          <Inline spacing="3u" alignY="top">
            {colors.map(color => (
              <ColorSwatch
                key={color.id}
                color={color.hex}
                name={color.name}
                showLabel={showLabels}
                onClick={onColorClick ? () => onColorClick(color) : undefined}
                onDelete={editable && onColorDelete ? () => onColorDelete(color.id) : undefined}
              />
            ))}
            {editable && onAddColor && (
              <AddColorButton onClick={onAddColor} showLabel={showLabels} />
            )}
          </Inline>
        </Box>
      </Rows>
    </Box>
  );
}
