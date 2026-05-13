import React, { useState } from 'react';
import { Box } from '@canva/easel';
// Text advanced settings icon handled inside specific item
import styles from '@/pages/Editor/components/EditorToolbar/EditorToolbar.module.css';
import TextAlignCycleButton from '@/pages/Editor/components/EditorToolbar/Items/TextAlignCycleButton';
import ListStyleCycleButton from '@/pages/Editor/components/EditorToolbar/Items/ListStyleCycleButton';
import Divider from '@/pages/Editor/components/EditorToolbar/Items/Divider';
import AskCanvaButton from '@/pages/Editor/components/EditorToolbar/Items/AskCanvaButton';
import TextAdvancedSettingsButton from '@/pages/Editor/components/EditorToolbar/Items/TextAdvancedSettingsButton';
import FontButton from '@/pages/Editor/components/EditorToolbar/Items/FontButton';
import SizeInput from '@/pages/Editor/components/EditorToolbar/Items/SizeInput';
import FillColorButton from '@/pages/Editor/components/EditorToolbar/Items/FillColorButton';
import BorderWeightButton from '@/pages/Editor/components/EditorToolbar/Items/BorderWeightButton';
import CornerRadiusButton from '@/pages/Editor/components/EditorToolbar/Items/CornerRadiusButton';
import TextColorButton from '@/pages/Editor/components/EditorToolbar/Items/TextColorButton';
import TextBoldButton from '@/pages/Editor/components/EditorToolbar/Items/TextBoldButton';
import TextItalicButton from '@/pages/Editor/components/EditorToolbar/Items/TextItalicButton';
import TextUnderlineButton from '@/pages/Editor/components/EditorToolbar/Items/TextUnderlineButton';
import TextStrikethroughButton from '@/pages/Editor/components/EditorToolbar/Items/TextStrikethroughButton';
import TextLettercaseButton from '@/pages/Editor/components/EditorToolbar/Items/TextLettercaseButton';
import AnimateLabelButton from '@/pages/Editor/components/EditorToolbar/Items/AnimateLabelButton';
import EffectsLabelButton from '@/pages/Editor/components/EditorToolbar/Items/EffectsLabelButton';
import PositionLabelButton from '@/pages/Editor/components/EditorToolbar/Items/PositionLabelButton';
import TextTransparencyButton from '@/pages/Editor/components/EditorToolbar/Items/TextTransparencyButton';
import StylesButton from '@/pages/Editor/components/EditorToolbar/Items/StylesButton';
import EditShapeButton from '@/pages/Editor/components/EditorToolbar/Items/EditShapeButton';

// Props are minimal: only which keys parent wants hidden
type Props = {
  hiddenKeys: string[];
};

export default function TextToolbar({ hiddenKeys }: Props): React.ReactElement {
  const [fontSize, setFontSize] = useState<number>(107);

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      className={styles.toolbarInline}
      data-toolbar-inline="true"
    >
      <AskCanvaButton />
      <Divider />

      {/* Shape extras: Edit, Fill, Border, Corners, divider */}
      <Box display="inline-flex" alignItems="center" className={styles.iconRow}>
        <EditShapeButton />
        <Divider />
        <FillColorButton />
        <BorderWeightButton />
        <CornerRadiusButton />
        <Divider />
      </Box>

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
