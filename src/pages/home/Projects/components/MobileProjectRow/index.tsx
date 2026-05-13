import React from 'react';
import { AvatarGroup, Text } from '@canva/easel';
import { BasicButton } from '@canva/easel/button';
import {
  MoreHorizontalIcon,
  ToolkitDocumentFilledIcon,
  ToolkitDesignFilledIcon,
  ToolkitEmailFilledIcon,
  ToolkitPresentationFilledIcon,
  ToolkitSheetFilledIcon,
  ToolkitWebsiteFilledIcon,
  ToolkitWhiteboardFilledIcon,
  ToolkitVideoFilledIcon,
  PagesIcon,
  ImageIcon,
} from '@canva/easel/icons';
import type { RecentDesign } from '@/data/data';
import styles from './MobileProjectRow.module.css';

interface MobileProjectRowProps {
  design: RecentDesign;
  collaborators?: Array<{ backgroundColor: string; name: string }>;
  onClick?: () => void;
  onMenuClick?: () => void;
}

type IconInfo = {
  Icon: React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>;
  color: string;
};

function getDoctypeIcon(doctype: string): IconInfo {
  const t = doctype.toLowerCase();
  if (t.includes('presentation'))
    return { Icon: ToolkitPresentationFilledIcon, color: 'rgb(255, 97, 5)' };
  if (t.includes('multi-design') || t.includes('multi design'))
    return { Icon: PagesIcon, color: 'rgb(255, 105, 180)' };
  if (t.includes('design')) return { Icon: ToolkitDesignFilledIcon, color: 'rgb(138, 43, 226)' };
  if (t.includes('doc')) return { Icon: ToolkitDocumentFilledIcon, color: 'rgb(19, 163, 181)' };
  if (t.includes('whiteboard'))
    return { Icon: ToolkitWhiteboardFilledIcon, color: 'rgb(11, 168, 74)' };
  if (t.includes('website')) return { Icon: ToolkitWebsiteFilledIcon, color: 'rgb(74, 83, 250)' };
  if (t.includes('sheet')) return { Icon: ToolkitSheetFilledIcon, color: 'rgb(19, 142, 255)' };
  if (t.includes('video')) return { Icon: ToolkitVideoFilledIcon, color: 'rgb(153, 51, 255)' };
  if (t.includes('image')) return { Icon: ImageIcon, color: 'rgb(220, 95, 190)' };
  if (t.includes('email')) return { Icon: ToolkitEmailFilledIcon, color: 'rgb(255, 158, 27)' };
  return { Icon: ToolkitDocumentFilledIcon, color: 'rgb(19, 163, 181)' };
}

export default function MobileProjectRow({
  design,
  collaborators,
  onClick,
  onMenuClick,
}: MobileProjectRowProps): React.ReactNode {
  const { Icon: DocIcon, color } = getDoctypeIcon(design.doctype);
  const isMulti = design.doctype.toLowerCase().includes('multi');
  const contained = design.containedDoctypes ?? [];

  return (
    <div className={styles.row}>
      <button type="button" className={styles.rowButton} onClick={onClick}>
        <div className={styles.thumbnail}>
          {design.thumbnailUrl ? (
            <img src={design.thumbnailUrl} alt="" className={styles.thumbnailImage} />
          ) : (
            <div className={styles.thumbnailPlaceholder} />
          )}
        </div>

        <div className={styles.body}>
          <Text weight="bold" className={styles.title}>
            {design.title}
          </Text>

          <div className={styles.meta}>
            {collaborators && collaborators.length > 0 && (
              <>
                <AvatarGroup size="xxsmall" overflowCount={2} avatars={collaborators} />
                <span className={styles.dot} aria-hidden="true">
                  •
                </span>
              </>
            )}

            {isMulti && contained.length > 0 ? (
              <span className={styles.multiIconGroup}>
                {contained.map((dtype, idx) => {
                  const { Icon: DtypeIcon, color: dtypeColor } = getDoctypeIcon(dtype);
                  return (
                    <span
                      key={idx}
                      className={`${styles.miniIcon} ${styles.multiIcon}`}
                      style={{ background: dtypeColor, zIndex: contained.length - idx }}
                    >
                      <DtypeIcon />
                    </span>
                  );
                })}
              </span>
            ) : (
              <span className={styles.miniIcon} style={{ background: color }}>
                <DocIcon />
              </span>
            )}

            <Text tone="secondary" size="small">
              {design.doctype}
            </Text>
          </div>
        </div>
      </button>

      <div className={styles.menu}>
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
