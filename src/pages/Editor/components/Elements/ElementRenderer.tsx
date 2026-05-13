import React from 'react';
import type { ElementData } from '@/store/types';
import TextElement from './TextElement';
import ShapeElement from './ShapeElement';
import ImageElement from './ImageElement';
import styles from './ElementRenderer.module.css';

interface ElementRendererProps {
  element: ElementData;
  isSelected: boolean;
  isEditing?: boolean;
  onStartEditing?: () => void;
  onStopEditing?: () => void;
}

export function ElementRenderer({
  element,
  isSelected,
  isEditing,
  onStartEditing,
  onStopEditing,
}: ElementRendererProps): React.ReactNode {
  switch (element.type) {
    case 'text':
      return (
        <TextElement
          element={element}
          isSelected={isSelected}
          isEditing={isEditing}
          onStartEditing={onStartEditing}
          onStopEditing={onStopEditing}
        />
      );
    case 'shape':
      return (
        <ShapeElement
          element={element}
          isSelected={isSelected}
          isEditing={isEditing}
          onStartEditing={onStartEditing}
          onStopEditing={onStopEditing}
        />
      );
    case 'image':
      return <ImageElement element={element} isSelected={isSelected} />;
    case 'video':
      // Placeholder for video element.
      // Plain div: Easel Box resets background/margin which would defeat the placeholder chrome.
      return <div className={styles.videoPlaceholder}>Video</div>;
    case 'html':
      // Placeholder for HTML element.
      // Plain div: uses dangerouslySetInnerHTML which Easel Box does not forward.
      return (
        <div
          className={styles.htmlPlaceholder}
          dangerouslySetInnerHTML={{ __html: element.content }}
        />
      );
    default:
      return null;
  }
}

export default ElementRenderer;
