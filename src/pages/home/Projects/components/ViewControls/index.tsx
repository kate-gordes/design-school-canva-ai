import React, { useState, useEffect } from 'react';
import { Button } from '@canva/easel';
import { GridViewIcon, ListBulletLtrIcon } from '@canva/easel/icons';
import styles from './ViewControls.module.css';

export type ViewType = 'grid' | 'list';

export interface ViewControlsProps {
  /**
   * Current view type
   */
  viewType?: ViewType;
  /**
   * Callback when view type changes
   */
  onViewTypeChange?: (viewType: ViewType) => void;
  /**
   * Button size
   */
  size?: 'small' | 'medium';
  /**
   * Button variant
   */
  variant?: 'secondary' | 'tertiary';
  /**
   * Custom className
   */
  className?: string;
}

// Local storage key for persisting view preference
const VIEW_TYPE_STORAGE_KEY = 'canva-view-type';

// Get cached view type from localStorage
const getCachedViewType = (): ViewType => {
  try {
    const cached = localStorage.getItem(VIEW_TYPE_STORAGE_KEY);
    return (cached as ViewType) || 'grid';
  } catch {
    return 'grid';
  }
};

// Set cached view type to localStorage
const setCachedViewType = (viewType: ViewType): void => {
  try {
    localStorage.setItem(VIEW_TYPE_STORAGE_KEY, viewType);
  } catch {
    // Silently fail if localStorage is not available
  }
};

export const ViewControls: React.FC<ViewControlsProps> = ({
  viewType: controlledViewType,
  onViewTypeChange,
  size = 'medium',
  variant = 'secondary',
  className,
}) => {
  // Use controlled prop or internal state
  const [internalViewType, setInternalViewType] = useState<ViewType>(() => getCachedViewType());
  const currentViewType = controlledViewType ?? internalViewType;

  // Load from localStorage on mount
  useEffect(() => {
    if (!controlledViewType) {
      const cached = getCachedViewType();
      setInternalViewType(cached);
    }
  }, [controlledViewType]);

  const handleToggleView = () => {
    const newViewType: ViewType = currentViewType === 'grid' ? 'list' : 'grid';

    // Update internal state if not controlled
    if (!controlledViewType) {
      setInternalViewType(newViewType);
      setCachedViewType(newViewType);
    }

    // Call callback
    onViewTypeChange?.(newViewType);
  };

  // Get button icon based on current view type
  const getButtonIcon = () => {
    return currentViewType === 'grid' ? GridViewIcon : ListBulletLtrIcon;
  };

  // Get button label based on current view type
  const getButtonLabel = () => {
    return currentViewType === 'grid' ? 'Switch to list view' : 'Switch to grid view';
  };

  const IconComponent = getButtonIcon();
  const buttonLabel = getButtonLabel();

  return (
    <Button
      className={`${styles.viewControls} ${className || ''}`}
      variant={variant}
      ariaLabel={buttonLabel}
      icon={IconComponent}
      onClick={handleToggleView}
      size={size}
      tooltipLabel={buttonLabel}
    />
  );
};

export default ViewControls;
