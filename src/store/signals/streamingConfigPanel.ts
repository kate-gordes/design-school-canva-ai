import { signal } from '@preact/signals-react';
import { streamingConfig, DEFAULT_STREAMING_CONFIG } from './docsStreaming';
import type { StreamingAnimationConfig } from './docsStreaming';

export const configPanelOpen = signal(false);
export const showExpandThread = signal(false);
export const showExpandThreadMobile = signal(false);
export const useSelectionChip = signal(false);
export const useDeferredNavigation = signal(true);

export type InputVariant = 'bottom' | 'bottom-info' | 'bottom-info-pill' | 'center';
export const inputVariant = signal<InputVariant>('center');
export function setInputVariant(value: InputVariant): void {
  inputVariant.value = value;
}

export function setUseSelectionChip(value: boolean): void {
  useSelectionChip.value = value;
}

export function setUseDeferredNavigation(value: boolean): void {
  useDeferredNavigation.value = value;
}

export function setShowExpandThread(value: boolean): void {
  showExpandThread.value = value;
}

export function setShowExpandThreadMobile(value: boolean): void {
  showExpandThreadMobile.value = value;
}

export function toggleConfigPanel(): void {
  configPanelOpen.value = !configPanelOpen.value;
}

export function closeConfigPanel(): void {
  configPanelOpen.value = false;
}

export function resetStreamingConfig(): void {
  streamingConfig.value = { ...DEFAULT_STREAMING_CONFIG };
}

/**
 * Derive all 9 config fields from a normalised speed (0–1) and a linger duration (ms).
 *
 * speed = 0 → slowest (big ticks, small chunks, frequent pauses)
 * speed = 1 → fastest (tiny ticks, large chunks, rare pauses)
 *
 * lingerMs controls the highlight hold time; fadeDurationMs is derived as 1.15× linger.
 */
export function applySpeedAndLinger(speed: number, lingerMs: number): void {
  const s = Math.max(0, Math.min(1, speed));

  const prev = streamingConfig.value;
  const config: StreamingAnimationConfig = {
    minChunkSize: Math.round(1 + s * 7), // 1 → 8
    maxChunkSize: Math.round(3 + s * 17), // 3 → 20
    minTickMs: Math.round(60 - s * 50), // 60 → 10
    maxTickMs: Math.round(120 - s * 100), // 120 → 20
    pauseChance: parseFloat((0.18 - s * 0.16).toFixed(2)), // 0.18 → 0.02
    minPauseMs: Math.round(120 - s * 100), // 120 → 20
    maxPauseMs: Math.round(300 - s * 250), // 300 → 50
    lingerMs: Math.round(lingerMs),
    fadeDurationMs: Math.round(lingerMs * 1.15),
    allAtOnce: prev.allAtOnce,
  };

  streamingConfig.value = config;
}

export function setAllAtOnce(value: boolean): void {
  streamingConfig.value = { ...streamingConfig.value, allAtOnce: value };
}
