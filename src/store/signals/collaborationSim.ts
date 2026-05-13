import { signal, computed } from '@preact/signals-react';
import { updateBlockMarkdown } from './documentState';
import { streamingConfig } from './docsStreaming';

// --- Types ---

export interface CollabColor {
  bg: string; // selection/typing background rgba
  cursor: string; // cursor color rgba
}

export interface CollabSimSession {
  id: string;
  status: 'generating' | 'selecting' | 'deleting' | 'typing';
  blockId: string | null;
  color: CollabColor;
  oldContent: string;
  newContent: string;
  diffStart: number;
  diffOldEnd: number;
  diffNewText: string;
  selectionProgress: number;
  typedLength: number;
  typoBuffer: string;
  speedMultiplier: number; // 0.5 (fast typer) to 1.0 (normal) — scales all delays
}

// --- Collaborator color palette ---

const COLLAB_COLORS: CollabColor[] = [
  { bg: 'rgba(59, 130, 246, 0.15)', cursor: 'rgba(59, 130, 246, 0.9)' }, // blue
  { bg: 'rgba(16, 185, 129, 0.15)', cursor: 'rgba(16, 185, 129, 0.9)' }, // emerald
  { bg: 'rgba(245, 158, 11, 0.15)', cursor: 'rgba(245, 158, 11, 0.9)' }, // amber
  { bg: 'rgba(239, 68, 68, 0.15)', cursor: 'rgba(239, 68, 68, 0.9)' }, // red
  { bg: 'rgba(168, 85, 247, 0.15)', cursor: 'rgba(168, 85, 247, 0.9)' }, // purple
  { bg: 'rgba(236, 72, 153, 0.15)', cursor: 'rgba(236, 72, 153, 0.9)' }, // pink
  { bg: 'rgba(6, 182, 212, 0.15)', cursor: 'rgba(6, 182, 212, 0.9)' }, // cyan
];

let colorIndex = 0;

export function nextCollabColor(): CollabColor {
  const color = COLLAB_COLORS[colorIndex % COLLAB_COLORS.length];
  colorIndex++;
  return color;
}

// --- Signals ---

export const collabSimSessions = signal<CollabSimSession[]>([]);

export const collabCanvaAIMode = signal<boolean>(false);
export const collabInstantApply = signal<boolean>(true);
export const collabAILingerMs = signal<number>(2000);

export function setCollabCanvaAIMode(value: boolean): void {
  collabCanvaAIMode.value = value;
  if (!value) collabInstantApply.value = false;
}
export function setCollabInstantApply(value: boolean): void {
  collabInstantApply.value = value;
}
export function setCollabAILingerMs(value: number): void {
  collabAILingerMs.value = value;
}

export const isCollabSimActive = computed<boolean>(() => collabSimSessions.value.length > 0);

/** Get the active session for a given block (if any) */
export function getCollabSessionForBlock(blockId: string): CollabSimSession | undefined {
  return collabSimSessions.value.find(s => s.blockId === blockId);
}

/** Get all block IDs that currently have an active collab session */
export function getActiveCollabBlockIds(): Set<string> {
  const ids = new Set<string>();
  for (const s of collabSimSessions.value) {
    if (s.blockId) ids.add(s.blockId);
  }
  return ids;
}

// --- Per-session timer management ---

const sessionTimers = new Map<string, Set<ReturnType<typeof setTimeout>>>();

function scheduleTimer(sessionId: string, fn: () => void, ms: number): void {
  if (!sessionTimers.has(sessionId)) {
    sessionTimers.set(sessionId, new Set());
  }
  const timers = sessionTimers.get(sessionId)!;
  const id = setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
}

function clearSessionTimers(sessionId: string): void {
  const timers = sessionTimers.get(sessionId);
  if (!timers) return;
  for (const id of timers) clearTimeout(id);
  timers.clear();
  sessionTimers.delete(sessionId);
}

function clearAllTimers(): void {
  for (const [id] of sessionTimers) clearSessionTimers(id);
}

// --- Session mutation helper ---

function updateSession(
  sessionId: string,
  updater: (s: CollabSimSession) => CollabSimSession,
): void {
  collabSimSessions.value = collabSimSessions.value.map(s => (s.id === sessionId ? updater(s) : s));
}

function removeSession(sessionId: string): void {
  clearSessionTimers(sessionId);
  collabSimSessions.value = collabSimSessions.value.filter(s => s.id !== sessionId);
}

// --- Diff algorithm ---

export function computeDiff(
  oldText: string,
  newText: string,
): { diffStart: number; diffOldEnd: number; diffNewText: string } {
  let prefixLen = 0;
  while (
    prefixLen < oldText.length
    && prefixLen < newText.length
    && oldText[prefixLen] === newText[prefixLen]
  ) {
    prefixLen++;
  }

  let suffixLen = 0;
  while (
    suffixLen < oldText.length - prefixLen
    && suffixLen < newText.length - prefixLen
    && oldText[oldText.length - 1 - suffixLen] === newText[newText.length - 1 - suffixLen]
  ) {
    suffixLen++;
  }

  return {
    diffStart: prefixLen,
    diffOldEnd: oldText.length - suffixLen,
    diffNewText: newText.slice(prefixLen, newText.length - suffixLen),
  };
}

// --- Typo simulation ---

const NEARBY_KEYS: Record<string, string[]> = {
  a: ['s', 'q', 'z'],
  b: ['v', 'n', 'g'],
  c: ['x', 'v', 'd'],
  d: ['s', 'f', 'e', 'c'],
  e: ['w', 'r', 'd'],
  f: ['d', 'g', 'r', 'v'],
  g: ['f', 'h', 't', 'b'],
  h: ['g', 'j', 'y', 'n'],
  i: ['u', 'o', 'k'],
  j: ['h', 'k', 'u', 'm'],
  k: ['j', 'l', 'i'],
  l: ['k', 'o', 'p'],
  m: ['n', 'j', 'k'],
  n: ['b', 'm', 'h'],
  o: ['i', 'p', 'l'],
  p: ['o', 'l'],
  q: ['w', 'a'],
  r: ['e', 't', 'f'],
  s: ['a', 'd', 'w', 'x'],
  t: ['r', 'y', 'g'],
  u: ['y', 'i', 'j'],
  v: ['c', 'b', 'f'],
  w: ['q', 'e', 's'],
  x: ['z', 'c', 's'],
  y: ['t', 'u', 'h'],
  z: ['a', 'x'],
};

function getTypoChar(char: string): string {
  const lower = char.toLowerCase();
  const neighbors = NEARBY_KEYS[lower];
  if (!neighbors) return char;
  const typo = neighbors[Math.floor(Math.random() * neighbors.length)];
  return char === lower ? typo : typo.toUpperCase();
}

// --- Animation phases (per-session) ---

function getSession(sessionId: string): CollabSimSession | undefined {
  return collabSimSessions.value.find(s => s.id === sessionId);
}

function runSelectingPhase(sessionId: string): void {
  const state = getSession(sessionId);
  if (!state || state.status !== 'selecting') return;

  const totalChars = state.diffOldEnd - state.diffStart;
  if (state.selectionProgress >= totalChars) {
    updateSession(sessionId, s => ({ ...s, status: 'deleting' }));
    scheduleTimer(sessionId, () => runDeletingPhase(sessionId), 150);
    return;
  }

  const increment = 3 + Math.floor(Math.random() * 4);
  const newProgress = Math.min(state.selectionProgress + increment, totalChars);
  updateSession(sessionId, s => ({ ...s, selectionProgress: newProgress }));

  const tickMs = 15 + Math.random() * 10;
  scheduleTimer(sessionId, () => runSelectingPhase(sessionId), tickMs);
}

function runDeletingPhase(sessionId: string): void {
  const state = getSession(sessionId);
  if (!state || state.status !== 'deleting') return;

  updateSession(sessionId, s => ({ ...s, status: 'typing', typedLength: 0, typoBuffer: '' }));
  scheduleTimer(sessionId, () => runTypingPhase(sessionId), 100);
}

function runTypingPhase(sessionId: string): void {
  const state = getSession(sessionId);
  if (!state || state.status !== 'typing') return;

  const { typoBuffer } = state;

  const speed = state.speedMultiplier;

  if (typoBuffer) {
    const newBuffer = typoBuffer.slice(0, -1);
    updateSession(sessionId, s => ({ ...s, typoBuffer: newBuffer }));
    scheduleTimer(sessionId, () => runTypingPhase(sessionId), (40 + Math.random() * 20) * speed);
    return;
  }

  if (state.typedLength >= state.diffNewText.length) {
    // Typing complete — commit the content and clean up
    if (state.blockId) {
      updateBlockMarkdown(state.blockId, state.newContent);
    }
    scheduleTimer(sessionId, () => removeSession(sessionId), 100);
    return;
  }

  const nextChar = state.diffNewText[state.typedLength];

  if (!collabCanvaAIMode.value && Math.random() < 0.12 && /[a-zA-Z]/.test(nextChar)) {
    const wrongChar = getTypoChar(nextChar);
    updateSession(sessionId, s => ({ ...s, typoBuffer: wrongChar }));
    scheduleTimer(sessionId, () => runTypingPhase(sessionId), (200 + Math.random() * 150) * speed);
    return;
  }

  const newTypedLength = state.typedLength + 1;
  updateSession(sessionId, s => ({ ...s, typedLength: newTypedLength }));

  let delay: number;
  if (collabCanvaAIMode.value) {
    delay = streamingConfig.value.minTickMs;
  } else if (nextChar === ' ') {
    delay = 25 + Math.random() * 30;
  } else if (/[.,;:!?]/.test(nextChar)) {
    delay = 80 + Math.random() * 70;
  } else {
    delay = 40 + Math.random() * 35;
  }

  if (!collabCanvaAIMode.value && Math.random() < 0.08) {
    delay += 150 + Math.random() * 200;
  }

  scheduleTimer(sessionId, () => runTypingPhase(sessionId), delay * speed);
}

// --- Public API ---

let sessionCounter = 0;

/**
 * Create a new collab session in 'generating' state.
 * Returns the session id and assigned color.
 */
export function createCollabSession(): { sessionId: string; color: CollabColor } {
  sessionCounter++;
  const sessionId = `collab_${sessionCounter}_${Date.now()}`;
  const color = nextCollabColor();

  const session: CollabSimSession = {
    id: sessionId,
    status: 'generating',
    blockId: null,
    color,
    oldContent: '',
    newContent: '',
    diffStart: 0,
    diffOldEnd: 0,
    diffNewText: '',
    selectionProgress: 0,
    typedLength: 0,
    typoBuffer: '',
    speedMultiplier: collabCanvaAIMode.value ? 0.7 : 0.5 + Math.random() * 0.5,
  };

  collabSimSessions.value = [...collabSimSessions.value, session];
  return { sessionId, color };
}

/**
 * Begin the animation for an existing session after AI returns the edit.
 */
export function beginCollabAnimation(
  sessionId: string,
  blockId: string,
  oldContent: string,
  newContent: string,
  diff: { diffStart: number; diffOldEnd: number; diffNewText: string },
): void {
  if (collabCanvaAIMode.value) {
    const totalChars = diff.diffOldEnd - diff.diffStart;

    if (collabInstantApply.value) {
      // Instant apply: show full selection, then swap text immediately
      updateSession(sessionId, s => ({
        ...s,
        status: 'selecting',
        blockId,
        oldContent,
        newContent,
        diffStart: diff.diffStart,
        diffOldEnd: diff.diffOldEnd,
        diffNewText: diff.diffNewText,
        selectionProgress: totalChars,
        typedLength: 0,
        typoBuffer: '',
      }));
      // Brief pause showing the selection, then apply
      scheduleTimer(
        sessionId,
        () => {
          updateSession(sessionId, s => ({
            ...s,
            status: 'typing',
            typedLength: s.diffNewText.length,
          }));
          if (blockId) updateBlockMarkdown(blockId, newContent);
          scheduleTimer(sessionId, () => removeSession(sessionId), collabAILingerMs.value);
        },
        400,
      );
      return;
    }

    // Canva AI (no instant apply): show full selection, pause, then apply all at once
    updateSession(sessionId, s => ({
      ...s,
      status: 'selecting',
      blockId,
      oldContent,
      newContent,
      diffStart: diff.diffStart,
      diffOldEnd: diff.diffOldEnd,
      diffNewText: diff.diffNewText,
      selectionProgress: totalChars,
      typedLength: 0,
      typoBuffer: '',
    }));
    // Pause in selected state, then transition to deleting → typing
    scheduleTimer(
      sessionId,
      () => {
        updateSession(sessionId, s => ({ ...s, status: 'deleting' }));
        scheduleTimer(sessionId, () => runDeletingPhase(sessionId), 150);
      },
      600,
    );
    return;
  }

  updateSession(sessionId, s => ({
    ...s,
    status: 'selecting',
    blockId,
    oldContent,
    newContent,
    diffStart: diff.diffStart,
    diffOldEnd: diff.diffOldEnd,
    diffNewText: diff.diffNewText,
    selectionProgress: 0,
    typedLength: 0,
    typoBuffer: '',
  }));

  scheduleTimer(sessionId, () => runSelectingPhase(sessionId), 20);
}

/** Remove a session (on failure or after done) */
export function removeCollabSession(sessionId: string): void {
  removeSession(sessionId);
}

/** Cancel and remove all sessions */
export function cancelAllCollabSims(): void {
  clearAllTimers();
  collabSimSessions.value = [];
}
