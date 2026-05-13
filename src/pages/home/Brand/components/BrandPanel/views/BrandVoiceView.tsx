import React, { useState, useMemo } from 'react';
import { Box, Button, Rows, Text, Spacer } from '@canva/easel';
import BrandPanelTitle from './BrandPanelTitle';
import { MagicPencilIcon } from '@canva/easel/icons';
import { useAppContext } from '@/hooks/useAppContext';
import { getCategory } from '@/pages/home/Brand/data';
import styles from '@/pages/home/Brand/components/BrandPanel/BrandViews.module.css';

interface BrandVoiceViewProps {
  onShowAllFolders?: (folders: any[]) => void;
}

const BRAND_VOICE_TITLE = 'Think of Canva like a person';
const BRAND_VOICE_FULL_TEXT =
  'We have a core personality that stays true to who we are, no matter the audience, channel, or moment. Our voice is confident but never arrogant — warm but never fluffy. We speak simply and directly, making complex things feel easy and approachable.';

export default function BrandVoiceView(_props: BrandVoiceViewProps = {}): React.ReactNode {
  const { brandKitData } = useAppContext();
  const [expanded, setExpanded] = useState(false);

  const brandVoiceCategory = useMemo(() => {
    return getCategory(brandKitData, 'Brand Voice');
  }, [brandKitData]);

  const hasBrandVoice = brandVoiceCategory && brandVoiceCategory.assetCount > 0;

  const truncatedText = BRAND_VOICE_FULL_TEXT.slice(0, 52) + '…';

  return (
    <Box width="full">
      <BrandPanelTitle>Brand voice</BrandPanelTitle>
      <Spacer direction="horizontal" size="3u" />
      <Rows spacing="2u">
        {hasBrandVoice ? (
          <>
            <Box className={styles.brandVoiceBox} padding="1.5u">
              <Text weight="bold" size="medium">
                {BRAND_VOICE_TITLE}
              </Text>
              <Spacer direction="horizontal" size="1u" />
              <Text tone="secondary" size="medium">
                {expanded ? BRAND_VOICE_FULL_TEXT : truncatedText}
              </Text>
              {!expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#8b3dff',
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  Show more
                </button>
              )}
            </Box>
            <Button
              variant="secondary"
              icon={MagicPencilIcon}
              stretch={true}
              onClick={() => console.log('Generate in brand voice')}
            >
              Generate in this brand voice
            </Button>
          </>
        ) : (
          <Box padding="3u">
            <Text tone="secondary">No brand voice available in this brand kit.</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
}
