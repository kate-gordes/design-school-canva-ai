import React, { useState } from 'react';
import { Rows } from '@canva/easel';
import { ListHeader } from '@/pages/Home/Projects/components/ListHeader';
import { BaseRow, SelectableRow } from '@/pages/Home/Projects/components/ListViewRow';
import { BasicButton } from '@canva/easel/button';
import { Columns, Column, Text } from '@canva/easel';
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@canva/easel/icons';
import { observable } from 'mobx';

type SortOrder = 'asc' | 'desc' | 'none';

interface ListViewItem {
  id: string;
  title: string;
  type: string;
  editedDate: string;
  isPrivate?: boolean;
  resultDataType?: string;
}

interface ListViewProps {
  items: ListViewItem[];
  onItemClick?: (item: ListViewItem) => void;
  onItemContextMenu?: (item: ListViewItem, e: React.MouseEvent) => void;
  size?: 'small' | 'large';
  enableSelection?: boolean;
  renderItemContent: (item: ListViewItem) => React.ReactNode;
}

export default function ListView({
  items,
  onItemClick,
  onItemContextMenu,
  size = 'large',
  enableSelection = true,
  renderItemContent,
}: ListViewProps): React.ReactNode {
  const [nameSort, setNameSort] = useState<SortOrder>('none');
  const [editedSort, setEditedSort] = useState<SortOrder>('none');

  // Mock services for SelectableRow
  const mockAnalyticsService = { track: () => {} };
  const mockMetadataPanelController = { isOpen: false };
  const mockAuthSession = { userId: 'test-user' };

  const handleNameSort = () => {
    if (nameSort === 'none') {
      setNameSort('asc');
    } else if (nameSort === 'asc') {
      setNameSort('desc');
    } else {
      setNameSort('none');
    }
    setEditedSort('none'); // Reset other sort
  };

  const handleEditedSort = () => {
    if (editedSort === 'none') {
      setEditedSort('asc');
    } else if (editedSort === 'asc') {
      setEditedSort('desc');
    } else {
      setEditedSort('none');
    }
    setNameSort('none'); // Reset other sort
  };

  // Sort items based on current sort state
  const sortedItems = React.useMemo(() => {
    if (nameSort !== 'none') {
      return [...items].sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return nameSort === 'asc' ? comparison : -comparison;
      });
    }
    if (editedSort !== 'none') {
      return [...items].sort((a, b) => {
        const comparison = new Date(a.editedDate).getTime() - new Date(b.editedDate).getTime();
        return editedSort === 'asc' ? comparison : -comparison;
      });
    }
    return items;
  }, [items, nameSort, editedSort]);

  const nameColumnButton = (
    <BasicButton onClick={handleNameSort}>
      <Columns spacing="0.5u" alignY="center">
        <Column width="content">
          <Text size="small" weight="bold" tone={nameSort !== 'none' ? 'primary' : 'secondary'}>
            Name
          </Text>
        </Column>
        <Column width="content">
          {nameSort === 'asc' ? (
            <ChevronUpIcon size="small" />
          ) : nameSort === 'desc' ? (
            <ChevronDownIcon size="small" />
          ) : (
            <ChevronUpDownIcon size="small" />
          )}
        </Column>
      </Columns>
    </BasicButton>
  );

  const editedColumnButton = (
    <BasicButton onClick={handleEditedSort}>
      <Columns spacing="0.5u" alignY="center">
        <Column width="content">
          <Text size="small" weight="bold" tone={editedSort !== 'none' ? 'primary' : 'secondary'}>
            Edited
          </Text>
        </Column>
        <Column width="content">
          {editedSort === 'asc' ? (
            <ChevronUpIcon size="small" />
          ) : editedSort === 'desc' ? (
            <ChevronDownIcon size="small" />
          ) : (
            <ChevronUpDownIcon size="small" />
          )}
        </Column>
      </Columns>
    </BasicButton>
  );

  return (
    <Rows spacing="0">
      {/* List Header */}
      <ListHeader nameColumnButton={nameColumnButton} editedColumnButton={editedColumnButton} />

      {/* List Items */}
      {sortedItems.map((item, index) => {
        const isLast = index === sortedItems.length - 1;
        const isRenaming = observable.box(false);

        const handleItemClick = (e: React.MouseEvent | React.KeyboardEvent) => {
          onItemClick?.(item);
        };

        const handleItemContextMenu = (e: React.MouseEvent) => {
          onItemContextMenu?.(item, e);
        };

        // Use SelectableRow for items that support selection, BaseRow for simple items
        if (enableSelection && item.resultDataType !== 'virtualFolder') {
          return (
            <SelectableRow
              key={item.id}
              folder={undefined}
              isLast={isLast}
              isRenaming={isRenaming}
              size={size}
              item={{
                id: item.id,
                title: item.title,
                resultDataType: item.resultDataType || 'realFolder',
              }}
              onClick={handleItemClick}
              onContextMenu={handleItemContextMenu}
              analyticsService={mockAnalyticsService}
              isDetailsMenuOpen={false}
              metadataPanelController={mockMetadataPanelController}
              authSession={mockAuthSession}
              enableRealUploadsFolder={false}
              enableEnhancedPermissions={false}
            >
              {renderItemContent(item)}
            </SelectableRow>
          );
        }

        return (
          <BaseRow
            key={item.id}
            ariaLabel={item.title}
            isLast={isLast}
            size={size}
            dragging={false}
            selected={false}
            onClick={handleItemClick}
            onContextMenu={handleItemContextMenu}
            isDetailsMenuOpen={false}
          >
            {renderItemContent(item)}
          </BaseRow>
        );
      })}
    </Rows>
  );
}
