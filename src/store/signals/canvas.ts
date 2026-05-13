import { signal, computed } from '@preact/signals-react';

// Canvas zoom state
export const zoomPercent = signal<number>(100);

// Computed: Scale factor (0.1 to 5.0)
export const canvasScale = computed<number>(() => {
  return zoomPercent.value / 100;
});

// Computed: Inverse scale for counter-scaling UI elements
export const inverseScale = computed<number>(() => {
  return 1 / canvasScale.value;
});

// Pan offset (for future pan functionality)
export const panOffset = signal<{ x: number; y: number }>({ x: 0, y: 0 });

// Snap to grid settings
export const gridEnabled = signal<boolean>(false);
export const gridSize = signal<number>(10);

// Set zoom level
export function setZoom(percent: number): void {
  zoomPercent.value = Math.max(10, Math.min(500, percent));
}

// Zoom in by increment
export function zoomIn(increment: number = 10): void {
  setZoom(zoomPercent.value + increment);
}

// Zoom out by increment
export function zoomOut(decrement: number = 10): void {
  setZoom(zoomPercent.value - decrement);
}

// Reset zoom to 100%
export function resetZoom(): void {
  zoomPercent.value = 100;
}

// Set pan offset
export function setPanOffset(x: number, y: number): void {
  panOffset.value = { x, y };
}

// Reset pan
export function resetPan(): void {
  panOffset.value = { x: 0, y: 0 };
}
