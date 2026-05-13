import { Box, Rows } from '@canva/easel';
import SectionTitle from '@/shared_components/SectionTitle';
import React, { useEffect, useState, useRef } from 'react';
import type { Template } from '@/pages/Home/Templates/data/templateLoader';
import styles from './JustifiedGallery.module.css';

interface JustifiedGalleryProps {
  title: string;
  templates: Template[];
  targetRowHeight?: number;
  /** Clamp individual row heights so a single wide image can't fill the full width. */
  maxRowHeight?: number;
  gap?: number;
}

interface ImageWithDimensions {
  template: Template;
  width: number;
  height: number;
  aspectRatio: number;
}

interface Row {
  images: ImageWithDimensions[];
  height: number;
}

export default function JustifiedGallery({
  title,
  templates,
  targetRowHeight = 280,
  maxRowHeight = 340,
  gap = 24,
}: JustifiedGalleryProps): React.ReactNode {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageData, setImageData] = useState<ImageWithDimensions[]>([]);

  // Load all images and get their natural dimensions
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: ImageWithDimensions[] = [];

      await Promise.all(
        templates.map(template => {
          return new Promise<void>(resolve => {
            const img = new Image();
            img.onload = () => {
              loadedImages.push({
                template,
                width: img.naturalWidth,
                height: img.naturalHeight,
                aspectRatio: img.naturalWidth / img.naturalHeight,
              });
              resolve();
            };
            img.onerror = () => {
              // Fallback to 16:9 aspect ratio if image fails to load
              loadedImages.push({
                template,
                width: 1600,
                height: 900,
                aspectRatio: 16 / 9,
              });
              resolve();
            };
            img.src = template.preview ?? template.image;
          });
        }),
      );

      // Sort to maintain original order
      const orderedImages = templates.map(t => loadedImages.find(img => img.template.id === t.id)!);

      setImageData(orderedImages);
      setImagesLoaded(true);
    };

    loadImages();
  }, [templates]);

  // Observe container width changes
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate rows when images are loaded and container width is known
  useEffect(() => {
    if (!imagesLoaded || containerWidth === 0 || imageData.length === 0) return;

    const calculatedRows: Row[] = [];
    let currentRow: ImageWithDimensions[] = [];
    let currentRowWidth = 0;

    for (const image of imageData) {
      // Calculate width at target row height
      const widthAtTargetHeight = image.aspectRatio * targetRowHeight;

      // Check if adding this image would exceed container width
      const projectedWidth =
        currentRowWidth + widthAtTargetHeight + (currentRow.length > 0 ? gap : 0);

      // Require at least 2 images per row: a single image would otherwise be
      // scaled up to fill the entire container width.
      if (projectedWidth > containerWidth && currentRow.length > 1) {
        // Finalize current row - scale to fit container exactly
        const totalGaps = (currentRow.length - 1) * gap;
        const availableWidth = containerWidth - totalGaps;
        const totalAspectRatio = currentRow.reduce((sum, img) => sum + img.aspectRatio, 0);
        const rowHeight = Math.min(availableWidth / totalAspectRatio, maxRowHeight);

        calculatedRows.push({
          images: currentRow,
          height: rowHeight,
        });

        // Start new row
        currentRow = [image];
        currentRowWidth = widthAtTargetHeight;
      } else {
        currentRow.push(image);
        currentRowWidth = projectedWidth;
      }
    }

    // Handle last row - don't stretch if only a few images
    if (currentRow.length > 0) {
      const totalGaps = (currentRow.length - 1) * gap;
      const totalWidthAtTarget =
        currentRow.reduce((sum, img) => sum + img.aspectRatio * targetRowHeight, 0) + totalGaps;

      // If last row is less than 70% full, use target height instead of stretching
      const fillRatio = totalWidthAtTarget / containerWidth;
      let rowHeight: number;

      if (fillRatio < 0.7 || currentRow.length === 1) {
        // Don't scale a single-image or sparsely-filled last row up to
        // container width — keep it at the target height.
        rowHeight = targetRowHeight;
      } else {
        const availableWidth = containerWidth - totalGaps;
        const totalAspectRatio = currentRow.reduce((sum, img) => sum + img.aspectRatio, 0);
        rowHeight = Math.min(availableWidth / totalAspectRatio, maxRowHeight);
      }

      calculatedRows.push({
        images: currentRow,
        height: rowHeight,
      });
    }

    setRows(calculatedRows);
  }, [imagesLoaded, containerWidth, imageData, targetRowHeight, gap]);

  return (
    <Box width="full">
      <Rows spacing="2u">
        <SectionTitle>{title}</SectionTitle>
        <div ref={containerRef} className={styles.container}>
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={styles.row}
              style={{ gap: `${gap}px`, marginBottom: `${gap}px` }}
            >
              {row.images.map(image => (
                <div
                  key={image.template.id}
                  className={styles.imageWrapper}
                  style={{
                    width: image.aspectRatio * row.height,
                    height: row.height,
                  }}
                >
                  <img
                    src={image.template.preview ?? image.template.image}
                    alt={image.template.name}
                    className={styles.image}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Rows>
    </Box>
  );
}
