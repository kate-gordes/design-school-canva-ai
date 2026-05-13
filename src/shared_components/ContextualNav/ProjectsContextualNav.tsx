import React from 'react';
import { Avatar, Box, TreeMenu, TreeMenuItem, Spacer } from '@canva/easel';
import { FoldersIcon, UsersIcon, CheckCircleUnderlineIcon } from '@canva/easel/icons';
import { type ContextualNavItem, projectsYourItems, starredItems } from '@/data/data';
import { CustomChevronIcon } from '@/shared_components/icons';
import { FolderAnimatedIcon } from '@/shared_components/icons/FolderAnimatedIcon';
import CollapsableSection from './CollapsableSection';
import styles from './ContextualNav.module.css';

function renderIcon(iconType: ContextualNavItem['iconType']): React.ReactNode {
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
}

function renderItem(item: ContextualNavItem): React.ReactNode {
  return (
    <TreeMenuItem
      key={item.id}
      label={item.title}
      start={renderIcon(item.iconType)}
      customToggle={
        item.hasChevron ? () => <CustomChevronIcon className={styles.leftChevronIcon} /> : undefined
      }
    >
      {item.children && item.children.map(child => renderItem(child))}
    </TreeMenuItem>
  );
}

export default function ProjectsContextualNav(): React.ReactNode {
  const [selected, setSelected] = React.useState<'all' | 'your' | 'shared' | 'offline'>('all');

  return (
    <>
      <TreeMenu
        role="list"
        className={`${styles.itemsList} ${styles.tightListSpacing}`}
        itemCustomToggleWidth="1u"
        indentation="3u"
      >
        <TreeMenuItem
          label="All projects"
          selected={selected === 'all'}
          className={selected === 'all' ? styles.projectsTopItemSelected : undefined}
          onClick={() => setSelected('all')}
          start={<FoldersIcon size="medium" />}
        />
        <TreeMenuItem
          label="Your projects"
          selected={selected === 'your'}
          className={selected === 'your' ? styles.projectsTopItemSelected : undefined}
          onClick={() => setSelected('your')}
          customToggle={() => <CustomChevronIcon className={styles.leftChevronIcon} />}
          start={
            <Avatar
              size="xxsmall"
              name="Valentina Solis"
              photo="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=face"
            />
          }
        >
          {projectsYourItems.map(renderItem)}
        </TreeMenuItem>
      </TreeMenu>

      {/* Selection items styled like Templates contextual */}
      <TreeMenu role="list" className={styles.itemsList} itemCustomToggleWidth="1u" indentation="0">
        <TreeMenuItem
          label="Shared with you"
          selected={selected === 'shared'}
          onClick={() => setSelected('shared')}
          start={<UsersIcon size="medium" />}
        />
        <TreeMenuItem
          label="Available offline"
          selected={selected === 'offline'}
          onClick={() => setSelected('offline')}
          start={<CheckCircleUnderlineIcon size="medium" />}
        />
      </TreeMenu>

      {/* Your starred (same as Home) */}
      <Spacer size="3u" />
      <CollapsableSection title="Your starred" items={starredItems} hasPlus />
    </>
  );
}
