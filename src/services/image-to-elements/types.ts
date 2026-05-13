import type { ElementData } from '@/store/signals/canvasState';

/**
 * Result from the image-to-elements conversion service
 */
export interface ImageToElementsResult {
  elements: ElementData[];
  imageElementPrompts: Map<string, string>; // elementId → generation prompt
  backgroundColor?: string; // Detected background color (if extracted)
  status: 'success' | 'error';
  error?: string;
}

/**
 * Request for image-to-elements conversion
 */
export interface ImageToElementsRequest {
  imageUrl: string; // Can be base64 data URL or http URL
  canvasWidth?: number; // Default 1067
  canvasHeight?: number; // Default 600
}
