// Suggestion types
export interface Suggestion {
  id: string;
  text: string;
  type: 'search' | 'generate';
  category?: string;
}

// Suggestion context type
export type SuggestionContext = 'elements' | 'designs' | 'video' | 'code' | 'whiteboard';

// Instagram Post / Design-focused suggestions
export const DESIGN_SUGGESTIONS: Suggestion[] = [
  // General templates - Short search keywords
  { id: 'ds1', text: 'quote post', type: 'search', category: 'templates' },
  {
    id: 'ds2',
    text: 'product showcase',
    type: 'search',
    category: 'templates',
  },
  { id: 'ds3', text: 'announcement', type: 'search', category: 'templates' },
  { id: 'ds4', text: 'story highlight', type: 'search', category: 'templates' },
  { id: 'ds5', text: 'carousel post', type: 'search', category: 'templates' },
  {
    id: 'ds6',
    text: 'promotional post',
    type: 'search',
    category: 'templates',
  },
  { id: 'ds7', text: 'event flyer', type: 'search', category: 'templates' },
  { id: 'ds8', text: 'sale banner', type: 'search', category: 'templates' },
  { id: 'ds9', text: 'testimonial', type: 'search', category: 'templates' },
  {
    id: 'ds10',
    text: 'motivational post',
    type: 'search',
    category: 'templates',
  },
  {
    id: 'ds11',
    text: 'behind the scenes',
    type: 'search',
    category: 'templates',
  },
  { id: 'ds12', text: 'tutorial post', type: 'search', category: 'templates' },
  { id: 'ds13', text: 'brand story', type: 'search', category: 'templates' },
  { id: 'ds14', text: 'lifestyle photo', type: 'search', category: 'templates' },
  {
    id: 'ds15',
    text: 'product flat lay',
    type: 'search',
    category: 'templates',
  },

  // Fashion & Beauty
  { id: 'ds16', text: 'fashion outfit', type: 'search', category: 'fashion' },
  { id: 'ds17', text: 'makeup tutorial', type: 'search', category: 'beauty' },
  {
    id: 'ds18',
    text: 'style inspiration',
    type: 'search',
    category: 'fashion',
  },
  { id: 'ds19', text: 'ootd post', type: 'search', category: 'fashion' },
  {
    id: 'ds20',
    text: 'beauty product review',
    type: 'search',
    category: 'beauty',
  },

  // Generate Prompts
  {
    id: 'dg1',
    text: 'Modern product launch announcement with bold typography and gradient background',
    type: 'generate',
    category: 'announcement',
  },
  {
    id: 'dg2',
    text: 'Inspirational quote post with elegant serif fonts and minimal design',
    type: 'generate',
    category: 'quote',
  },
  {
    id: 'dg3',
    text: 'Sale promotion with attention-grabbing colors and discount badge',
    type: 'generate',
    category: 'promotion',
  },
  {
    id: 'dg4',
    text: 'Behind the scenes workspace shot with authentic lifestyle vibe',
    type: 'generate',
    category: 'lifestyle',
  },
  {
    id: 'dg5',
    text: 'Product showcase with clean white background and professional lighting',
    type: 'generate',
    category: 'product',
  },
];

// Sample suggestions database - Design elements focused
export const ELEMENT_SUGGESTIONS: Suggestion[] = [
  // Short search keywords - Design elements
  { id: 's1', text: 'icons', type: 'search', category: 'general' },
  { id: 's2', text: 'shapes', type: 'search', category: 'general' },
  { id: 's3', text: 'backgrounds', type: 'search', category: 'general' },
  { id: 's4', text: 'illustrations', type: 'search', category: 'general' },
  { id: 's5', text: 'patterns', type: 'search', category: 'general' },
  { id: 's6', text: 'textures', type: 'search', category: 'general' },
  { id: 's7', text: 'stickers', type: 'search', category: 'general' },
  { id: 's8', text: 'frames', type: 'search', category: 'general' },
  { id: 's9', text: 'borders', type: 'search', category: 'general' },
  { id: 's10', text: 'photos', type: 'search', category: 'general' },
  { id: 's11', text: 'graphics', type: 'search', category: 'general' },
  { id: 's12', text: 'arrows', type: 'search', category: 'general' },
  { id: 's13', text: 'badges', type: 'search', category: 'general' },
  { id: 's14', text: 'ribbons', type: 'search', category: 'general' },
  { id: 's15', text: 'dividers', type: 'search', category: 'general' },

  // Illustrations & Graphics
  {
    id: 'g1',
    text: 'Watercolor flower illustration with soft pastel tones',
    type: 'generate',
    category: 'illustrations',
  },
  {
    id: 'g2',
    text: 'Minimalist line art icons for social media',
    type: 'generate',
    category: 'icons',
  },
  {
    id: 'g3',
    text: 'Abstract geometric shapes in vibrant colors',
    type: 'generate',
    category: 'shapes',
  },
  {
    id: 'g4',
    text: 'Hand-drawn botanical elements with delicate details',
    type: 'generate',
    category: 'illustrations',
  },
  {
    id: 'g5',
    text: 'Modern gradient background with smooth color transitions',
    type: 'generate',
    category: 'backgrounds',
  },
];

// Intent prediction based on input characteristics
export function predictIntent(input: string): 'search' | 'generate' | 'mixed' {
  const lowerInput = input.toLowerCase().trim();
  const wordCount = lowerInput.split(/\s+/).length;

  // Generation indicators - descriptive and detailed for elements
  const generationKeywords = [
    'create',
    'make',
    'design',
    'generate',
    'draw',
    'with',
    'in',
    'featuring',
    'style',
    'detailed',
    'vibrant',
    'modern',
    'elegant',
    'minimalist',
    'colorful',
    'bold',
    'playful',
    'sleek',
    'hand-drawn',
    'abstract',
    'geometric',
    'organic',
    'floral',
    'vintage',
    'retro',
    'watercolor',
    'gradient',
    'textured',
    'smooth',
    'clean',
    'soft',
    'pastel',
    'neon',
    'gold',
    'metallic',
    'seamless',
    'repeating',
    'decorative',
    'ornamental',
    'illustration',
    'pattern',
    'texture',
    'background',
  ];

  // Search indicators - looking for specific element types
  const searchKeywords = [
    'icons',
    'shapes',
    'graphics',
    'illustrations',
    'photos',
    'patterns',
    'textures',
    'backgrounds',
    'stickers',
    'frames',
    'borders',
    'dividers',
    'badges',
    'ribbons',
    'arrows',
    'find',
    'show',
    'search',
    'look',
    'browse',
    'elements',
    'assets',
    'resources',
  ];

  const hasGenerationKeywords = generationKeywords.some(kw => lowerInput.includes(kw));
  const hasSearchKeywords = searchKeywords.some(kw => lowerInput.includes(kw));

  // Long inputs (5+ words) usually indicate generation intent
  if (wordCount >= 5 && !hasSearchKeywords) {
    return 'generate';
  }

  // Short inputs (1-3 words) usually indicate search intent
  if (wordCount <= 3 && !hasGenerationKeywords) {
    return 'search';
  }

  // Explicit generation keywords
  if (hasGenerationKeywords && !hasSearchKeywords) {
    return 'generate';
  }

  // Explicit search keywords
  if (hasSearchKeywords && !hasGenerationKeywords) {
    return 'search';
  }

  // Default to mixed if ambiguous
  return 'mixed';
}

// Filter and rank suggestions based on input and predicted intent
export function getSuggestions(
  input: string,
  maxResults: number = 5,
  context: SuggestionContext = 'elements',
): Suggestion[] {
  if (!input || input.trim().length < 2) {
    return [];
  }

  const lowerInput = input.toLowerCase().trim();
  const intent = predictIntent(input);

  // Choose the appropriate suggestions based on context
  const SUGGESTIONS = context === 'designs' ? DESIGN_SUGGESTIONS : ELEMENT_SUGGESTIONS;

  // Filter suggestions that match the input
  let matchedSuggestions = SUGGESTIONS.filter(suggestion =>
    suggestion.text.toLowerCase().includes(lowerInput),
  );

  // If no direct matches, do a fuzzy match on words
  if (matchedSuggestions.length === 0) {
    const inputWords = lowerInput.split(/\s+/);
    matchedSuggestions = SUGGESTIONS.filter(suggestion => {
      const suggestionText = suggestion.text.toLowerCase();
      return inputWords.some(word => suggestionText.includes(word));
    });
  }

  // Sort suggestions based on predicted intent
  const sortedSuggestions = matchedSuggestions.sort((a, b) => {
    // Calculate relevance score
    const aScore = calculateRelevanceScore(a, lowerInput, intent);
    const bScore = calculateRelevanceScore(b, lowerInput, intent);
    return bScore - aScore;
  });

  // Balance between search and generate
  const results: Suggestion[] = [];
  const generateSuggestions = sortedSuggestions.filter(s => s.type === 'generate');
  const searchSuggestions = sortedSuggestions.filter(s => s.type === 'search');

  if (intent === 'search') {
    // Search intent: 3 search, 2 generate
    results.push(...searchSuggestions.slice(0, 3), ...generateSuggestions.slice(0, 2));
  } else if (intent === 'generate') {
    // Generate intent: 1 search, 4 generate
    results.push(...searchSuggestions.slice(0, 1), ...generateSuggestions.slice(0, 4));
  } else {
    // Mixed intent: 2 search, 3 generate
    results.push(...searchSuggestions.slice(0, 2), ...generateSuggestions.slice(0, 3));
  }

  // Ensure we don't exceed maxResults
  return results.slice(0, maxResults);
}

function calculateRelevanceScore(suggestion: Suggestion, input: string, intent: string): number {
  let score = 0;
  const suggestionText = suggestion.text.toLowerCase();

  // Exact match at start gets highest score
  if (suggestionText.startsWith(input)) {
    score += 100;
  } else if (suggestionText.includes(input)) {
    score += 50;
  }

  // Word-by-word matching
  const inputWords = input.split(/\s+/);
  inputWords.forEach(word => {
    if (suggestionText.includes(word)) {
      score += 10;
    }
  });

  // Boost score if suggestion type matches predicted intent
  if (intent === 'search' && suggestion.type === 'search') {
    score += 30;
  } else if (intent === 'generate' && suggestion.type === 'generate') {
    score += 30;
  }

  // Length penalty for very long suggestions that don't closely match
  if (suggestion.text.length > 50 && !suggestionText.startsWith(input)) {
    score -= 5;
  }

  return score;
}
