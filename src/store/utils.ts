let counter = 0;

export function generateId(prefix = 'el'): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  counter += 1;
  return `${prefix}_${timestamp}_${randomPart}_${counter}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function snapAngle(angle: number, snapDegrees: number = 15): number {
  return Math.round(angle / snapDegrees) * snapDegrees;
}

export function normalizeAngle(angle: number): number {
  let result = angle % 360;
  if (result < 0) result += 360;
  return result;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
