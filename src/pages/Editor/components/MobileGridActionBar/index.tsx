import React from 'react';
import { Text } from '@canva/easel';
import {
  PagePlusIcon,
  CopyPlusIcon,
  TrashIcon,
  EyeSlashIcon,
  CheckSquaresIcon,
  CheckIcon,
} from '@canva/easel/icons';
import styles from './MobileGridActionBar.module.css';

interface MobileGridActionBarProps {
  onAddPage: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onHide: () => void;
  onSelect: () => void;
  onDone: () => void;
}

interface ActionItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function MobileGridActionBar({
  onAddPage,
  onDuplicate,
  onDelete,
  onHide,
  onSelect,
  onDone,
}: MobileGridActionBarProps): React.ReactNode {
  const actions: ActionItem[] = [
    { id: 'add', label: 'Add page', icon: <PagePlusIcon size="medium" />, onClick: onAddPage },
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: <CopyPlusIcon size="medium" />,
      onClick: onDuplicate,
    },
    { id: 'delete', label: 'Delete', icon: <TrashIcon size="medium" />, onClick: onDelete },
    { id: 'hide', label: 'Hide', icon: <EyeSlashIcon size="medium" />, onClick: onHide },
    { id: 'select', label: 'Select', icon: <CheckSquaresIcon size="medium" />, onClick: onSelect },
  ];

  return (
    <div className={styles.bar}>
      <div className={styles.actions}>
        {actions.map(action => (
          <button
            key={action.id}
            className={styles.actionButton}
            onClick={action.onClick}
            aria-label={action.label}
          >
            <span className={styles.actionIcon}>{action.icon}</span>
            <Text size="xsmall" className={styles.actionLabel}>
              {action.label}
            </Text>
          </button>
        ))}
      </div>
      <button className={styles.doneButton} onClick={onDone} aria-label="Done">
        <CheckIcon size="medium" />
      </button>
    </div>
  );
}
