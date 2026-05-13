import React from 'react';
import { observable } from 'mobx';
import { Text } from '@canva/easel';
import { FolderIcon } from '@canva/easel/icons';
import { BasicButton } from '@canva/easel/button';
import { StarIcon, MoreHorizontalIcon } from '@canva/easel/icons';
import type { FolderData } from '@/pages/Home/components/FoldersSection';
import { SelectableRow } from '@/pages/Home/Projects/components/ListViewRow';
import styles from './FolderListItem.module.css';

interface FolderListItemProps {
  folder: FolderData;
  onClick?: () => void;
  isLast?: boolean;
  size?: 'small' | 'large';
}

export default function FolderListItem({
  folder,
  onClick,
  isLast = false,
  size = 'large',
}: FolderListItemProps): React.ReactNode {
  // Create observable for renaming state (required by SelectableRow)
  const isRenaming = React.useMemo(() => observable.box(false), []);

  // Mock required services for SelectableRow
  const mockAnalyticsService = { track: () => {} };
  const mockMetadataPanelController = { isOpen: false };
  const mockAuthSession = { userId: 'test-user' };

  // Transform folder data to match expected item interface
  const item = {
    id: folder.id,
    title: folder.name,
    resultDataType: 'realFolder',
  };

  const handleClick = (_e: React.MouseEvent | React.KeyboardEvent) => {
    onClick?.();
  };

  const handleContextMenu = (_e: React.MouseEvent) => {
    console.log('Context menu for folder:', folder.name);
  };

  const rowContent = (
    <div className={styles.folderListRow}>
      {/* Name Column */}
      <div className={styles.nameColumn}>
        <FolderIcon size="medium" />
        <Text weight="bold">{folder.name}</Text>
      </div>

      {/* Type Column */}
      <span className={styles.paddedCell}>
        <Text tone="secondary">Folder</Text>
      </span>

      {/* Edited Column */}
      <span className={styles.paddedCell}>
        <Text tone="secondary">2 months ago</Text>
      </span>

      {/* Actions Column */}
      <div className={styles.actionsColumn}>
        <BasicButton
          onClick={e => {
            e.stopPropagation();
            console.log('Star folder');
          }}
        >
          <StarIcon size="small" />
        </BasicButton>
        <BasicButton
          onClick={e => {
            e.stopPropagation();
            console.log('Menu folder');
          }}
        >
          <MoreHorizontalIcon size="small" />
        </BasicButton>
      </div>
    </div>
  );

  return (
    <SelectableRow
      folder={undefined}
      isLast={isLast}
      isRenaming={isRenaming}
      size={size}
      item={item}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      analyticsService={mockAnalyticsService}
      isDetailsMenuOpen={false}
      metadataPanelController={mockMetadataPanelController}
      authSession={mockAuthSession}
      enableRealUploadsFolder={false}
      enableEnhancedPermissions={false}
    >
      {rowContent}
    </SelectableRow>
  );
}
