// Loading-state wrapper: gradient+spritesheet avatar (AiLoadingSwirl) next to
// shimmering "Thinking…" text. Shimmer styles ported from monorepo
//   web/src/ui/assistant/magic_assistant/branded_shimmering_text/shimmering_text.css
import { Box, Inline, Text } from '@canva/easel';
import AiLoadingSwirl from './AiLoadingSwirl';
import styles from './BrandedShimmeringText.module.css';

interface BrandedShimmeringTextProps {
  message?: string;
}

export function BrandedShimmeringText({ message = 'Thinking…' }: BrandedShimmeringTextProps) {
  return (
    <Box className={styles.container}>
      <Inline spacing="1u" alignY="center">
        <AiLoadingSwirl />
        <Text tone="tertiary">
          <span className={styles.shineEffect}>{message}</span>
        </Text>
      </Inline>
    </Box>
  );
}
