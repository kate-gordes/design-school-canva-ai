import presentationImg from '@/assets/categories/categorythumbnail_presentation3.webp';
import docImg from '@/assets/categories/categorythumbnail_docs.webp';
import videoImg from '@/assets/categories/categorythumbnail_videolandscape22.webp';
import instagramPostImg from '@/assets/categories/categorythumbnail_instagrampost.webp';
import instagramStoryImg from '@/assets/categories/categorythumbnail_instagramstory2.webp';
import posterImg from '@/assets/categories/categorythumbnail_poster.webp';
import sheetImg from '@/assets/categories/categorythumbnail_sheets.webp';
import websiteImg from '@/assets/categories/categorythumbnail_website3.webp';
import flyerImg from '@/assets/categories/categorythumbnail_flyer.webp';
import emailImg from '@/assets/categories/categorythumbnail_email2.webp';
import resumeImg from '@/assets/categories/categorythumbnail_resume2.webp';
import logoImg from '@/assets/categories/categorythumbnail_logo.webp';
import brochureImg from '@/assets/categories/categorythumbnail_brochure3.webp';
import menuImg from '@/assets/categories/categorythumbnail_menu.webp';
import invitationImg from '@/assets/categories/categorythumbnail_invitation.webp';
import mobileVideoImg from '@/assets/categories/categorythumbnail_mobilevideo22.webp';
import facebookPostImg from '@/assets/categories/categorythumbnail_facebookpost.webp';
import businessCardImg from '@/assets/categories/categorythumbnail_businesscard3.webp';
import photoCollageImg from '@/assets/categories/categorythumbnail_photocollage3.webp';
import whiteboardImg from '@/assets/categories/categorythumbnail_whiteboards.webp';

export interface DoctypeCategory {
  id: string;
  label: string;
  gradientStart: string;
  gradientEnd: string;
  imagePath?: string;
  route: string;
}

// Order must match the "Explore templates" screenshots (column-pair order,
// top then bottom in each column, left-to-right).
// Flat order = 21 items paired sequentially into 11 columns.
export const templatesDoctypeCategories: DoctypeCategory[] = [
  // Col 1
  {
    id: 'presentation',
    label: 'Presentation',
    gradientStart: '#FFE5CC',
    gradientEnd: '#FFF0E0',
    imagePath: presentationImg,
    route: '/templates/presentation',
  },
  {
    id: 'instagram-post',
    label: 'Instagram Post',
    gradientStart: '#FFCCDD',
    gradientEnd: '#FFE6F0',
    imagePath: instagramPostImg,
    route: '/templates/instagram-post',
  },
  // Col 2
  {
    id: 'poster',
    label: 'Poster',
    gradientStart: '#D8C8F5',
    gradientEnd: '#EFE7FE',
    imagePath: posterImg,
    route: '/templates/poster',
  },
  {
    id: 'instagram-story',
    label: 'Instagram Story',
    gradientStart: '#FFD0E0',
    gradientEnd: '#FFE8F0',
    imagePath: instagramStoryImg,
    route: '/templates/instagram-story',
  },
  // Col 3
  {
    id: 'resume',
    label: 'Resume',
    gradientStart: '#B8E8E5',
    gradientEnd: '#E0F5F3',
    imagePath: resumeImg,
    route: '/templates/resume',
  },
  {
    id: 'landscape-video',
    label: 'Landscape Video',
    gradientStart: '#D8C8F5',
    gradientEnd: '#EFE7FE',
    imagePath: videoImg,
    route: '/templates/landscape-video',
  },
  // Col 4
  {
    id: 'email',
    label: 'Email',
    gradientStart: '#D4D9F5',
    gradientEnd: '#E8EAF9',
    imagePath: emailImg,
    route: '/templates/email',
  },
  {
    id: 'code',
    label: 'Code',
    gradientStart: '#D4D9F5',
    gradientEnd: '#E8EAF9',
    imagePath: websiteImg,
    route: '/templates/code',
  },
  // Col 5
  {
    id: 'invitation',
    label: 'Invitation',
    gradientStart: '#D8C8F5',
    gradientEnd: '#EFE7FE',
    imagePath: invitationImg,
    route: '/templates/invitation',
  },
  {
    id: 'logo',
    label: 'Logo',
    gradientStart: '#FFF4CC',
    gradientEnd: '#FFFAE6',
    imagePath: logoImg,
    route: '/templates/logo',
  },
  // Col 6
  {
    id: 'mobile-video',
    label: 'Mobile Video',
    gradientStart: '#E6D5F5',
    gradientEnd: '#F3EBFA',
    imagePath: mobileVideoImg,
    route: '/templates/mobile-video',
  },
  {
    id: 'flyer',
    label: 'Flyer',
    gradientStart: '#D8C8F5',
    gradientEnd: '#EFE7FE',
    imagePath: flyerImg,
    route: '/templates/flyer',
  },
  // Col 7
  {
    id: 'facebook-post',
    label: 'Facebook Post',
    gradientStart: '#FFDDE5',
    gradientEnd: '#FFEEF2',
    imagePath: facebookPostImg,
    route: '/templates/facebook-post',
  },
  {
    id: 'brochure',
    label: 'Brochure',
    gradientStart: '#E6D5F5',
    gradientEnd: '#F3EBFA',
    imagePath: brochureImg,
    route: '/templates/brochure',
  },
  // Col 8
  {
    id: 'business-card',
    label: 'Business Card',
    gradientStart: '#E6D5F5',
    gradientEnd: '#F3EBFA',
    imagePath: businessCardImg,
    route: '/templates/business-card',
  },
  {
    id: 'menu',
    label: 'Menu',
    gradientStart: '#D9D1F5',
    gradientEnd: '#EDE9FA',
    imagePath: menuImg,
    route: '/templates/menu',
  },
  // Col 9
  {
    id: 'photo-collage',
    label: 'Photo Collage',
    gradientStart: '#FFF4CC',
    gradientEnd: '#FFFAE6',
    imagePath: photoCollageImg,
    route: '/templates/photo-collage',
  },
  {
    id: 'doc',
    label: 'Doc',
    gradientStart: '#B8DFF2',
    gradientEnd: '#E0F1F9',
    imagePath: docImg,
    route: '/templates/doc',
  },
  // Col 10
  {
    id: 'whiteboard',
    label: 'Whiteboard',
    gradientStart: '#D4F0E8',
    gradientEnd: '#E8F7F3',
    imagePath: whiteboardImg,
    route: '/templates/whiteboard',
  },
  {
    id: 'website',
    label: 'Website',
    gradientStart: '#D4D9F5',
    gradientEnd: '#E8EAF9',
    imagePath: websiteImg,
    route: '/templates/website',
  },
  // Col 11 (single item, bottom row empty)
  {
    id: 'sheet',
    label: 'Sheet',
    gradientStart: '#B8D9FF',
    gradientEnd: '#E0EDFF',
    imagePath: sheetImg,
    route: '/templates/sheet',
  },
];
