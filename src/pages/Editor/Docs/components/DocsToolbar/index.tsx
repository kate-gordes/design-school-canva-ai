import React from 'react';
import { Box, Button } from '@canva/easel';
import { useSignals } from '@preact/signals-react/runtime';
import { MoreHorizontalIcon } from '@canva/easel/icons';
import { activeBlock, activeBlockId, updateBlockType, setAIPanelOpen } from '@/store';
import type { BlockType } from '@/store';
import toolbarStyles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';
import Divider from '@/pages/Editor/components/EditorToolbar/Items/Divider';
import LabelButton from '@/pages/Editor/components/EditorToolbar/Items/LabelButton';
import IconButton from '@/pages/Editor/components/EditorToolbar/Items/IconButton';
import FontButton from '@/pages/Editor/components/EditorToolbar/Items/FontButton';
import SizeInput from '@/pages/Editor/components/EditorToolbar/Items/SizeInput';
import TextBoldButton from '@/pages/Editor/components/EditorToolbar/Items/TextBoldButton';
import TextItalicButton from '@/pages/Editor/components/EditorToolbar/Items/TextItalicButton';
import TextUnderlineButton from '@/pages/Editor/components/EditorToolbar/Items/TextUnderlineButton';
import TextStrikethroughButton from '@/pages/Editor/components/EditorToolbar/Items/TextStrikethroughButton';
import TextLettercaseButton from '@/pages/Editor/components/EditorToolbar/Items/TextLettercaseButton';
import TextAlignCycleButton from '@/pages/Editor/components/EditorToolbar/Items/TextAlignCycleButton';
import ListStyleCycleButton from '@/pages/Editor/components/EditorToolbar/Items/ListStyleCycleButton';
import TextAdvancedSettingsButton from '@/pages/Editor/components/EditorToolbar/Items/TextAdvancedSettingsButton';
import StylesButton from '@/pages/Editor/components/EditorToolbar/Items/StylesButton';
import NavCanvaAIIconActive from '@/shared_components/icons/NavCanvaAIIconActive';
import styles from './DocsToolbar.module.css';

const BLOCK_TYPE_FONT_SIZE: Record<BlockType, number> = {
  h1: 32,
  h2: 24,
  h3: 20,
  paragraph: 16,
  bullet: 16,
  numbered: 16,
  quote: 16,
};

const FONT_SIZE_TO_BLOCK_TYPE: Array<{ size: number; type: BlockType }> = [
  { size: 32, type: 'h1' },
  { size: 24, type: 'h2' },
  { size: 20, type: 'h3' },
  { size: 16, type: 'paragraph' },
];

function closestBlockType(size: number): BlockType {
  let closest = FONT_SIZE_TO_BLOCK_TYPE[0];
  let minDiff = Math.abs(size - closest.size);
  for (const entry of FONT_SIZE_TO_BLOCK_TYPE) {
    const diff = Math.abs(size - entry.size);
    if (diff < minDiff) {
      minDiff = diff;
      closest = entry;
    }
  }
  return closest.type;
}

export default function DocsToolbar(): React.ReactNode {
  useSignals();

  const block = activeBlock.value;
  const blockId = activeBlockId.value;
  const blockType = block?.blockType ?? 'paragraph';
  const fontSize = BLOCK_TYPE_FONT_SIZE[blockType];

  const handleH1Click = () => {
    if (!blockId) return;
    updateBlockType(blockId, blockType === 'h1' ? 'paragraph' : 'h1');
  };

  const handleH2Click = () => {
    if (!blockId) return;
    updateBlockType(blockId, blockType === 'h2' ? 'paragraph' : 'h2');
  };

  const handleFontSizeChange = (newSize: number) => {
    if (!blockId) return;
    const newType = closestBlockType(newSize);
    if (newType !== blockType) {
      updateBlockType(blockId, newType);
    }
  };

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      className={toolbarStyles.toolbarInline}
      data-toolbar-inline="true"
    >
      {/* Ask Canva */}
      <LabelButton
        ariaLabel="Ask Canva"
        onClick={() => setAIPanelOpen(true)}
        label="Ask Canva"
        startIcon={<NavCanvaAIIconActive size={20} />}
        dataToolbarKey="ask-canva"
      />

      <Divider />

      {/* H1 toggle */}
      <Button
        variant="secondary"
        size="medium"
        className={styles.headingButton}
        ariaLabel="Heading 1"
        onClick={handleH1Click}
        pressed={blockType === 'h1'}
      >
        H1
      </Button>

      {/* H2 toggle */}
      <Button
        variant="secondary"
        size="medium"
        className={styles.headingButton}
        ariaLabel="Heading 2"
        onClick={handleH2Click}
        pressed={blockType === 'h2'}
      >
        H2
      </Button>

      {/* Font dropdown */}
      <FontButton
        onClick={() => {
          window.dispatchEvent(new CustomEvent('open-edit-panel-text'));
        }}
      />

      {/* Font size stepper */}
      <SizeInput value={fontSize} onChange={handleFontSizeChange} />

      {/* Same items as TextToolbar */}
      <TextBoldButton />
      <TextItalicButton />
      <TextUnderlineButton />
      <TextStrikethroughButton />
      <TextLettercaseButton />
      <TextAlignCycleButton />
      <ListStyleCycleButton />
      <TextAdvancedSettingsButton />

      <Divider />
      <StylesButton />

      <Divider />

      {/* More (...) overflow menu */}
      <IconButton
        ariaLabel="More options"
        onClick={() => console.log('More options')}
        dataToolbarKey="more"
      >
        <MoreHorizontalIcon size="medium" />
      </IconButton>
    </Box>
  );
}
