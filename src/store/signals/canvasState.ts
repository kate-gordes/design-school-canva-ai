import { signal, computed } from '@preact/signals-react';
import React from 'react';
import { deleteThread } from './chat';
import {
  addDebugHistoryEntry,
  captureElementSnapshot,
  captureCanvasSnapshot,
  capturePresentationSnapshot,
  debugHistoryEntries,
} from './debugHistory';
import { blocks } from './documentState';
import type { BlockData } from './documentState';
import { flushPendingChange } from './docsHistory';
import { mobileAIEditMode, dismissMobileAIPanel } from './panels';
import type { HistoryScope, StateSnapshot, OriginContext } from './debugHistory';

// Track if changes are coming from AI (to avoid double-recording)
// This will be set by the AI service before making changes
export const isAIChange = signal<boolean>(false);

// Creation mode state - when true, AI uses special creation prompt/tools
export const isCreationMode = signal<boolean>(false);
export const currentAIInitiationScope = signal<HistoryScope>('presentation');
export const currentAIMetadata = signal<{
  requestId: string;
  toolName: string;
  userPrompt?: string;
} | null>(null);

// Current editor mode - used for mode-aware undo/redo
export const currentEditorMode = signal<string>('presentation');

// Helper to check if a history entry is a docs entry
const isDocsEntry = (entry: { affectedScope: HistoryScope }): boolean =>
  entry.affectedScope === 'document' || entry.affectedScope === 'block';

// Helper to get element type from element ID
const getElementTypeById = (elementId: string): string | null => {
  for (const canvas of canvases.value) {
    const element = canvas.elements?.find(el => el.elementId === elementId);
    if (element) return element.type;
  }
  return null;
};

// Helper to find which canvas contains an element (searches all canvases)
// Exported for use by self-updating image elements
export const findCanvasIdForElement = (elementId: string): number | null => {
  for (const canvas of canvases.value) {
    if (canvas.elements?.some(el => el.elementId === elementId)) {
      return canvas.canvasId;
    }
  }
  return null;
};

// Helper to create origin context for human changes (origin = where they're acting)
const createHumanOriginContext = (
  scope: HistoryScope,
  canvasId: number | null,
  elementId: string | null = null,
): OriginContext => ({
  scope,
  canvasId,
  elementId,
  elementType: elementId ? getElementTypeById(elementId) : null,
});

// Canvas-related interfaces
export interface GradientConfig {
  type: 'linear' | 'circular' | 'radial';
  angle?: string;
  position?: string;
  colors: string[];
}

export interface ElementData {
  elementId: string;
  type: 'image' | 'shape' | 'text' | 'video' | 'html';
  style?: React.CSSProperties;
  content?: string;
  htmlContent?: string; // For html type: the full HTML/CSS/JS code to render
  supported?: boolean; // When false, element cannot be used with Canva AI (default: true)

  // For self-updating image elements (LLM-based slide creation)
  pendingImagePrompt?: string; // If set, image will auto-generate
  imageGenerationStatus?: 'pending' | 'generating' | 'completed' | 'error';
  imageGenerationError?: string;
}

export type PageDocType = 'presentation' | 'fixed-design' | 'doc' | 'whiteboard' | 'website';
/** @deprecated Use PageDocType instead */
export type DocType = PageDocType;

export interface CanvasData {
  canvasId: number;
  content: string;
  color?: string;
  gradient?: GradientConfig;
  elements?: ElementData[];
  height?: number; // Custom canvas height (default: 600)
  width?: number; // Custom canvas width (for fixed-design pages)
  docType?: PageDocType; // Per-page document type
  blocks?: BlockData[]; // Block content for doc pages
}

// Hardcoded presentation data (used by creation mode to load full presentation)
export const HARDCODED_PRESENTATION: CanvasData[] = [
  {
    canvasId: 1,
    content: 'Title Slide',
    color: '#E8E0F0',
    elements: [
      {
        elementId: 'title_main',
        type: 'text',
        content: 'Jacaranda\nSeedlings Co.',
        style: {
          position: 'absolute',
          top: '180px',
          left: '50px',
          fontSize: '72px',
          fontFamily: 'Georgia, serif',
          fontWeight: 'normal',
          color: '#4A7C6F',
          width: '460px',
          lineHeight: '1.1',
          whiteSpace: 'pre-wrap',
        },
      },
      {
        elementId: 'title_subtitle',
        type: 'text',
        content: 'PRESENTED BY [NAME HERE], JANUARY 21, 2026',
        style: {
          position: 'absolute',
          top: '420px',
          left: '50px',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#4A7C6F',
          letterSpacing: '1px',
          width: '500px',
        },
      },
      {
        elementId: 'title_image',
        type: 'image',
        style: {
          position: 'absolute',
          top: '0',
          left: '580px',
          width: '487px',
          height: '600px',
          backgroundImage: "url('./presentation/jacaranda.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      },
    ],
  },
  {
    canvasId: 2,
    content: 'Vision Slide',
    color: '#6B8F87',
    elements: [
      {
        elementId: 'vision_title',
        type: 'text',
        content: 'Our Vision:\nBringing\nBeauty to Gardens',
        style: {
          position: 'absolute',
          top: '80px',
          left: '60px',
          fontSize: '56px',
          fontFamily: 'Georgia, serif',
          fontWeight: 'normal',
          color: '#FFFFFF',
          width: '480px',
          lineHeight: '1.15',
          whiteSpace: 'pre-wrap',
        },
      },
      {
        elementId: 'vision_subtitle',
        type: 'text',
        content: 'HEALTHY AND AFFORDABLE SEEDLINGS',
        style: {
          position: 'absolute',
          top: '320px',
          left: '60px',
          fontSize: '13px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#FFFFFF',
          letterSpacing: '1px',
          width: '480px',
        },
      },
      {
        elementId: 'vision_body',
        type: 'text',
        content:
          'Our mission is to provide sustainable, vibrant jacaranda seedlings that enhance gardens and communities while being accessible to everyone who loves nature.',
        style: {
          position: 'absolute',
          top: '370px',
          left: '60px',
          fontSize: '16px',
          fontFamily: 'Georgia, serif',
          fontWeight: 'normal',
          color: '#FFFFFF',
          width: '460px',
          lineHeight: '1.6',
        },
      },
      {
        elementId: 'tree_image',
        type: 'image',
        style: {
          position: 'absolute',
          top: '0',
          left: '567px',
          width: '500px',
          height: '600px',
          backgroundImage: "url('./presentation/jacaranda-tree.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      },
    ],
  },
  {
    canvasId: 3,
    content: 'Market Opportunity',
    color: '#E8E0F0',
    elements: [
      {
        elementId: 'decorative_shape',
        type: 'shape',
        style: {
          position: 'absolute',
          top: '-30px',
          left: '290px',
          width: '500px',
          height: '100px',
          backgroundColor: '#6B8F87',
          borderRadius: '0 0 50% 50%',
        },
      },
      {
        elementId: 'opportunity_title',
        type: 'text',
        content: 'Market Opportunity',
        style: {
          position: 'absolute',
          top: '120px',
          left: '140px',
          fontSize: '56px',
          fontFamily: 'Georgia, serif',
          fontWeight: 'normal',
          color: '#6B8F87',
          width: '800px',
          textAlign: 'center',
        },
      },
      {
        elementId: 'col1_header',
        type: 'text',
        content: 'RISING DEMAND',
        style: {
          position: 'absolute',
          top: '280px',
          left: '60px',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#6B8F87',
          letterSpacing: '1px',
          width: '300px',
          textAlign: 'center',
        },
      },
      {
        elementId: 'col1_body',
        type: 'text',
        content:
          'There is an increasing consumer interest in ornamental trees, particularly jacarandas, due to their beauty and low maintenance requirements.',
        style: {
          position: 'absolute',
          top: '330px',
          left: '60px',
          fontSize: '15px',
          fontFamily: 'Georgia, serif',
          color: '#555555',
          width: '300px',
          textAlign: 'center',
          lineHeight: '1.5',
        },
      },
      {
        elementId: 'col2_header',
        type: 'text',
        content: 'URBAN GREENING',
        style: {
          position: 'absolute',
          top: '280px',
          left: '390px',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#6B8F87',
          letterSpacing: '1px',
          width: '300px',
          textAlign: 'center',
        },
      },
      {
        elementId: 'col2_body',
        type: 'text',
        content:
          'Cities worldwide are prioritizing urban greening initiatives to improve air quality and enhance community aesthetics, driving demand for our seedlings.',
        style: {
          position: 'absolute',
          top: '330px',
          left: '390px',
          fontSize: '15px',
          fontFamily: 'Georgia, serif',
          color: '#555555',
          width: '300px',
          textAlign: 'center',
          lineHeight: '1.5',
        },
      },
      {
        elementId: 'col3_header',
        type: 'text',
        content: 'SUSTAINABLE LIVING',
        style: {
          position: 'absolute',
          top: '280px',
          left: '720px',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#6B8F87',
          letterSpacing: '1px',
          width: '300px',
          textAlign: 'center',
        },
      },
      {
        elementId: 'col3_body',
        type: 'text',
        content:
          'The growing trend towards sustainable living has led consumers to seek eco-friendly gifts and gardening options, aligning perfectly with our offerings.',
        style: {
          position: 'absolute',
          top: '330px',
          left: '720px',
          fontSize: '15px',
          fontFamily: 'Georgia, serif',
          color: '#555555',
          width: '300px',
          textAlign: 'center',
          lineHeight: '1.5',
        },
      },
    ],
  },
  {
    canvasId: 4,
    content: 'Data Slide',
    color: '#E8E0F0',
    elements: [
      {
        elementId: 'data_headline',
        type: 'text',
        content: 'In data we trust',
        style: {
          position: 'absolute',
          top: '80px',
          left: '290px',
          fontSize: '56px',
          fontFamily: 'Georgia, serif',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#6B8F87',
          whiteSpace: 'nowrap',
        },
      },
      {
        elementId: 'data_graph',
        type: 'image',
        supported: false,
        style: {
          position: 'absolute',
          top: '180px',
          left: '140px',
          width: '800px',
          height: '400px',
          backgroundImage: "url('./presentation/graph.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
      },
    ],
  },
  {
    canvasId: 5,
    content: 'Doc Page',
    color: '#FFFFFF',
    docType: 'doc',
    blocks: [
      { blockId: 'doc5_1', blockType: 'h1', markdown: 'Introduction' },
      {
        blockId: 'doc5_2',
        blockType: 'paragraph',
        markdown:
          'Starting a business focused on growing and selling jacaranda seedlings can be both rewarding and profitable. Jacaranda trees are popular for their beautiful purple blooms and are often sought after for landscaping purposes. This document outlines the strategic plan for launching and growing your jacaranda seedlings business.',
      },
      { blockId: 'doc5_3', blockType: 'h1', markdown: 'Business Overview' },
      {
        blockId: 'doc5_4',
        blockType: 'paragraph',
        markdown: '**Business Name**: [Your Business Name Here]',
      },
      {
        blockId: 'doc5_5',
        blockType: 'paragraph',
        markdown: '**Business Type**: Retail and Wholesale Nursery',
      },
      { blockId: 'doc5_6', blockType: 'paragraph', markdown: '**Location**: [Your Location Here]' },
      {
        blockId: 'doc5_7',
        blockType: 'paragraph',
        markdown:
          '**Mission Statement**: To provide high-quality jacaranda seedlings to gardening enthusiasts and professional landscapers, while promoting sustainable and environmentally friendly growing practices.',
      },
      { blockId: 'doc5_8', blockType: 'h1', markdown: 'Market Analysis' },
      { blockId: 'doc5_9', blockType: 'h2', markdown: 'Industry Overview' },
      {
        blockId: 'doc5_10',
        blockType: 'paragraph',
        markdown:
          'The nursery and greenhouse industry is a significant part of the agricultural sector, with increasing demand for ornamental plants. The trend towards home gardening and sustainable landscaping is expected to drive growth in this market.',
      },
      { blockId: 'doc5_11', blockType: 'h2', markdown: 'Target Market' },
      {
        blockId: 'doc5_12',
        blockType: 'bullet',
        markdown:
          '**Home Gardeners**: Individuals looking to beautify their gardens with jacaranda trees.',
      },
      {
        blockId: 'doc5_13',
        blockType: 'bullet',
        markdown:
          '**Professional Landscapers**: Businesses providing landscaping services for residential and commercial properties.',
      },
      {
        blockId: 'doc5_14',
        blockType: 'bullet',
        markdown:
          '**Retail Nurseries**: Shops looking to stock jacaranda seedlings for their customers.',
      },
      { blockId: 'doc5_15', blockType: 'h2', markdown: 'Competitive Analysis' },
      {
        blockId: 'doc5_16',
        blockType: 'bullet',
        markdown: '**Direct Competitors**: Local nurseries and online plant retailers.',
      },
      {
        blockId: 'doc5_17',
        blockType: 'bullet',
        markdown:
          '**Indirect Competitors**: Garden centers and big-box stores with garden sections.',
      },
      { blockId: 'doc5_18', blockType: 'paragraph', markdown: '**Competitive Advantage**:' },
      {
        blockId: 'doc5_19',
        blockType: 'bullet',
        markdown: 'Specialization in jacaranda seedlings ensures expertise and quality.',
      },
      {
        blockId: 'doc5_20',
        blockType: 'bullet',
        markdown: 'Commitment to sustainable growing practices.',
      },
      {
        blockId: 'doc5_21',
        blockType: 'bullet',
        markdown: 'Personalized customer service and expert advice.',
      },
      { blockId: 'doc5_22', blockType: 'h1', markdown: 'Marketing Strategy' },
      { blockId: 'doc5_23', blockType: 'h2', markdown: 'Branding' },
      {
        blockId: 'doc5_24',
        blockType: 'bullet',
        markdown:
          'Develop a strong brand identity emphasizing quality, sustainability, and expertise in jacaranda seedlings.',
      },
      {
        blockId: 'doc5_25',
        blockType: 'bullet',
        markdown: 'Create a memorable logo and tagline that resonate with your target market.',
      },
      { blockId: 'doc5_26', blockType: 'h2', markdown: 'Promotion' },
      { blockId: 'doc5_27', blockType: 'h3', markdown: 'Online Presence:' },
      {
        blockId: 'doc5_28',
        blockType: 'bullet',
        markdown:
          'Develop a professional website showcasing your products, services, and growing practices.',
      },
      {
        blockId: 'doc5_29',
        blockType: 'bullet',
        markdown:
          'Utilize social media platforms such as Instagram and Facebook to display beautiful images of jacaranda trees and engage with potential customers.',
      },
      { blockId: 'doc5_30', blockType: 'h3', markdown: 'Local Advertising:' },
      {
        blockId: 'doc5_31',
        blockType: 'bullet',
        markdown:
          'Partner with local gardening clubs and attend plant fairs to increase visibility.',
      },
      {
        blockId: 'doc5_32',
        blockType: 'bullet',
        markdown: 'Offer workshops and gardening classes to establish authority in the field.',
      },
      { blockId: 'doc5_33', blockType: 'h3', markdown: 'Customer Engagement:' },
      {
        blockId: 'doc5_34',
        blockType: 'bullet',
        markdown: 'Implement a loyalty program for repeat customers.',
      },
      {
        blockId: 'doc5_35',
        blockType: 'bullet',
        markdown:
          'Provide informative content such as newsletters and blog posts on caring for jacaranda trees.',
      },
      { blockId: 'doc5_36', blockType: 'h1', markdown: 'Operations Plan' },
      { blockId: 'doc5_37', blockType: 'h2', markdown: 'Production Process' },
      {
        blockId: 'doc5_38',
        blockType: 'bullet',
        markdown: 'Select high-quality seeds and employ best practices in seedling propagation.',
      },
      {
        blockId: 'doc5_39',
        blockType: 'bullet',
        markdown:
          'Maintain a controlled environment for growing seedlings, ensuring optimal temperature, light, and moisture levels.',
      },
      {
        blockId: 'doc5_40',
        blockType: 'bullet',
        markdown:
          'Implement sustainable practices, such as water recycling and organic fertilization.',
      },
      { blockId: 'doc5_41', blockType: 'h2', markdown: 'Distribution' },
      {
        blockId: 'doc5_42',
        blockType: 'bullet',
        markdown:
          'Utilize both direct sales (on-site purchases) and online sales through your website.',
      },
      {
        blockId: 'doc5_43',
        blockType: 'bullet',
        markdown:
          'Develop relationships with local nurseries and landscapers for wholesale opportunities.',
      },
      { blockId: 'doc5_44', blockType: 'h1', markdown: 'Financial Plan' },
      { blockId: 'doc5_45', blockType: 'h2', markdown: 'Startup Costs' },
      {
        blockId: 'doc5_46',
        blockType: 'bullet',
        markdown:
          'Initial setup costs include land preparation, greenhouse construction, seed purchase, and marketing expenses.',
      },
      {
        blockId: 'doc5_47',
        blockType: 'bullet',
        markdown: 'Equipment costs for tools, irrigation systems, and nursery supplies.',
      },
      { blockId: 'doc5_48', blockType: 'h2', markdown: 'Revenue Streams' },
      {
        blockId: 'doc5_49',
        blockType: 'bullet',
        markdown: 'Direct sales to consumers and landscapers.',
      },
      {
        blockId: 'doc5_50',
        blockType: 'bullet',
        markdown: 'Wholesale partnerships with nurseries and garden centers.',
      },
      { blockId: 'doc5_51', blockType: 'h2', markdown: 'Financial Projections' },
      {
        blockId: 'doc5_52',
        blockType: 'bullet',
        markdown: 'Projected revenue growth based on market trends and business expansion plans.',
      },
      {
        blockId: 'doc5_53',
        blockType: 'bullet',
        markdown: 'Break-even analysis to determine time frame for profitability.',
      },
      { blockId: 'doc5_54', blockType: 'h1', markdown: 'Risk Management' },
      {
        blockId: 'doc5_55',
        blockType: 'paragraph',
        markdown:
          'Identify potential risks such as fluctuating market demand, pest infestations, and extreme weather conditions. Develop contingency plans to mitigate these risks, such as diversifying plant offerings and investing in pest control measures.',
      },
      { blockId: 'doc5_56', blockType: 'h1', markdown: 'Conclusion' },
      {
        blockId: 'doc5_57',
        blockType: 'paragraph',
        markdown:
          'The jacaranda seedlings business presents a unique opportunity to capitalize on the growing demand for ornamental plants. With a strategic approach focused on quality, sustainability, and customer engagement, this business can thrive in the competitive horticultural industry.',
      },
    ],
  },
  {
    canvasId: 6,
    content: 'Opening Sale Poster',
    color: '#DDD0E8',
    docType: 'fixed-design',
    width: 480,
    height: 600,
    elements: [
      {
        elementId: 'poster_border',
        type: 'shape',
        style: {
          position: 'absolute',
          top: '15px',
          left: '15px',
          width: '450px',
          height: '570px',
          border: '1px solid #B8A9C9',
          borderRadius: '0',
          backgroundColor: 'transparent',
        },
      },
      {
        elementId: 'poster_corner_tl',
        type: 'shape',
        style: {
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '30px',
          height: '30px',
          borderTop: '2px solid #4A6B5D',
          borderLeft: '2px solid #4A6B5D',
          backgroundColor: 'transparent',
        },
      },
      {
        elementId: 'poster_corner_tr',
        type: 'shape',
        style: {
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '30px',
          height: '30px',
          borderTop: '2px solid #4A6B5D',
          borderRight: '2px solid #4A6B5D',
          backgroundColor: 'transparent',
        },
      },
      {
        elementId: 'poster_corner_bl',
        type: 'shape',
        style: {
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          width: '30px',
          height: '30px',
          borderBottom: '2px solid #4A6B5D',
          borderLeft: '2px solid #4A6B5D',
          backgroundColor: 'transparent',
        },
      },
      {
        elementId: 'poster_corner_br',
        type: 'shape',
        style: {
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          width: '30px',
          height: '30px',
          borderBottom: '2px solid #4A6B5D',
          borderRight: '2px solid #4A6B5D',
          backgroundColor: 'transparent',
        },
      },
      {
        elementId: 'poster_header',
        type: 'text',
        content: 'Opening Sale',
        style: {
          position: 'absolute',
          top: '45px',
          left: '0',
          width: '480px',
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          color: '#4A6B5D',
          textAlign: 'center',
          letterSpacing: '2px',
          textTransform: 'uppercase' as const,
        },
      },
      {
        elementId: 'poster_title',
        type: 'text',
        content: 'Jacaranda\nSeedling Co.',
        style: {
          position: 'absolute',
          top: '80px',
          left: '30px',
          width: '420px',
          fontSize: '72px',
          fontFamily: 'Georgia, serif',
          fontWeight: 'normal',
          color: '#4A6B5D',
          textAlign: 'center',
          lineHeight: '1.05',
          whiteSpace: 'pre-wrap',
        },
      },
      {
        elementId: 'poster_subtitle',
        type: 'text',
        content: 'Celebrate us launching\nwith 10% Off',
        style: {
          position: 'absolute',
          top: '280px',
          left: '40px',
          width: '400px',
          fontSize: '26px',
          fontFamily: 'Georgia, serif',
          fontWeight: 'normal',
          fontStyle: 'italic',
          color: '#4A6B5D',
          textAlign: 'center',
          lineHeight: '1.3',
          whiteSpace: 'pre-wrap',
        },
      },
      {
        elementId: 'poster_plant',
        type: 'image',
        style: {
          position: 'absolute',
          top: '340px',
          left: '110px',
          width: '260px',
          height: '260px',
          backgroundImage: "url('./presentation/jacaranda-transparent.png')",
          backgroundSize: 'contain',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        },
      },
      {
        elementId: 'poster_blob_bl',
        type: 'shape',
        style: {
          position: 'absolute',
          top: '500px',
          left: '0px',
          width: '140px',
          height: '100px',
          backgroundColor: '#3D6B5E',
          borderRadius: '0 70% 0 0',
        },
      },
      {
        elementId: 'poster_blob_r',
        type: 'shape',
        style: {
          position: 'absolute',
          top: '400px',
          left: '410px',
          width: '70px',
          height: '140px',
          backgroundColor: '#3D6B5E',
          borderRadius: '40% 0 0 40%',
        },
      },
    ],
  },
  {
    canvasId: 7,
    content: 'Interactive Page',
    color: '#E9E1FB',
    docType: 'website',
  },
];

// Presentation title - shared across header and AI context
export const presentationTitle = signal<string>('Jacaranda Seedlings Presentation');

// Canvas state - initialized with the hardcoded presentation
export const canvases = signal<CanvasData[]>(JSON.parse(JSON.stringify(HARDCODED_PRESENTATION)));

export const activeCanvasId = signal<number>(1);
export const selectedElementType = signal<string | null>(null);
export const selectedElementId = signal<string | null>(null);
// Multi-selection state
export const selectedElementIds = signal<Set<string>>(new Set());
export const selectionGroupId = signal<string | null>(null);
// Page selection state
export const selectedPageId = signal<number | null>(null);

// Computed: Check if any element or page is selected (uses canvasState's selectedElementIds)
export const hasSelection = computed<boolean>(() => {
  return (
    selectedElementIds.value.size > 0
    || selectedElementId.value !== null
    || selectedPageId.value !== null
  );
});

// Check if an element is supported for Canva AI
export const isElementSupported = (elementId: string): boolean => {
  for (const canvas of canvases.value) {
    const element = canvas.elements?.find(el => el.elementId === elementId);
    if (element) {
      return element.supported !== false;
    }
  }
  return true;
};

// Computed: Check if current selection contains any unsupported elements
export const hasUnsupportedSelection = computed<boolean>(() => {
  if (selectedElementId.value && !isElementSupported(selectedElementId.value)) {
    return true;
  }
  for (const elementId of selectedElementIds.value) {
    if (!isElementSupported(elementId)) {
      return true;
    }
  }
  return false;
});

// Computed: Get the doc type of the active canvas
export const activeDocType = computed<PageDocType>(() => {
  const activeCanvas = canvases.value.find(c => c.canvasId === activeCanvasId.value);
  return activeCanvas?.docType || 'presentation';
});

// Element loading states (for async image generation)
export interface ElementLoadingState {
  status: 'loading' | 'editing' | 'error' | 'success';
  message?: string;
  newImageUrl?: string;
}

export const elementLoadingStates = signal<Map<string, ElementLoadingState>>(new Map());

/**
 * Set loading state for an element
 */
export const setElementLoadingState = (
  elementId: string,
  state: ElementLoadingState | null,
): void => {
  const newMap = new Map(elementLoadingStates.value);
  if (state === null) {
    newMap.delete(elementId);
  } else {
    newMap.set(elementId, state);
  }
  elementLoadingStates.value = newMap;
};

/**
 * Get loading state for an element
 */
export const getElementLoadingState = (elementId: string): ElementLoadingState | null => {
  return elementLoadingStates.value.get(elementId) || null;
};

/**
 * Check if an element is currently loading
 */
export const isElementLoading = (elementId: string): boolean => {
  const state = elementLoadingStates.value.get(elementId);
  return state?.status === 'loading';
};

// --- UNDO/REDO STATE ---
// Now uses debugHistoryEntries for traversal

// Legacy signals kept for backwards compatibility (not actively used)
export const pastHistory = signal<unknown[]>([]);
export const futureHistory = signal<unknown[]>([]);

// Computed: can undo/redo based on debug history (mode-aware)
export const canUndo = computed(() => {
  const mode = currentEditorMode.value;
  if (mode === 'docs') {
    return debugHistoryEntries.value.some(entry => !entry.isReverted && isDocsEntry(entry));
  }
  return debugHistoryEntries.value.some(entry => !entry.isReverted && !isDocsEntry(entry));
});

export const canRedo = computed(() => {
  const mode = currentEditorMode.value;
  if (mode === 'docs') {
    return debugHistoryEntries.value.some(entry => entry.isReverted && isDocsEntry(entry));
  }
  return debugHistoryEntries.value.some(entry => entry.isReverted && !isDocsEntry(entry));
});

// recordHistory is now a no-op since debug history handles tracking
// Kept for backwards compatibility with existing code
export const recordHistory = () => {
  // No-op: Debug history entries are recorded by mutation functions
};

/**
 * Apply a state snapshot to restore state (used by undo/redo)
 */
const applySnapshot = (
  snapshot: StateSnapshot,
  targetId: string | null,
  targetCanvasId: number | null,
): void => {
  switch (snapshot.type) {
    case 'element': {
      if (!snapshot.elementData) {
        // Element was deleted - need to remove it
        if (targetId && targetCanvasId) {
          canvases.value = canvases.value.map(canvas => {
            if (canvas.canvasId === targetCanvasId) {
              return {
                ...canvas,
                elements: canvas.elements?.filter(el => el.elementId !== targetId),
              };
            }
            return canvas;
          });
        }
        return;
      }

      const canvasIdToUpdate = targetCanvasId ?? activeCanvasId.value;

      // Find which canvas contains this element
      let found = false;
      canvases.value = canvases.value.map(canvas => {
        if (canvas.canvasId === canvasIdToUpdate) {
          const elementExists = canvas.elements?.some(el => el.elementId === targetId);

          if (elementExists) {
            // Update existing element
            found = true;
            return {
              ...canvas,
              elements: canvas.elements?.map(el =>
                el.elementId === targetId ? JSON.parse(JSON.stringify(snapshot.elementData!)) : el,
              ),
            };
          } else {
            // Element was deleted - restore it
            found = true;
            return {
              ...canvas,
              elements: [
                ...(canvas.elements || []),
                JSON.parse(JSON.stringify(snapshot.elementData!)),
              ],
            };
          }
        }
        return canvas;
      });

      if (!found) {
        console.warn(`[Undo/Redo] Could not find canvas ${canvasIdToUpdate} to apply snapshot`);
      }
      break;
    }

    case 'canvas': {
      if (!snapshot.canvasData) {
        // Canvas was deleted - need to remove it
        if (targetCanvasId) {
          canvases.value = canvases.value.filter(c => c.canvasId !== targetCanvasId);
        }
        return;
      }

      const canvasId = snapshot.canvasData.canvasId;
      const existingIndex = canvases.value.findIndex(c => c.canvasId === canvasId);

      if (existingIndex !== -1) {
        // Update existing canvas
        canvases.value = canvases.value.map(c =>
          c.canvasId === canvasId ? JSON.parse(JSON.stringify(snapshot.canvasData!)) : c,
        );
      } else {
        // Canvas was deleted - restore it at the appropriate position
        canvases.value = [...canvases.value, JSON.parse(JSON.stringify(snapshot.canvasData))];
      }
      break;
    }

    case 'presentation': {
      if (!snapshot.presentationData) {
        console.warn('[Undo/Redo] Cannot apply presentation snapshot: missing data');
        return;
      }
      canvases.value = JSON.parse(JSON.stringify(snapshot.presentationData));
      break;
    }

    case 'document': {
      if (!snapshot.documentData) {
        console.warn('[Undo/Redo] Cannot apply document snapshot: missing data');
        return;
      }
      blocks.value = JSON.parse(JSON.stringify(snapshot.documentData));
      break;
    }
  }
};

/**
 * Undo: Revert the most recent non-reverted entry (mode-aware)
 */
export const undo = () => {
  const mode = currentEditorMode.value;
  const entries = debugHistoryEntries.value;

  // Flush any pending text changes in docs mode
  if (mode === 'docs') {
    flushPendingChange();
  }

  // Find the last non-reverted entry matching current mode (from latest to oldest)
  let lastActiveIndex = -1;
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (!entry.isReverted) {
      if (mode === 'docs' ? isDocsEntry(entry) : !isDocsEntry(entry)) {
        lastActiveIndex = i;
        break;
      }
    }
  }

  if (lastActiveIndex === -1) {
    console.log('[Undo] No entries to undo');
    return;
  }

  const entry = entries[lastActiveIndex];

  // Apply the beforeState to revert this change
  applySnapshot(entry.beforeState, entry.targetId, entry.targetCanvasId);

  // Mark the entry as reverted
  debugHistoryEntries.value = entries.map((e, index) =>
    index === lastActiveIndex ? { ...e, isReverted: true } : e,
  );

  console.log(`[Undo] Reverted: ${entry.description}`);
};

/**
 * Redo: Re-apply the most recently reverted entry (mode-aware)
 */
export const redo = () => {
  const mode = currentEditorMode.value;
  const entries = debugHistoryEntries.value;

  // Find the first reverted entry matching current mode
  let firstRevertedIndex = -1;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    if (entry.isReverted) {
      if (mode === 'docs' ? isDocsEntry(entry) : !isDocsEntry(entry)) {
        firstRevertedIndex = i;
        break;
      }
    }
  }

  if (firstRevertedIndex === -1) {
    console.log('[Redo] No entries to redo');
    return;
  }

  const entry = entries[firstRevertedIndex];

  // Apply the afterState to re-apply this change
  applySnapshot(entry.afterState, entry.targetId, entry.targetCanvasId);

  // Mark the entry as not reverted
  debugHistoryEntries.value = entries.map((e, index) =>
    index === firstRevertedIndex ? { ...e, isReverted: false } : e,
  );

  console.log(`[Redo] Re-applied: ${entry.description}`);
};

/**
 * Clear all history
 */
export const clearHistory = () => {
  debugHistoryEntries.value = [];
};

export const activeCanvas = computed(() => {
  return canvases.value.find(c => c.canvasId === activeCanvasId.value);
});

export const selectedElement = computed(() => {
  if (!activeCanvas.value || !selectedElementId.value) {
    return null;
  }
  return activeCanvas.value.elements?.find(el => el.elementId === selectedElementId.value) ?? null;
});

// Canvas helper functions
export const handleCanvasSelect = (pageNumber: number): void => {
  // Mobile: if keyboard is open (compact AI input visible), dismiss the AI panel
  // This allows the user to interact with canvas normally
  if (mobileAIEditMode.value.keyboardOpen) {
    dismissMobileAIPanel();
  }

  // FIRST clear element selection before changing canvas
  clearSelection();
  // Also clear page selection when navigating
  clearPageSelection();
  // THEN change the active canvas
  // pageNumber is 1-indexed, so we need to look up the canvas at that position
  const canvas = canvases.value[pageNumber - 1];
  if (canvas) {
    activeCanvasId.value = canvas.canvasId;
  }
};

export const handleElementSelect = (elementType: string | null, elementId?: string): void => {
  // Mobile: if keyboard is open (compact AI input visible), dismiss the AI panel
  // This allows the user to interact with canvas elements normally
  if (mobileAIEditMode.value.keyboardOpen) {
    dismissMobileAIPanel();
  }

  // Clear page selection when selecting an element
  clearPageSelection();
  selectedElementType.value = elementType;
  selectedElementId.value = elementId ?? null;
};

// Page selection helpers
export const selectPage = (pageId: number): void => {
  // Only select if it's the current page being viewed
  // Deselection happens by clicking outside (not by clicking the same page again)
  if (pageId === activeCanvasId.value) {
    selectedPageId.value = pageId;
    clearSelection(); // Clear element selection
    // Note: Desktop toolbar for page selection is hidden for now
    // selectedElementType.value = 'canvas'; // Would show CanvasToolbar on desktop
  }
};

export const clearPageSelection = (): void => {
  selectedPageId.value = null;
  // Only clear element type if we were in page selection mode
  if (selectedElementType.value === 'canvas' && !selectedElementId.value) {
    selectedElementType.value = null;
  }
};

export const updateElementContent = (elementId: string, content: string): void => {
  // Find which canvas contains this element (searches all canvases)
  const canvasId = findCanvasIdForElement(elementId) ?? activeCanvasId.value;

  // Prevent null or undefined content updates
  if (content == null) {
    return;
  }

  // Capture before state for debug history
  const beforeState = captureElementSnapshot(elementId);

  // Record history before mutation
  recordHistory();

  canvases.value = canvases.value.map(c => {
    if (c.canvasId === canvasId) {
      const newElements = c.elements?.map(el => {
        if (el.elementId === elementId) {
          return { ...el, content };
        }
        return el;
      });
      return { ...c, elements: newElements };
    }
    return c;
  });

  // Record debug history (only if not already tracked by AI service)
  if (beforeState && !isAIChange.value) {
    const afterState = captureElementSnapshot(elementId);
    if (afterState) {
      addDebugHistoryEntry({
        affectedScope: 'element',
        initiationScope: 'element',
        source: 'human',
        actionType: 'content-change',
        targetId: elementId,
        targetCanvasId: canvasId,
        targetElementType: getElementTypeById(elementId),
        origin: createHumanOriginContext('element', canvasId, elementId),
        beforeState,
        afterState,
        description: `Updated content on ${elementId}`,
      });
    }
  }
};

export const updateElementProperty = <K extends keyof Omit<ElementData, 'elementId' | 'type'>>(
  elementId: string,
  prop: K,
  value: ElementData[K],
): void => {
  // Find which canvas contains this element (searches all canvases)
  const canvasId = findCanvasIdForElement(elementId) ?? activeCanvasId.value;

  // Guard against applying null, undefined, or empty style objects
  if (prop === 'style') {
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value === 'object' && Object.keys(value as object).length === 0) {
      return;
    }
  }

  // Capture before state for debug history
  const beforeState = captureElementSnapshot(elementId);

  // Record history before mutation
  recordHistory();

  canvases.value = canvases.value.map(c => {
    if (c.canvasId === canvasId) {
      const newElements = c.elements?.map(el => {
        if (el.elementId === elementId) {
          // Create new element with explicit property handling
          let newEl: ElementData;

          if (prop === 'style' && typeof value === 'object' && value !== null) {
            newEl = {
              ...el,
              style: {
                ...(el.style || {}),
                ...(value as React.CSSProperties),
              },
            };
          } else if (prop === 'content') {
            // Only update content if value is not null or undefined
            if (value != null) {
              newEl = {
                ...el,
                content: value as string,
              };
            } else {
              newEl = el; // Keep existing element unchanged
            }
          } else {
            newEl = {
              ...el,
              [prop]: value,
            };
          }

          return newEl;
        }
        return el;
      });
      return { ...c, elements: newElements };
    }
    return c;
  });

  // Record debug history (only if not already tracked by AI service)
  if (beforeState && !isAIChange.value) {
    const afterState = captureElementSnapshot(elementId);
    if (afterState) {
      addDebugHistoryEntry({
        affectedScope: 'element',
        initiationScope: 'element',
        source: 'human',
        actionType: 'style-change',
        targetId: elementId,
        targetCanvasId: canvasId,
        targetElementType: getElementTypeById(elementId),
        origin: createHumanOriginContext('element', canvasId, elementId),
        beforeState,
        afterState,
        description: `Updated ${String(prop)} on ${elementId}`,
      });
    }
  }
};

// Delete element function
export const deleteElement = (elementId: string): void => {
  // Find which canvas contains this element (searches all canvases)
  const canvasId = findCanvasIdForElement(elementId) ?? activeCanvasId.value;

  // Capture before state for debug history
  const beforeState = captureElementSnapshot(elementId);

  // Record history before mutation
  recordHistory();

  canvases.value = canvases.value.map(c => {
    if (c.canvasId === canvasId) {
      const newElements = c.elements?.filter(el => el.elementId !== elementId);
      return { ...c, elements: newElements };
    }
    return c;
  });

  // Clear selection for deleted element
  if (selectedElementId.value === elementId) {
    selectedElementId.value = null;
    selectedElementType.value = null;
  }

  // Clean up chat thread for deleted element
  deleteThread(elementId);

  // Record debug history (only if not already tracked by AI service)
  if (beforeState && !isAIChange.value) {
    const elementType = beforeState.elementData?.type || null;
    addDebugHistoryEntry({
      affectedScope: 'element',
      initiationScope: 'element',
      source: 'human',
      actionType: 'delete',
      targetId: elementId,
      targetCanvasId: canvasId,
      targetElementType: elementType,
      origin: createHumanOriginContext('element', canvasId, elementId),
      beforeState,
      afterState: { type: 'element', elementData: undefined },
      description: `Deleted element ${elementId}`,
    });
  }
};

// Delete multiple elements
export const deleteElements = (elementIds: string[]): void => {
  if (elementIds.length === 0) return;
  recordHistory();

  const canvasId = activeCanvasId.value;
  canvases.value = canvases.value.map(c => {
    if (c.canvasId === canvasId) {
      const newElements = c.elements?.filter(el => !elementIds.includes(el.elementId));
      return { ...c, elements: newElements };
    }
    return c;
  });

  // Clear selection for deleted elements
  elementIds.forEach(id => {
    if (selectedElementId.value === id) {
      selectedElementId.value = null;
      selectedElementType.value = null;
    }
    // Clean up chat thread for each deleted element
    deleteThread(id);
  });
  selectedElementIds.value = new Set();
};

// Duplicate element
export const duplicateElement = (elementId: string): ElementData | null => {
  const canvasId = activeCanvasId.value;
  const canvas = canvases.value.find(c => c.canvasId === canvasId);
  const element = canvas?.elements?.find(el => el.elementId === elementId);
  if (!element) return null;

  // Capture before state for debug history
  const beforeState = captureCanvasSnapshot(canvasId);

  recordHistory();

  const newElement: ElementData = {
    ...JSON.parse(JSON.stringify(element)),
    elementId: `${element.type}_${Date.now()}`,
    style: {
      ...element.style,
      top: `${parseInt(String(element.style?.top || '0')) + 20}px`,
      left: `${parseInt(String(element.style?.left || '0')) + 20}px`,
    },
  };

  canvases.value = canvases.value.map(c => {
    if (c.canvasId === canvasId) {
      return { ...c, elements: [...(c.elements || []), newElement] };
    }
    return c;
  });

  // Select the new element
  selectedElementId.value = newElement.elementId;

  // Record debug history (only if not already tracked by AI service)
  if (beforeState && !isAIChange.value) {
    const afterState = captureElementSnapshot(newElement.elementId);
    if (afterState) {
      addDebugHistoryEntry({
        affectedScope: 'element',
        initiationScope: 'element',
        source: 'human',
        actionType: 'create',
        targetId: newElement.elementId,
        targetCanvasId: canvasId,
        targetElementType: newElement.type,
        origin: createHumanOriginContext('element', canvasId, elementId),
        beforeState: { type: 'element', elementData: undefined },
        afterState,
        description: `Duplicated element ${elementId} → ${newElement.elementId}`,
      });
    }
  }

  return newElement;
};

// Bring element to front (highest z-index)
export const bringToFront = (elementId: string): void => {
  const canvas = canvases.value.find(c => c.canvasId === activeCanvasId.value);
  if (!canvas?.elements) return;

  const maxZIndex = Math.max(
    ...canvas.elements.map(el => parseInt(String(el.style?.zIndex || '0'))),
  );

  updateElementProperty(elementId, 'style', { zIndex: maxZIndex + 1 });
};

// Send element to back (lowest z-index)
export const sendToBack = (elementId: string): void => {
  const canvas = canvases.value.find(c => c.canvasId === activeCanvasId.value);
  if (!canvas?.elements) return;

  recordHistory();

  const minZIndex = Math.min(
    ...canvas.elements.map(el => parseInt(String(el.style?.zIndex || '0'))),
  );

  canvases.value = canvases.value.map(c => {
    if (c.canvasId === activeCanvasId.value) {
      return {
        ...c,
        elements: c.elements?.map(el => {
          if (el.elementId === elementId) {
            return { ...el, style: { ...el.style, zIndex: minZIndex - 1 } };
          }
          return el;
        }),
      };
    }
    return c;
  });
};

export const handleAddCanvas = (options?: {
  docType?: PageDocType;
  width?: number;
  height?: number;
}): void => {
  // Capture before state for debug history
  const beforeState = capturePresentationSnapshot();

  // Record history before mutation
  recordHistory();

  // Get highest ID to ensure unique IDs
  const maxId = canvases.value.reduce((max, canvas) => Math.max(max, canvas.canvasId), 0);
  const newId = maxId + 1;

  const docType = options?.docType ?? 'presentation';
  const label =
    docType === 'doc'
      ? 'Doc Page'
      : docType === 'fixed-design'
        ? 'Fixed Design'
        : docType === 'website'
          ? 'Interactive Page'
          : `Slide ${newId} Content`;

  // Default dimensions for fixed-design (Instagram Post 4:5 — 480×600)
  const width = options?.width ?? (docType === 'fixed-design' ? 480 : undefined);
  const height = options?.height ?? (docType === 'fixed-design' ? 600 : undefined);

  // Create new canvas with white background
  const newCanvas: CanvasData = {
    canvasId: newId,
    content: label,
    color: '#FFFFFF',
    docType,
    ...(width != null && { width }),
    ...(height != null && { height }),
    ...(docType === 'doc' && {
      blocks: [{ blockId: `block_${newId}_1`, blockType: 'paragraph' as const, markdown: '' }],
    }),
  };

  // Add to canvases array
  canvases.value = [...canvases.value, newCanvas];

  // Automatically select the new canvas
  activeCanvasId.value = newId;
  // Reset element selection
  selectedElementType.value = null;
  selectedElementId.value = null;

  // Record debug history (only if not already tracked by AI service)
  if (!isAIChange.value) {
    const afterState = captureCanvasSnapshot(newId);
    if (afterState) {
      addDebugHistoryEntry({
        affectedScope: 'page',
        initiationScope: 'page',
        source: 'human',
        actionType: 'create',
        targetId: String(newId),
        targetCanvasId: newId,
        targetElementType: null,
        origin: createHumanOriginContext('page', newId, null),
        beforeState,
        afterState,
        description: `Added new ${docType} page ${newId}`,
      });
    }
  }
};

/**
 * Add a new canvas with a full-screen background image
 */
export const handleAddCanvasWithBackground = (
  backgroundImageUrl: string,
  insertAfterCanvasId?: number,
  docType?: PageDocType,
): number => {
  recordHistory();

  const maxId = canvases.value.reduce((max, canvas) => Math.max(max, canvas.canvasId), 0);
  const newId = maxId + 1;

  const newCanvas: CanvasData = {
    canvasId: newId,
    content: `Generated Slide ${newId}`,
    color: '#FFFFFF',
    elements: [
      {
        elementId: `generated_bg_${newId}`,
        type: 'image',
        style: {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundImage: `url('${backgroundImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
      },
    ],
  };

  // Insert after specific canvas if provided, otherwise append
  if (insertAfterCanvasId !== undefined) {
    const insertIndex = canvases.value.findIndex(c => c.canvasId === insertAfterCanvasId);
    if (insertIndex !== -1) {
      const newCanvases = [...canvases.value];
      newCanvases.splice(insertIndex + 1, 0, newCanvas);
      canvases.value = newCanvases;
    } else {
      canvases.value = [...canvases.value, newCanvas];
    }
  } else {
    canvases.value = [...canvases.value, newCanvas];
  }

  activeCanvasId.value = newId;
  selectedElementType.value = null;
  selectedElementId.value = null;

  return newId;
};

/**
 * Add a new canvas with multiple elements
 */
export const handleAddCanvasWithElements = (
  elements: ElementData[],
  backgroundColor?: string,
  insertAfterCanvasId?: number,
  gradient?: GradientConfig,
  docType?: PageDocType,
): number => {
  recordHistory();

  const maxId = canvases.value.reduce((max, canvas) => Math.max(max, canvas.canvasId), 0);
  const newId = maxId + 1;

  const newCanvas: CanvasData = {
    canvasId: newId,
    content: `Generated Slide ${newId}`,
    color: backgroundColor || '#FFFFFF',
    elements: elements,
    ...(gradient && { gradient }),
  };

  // Insert after specific canvas if provided, otherwise append
  if (insertAfterCanvasId !== undefined) {
    const insertIndex = canvases.value.findIndex(c => c.canvasId === insertAfterCanvasId);
    if (insertIndex !== -1) {
      const newCanvases = [...canvases.value];
      newCanvases.splice(insertIndex + 1, 0, newCanvas);
      canvases.value = newCanvases;
    } else {
      canvases.value = [...canvases.value, newCanvas];
    }
  } else {
    canvases.value = [...canvases.value, newCanvas];
  }

  activeCanvasId.value = newId;
  selectedElementType.value = null;
  selectedElementId.value = null;

  return newId;
};

/**
 * Update an existing canvas's elements
 */
export const handleUpdateCanvasElements = (
  canvasId: number,
  elements: ElementData[],
  backgroundColor?: string,
): void => {
  recordHistory();

  canvases.value = canvases.value.map(c => {
    if (c.canvasId === canvasId) {
      return {
        ...c,
        elements: elements,
        ...(backgroundColor && { color: backgroundColor }),
      };
    }
    return c;
  });
};

/**
 * Reorder canvases (slides)
 */
export const reorderCanvases = (fromIndex: number, toIndex: number): void => {
  if (fromIndex === toIndex) return;

  // Capture before state for debug history
  const beforeState = capturePresentationSnapshot();

  recordHistory();

  const newCanvases = [...canvases.value];
  const [movedCanvas] = newCanvases.splice(fromIndex, 1);
  newCanvases.splice(toIndex, 0, movedCanvas);

  canvases.value = newCanvases;

  // Record debug history (only if not already tracked by AI service)
  if (!isAIChange.value) {
    const afterState = capturePresentationSnapshot();
    addDebugHistoryEntry({
      affectedScope: 'presentation',
      initiationScope: 'presentation',
      source: 'human',
      actionType: 'reorder',
      targetId: movedCanvas ? String(movedCanvas.canvasId) : null,
      targetCanvasId: movedCanvas ? movedCanvas.canvasId : null,
      targetElementType: null,
      origin: createHumanOriginContext('presentation', null, null),
      beforeState,
      afterState,
      description: `Reordered slide from position ${fromIndex + 1} to ${toIndex + 1}`,
    });
  }
};

/**
 * Update a specific element's background image
 */
export const updateElementBackgroundImage = (
  canvasId: number,
  elementId: string,
  imageUrl: string,
): void => {
  const canvas = canvases.value.find(c => c.canvasId === canvasId);
  if (!canvas) {
    return;
  }

  const element = canvas.elements?.find(el => el.elementId === elementId);
  if (!element) {
    return;
  }

  canvases.value = canvases.value.map(c => {
    if (c.canvasId === canvasId) {
      const newElements = c.elements?.map(el => {
        if (el.elementId === elementId) {
          return {
            ...el,
            style: {
              ...el.style,
              backgroundImage: `url('${imageUrl}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            },
          };
        }
        return el;
      });
      return { ...c, elements: newElements };
    }
    return c;
  });
};

// Get active canvas helper
export const getActiveCanvas = (): CanvasData => {
  const canvas = canvases.value.find(canvas => canvas.canvasId === activeCanvasId.value);
  if (canvas) {
    return canvas;
  }
  return canvases.value[0];
};

// Multi-selection helper functions
export const addToSelection = (elementId: string): void => {
  const newSet = new Set(selectedElementIds.value);
  newSet.add(elementId);
  selectedElementIds.value = newSet;

  // Generate or update group ID when we have multiple selections
  if (newSet.size > 1 && !selectionGroupId.value) {
    selectionGroupId.value = `group-${Date.now()}`;
  }
};

export const removeFromSelection = (elementId: string): void => {
  const newSet = new Set(selectedElementIds.value);
  newSet.delete(elementId);
  selectedElementIds.value = newSet;

  // Clear group ID if we're down to 1 or 0 elements
  if (newSet.size <= 1) {
    selectionGroupId.value = null;
  }
};

export const toggleSelection = (elementId: string): void => {
  if (selectedElementIds.value.has(elementId)) {
    removeFromSelection(elementId);
  } else {
    addToSelection(elementId);
  }
};

export const clearSelection = (): void => {
  selectedElementIds.value = new Set();
  selectionGroupId.value = null;
  selectedElementId.value = null;
  selectedElementType.value = null;
};

export const setMultiSelection = (elementIds: string[]): void => {
  selectedElementIds.value = new Set(elementIds);

  if (elementIds.length > 1) {
    selectionGroupId.value = `group-${Date.now()}`;
    selectedElementId.value = null; // Clear single selection
  } else if (elementIds.length === 1) {
    selectedElementId.value = elementIds[0]; // Maintain backward compatibility
    selectionGroupId.value = null;
  } else {
    clearSelection();
  }
};

// Computed: Check if multiple elements are selected
export const hasMultiSelection = computed<boolean>(() => {
  return selectedElementIds.value.size > 1;
});

// Select all elements on the active canvas
export const selectAll = (): void => {
  const canvas = canvases.value.find(c => c.canvasId === activeCanvasId.value);
  if (!canvas?.elements || canvas.elements.length === 0) return;

  const allIds = canvas.elements.map(el => el.elementId);
  setMultiSelection(allIds);
};

/**
 * Add a new element to the active canvas
 */
export const addElementToActiveCanvas = (element: ElementData): void => {
  addElementToCanvas(activeCanvasId.value, element);
};

/**
 * Add a new element to a specific canvas
 */
export const addElementToCanvas = (canvasId: number, element: ElementData): void => {
  // Capture before state for debug history
  const beforeState = captureCanvasSnapshot(canvasId);

  recordHistory();

  canvases.value = canvases.value.map(c => {
    if (c.canvasId === canvasId) {
      const newElements = [...(c.elements || []), element];
      return { ...c, elements: newElements };
    }
    return c;
  });

  // Select the newly added element
  selectedElementId.value = element.elementId;
  selectedElementType.value = element.type;

  // Record debug history (only if not already tracked by AI service)
  if (beforeState && !isAIChange.value) {
    const afterState = captureElementSnapshot(element.elementId);
    if (afterState) {
      addDebugHistoryEntry({
        affectedScope: 'element',
        initiationScope: 'element',
        source: 'human',
        actionType: 'create',
        targetId: element.elementId,
        targetCanvasId: canvasId,
        targetElementType: element.type,
        origin: createHumanOriginContext('element', canvasId, null),
        beforeState: { type: 'element', elementData: undefined },
        afterState,
        description: `Added ${element.type} element ${element.elementId}`,
      });
    }
  }
};

// Calculate bounding box for multi-selection (for toolbar positioning)
export const getMultiSelectionBounds = (): {
  top: number;
  left: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
} | null => {
  if (selectedElementIds.value.size <= 1) return null;

  let minTop = Infinity;
  let minLeft = Infinity;
  let maxBottom = -Infinity;
  let maxRight = -Infinity;

  selectedElementIds.value.forEach(elementId => {
    const elementDiv = document.querySelector(`[data-element-id="${elementId}"]`) as HTMLElement;
    if (elementDiv) {
      // Force reflow to ensure we get the latest position
      void elementDiv.offsetHeight;
      const rect = elementDiv.getBoundingClientRect();
      minTop = Math.min(minTop, rect.top);
      minLeft = Math.min(minLeft, rect.left);
      maxBottom = Math.max(maxBottom, rect.bottom);
      maxRight = Math.max(maxRight, rect.right);
    }
  });

  // If no valid elements found, return null
  if (minTop === Infinity) return null;

  const bounds = {
    top: minTop,
    left: minLeft,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
    centerX: (minLeft + maxRight) / 2,
    centerY: (minTop + maxBottom) / 2,
  };

  return bounds;
};

// --- CREATION MODE FUNCTIONS ---

/**
 * Initialize a blank canvas for creation mode
 * This creates a single blank slide to start from
 */
export const initializeBlankCanvas = (): void => {
  canvases.value = [
    {
      canvasId: 1,
      content: 'New Presentation',
      color: '#FFFFFF',
      elements: [],
    },
  ];
  activeCanvasId.value = 1;
  clearSelection();
};

/**
 * Load the hardcoded presentation (called by create_presentation tool)
 */
export const loadHardcodedPresentation = (): void => {
  canvases.value = JSON.parse(JSON.stringify(HARDCODED_PRESENTATION));
};

/**
 * Enter creation mode - sets up blank canvas and creation mode flag
 */
export const enterCreationMode = (): void => {
  isCreationMode.value = true;
  initializeBlankCanvas();
};

/**
 * Exit creation mode - switches back to normal editing mode
 */
export const exitCreationMode = (): void => {
  isCreationMode.value = false;
};

// --- SELF-UPDATING IMAGE ELEMENT HELPERS ---

/**
 * Get an element by its ID (searches all canvases)
 */
export const getElementFromCanvases = (elementId: string): ElementData | null => {
  for (const canvas of canvases.value) {
    const element = canvas.elements?.find(el => el.elementId === elementId);
    if (element) return element;
  }
  return null;
};

/**
 * Trigger async image generation for an element with a pending prompt
 * Sets status to 'generating' and initiates the generation process
 */
export const triggerImageGeneration = (elementId: string, _prompt: string): void => {
  const canvasId = findCanvasIdForElement(elementId);
  if (!canvasId) {
    console.warn(`[triggerImageGeneration] Element ${elementId} not found in any canvas`);
    return;
  }

  // Update the element's status to 'generating'
  canvases.value = canvases.value.map(canvas => {
    if (canvas.canvasId === canvasId) {
      return {
        ...canvas,
        elements: canvas.elements?.map(el => {
          if (el.elementId === elementId) {
            return {
              ...el,
              imageGenerationStatus: 'generating' as const,
            };
          }
          return el;
        }),
      };
    }
    return canvas;
  });

  console.log(`[triggerImageGeneration] Triggered image generation for element ${elementId}`);
};

/**
 * Update an element's image generation status
 */
export const updateImageGenerationStatus = (
  elementId: string,
  status: 'pending' | 'generating' | 'completed' | 'error',
  error?: string,
): void => {
  const canvasId = findCanvasIdForElement(elementId);
  if (!canvasId) return;

  canvases.value = canvases.value.map(canvas => {
    if (canvas.canvasId === canvasId) {
      return {
        ...canvas,
        elements: canvas.elements?.map(el => {
          if (el.elementId === elementId) {
            return {
              ...el,
              imageGenerationStatus: status,
              imageGenerationError: error,
            };
          }
          return el;
        }),
      };
    }
    return canvas;
  });
};

/**
 * Clear the pending image prompt after successful generation
 * Also sets status to 'completed'
 */
export const clearPendingImagePrompt = (elementId: string): void => {
  const canvasId = findCanvasIdForElement(elementId);
  if (!canvasId) return;

  canvases.value = canvases.value.map(canvas => {
    if (canvas.canvasId === canvasId) {
      return {
        ...canvas,
        elements: canvas.elements?.map(el => {
          if (el.elementId === elementId) {
            const { pendingImagePrompt: _prompt, imageGenerationError: _error, ...rest } = el;
            return {
              ...rest,
              imageGenerationStatus: 'completed' as const,
            };
          }
          return el;
        }),
      };
    }
    return canvas;
  });

  console.log(`[clearPendingImagePrompt] Cleared pending prompt for element ${elementId}`);
};
