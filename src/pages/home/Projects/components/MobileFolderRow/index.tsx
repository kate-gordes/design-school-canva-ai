import React from 'react';
import { AvatarGroup, Badge, Text } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import { FolderIcon, LockClosedIcon, MoreHorizontalIcon, StarFilledIcon } from '@canva/easel/icons';
import styles from './MobileFolderRow.module.css';

interface MobileFolderRowProps {
  title: string;
  isPrivate?: boolean;
  itemCount?: number;
  collaborators?: Array<{ backgroundColor: string; name: string; photo?: string }>;
  starred?: boolean;
  thumbnail?: React.ReactNode;
  onClick?: () => void;
  onMenuClick?: () => void;
}

export default function MobileFolderRow({
  title,
  isPrivate,
  itemCount,
  collaborators,
  starred,
  thumbnail,
  onClick,
  onMenuClick,
}: MobileFolderRowProps): React.ReactNode {
  const hasCollaborators = collaborators && collaborators.length > 0;
  const hasCount = typeof itemCount === 'number' && itemCount > 0;

  return (
    <div className={styles.row}>
      <button type="button" className={styles.rowButton} onClick={onClick}>
        <div className={styles.thumbnail}>{thumbnail ?? <FolderIcon size="medium" />}</div>

        <div className={styles.body}>
          <Text weight="bold" className={styles.title}>
            {title}
          </Text>

          <div className={styles.meta}>
            {hasCollaborators ? (
              <AvatarGroup size="xxsmall" overflowCount={2} avatars={collaborators!} />
            ) : isPrivate ? (
              <Badge tone="neutral" icon={<LockClosedIcon size="small" />} text="Private" />
            ) : null}

            {(hasCollaborators || isPrivate) && hasCount && (
              <span className={styles.dot} aria-hidden="true">
                •
              </span>
            )}

            {hasCount && (
              <Text tone="secondary" size="small">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Text>
            )}
          </div>
        </div>
      </button>

      <div className={styles.trailing}>
        {starred && (
          <span className={styles.starred} aria-label="Starred">
            <StarFilledIcon size="small" />
          </span>
        )}
        <BasicButton
          aria-label="More options"
          onClick={e => {
            e.stopPropagation();
            onMenuClick?.();
          }}
        >
          <MoreHorizontalIcon size="medium" />
        </BasicButton>
      </div>
    </div>
  );
}
