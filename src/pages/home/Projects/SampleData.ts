import type { ProjectDesign } from '@/pages/Home/components/CardThumbnails';
import type { FolderData } from '@/pages/Home/components/FoldersSection';
import type { ImageData } from '@/pages/Home/Projects/components/ImagesSection';
import type { VideoData } from '@/pages/Home/Projects/components/VideosSection';
import type { FileData } from '@/pages/Home/Projects/components/FilesSection';
import type { SuggestionItem } from '@/shared_components/Search';
// Import shared recent designs for unified Recents section
import { recentDesigns, type RecentDesign } from '@/data/data';

// Re-export recentDesigns so Projects page uses the same data as Home page
export { recentDesigns };

export function recentsToProjectDesigns(designs: RecentDesign[]): ProjectDesign[] {
  return designs.map(design => ({
    id: design.id,
    title: design.title,
    doctype: design.doctype,
    private: design.private,
    lastModified: design.editedTime?.replace('Edited ', '') || 'Recently edited',
    thumbnailUrl: design.thumbnailUrl,
    containedDoctypes: design.containedDoctypes,
  }));
}

// Convert RecentDesign to ProjectDesign format for the Recents carousel
export const projectRecents: ProjectDesign[] = recentsToProjectDesigns(recentDesigns);

// Additional project data for the Designs section (not recents)
// These are older designs that appear in the full Designs grid but not in Recents
export const projectData: ProjectDesign[] = projectRecents;

// Folder data
export const folderData: FolderData[] = [
  {
    id: '1',
    name: 'Client Work',
    isPrivate: false,
    itemCount: 47,
  },
  {
    id: '2',
    name: 'Jacaranda Seedlings Co.',
    isPrivate: false,
    itemCount: 12,
  },
  {
    id: '3',
    name: 'Barceló Studio',
    isPrivate: true,
    itemCount: 8,
  },
  {
    id: '4',
    name: 'Hannah Jewellery',
    isPrivate: false,
    itemCount: 15,
  },
  {
    id: '5',
    name: 'Café Palermo',
    isPrivate: true,
    itemCount: 9,
  },
  {
    id: '6',
    name: 'Florería Rosa',
    isPrivate: false,
    itemCount: 11,
  },
  {
    id: '7',
    name: 'Content Calendars',
    isPrivate: true,
    itemCount: 24,
  },
  {
    id: '8',
    name: 'Social Media Templates',
    isPrivate: true,
    itemCount: 38,
  },
  {
    id: '9',
    name: 'Campaign Assets',
    isPrivate: false,
    itemCount: 19,
  },
  {
    id: '10',
    name: 'Instagram Templates',
    isPrivate: true,
    itemCount: 22,
  },
  {
    id: '11',
    name: 'Reels & Stories',
    isPrivate: true,
    itemCount: 16,
  },
  {
    id: '12',
    name: 'Personal',
    isPrivate: true,
    itemCount: 6,
  },
];

// Image data - brand and product photography for social media work
export const imageData: ImageData[] = [
  {
    id: '1',
    name: 'jacaranda-spring-collection-hero.jpg',
    type: 'Image',
    size: '2.4 MB',
    lastModified: '2 days ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '2',
    name: 'cafe-palermo-flat-lay-coffee.jpg',
    type: 'Image',
    size: '1.8 MB',
    lastModified: '3 days ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '3',
    name: 'nomad-surf-lifestyle-shoot.jpg',
    type: 'Image',
    size: '3.1 MB',
    lastModified: '5 days ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '4',
    name: 'floreria-rosa-arrangements-april.jpg',
    type: 'Image',
    size: '1.2 MB',
    lastModified: '1 week ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '5',
    name: 'hannah-jewellery-easter-rings.jpg',
    type: 'Image',
    size: '2.6 MB',
    lastModified: '1 week ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '6',
    name: 'barcelo-studio-workspace-mood.jpg',
    type: 'Image',
    size: '1.9 MB',
    lastModified: '2 weeks ago',
    isPrivate: true,
    thumbnailUrl:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '7',
    name: 'luna-spa-treatment-room.jpg',
    type: 'Image',
    size: '2.8 MB',
    lastModified: '2 weeks ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '8',
    name: 'cafe-palermo-pastry-selection.jpg',
    type: 'Image',
    size: '1.5 MB',
    lastModified: '3 weeks ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '9',
    name: 'jacaranda-seedlings-closeup.jpg',
    type: 'Image',
    size: '980 kB',
    lastModified: '3 weeks ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1367242/pexels-photo-1367242.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '10',
    name: 'nomad-surf-board-lineup.jpg',
    type: 'Image',
    size: '1.7 MB',
    lastModified: '1 month ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '11',
    name: 'hannah-jewellery-necklace-hero.jpg',
    type: 'Image',
    size: '2.2 MB',
    lastModified: '1 month ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '12',
    name: 'floreria-rosa-storefront.jpg',
    type: 'Image',
    size: '1.1 MB',
    lastModified: '1 month ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1070536/pexels-photo-1070536.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '13',
    name: 'barcelo-studio-brand-assets.jpg',
    type: 'Image',
    size: '1.4 MB',
    lastModified: '2 months ago',
    isPrivate: true,
    thumbnailUrl:
      'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '14',
    name: 'luna-spa-product-oils.jpg',
    type: 'Image',
    size: '2.9 MB',
    lastModified: '2 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '15',
    name: 'cafe-palermo-exterior-day.jpg',
    type: 'Image',
    size: '1.6 MB',
    lastModified: '2 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '16',
    name: 'jacaranda-summer-range-2026.jpg',
    type: 'Image',
    size: '1.3 MB',
    lastModified: '3 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '17',
    name: 'nomad-surf-ocean-lifestyle.jpg',
    type: 'Image',
    size: '2.1 MB',
    lastModified: '3 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1268558/pexels-photo-1268558.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '18',
    name: 'luna-spa-welcome-suite.jpg',
    type: 'Image',
    size: '1.8 MB',
    lastModified: '3 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

// Video data - social media content videos for client work
export const videoData: VideoData[] = [
  {
    id: '1',
    name: 'jacaranda-spring-reel-draft-v2.mp4',
    type: 'Video',
    size: '156 MB',
    lastModified: '2 days ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/368763065.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '2',
    name: 'cafe-palermo-latte-art-reel.mp4',
    type: 'Video',
    size: '89 MB',
    lastModified: '4 days ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/371867169.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '3',
    name: 'hannah-jewellery-easter-unboxing.mov',
    type: 'Video',
    size: '234 MB',
    lastModified: '1 week ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/370331493.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '4',
    name: 'floreria-rosa-arrangement-timelapse.mp4',
    type: 'Video',
    size: '312 MB',
    lastModified: '1 week ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/371867169.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '5',
    name: 'luna-spa-ambience-story.mov',
    type: 'Video',
    size: '67 MB',
    lastModified: '2 weeks ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/370331493.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '6',
    name: 'nomad-surf-wave-compilation.mp4',
    type: 'Video',
    size: '445 MB',
    lastModified: '2 weeks ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1365425/pexels-photo-1365425.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/368763065.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '7',
    name: 'barcelo-studio-process-reel.mov',
    type: 'Video',
    size: '178 MB',
    lastModified: '3 weeks ago',
    isPrivate: true,
    thumbnailUrl:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/370331493.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '8',
    name: 'jacaranda-behind-scenes-nursery.mp4',
    type: 'Video',
    size: '52 MB',
    lastModified: '1 month ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/368763065.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '9',
    name: 'cafe-palermo-menu-highlights.mov',
    type: 'Video',
    size: '34 MB',
    lastModified: '1 month ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/371867169.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '10',
    name: 'hannah-jewellery-valentines-reel.mp4',
    type: 'Video',
    size: '289 MB',
    lastModified: '2 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/368763065.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '11',
    name: 'luna-spa-seasonal-promo.mov',
    type: 'Video',
    size: '198 MB',
    lastModified: '2 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/370331493.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
  {
    id: '12',
    name: 'nomad-surf-summer-recap.mp4',
    type: 'Video',
    size: '76 MB',
    lastModified: '3 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=400',
    videoUrl:
      'https://player.vimeo.com/external/368763065.sd.mp4?s=13d7c42e7e0e8c0d9f9f1d9c7e4e0e2e4e0e2e4e&profile_id=164&oauth2_token_id=57447761',
  },
];

// File data - client deliverables, brand assets, and project files
export const fileData: FileData[] = [
  {
    id: '1',
    name: 'Jacaranda_BrandGuidelines_v3.pdf',
    fileType: 'PDF',
    size: '8.2 MB',
    lastModified: '1 week ago',
    isPrivate: false,
  },
  {
    id: '2',
    name: 'Valentina_Content_Brief_April2026.docx',
    fileType: 'DOCX',
    size: '420 KB',
    lastModified: '1 week ago',
    isPrivate: true,
  },
  {
    id: '3',
    name: 'Hannah_Jewellery_Easter_Brief.pdf',
    fileType: 'PDF',
    size: '1.1 MB',
    lastModified: '2 weeks ago',
    isPrivate: false,
  },
  {
    id: '4',
    name: 'CafePalermo_MenuPhotography_Notes.txt',
    fileType: 'TXT',
    size: '12 KB',
    lastModified: '2 weeks ago',
    isPrivate: false,
  },
  {
    id: '5',
    name: 'Social_Media_Schedule_Q2_2026.xlsx',
    fileType: 'XLSX',
    size: '340 KB',
    lastModified: '3 weeks ago',
    isPrivate: true,
  },
  {
    id: '6',
    name: 'Barcelo_Studio_Feedback_Round2.pdf',
    fileType: 'PDF',
    size: '2.4 MB',
    lastModified: '3 weeks ago',
    isPrivate: true,
  },
  {
    id: '7',
    name: 'Floreria_Rosa_ColorPalette_HEX.txt',
    fileType: 'TXT',
    size: '3 KB',
    lastModified: '1 month ago',
    isPrivate: false,
  },
  {
    id: '8',
    name: 'NomadSurf_AssetDelivery_March.zip',
    fileType: 'ZIP',
    size: '312 MB',
    lastModified: '1 month ago',
    isPrivate: false,
  },
  {
    id: '9',
    name: 'Luna_Spa_Photography_Pack.zip',
    fileType: 'ZIP',
    size: '78 MB',
    lastModified: '1 month ago',
    isPrivate: false,
  },
  {
    id: '10',
    name: 'Q1_Performance_Report_Draft.xlsx',
    fileType: 'XLSX',
    size: '560 KB',
    lastModified: '2 months ago',
    isPrivate: true,
  },
  {
    id: '11',
    name: 'Valentina_Agency_Credentials.pdf',
    fileType: 'PDF',
    size: '4.8 MB',
    lastModified: '2 months ago',
    isPrivate: true,
  },
  {
    id: '12',
    name: 'Client_Onboarding_Checklist.docx',
    fileType: 'DOCX',
    size: '88 KB',
    lastModified: '2 months ago',
    isPrivate: true,
  },
  {
    id: '13',
    name: 'Hannah_Jewellery_Brand_Assets.zip',
    fileType: 'ZIP',
    size: '145 MB',
    lastModified: '2 months ago',
    isPrivate: false,
  },
  {
    id: '14',
    name: 'Jacaranda_SeedlingsCo_Identity.afdesign',
    fileType: 'AF',
    size: '156 MB',
    lastModified: '3 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '15',
    name: 'Barcelo_Studio_StyleGuide.afdesign',
    fileType: 'AF',
    size: '89 MB',
    lastModified: '3 months ago',
    isPrivate: true,
    thumbnailUrl:
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '16',
    name: 'Floreria_Rosa_Campaign_Assets.afdesign',
    fileType: 'AF',
    size: '234 MB',
    lastModified: '4 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/931177/pexels-photo-931177.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '17',
    name: 'Luna_Spa_BrandKit_2025.afdesign',
    fileType: 'AF',
    size: '167 MB',
    lastModified: '4 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: '18',
    name: 'CafePalermo_MenuDesign_Final.afdesign',
    fileType: 'AF',
    size: '312 MB',
    lastModified: '5 months ago',
    isPrivate: false,
    thumbnailUrl:
      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

// Sample suggestions data for Valentina's social media work
export const suggestions: SuggestionItem[] = [
  { id: '1', text: 'Jacaranda Seedlings April content', type: 'recent' },
  { id: '2', text: 'Hannah Jewellery Easter posts', type: 'recent' },
  { id: '3', text: 'Jacaranda Seedlings Co. — April Posts', type: 'design' },
  { id: '4', text: 'Hannah Jewellery — Easter Collection Campaign', type: 'design' },
  { id: '5', text: 'Content Calendar — April 2026', type: 'design' },
  {
    id: '6',
    text: 'Client Work',
    type: 'folder',
    label: 'Folder',
    href: '/folder/client-work',
  },
  {
    id: '7',
    text: 'Social Media Templates',
    type: 'folder',
    label: 'Folder',
    href: '/folder/social-media-templates',
  },
  {
    id: '8',
    text: 'Instagram Story Template',
    type: 'template',
    label: 'Brand Template',
    href: '/design?create&title=Instagram%20Story%20Template&template=instagram-story',
  },
  {
    id: '9',
    text: 'Client Proposal Template',
    type: 'template',
    label: 'Brand Template',
    href: '/design?create&title=Client%20Proposal%20Template&template=client-proposal',
  },
];
