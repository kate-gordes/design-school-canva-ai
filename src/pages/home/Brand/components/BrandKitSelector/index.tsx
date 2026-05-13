import React, { useCallback } from 'react';
import { Box, Select, Text, Rows } from '@canva/easel';
import { useAppContext } from '@/hooks/useAppContext';
import { getAllBrandKitNames, getBrandKitLogo, getBrandKitImageUrl } from '@/pages/home/Brand/data';
import CanvaLogoIcon from '@/shared_components/icons/CanvaLogoIcon';
import styles from './BrandKitSelector.module.css';

interface BrandKitSelectorProps {
  /** Whether to show the label */
  showLabel?: boolean;
  /** Custom label text */
  label?: string;
}

function BrandKitIcon({ name }: { name: string }) {
  const logoUrl = getBrandKitLogo(name);
  if (logoUrl) {
    return (
      <img src={getBrandKitImageUrl(logoUrl)} alt={`${name} logo`} className={styles.optionLogo} />
    );
  }
  return <CanvaLogoIcon size={32} />;
}

export default function BrandKitSelector({
  showLabel = true,
  label = 'Brand Kit',
}: BrandKitSelectorProps): React.ReactNode {
  const { selectedBrandKit, setSelectedBrandKit } = useAppContext();
  const availableBrandKits = getAllBrandKitNames();

  const handleBrandKitChange = (value: string) => {
    setSelectedBrandKit(value);
  };

  const options = availableBrandKits.map(name => ({
    label: name,
    value: name,
  }));

  const getLabel = useCallback(
    (option: { label?: string; value: string }) => (
      <span className={styles.triggerContent}>
        <BrandKitIcon name={option.value} />
        <span>{option.label ?? option.value}</span>
      </span>
    ),
    [],
  );

  const selectProps = {
    value: selectedBrandKit,
    onChange: handleBrandKitChange,
    options,
    placeholder: 'Select a brand kit',
    className: styles.select,
    searchable: true,
    stretch: true,
    getLabel,
    Icon: 'none' as const,
  };

  return (
    <Box className={styles.container}>
      {showLabel ? (
        <Rows spacing="1u">
          <Text size="small" tone="secondary" weight="bold">
            {label}
          </Text>
          <Select {...selectProps} />
        </Rows>
      ) : (
        <Select {...selectProps} />
      )}
    </Box>
  );
}
