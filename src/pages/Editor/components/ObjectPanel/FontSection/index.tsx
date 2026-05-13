import React from 'react';
import { Box, Text, Spacer, Button, Rows } from '@canva/easel';
import SeeAll from '@/shared_components/SeeAll';
import styles from './FontSection.module.css';
import sharedStyles from '@/pages/Editor/components/ObjectPanel/ObjectPanel.module.css';

interface FontSectionProps {
  title?: string;
  customHeader?: React.ReactNode;
  onSeeAllClick?: () => void;
  onHeadingClick?: () => void;
  onSubheadingClick?: () => void;
  onBodyClick?: () => void;
}

export default function FontSection({
  title,
  customHeader,
  onSeeAllClick,
  onHeadingClick,
  onSubheadingClick,
  onBodyClick,
}: FontSectionProps): React.ReactNode {
  const headerComponent = customHeader || (
    <Text weight="bold" size="medium" className={sharedStyles.sectionTitle}>
      {title}
    </Text>
  );

  return (
    <div>
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        {headerComponent}
        {onSeeAllClick && <SeeAll onClick={onSeeAllClick} />}
      </Box>

      <Spacer size="1u" />

      {/* Text Style Buttons */}
      <Rows spacing="1u">
        <Button
          variant="secondary"
          size="large"
          alignment="start"
          onClick={onHeadingClick}
          className={styles.textStyleButton}
        >
          <h2 className={styles.textStyleHeading}>Heading</h2>
        </Button>

        <Button
          variant="secondary"
          size="large"
          alignment="start"
          onClick={onSubheadingClick}
          className={styles.textStyleButton}
        >
          <h3 className={styles.textStyleSubheading}>Subheading</h3>
        </Button>

        <Button
          variant="secondary"
          size="large"
          onClick={onBodyClick}
          alignment="start"
          className={styles.textStyleButton}
        >
          <Text size="medium">Body</Text>
        </Button>
      </Rows>
    </div>
  );
}
