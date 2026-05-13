// Types
export * from './types';
export { getStyleNumber } from './types';

// Utilities
export * from './utils';

// NEW: Core state from canvasState - this is the unified state management
export {
  presentationTitle,
  canvases,
  activeCanvasId,
  activeCanvas,
  selectedElementId,
  selectedElementIds,
  selectedElementType,
  selectedElement,
  selectedPageId,
  hasSelection,
  hasMultiSelection,
  isElementSupported,
  hasUnsupportedSelection,
  clearSelection,
  handleElementSelect,
  handleCanvasSelect,
  selectPage,
  clearPageSelection,
  updateElementProperty,
  updateElementContent,
  deleteElement,
  deleteElements,
  duplicateElement,
  bringToFront,
  sendToBack,
  selectAll,
  handleAddCanvas,
  handleAddCanvasWithBackground,
  handleAddCanvasWithElements,
  handleUpdateCanvasElements,
  reorderCanvases,
  updateElementBackgroundImage,
  getActiveCanvas,
  addElementToActiveCanvas,
  addElementToCanvas,
  recordHistory,
  undo,
  redo,
  canUndo,
  canRedo,
  clearHistory,
  addToSelection,
  removeFromSelection,
  toggleSelection,
  setMultiSelection,
  getMultiSelectionBounds,
  setElementLoadingState,
  getElementLoadingState,
  isElementLoading,
  elementLoadingStates,
  pastHistory,
  futureHistory,
  // AI change tracking signals (used internally)
  isAIChange,
  currentAIInitiationScope,
  currentAIMetadata,
  // Editor mode (presentation, docs, etc.)
  currentEditorMode,
  // Active doc type (computed from active canvas)
  activeDocType,
  // Self-updating image element helpers
  findCanvasIdForElement,
  getElementFromCanvases,
  triggerImageGeneration,
  updateImageGenerationStatus,
  clearPendingImagePrompt,
} from './signals/canvasState';
export type {
  CanvasData,
  ElementData,
  PageDocType,
  DocType,
  GradientConfig,
  ElementLoadingState,
} from './signals/canvasState';

// Interactive Page State
export {
  interactivePageHtml,
  interactivePageTitle,
  setInteractivePageHtml,
  findAndReplaceHtml,
} from './signals/interactivePageState';

// Canvas zoom/pan signals (kept - no conflict)
export {
  zoomPercent,
  canvasScale,
  inverseScale,
  panOffset,
  gridEnabled,
  gridSize,
  setZoom,
  zoomIn,
  zoomOut,
  resetZoom,
  setPanOffset,
  resetPan,
} from './signals/canvas';

// Panel and UI signals (kept - no conflict)
export {
  designMode,
  showChatView,
  searchQuery,
  isSearching,
  isGenerating,
  recentlyGeneratedElements,
  addGeneratedElement,
  clearRecentlyGeneratedElements,
  elementsGenerationState,
  setElementsGenerationState,
  clearElementsGenerationState,
  setDesignMode,
  toggleChatView,
  setSearchQuery,
  setIsSearching,
  setIsGenerating,
  aiPanelOpen,
  setAIPanelOpen,
  pendingMobileAIPrompt,
  setPendingMobileAIPrompt,
  objectPanelDocked,
  setObjectPanelDocked,
  mobileAIInputFocused,
  setMobileAIInputFocused,
  mobileAIEditMode,
  enterMobileAIEditMode,
  exitMobileAIEditMode,
  updateMobileAIEditModeDimensions,
  dismissMobileAIPanel,
  designSchoolVideo,
  openDesignSchoolVideo,
  closeDesignSchoolVideo,
  designSchoolVideoPanelSide,
  setDesignSchoolVideoPanelSide,
  designSchoolVideoMinimized,
  setDesignSchoolVideoMinimized,
  toggleDesignSchoolVideoMinimized,
  designSchoolVideoMobileCompact,
  setDesignSchoolVideoMobileCompact,
  designSchoolVideoMinimizedPosition,
  setDesignSchoolVideoMinimizedPosition,
  designSchoolVideoPanelWidth,
  setDesignSchoolVideoPanelWidth,
  DESIGN_SCHOOL_VIDEO_PANEL_MIN_WIDTH,
  DESIGN_SCHOOL_VIDEO_PANEL_MAX_WIDTH,
} from './signals/panels';
export type { MobileAIEditModeState, ElementsGenerationState } from './signals/panels';
export type {
  DesignMode,
  GeneratedElement,
  DesignSchoolVideoData,
  DesignSchoolVideoPanelSide,
} from './signals/panels';

// Design School "X-ray" mode — hold Shift / 🎓 to reveal feature hotspots.
export { xrayModeActive, setXrayModeActive } from './signals/xray';

// Chat signals (kept - no conflict)
export {
  chatMessages,
  hasMessages,
  addChatMessage,
  addUserMessage,
  addAssistantMessage,
  addElementChip,
  clearChatMessages,
  // Thread-per-element exports
  elementThreads,
  activeThreadId,
  setActiveThreadId,
  currentThreadMessages,
  getOrCreateThread,
  addMessageToThread,
  addUserMessageToCurrentThread,
  addAssistantMessageToCurrentThread,
  updateMessageChanges,
  setMessageLearningContent,
  deleteThread,
  clearAllThreads,
  addThreadReference,
  // Thread request state (streaming, designing per thread)
  threadRequestStates,
  currentThreadRequestState,
  isCurrentThreadStreaming,
  currentThreadStreamingContent,
  isCurrentThreadDesigning,
  currentThreadDesigningMessage,
  isCurrentThreadGeneratingImage,
  currentThreadImageGenerationMessage,
  getThreadRequestState,
  updateThreadRequestState,
  startThreadStreaming,
  appendThreadStreamingContent,
  setThreadDesigning,
  setThreadDesigningMessage,
  setThreadImageGenerating,
  endThreadStreaming,
  clearThreadRequestState,
  captureImageThumbnail,
} from './signals/chat';
export type {
  ChatMessage,
  ThreadId,
  ThreadData,
  ThreadsMap,
  ThreadRequestState,
  ElementSnapshot,
  DesignProgress,
  ActionStep,
  ActionStepStatus,
} from './signals/chat';

// Legacy exports for backwards compatibility during migration
// These will be removed once all consumers are updated
export {
  elementsByDoctype,
  currentDoctype,
  currentPageIndex,
  currentDoctypeElements,
  currentPageElements,
  orderedElements,
  getElementById,
  getElementByIdOnPage,
  getPageElements,
  getMaxZIndex,
  getMinZIndex,
} from './signals/elements';

// Note: hasSelection, hasMultiSelection now exported from canvasState (unified state)
export {
  selectedElements,
  selectionBounds,
  isElementSelected,
  selectedObjectType,
  legacySelectedObjectType,
  setLegacySelection,
} from './signals/selection';

// Legacy actions (these use the old element structure - avoid if possible)
// Note: deleteElements, duplicateElement, bringToFront, sendToBack are now exported from canvasState
export {
  createElement,
  updateElementStyle,
  updateElement,
  toggleElementLock,
  toggleElementVisibility,
} from './actions/elements';

// Note: selectAll now exported from canvasState (unified state)
export {
  selectElement,
  selectElements,
  selectByRect,
  getSelectedElements,
} from './actions/selection';

// AI Request tracking
export {
  activeRequests,
  isAnyRequestProcessing,
  allChanges,
  generateRequestId,
  generateChangeId,
  addActiveRequest,
  updateRequestStatus,
  updateRequestStreamContent,
  addChangeToRequest,
  captureElementState,
  captureCanvasState,
  toggleChange,
  revertChange,
  revertAllChanges,
  clearRequest,
  clearCompletedRequests,
  getRequest,
  getActiveChanges,
  // Pending operations
  pendingOperations,
  hasPendingOperations,
  addPendingOperation,
  updatePendingOperation,
  removePendingOperation,
  getPendingOperationsForRequest,
  generateOperationId,
} from './signals/aiRequests';
export type {
  RequestScope,
  OriginalState,
  ChangeRecord,
  AIRequest,
  PendingOperation,
  PendingOperationType,
} from './signals/aiRequests';

// Document State (Notion-like block editor)
export {
  blocks,
  activeBlockId,
  activeBlock,
  commandMenuOpen,
  commandMenuBlockId,
  addBlock,
  updateBlockMarkdown,
  updateBlockType,
  deleteBlock,
  moveBlock,
  setActiveBlock,
  focusPreviousBlock,
  focusNextBlock,
  openCommandMenu,
  closeCommandMenu,
  insertMarkdownPrefix,
  blocksToMarkdown,
  markdownToBlocks,
  resetDocument,
  blockTypeToPrefix,
  prefixToBlockType,
  docsSelectedText,
  setDocsSelectedText,
  clearDocsSelectedText,
  mobileDocsEditingBlockId,
  enterMobileDocsEditing,
  exitMobileDocsEditing,
  mobileDocsActionsSheetOpen,
  openMobileDocsActionsSheet,
  closeMobileDocsActionsSheet,
  docsTitle,
  docsTitleGenerated,
} from './signals/documentState';
export type { BlockData, BlockType } from './signals/documentState';

// Docs History (debounce helpers + AI change tracking for docs)
export {
  isDocsAIChange,
  currentDocsAIMetadata,
  beginTextChange,
  flushPendingChange,
  captureDocsSnapshot,
} from './signals/docsHistory';

// Docs Streaming (AI typing simulation)
export {
  activeStreamingSession,
  isDocsStreaming,
  streamingConfig,
  DEFAULT_STREAMING_CONFIG,
  startStreamingSession,
  appendToStreamingSession,
  cancelStreamingSession,
  skipBlockAnimation,
} from './signals/docsStreaming';
export type {
  StreamingAnimationConfig,
  StreamingBlockEntry,
  StreamingSession,
} from './signals/docsStreaming';

// AI Editing Visual State (presentation mode indicators)
export {
  aiEditingPages,
  aiEditingElements,
  aiLingeringPages,
  aiVisiblePages,
  addAIEditingPage,
  removeAIEditingPage,
  addAIEditingElement,
  removeAIEditingElement,
  clearAllAIEditing,
} from './signals/aiEditingState';

// Collaboration Simulation (remote edit animation)
export {
  collabSimSessions,
  isCollabSimActive,
  cancelAllCollabSims,
  getCollabSessionForBlock,
  collabCanvaAIMode,
  collabInstantApply,
  collabAILingerMs,
  setCollabCanvaAIMode,
  setCollabInstantApply,
  setCollabAILingerMs,
} from './signals/collaborationSim';
export type { CollabSimSession, CollabColor } from './signals/collaborationSim';

// Config ↔ URL query string sync (side-effect import — activates on load)
import './signals/configQuerySync';

// Streaming Config Panel (debug UI)
export {
  configPanelOpen,
  toggleConfigPanel,
  closeConfigPanel,
  resetStreamingConfig,
  applySpeedAndLinger,
  setAllAtOnce,
  showExpandThread,
  setShowExpandThread,
  showExpandThreadMobile,
  setShowExpandThreadMobile,
  useSelectionChip,
  setUseSelectionChip,
  useDeferredNavigation,
  setUseDeferredNavigation,
  inputVariant,
  setInputVariant,
} from './signals/streamingConfigPanel';
export type { InputVariant } from './signals/streamingConfigPanel';

// Debug History
export {
  debugHistoryEntries,
  debugHistoryFilter,
  debugHistoryPanelOpen,
  filteredHistoryEntries,
  groupedHistoryEntries,
  historyStats,
  generateEntryId,
  captureElementSnapshot,
  captureCanvasSnapshot,
  capturePresentationSnapshot,
  addDebugHistoryEntry,
  toggleHistoryEntry,
  revertToHistoryEntry,
  openDebugHistoryPanel,
  closeDebugHistoryPanel,
  toggleDebugHistoryPanel,
  setDebugHistoryFilter,
  clearDebugHistory,
  getDebugHistoryEntry,
} from './signals/debugHistory';
export type {
  HistoryScope,
  ChangeSource,
  ActionType,
  StateSnapshot,
  AIMetadata,
  OriginContext,
  DebugHistoryEntry,
  HistoryFilter,
  HistoryStats,
} from './signals/debugHistory';

// Canva Connect API auth + design data
export {
  connectUser,
  connectDesigns,
  connectFolders,
  connectLoading,
  connectError,
  isConnected,
  bootConnect,
  connectLogin,
  connectDisconnect,
  connectRefresh,
} from './signals/connect';
