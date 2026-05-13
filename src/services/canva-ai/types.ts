import type { RequestScope, ChangeRecord } from '@/store/signals/aiRequests';

// Re-export for convenience
export type { RequestScope, ChangeRecord };

// Tool parameter types
export interface UpdateElementStyleParams {
  elementId: string;
  style: React.CSSProperties;
  description: string;
}

export interface UpdateElementContentParams {
  elementId: string;
  content: string;
  description: string;
}

export interface UpdateCanvasBackgroundParams {
  canvasId?: number;
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  description: string;
}

export interface GenerateImageParams {
  prompt: string;
  elementId?: string;
  width?: number;
  height?: number;
  description: string;
}

export interface EditImageParams {
  elementId: string;
  prompt: string;
  description: string;
}

export interface AddElementParams {
  type: 'text' | 'image' | 'shape';
  style: React.CSSProperties;
  content?: string;
  canvasId?: number;
  description: string;
}

export interface DeleteElementParams {
  elementId: string;
  description: string;
}

export interface BatchUpdateParams {
  updates: Array<{
    elementId: string;
    style?: React.CSSProperties;
    content?: string;
  }>;
  description: string;
}

export interface GenerateSlideParams {
  prompt: string;
  position?: 'end' | 'beginning' | number;
  description: string;
}

export interface NotifyParams {
  message: string;
}

export interface CreatePresentationParams {
  description: string;
}

export interface RequestSlideSelectionParams {
  message: string;
  currentCanvasId: number;
}

export interface CreateSlideWithDataParams {
  slideData: {
    backgroundColor?: string;
    gradient?: {
      type: 'linear' | 'radial';
      colors: string[];
      angle?: number;
    };
    elements: Array<{
      type: 'text' | 'image' | 'shape';
      content?: string; // For text: the text content; for image: the generation prompt
      style: {
        top: string;
        left: string;
        width?: string;
        height?: string;
        fontSize?: string;
        fontFamily?: string;
        fontWeight?: string;
        color?: string;
        backgroundColor?: string;
        borderRadius?: string;
        textAlign?: string;
        lineHeight?: string;
        letterSpacing?: string;
      };
    }>;
  };
  position?: 'end' | 'beginning' | number;
  description: string;
}

export interface CreateMultipleSlidesParams {
  slides: Array<{
    slideData: {
      backgroundColor?: string;
      gradient?: {
        type: 'linear' | 'radial';
        colors: string[];
        angle?: number;
      };
      elements: Array<{
        type: 'text' | 'image' | 'shape';
        content?: string; // For text: the text content; for image: the generation prompt
        style: {
          top: string;
          left: string;
          width?: string;
          height?: string;
          fontSize?: string;
          fontFamily?: string;
          fontWeight?: string;
          color?: string;
          backgroundColor?: string;
          borderRadius?: string;
          textAlign?: string;
          lineHeight?: string;
          letterSpacing?: string;
        };
      }>;
    };
    description: string;
  }>;
  position?: 'end' | 'beginning' | number;
}

// Tool result types
export interface ToolResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

// Callbacks interface for AI service
export interface AIServiceCallbacks {
  onStream?: (content: string) => void;
  onNotification?: (message: string) => void;
  onModelEnd?: () => void;
  onToolStart?: (toolName: string) => void;
  onToolEnd?: (toolName: string, result: unknown) => void;
  onComplete?: (requestId: string) => void;
  onError?: (error: Error) => void;
}

// Context types for different scopes
export interface PresentationContext {
  scope: 'presentation';
  canvases: Array<{
    canvasId: number;
    content: string;
    color?: string;
    elements: Array<{
      elementId: string;
      type: string;
      style: React.CSSProperties;
      content?: string;
    }>;
  }>;
  totalSlides: number;
}

export interface PageContext {
  scope: 'page';
  canvasId: number;
  content: string;
  color?: string;
  currentSlideIndex?: number;
  totalSlides?: number;
  elements: Array<{
    elementId: string;
    type: string;
    style: React.CSSProperties;
    content?: string;
  }>;
}

export interface ElementContext {
  scope: 'element';
  canvasId: number;
  selectedElements: Array<{
    elementId: string;
    type: string;
    style: React.CSSProperties;
    content?: string;
  }>;
}

export type AIContext = PresentationContext | PageContext | ElementContext;

// History entry for AI conversations
export interface AIHistoryEntry {
  role: 'user' | 'assistant';
  content: string;
}
