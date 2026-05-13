/**
 * Design School learning content catalog.
 *
 * Curated lessons surfaced inside the Canva AI panel when a user asks a
 * question that maps to a known Design School topic (e.g. "How do I design a
 * great logo?"). Imagery and tone match the existing Design School page in
 * `src/pages/home/DesignSchool/MobileDesignSchool.tsx`.
 *
 * Items split into two render groups inside the chat:
 *   - "Inline" media (Video / Activity / Cheatsheet) renders as embedded
 *     media cards at the top of the message.
 *   - "Further learning" (Lesson / Course) renders below in a separate
 *     "Explore further learning in Design School" section.
 */

import { cdn } from '@/utils/cdn';
import brandKitActivityImage from '@/assets/design-school/brand-kit-activity.png';
import personalLogoCheatsheetImage from '@/assets/design-school/personal-logo-cheatsheet.png';

// Inline (Activity / Cheatsheet) cards use the original product screenshots
// shipped with this prototype so the imagery stays specific to each card.
// The larger "Explore further learning" Course / Lesson cards use the
// full-bleed BrandCardImage artworks (Fonts, Emojis) from the brand-cards
// CDN since they have a wider 16:9 thumbnail.
const brandKitActivityCardImage = brandKitActivityImage;
const personalLogoCheatsheetCardImage = personalLogoCheatsheetImage;
const logoDesignFundamentalsCardImage = cdn('brand-cards/BrandCardImage_Fonts.png');
const designALogoInCanvaCardImage = cdn('brand-cards/BrandCardImage_Emojis.png');

export type LearningItemType = 'Course' | 'Lesson' | 'Video' | 'Activity' | 'Cheatsheet';

/**
 * One entry in a video's transcript. `start` is the moment in seconds where
 * the line begins; the next entry's `start` (or the end of the video) marks
 * where the line ends. The Transcript panel highlights the line whose
 * window the YouTube player is currently inside.
 */
export type TranscriptLine = {
  start: number;
  text: string;
};

export type LearningItem = {
  id: string;
  title: string;
  type: LearningItemType;
  duration: string;
  level?: string;
  imageUrl: string;
  // Optional: when set, the inline video card swaps its thumbnail for an
  // embedded YouTube/Vimeo player on click instead of just opening externally.
  videoEmbedUrl?: string;
  // Course / series / lesson breadcrumb shown above the description in the
  // video panel, e.g. "Graphic Design Essentials · Lesson 1".
  series?: string;
  // Long-form description shown beneath the title in the video panel.
  description?: string;
  // Optional video transcript displayed in the "Transcript" drawer below
  // the player. Lines must be ordered by ascending `start`.
  transcript?: TranscriptLine[];
};

/**
 * Auto-generated-style transcript for the "Optimizing brand presence" Design
 * School video on YouTube (https://www.youtube.com/watch?v=TWvrXGgTg7o).
 * The first ~10 entries are lifted directly from the YouTube transcript
 * panel; the remainder paraphrase the rest of the 3-minute walkthrough so
 * the prototype's transcript drawer feels real and the active-line
 * highlighting has enough lines to scroll through.
 */
const LOGO_DESIGN_VIDEO_TRANSCRIPT: TranscriptLine[] = [
  { start: 0, text: "think about the world's most iconic" },
  { start: 2, text: 'Brands the ones that are instantly' },
  { start: 4, text: 'recognizable no matter where you see' },
  { start: 6, text: "them I'm sure a few companies have" },
  { start: 8, text: "sprung to mind you see they don't just" },
  { start: 10, text: 'have logos they have identities to' },
  { start: 13, text: 'create that kind of marketing impact' },
  { start: 15, text: 'brand consistency is your secret source' },
  { start: 18, text: 'canva is here to help with that and' },
  { start: 20, text: "that's what we're going to focus on in" },
  { start: 22, text: "the next three minutes a logo that's" },
  { start: 24, text: 'memorable simple and unmistakably yours' },
  { start: 27, text: 'first up open Canva and search for logo' },
  { start: 30, text: "in the top bar you'll see hundreds of" },
  { start: 32, text: 'professionally designed templates' },
  { start: 34, text: 'organized by industry style and color' },
  { start: 37, text: "don't get overwhelmed pick one that" },
  { start: 39, text: 'feels close to the vibe you want we can' },
  { start: 41, text: 'change literally everything from here' },
  { start: 44, text: 'next think about your brand personality' },
  { start: 46, text: 'is it bold and playful calm and' },
  { start: 49, text: 'professional or somewhere in between' },
  { start: 51, text: 'that personality should drive every' },
  { start: 53, text: 'choice you make from this point on so' },
  { start: 56, text: "let's start with type click on the" },
  { start: 58, text: 'wordmark and try a few fonts I love' },
  { start: 60, text: 'pairing a strong display font with' },
  { start: 62, text: 'something a little softer for contrast' },
  { start: 65, text: 'remember the font is doing half the work' },
  { start: 67, text: 'so spend a moment getting it right' },
  { start: 70, text: 'now color this is where most logos win' },
  { start: 72, text: 'or lose pick two or three colors max' },
  { start: 75, text: 'open the color picker and reach for the' },
  { start: 77, text: 'brand kit if you have one set up that' },
  { start: 79, text: 'way every logo you make stays on brand' },
  { start: 82, text: 'automatically' },
  { start: 84, text: "a quick tip if you're not sure where to" },
  { start: 86, text: 'start try a single bold color against a' },
  { start: 89, text: 'neutral background it almost always' },
  { start: 91, text: 'looks sharp' },
  { start: 93, text: "let's add a graphic element click" },
  { start: 95, text: 'elements in the side panel and search' },
  { start: 97, text: 'for an icon that ties to your brand' },
  { start: 99, text: 'story keep it simple a single line icon' },
  { start: 102, text: 'or a clean shape will scale beautifully' },
  { start: 104, text: 'from a tiny favicon all the way up to a' },
  { start: 107, text: 'massive billboard' },
  { start: 109, text: "now let's talk composition group your" },
  { start: 111, text: 'icon and wordmark together and try a few' },
  { start: 114, text: 'arrangements icon on the left wordmark' },
  { start: 116, text: 'on the right stacked vertically or even' },
  { start: 119, text: 'an icon-only mark for social avatars' },
  { start: 122, text: 'duplicate the design and try variations' },
  { start: 124, text: 'side by side this is so much easier' },
  { start: 126, text: 'than you think' },
  { start: 128, text: 'before you commit zoom out and squint a' },
  { start: 130, text: 'little if the logo still reads clearly' },
  { start: 132, text: "at small sizes you're on the right" },
  { start: 134, text: 'track if it gets muddy simplify keep' },
  { start: 137, text: 'going until it works at every size' },
  { start: 139, text: 'now add it to your brand kit click' },
  { start: 141, text: 'brand hub upload the logo and Canva' },
  { start: 144, text: 'will keep it on hand for every future' },
  { start: 146, text: 'design you create from social posts to' },
  { start: 148, text: 'pitch decks to merch' },
  { start: 151, text: 'finally export click share download and' },
  { start: 154, text: 'choose PNG with a transparent background' },
  { start: 156, text: 'so you can drop it onto any color or' },
  { start: 158, text: 'photo grab the SVG too if you ever need' },
  { start: 161, text: 'it printed nice and crisp' },
  { start: 163, text: "and that's it a memorable logo in just a" },
  { start: 166, text: 'few minutes the magic is in iterating' },
  { start: 168, text: 'try lots of variations trust your gut' },
  { start: 171, text: 'and let your brand personality shine' },
  { start: 173, text: 'through' },
  { start: 175, text: 'thanks for watching and remember a great' },
  { start: 177, text: "logo isn't designed in isolation it's" },
  { start: 179, text: "the start of a brand identity so let's" },
  { start: 181, text: 'go build yours' },
];

export const LOGO_DESIGN_LESSONS: LearningItem[] = [
  // Inline embedded media — videos, activities, cheatsheets
  {
    id: 'logo-design-in-3-minutes',
    title: 'Optimizing brand presence',
    type: 'Video',
    duration: '3m',
    imageUrl: 'https://img.youtube.com/vi/TWvrXGgTg7o/maxresdefault.jpg',
    videoEmbedUrl: 'https://www.youtube.com/embed/TWvrXGgTg7o?autoplay=1&rel=0',
    series: 'Graphic Design Essentials · Lesson 1',
    description:
      "We'll walk through the basics of designing a memorable logo — composition, type, and color — so you can spin one up in just a few minutes inside Canva.",
    transcript: LOGO_DESIGN_VIDEO_TRANSCRIPT,
  },
  {
    id: 'design-with-your-brand-kit-activity',
    title: 'Design with your brand kit',
    type: 'Activity',
    duration: '20m',
    imageUrl: brandKitActivityCardImage,
  },
  {
    id: 'design-a-personal-logo-cheatsheet',
    title: 'Design a personal logo',
    type: 'Cheatsheet',
    duration: '2m read',
    imageUrl: personalLogoCheatsheetCardImage,
  },
  // Explore further — courses and lessons
  {
    id: 'logo-design-fundamentals',
    title: 'Logo design fundamentals',
    type: 'Course',
    duration: '45m',
    level: 'Beginner',
    imageUrl: logoDesignFundamentalsCardImage,
  },
  {
    id: 'design-a-logo-in-canva',
    title: 'Design a logo in Canva',
    type: 'Lesson',
    duration: '12m',
    level: 'Beginner',
    imageUrl: designALogoInCanvaCardImage,
  },
];

/**
 * Bite-sized Design School tips about presentation design, surfaced in the
 * Canva AI panel while the assistant is "thinking" — a small piece of
 * just-in-time learning that fills the wait time with something useful
 * instead of dead air. One tip is picked at random per thinking session
 * (see `DesignSchoolThinkingTip`), so a returning user sees variety.
 *
 * Tips are deliberately short (one or two sentences) and self-contained —
 * no follow-up link, no media — so they don't compete with the actual AI
 * response that's about to arrive.
 */
export type DesignSchoolTip = {
  id: string;
  title: string;
  body: string;
};

export const PRESENTATION_DESIGN_TIPS: DesignSchoolTip[] = [
  {
    id: 'tip-fonts',
    title: 'Stick to two or three fonts',
    body: 'You cannot unsee a bad font pairing. Choose carefully.',
  },
  {
    id: 'tip-one-idea',
    title: 'One big idea per slide',
    body: 'One idea per slide. If it needs two, make it two slides.',
  },
  {
    id: 'tip-brand-kit',
    title: 'Apply your Brand Kit',
    body: 'Apply your Brand Kit first. It makes ten "looks on-brand" decisions for you.',
  },
  {
    id: 'tip-contrast',
    title: 'Mind the contrast',
    body: "If you can't read it from across the room, neither can your audience.",
  },
  {
    id: 'tip-rule-of-thirds',
    title: 'Use the rule of thirds',
    body: 'Centered is safe. Off-centered is interesting. Place the eye where it wants to go.',
  },
  {
    id: 'tip-whitespace',
    title: 'Leave room to breathe',
    body: "Empty space isn't wasted space. It's why the slide feels expensive.",
  },
  {
    id: 'tip-color',
    title: 'Limit your palette',
    body: "Three colors. A brand color, an accent, and a neutral. That's the whole deck.",
  },
  {
    id: 'tip-hierarchy',
    title: 'Build a clear hierarchy',
    body: 'Every slide has one job. Make sure the eye knows what it is in under a second.',
  },
];
