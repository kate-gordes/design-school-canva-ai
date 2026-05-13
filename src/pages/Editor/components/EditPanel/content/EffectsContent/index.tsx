import React, { useState } from 'react';
import { Box, Text, Spacer, Button, Grid } from '@canva/easel';
import { XIcon } from '@canva/easel/icons';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';
import styles from './EffectsContent.module.css';
// Effect thumbnails (reusing available assets as visual stand-ins)
import ShapeShadow from '@/pages/Editor/assets/effects/shape-shadow.webp';
import ShapeGlow from '@/pages/Editor/assets/effects/shape-glow.webp';
import ShapeEcho from '@/pages/Editor/assets/effects/shape-echo.webp';
import ShapeGlitch from '@/pages/Editor/assets/effects/shape-gitch.webp';
import ShapeRadioactive from '@/pages/Editor/assets/effects/shape-radioactive.webp';
import ShapeRetro from '@/pages/Editor/assets/effects/shape-retro.webp';
import ShapeMidnight from '@/pages/Editor/assets/effects/shape-midnight.webp';
import ShapeMalibu from '@/pages/Editor/assets/effects/shape-malibu.webp';
import ShapeChroma from '@/pages/Editor/assets/effects/shape-chroma.webp';
import ShapeDigital from '@/pages/Editor/assets/effects/shape-digital.webp';
import ShapeAura from '@/pages/Editor/assets/effects/shape-aura.webp';
import ShapeVHS from '@/pages/Editor/assets/effects/shape-vhs.webp';
import ShapeSunset from '@/pages/Editor/assets/effects/shape-sunset.webp';
import ShapeMetallic from '@/pages/Editor/assets/effects/shape-metallic.webp';
import ShapeLaser from '@/pages/Editor/assets/effects/shape-laser.webp';

interface EffectsContentProps {
  onClose?: () => void;
}

type EffectId = string;

interface EffectOption {
  id: EffectId;
  label: string;
  src?: string;
}

// Style section (as in screenshot: Shadow, Glow, Echo) – use new shape images
const styleEffects: Array<EffectOption> = [
  { id: 'style-shadow', label: 'Shadow', src: ShapeShadow },
  { id: 'style-glow', label: 'Glow', src: ShapeGlow },
  { id: 'style-echo', label: 'Echo', src: ShapeEcho },
];

// Trendy Effects section (using available thumbnails as close visual stand-ins)
const trendyEffects: Array<EffectOption> = [
  { id: 'trendy-glitch', label: 'Glitch', src: ShapeGlitch },
  { id: 'trendy-radioactive', label: 'Radioactive', src: ShapeRadioactive },
  { id: 'trendy-retro', label: 'Retro', src: ShapeRetro },
  { id: 'trendy-midnight', label: 'Midnight', src: ShapeMidnight },
  { id: 'trendy-malibu', label: 'Malibu', src: ShapeMalibu },
  { id: 'trendy-chroma', label: 'Chroma', src: ShapeChroma },
  { id: 'trendy-digital', label: 'Digital', src: ShapeDigital },
  { id: 'trendy-aura', label: 'Aura', src: ShapeAura },
  { id: 'trendy-vhs', label: 'VHS', src: ShapeVHS },
  { id: 'trendy-sunset', label: 'Sunset', src: ShapeSunset },
  { id: 'trendy-metallic', label: 'Metallic', src: ShapeMetallic },
  { id: 'trendy-laser', label: 'Laser', src: ShapeLaser },
];

import ImageButton from '@/shared_components/ImageButton';

export default function EffectsContent({ onClose }: EffectsContentProps): React.ReactNode {
  const [selectedStyle, setSelectedStyle] = useState<EffectId>('style-shadow');
  const [selectedTrendy, setSelectedTrendy] = useState<EffectId>('trendy-glitch');

  return (
    <Box className={styles.root} height="full">
      {/* Header */}
      <Box padding="2u">
        <Box display="flex" justifyContent="spaceBetween" alignItems="center">
          <Text weight="bold" size="medium">
            Effects
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

      {/* Scrollable content */}
      <Box className={`${sharedStyles.scrollableTabContent} ${styles.scrollArea}`} height="full">
        <Box paddingX="2u">
          <Text weight="bold" size="medium">
            Style
          </Text>
        </Box>
        <Spacer size="2u" />
        <Box paddingX="2u">
          <Grid columns={3} spacingX="1u" spacingY="1u">
            {styleEffects.map(opt => (
              <ImageButton
                key={opt.id}
                label={opt.label}
                src={opt.src}
                selected={selectedStyle === opt.id}
                onClick={() => setSelectedStyle(opt.id)}
              />
            ))}
          </Grid>
        </Box>

        <Spacer size="3u" />

        <Box paddingX="2u">
          <Text weight="bold" size="medium">
            Trendy Effects
          </Text>
        </Box>
        <Spacer size="1u" />
        <Box paddingX="2u">
          <Grid columns={3} spacingX="1u" spacingY="1u">
            {trendyEffects.map(opt => (
              <ImageButton
                key={opt.id}
                label={opt.label}
                src={opt.src}
                selected={selectedTrendy === opt.id}
                onClick={() => setSelectedTrendy(opt.id)}
              />
            ))}
          </Grid>
        </Box>

        <Spacer size="2u" />
      </Box>
    </Box>
  );
}
