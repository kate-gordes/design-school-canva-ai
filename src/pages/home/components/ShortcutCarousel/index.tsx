import CreateMenu from '@/shared_components/CreateMenu';
import CodeIcon from '@/shared_components/icons/CodeIcon';
import PrintShopIcon from '@/shared_components/icons/PrintShopIcon';
import { Box, Carousel, Text } from '@canva/easel';
import {
  CloudUploadIcon,
  CustomSizeIcon,
  ToolkitDocumentFilledIcon,
  ToolkitEmailFilledIcon,
  ToolkitMoreHorizontalIcon,
  ToolkitPresentationFilledIcon,
  ToolkitSheetFilledIcon,
  ToolkitSocialFilledIcon,
  ToolkitVideoFilledIcon,
  ToolkitWebsiteFilledIcon,
  ToolkitWhiteboardFilledIcon,
} from '@canva/easel/icons';
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ShortcutCarousel.module.css';
import magicLayersImage from '@/assets/magic-layers.png';
import photoEditorImage from '@/assets/photo-editor.png';

interface ShortcutItem {
  label: string;
  color: string;
  Icon?: React.ComponentType<{ size?: 'small' | 'medium' | 'large' }>;
  imageUrl?: string; // For Photo editor with actual image
  hoverHint: 'Create new' | 'See all' | 'Add media' | 'Browse';
  iconTone?: 'white' | 'black' | 'brandPurple';
  to?: string; // when defined and not empty, renders as Link to this path
  opensCreateMenu?: boolean; // when true, opens CreateMenu modal
}

const items: ShortcutItem[] = [
  {
    label: 'Magic Layers',
    imageUrl: magicLayersImage,
    color: 'transparent',
    hoverHint: 'Create new',
    to: '/editor',
  },
  {
    label: 'Presentation',
    Icon: ToolkitPresentationFilledIcon,
    color: '#FF6105',
    hoverHint: 'Create new',
    to: '/editor/presentation',
  },
  {
    label: 'Social media',
    Icon: ToolkitSocialFilledIcon,
    color: '#FF3B4B',
    hoverHint: 'See all',
    to: '/editor',
  },
  {
    label: 'Video',
    Icon: ToolkitVideoFilledIcon,
    color: '#E950F7',
    hoverHint: 'See all',
    to: '/editor',
  },
  {
    label: 'Print Shop',
    Icon: PrintShopIcon,
    color: '#992BFF',
    hoverHint: 'Browse',
    to: '/editor',
  },
  {
    label: 'Doc',
    Icon: ToolkitDocumentFilledIcon,
    color: '#13A3B5',
    hoverHint: 'Create new',
    to: '/editor/document',
  },
  {
    label: 'Whiteboard',
    Icon: ToolkitWhiteboardFilledIcon,
    color: '#0BA84A',
    hoverHint: 'Create new',
    to: '/editor/whiteboard',
  },
  {
    label: 'Sheet',
    Icon: ToolkitSheetFilledIcon,
    color: '#138EFF',
    hoverHint: 'Create new',
    to: '/editor/spreadsheet',
  },
  {
    label: 'Code',
    Icon: CodeIcon,
    color: '#A21CAF',
    hoverHint: 'See all',
    to: '/editor',
  },
  {
    label: 'Website',
    Icon: ToolkitWebsiteFilledIcon,
    color: '#4A53FA',
    hoverHint: 'See all',
    to: '/editor',
  },
  {
    label: 'Email',
    Icon: ToolkitEmailFilledIcon,
    color: '#5334EB',
    hoverHint: 'Create new',
    to: '/editor',
  },
  {
    label: 'Photo editor',
    imageUrl: photoEditorImage,
    color: 'transparent',
    hoverHint: 'See all',
    to: '/editor',
  },
  // Gray background items with black icons
  {
    label: 'Custom size',
    Icon: CustomSizeIcon,
    color: 'rgb(242, 243, 245)',
    hoverHint: 'Create new',
    iconTone: 'black',
  },
  {
    label: 'Upload',
    Icon: CloudUploadIcon,
    color: 'rgb(242, 243, 245)',
    hoverHint: 'Add media',
    iconTone: 'black',
  },
  {
    label: 'More',
    Icon: ToolkitMoreHorizontalIcon,
    color: 'rgb(242, 243, 245)',
    hoverHint: 'See all',
    iconTone: 'brandPurple',
    opensCreateMenu: true,
  },
];

export default function ShortcutCarousel(): React.ReactNode {
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <Box className={styles.container}>
      <CreateMenu open={createOpen} onClose={() => setCreateOpen(false)} />
      <Box display="flex" justifyContent="center" width="full">
        <Carousel name="shortcuts" gap="0.5u" buttonVariant="chevron" buttonsVerticalOffsetPx={22}>
          {items.map(
            ({ label, Icon, imageUrl, color, hoverHint, iconTone, to, opensCreateMenu }) => {
              const iconSize = iconTone === 'black' ? 'medium' : 'large';
              const Content = (
                <>
                  {/* Plain <div>: Easel Box resets background via reset_f88b8e, wiping
                      the dynamic per-shortcut color injected via the --circle-bg variable. */}
                  <div
                    className={styles.circle}
                    style={{ '--circle-bg': color } as React.CSSProperties}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={label}
                        className={
                          label === 'Magic Layers'
                            ? styles.magicLayersImage
                            : styles.photoEditorImage
                        }
                      />
                    ) : Icon ? (
                      <Box
                        className={
                          iconTone === 'black'
                            ? styles.iconBlack
                            : iconTone === 'brandPurple'
                              ? styles.iconPurple
                              : styles.iconWrapper
                        }
                      >
                        <Icon size={iconSize} />
                      </Box>
                    ) : null}
                  </div>
                  <Text size="small" weight="bold" tone="tertiary">
                    {label}
                  </Text>
                  <Text size="xsmall" className={styles.subText}>
                    {hoverHint}
                  </Text>
                </>
              );
              if (opensCreateMenu) {
                /* Plain <div>: the shortcut "item" layout depends on CSS Module
                   flex-direction/align-items; Easel Box would wipe these via reset_f88b8e. */
                return (
                  <div key={label} className={styles.item} onClick={() => setCreateOpen(true)}>
                    {Content}
                  </div>
                );
              }

              return to ? (
                <Link key={label} className={styles.item} to={to}>
                  {Content}
                </Link>
              ) : (
                /* Plain <div>: see above — shortcut slot relies on module-owned flex layout. */
                <div key={label} className={styles.item}>
                  {Content}
                </div>
              );
            },
          )}
        </Carousel>
      </Box>
    </Box>
  );
}
