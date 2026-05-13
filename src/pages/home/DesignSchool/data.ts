/**
 * Shared content for the Design School landing page (mobile + desktop).
 *
 * Lives separately from the AI-suggestion catalog (`@/data/designSchoolCatalog`)
 * because the landing page surfaces a curated, marketing-style mix
 * (courses, lessons, certifications) rather than the just-in-time
 * suggestions the AI panel pulls from. Keeping the two data sources
 * apart means the AI tip surface and the destination page can evolve
 * independently.
 *
 * Both `MobileDesignSchool` and `DesktopDesignSchool` consume these
 * arrays so the two surfaces stay in sync.
 */

export interface DesignSchoolPill {
  id: string;
  label: string;
}

export interface DesignSchoolCourse {
  id: string;
  title: string;
  /** Display string e.g. `"1h 9m"`, `"8m"`. */
  duration?: string;
  /** Optional difficulty hint, e.g. `"Beginner"`. */
  level?: string;
  /** Optional certification badge string. */
  certificate?: string;
  /** Card eyebrow — `"Course"`, `"Lesson"`, `"Video"`. */
  type: string;
  imageUrl: string;
}

export const DESIGN_SCHOOL_PILLS: DesignSchoolPill[] = [
  { id: 'new-in-canva', label: 'New in Canva' },
  { id: 'get-started', label: 'Get started' },
  { id: 'certified-courses', label: 'Certified courses' },
  { id: 'video-editing', label: 'Video editing' },
  { id: 'templates', label: 'Templates' },
];

export const UP_NEXT_COURSES: DesignSchoolCourse[] = [
  {
    id: 'visual-suite',
    title: "Meet Canva's Visual Suite",
    duration: '1h 9m',
    type: 'Course',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
  },
  {
    id: 'canva-essentials',
    title: 'Canva essentials',
    duration: '1h',
    level: 'Beginner',
    certificate: 'Shareable certificate',
    type: 'Course',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
  },
];

export const LATEST_COURSES: DesignSchoolCourse[] = [
  {
    id: 'edit-photos',
    title: 'Edit photos like a pro',
    type: 'Lesson',
    imageUrl: 'https://images.unsplash.com/photo-1452457807411-4979b707c5be?w=800&h=600&fit=crop',
  },
  {
    id: 'work-smarter-ai',
    title: 'Work smarter with AI',
    duration: '1h',
    level: 'Beginner',
    type: 'Course',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop',
  },
];

export const ENHANCE_WORKFLOWS_COURSES: DesignSchoolCourse[] = [
  {
    id: 'linkedin-ads',
    title: 'Launch engaging campaigns with LinkedIn Ads in Canva',
    duration: '8m',
    level: 'Beginner',
    type: 'Video',
    imageUrl: 'https://images.unsplash.com/photo-1611944212129-29977ae1398c?w=800&h=600&fit=crop',
  },
  {
    id: 'linkedin-videos',
    title: 'Stand out fast with LinkedIn videos',
    duration: '7m',
    level: 'Beginner',
    type: 'Video',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
  },
];
