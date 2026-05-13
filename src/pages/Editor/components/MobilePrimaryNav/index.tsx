import React, { useState, useRef, useCallback } from 'react';
import { Text } from '@canva/easel';
import { TextIcon, MagicPhotoIcon, ImageIcon, MusicIcon, ChartIcon } from '@canva/easel/icons';
import {
  DesignIcon,
  DesignIconActive,
  ElementsIcon,
  ElementsIconActive,
  TextIconActive,
  TabBrandIcon,
  TabBrandIconActive,
  UploadsIcon,
  UploadsIconActive,
  ToolsIcon,
  ToolsIconActive,
  ProjectsIcon,
  ProjectsIconActive,
  AppsIcon,
  AppsIconActive,
  NavCanvaAIIcon,
  NavCanvaAIIconActive,
} from '@/shared_components/icons';
import SelectIcon from '@/pages/Editor/components/ObjectPanel/content/ToolsContent/icons/SelectIcon';
import DrawIcon from '@/pages/Editor/components/ObjectPanel/content/ToolsContent/icons/DrawIcon';
import ShapeIcon from '@/pages/Editor/components/ObjectPanel/content/ToolsContent/icons/ShapeIcon';
import LineIcon from '@/pages/Editor/components/ObjectPanel/content/ToolsContent/icons/LineIcon';
import NoteIcon from '@/pages/Editor/components/ObjectPanel/content/ToolsContent/icons/NoteIcon';
import TextToolIcon from '@/pages/Editor/components/ObjectPanel/content/ToolsContent/icons/TextToolIcon';
import TableIcon from '@/pages/Editor/components/ObjectPanel/content/ToolsContent/icons/TableIcon';
import DesignContent from '@/pages/Editor/components/ObjectPanel/content/DesignContent';
import ElementsContent from '@/pages/Editor/components/ObjectPanel/content/ElementsContent';
import TextContent from '@/pages/Editor/components/ObjectPanel/content/TextContent';
import BrandContent from '@/pages/Editor/components/ObjectPanel/content/BrandContent';
import UploadsContent from '@/pages/Editor/components/ObjectPanel/content/UploadsContent';
import ProjectsContent from '@/pages/Editor/components/ObjectPanel/content/ProjectsContent';
import AppsContent from '@/pages/Editor/components/ObjectPanel/content/AppsContent';
import MobileWonderbox from '@/pages/home/components/Wonderbox/MobileWonderbox';
import { setAIPanelOpen, setPendingMobileAIPrompt } from '@/store';
import styles from './MobilePrimaryNav.module.css';

const contentMap: Record<string, React.ComponentType> = {
  templates: DesignContent,
  elements: ElementsContent,
  text: TextContent,
  brand: BrandContent,
  uploads: UploadsContent,
  projects: ProjectsContent,
  apps: AppsContent,
};

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: 'canva-ai',
    label: 'Canva AI',
    icon: <NavCanvaAIIcon size={24} />,
    activeIcon: <NavCanvaAIIconActive size={24} />,
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: <DesignIcon />,
    activeIcon: <DesignIconActive />,
  },
  {
    id: 'elements',
    label: 'Elements',
    icon: <ElementsIcon />,
    activeIcon: <ElementsIconActive />,
  },
  {
    id: 'text',
    label: 'Text',
    icon: <TextIcon size="medium" />,
    activeIcon: <TextIconActive />,
  },
  {
    id: 'brand',
    label: 'Brand',
    icon: <TabBrandIcon />,
    activeIcon: <TabBrandIconActive />,
  },
  {
    id: 'uploads',
    label: 'Uploads',
    icon: <UploadsIcon />,
    activeIcon: <UploadsIconActive />,
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: <ToolsIcon />,
    activeIcon: <ToolsIconActive />,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: <ProjectsIcon />,
    activeIcon: <ProjectsIconActive />,
  },
  {
    id: 'apps',
    label: 'Apps',
    icon: <AppsIcon />,
    activeIcon: <AppsIconActive />,
  },
  {
    id: 'magic-media',
    label: 'Magic Media',
    icon: <MagicPhotoIcon size="medium" />,
  },
  {
    id: 'photos',
    label: 'Photos',
    icon: <ImageIcon size="medium" />,
  },
  {
    id: 'audio',
    label: 'Audio',
    icon: <MusicIcon size="medium" />,
  },
  {
    id: 'charts',
    label: 'Charts',
    icon: <ChartIcon size="medium" />,
  },
];

const whiteboardTools = [
  { id: 'select', icon: <SelectIcon size={22} />, label: 'Select' },
  { id: 'draw', icon: <DrawIcon size={22} />, label: 'Draw' },
  { id: 'shape', icon: <ShapeIcon size={22} />, label: 'Shape' },
  { id: 'line', icon: <LineIcon size={22} />, label: 'Line' },
  { id: 'note', icon: <NoteIcon size={22} />, label: 'Note' },
  { id: 'text', icon: <TextToolIcon size={22} />, label: 'Text' },
  { id: 'table', icon: <TableIcon size={22} />, label: 'Table' },
];

interface MobilePrimaryNavProps {
  defaultActiveTab?: string;
}

/**
 * Primary navigation shown at the bottom of the mobile editor when no element is selected.
 * Horizontal scrollable carousel of panel tabs.
 */
export default function MobilePrimaryNav({
  defaultActiveTab,
}: MobilePrimaryNavProps): React.ReactNode {
  const [activeTab, setActiveTab] = useState<string | null>(defaultActiveTab ?? null);
  const [selectedToolId, setSelectedToolId] = useState<string>('select');
  const [canvaAiInput, setCanvaAiInput] = useState('');
  const touchStartY = useRef<number | null>(null);

  const handleTabClick = (id: string) => {
    setActiveTab(prev => (prev === id ? null : id));
  };

  const closePanel = useCallback(() => setActiveTab(null), []);

  // Submit a prompt typed into the Canva AI flyout's `MobileWonderbox` by
  // handing it off to `MobileCanvaAIPanel` via the `pendingMobileAIPrompt`
  // signal and opening the panel. The panel reads the signal in a
  // `useEffect`, fires its real submit, and clears the signal — so this
  // surface stays a thin shell that only collects the prompt and triggers
  // the open.
  const handleCanvaAiSubmit = useCallback(() => {
    const trimmed = canvaAiInput.trim();
    if (!trimmed) return;
    setPendingMobileAIPrompt(trimmed);
    setAIPanelOpen(true);
    setCanvaAiInput('');
    setActiveTab(null);
  }, [canvaAiInput]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartY.current === null) return;
      const delta = e.changedTouches[0].clientY - touchStartY.current;
      if (delta > 50) closePanel();
      touchStartY.current = null;
    },
    [closePanel],
  );

  const hasContentPanel =
    activeTab && activeTab !== 'tools' && activeTab !== 'canva-ai' && contentMap[activeTab];
  const ContentComponent = activeTab ? contentMap[activeTab] : null;
  const hasFlyout = activeTab === 'tools' || activeTab === 'canva-ai' || hasContentPanel;

  return (
    <div className={`${styles.navWrapper} ${hasFlyout ? styles.navWrapperWithPanel : ''}`}>
      {hasFlyout && <div className={styles.backdrop} onClick={closePanel} />}

      {hasContentPanel && (
        <div className={styles.contentPanel}>
          <div
            className={styles.contentPanelHandle}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
          <div className={styles.contentPanelBody}>{ContentComponent && <ContentComponent />}</div>
        </div>
      )}

      {activeTab === 'canva-ai' && (
        <div className={styles.canvaAiFlyout}>
          <div
            className={styles.canvaAiFlyoutHandle}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
          <div className={styles.canvaAiFlyoutBody}>
            <MobileWonderbox
              placeholder="Describe your idea"
              showSettings
              value={canvaAiInput}
              onChange={setCanvaAiInput}
              onSubmit={handleCanvaAiSubmit}
            />
          </div>
        </div>
      )}

      {activeTab === 'tools' && (
        <div className={styles.toolsFlyout}>
          <div
            className={styles.toolsFlyoutHandle}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
          <div className={styles.toolsFlyoutRow}>
            {whiteboardTools.map(tool => (
              <button
                key={tool.id}
                className={`${styles.toolButton} ${selectedToolId === tool.id ? styles.toolButtonActive : ''}`}
                onClick={() => {
                  setSelectedToolId(tool.id);
                  window.dispatchEvent(
                    new CustomEvent('toolchange', { detail: { toolId: tool.id } }),
                  );
                }}
                aria-label={tool.label}
              >
                {tool.icon}
              </button>
            ))}
          </div>
        </div>
      )}

      <nav className={styles.nav} aria-label="Editor tools">
        <div className={styles.scrollContainer}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`${styles.navButton} ${isActive ? styles.navButtonActive : ''}`}
                data-tab={item.id}
                onClick={() => handleTabClick(item.id)}
                aria-label={item.label}
              >
                <span className={styles.navIcon}>
                  {isActive && item.activeIcon ? item.activeIcon : item.icon}
                </span>
                <Text size="xsmall" className={styles.navLabel}>
                  {item.label}
                </Text>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
