/**
 * Template data loader for the Templates page
 * Aggregates templates from JSON data files
 * Favors social media templates, avoids education and corporate templates
 */

import socialMediaData from '@/assets/templates/social-media.json';
import marketingData from '@/assets/templates/marketing.json';
import videoData from '@/assets/templates/video.json';
import cardsData from '@/assets/templates/cards-and-invitations.json';

export interface Template {
  id: string;
  name: string;
  url: string;
  image: string;
  preview?: string;
  author_name?: string;
  author_url?: string;
  author_image?: string;
}

export interface TemplateCategory {
  category: string;
  subcategories: Record<string, Template[]>;
}

// Type for the JSON data structure
type TemplateData = {
  category: string;
  subcategories: Record<string, Template[]>;
};

// Subcategories to exclude (corporate/education focused)
const excludedSubcategories = new Set([
  'Resumes',
  'Invoices',
  'Business Cards',
  'Letterheads',
  'Reports',
  'Proposals',
  'Graphs',
  'Planners',
  'Calendars',
  'Worksheets and activities',
  'Flashcards',
  'Lesson Plans',
  'Report Cards',
  'Class Schedules',
  'Daily Agendas',
  'Graphic Organizers',
  'Bound Documents',
  'Notepads',
  'Infographics',
]);

// Preferred subcategories (social media & creative)
const preferredSubcategories = new Set([
  'Instagram Posts',
  'Instagram Stories',
  'Instagram Reels',
  'Facebook Posts',
  'Facebook Covers',
  'TikTok Videos',
  'Pinterest Pins',
  'Your Stories',
  'Animated Social Media',
  'Twitter Posts',
  'Facebook Videos',
  'Mobile Videos',
  'YouTube Videos',
  'Video Messages',
  'Invitations',
  'Cards',
]);

// Template data sources (excluding education and business)
const allTemplateData: TemplateData[] = [
  socialMediaData as TemplateData,
  videoData as TemplateData,
  marketingData as TemplateData,
  cardsData as TemplateData,
];

/**
 * Filter templates from a subcategory
 */
function isAllowedSubcategory(subcategoryName: string): boolean {
  return !excludedSubcategories.has(subcategoryName);
}

/**
 * Check if subcategory is preferred (social media focused)
 */
function isPreferredSubcategory(subcategoryName: string): boolean {
  return preferredSubcategories.has(subcategoryName);
}

/**
 * Get all templates from all categories flattened into a single array
 * Filters out excluded subcategories
 */
export function getAllTemplates(): Template[] {
  const templates: Template[] = [];

  for (const data of allTemplateData) {
    for (const [subcategoryName, subcategoryTemplates] of Object.entries(data.subcategories)) {
      if (isAllowedSubcategory(subcategoryName)) {
        templates.push(...subcategoryTemplates);
      }
    }
  }

  return templates;
}

/**
 * Get preferred templates (social media focused)
 */
export function getPreferredTemplates(): Template[] {
  const templates: Template[] = [];

  for (const data of allTemplateData) {
    for (const [subcategoryName, subcategoryTemplates] of Object.entries(data.subcategories)) {
      if (isPreferredSubcategory(subcategoryName)) {
        templates.push(...subcategoryTemplates);
      }
    }
  }

  return templates;
}

/**
 * Get templates by category name
 */
export function getTemplatesByCategory(categoryName: string): Template[] {
  const data = allTemplateData.find(d => d.category.toLowerCase() === categoryName.toLowerCase());

  if (!data) return [];

  const templates: Template[] = [];
  for (const subcategory of Object.values(data.subcategories)) {
    templates.push(...subcategory);
  }

  return templates;
}

/**
 * Get templates by subcategory name (searches across all categories)
 */
export function getTemplatesBySubcategory(subcategoryName: string): Template[] {
  for (const data of allTemplateData) {
    const normalizedName = subcategoryName.toLowerCase().replace(/\s+/g, ' ');

    for (const [key, templates] of Object.entries(data.subcategories)) {
      if (key.toLowerCase().replace(/\s+/g, ' ') === normalizedName) {
        return templates;
      }
    }
  }

  return [];
}

/**
 * Get a random selection of templates
 * Favors preferred (social media) templates - 70% preferred, 30% other
 */
export function getRandomTemplates(count: number, seed?: number): Template[] {
  const preferred = getPreferredTemplates();
  const all = getAllTemplates();

  // Simple seeded random function
  const createRandom = (s: number) => () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };

  const random = seed !== undefined ? createRandom(seed) : Math.random;

  // Shuffle preferred templates
  const shuffledPreferred = [...preferred];
  for (let i = shuffledPreferred.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffledPreferred[i], shuffledPreferred[j]] = [shuffledPreferred[j], shuffledPreferred[i]];
  }

  // Shuffle all templates
  const shuffledAll = [...all];
  for (let i = shuffledAll.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffledAll[i], shuffledAll[j]] = [shuffledAll[j], shuffledAll[i]];
  }

  // Take 70% from preferred, 30% from all (avoiding duplicates)
  const preferredCount = Math.ceil(count * 0.7);
  const otherCount = count - preferredCount;

  const result: Template[] = [];
  const usedIds = new Set<string>();

  // Add preferred templates first
  for (const template of shuffledPreferred) {
    if (result.length >= preferredCount) break;
    if (!usedIds.has(template.id)) {
      result.push(template);
      usedIds.add(template.id);
    }
  }

  // Fill remaining with other templates
  for (const template of shuffledAll) {
    if (result.length >= count) break;
    if (!usedIds.has(template.id)) {
      result.push(template);
      usedIds.add(template.id);
    }
  }

  // Final shuffle to mix preferred and other
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Get templates for "Inspired by your designs" section
 * Mix of various categories to simulate personalized recommendations
 */
export function getInspiredTemplates(count: number = 12): Template[] {
  return getRandomTemplates(count, 42);
}

/**
 * Get templates for "Discover Canva" section
 * Features diverse template types
 */
export function getDiscoverTemplates(count: number = 12): Template[] {
  return getRandomTemplates(count, 123);
}

/**
 * Get templates for "Trending near you" section
 * Focuses on social media templates
 */
export function getTrendingTemplates(count: number = 12): Template[] {
  // Primarily social media templates
  const socialMedia = getTemplatesByCategory('Social Media').slice(0, 8);
  const video = getTemplatesByCategory('Video').slice(0, 4);

  return [...socialMedia, ...video].slice(0, count);
}

/**
 * Get templates for "What's new" section
 * Could be filtered by date in a real app
 */
export function getWhatsNewTemplates(count: number = 12): Template[] {
  return getRandomTemplates(count, 456);
}

/**
 * Get templates for "More templates for you" masonry grid
 * Returns a larger set for infinite scroll feel
 */
export function getMasonryTemplates(count: number = 30): Template[] {
  return getRandomTemplates(count, 789);
}

/**
 * Get all subcategory names for filtering/pills
 */
export function getAllSubcategories(): string[] {
  const subcategories = new Set<string>();

  for (const data of allTemplateData) {
    for (const key of Object.keys(data.subcategories)) {
      subcategories.add(key);
    }
  }

  return Array.from(subcategories).sort();
}

/**
 * Get category names
 */
export function getAllCategories(): string[] {
  return allTemplateData.map(d => d.category);
}
