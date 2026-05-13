import * as React from 'react';
import styles from './FolderAnimatedIcon.module.css';

function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T | undefined>(undefined);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function classNames(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export interface FolderAnimatedIconProps {
  isOpen: boolean;
  isPartiallyOpen: boolean;
  disableAnimation?: boolean;
  className?: string;
}

export const FolderAnimatedIcon = ({
  isOpen,
  isPartiallyOpen,
  disableAnimation,
  className,
}: FolderAnimatedIconProps): React.JSX.Element => {
  // Don't apply open/close css classes until the folder svg has been
  // opened/rendered for a second time, or if animations are disabled.
  const applyStyles = React.useRef(!!disableAnimation);
  const previous = usePrevious(isOpen);

  const gradientId = React.useId();

  if (previous != null && previous !== isOpen) {
    applyStyles.current = true;
  }

  let overlayIconComponent: React.ReactNode = null;
  if (isPartiallyOpen) {
    overlayIconComponent = (
      <svg
        className={classNames(styles.svgContainer, styles.partiallyOpen)}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="7.5" cy="14.5" r="1.5" fill="#11171D" fillOpacity="0.6" />
        <circle cx="12" cy="14.5" r="1.5" fill="#11171D" fillOpacity="0.6" />
        <circle cx="16.5" cy="14.5" r="1.5" fill="#11171D" fillOpacity="0.6" />
      </svg>
    );
  }

  return (
    <div
      className={classNames(
        styles.icon,
        disableAnimation && styles.disableAnimation,
        applyStyles.current && isOpen && styles.open,
        applyStyles.current && !isOpen && styles.closed,
        className,
      )}
    >
      <div className={styles.folderFront} />
      <svg
        className={styles.svgContainer}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.857,2L6.024,2C3.817,2 2.004,3.787 2,5.994L2,14.814C1.996,17.026 22,17.028 22,14.819L22,8.025C22,6.368 20.653,5.025 18.997,5.025L14.521,5.025C14.33,5.025 14.156,4.916 14.072,4.745L13.551,3.681C13.048,2.653 12.002,2 10.857,2Z"
          fill={`url(#${gradientId})`}
        />
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop className={styles.folderBackGradient1} offset="0%" />
            <stop className={styles.folderBackGradient2} offset="100%" />
          </linearGradient>
        </defs>
      </svg>
      {overlayIconComponent}
    </div>
  );
};
