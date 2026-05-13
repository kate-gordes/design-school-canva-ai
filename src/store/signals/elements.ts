import { signal, computed } from '@preact/signals-react';
import type { DocumentElements, ElementData, PageElements } from '../types';
import { getStyleNumber } from '../types';

// Initial presentation elements (matching ai-surfaces)
// Canvas size: 1920x1080 (16:9)
const initialPresentationElements: DocumentElements = {
  1: {
    title_header: {
      elementId: 'title_header',
      type: 'text',
      content: 'MARKETING CAMPAIGN PRESENTATION',
      style: {
        position: 'absolute',
        top: 150,
        left: 300,
        fontSize: '14px',
        fontFamily: 'Courier New, monospace',
        fontWeight: 'bold',
        color: '#000000',
        letterSpacing: '1px',
        width: 450,
        height: 30,
        zIndex: 1,
      },
    },
    title_main: {
      elementId: 'title_main',
      type: 'text',
      content: 'GOURMETBITES',
      style: {
        position: 'absolute',
        top: 380,
        left: 300,
        fontSize: '72px',
        fontFamily: 'Impact, sans-serif',
        fontWeight: '400',
        color: '#333333',
        letterSpacing: '2px',
        textShadow: '2px 2px 0px #FFFFFF, 4px 4px 0px #000000',
        width: 500,
        height: 100,
        zIndex: 2,
      },
    },
    title_date: {
      elementId: 'title_date',
      type: 'text',
      content: 'November 2030',
      style: {
        position: 'absolute',
        top: 700,
        left: 300,
        fontSize: '18px',
        fontFamily: 'Courier New, monospace',
        fontWeight: 'bold',
        color: '#000000',
        width: 250,
        height: 30,
        textAlign: 'left',
        zIndex: 3,
      },
    },
    title_image: {
      elementId: 'title_image',
      type: 'image',
      content: './images/steak-fries.png',
      style: {
        position: 'absolute',
        top: 100,
        left: 1050,
        width: 570,
        height: 640,
        backgroundImage: "url('./images/steak-fries.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 24,
        zIndex: 4,
      },
    },
  },
  2: {
    summary_title: {
      elementId: 'summary_title',
      type: 'text',
      content: 'Summary',
      style: {
        position: 'absolute',
        top: 420,
        left: 200,
        fontSize: '56px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        color: '#000000',
        width: 350,
        height: 70,
        zIndex: 1,
      },
    },
    summary_box_1: {
      elementId: 'summary_box_1',
      type: 'text',
      content:
        'Gourmetbites is redefining the gourmet experience — connecting with discerning consumers who value quality, creativity, and innovation.',
      style: {
        position: 'absolute',
        top: 100,
        left: 680,
        width: 680,
        height: 180,
        fontSize: '18px',
        fontFamily: 'Courier New, monospace',
        color: '#000000',
        border: '2px solid #000000',
        borderRadius: 24,
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'transparent',
        zIndex: 2,
      },
    },
    summary_box_2: {
      elementId: 'summary_box_2',
      type: 'text',
      content:
        'Through a dynamic mix of digital and traditional channels, our campaign blends modern storytelling with premium design to elevate brand presence and deepen engagement.',
      style: {
        position: 'absolute',
        top: 310,
        left: 680,
        width: 680,
        height: 180,
        fontSize: '18px',
        fontFamily: 'Courier New, monospace',
        color: '#000000',
        border: '2px solid #000000',
        borderRadius: 24,
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'transparent',
        zIndex: 3,
      },
    },
    summary_box_3: {
      elementId: 'summary_box_3',
      type: 'text',
      content:
        "With a target of 30% growth in social media interactions and a 20% lift in sales within the first quarter, we're setting the table for lasting brand awareness and loyal customer relationships.",
      style: {
        position: 'absolute',
        top: 520,
        left: 680,
        width: 680,
        height: 180,
        fontSize: '18px',
        fontFamily: 'Courier New, monospace',
        color: '#000000',
        border: '2px solid #000000',
        borderRadius: 24,
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: 'transparent',
        zIndex: 4,
      },
    },
  },
  3: {
    creative_title: {
      elementId: 'creative_title',
      type: 'text',
      content: 'Marketing Creative',
      style: {
        position: 'absolute',
        top: 420,
        left: 150,
        fontSize: '56px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 'bold',
        color: '#000000',
        width: 450,
        height: 140,
        textAlign: 'left',
        lineHeight: '1.1',
        zIndex: 1,
      },
    },
    creative_img_1: {
      elementId: 'creative_img_1',
      type: 'image',
      content: './images/sushi-eating.png',
      style: {
        position: 'absolute',
        top: 100,
        left: 620,
        width: 400,
        height: 600,
        backgroundImage: "url('./images/sushi-eating.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 24,
        zIndex: 2,
      },
    },
    creative_img_2: {
      elementId: 'creative_img_2',
      type: 'image',
      content: './images/parmesan-fries.png',
      style: {
        position: 'absolute',
        top: 100,
        left: 1050,
        width: 380,
        height: 290,
        backgroundImage: "url('./images/parmesan-fries.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 24,
        zIndex: 3,
      },
    },
    creative_img_3: {
      elementId: 'creative_img_3',
      type: 'image',
      content: './images/lobster-bisque.png',
      style: {
        position: 'absolute',
        top: 410,
        left: 1050,
        width: 380,
        height: 290,
        backgroundImage: "url('./images/lobster-bisque.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: 24,
        zIndex: 4,
      },
    },
  },
};

// Core state signals
export const elementsByDoctype = signal<Record<string, DocumentElements>>({
  presentation: initialPresentationElements,
});
export const currentDoctype = signal<string>('presentation');
export const currentPageIndex = signal<number>(1);

// Computed: Get elements for current doctype
export const currentDoctypeElements = computed<DocumentElements>(() => {
  return elementsByDoctype.value[currentDoctype.value] ?? {};
});

// Computed: Get elements for current page
export const currentPageElements = computed<PageElements>(() => {
  const docElements = currentDoctypeElements.value;
  return docElements[currentPageIndex.value] ?? {};
});

// Computed: Get ordered elements by zIndex
export const orderedElements = computed<ElementData[]>(() => {
  const pageElements = currentPageElements.value;
  return Object.values(pageElements).sort((a, b) => (a.style.zIndex ?? 0) - (b.style.zIndex ?? 0));
});

// Get element by ID
export function getElementById(elementId: string): ElementData | undefined {
  return currentPageElements.value[elementId];
}

// Get element by ID for specific page
export function getElementByIdOnPage(
  doctype: string,
  pageIndex: number,
  elementId: string,
): ElementData | undefined {
  const docElements = elementsByDoctype.value[doctype] ?? {};
  const pageElements = docElements[pageIndex] ?? {};
  return pageElements[elementId];
}

// Get all elements for a specific page
export function getPageElements(doctype: string, pageIndex: number): PageElements {
  const docElements = elementsByDoctype.value[doctype] ?? {};
  return docElements[pageIndex] ?? {};
}

// Get max zIndex on current page
export function getMaxZIndex(): number {
  const elements = Object.values(currentPageElements.value);
  if (elements.length === 0) return 0;
  return Math.max(...elements.map(el => getStyleNumber(el.style.zIndex, 0)));
}

// Get min zIndex on current page
export function getMinZIndex(): number {
  const elements = Object.values(currentPageElements.value);
  if (elements.length === 0) return 0;
  return Math.min(...elements.map(el => getStyleNumber(el.style.zIndex, 0)));
}
