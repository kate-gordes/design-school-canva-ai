import { Box, Text } from '@canva/easel';
import {
  CloudUploadIcon,
  CustomSizeIcon,
  ToolkitDocumentFilledIcon,
  ToolkitPresentationFilledIcon,
  ToolkitSheetFilledIcon,
  ToolkitSocialFilledIcon,
  ToolkitVideoFilledIcon,
  ToolkitWebsiteFilledIcon,
  ToolkitWhiteboardFilledIcon,
} from '@canva/easel/icons';
import React from 'react';
import CodeIcon from '@/shared_components/icons/CodeIcon';
import PrintShopIcon from '@/shared_components/icons/PrintShopIcon';
import photoEditorImg from '@/pages/Home/assets/create_icons/photo_editor.webp';
import styles from './MobileIconGrid.module.css';

interface IconItem {
  label: string;
  color?: string;
  Icon?: React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>;
  image?: string;
  hasBakedCircle?: boolean;
  noCircle?: boolean;
  badge?: string;
}

const iconItems: IconItem[] = [
  {
    label: 'Presentation',
    Icon: ToolkitPresentationFilledIcon,
    color: 'rgb(255, 97, 5)',
  },
  {
    label: 'Social media',
    Icon: ToolkitSocialFilledIcon,
    color: 'rgb(255, 59, 75)',
  },
  {
    label: 'Photo editor',
    image: photoEditorImg,
    noCircle: true,
  },
  {
    label: 'Video',
    Icon: ToolkitVideoFilledIcon,
    color: 'rgb(233, 80, 247)',
  },
  {
    label: 'Print Shop',
    Icon: PrintShopIcon,
    color: 'rgb(153, 43, 255)',
  },
  {
    label: 'Code',
    Icon: CodeIcon,
    color: '#A21CAF',
    badge: 'New',
  },
  {
    label: 'Doc',
    Icon: ToolkitDocumentFilledIcon,
    color: 'rgb(19, 163, 181)',
  },
  {
    label: 'Whiteboard',
    Icon: ToolkitWhiteboardFilledIcon,
    color: 'rgb(11, 168, 74)',
  },
  {
    label: 'Sheet',
    Icon: ToolkitSheetFilledIcon,
    color: 'rgb(19, 142, 255)',
  },
  {
    label: 'Website',
    Icon: ToolkitWebsiteFilledIcon,
    color: 'rgb(74, 83, 250)',
  },
  {
    label: 'Email',
    image: 'https://category-public.canva.com/icons/DesignType_Email_Size_72px_v2.svg',
    hasBakedCircle: true,
  },
  {
    label: 'Custom size',
    Icon: CustomSizeIcon,
    color: '#E8EAED',
  },
  {
    label: 'Upload',
    Icon: CloudUploadIcon,
    color: '#E8EAED',
  },
];

export default function MobileIconGrid(): React.ReactNode {
  return (
    <Box className={styles.container}>
      <Box className={styles.grid}>
        {iconItems.map(({ label, Icon, color, image, hasBakedCircle, noCircle, badge }) => {
          const isGrayBackground = color === '#E8EAED';

          if (hasBakedCircle && image) {
            return (
              <Box key={label} className={styles.iconItem}>
                <Box className={styles.iconWrapper}>
                  <img src={image} alt={label} className={styles.bakedCircleImage} />
                  {badge && <span className={styles.badge}>{badge}</span>}
                </Box>
                <Text size="xsmall" weight="bold" className={styles.label}>
                  {label}
                </Text>
              </Box>
            );
          }

          if (noCircle && image) {
            return (
              <Box key={label} className={styles.iconItem}>
                <Box className={styles.iconWrapper}>
                  <img src={image} alt={label} className={styles.bakedCircleImage} />
                  {badge && <span className={styles.badge}>{badge}</span>}
                </Box>
                <Text size="xsmall" weight="bold" className={styles.label}>
                  {label}
                </Text>
              </Box>
            );
          }

          return (
            <Box key={label} className={styles.iconItem}>
              <Box className={styles.iconWrapper}>
                {/* Plain <div>: Easel Box resets background via reset_f88b8e, wiping
                    the dynamic per-tile background color injected via --circle-bg. */}
                <div
                  className={styles.circle}
                  style={{ '--circle-bg': color } as React.CSSProperties}
                >
                  {image && <img src={image} alt={label} className={styles.photoPreview} />}
                  {!image && Icon && (
                    <Box
                      className={
                        isGrayBackground ? styles.iconContainerBlack : styles.iconContainer
                      }
                    >
                      <Icon size="large" />
                    </Box>
                  )}
                </div>
                {/* Plain <span>: inline badge with absolute positioning — Easel Text wraps
                    in its own element tree and cannot reliably be absolutely positioned here. */}
                {badge && <span className={styles.badge}>{badge}</span>}
              </Box>
              <Text size="small" weight="bold" className={styles.label}>
                {label}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
