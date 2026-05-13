import type { BrandKit } from '@/pages/Home/Brand/data';

export type ThemeMode = 'light' | 'dark';

// Global App State
export interface AppState {
  theme: ThemeMode;
  sidebarVisible: boolean;
  secondaryNavVisible: boolean;
  mobileMenuOpen: boolean;
  objectPanelDocked?: boolean;
  dockedPanelName?: string;
  selectedObjectType?: 'text' | 'shape' | 'none';
  selectedBounds?: { x: number; y: number; width: number; height: number } | null;
  // Per-page single TextObject position (1-based page index)
  pageTextPositions?: Record<number, { x: number; y: number }>;
  // Per-page single ShapeObject position (1-based page index)
  pageShapePositions?: Record<number, { x: number; y: number }>;
  // New: Per-doctype, per-page object state for uniqueness across doctypes
  objectsByDoctype?: Partial<Record<Doctype, Record<number, PageObjectsState>>>;
  // Brand kit selection
  selectedBrandKit: string;
}

// Doctype keys supported by the editor
export type Doctype = 'presentation' | 'document' | 'whiteboard' | 'spreadsheet';

export interface ObjectTransformState {
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

export interface TextObjectState extends ObjectTransformState {
  // Reserved for future text style; keep core attribute (text remains text)
  content?: string;
}

export interface ShapeObjectState extends ObjectTransformState {
  // Content inside the shape (editable text)
  content?: string;
}

export interface PageObjectsState {
  text?: TextObjectState;
  shape?: ShapeObjectState;
}

// Action types for state updates
export type AppAction =
  | { type: 'SET_THEME'; payload: ThemeMode }
  | { type: 'SET_SIDEBAR_VISIBLE'; payload: boolean }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SECONDARY_NAV_VISIBLE'; payload: boolean }
  | { type: 'TOGGLE_SECONDARY_NAV' }
  | { type: 'SET_MOBILE_MENU_OPEN'; payload: boolean }
  | { type: 'TOGGLE_MOBILE_MENU' }
  | { type: 'SET_OBJECT_PANEL_DOCKED'; payload: boolean }
  | { type: 'SET_DOCKED_PANEL_NAME'; payload: string }
  | { type: 'OPEN_TEXT_PANEL' }
  | {
      type: 'SET_SELECTION';
      payload: {
        type: 'text' | 'shape' | 'none';
        bounds: { x: number; y: number; width: number; height: number } | null;
      };
    }
  | {
      type: 'SET_PAGE_TEXT_POSITION';
      payload: { page: number; position: { x: number; y: number } };
    }
  | {
      type: 'SET_PAGE_SHAPE_POSITION';
      payload: { page: number; position: { x: number; y: number } };
    }
  // New per-doctype per-page object updates
  | {
      type: 'SET_OBJECT_POSITION';
      payload: {
        doctype: Doctype;
        page: number;
        objectType: 'text' | 'shape';
        position: { x: number; y: number };
      };
    }
  | {
      type: 'SET_OBJECT_SIZE';
      payload: {
        doctype: Doctype;
        page: number;
        objectType: 'text' | 'shape';
        size: { width: number; height: number };
      };
    }
  | {
      type: 'SET_OBJECT_CONTENT';
      payload: {
        doctype: Doctype;
        page: number;
        objectType: 'text' | 'shape';
        content: string;
      };
    }
  | { type: 'SET_SELECTED_BRAND_KIT'; payload: string };

// Context type
export interface AppContextType {
  state: AppState;
  dispatch: (action: AppAction) => void;
  // Convenience methods for common actions
  setTheme: (theme: ThemeMode) => void;
  setSidebarVisible: (visible: boolean) => void;
  toggleSidebar: () => void;
  setSecondaryNavVisible: (visible: boolean) => void;
  toggleSecondaryNav: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setObjectPanelDocked: (docked: boolean) => void;
  setDockedPanelName: (name: string) => void;
  setSelection: (
    type: 'text' | 'shape' | 'none',
    bounds: { x: number; y: number; width: number; height: number } | null,
  ) => void;
  setPageTextPosition: (page: number, position: { x: number; y: number }) => void;
  setPageShapePosition: (page: number, position: { x: number; y: number }) => void;
  // New convenience setters for per-doctype state
  setObjectPosition: (
    doctype: Doctype,
    page: number,
    objectType: 'text' | 'shape',
    position: { x: number; y: number },
  ) => void;
  setObjectSize: (
    doctype: Doctype,
    page: number,
    objectType: 'text' | 'shape',
    size: { width: number; height: number },
  ) => void;
  setObjectContent: (
    doctype: Doctype,
    page: number,
    objectType: 'text' | 'shape',
    content: string,
  ) => void;
  // Brand kit management
  selectedBrandKit: string;
  setSelectedBrandKit: (brandKitId: string) => void;
  brandKitData: BrandKit | null;
}
