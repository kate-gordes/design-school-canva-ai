export interface ContextualNavItem {
  id: string;
  title: string;
  iconType: 'document' | 'folder' | 'design-blue' | 'design-white';
  hasChevron?: boolean;
  children?: ContextualNavItem[];
}

export interface ChatItem {
  id: string;
  title: string;
  iconType: 'chat';
}

export interface RecentDesign {
  id: string;
  title: string;
  doctype:
    | 'Presentation'
    | 'Sheet'
    | 'Whiteboard'
    | 'Doc'
    | 'Multi-design'
    | 'Image'
    | 'Email'
    | 'Video';
  thumbnail?: string;
  thumbnailUrl?: string;
  private?: boolean;
  editedTime?: string;
  containedDoctypes?: string[]; // For multi-design: the doctypes contained within
}

export const starredItems: ContextualNavItem[] = [
  { id: 'projects', title: 'Projects', iconType: 'folder' },
  { id: '1', title: 'Q1 Product Launch Campaign', iconType: 'design-blue' },
  { id: '2', title: "Sarah's Design Portfolio", iconType: 'design-white' },
  {
    id: '3',
    title: 'Client Projects',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '3-1', title: 'TechCorp Rebrand', iconType: 'design-blue' },
      { id: '3-2', title: 'Startup Pitch Deck', iconType: 'design-blue' },
      { id: '3-3', title: 'Wedding Stationery Set', iconType: 'folder', hasChevron: true },
      { id: '3-4', title: 'Annual Report 2024', iconType: 'document' },
    ],
  },
  { id: '4', title: 'Team Meeting Notes - Jan', iconType: 'document' },
  { id: '5', title: 'Brand Guidelines Draft', iconType: 'document' },
  {
    id: '6',
    title: 'Personal Projects',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '6-1', title: 'Instagram Templates', iconType: 'design-blue' },
      { id: '6-2', title: 'Logo Experiments', iconType: 'design-white' },
      { id: '6-3', title: 'Typography Studies', iconType: 'folder', hasChevron: true },
      { id: '6-4', title: 'Color Palette Research', iconType: 'document' },
    ],
  },
  { id: '7', title: 'Design System Documentation', iconType: 'document' },
  {
    id: '8',
    title: 'Templates Collection',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '8-1', title: 'Social Media Posts', iconType: 'design-blue' },
      { id: '8-2', title: 'Presentation Slides', iconType: 'design-blue' },
      { id: '8-3', title: 'Email Headers', iconType: 'design-white' },
      { id: '8-4', title: 'Print Materials', iconType: 'folder', hasChevron: true },
    ],
  },
  {
    id: '9',
    title: 'Inspiration Board',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '9-1', title: 'Current Trends', iconType: 'document' },
      { id: '9-2', title: 'Color Inspiration', iconType: 'folder', hasChevron: true },
      { id: '9-3', title: 'Layout Ideas', iconType: 'design-blue' },
      { id: '9-4', title: 'Typography Trends', iconType: 'document' },
    ],
  },
  {
    id: '10',
    title: 'Work in Progress',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '10-1', title: 'Product Launch Assets', iconType: 'folder', hasChevron: true },
      { id: '10-2', title: 'Website Mockups', iconType: 'design-blue' },
      { id: '10-3', title: 'Mobile App Designs', iconType: 'design-white' },
      { id: '10-4', title: 'Icon Set v2', iconType: 'design-blue' },
    ],
  },
];

export const teamItems: ContextualNavItem[] = [
  { id: '11', title: 'Canva Design Team Shared', iconType: 'design-blue' },
  { id: '12', title: 'Marketing Campaign Assets', iconType: 'design-blue' },
  { id: '13', title: 'Product Feature Announcements', iconType: 'design-white' },
  {
    id: '14',
    title: 'Canva Brand Kit',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '14-1', title: 'Logo Variations', iconType: 'folder', hasChevron: true },
      { id: '14-2', title: 'Brand Colors', iconType: 'design-blue' },
      { id: '14-3', title: 'Typography Guide', iconType: 'document' },
      { id: '14-4', title: 'Photography Style', iconType: 'document' },
      { id: '14-5', title: 'Illustration Guidelines', iconType: 'folder', hasChevron: true },
    ],
  },
  {
    id: '15',
    title: 'Team Resources',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '15-1', title: 'Design System Components', iconType: 'design-blue' },
      { id: '15-2', title: 'Icon Library', iconType: 'design-white' },
      { id: '15-3', title: 'Template Masters', iconType: 'design-blue' },
      { id: '15-4', title: 'Stock Photos', iconType: 'folder', hasChevron: true },
    ],
  },
  { id: '16', title: 'Weekly Design Reviews', iconType: 'document' },
  { id: '17', title: 'Design Team Handbook', iconType: 'document' },
];

export const recentItems: ContextualNavItem[] = [
  { id: '18', title: 'Instagram Story - Product Launch', iconType: 'design-blue' },
  { id: '19', title: 'Team Presentation - Q1 Goals', iconType: 'design-white' },
  { id: '20', title: 'Client Logo Concepts v3', iconType: 'design-blue' },
  { id: '21', title: 'Email Newsletter Template', iconType: 'design-white' },
  { id: '22', title: 'Website Hero Banner', iconType: 'design-blue' },
  { id: '23', title: 'Social Media Campaign Assets', iconType: 'design-blue' },
];

// Projects page specific data
export const projectsYourItems: ContextualNavItem[] = [
  {
    id: '3',
    title: 'Client Projects',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '3-1', title: 'TechCorp Rebrand', iconType: 'design-blue' },
      { id: '3-2', title: 'Startup Pitch Deck', iconType: 'design-blue' },
      { id: '3-3', title: 'Wedding Stationery Set', iconType: 'folder', hasChevron: true },
      { id: '3-4', title: 'Annual Report 2024', iconType: 'document' },
    ],
  },
  {
    id: '6',
    title: 'Personal Projects',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '6-1', title: 'Instagram Templates', iconType: 'design-blue' },
      { id: '6-2', title: 'Logo Experiments', iconType: 'design-white' },
      { id: '6-3', title: 'Typography Studies', iconType: 'folder', hasChevron: true },
      { id: '6-4', title: 'Color Palette Research', iconType: 'document' },
    ],
  },
  {
    id: '8',
    title: 'Templates Collection',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '8-1', title: 'Social Media Posts', iconType: 'design-blue' },
      { id: '8-2', title: 'Presentation Slides', iconType: 'design-blue' },
      { id: '8-3', title: 'Email Headers', iconType: 'design-white' },
      { id: '8-4', title: 'Print Materials', iconType: 'folder', hasChevron: true },
    ],
  },
  {
    id: '9',
    title: 'Inspiration Board',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '9-1', title: 'Current Trends', iconType: 'document' },
      { id: '9-2', title: 'Color Inspiration', iconType: 'folder', hasChevron: true },
      { id: '9-3', title: 'Layout Ideas', iconType: 'design-blue' },
      { id: '9-4', title: 'Typography Trends', iconType: 'document' },
    ],
  },
  {
    id: '10',
    title: 'Work in Progress',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '10-1', title: 'Product Launch Assets', iconType: 'folder', hasChevron: true },
      { id: '10-2', title: 'Website Mockups', iconType: 'design-blue' },
      { id: '10-3', title: 'Mobile App Designs', iconType: 'design-white' },
      { id: '10-4', title: 'Icon Set v2', iconType: 'design-blue' },
    ],
  },
];

export const projectsSharedItems: ContextualNavItem[] = [
  {
    id: '14',
    title: 'Canva Brand Kit',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '14-1', title: 'Logo Variations', iconType: 'folder', hasChevron: true },
      { id: '14-2', title: 'Brand Colors', iconType: 'design-blue' },
      { id: '14-3', title: 'Typography Guide', iconType: 'document' },
      { id: '14-4', title: 'Photography Style', iconType: 'document' },
      { id: '14-5', title: 'Illustration Guidelines', iconType: 'folder', hasChevron: true },
    ],
  },
  {
    id: '15',
    title: 'Team Resources',
    iconType: 'folder',
    hasChevron: true,
    children: [
      { id: '15-1', title: 'Design System Components', iconType: 'design-blue' },
      { id: '15-2', title: 'Icon Library', iconType: 'design-white' },
      { id: '15-3', title: 'Template Masters', iconType: 'design-blue' },
      { id: '15-4', title: 'Stock Photos', iconType: 'folder', hasChevron: true },
    ],
  },
  { id: '11', title: 'Canva Design Team Shared', iconType: 'design-blue' },
  { id: '12', title: 'Marketing Campaign Assets', iconType: 'design-blue' },
  { id: '13', title: 'Product Feature Announcements', iconType: 'design-white' },
];

// Chat items for Canva AI page
export const todayChats: ChatItem[] = [{ id: 'new-chat', title: 'New chat', iconType: 'chat' }];

export const thisWeekChats: ChatItem[] = [
  { id: 'design-feedback-session', title: 'Design Feedback Session', iconType: 'chat' },
];

export const thisMonthChats: ChatItem[] = [
  { id: 'sarah-portfolio-review', title: "Sarah's Portfolio Review", iconType: 'chat' },
];

export const earlierChats: ChatItem[] = [
  { id: 'logo-design-concepts', title: 'Logo Design Concepts...', iconType: 'chat' },
  { id: 'social-media-templates', title: 'Social Media Templates...', iconType: 'chat' },
  { id: 'client-presentation-prep', title: 'Client Presentation Prep', iconType: 'chat' },
  { id: 'brand-color-exploration', title: 'Brand Color Exploration...', iconType: 'chat' },
  { id: 'typography-pairing-ideas', title: 'Typography Pairing Ideas...', iconType: 'chat' },
  { id: 'instagram-story-layouts', title: 'Instagram Story Layouts...', iconType: 'chat' },
  { id: 'website-wireframe-discussion', title: 'Website Wireframe Disc...', iconType: 'chat' },
  { id: 'design-system-planning', title: 'Design System Planning', iconType: 'chat' },
  { id: 'team-collaboration-tips', title: 'Team Collaboration Tips...', iconType: 'chat' },
  { id: 'creative-block-solutions', title: 'Creative Block Solutions...', iconType: 'chat' },
  { id: 'print-design-guidelines', title: 'Print Design Guidelines', iconType: 'chat' },
  { id: 'user-experience-research', title: 'User Experience Research', iconType: 'chat' },
  { id: 'motion-graphics-tutorial', title: 'Motion Graphics Tutorial...', iconType: 'chat' },
  { id: 'accessibility-best-practices', title: 'Accessibility Best Pract...', iconType: 'chat' },
  { id: 'design-trend-analysis', title: 'Design Trend Analysis', iconType: 'chat' },
  { id: 'client-mood-board', title: 'Client Mood Board', iconType: 'chat' },
  { id: 'team-design-review', title: 'Team Design Review', iconType: 'chat' },
];

// Template preview URLs for recent designs by type - prioritizing visual match to doctype
const designThumbnails = {
  // Presentations - pitch decks, slide covers (more variety) - all verified from business.json
  presentations: [
    'https://template.canva.com/EAFe6sQFEPU/1/0/400w-pSvmdGJllK0.jpg', // 0: Pitch Deck cream
    'https://template.canva.com/EAF2BGDjAIo/1/0/400w-FqjqViOLZb8.jpg', // 1: Portfolio brown
    'https://template.canva.com/EAE7AgOC3RA/2/0/400w-w_fnhiqmCCk.jpg', // 2: Corporate blue boxes
    'https://template.canva.com/EAFTl9Oz0QI/1/0/400w-zYzYOUq3e3w.jpg', // 3: Business presentation
    'https://template.canva.com/EAFPlMrzZ3o/1/0/400w-qEt7GdXW4gI.jpg', // 4: Modern colorful
    'https://template.canva.com/EAFGy4QaeaA/4/0/400w-BPkBnQJ3s-w.jpg', // 5: Professional clean
    'https://template.canva.com/EAFhDQeUsjA/2/0/400w-C-kh0w-71Vk.jpg', // 6: Creative gradient
    'https://template.canva.com/EAFeCxv0bWY/1/0/400w-cRzuDPNofW0.jpg', // 7: Minimalist style
  ],
  // Documents - ONLY from Docs, Letterheads, Proposals, Resumes, Reports subcategories in business.json
  docs: [
    // From Docs subcategory
    'https://template.canva.com/EAGJYbEB3Dg/2/0/309w-oRxBizLVv1c.jpg', // Project Plan Doc
    'https://template.canva.com/EAFuZoYmybA/1/0/309w-mDQyC71A6eU.jpg', // Thank You Letter Doc
    'https://template.canva.com/EAFxrXAhXu8/1/0/309w-kD209ddu4Wc.jpg', // Brand Guidelines Doc
    // From Letterheads subcategory
    'https://template.canva.com/EAF5HkYfQTs/2/0/283w-wq8e7lMtLfg.jpg', // Green Black Modern Letterhead
    'https://template.canva.com/EAFKV4OWRxE/2/0/283w-zMYqNs_n300.jpg', // Beige Minimalist Professional Letterhead
    // From Proposals subcategory
    'https://template.canva.com/EAGEtkpZgB4/1/0/309w-EB_RdyvA3pM.jpg', // Project Proposal B&W Minimalist
    'https://template.canva.com/EAE5y3MXb_k/3/0/283w-bhTT9VwmwO0.jpg', // Cream Orange Marketing Proposal
    // From Resumes subcategory
    'https://template.canva.com/EAFfKk6Kmck/1/0/283w-NFBy3RgH0e8.jpg', // Gray White Simple Resume
    'https://template.canva.com/EAE8mhdnw_g/3/0/283w-dNgq-AXvaWg.jpg', // Grey Clean CV Resume
    // From Reports subcategory
    'https://template.canva.com/EADajsnyvyg/1/0/283w-6AonFiTikGk.jpg', // White Yellow Corporate Annual Report
    'https://template.canva.com/EAEFSWjfsm4/1/0/283w-62ZA42Gslbc.jpg', // Purple Orange Nonprofit Impact Report
  ],
  // Whiteboards - flowcharts, mind maps, diagrams
  whiteboards: [
    'https://template.canva.com/EAFDvuYXyTs/9/0/400w-QKZEJOTcYQo.jpg', // Sitemap
    'https://template.canva.com/EAGHDwi01m8/4/0/400w-BWSPOLQ6AHA.jpg', // Concept Map
    'https://template.canva.com/EAFb0fXYmk4/1/0/400w-4ePcG3giqLc.jpg', // Mind Map
    'https://marketplace.canva.com/EAFbcLZWMlQ/3/0/2193w/canva-Fb4uCgcuc7U.jpg', // Project Plan WB
  ],
  // Designs - social media posts, graphics, visual content (NOT business cards)
  designs: [
    'https://template.canva.com/EAFm_SE60Po/1/0/400w-Ffzo-twNONE.jpg', // Animated Social Media cream/black
    'https://template.canva.com/EAFh7lB5aLk/2/0/400w-JvxOuqdvKPQ.jpg', // Black red bold modern
    'https://template.canva.com/EAFAZt4Q7NQ/1/0/400w-luLTZSMBqQA.jpg', // Hot pink neon retro
    'https://template.canva.com/EAEtHcrXo5o/1/0/400w-fMoFacbsFiU.jpg', // White pink journal
    'https://template.canva.com/EAFqeYDQDbQ/1/0/400w-tnrMP3hpOPk.jpg', // Beige inspirational quote
    'https://template.canva.com/EAFRimjEQ14/1/0/400w-0b20AVjbj-k.jpg', // Neutral beige moodboard
  ],
  // Sheets - use specific spreadsheet image for all
  sheets: [
    'https://template.canva.com/EAGh8WnVuHI/5/0/800w-cO_CFGsL2Ec.jpg', // Spreadsheet
  ],
  // Multi-design - collections, portfolios (more variety) - verified URLs
  multiDesign: [
    'https://template.canva.com/EAF2BGDjAIo/1/0/400w-FqjqViOLZb8.jpg', // 0: Portfolio brown
    'https://template.canva.com/EAFcDwpYiy4/3/0/400w-hSRs_6-KYbA.jpg', // 1: Business collage
    'https://template.canva.com/EAFIYjNZa1g/2/0/400w-UZuIuR4pWxU.jpg', // 2: Creative collection
    'https://template.canva.com/EAFSSjbJ_gs/2/0/400w-Na45QnJXCBk.jpg', // 3: Modern assets
  ],
};

// Recent designs - unified data source for Home and Projects pages
// SORTED BY MOST RECENT FIRST - dates should reflect actual recency order
export const recentDesigns: RecentDesign[] = [
  // Most recent items first
  {
    id: 'rd-1',
    title: 'Startup Pitch Deck',
    doctype: 'Presentation',
    editedTime: 'Edited 1 hour ago',
    thumbnailUrl: designThumbnails.presentations[0], // Pitch Deck cream
  },
  {
    id: 'rd-2',
    title: 'Marketing Campaign Assets',
    doctype: 'Multi-design',
    private: true,
    editedTime: 'Edited 5 hours ago',
    thumbnailUrl: designThumbnails.multiDesign[1], // Moodboard collage
    containedDoctypes: ['Image', 'Video', 'Presentation'],
  },
  {
    id: 'rd-3',
    title: 'Creative Brainstorm Board',
    doctype: 'Whiteboard',
    private: true,
    editedTime: 'Edited 6 hours ago',
    thumbnailUrl: designThumbnails.whiteboards[2], // Mind map
  },
  {
    id: 'rd-4',
    title: '[WIP] Leadership Playbook',
    doctype: 'Presentation',
    private: true,
    editedTime: 'Edited 15 hours ago',
    thumbnailUrl: designThumbnails.presentations[7], // Professional navy
  },
  {
    id: 'rd-5',
    title: 'Q1 Product Launch Campaign',
    doctype: 'Multi-design',
    editedTime: 'Edited 18 hours ago',
    thumbnailUrl: designThumbnails.multiDesign[0], // Portfolio brown
    containedDoctypes: ['Presentation', 'Doc', 'Image', 'Email'],
  },
  {
    id: 'rd-6',
    title: 'Social Media Posts',
    doctype: 'Image',
    editedTime: 'Edited 19 hours ago',
    thumbnailUrl: designThumbnails.designs[2], // Hot pink neon
  },
  {
    id: 'rd-7',
    title: 'Disco x Quality Design Drop Ins',
    doctype: 'Presentation',
    editedTime: 'Edited 19 hours ago',
    thumbnailUrl: designThumbnails.presentations[6], // Creative colorful
  },
  {
    id: 'rd-8',
    title: 'Instagram Templates',
    doctype: 'Image',
    editedTime: 'Edited 23 hours ago',
    thumbnailUrl: designThumbnails.designs[0], // Animated social media
  },
  {
    id: 'rd-9',
    title: 'Action points from CT off-site',
    doctype: 'Doc',
    editedTime: 'Edited 1 day ago',
    thumbnailUrl: designThumbnails.docs[0], // Project Plan Doc
  },
  {
    id: 'rd-10',
    title: 'CT Focus Areas, H1 2026',
    doctype: 'Doc',
    editedTime: 'Edited 1 day ago',
    thumbnailUrl: designThumbnails.docs[9], // Annual Report
  },
  {
    id: 'rd-11',
    title: 'Email Headers',
    doctype: 'Email',
    editedTime: 'Edited 1 day ago',
    thumbnailUrl: designThumbnails.designs[3], // White pink journal
  },
  {
    id: 'rd-12',
    title: 'Logo Experiments',
    doctype: 'Image',
    private: true,
    editedTime: 'Edited 2 days ago',
    thumbnailUrl: designThumbnails.designs[4], // Inspirational quote style
  },
  {
    id: 'rd-13',
    title: 'Product Feature Announcements',
    doctype: 'Presentation',
    editedTime: 'Edited 3 days ago',
    thumbnailUrl: designThumbnails.presentations[4], // Modern gradient purple
  },
  {
    id: 'rd-14',
    title: 'Project Timeline',
    doctype: 'Sheet',
    editedTime: 'Edited 4 days ago',
    thumbnailUrl: designThumbnails.sheets[0], // Spreadsheet
  },
  {
    id: 'rd-15',
    title: 'Budget Tracking Sheet',
    doctype: 'Sheet',
    editedTime: 'Edited 1 week ago',
    thumbnailUrl: designThumbnails.sheets[0], // Spreadsheet
  },
  {
    id: 'rd-16',
    title: 'Presentation Slides',
    doctype: 'Presentation',
    editedTime: 'Edited 8 days ago',
    thumbnailUrl: designThumbnails.presentations[5], // Minimalist green
  },
  {
    id: 'rd-17',
    title: 'Annual Report 2024',
    doctype: 'Doc',
    private: true,
    editedTime: 'Edited 13 days ago',
    thumbnailUrl: designThumbnails.docs[10], // Purple Orange Nonprofit Impact Report
  },
  {
    id: 'rd-18',
    title: 'User Journey Map',
    doctype: 'Whiteboard',
    editedTime: 'Edited 2 weeks ago',
    thumbnailUrl: designThumbnails.whiteboards[0], // Sitemap
  },
  {
    id: 'rd-19',
    title: 'Team Meeting Notes - Jan',
    doctype: 'Doc',
    editedTime: 'Edited 2 months ago',
    thumbnailUrl: designThumbnails.docs[1], // Thank You Letter Doc
  },
  {
    id: 'rd-20',
    title: 'Brand Guidelines Draft',
    doctype: 'Doc',
    editedTime: 'Edited 5 months ago',
    thumbnailUrl: designThumbnails.docs[2], // Brand Guidelines Doc
  },
];
