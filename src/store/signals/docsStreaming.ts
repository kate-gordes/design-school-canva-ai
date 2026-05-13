import { signal, computed } from '@preact/signals-react';

// --- Types ---

export interface StreamingAnimationConfig {
  minChunkSize: number; // Min characters revealed per tick
  maxChunkSize: number; // Max characters revealed per tick
  minTickMs: number; // Min delay between ticks
  maxTickMs: number; // Max delay between ticks
  pauseChance: number; // 0-1, probability of a random pause per tick
  minPauseMs: number; // Min pause duration
  maxPauseMs: number; // Max pause duration
  lingerMs: number; // How long solid highlight stays after full reveal
  fadeDurationMs: number; // CSS fade-out transition duration
  allAtOnce: boolean; // Stream all blocks simultaneously instead of sequentially
}

export interface StreamingBlockEntry {
  blockId: string;
  fullContent: string; // Complete markdown to reveal
  oldContent?: string; // Previous content shown during 'selecting' phase
  revealedLength: number; // Characters visible so far
  status: 'pending' | 'selecting' | 'streaming' | 'lingering' | 'completing' | 'done';
}

export interface StreamingSession {
  sessionId: string; // AI requestId
  queue: StreamingBlockEntry[];
  currentIndex: number; // Index of the block currently streaming
  status: 'active' | 'cancelled' | 'complete';
}

// --- Defaults ---

export const DEFAULT_STREAMING_CONFIG: StreamingAnimationConfig = {
  minChunkSize: 8, // speed 0.95: round(1 + 0.95*7)
  maxChunkSize: 19, // speed 0.95: round(3 + 0.95*17)
  minTickMs: 13, // speed 0.95: round(60 - 0.95*50)
  maxTickMs: 25, // speed 0.95: round(120 - 0.95*100)
  pauseChance: 0.03, // speed 0.95: round(0.18 - 0.95*0.16)
  minPauseMs: 25, // speed 0.95: round(120 - 0.95*100)
  maxPauseMs: 63, // speed 0.95: round(300 - 0.95*250)
  lingerMs: 600,
  fadeDurationMs: 690,
  allAtOnce: false,
};

// --- Signals ---

export const streamingConfig = signal<StreamingAnimationConfig>({ ...DEFAULT_STREAMING_CONFIG });

export const activeStreamingSession = signal<StreamingSession | null>(null);
export const isDocsStreaming = computed<boolean>(() => {
  const session = activeStreamingSession.value;
  return session !== null && session.status === 'active';
});

// --- Timer management ---

const activeTimers = new Set<ReturnType<typeof setTimeout>>();

function scheduleTimer(fn: () => void, ms: number): void {
  const id = setTimeout(() => {
    activeTimers.delete(id);
    fn();
  }, ms);
  activeTimers.add(id);
}

function clearAllTimers(): void {
  for (const id of activeTimers) {
    clearTimeout(id);
  }
  activeTimers.clear();
}

// --- Helpers ---

function updateSession(updater: (session: StreamingSession) => StreamingSession): void {
  const current = activeStreamingSession.value;
  if (!current || current.status !== 'active') return;
  activeStreamingSession.value = updater(current);
}

function updateBlockInQueue(
  queue: StreamingBlockEntry[],
  blockId: string,
  updater: (entry: StreamingBlockEntry) => StreamingBlockEntry,
): StreamingBlockEntry[] {
  return queue.map(entry => (entry.blockId === blockId ? updater(entry) : entry));
}

const SELECT_DURATION_MS = 800;

/** Whether a block has old content worth showing in the selecting phase. */
function hasOldContent(oldContent?: string): boolean {
  return !!oldContent && oldContent.trim().length > 0;
}

/**
 * Transition a block from 'selecting' → 'streaming' after the select preview duration.
 * If allAtOnce, starts an independent tick loop; otherwise starts the sequential tick.
 */
function startSelecting(blockId: string, allAtOnce: boolean): void {
  scheduleTimer(() => {
    const session = activeStreamingSession.value;
    if (!session || session.status !== 'active') return;
    const entry = session.queue.find(e => e.blockId === blockId);
    if (!entry || entry.status !== 'selecting') return;

    updateSession(s => ({
      ...s,
      queue: updateBlockInQueue(s.queue, blockId, e => ({ ...e, status: 'streaming' })),
    }));

    if (allAtOnce) {
      scheduleBlockTick(blockId);
    } else {
      scheduleNextTick();
    }
  }, SELECT_DURATION_MS);
}

// --- Animation loop ---

function scheduleNextTick(): void {
  const config = streamingConfig.value;
  const delay = config.minTickMs + Math.random() * (config.maxTickMs - config.minTickMs);
  scheduleTimer(tick, delay);
}

/** Schedule an independent tick for a specific block (allAtOnce mode). */
function scheduleBlockTick(blockId: string): void {
  const config = streamingConfig.value;
  const delay = config.minTickMs + Math.random() * (config.maxTickMs - config.minTickMs);
  scheduleTimer(() => tickBlock(blockId), delay);
}

/** Tick a single block independently (allAtOnce mode). Each block runs its own loop. */
function tickBlock(blockId: string): void {
  const session = activeStreamingSession.value;
  if (!session || session.status !== 'active') return;

  const entry = session.queue.find(e => e.blockId === blockId);
  if (!entry || entry.status !== 'streaming') return;

  const config = streamingConfig.value;

  // Random pause
  if (Math.random() < config.pauseChance) {
    const pauseMs = config.minPauseMs + Math.random() * (config.maxPauseMs - config.minPauseMs);
    scheduleTimer(() => scheduleBlockTick(blockId), pauseMs);
    return;
  }

  const chunkSize =
    config.minChunkSize
    + Math.floor(Math.random() * (config.maxChunkSize - config.minChunkSize + 1));
  const newLength = Math.min(entry.revealedLength + chunkSize, entry.fullContent.length);

  if (newLength >= entry.fullContent.length) {
    finishBlock(blockId);
    checkSessionComplete();
  } else {
    updateSession(s => ({
      ...s,
      queue: updateBlockInQueue(s.queue, blockId, e => ({
        ...e,
        revealedLength: newLength,
      })),
    }));
    scheduleBlockTick(blockId);
  }
}

function tick(): void {
  const session = activeStreamingSession.value;
  if (!session || session.status !== 'active') return;

  const config = streamingConfig.value;
  const currentIdx = session.currentIndex;
  if (currentIdx < 0 || currentIdx >= session.queue.length) return;

  const entry = session.queue[currentIdx];
  if (entry.status !== 'streaming') return;

  // Random pause — skip this tick and schedule a longer delay
  if (Math.random() < config.pauseChance) {
    const pauseMs = config.minPauseMs + Math.random() * (config.maxPauseMs - config.minPauseMs);
    scheduleTimer(scheduleNextTick, pauseMs);
    return;
  }

  const chunkSize =
    config.minChunkSize
    + Math.floor(Math.random() * (config.maxChunkSize - config.minChunkSize + 1));
  const newLength = Math.min(entry.revealedLength + chunkSize, entry.fullContent.length);

  if (newLength >= entry.fullContent.length) {
    // Block fully revealed — kick off linger → completing → done pipeline
    finishBlock(entry.blockId);
    // Advance to next block immediately (linger/fade happen in background)
    advanceToNextBlock();
  } else {
    // Reveal more characters
    updateSession(s => ({
      ...s,
      queue: updateBlockInQueue(s.queue, entry.blockId, e => ({
        ...e,
        revealedLength: newLength,
      })),
    }));
    scheduleNextTick();
  }
}

/**
 * Transition a fully-revealed block through: lingering → completing → done.
 * These transitions happen in the background via timers and don't block the
 * next block from starting to stream.
 */
function finishBlock(blockId: string): void {
  const config = streamingConfig.value;

  // Immediately set to lingering (solid highlight, no cursor)
  updateSession(s => ({
    ...s,
    queue: updateBlockInQueue(s.queue, blockId, e => ({
      ...e,
      revealedLength: e.fullContent.length,
      status: 'lingering',
    })),
  }));

  // After linger duration, start fade
  scheduleTimer(() => {
    updateSession(s => ({
      ...s,
      queue: updateBlockInQueue(s.queue, blockId, e =>
        e.status === 'lingering' ? { ...e, status: 'completing' } : e,
      ),
    }));

    // After fade duration, mark done
    scheduleTimer(() => {
      updateSession(s => ({
        ...s,
        queue: updateBlockInQueue(s.queue, blockId, e =>
          e.status === 'completing' ? { ...e, status: 'done' } : e,
        ),
      }));
      checkSessionComplete();
    }, config.fadeDurationMs);
  }, config.lingerMs);
}

/** Mark session complete once every block is done. */
function checkSessionComplete(): void {
  const session = activeStreamingSession.value;
  if (!session || session.status !== 'active') return;

  if (session.queue.every(e => e.status === 'done')) {
    activeStreamingSession.value = { ...session, status: 'complete' };
    scheduleTimer(() => {
      activeStreamingSession.value = null;
    }, 50);
  }
}

function advanceToNextBlock(): void {
  const session = activeStreamingSession.value;
  if (!session || session.status !== 'active') return;

  let nextIdx = session.currentIndex + 1;

  // Walk forward to find the next pending block
  while (nextIdx < session.queue.length) {
    const entry = session.queue[nextIdx];
    if (entry.status !== 'pending') {
      nextIdx++;
      continue;
    }

    // Empty content — skip immediately
    if (entry.fullContent.length === 0) {
      updateSession(s => ({
        ...s,
        currentIndex: nextIdx,
        queue: updateBlockInQueue(s.queue, entry.blockId, e => ({
          ...e,
          status: 'done',
        })),
      }));
      nextIdx++;
      continue;
    }

    // Start this block — select first if it has old content, otherwise stream directly
    if (hasOldContent(entry.oldContent)) {
      updateSession(s => ({
        ...s,
        currentIndex: nextIdx,
        queue: updateBlockInQueue(s.queue, entry.blockId, e => ({
          ...e,
          status: 'selecting',
        })),
      }));
      startSelecting(entry.blockId, false);
    } else {
      updateSession(s => ({
        ...s,
        currentIndex: nextIdx,
        queue: updateBlockInQueue(s.queue, entry.blockId, e => ({
          ...e,
          status: 'streaming',
        })),
      }));
      scheduleNextTick();
    }
    return;
  }

  // No more pending blocks — park currentIndex past the end.
  // Session completes once all lingering/completing blocks finish.
  updateSession(s => ({ ...s, currentIndex: nextIdx }));
  checkSessionComplete();
}

// --- Public API ---

export function startStreamingSession(
  sessionId: string,
  blocksToStream: Array<{ blockId: string; fullContent: string; oldContent?: string }>,
): void {
  // Cancel any existing session
  cancelStreamingSession();

  if (blocksToStream.length === 0) return;

  const config = streamingConfig.value;

  if (config.allAtOnce) {
    // All-at-once mode: select all blocks simultaneously, then stream
    const queue: StreamingBlockEntry[] = blocksToStream.map(b => {
      if (b.fullContent.length === 0)
        return {
          blockId: b.blockId,
          fullContent: b.fullContent,
          oldContent: b.oldContent,
          revealedLength: 0,
          status: 'done' as const,
        };
      if (hasOldContent(b.oldContent))
        return {
          blockId: b.blockId,
          fullContent: b.fullContent,
          oldContent: b.oldContent,
          revealedLength: 0,
          status: 'selecting' as const,
        };
      return {
        blockId: b.blockId,
        fullContent: b.fullContent,
        oldContent: b.oldContent,
        revealedLength: 0,
        status: 'streaming' as const,
      };
    });

    activeStreamingSession.value = {
      sessionId,
      queue,
      currentIndex: queue.length, // parked past end — no sequential advancement
      status: 'active',
    };

    for (const entry of queue) {
      if (entry.status === 'selecting') {
        startSelecting(entry.blockId, true);
      } else if (entry.status === 'streaming') {
        scheduleBlockTick(entry.blockId);
      }
    }
    return;
  }

  // Sequential mode (default)
  const firstBlock = blocksToStream[0];
  const firstStatus =
    firstBlock.fullContent.length === 0
      ? ('done' as const)
      : hasOldContent(firstBlock.oldContent)
        ? ('selecting' as const)
        : ('streaming' as const);

  const queue: StreamingBlockEntry[] = blocksToStream.map((b, i) => ({
    blockId: b.blockId,
    fullContent: b.fullContent,
    oldContent: b.oldContent,
    revealedLength: 0,
    status: i === 0 ? firstStatus : ('pending' as const),
  }));

  activeStreamingSession.value = {
    sessionId,
    queue,
    currentIndex: 0,
    status: 'active',
  };

  if (firstStatus === 'done') {
    advanceToNextBlock();
  } else if (firstStatus === 'selecting') {
    startSelecting(queue[0].blockId, false);
  } else {
    scheduleNextTick();
  }
}

export function appendToStreamingSession(
  blocksToStream: Array<{ blockId: string; fullContent: string; oldContent?: string }>,
): void {
  const session = activeStreamingSession.value;
  if (!session || session.status !== 'active') {
    startStreamingSession(`append_${Date.now()}`, blocksToStream);
    return;
  }

  if (blocksToStream.length === 0) return;

  const config = streamingConfig.value;

  if (config.allAtOnce) {
    // All-at-once: append with selecting phase (if old content), then stream independently
    const newEntries: StreamingBlockEntry[] = blocksToStream.map(b => {
      if (b.fullContent.length === 0)
        return {
          blockId: b.blockId,
          fullContent: b.fullContent,
          oldContent: b.oldContent,
          revealedLength: 0,
          status: 'done' as const,
        };
      if (hasOldContent(b.oldContent))
        return {
          blockId: b.blockId,
          fullContent: b.fullContent,
          oldContent: b.oldContent,
          revealedLength: 0,
          status: 'selecting' as const,
        };
      return {
        blockId: b.blockId,
        fullContent: b.fullContent,
        oldContent: b.oldContent,
        revealedLength: 0,
        status: 'streaming' as const,
      };
    });

    updateSession(s => ({
      ...s,
      queue: [...s.queue, ...newEntries],
    }));

    for (const entry of newEntries) {
      if (entry.status === 'selecting') {
        startSelecting(entry.blockId, true);
      } else if (entry.status === 'streaming') {
        scheduleBlockTick(entry.blockId);
      }
    }
    return;
  }

  // Sequential mode
  const newEntries: StreamingBlockEntry[] = blocksToStream.map(b => ({
    blockId: b.blockId,
    fullContent: b.fullContent,
    oldContent: b.oldContent,
    revealedLength: 0,
    status: 'pending' as const,
  }));

  const wasAllProcessed = session.currentIndex >= session.queue.length;

  updateSession(s => ({
    ...s,
    queue: [...s.queue, ...newEntries],
  }));

  // If the session had already finished streaming all blocks, kick off the new ones
  if (wasAllProcessed) {
    // Rewind currentIndex so advanceToNextBlock picks up the appended entries
    updateSession(s => ({
      ...s,
      currentIndex: s.queue.length - newEntries.length - 1,
    }));
    advanceToNextBlock();
  }
}

export function cancelStreamingSession(): void {
  clearAllTimers();

  const session = activeStreamingSession.value;
  if (!session) return;

  // Mark all non-done blocks as done with full content revealed
  activeStreamingSession.value = {
    ...session,
    status: 'cancelled',
    queue: session.queue.map(entry =>
      entry.status === 'done'
        ? entry
        : { ...entry, revealedLength: entry.fullContent.length, status: 'done' as const },
    ),
  };

  // Clear the session after a brief delay so React can render the final state
  setTimeout(() => {
    activeStreamingSession.value = null;
  }, 50);
}

export function skipBlockAnimation(blockId: string): void {
  const session = activeStreamingSession.value;
  if (!session || session.status !== 'active') return;

  const entryIndex = session.queue.findIndex(b => b.blockId === blockId);
  if (entryIndex === -1) return;

  const entry = session.queue[entryIndex];
  if (entry.status === 'done') return;

  const wasCurrentlyStreaming = entry.status === 'streaming' || entry.status === 'selecting';

  // Instantly reveal this block and mark done
  updateSession(s => ({
    ...s,
    queue: updateBlockInQueue(s.queue, blockId, e => ({
      ...e,
      revealedLength: e.fullContent.length,
      status: 'done',
    })),
  }));

  // If this was the actively streaming block, advance to next (sequential mode)
  // In allAtOnce mode, just check completion since there's no sequential advancement
  if (wasCurrentlyStreaming && !streamingConfig.value.allAtOnce) {
    advanceToNextBlock();
  } else {
    checkSessionComplete();
  }
}
