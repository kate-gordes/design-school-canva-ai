import React from 'react';
import { Button, Text, Rows } from '@canva/easel';
import styles from './TextStyleButtons.module.css';

interface TextStyleButtonsProps {
  /** Optional click handlers for each button */
  onHeadingClick?: () => void;
  onSubheadingClick?: () => void;
  onBodyClick?: () => void;
}

export default function TextStyleButtons({
  onHeadingClick,
  onSubheadingClick,
  onBodyClick,
}: TextStyleButtonsProps): React.ReactNode {
  return (
    <Rows spacing="1u">
      <Button
        variant="secondary"
        size="large"
        alignment="start"
        onClick={onHeadingClick || (() => console.log('Heading'))}
        className={styles.textStyleButton}
      >
        {/* Raw <h2>: these buttons are a live preview of editor text styles.
            Easel Title applies font-variation-settings + weight 700 which
            would override the bespoke 20px/500 "Heading" preview. */}
        <h2 className={styles.textStyleHeading}>Heading</h2>
      </Button>

      <Button
        variant="secondary"
        size="large"
        alignment="start"
        onClick={onSubheadingClick || (() => console.log('Subheading'))}
        className={styles.textStyleButton}
      >
        {/* Raw <h3>: same preview-typography reason as the <h2> above. */}
        <h3 className={styles.textStyleSubheading}>Subheading</h3>
      </Button>

      <Button
        variant="secondary"
        size="large"
        onClick={onBodyClick || (() => console.log('Body'))}
        alignment="start"
        className={styles.textStyleButton}
      >
        <Text size="medium">Body</Text>
      </Button>
    </Rows>
  );
}
