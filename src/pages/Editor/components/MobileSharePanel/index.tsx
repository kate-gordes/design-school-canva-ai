import React from 'react';
import {
  UserPlusIcon,
  PresentIcon,
  CheckCircleIcon,
  LinkIcon,
  SocialInstagramIcon,
  WebsiteIcon,
  PowerpointIcon,
  MoreHorizontalIcon,
} from '@canva/easel/icons';
import styles from './MobileSharePanel.module.css';

interface ShareAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  branded?: boolean;
}

interface MobileSharePanelProps {
  onClose: () => void;
}

const actions: ShareAction[] = [
  {
    id: 'invite',
    label: 'Invite',
    icon: <UserPlusIcon size="medium" />,
  },
  {
    id: 'present',
    label: 'Present',
    icon: <PresentIcon size="medium" />,
  },
  {
    id: 'request-approval',
    label: 'Request approval',
    icon: <CheckCircleIcon size="medium" />,
  },
  {
    id: 'public-view-link',
    label: 'Public view link',
    icon: <LinkIcon size="medium" />,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: <SocialInstagramIcon size="medium" />,
    branded: true,
  },
  {
    id: 'website',
    label: 'Website',
    icon: <WebsiteIcon size="medium" />,
    branded: true,
  },
  {
    id: 'powerpoint',
    label: 'Microsoft PowerPoint',
    icon: <PowerpointIcon size="medium" />,
    branded: true,
  },
  {
    id: 'more',
    label: 'More',
    icon: <MoreHorizontalIcon size="medium" />,
  },
];

export default function MobileSharePanel({ onClose }: MobileSharePanelProps): React.ReactNode {
  const handleAction = (actionId: string) => {
    console.log(`Share action: ${actionId}`);
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Bottom sheet panel */}
      <div className={styles.panel}>
        <div className={styles.handle} />

        {/* Action grid */}
        <div className={styles.actionGrid}>
          {actions.map(action => (
            <button
              key={action.id}
              className={styles.actionItem}
              onClick={() => handleAction(action.id)}
            >
              <span className={action.branded ? styles.actionIconBranded : styles.actionIcon}>
                {action.icon}
              </span>
              <span className={styles.actionLabel}>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Share button */}
        <button className={styles.shareButton} onClick={() => handleAction('share')}>
          Share
        </button>

        {/* Download button */}
        <button className={styles.downloadButton} onClick={() => handleAction('download')}>
          Download
        </button>
      </div>
    </>
  );
}
