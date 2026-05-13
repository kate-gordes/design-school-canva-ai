import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Box, Button, Menu } from '@canva/easel';
import { XIcon, ChevronLeftIcon } from '@canva/easel/icons';
import { useSignals } from '@preact/signals-react/runtime';
import { useLocation } from 'react-router-dom';
import { Drawer } from '@canva/easel/surface/drawer';
import TabItem from './TabItem';
import CanvaAIContent from './content/CanvaAIContent';
import DesignContent from './content/DesignContent';
import ElementsContent from './content/ElementsContent';
import TextContent from './content/TextContent';
import BrandContent from './content/BrandContent';
import UploadsContent from './content/UploadsContent';
import ToolsContent from './content/ToolsContent';
import ProjectsContent from './content/ProjectsContent';
import AppsContent from './content/AppsContent';
import UserAvatar from '@/shared_components/UserAvatar';
import {
  DesignIcon,
  DesignIconActive,
  ElementsIcon,
  ElementsIconActive,
  TextIcon,
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
import styles from './ObjectPanel.module.css';
import EditPanel from '@/pages/Editor/components/EditPanel';
import EditTextContent from '@/pages/Editor/components/EditPanel/content/TextContent';
import TextColorContent from '@/pages/Editor/components/EditPanel/content/TextColorContent';
import EffectsContent from '@/pages/Editor/components/EditPanel/content/EffectsContent';
import AnimateContent from '@/pages/Editor/components/EditPanel/content/AnimateContent';
import PositionContent from '@/pages/Editor/components/EditPanel/content/PositionContent';
import ShapeContent from '@/pages/Editor/components/EditPanel/content/ShapeContent';
import ColorContent from '@/pages/Editor/components/EditPanel/content/ColorContent';
import BrandPanel from '@/pages/Home/Brand/components/BrandPanel';
import { useAppContext } from '@/hooks/useAppContext';
import { aiPanelOpen, setAIPanelOpen } from '@/store/signals/panels';

// Utility: dispatch a global event with a string payload in 'detail'
const emit = (name: string, detail?: string) => {
  window.dispatchEvent(new CustomEvent(name, { detail }));
};

// Content component mapping
const contentComponents = {
  'Canva AI': CanvaAIContent,
  Templates: DesignContent,
  Elements: ElementsContent,
  Text: TextContent,
  Brand: BrandContent,
  Uploads: UploadsContent,
  Tools: ToolsContent,
  Projects: ProjectsContent,
  Apps: AppsContent,
};

interface ObjectPanelProps {
  contentOverride?: React.ReactNode;
}

export default function Tabs({ contentOverride }: ObjectPanelProps): React.ReactNode {
  useSignals();
  const location = useLocation();
  const { setObjectPanelDocked, setDockedPanelName, state } = useAppContext();
  const [activeItem, setActiveItem] = useState<string>('');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [toolbarOverride, setToolbarOverride] = useState<React.ReactNode | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  // Whether to vertically offset the floating edit panel to avoid overlapping with the toolbar
  const [offsetEditPanel, setOffsetEditPanel] = useState<boolean>(false);
  const openPanelIdRef = useRef<string | null>(null);
  const [brandContentVisible, setBrandContentVisible] = useState<boolean>(true);

  // Helper to open an EditPanel with the given content and emit events
  const openPanel = (id: string, node: React.ReactNode) => {
    setActiveItem('');
    setHoveredItem(null);
    setObjectPanelDocked(false);
    setDockedPanelName('');
    setToolbarOverride(
      <EditPanel
        open={true}
        onRequestClose={() => {
          setToolbarOverride(null);
          openPanelIdRef.current = null;
          emit('panelClosed', id);
        }}
        content={node}
      />,
    );
    openPanelIdRef.current = id;
    emit('panelOpened', id);
  };

  useEffect(() => {
    const onCloseReq = () => {
      if (openPanelIdRef.current) {
        const id = openPanelIdRef.current;
        setToolbarOverride(null);
        openPanelIdRef.current = null;
        emit('panelClosed', id);
      }
    };
    window.addEventListener('close-edit-panel', onCloseReq);
    return () => window.removeEventListener('close-edit-panel', onCloseReq);
  }, []);

  // Listen for toolbar request to open Text edit panel (left drawer)
  useEffect(() => {
    const handler = () =>
      openPanel('text', <EditTextContent onClose={() => setToolbarOverride(null)} />);
    window.addEventListener('open-edit-panel-text', handler);
    return () => window.removeEventListener('open-edit-panel-text', handler);
  }, [setObjectPanelDocked]);

  // Open Shape edit panel from toolbar
  useEffect(() => {
    const handler = () =>
      openPanel('shape', <ShapeContent onClose={() => setToolbarOverride(null)} />);
    window.addEventListener('open-edit-panel-shape', handler);
    return () => window.removeEventListener('open-edit-panel-shape', handler);
  }, [setObjectPanelDocked]);

  // Open Color panel from toolbar
  useEffect(() => {
    const handler = () =>
      openPanel('color', <ColorContent onClose={() => setToolbarOverride(null)} />);
    window.addEventListener('open-edit-panel-color', handler);
    return () => window.removeEventListener('open-edit-panel-color', handler);
  }, [setObjectPanelDocked]);

  // Open Text Color panel from toolbar
  useEffect(() => {
    const handler = () =>
      openPanel(
        'text-color',
        <TextColorContent onClose={() => setToolbarOverride(null)} title="Text color" />,
      );
    window.addEventListener('open-edit-panel-text-color', handler);
    return () => window.removeEventListener('open-edit-panel-text-color', handler);
  }, [setObjectPanelDocked]);

  // Open Animate panel from toolbar (EditPanel)
  useEffect(() => {
    const handler = () =>
      openPanel('animate', <AnimateContent onClose={() => setToolbarOverride(null)} />);
    window.addEventListener('open-edit-panel-animate', handler);
    return () => window.removeEventListener('open-edit-panel-animate', handler);
  }, [setObjectPanelDocked]);

  // Open Effects edit panel from toolbar (EditPanel)
  useEffect(() => {
    const handler = () =>
      openPanel('effects', <EffectsContent onClose={() => setToolbarOverride(null)} />);
    window.addEventListener('open-edit-panel-effects', handler);
    return () => window.removeEventListener('open-edit-panel-effects', handler);
  }, [setObjectPanelDocked]);

  // Open Position edit panel from toolbar (EditPanel)
  useEffect(() => {
    const handler = () =>
      openPanel('position', <PositionContent onClose={() => setToolbarOverride(null)} />);
    window.addEventListener('open-edit-panel-position', handler);
    return () => window.removeEventListener('open-edit-panel-position', handler);
  }, [setObjectPanelDocked]);

  // Open Canva AI tab from toolbar "Ask Canva" button
  useEffect(() => {
    const handler = () => {
      setActiveItem('Canva AI');
      setHoveredItem(null);
      setObjectPanelDocked(true);
      setDockedPanelName('Canva AI');
      setAIPanelOpen(true);
    };
    window.addEventListener('open-canva-ai-panel', handler);
    return () => window.removeEventListener('open-canva-ai-panel', handler);
  }, [setObjectPanelDocked, setDockedPanelName]);

  // Calculate current content to show
  const currentContent = activeItem || hoveredItem;
  const isOpen = Boolean(currentContent);

  // Clear any pending timeout
  const clearHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // Schedule hiding the panel
  const scheduleHide = () => {
    clearHideTimeout();
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredItem(null);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearHideTimeout();
      setObjectPanelDocked(false);
      setDockedPanelName('');
    };
  }, [setObjectPanelDocked, setDockedPanelName]);

  useEffect(() => {
    if (aiPanelOpen.value && activeItem !== 'Canva AI') {
      setActiveItem('Canva AI');
      setHoveredItem(null);
      setObjectPanelDocked(true);
      setDockedPanelName('Canva AI');
    }
  }, [activeItem, setDockedPanelName, setObjectPanelDocked]);

  const handleItemClick = (title: string) => {
    const willOpen = activeItem !== title;
    if (activeItem === title) {
      setActiveItem('');
      setHoveredItem(null);
      setObjectPanelDocked(false);
      setDockedPanelName('');
    } else {
      setActiveItem(title);
      setHoveredItem(null);
      setObjectPanelDocked(true);
      setDockedPanelName(title);
    }
    if (title === 'Canva AI') {
      setAIPanelOpen(willOpen);
    } else if (aiPanelOpen.value) {
      setAIPanelOpen(false);
    }
    clearHideTimeout();
  };

  const handleDrawerClose = () => {
    setActiveItem('');
    setHoveredItem(null);
    clearHideTimeout();
    setObjectPanelDocked(false);
    setDockedPanelName('');
    if (activeItem === 'Canva AI' || hoveredItem === 'Canva AI') {
      setAIPanelOpen(false);
    }
  };

  const getDrawerWidth = () => {
    if (currentContent === 'Tools') {
      return 'small';
    }
    return 'medium';
  };

  const handleHover = (title: string | null) => {
    if (title) {
      // Show immediately and clear any pending hide
      clearHideTimeout();
      setHoveredItem(title);
    } else if (!activeItem) {
      // Only schedule hide if no active item
      scheduleHide();
    }
  };

  // Get the appropriate content component
  const getContentComponent = (tabName: string | null) => {
    if (!tabName) return null;
    const ContentComponent = contentComponents[tabName as keyof typeof contentComponents];
    return ContentComponent ? <ContentComponent /> : null;
  };

  // Check if we're on Home page
  const isHomePage = location.pathname === '/';

  // Floating when a) built-in content has no active item and is open due to hover or b) override is provided and object panel is not docked
  const shouldFloat = contentOverride ? !state.objectPanelDocked : !activeItem && isOpen;

  const effectiveOverride = contentOverride ?? toolbarOverride;

  // Conditionally offset toolbar-triggered EditPanels when the toolbar would overlap the drawer
  useLayoutEffect(() => {
    // Only applies to toolbar edit panels when floating (not docked)
    if (!effectiveOverride || state.objectPanelDocked) {
      setOffsetEditPanel(false);
      return;
    }

    const container = rootRef.current;
    if (!container) {
      // Fail-safe: if we cannot measure, prefer offsetting to avoid overlap
      setOffsetEditPanel(true);
      return;
    }

    const TAB_BAR_WIDTH = 72; // fixed tab column
    const PANEL_WIDTH = 360; // standard edit panel width

    // Cache from last toolbar event; fall back to union of DOM rects if not available
    let lastToolbarRect: { left: number; top: number; right: number; bottom: number } | null = null;

    const computeFromDom = (): {
      left: number;
      top: number;
      right: number;
      bottom: number;
    } | null => {
      const nodes = Array.from(
        document.querySelectorAll('[data-editor-toolbar-root="true"]'),
      ) as HTMLElement[];
      const rects = nodes
        .map(n => n.getBoundingClientRect())
        .filter(r => r.width > 0 && r.height > 0);
      if (rects.length === 0) return null;
      const firstRect = rects[0];
      return rects.reduce(
        (acc, r) => ({
          left: Math.min(acc.left, r.left),
          top: Math.min(acc.top, r.top),
          right: Math.max(acc.right, r.right),
          bottom: Math.max(acc.bottom, r.bottom),
        }),
        {
          left: firstRect.left,
          top: firstRect.top,
          right: firstRect.right,
          bottom: firstRect.bottom,
        },
      );
    };

    const computeShouldOffset = () => {
      const t = lastToolbarRect || computeFromDom();
      if (!t) {
        setOffsetEditPanel(true);
        return;
      }
      const c = container.getBoundingClientRect();
      const panelLeft = c.left + TAB_BAR_WIDTH;
      const panelRight = panelLeft + PANEL_WIDTH;
      const panelTop = c.top; // floating drawers start at the container top
      const overlapsHoriz = t.right > panelLeft && t.left < panelRight;
      const overlapsVert = t.bottom > panelTop;
      setOffsetEditPanel(overlapsHoriz && overlapsVert);
    };

    computeShouldOffset();

    // Observe container and toolbar elements for size changes
    const containerObserver = new ResizeObserver(computeShouldOffset);
    containerObserver.observe(container);

    const toolbarObservers: ResizeObserver[] = [];
    const initToolbarObservers = () => {
      // Disconnect prior observers
      toolbarObservers.forEach(o => o.disconnect());
      toolbarObservers.length = 0;
      const nodes = Array.from(
        document.querySelectorAll('[data-editor-toolbar-root="true"]'),
      ) as HTMLElement[];
      nodes.forEach(node => {
        const ro = new ResizeObserver(computeShouldOffset);
        ro.observe(node);
        toolbarObservers.push(ro);
      });
    };

    initToolbarObservers();
    window.addEventListener('resize', computeShouldOffset);
    window.addEventListener('scroll', computeShouldOffset, true);

    // Watch DOM changes that could add/remove toolbars
    const mo = new MutationObserver(initToolbarObservers);
    mo.observe(document.body, { childList: true, subtree: true, attributes: true });

    // Listen to toolbar rect broadcasts for precise measurements
    const onToolbarUpdated = (e: Event) => {
      const d = (e as CustomEvent).detail as
        | {
            left: number;
            top: number;
            right: number;
            bottom: number;
            width: number;
            height: number;
          }
        | undefined;
      if (d && typeof d.left === 'number') {
        lastToolbarRect = { left: d.left, top: d.top, right: d.right, bottom: d.bottom };
        computeShouldOffset();
      }
    };
    window.addEventListener('editor-toolbar-updated', onToolbarUpdated as EventListener);

    return () => {
      containerObserver.disconnect();
      toolbarObservers.forEach(o => o.disconnect());
      window.removeEventListener('resize', computeShouldOffset);
      window.removeEventListener('scroll', computeShouldOffset, true);
      mo.disconnect();
      window.removeEventListener('editor-toolbar-updated', onToolbarUpdated as EventListener);
    };
  }, [effectiveOverride, state.objectPanelDocked]);

  const shouldOffsetEditPanel = !state.objectPanelDocked && offsetEditPanel;

  return (
    <Box
      display="flex"
      flexDirection="row"
      height="full"
      position="relative"
      data-testid="object-panel"
      ref={rootRef}
    >
      {/* Tab bar - always visible */}
      <Box
        background={activeItem && activeItem !== 'Tools' ? 'surface' : undefined}
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        height="full"
        className={styles.tabBar}
      >
        <Menu role="menu" variant="regular">
          <TabItem
            title="Canva AI"
            activeItem={activeItem || ''}
            onItemClick={handleItemClick}
            icon={<NavCanvaAIIcon size={28} />}
            activeIcon={<NavCanvaAIIconActive size={28} />}
            docked={!!activeItem}
            onHover={handleHover}
          />
          <TabItem
            title="Templates"
            activeItem={activeItem || ''}
            onItemClick={handleItemClick}
            icon={<DesignIcon />}
            activeIcon={<DesignIconActive />}
            docked={!!activeItem}
            onHover={handleHover}
          />
          <TabItem
            title="Elements"
            activeItem={activeItem || ''}
            onItemClick={handleItemClick}
            icon={<ElementsIcon />}
            activeIcon={<ElementsIconActive />}
            docked={!!activeItem}
            onHover={handleHover}
          />
          <TabItem
            title="Text"
            activeItem={activeItem || ''}
            onItemClick={handleItemClick}
            icon={<TextIcon />}
            activeIcon={<TextIconActive />}
            docked={!!activeItem}
            onHover={handleHover}
          />
          <TabItem
            title="Brand"
            activeItem={activeItem || ''}
            onItemClick={handleItemClick}
            icon={<TabBrandIcon />}
            activeIcon={<TabBrandIconActive />}
            docked={!!activeItem}
            onHover={handleHover}
          />
          <TabItem
            title="Uploads"
            activeItem={activeItem || ''}
            onItemClick={handleItemClick}
            icon={<UploadsIcon />}
            activeIcon={<UploadsIconActive />}
            docked={!!activeItem}
            onHover={handleHover}
          />
          <TabItem
            title="Tools"
            activeItem={activeItem || ''}
            onItemClick={handleItemClick}
            icon={<ToolsIcon />}
            activeIcon={<ToolsIconActive />}
            docked={!!activeItem}
            onHover={handleHover}
          />
          <TabItem
            title="Projects"
            activeItem={activeItem || ''}
            onItemClick={handleItemClick}
            icon={<ProjectsIcon />}
            activeIcon={<ProjectsIconActive />}
            docked={!!activeItem}
            onHover={handleHover}
          />
          <TabItem
            title="Apps"
            activeItem={activeItem || ''}
            onItemClick={handleItemClick}
            icon={<AppsIcon />}
            activeIcon={<AppsIconActive />}
            docked={!!activeItem}
            onHover={handleHover}
          />
        </Menu>

        {/* Avatar at the bottom - only show on Home page */}
        {isHomePage && (
          <Box paddingBottom="2u" paddingX="1u" display="flex" justifyContent="center">
            <UserAvatar />
          </Box>
        )}
      </Box>

      {/* Content area container - drawer positions relative to this */}
      <Box
        position="relative"
        height="full"
        width="full"
        className={`${shouldFloat ? styles.floatingDrawerContainer : ''} ${shouldOffsetEditPanel ? styles.editPanelOffset : ''}`}
      >
        {effectiveOverride ? (
          shouldOffsetEditPanel ? (
            // Plain div: drawer offset wrapper composes transform via .drawerOffsetWrapper;
            // Easel Box reset would wipe the translate hook for EditPanel offsets.
            <div className={styles.drawerOffsetWrapper}>
              <Drawer
                open={true}
                onRequestClose={handleDrawerClose}
                direction="start"
                width={'medium'}
                disableAnimation={true}
                display={state.objectPanelDocked ? 'docked' : 'floating'}
                backdropVisible={false}
                mode={state.objectPanelDocked ? 'parallel' : 'contained'}
                collapsible={false}
                headerEnd="none"
              >
                {/* Plain div: mouse-enter/leave hooks drive autohide timers inside the
                    Drawer chrome without altering its layout. */}
                <div
                  onMouseEnter={() => {
                    clearHideTimeout();
                  }}
                  onMouseLeave={() => {
                    if (!activeItem) {
                      scheduleHide();
                    }
                  }}
                >
                  <Box
                    height="full"
                    position="relative"
                    padding="0"
                    className={`${styles.drawerContainer}`}
                  >
                    {effectiveOverride}
                  </Box>
                </div>
              </Drawer>
            </div>
          ) : (
            <Drawer
              open={true}
              onRequestClose={handleDrawerClose}
              direction="start"
              width={'medium'}
              disableAnimation={true}
              display={state.objectPanelDocked ? 'docked' : 'floating'}
              backdropVisible={false}
              mode={state.objectPanelDocked ? 'parallel' : 'contained'}
              collapsible={false}
              headerEnd="none"
            >
              {/* Plain div: mouse-enter/leave hooks drive autohide timers at the
                  drawer-content level without disturbing Drawer chrome. */}
              <div
                onMouseEnter={() => {
                  clearHideTimeout();
                }}
                onMouseLeave={() => {
                  if (!activeItem) {
                    scheduleHide();
                  }
                }}
              >
                <Box
                  height="full"
                  position="relative"
                  padding="0"
                  className={`${styles.drawerContainer} ${shouldOffsetEditPanel ? styles.drawerInnerOffset : ''}`}
                >
                  {effectiveOverride}
                </Box>
              </div>
            </Drawer>
          )
        ) : (
          <>
            {/* Brand Panel - Custom two-column layout */}
            {currentContent === 'Brand' && isOpen && (
              // Plain div: dynamic width toggles between 564/214/0 based on brand
              // content visibility + dock state; mouse-enter/leave drive autohide
              // timers. Easel Box would wipe the dynamic width.
              <div
                style={{
                  position: 'relative',
                  height: '100%',
                  width: activeItem ? (brandContentVisible ? '564px' : '214px') : 0,
                }}
                onMouseEnter={() => {
                  clearHideTimeout();
                }}
                onMouseLeave={() => {
                  if (!activeItem) {
                    scheduleHide();
                  }
                }}
              >
                <BrandPanel
                  onClose={handleDrawerClose}
                  docked={!!activeItem}
                  onContentVisibilityChange={visible => {
                    setBrandContentVisible(visible);
                    if (activeItem === 'Brand') {
                      setDockedPanelName(visible ? 'Brand' : 'BrandSidebar');
                    }
                  }}
                />
                {activeItem && (
                  // Plain button: floating collapse affordance pinned to the drawer edge
                  // via .collapseButton; Easel Button doesn't expose this chrome.
                  <button
                    className={styles.collapseButton}
                    onClick={handleDrawerClose}
                    aria-label="Hide panel"
                  >
                    <ChevronLeftIcon size="small" />
                  </button>
                )}
              </div>
            )}

            {/* Tools Panel - Custom positioned element */}
            {currentContent === 'Tools' && isOpen && (
              // Plain div: absolute-positioned wrapper via .toolsPanelWrapper (outside
              // Drawer tree); Easel Box reset would wipe positioning.
              <div
                className={styles.toolsPanelWrapper}
                onMouseEnter={() => {
                  clearHideTimeout();
                }}
                onMouseLeave={() => {
                  if (!activeItem) {
                    scheduleHide();
                  }
                }}
              >
                {activeItem && (
                  // Plain button: absolute-positioned close affordance; Easel Button
                  // doesn't expose this exact floating close chrome.
                  <button
                    onClick={handleDrawerClose}
                    className={styles.toolsCloseButton}
                    aria-label="Close"
                  >
                    <XIcon size="small" />
                  </button>
                )}
                {/* Plain div: inner panel frame; composes .toolsPanel chrome that
                    Easel Box reset would wipe. */}
                <div className={styles.toolsPanel}>{getContentComponent(currentContent)}</div>
              </div>
            )}

            {/* Drawer for all other content (not Tools or Brand) */}
            {currentContent !== 'Tools' && currentContent !== 'Brand' && (
              // Plain div: positioning context for the absolutely-positioned
              // collapse button that sits outside the Drawer content tree.
              <div style={{ position: 'relative', height: '100%' }}>
                <Drawer
                  open={isOpen}
                  onRequestClose={handleDrawerClose}
                  direction="start"
                  width={getDrawerWidth()}
                  disableAnimation={true}
                  display={activeItem ? 'docked' : 'floating'}
                  backdropVisible={false}
                  mode={activeItem ? 'parallel' : 'contained'}
                  collapsible={false}
                  headerEnd="none"
                >
                  {/* Plain div: mouse-enter/leave hooks drive autohide timers
                      at the drawer-content level without disturbing Drawer chrome. */}
                  <div
                    style={{ height: '100%' }}
                    onMouseEnter={() => {
                      clearHideTimeout();
                    }}
                    onMouseLeave={() => {
                      if (!activeItem) {
                        scheduleHide();
                      }
                    }}
                  >
                    <Box
                      height="full"
                      position="relative"
                      padding="2u"
                      display="flex"
                      flexDirection="column"
                    >
                      {getContentComponent(currentContent)}
                    </Box>
                  </div>
                </Drawer>
                {activeItem && isOpen && (
                  <button
                    className={styles.collapseButton}
                    onClick={handleDrawerClose}
                    aria-label="Hide panel"
                  >
                    <ChevronLeftIcon size="small" />
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
