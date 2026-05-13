import React, { useState, useEffect } from 'react';
import { Placeholder } from '@canva/easel';
import styles from './ImageWithPlaceholder.module.css';

export interface ImageWithPlaceholderProps {
  src: string;
  alt?: string;
  className?: string;
  createImage?: () => Promise<void>;
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
  src,
  alt = '',
  className = '',
  createImage,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    // If createImage is provided, use it for custom loading logic
    if (createImage) {
      createImage()
        .then(() => {
          setIsLoading(false);
          onLoad?.();
        })
        .catch(() => {
          setHasError(true);
          setIsLoading(false);
          onError?.();
        });
    }
  }, [src, createImage, onLoad, onError]);

  const handleImageLoad = () => {
    if (!createImage) {
      setIsLoading(false);
      onLoad?.();
    }
  };

  const handleImageError = () => {
    if (!createImage) {
      setHasError(true);
      setIsLoading(false);
      onError?.();
    }
  };

  if (isLoading && !hasError) {
    return (
      <div className={`${styles.container} ${className}`}>
        <Placeholder shape="sharpRectangle" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`${styles.container} ${styles.error} ${className}`}>
        <Placeholder shape="sharpRectangle" />
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <img
        src={src}
        alt={alt}
        className={styles.image}
        onLoad={handleImageLoad}
        onError={handleImageError}
        draggable={false}
      />
    </div>
  );
};

export default ImageWithPlaceholder;
