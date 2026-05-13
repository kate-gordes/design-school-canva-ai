import React from 'react';
import type { ElementData } from '@/store/types';
import styles from './ImageElement.module.css';

interface ImageElementProps {
  element: ElementData;
  isSelected: boolean;
}

export function ImageElement({ element, isSelected }: ImageElementProps): React.ReactNode {
  const { style, content } = element;

  // Get image URL from either backgroundImage style or content
  const backgroundImage = style.backgroundImage as string | undefined;
  const imageUrl = content || '';
  const hasImage = backgroundImage || imageUrl;

  // Build image style
  const imageStyle: React.CSSProperties = {
    backgroundImage: backgroundImage || (imageUrl ? `url('${imageUrl}')` : undefined),
    backgroundSize: style.backgroundSize || 'cover',
    backgroundPosition: style.backgroundPosition || 'center',
    backgroundRepeat: style.backgroundRepeat || 'no-repeat',
    borderRadius: style.borderRadius,
    opacity: style.opacity,
  };

  if (!hasImage) {
    return (
      // Plain div: dynamic borderRadius from element.style; Easel Box wipes background/margin.
      <div className={styles.imageElement} style={{ borderRadius: style.borderRadius }}>
        {/* Plain div: placeholder chrome container; composes .placeholder class for bg/center. */}
        <div className={styles.placeholder}>
          <svg
            className={styles.placeholderIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    // Plain div: dynamic borderRadius from element.style; Easel Box wipes background/margin.
    <div className={styles.imageElement} style={{ borderRadius: style.borderRadius }}>
      {/* Plain div: dynamic backgroundImage/size/position/repeat from element.style (user-
          uploaded asset URL); Easel Box does not expose a backgroundImage prop. */}
      <div className={styles.image} style={imageStyle} />
    </div>
  );
}

export default ImageElement;
