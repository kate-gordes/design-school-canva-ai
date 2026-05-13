// Copyright 2024 Canva Inc. All Rights Reserved.

import { Text, ChevronRightIcon, OpenInNewIcon, Spacer } from '@canva/easel';
import styles from './AppCardTitle.module.css';

// Simple classNames utility function
const classNames = (...classes: (string | undefined | null | boolean)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export type AppCardTitleProps = {
  title: string;
  textColor: 'light' | 'dark';
  feature?: boolean;
  isLink?: boolean;
  size?: 'small' | 'medium' | 'large';
  weight?: 'regular' | 'bold';
  lineClamp?: number;
};

export const AppCardTitle = ({
  title,
  textColor,
  lineClamp = 2,
  feature = false,
  isLink = false,
  size = 'medium',
  weight = 'regular',
}: AppCardTitleProps) => {
  const textStyle = classNames(
    styles.text,
    textColor === 'dark' ? styles.darkText : styles.lightText,
    feature ? styles.featureText : styles.baseText,
  );

  return (
    <Text className={textStyle} lineClamp={lineClamp} size={size} weight={weight}>
      {title}
      <span aria-hidden={true} className={styles.iconContainer}>
        <span className={styles.nbsp}>&nbsp;</span>
        {isLink ? (
          <>
            <Spacer direction="horizontal" size="1u" />
            <OpenInNewIcon size="small" />
          </>
        ) : (
          <ChevronRightIcon size="medium" />
        )}
      </span>
    </Text>
  );
};
