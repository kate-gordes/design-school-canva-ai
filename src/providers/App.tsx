import { useReducer, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { AppContext } from '@/contexts/App';
import type { AppState, AppAction, ThemeMode, Doctype, PageObjectsState } from '@/types';
import { getBrandKit } from '@/pages/Home/Brand/data';

// Initial state
const initialState: AppState = {
  theme: 'light',
  sidebarVisible: true,
  secondaryNavVisible: true,
  mobileMenuOpen: false,
  objectPanelDocked: false,
  selectedObjectType: 'none',
  selectedBounds: null,
  selectedBrandKit: 'Canva Brand Kit', // Default to Canva Brand Kit
};

// Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_SIDEBAR_VISIBLE':
      return { ...state, sidebarVisible: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarVisible: !state.sidebarVisible };
    case 'SET_SECONDARY_NAV_VISIBLE':
      return { ...state, secondaryNavVisible: action.payload };
    case 'TOGGLE_SECONDARY_NAV':
      return { ...state, secondaryNavVisible: !state.secondaryNavVisible };
    case 'SET_MOBILE_MENU_OPEN':
      return { ...state, mobileMenuOpen: action.payload };
    case 'TOGGLE_MOBILE_MENU':
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
    case 'SET_OBJECT_PANEL_DOCKED':
      return { ...state, objectPanelDocked: action.payload };
    case 'SET_DOCKED_PANEL_NAME':
      return { ...state, dockedPanelName: action.payload };
    case 'OPEN_TEXT_PANEL':
      return { ...state, objectPanelDocked: true };
    case 'SET_SELECTION':
      return {
        ...state,
        selectedObjectType: action.payload.type,
        selectedBounds: action.payload.bounds,
      };
    case 'SET_PAGE_TEXT_POSITION': {
      const { page, position } = action.payload;
      return {
        ...state,
        pageTextPositions: { ...(state.pageTextPositions ?? {}), [page]: position },
      };
    }
    case 'SET_PAGE_SHAPE_POSITION': {
      const { page, position } = action.payload;
      return {
        ...state,
        pageShapePositions: { ...(state.pageShapePositions ?? {}), [page]: position },
      };
    }
    case 'SET_OBJECT_POSITION': {
      const { doctype, page, objectType, position } = action.payload;
      const byDoc = state.objectsByDoctype ?? {};
      const docPages = byDoc[doctype] ?? {};
      const prevPage: PageObjectsState = docPages[page] ?? {};
      const prevObj = prevPage[objectType] ?? {};
      const nextPage: PageObjectsState = {
        ...prevPage,
        [objectType]: { ...prevObj, position },
      } as PageObjectsState;
      return {
        ...state,
        objectsByDoctype: { ...byDoc, [doctype]: { ...docPages, [page]: nextPage } },
      };
    }
    case 'SET_OBJECT_SIZE': {
      const { doctype, page, objectType, size } = action.payload;
      const byDoc = state.objectsByDoctype ?? {};
      const docPages = byDoc[doctype] ?? {};
      const prevPage: PageObjectsState = docPages[page] ?? {};
      const prevObj = prevPage[objectType] ?? {};
      const nextPage: PageObjectsState = {
        ...prevPage,
        [objectType]: { ...prevObj, size },
      } as PageObjectsState;
      return {
        ...state,
        objectsByDoctype: { ...byDoc, [doctype]: { ...docPages, [page]: nextPage } },
      };
    }
    case 'SET_OBJECT_CONTENT': {
      const { doctype, page, objectType, content } = action.payload;
      const byDoc = state.objectsByDoctype ?? {};
      const docPages = byDoc[doctype] ?? {};
      const prevPage: PageObjectsState = docPages[page] ?? {};
      const prevObj = prevPage[objectType] ?? {};
      const nextPage: PageObjectsState = {
        ...prevPage,
        [objectType]: { ...prevObj, content },
      } as PageObjectsState;
      return {
        ...state,
        objectsByDoctype: { ...byDoc, [doctype]: { ...docPages, [page]: nextPage } },
      };
    }
    case 'SET_SELECTED_BRAND_KIT':
      return { ...state, selectedBrandKit: action.payload };
    default:
      return state;
  }
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Convenience methods for common actions
  const setTheme = useCallback((theme: ThemeMode) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  const setSidebarVisible = useCallback((visible: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_VISIBLE', payload: visible });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const setSecondaryNavVisible = useCallback((visible: boolean) => {
    dispatch({ type: 'SET_SECONDARY_NAV_VISIBLE', payload: visible });
  }, []);

  const toggleSecondaryNav = useCallback(() => {
    dispatch({ type: 'TOGGLE_SECONDARY_NAV' });
  }, []);

  const setMobileMenuOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: open });
  }, []);

  const toggleMobileMenu = useCallback(() => {
    dispatch({ type: 'TOGGLE_MOBILE_MENU' });
  }, []);

  const setObjectPanelDocked = useCallback((docked: boolean) => {
    dispatch({ type: 'SET_OBJECT_PANEL_DOCKED', payload: docked });
  }, []);

  const setDockedPanelName = useCallback((name: string) => {
    dispatch({ type: 'SET_DOCKED_PANEL_NAME', payload: name });
  }, []);

  const setSelection = useCallback(
    (
      type: 'text' | 'shape' | 'none',
      bounds: { x: number; y: number; width: number; height: number } | null,
    ) => {
      dispatch({ type: 'SET_SELECTION', payload: { type, bounds } });
    },
    [],
  );

  const setPageTextPosition = useCallback((page: number, position: { x: number; y: number }) => {
    dispatch({ type: 'SET_PAGE_TEXT_POSITION', payload: { page, position } });
  }, []);

  const setPageShapePosition = useCallback((page: number, position: { x: number; y: number }) => {
    dispatch({ type: 'SET_PAGE_SHAPE_POSITION', payload: { page, position } });
  }, []);

  const setObjectPosition = useCallback(
    (
      doctype: Doctype,
      page: number,
      objectType: 'text' | 'shape',
      position: { x: number; y: number },
    ) => {
      dispatch({ type: 'SET_OBJECT_POSITION', payload: { doctype, page, objectType, position } });
    },
    [],
  );

  const setObjectSize = useCallback(
    (
      doctype: Doctype,
      page: number,
      objectType: 'text' | 'shape',
      size: { width: number; height: number },
    ) => {
      dispatch({ type: 'SET_OBJECT_SIZE', payload: { doctype, page, objectType, size } });
    },
    [],
  );

  const setObjectContent = useCallback(
    (doctype: Doctype, page: number, objectType: 'text' | 'shape', content: string) => {
      dispatch({ type: 'SET_OBJECT_CONTENT', payload: { doctype, page, objectType, content } });
    },
    [],
  );

  const setSelectedBrandKit = useCallback((brandKitId: string) => {
    dispatch({ type: 'SET_SELECTED_BRAND_KIT', payload: brandKitId });
  }, []);

  // Compute brand kit data from selected brand kit
  const brandKitData = useMemo(() => {
    return getBrandKit(state.selectedBrandKit as any);
  }, [state.selectedBrandKit]);

  const contextValue = {
    state,
    dispatch,
    setTheme,
    setSidebarVisible,
    toggleSidebar,
    setSecondaryNavVisible,
    toggleSecondaryNav,
    setMobileMenuOpen,
    toggleMobileMenu,
    setObjectPanelDocked,
    setDockedPanelName,
    setSelection,
    setPageTextPosition,
    setPageShapePosition,
    setObjectPosition,
    setObjectSize,
    setObjectContent,
    selectedBrandKit: state.selectedBrandKit,
    setSelectedBrandKit,
    brandKitData,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}
