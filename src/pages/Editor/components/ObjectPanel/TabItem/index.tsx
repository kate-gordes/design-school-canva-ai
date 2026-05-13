import React from 'react';
import { Text } from '@canva/easel';
import styles from './TabItem.module.css';

interface TabItemProps {
  activeItem: string;
  onItemClick: (item: string) => void;
  title?: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  docked?: boolean;
  onHover?: (title: string | null) => void;
}

export default function TabItem({
  activeItem,
  title,
  icon,
  activeIcon,
  onItemClick,
  docked = false,
  onHover,
}: TabItemProps): React.ReactNode {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleClick = () => {
    if (title) {
      onItemClick(title);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!docked && onHover && title) {
      onHover(title);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!docked && onHover) {
      onHover(null);
    }
  };

  const getTabClass = () => {
    let classes = styles.tabItem;

    // Add docked styling
    if (docked) {
      classes += ` ${styles.docked}`;
    }

    if (activeItem === title) {
      classes += ` ${styles.active}`;
    }

    // Add tab-specific color classes when active OR when hovering in non-docked mode
    if (activeItem === title || (isHovered && !docked)) {
      switch (title) {
        case 'Elements':
          classes += ` ${styles.elements}`;
          break;
        case 'Text':
          classes += ` ${styles.text}`;
          break;
        case 'Brand':
          classes += ` ${styles.brand}`;
          break;
        case 'Uploads':
          classes += ` ${styles.uploads}`;
          break;
        case 'Tools':
          classes += ` ${styles.tools}`;
          break;
        case 'Projects':
          classes += ` ${styles.projects}`;
          break;
        case 'Apps':
          classes += ` ${styles.apps}`;
          break;
      }
    }
    return classes;
  };

  return (
    <div
      className={getTabClass()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      aria-label={title}
    >
      <span
        className={`${styles.iconContainer} ${title === 'Canva AI' ? styles.canvaAiContainer : ''}`}
      >
        <span className={styles.iconWrapper}>
          {(activeItem === title || (isHovered && !docked)) && activeIcon ? activeIcon : icon}
        </span>
      </span>
      <span className={styles.label}>
        <Text size="xsmall">{title}</Text>
      </span>
    </div>
  );
}
