import { Box, Rows } from '@canva/easel';
import TextStyleRow from '@/pages/home/Brand/components/BrandComponents/TextStyleRow';
import useIsMobile from '@/hooks/useIsMobile';
import { useState } from 'react';

export interface TextStyleItem {
  id: string;
  type: string;
  name: string;
  fontFamily?: string;
  fontSize: number;
  fontWeight?: number;
  fontStyle?: 'normal' | 'italic';
  isDefault?: boolean;
}

export interface TextStyleListProps {
  /** Array of text styles */
  textStyles: TextStyleItem[];
  /** Whether styles are editable */
  editable?: boolean;
  /** Callback when text styles are updated */
  onTextStylesChange?: (textStyles: TextStyleItem[]) => void;
  /** Optional footer component (e.g., "Manage uploaded fonts") */
  footer?: React.ReactNode;
}

// Logarithmic scaling to map actual font sizes (12-96px) to display sizes (16-24px)
function calculateDisplaySize(fontSize: number, minSize: number, maxSize: number): number {
  if (minSize === maxSize) return 20; // Default middle value

  const MIN_DISPLAY = 16;
  const MAX_DISPLAY = 24;

  // Logarithmic proportion
  const proportion = Math.log(fontSize / minSize) / Math.log(maxSize / minSize);

  return MIN_DISPLAY + proportion * (MAX_DISPLAY - MIN_DISPLAY);
}

export default function TextStyleList({
  textStyles: initialStyles,
  editable = true,
  onTextStylesChange,
  footer,
}: TextStyleListProps) {
  const isMobile = useIsMobile();
  const [textStyles, setTextStyles] = useState(initialStyles);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const updateStyles = (newStyles: TextStyleItem[]) => {
    setTextStyles(newStyles);
    onTextStylesChange?.(newStyles);
  };

  const handleDelete = (id: string, name: string) => {
    const confirmed = confirm(`Delete "${name}" text style?`);
    if (confirmed) {
      const updated = textStyles.filter(s => s.id !== id);
      updateStyles(updated);
      if (selectedId === id) setSelectedId(undefined);
    }
  };

  const handleRowClick = (id: string) => {
    if (!editable) return;
    // Toggle selection
    setSelectedId(selectedId === id ? undefined : id);
  };

  const handleSave = (id: string) => {
    // In a full implementation, this would save changes
    console.log('Saved:', id);
    setSelectedId(undefined);
  };

  const handleDiscard = (id: string) => {
    console.log('Discarded changes for:', id);
    setSelectedId(undefined);
  };

  // Calculate display sizes for all text styles
  const fontSizes = textStyles.map(s => s.fontSize);
  const minFontSize = Math.min(...fontSizes);
  const maxFontSize = Math.max(...fontSizes);

  return (
    <Box width="full" paddingX={isMobile ? '2u' : '0'}>
      <Rows spacing="1.5u">
        {textStyles.map(style => {
          const displaySize = calculateDisplaySize(style.fontSize, minFontSize, maxFontSize);
          const isSelected = selectedId === style.id;

          return (
            <TextStyleRow
              key={style.id}
              name={style.name}
              fontFamily={style.fontFamily}
              displaySize={displaySize}
              fontWeight={style.fontWeight}
              fontStyle={style.fontStyle}
              isDefault={style.isDefault}
              isSelected={isSelected}
              editable={editable}
              onClick={() => handleRowClick(style.id)}
              onDelete={() => handleDelete(style.id, style.name)}
              onSave={() => handleSave(style.id)}
              onDiscard={() => handleDiscard(style.id)}
            />
          );
        })}
        {footer}
      </Rows>
    </Box>
  );
}
