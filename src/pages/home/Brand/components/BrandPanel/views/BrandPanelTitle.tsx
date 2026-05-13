import React, { useContext } from 'react';
import { Text } from '@canva/easel';
import { ArrowLeftIcon } from '@canva/easel/icons';
import { MobileBrandBackContext } from '@/contexts/MobileBrandBackContext';
import styles from '../BrandViews.module.css';

interface BrandPanelTitleProps {
  children: React.ReactNode;
}

export default function BrandPanelTitle({ children }: BrandPanelTitleProps): React.ReactNode {
  const backCtx = useContext(MobileBrandBackContext);

  if (backCtx) {
    if (backCtx.hideTitle) return null;
    return (
      <button className={styles.mobileBrandTitleBack} onClick={backCtx.onBack}>
        <ArrowLeftIcon size="medium" />
        <Text weight="bold" size="medium" className={styles.sectionTitle}>
          {children}
        </Text>
      </button>
    );
  }

  return (
    <Text weight="bold" size="medium" className={styles.sectionTitle}>
      {children}
    </Text>
  );
}

interface BrandSectionTitleProps {
  children: React.ReactNode;
}

export function BrandSectionTitle({ children }: BrandSectionTitleProps): React.ReactNode {
  return (
    <Text weight="bold" size="medium" className={styles.sectionTitle}>
      {children}
    </Text>
  );
}
