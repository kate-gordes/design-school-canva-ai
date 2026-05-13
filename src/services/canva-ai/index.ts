// Main service export
export { canvaAIService, CanvaAIService } from './canva-ai-service';

// Types
export type {
  RequestScope,
  ChangeRecord,
  AIServiceCallbacks,
  AIContext,
  PresentationContext,
  PageContext,
  ElementContext,
  AIHistoryEntry,
  UpdateElementStyleParams,
  UpdateElementContentParams,
  UpdateCanvasBackgroundParams,
  GenerateImageParams,
  EditImageParams,
  AddElementParams,
  DeleteElementParams,
  BatchUpdateParams,
  GenerateSlideParams,
  NotifyParams,
  ToolResult,
  CreateSlideWithDataParams,
  CreateMultipleSlidesParams,
} from './types';

// Tools
export { getToolsForScope, allTools } from './tools';

// Prompts
export { buildSystemPrompt, getFollowUpPrompt } from './prompt';

// Fal.ai service
export { falImageService, FalImageService } from './fal-image-service';
export type { FalImageResult } from './fal-image-service';

// Base class (for extending)
export { CanvaAIBaseService } from './canva-ai-base';

// Routing service (intent-based routing)
export { routingService, RoutingService } from './routing-service';
export type { RoutingDestination, RoutingResult } from './routing-service';

// Chat AI service (conversational AI without design tools)
export { chatAIService, ChatAIService } from './chat-ai-service';

// Docs AI service (document editing with block-level tools)
export { docsAIService, DocsAIService } from './docs-ai-service';

// Interactive Page AI service (HTML page editing with find-and-replace)
export { interactivePageAIService, InteractivePageAIService } from './interactive-page-ai-service';

// Docs title generation
export { generateDocsTitle } from './docs-title-service';
