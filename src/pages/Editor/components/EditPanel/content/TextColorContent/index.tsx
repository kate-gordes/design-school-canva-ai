import React, { useState } from 'react';
import { Box, Text, Spacer, Button, Rows } from '@canva/easel';
import { XIcon, PrintDocumentIcon, PaletteIcon, GradientIcon } from '@canva/easel/icons';
import SeeAll from '@/shared_components/SeeAll';
import BrandKitButton from '@/pages/Home/Brand/components/BrandKitButton';
import { RegularSearch } from '@/shared_components/Search';
import styles from './TextColorContent.module.css';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';
import SwatchButton from '@/shared_components/SwatchButton';

interface TextColorContentProps {
  onClose?: () => void;
  title?: string;
}

function randomHex(): string {
  const n = Math.floor(Math.random() * 0xffffff);
  return `#${n.toString(16).padStart(6, '0')}`;
}

const generateColors = (count: number): string[] =>
  Array.from({ length: count }, () => randomHex());

// Commonly used design colors for text and backgrounds (18 total)
const PresetColors = {
  common: [
    '#000000', // Black
    '#111827', // Gray-900
    '#374151', // Gray-700
    '#6B7280', // Gray-500
    '#9CA3AF', // Gray-400
    '#D1D5DB', // Gray-300
    '#FFFFFF', // White
    '#0EA5E9', // Sky-500
    '#2563EB', // Blue-600
    '#3B82F6', // Blue-500
    '#22D3EE', // Cyan-400
    '#10B981', // Emerald-500
    '#F59E0B', // Amber-500
    '#F97316', // Orange-500
    '#EF4444', // Red-500
    '#8B5CF6', // Violet-500
    '#EC4899', // Pink-500
    '#059669', // Green-600
  ] as string[],
};

export default function TextColorContent({
  onClose,
  title,
}: TextColorContentProps): React.ReactNode {
  const [query, setQuery] = useState('');
  const [scrolled] = useState(false);
  const documentColors = PresetColors.common;

  // Split colors into rows of N
  const chunk = <T,>(arr: T[], size: number): T[][] =>
    arr.reduce((acc: T[][], cur, idx) => {
      const row = Math.floor(idx / size);
      if (!acc[row]) acc[row] = [];
      acc[row].push(cur);
      return acc;
    }, []);

  return (
    <Box className={styles.root} height="full">
      {/* Header with title + close */}
      <Box padding="2u">
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <Text weight="bold" size="medium">
            {title ?? 'Text color'}
          </Text>
          {onClose && (
            <Button
              variant="tertiary"
              size="small"
              icon={() => <XIcon size="medium" />}
              onClick={onClose}
            />
          )}
        </Box>
      </Box>

      {/* Search */}
      <Box paddingX="2u">
        <RegularSearch value={query} onChange={setQuery} placeholder={'Try "blue" or "#00c4cc"'} />
      </Box>
      <Spacer size="2u" />

      {/* Scrollable area starts here */}
      <Box className={`${sharedStyles.scrollableTabContent} ${styles.scrollArea}`} height="full">
        {/* Plain div: sticky scroll-divider overlay (Easel Box would wipe the opacity transition + sticky positioning styling). */}
        <div className={`${styles.scrollDivider} ${scrolled ? styles.visible : ''}`} />
        {/* Plain div: sticky scroll-divider overlay (Easel Box would wipe the opacity transition + sticky positioning styling). */}
        <div className={`${styles.scrollDivider} ${scrolled ? styles.visible : ''}`} />

        {/* Document colors grid */}
        <Box paddingX="2u">
          <Box display="flex" alignItems="center">
            <PrintDocumentIcon size="medium" />
            <Spacer size="1u" />
            <Text weight="bold" size="medium">
              Document colors
            </Text>
          </Box>
          <Spacer size="1u" />
          <Rows spacing="1u">
            {chunk(documentColors, 7).map((row, rIdx) => (
              <Box key={`row-${rIdx}`} display="flex" alignItems="center">
                {row.map((color, cIdx) => (
                  <React.Fragment key={`${color}-${rIdx}-${cIdx}`}>
                    <SwatchButton
                      color={color}
                      ariaLabel={`Pick ${color}`}
                      onClick={() => console.log('pick', color)}
                    />
                    {cIdx < row.length - 1 && <Spacer size="1u" />}
                  </React.Fragment>
                ))}
              </Box>
            ))}
          </Rows>
          <Spacer size="2u" />
        </Box>

        {/* Canva Brand Kit sections with circular swatches */}
        <Box paddingX="2u">
          <BrandKitButton />
          <Spacer size="1u" />

          <Text tone="secondary" size="small">
            Canva Glow Up – Primary Palette
          </Text>
          <Spacer size="1u" />
          <Box display="flex" alignItems="center">
            {generateColors(5).map((color, i) => (
              <React.Fragment key={`primary-${i}`}>
                <SwatchButton color={color} ariaLabel={`Pick ${color}`} />
                {i < 4 && <Spacer size="1u" />}
              </React.Fragment>
            ))}
          </Box>

          <Spacer size="2u" />
          <Text tone="secondary" size="small">
            Canva Glow Up – Secondary Solid Palette
          </Text>
          <Spacer size="1u" />
          <Box display="flex" alignItems="center">
            {generateColors(7).map((color, i) => (
              <React.Fragment key={`solid-${i}`}>
                <SwatchButton color={color} ariaLabel={`Pick ${color}`} />
                {i < 6 && <Spacer size="1u" />}
              </React.Fragment>
            ))}
          </Box>

          <Spacer size="2u" />
          <Text tone="secondary" size="small">
            Canva Glow Up – Secondary Gradient Palette
          </Text>
          <Spacer size="1u" />
          <Box display="flex" alignItems="center">
            {generateColors(6).map((color, i) => (
              <React.Fragment key={`grad-${i}`}>
                <SwatchButton color={color} ariaLabel={`Pick ${color}`} />
                {i < 5 && <Spacer size="1u" />}
              </React.Fragment>
            ))}
          </Box>

          <Spacer size="2u" />
          <Text tone="secondary" size="small">
            Canva Glow Up – Secondary Gradient Reverse Palette
          </Text>
          <Spacer size="1u" />
          <Box display="flex" alignItems="center">
            {generateColors(6)
              .reverse()
              .map((color, i) => (
                <React.Fragment key={`grad-rev-${i}`}>
                  <SwatchButton color={color} ariaLabel={`Pick ${color}`} />
                  {i < 5 && <Spacer size="1u" />}
                </React.Fragment>
              ))}
          </Box>

          <Spacer size="2u" />
          <Text tone="secondary" size="small">
            Canva Glow Up – Tertiary Solid Palette
          </Text>
          <Spacer size="1u" />
          <Box display="flex" alignItems="center">
            {generateColors(6).map((color, i) => (
              <React.Fragment key={`tertiary-${i}`}>
                <SwatchButton color={color} ariaLabel={`Pick ${color}`} />
                {i < 5 && <Spacer size="1u" />}
              </React.Fragment>
            ))}
          </Box>

          <Spacer size="2u" />
          <Text tone="secondary" size="small">
            Neutral Palette
          </Text>
          <Spacer size="1u" />
          <Box display="flex" alignItems="center">
            {['#000000', '#4b5563', '#d1d5db', '#e5e7eb', '#f3f4f6'].map((color, i) => (
              <React.Fragment key={`neutral-${i}`}>
                <SwatchButton color={color} ariaLabel={`Pick ${color}`} />
                {i < 4 && <Spacer size="1u" />}
              </React.Fragment>
            ))}
          </Box>

          <Spacer size="3u" />
          <Box display="flex" justifyContent="spaceBetween" alignItems="center">
            <Box display="flex" alignItems="center">
              <PaletteIcon size="medium" />
              <Spacer size="1u" />
              <Text weight="bold">Default solid colors</Text>
            </Box>
            <SeeAll />
          </Box>
          <Spacer size="1u" />
          <Rows spacing="1u">
            {chunk(generateColors(7 * 4), 7).map((row, i) => (
              <Box key={`solid-row-${i}`} display="flex" alignItems="center">
                {row.map((color, j) => (
                  <React.Fragment key={`solid-${i}-${j}`}>
                    <SwatchButton color={color} ariaLabel={`Pick ${color}`} />
                    {j < row.length - 1 && <Spacer size="1u" />}
                  </React.Fragment>
                ))}
              </Box>
            ))}
          </Rows>

          <Spacer size="3u" />
          <Box display="flex" justifyContent="spaceBetween" alignItems="center">
            <Box display="flex" alignItems="center">
              <GradientIcon size="medium" />
              <Spacer size="1u" />
              <Text weight="bold">Default gradient colors</Text>
            </Box>
            <SeeAll />
          </Box>
          <Spacer size="1u" />
          <Rows spacing="1u">
            {chunk(generateColors(7 * 3), 7).map((row, i) => (
              <Box key={`grad-row-${i}`} display="flex" alignItems="center">
                {row.map((color, j) => (
                  <React.Fragment key={`grad-${i}-${j}`}>
                    <SwatchButton color={color} ariaLabel={`Pick ${color}`} />
                    {j < row.length - 1 && <Spacer size="1u" />}
                  </React.Fragment>
                ))}
              </Box>
            ))}
          </Rows>
        </Box>
      </Box>
    </Box>
  );
}
