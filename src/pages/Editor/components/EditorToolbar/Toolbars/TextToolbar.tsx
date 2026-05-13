import React, { useState } from 'react';
import { Box } from '@canva/easel';
import {
  TransparencyIcon,
  AnimationMoveIcon,
  PaintRollerIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  LettercaseIcon,
  TextAlignLeftIcon,
  ListBulletLtrIcon,
} from '@canva/easel/icons';
import AskCanvaButton from '@/pages/Editor/components/EditorToolbar/Items/AskCanvaButton';
import TextAdvancedSettingsButton from '@/pages/Editor/components/EditorToolbar/Items/TextAdvancedSettingsButton';
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';
// LabelIconButton is used inside specific items, not directly here
import Divider from '@/pages/Editor/components/EditorToolbar/Items/Divider';
import FontButton from '@/pages/Editor/components/EditorToolbar/Items/FontButton';
import SizeInput from '@/pages/Editor/components/EditorToolbar/Items/SizeInput';
import TextColorButton from '@/pages/Editor/components/EditorToolbar/Items/TextColorButton';
import TextAlignCycleButton from '@/pages/Editor/components/EditorToolbar/Items/TextAlignCycleButton';
import ListStyleCycleButton from '@/pages/Editor/components/EditorToolbar/Items/ListStyleCycleButton';
import TextBoldButton from '@/pages/Editor/components/EditorToolbar/Items/TextBoldButton';
import TextItalicButton from '@/pages/Editor/components/EditorToolbar/Items/TextItalicButton';
import TextUnderlineButton from '@/pages/Editor/components/EditorToolbar/Items/TextUnderlineButton';
import TextStrikethroughButton from '@/pages/Editor/components/EditorToolbar/Items/TextStrikethroughButton';
import TextLettercaseButton from '@/pages/Editor/components/EditorToolbar/Items/TextLettercaseButton';
import EffectsLabelButton from '@/pages/Editor/components/EditorToolbar/Items/EffectsLabelButton';
import AnimateLabelButton from '@/pages/Editor/components/EditorToolbar/Items/AnimateLabelButton';
import PositionLabelButton from '@/pages/Editor/components/EditorToolbar/Items/PositionLabelButton';
import TextTransparencyButton from '@/pages/Editor/components/EditorToolbar/Items/TextTransparencyButton';
import StylesButton from '@/pages/Editor/components/EditorToolbar/Items/StylesButton';

// FontOption moved inside FontButton item

type Props = { hiddenKeys: string[] };

export default function TextToolbar({ hiddenKeys }: Props): React.ReactElement {
  // font options are handled inside the FontButton item

  // font selection state is handled inside the FontButton item
  const [fontSize, setFontSize] = useState<number>(107);

  // Overflow is fully managed by the generic EditorToolbar; this component only renders items

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      className={styles.toolbarInline}
      data-toolbar-inline="true"
    >
      <AskCanvaButton />
      <Divider />

      <FontButton
        onClick={() => {
          const event = new CustomEvent('open-edit-panel-text');
          window.dispatchEvent(event);
        }}
      />

      <SizeInput value={fontSize} onChange={setFontSize} />

      <TextColorButton />
      <TextBoldButton />
      <TextItalicButton />
      <TextUnderlineButton />
      <TextStrikethroughButton />
      <TextLettercaseButton />
      <TextAlignCycleButton />
      <ListStyleCycleButton />
      <TextAdvancedSettingsButton />

      <Divider />
      <TextTransparencyButton />
      <Divider />
      <EffectsLabelButton />
      <Divider />
      <AnimateLabelButton />
      <Divider />
      <PositionLabelButton />
      <Divider />
      <StylesButton />
    </Box>
  );
}
