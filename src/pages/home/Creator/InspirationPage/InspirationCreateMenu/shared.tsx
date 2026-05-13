import React from 'react';
import {
  ToolkitSocialFilledIcon,
  ToolkitPrintFilledIcon,
  ToolkitPresentationFilledIcon,
  ToolkitDocumentFilledIcon,
  ToolkitWebsiteFilledIcon,
  CameraFilledIcon,
} from '@canva/easel/icons';

export interface NavItem {
  id: string;
  label: string;
  renderIcon: () => React.ReactNode;
}

export const getInspirationNavItems = (): NavItem[] => [
  {
    id: 'templates',
    label: 'Templates',
    renderIcon: () => (
      <span style={{ color: 'rgb(153, 43, 255)' }}>
        <ToolkitPresentationFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'social-media',
    label: 'Social Media',
    renderIcon: () => (
      <span style={{ color: 'rgb(255, 59, 75)' }}>
        <ToolkitSocialFilledIcon size="medium" />
      </span>
    ),
  },
  {
    id: 'print',
    label: 'Print',
    renderIcon: () => (
      <span style={{ color: 'rgb(153, 43, 255)' }}>
        <ToolkitPrintFilledIcon size="medium" />
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
    id: 'documents',
    label: 'Documents',
    renderIcon: () => (
      <span style={{ color: 'rgb(19, 163, 181)' }}>
        <ToolkitDocumentFilledIcon size="medium" />
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
    id: 'photo',
    label: 'Photo',
    renderIcon: () => (
      <span style={{ color: 'rgb(255, 51, 156)' }}>
        <CameraFilledIcon size="medium" />
      </span>
    ),
  },
];

export interface Template {
  title: string;
  description: string;
  category: string;
}

const getTemplatesByCategory = (category?: string): { [key: string]: Template[] } => {
  const baseTemplates = {
    POSTER: {
      featured: [
        { title: 'Vintage Event Poster', description: 'Retro style', category: 'poster' },
        { title: 'Modern Concert Poster', description: 'Contemporary design', category: 'poster' },
        { title: 'Art Exhibition Poster', description: 'Gallery style', category: 'poster' },
        { title: 'Music Festival Poster', description: 'Bold and vibrant', category: 'poster' },
      ],
      popular: [
        { title: 'Club Night Poster', description: 'Nightlife theme', category: 'poster' },
        { title: 'Sports Event Poster', description: 'Athletic design', category: 'poster' },
        { title: 'Food Festival Poster', description: 'Culinary theme', category: 'poster' },
        { title: 'Comedy Show Poster', description: 'Fun and playful', category: 'poster' },
        { title: 'Theater Poster', description: 'Dramatic style', category: 'poster' },
        { title: 'Workshop Poster', description: 'Educational theme', category: 'poster' },
      ],
      all: Array.from({ length: 12 }, (_, i) => ({
        title: `Poster Template ${i + 1}`,
        description: 'Custom poster design',
        category: 'poster',
      })),
    },
    PACKAGE: {
      featured: [
        { title: 'Eco-Friendly Box', description: 'Sustainable packaging', category: 'package' },
        { title: 'Premium Product Box', description: 'Luxury design', category: 'package' },
        { title: 'Food Packaging', description: 'Fresh and clean', category: 'package' },
        { title: 'Cosmetics Package', description: 'Elegant and modern', category: 'package' },
      ],
      popular: [
        { title: 'Tech Product Box', description: 'Modern tech style', category: 'package' },
        { title: 'Gift Box Design', description: 'Festive packaging', category: 'package' },
        { title: 'Subscription Box', description: 'Monthly delivery', category: 'package' },
        { title: 'Bottle Label', description: 'Product labeling', category: 'package' },
        { title: 'Shopping Bag', description: 'Retail packaging', category: 'package' },
        { title: 'Shipping Box', description: 'E-commerce ready', category: 'package' },
      ],
      all: Array.from({ length: 12 }, (_, i) => ({
        title: `Package Template ${i + 1}`,
        description: 'Custom packaging design',
        category: 'package',
      })),
    },
    MENU: {
      featured: [
        { title: 'Fine Dining Menu', description: 'Elegant restaurant', category: 'menu' },
        { title: 'Café Menu Board', description: 'Coffee shop style', category: 'menu' },
        { title: 'Food Truck Menu', description: 'Street food design', category: 'menu' },
        { title: 'Bar Menu', description: 'Cocktail and drinks', category: 'menu' },
      ],
      popular: [
        { title: 'Pizza Menu', description: 'Italian restaurant', category: 'menu' },
        { title: 'Breakfast Menu', description: 'Morning specials', category: 'menu' },
        { title: 'Wine List', description: 'Sommelier selection', category: 'menu' },
        { title: 'Dessert Menu', description: 'Sweet treats', category: 'menu' },
        { title: 'Kids Menu', description: 'Child-friendly', category: 'menu' },
        { title: 'Vegan Menu', description: 'Plant-based options', category: 'menu' },
      ],
      all: Array.from({ length: 12 }, (_, i) => ({
        title: `Menu Template ${i + 1}`,
        description: 'Custom menu design',
        category: 'menu',
      })),
    },
    SOCIAL: {
      featured: [
        { title: 'Instagram Story Template', description: 'Social media post', category: 'social' },
        { title: 'Facebook Cover', description: 'Profile banner', category: 'social' },
        { title: 'LinkedIn Post', description: 'Professional content', category: 'social' },
        { title: 'Twitter Header', description: 'Profile design', category: 'social' },
      ],
      popular: [
        { title: 'Instagram Reel Cover', description: 'Video thumbnail', category: 'social' },
        { title: 'YouTube Thumbnail', description: 'Video preview', category: 'social' },
        { title: 'TikTok Video Cover', description: 'Short form content', category: 'social' },
        { title: 'Pinterest Pin', description: 'Visual discovery', category: 'social' },
        { title: 'Snapchat Geofilter', description: 'Location-based', category: 'social' },
        { title: 'WhatsApp Status', description: 'Story format', category: 'social' },
      ],
      all: Array.from({ length: 12 }, (_, i) => ({
        title: `Social Media Template ${i + 1}`,
        description: 'Custom social design',
        category: 'social',
      })),
    },
    BRAND: {
      featured: [
        { title: 'Startup Brand Kit', description: 'Complete identity', category: 'brand' },
        { title: 'Logo Design Package', description: 'Brand mark set', category: 'brand' },
        { title: 'Business Card Set', description: 'Professional cards', category: 'brand' },
        { title: 'Letterhead Template', description: 'Official documents', category: 'brand' },
      ],
      popular: [
        { title: 'Brand Guidelines', description: 'Style guide', category: 'brand' },
        { title: 'Social Media Kit', description: 'Brand consistency', category: 'brand' },
        { title: 'Email Signature', description: 'Professional footer', category: 'brand' },
        { title: 'Presentation Template', description: 'Branded slides', category: 'brand' },
        { title: 'Invoice Template', description: 'Business billing', category: 'brand' },
        { title: 'Website Header', description: 'Online presence', category: 'brand' },
      ],
      all: Array.from({ length: 12 }, (_, i) => ({
        title: `Brand Template ${i + 1}`,
        description: 'Custom brand design',
        category: 'brand',
      })),
    },
    INVITE: {
      featured: [
        { title: 'Wedding Invitation Suite', description: 'Complete set', category: 'invite' },
        { title: 'Birthday Party Invite', description: 'Celebration design', category: 'invite' },
        { title: 'Corporate Event Invite', description: 'Professional event', category: 'invite' },
        { title: 'Baby Shower Invite', description: 'Welcome celebration', category: 'invite' },
      ],
      popular: [
        { title: 'Graduation Invite', description: 'Achievement celebration', category: 'invite' },
        { title: 'Holiday Party Invite', description: 'Seasonal gathering', category: 'invite' },
        { title: 'Housewarming Invite', description: 'New home celebration', category: 'invite' },
        { title: 'Anniversary Invite', description: 'Milestone celebration', category: 'invite' },
        { title: 'Retirement Party Invite', description: 'Career celebration', category: 'invite' },
        { title: 'Fundraiser Invite', description: 'Charity event', category: 'invite' },
      ],
      all: Array.from({ length: 12 }, (_, i) => ({
        title: `Invitation Template ${i + 1}`,
        description: 'Custom invitation design',
        category: 'invite',
      })),
    },
  };

  // Default templates if category not found
  const defaultTemplates = {
    featured: [
      { title: 'Creative Template', description: 'Versatile design', category: 'general' },
      { title: 'Modern Template', description: 'Contemporary style', category: 'general' },
      { title: 'Professional Template', description: 'Business ready', category: 'general' },
      { title: 'Artistic Template', description: 'Creative expression', category: 'general' },
    ],
    popular: Array.from({ length: 6 }, (_, i) => ({
      title: `Popular Template ${i + 1}`,
      description: 'Trending design',
      category: 'general',
    })),
    all: Array.from({ length: 12 }, (_, i) => ({
      title: `Template ${i + 1}`,
      description: 'Custom design',
      category: 'general',
    })),
  };

  return baseTemplates[category as keyof typeof baseTemplates] || defaultTemplates;
};

export const getInspirationTemplates = (category?: string) => {
  return getTemplatesByCategory(category);
};
