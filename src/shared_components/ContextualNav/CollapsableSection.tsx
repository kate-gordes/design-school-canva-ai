import React from 'react';
import { Box, Text, TreeMenu, TreeMenuItem } from '@canva/easel';
import { PlusIcon, ChevronRightIcon, ChevronDownIcon } from '@canva/easel/icons';
import { type ContextualNavItem } from '@/data/data';
import { CustomChevronIcon } from '@/shared_components/icons';
import { FolderAnimatedIcon } from '@/shared_components/icons/FolderAnimatedIcon';
import styles from './ContextualNav.module.css';

interface CollapsableSectionProps {
  title: string;
  items: ContextualNavItem[];
  hasPlus?: boolean;
  defaultCollapsed?: boolean;
}

export default function CollapsableSection(props: CollapsableSectionProps): React.ReactNode {
  const { title, items, hasPlus = false, defaultCollapsed = false } = props;
  const [collapsed, setCollapsed] = React.useState<boolean>(defaultCollapsed);

  const renderIcon = (iconType: ContextualNavItem['iconType']): React.ReactNode => {
    switch (iconType) {
      case 'document':
        return <Box className={styles.documentIcon}>📄</Box>;
      case 'folder':
        return <FolderAnimatedIcon isOpen={false} isPartiallyOpen={false} disableAnimation />;
      case 'design-blue':
        return <Box className={styles.designBlueIcon}>🔵</Box>;
      case 'design-white':
        return <Box className={styles.designWhiteIcon}>⚪</Box>;
      default:
        return <Box className={styles.documentIcon}>📄</Box>;
    }
  };

  const renderNavItem = (item: ContextualNavItem, isChild = false): React.ReactNode => (
    <TreeMenuItem
      key={item.id}
      label={item.title}
      start={renderIcon(item.iconType)}
      customToggle={
        item.hasChevron ? () => <CustomChevronIcon className={styles.leftChevronIcon} /> : undefined
      }
      className={isChild ? styles.childIndent : undefined}
    >
      {item.children && item.children.map(child => renderNavItem(child, true))}
    </TreeMenuItem>
  );

  return (
    <Box className={styles.section}>
      <Box
        className={styles.sectionHeader}
        display="flex"
        alignItems="center"
        justifyContent="spaceBetween"
        paddingY="0.5u"
      >
        <button className={styles.labelButton} onClick={() => setCollapsed(!collapsed)}>
          <Text size="small" weight="bold" className={styles.sectionTitle}>
            {title}
          </Text>
          {collapsed ? (
            <ChevronRightIcon
              size="small"
              className={`${styles.headerChevron} ${styles.visible}`}
            />
          ) : (
            <ChevronDownIcon size="small" className={styles.headerChevron} />
          )}
        </button>
        {hasPlus && (
          <button className={styles.addButtonContainer}>
            <PlusIcon size="small" className={styles.addButton} />
          </button>
        )}
      </Box>
      {!collapsed && (
        <TreeMenu
          role="list"
          className={`${styles.itemsList} ${styles.itemsListNoIndent}`}
          itemCustomToggleWidth="1u"
        >
          {items.map(it => renderNavItem(it))}
        </TreeMenu>
      )}
    </Box>
  );
}
