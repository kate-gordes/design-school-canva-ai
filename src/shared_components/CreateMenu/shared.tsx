import React from 'react';
import {
  ToolkitSheetFilledIcon,
  ToolkitDocumentFilledIcon,
  ToolkitWhiteboardFilledIcon,
  ToolkitPresentationFilledIcon,
  ToolkitSocialFilledIcon,
  CameraFilledIcon,
  ToolkitVideoFilledIcon,
  ToolkitPrintFilledIcon,
  ToolkitWebsiteFilledIcon,
  CustomSizeIcon,
  CloudUploadIcon,
  ToolkitMoreHorizontalIcon,
} from '@canva/easel/icons';
import { NavCanvaAIIcon } from '@/shared_components/icons';
import EmailIcon from '@/shared_components/icons/EmailIcon';
import styles from './shared.module.css';

export interface NavItem {
  id: string;
  label: string;
  renderIcon: () => React.ReactNode;
}

// Plain span wrappers below: Easel Box's reset_f88b8e would wipe the per-icon
// color cascade into the inline SVG and the transform: scale(1.2) overlay.
// Each icon has its own semantic tint class; .iconScaled supplies the shared
// inline-flex + scale used across the colored category icons.
export const getNavItems = (): NavItem[] => [
  { id: 'for-you', label: 'For you', renderIcon: () => <NavCanvaAIIcon size={20} /> },
  {
    id: 'emails',
    label: 'Emails',
    renderIcon: () => (
      <span className={styles.iconEmail}>
        <EmailIcon size="small" />
      </span>
    ),
  },
  {
    id: 'presentations',
    label: 'Presentations',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconPresentations}`}>
        <ToolkitPresentationFilledIcon size="small" />
      </span>
    ),
  },
  {
    id: 'social-media',
    label: 'Social media',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconSocial}`}>
        <ToolkitSocialFilledIcon size="small" />
      </span>
    ),
  },
  {
    id: 'photo-editor',
    label: 'Photo editor',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconPhotoEditor}`}>
        <CameraFilledIcon size="small" />
      </span>
    ),
  },
  {
    id: 'videos',
    label: 'Videos',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconVideos}`}>
        <ToolkitVideoFilledIcon size="small" />
      </span>
    ),
  },
  {
    id: 'print',
    label: 'Print',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconPrint}`}>
        <ToolkitPrintFilledIcon size="small" />
      </span>
    ),
  },
  {
    id: 'docs',
    label: 'Docs',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconDocs}`}>
        <ToolkitDocumentFilledIcon size="small" />
      </span>
    ),
  },
  {
    id: 'whiteboards',
    label: 'Whiteboards',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconWhiteboards}`}>
        <ToolkitWhiteboardFilledIcon size="small" />
      </span>
    ),
  },
  {
    id: 'sheets',
    label: 'Sheets',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconSheets}`}>
        <ToolkitSheetFilledIcon size="small" />
      </span>
    ),
  },
  {
    id: 'websites',
    label: 'Websites',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconWebsites}`}>
        <ToolkitWebsiteFilledIcon size="small" />
      </span>
    ),
  },
  {
    id: 'custom-size',
    label: 'Custom size',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconBlack}`}>
        <CustomSizeIcon size="small" />
      </span>
    ),
  },
  {
    id: 'upload',
    label: 'Upload',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconBlack}`}>
        <CloudUploadIcon size="small" />
      </span>
    ),
  },
  {
    id: 'more',
    label: 'More',
    renderIcon: () => (
      <span className={`${styles.iconScaled} ${styles.iconMore}`}>
        <ToolkitMoreHorizontalIcon size="small" />
      </span>
    ),
  },
];

export const baseCreateLabels = [
  'Doc',
  'Sheet',
  'Whiteboard',
  'Presentation (16:9)',
  'Resume (A4)',
];
export const makeCreateNewItems = (count = 20) =>
  Array.from({ length: count }, (_, i) => ({
    label: baseCreateLabels[i % baseCreateLabels.length],
  }));

export const brandTitles = [
  'Canva Deck Template',
  'Newbie Onboarding Plan (Jan 2025)',
  'CANVA CREATE 24 Presentation',
  'Comms Companion: Internal Comms ...',
  'Brand Guide',
  'Marketing Report',
  'Portfolio',
  'Company Profile',
  'Sales Pitch',
  'Annual Review',
  'Campaign Overview',
];
