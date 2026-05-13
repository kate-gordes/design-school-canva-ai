import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ChevronDownIcon,
  MagicPencilIcon,
  ImagePlusIcon,
  MagicFilledIcon,
  CodeIcon,
  MagicVideoIcon,
  ProCrownGreyIcon,
  PrinterFilledIcon,
  DocsIcon,
  MobileSocialMediaFilledIcon,
} from '@canva/easel/icons';

export type TabId = 'designs' | 'templates' | 'ai';

interface FilterOption {
  id: string;
  label: string;
  start?: ReactNode;
  end?: ReactNode;
}

interface ActionButton {
  id: string;
  label: string;
  start?: ReactNode;
  end?: ReactNode;
}

interface FilterOptionItem {
  value: string;
  label: string;
  icon?: ReactNode;
  selected?: boolean;
}

interface TabConfig {
  placeholder: string;
  bottomFilters: FilterOption[];
  actionButtons?: ActionButton[];
  filterOptions?: Record<string, FilterOptionItem[]>;
}

interface WonderboxState {
  selectedTab: TabId;
  activeFilter: string | null;
  searchQuery: string;
  isExpanded: boolean;
  isFocused: boolean;
  tabConfigs: Record<TabId, TabConfig>;
  selectedFilterOptions: Record<string, Record<string, string>>;
}

interface WonderboxContextType {
  state: WonderboxState;
  setSelectedTab: (tabId: TabId) => void;
  setActiveFilter: (filterId: string | null) => void;
  setSearchQuery: (query: string) => void;
  deactivateFilter: () => void;
  setExpanded: (expanded: boolean) => void;
  setFocused: (focused: boolean) => void;
  setFilterOption: (filterId: string, optionValue: string) => void;
}

const WonderboxContext = createContext<WonderboxContextType | undefined>(undefined);

interface WonderboxProviderProps {
  children: ReactNode;
  initialTab?: TabId;
  initialExpanded?: boolean;
}

const tabConfigs: Record<TabId, TabConfig> = {
  designs: {
    placeholder: 'Search designs, folders and uploads',
    bottomFilters: [
      { id: 'type', label: 'Type', end: <ChevronDownIcon size="small" /> },
      { id: 'category', label: 'Category', end: <ChevronDownIcon size="small" /> },
      { id: 'owner', label: 'Owner', end: <ChevronDownIcon size="small" /> },
      { id: 'date', label: 'Date modified', end: <ChevronDownIcon size="small" /> },
    ],
    filterOptions: {
      type: [
        { value: 'any', label: 'Any type', selected: true },
        { value: 'designs', label: 'Designs' },
        { value: 'brand-templates', label: 'Brand Templates' },
        { value: 'images', label: 'Images' },
        { value: 'folders', label: 'Folders' },
        { value: 'videos', label: 'Videos' },
      ],
      category: [
        { value: 'any', label: 'All categories', selected: true },
        { value: 'doc', label: 'Doc' },
        { value: 'sheet', label: 'Sheet' },
        { value: 'mobile-video', label: 'Mobile Video' },
        { value: 'whiteboard', label: 'Whiteboard' },
        { value: 'video', label: 'Video' },
      ],
      owner: [
        { value: 'any', label: 'Any owner', selected: true },
        { value: 'shared', label: 'Shared with you' },
        { value: 'marcio', label: 'Marcio Puga (You)' },
        { value: 'johnsmith', label: 'John Smith' },
      ],
      date: [
        { value: 'any', label: 'Any time', selected: true },
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'last30', label: 'Last 30 days' },
        { value: 'last90', label: 'Last 90 days' },
        { value: 'last-year', label: 'Last year' },
      ],
    },
  },
  templates: {
    placeholder: 'Search millions of templates',
    bottomFilters: [
      { id: 'optimize', label: 'Optimize operations' },
      { id: 'print', label: 'Print Products', start: <PrinterFilledIcon size="small" /> },
      { id: 'doc', label: 'Doc', start: <DocsIcon size="small" /> },
      { id: 'food', label: 'Food' },
      { id: 'social', label: 'Social media', start: <MobileSocialMediaFilledIcon size="small" /> },
      { id: 'design-type', label: 'Design Type', end: <ChevronDownIcon size="small" /> },
    ],
  },
  ai: {
    placeholder: "Describe your idea, and I'll bring it to life",
    bottomFilters: [],
    actionButtons: [
      { id: 'design-for-me', label: 'Design for me', start: <MagicFilledIcon size="small" /> },
      { id: 'create-image', label: 'Create an image', start: <ImagePlusIcon size="small" /> },
      { id: 'draft-doc', label: 'Draft a doc', start: <MagicPencilIcon size="small" /> },
      { id: 'code-for-me', label: 'Code for me', start: <CodeIcon size="small" /> },
      {
        id: 'create-video',
        label: 'Create a video clip',
        start: <MagicVideoIcon size="small" />,
        end: <ProCrownGreyIcon size="small" />,
      },
    ],
  },
};

export function WonderboxProvider({
  children,
  initialTab = 'designs',
  initialExpanded = false,
}: WonderboxProviderProps) {
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<TabId>(initialTab);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExpanded, setExpanded] = useState<boolean>(initialExpanded);
  const [isFocused, setFocused] = useState<boolean>(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<
    Record<string, Record<string, string>>
  >({
    designs: {},
    templates: {},
    ai: {},
  });

  // Auto-select AI tab when on /ai route
  useEffect(() => {
    if (location.pathname === '/ai') {
      setSelectedTab('ai');
    }
  }, [location.pathname]);

  const deactivateFilter = () => {
    setActiveFilter(null);
  };

  const setFilterOption = (filterId: string, optionValue: string) => {
    setSelectedFilterOptions(prev => ({
      ...prev,
      [selectedTab]: {
        ...prev[selectedTab],
        [filterId]: optionValue,
      },
    }));
    deactivateFilter();
  };

  const value: WonderboxContextType = {
    state: {
      selectedTab,
      activeFilter,
      searchQuery,
      isExpanded,
      isFocused,
      tabConfigs,
      selectedFilterOptions,
    },
    setSelectedTab,
    setActiveFilter,
    setSearchQuery,
    deactivateFilter,
    setExpanded,
    setFocused,
    setFilterOption,
  };

  return <WonderboxContext.Provider value={value}>{children}</WonderboxContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWonderbox(): WonderboxContextType {
  const context = useContext(WonderboxContext);
  if (context === undefined) {
    throw new Error('useWonderbox must be used within a WonderboxProvider');
  }
  return context;
}
