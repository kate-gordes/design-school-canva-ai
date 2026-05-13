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

export interface NavItem {
  id: string;
  label: string;
  renderIcon: () => React.ReactNode;
}

export const getNavItems = (): NavItem[] => [
  { id: 'for-you', label: 'For you', renderIcon: () => <NavCanvaAIIcon size={24} /> },
  {
    id: 'sheets',
    label: 'Sheets',
    renderIcon: () => (
      <span style={{ color: 'rgb(19, 142, 255)' }}>
        <ToolkitSheetFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'docs',
    label: 'Docs',
    renderIcon: () => (
      <span style={{ color: 'rgb(19, 163, 181)' }}>
        <ToolkitDocumentFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'whiteboards',
    label: 'Whiteboards',
    renderIcon: () => (
      <span style={{ color: 'rgb(11, 168, 74)' }}>
        <ToolkitWhiteboardFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'presentations',
    label: 'Presentations',
    renderIcon: () => (
      <span style={{ color: 'rgb(255, 97, 5)' }}>
        <ToolkitPresentationFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'social-media',
    label: 'Social media',
    renderIcon: () => (
      <span style={{ color: 'rgb(255, 59, 75)' }}>
        <ToolkitSocialFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'photo-editor',
    label: 'Photo editor',
    renderIcon: () => (
      <span style={{ color: 'rgb(255, 51, 156)' }}>
        <CameraFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'videos',
    label: 'Videos',
    renderIcon: () => (
      <span style={{ color: 'rgb(233, 80, 247)' }}>
        <ToolkitVideoFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'print-products',
    label: 'Print products',
    renderIcon: () => (
      <span style={{ color: 'rgb(153, 43, 255)' }}>
        <ToolkitPrintFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'websites',
    label: 'Websites',
    renderIcon: () => (
      <span style={{ color: 'rgb(74, 83, 250)' }}>
        <ToolkitWebsiteFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'custom-size',
    label: 'Custom size',
    renderIcon: () => (
      <span style={{ color: 'black' }}>
        <CustomSizeIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'upload',
    label: 'Upload',
    renderIcon: () => (
      <span style={{ color: 'black' }}>
        <CloudUploadIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'more',
    label: 'More',
    renderIcon: () => (
      <span style={{ color: 'rgb(100, 83, 208)' }}>
        <ToolkitMoreHorizontalIcon size="medium" />
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
