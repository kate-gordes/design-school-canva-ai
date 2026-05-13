/**
 * Design School suggestion service.
 *
 * Detects "how do I design a great logo using my brand kit?"-style prompts in
 * the Canva AI panel and returns the curated logo-design learning content for
 * the suggestion card.
 *
 * The trigger is intentionally narrow for this first cut — only brand-kit-aware
 * logo-design intent maps to learning content. Other "how do I…" questions fall
 * through to the normal AI flow.
 */

import { LOGO_DESIGN_LESSONS, type LearningItem } from '@/data/designSchoolCatalog';
import {
  addMessageToThread,
  elementThreads,
  setMessageLearningContent,
  type ChatMessage,
  type ThreadId,
} from '@/store';

const LOGO_HOW_TO_PATTERN =
  /^how\s+(do|can|should|would|could|might|to|i)\s+(i\s+)?(design|make|create|build)\s+(a|an|my|the)?\s*great\s+logo\s+(using|with)\s+(my|a|the|our)?\s*brand\s+kit\b/;

export function isLogoDesignHowToPrompt(prompt: string): boolean {
  const normalized = prompt
    .trim()
    .toLowerCase()
    .replace(/[?.!]+\s*$/, '');
  return LOGO_HOW_TO_PATTERN.test(normalized);
}

export function getLogoDesignLearningContent(): LearningItem[] {
  return LOGO_DESIGN_LESSONS;
}

/**
 * True if the thread already has a Design School learning-content message
 * (either loaded or still showing the loading skeleton). Callers use this
 * to avoid stacking multiple identical card sets when the user re-asks the
 * same logo-design prompt later in the same conversation.
 */
export function threadAlreadyHasLearningContent(messages: ChatMessage[]): boolean {
  return messages.some(msg => msg.learningContent || msg.learningContentLoading);
}

// Mirror of the loading-skeleton duration used by both `CanvaAIContent`
// (desktop) and `MobileCanvaAIPanel` (mobile). Lives here so the helper
// below owns the full request → placeholder → content sequence in one
// place, instead of forcing every caller to re-implement the timing.
const DESIGN_SCHOOL_LOADING_DURATION_MS = 1500;

/**
 * Tick-level race guard for `requestLogoDesignLearningContent`.
 *
 * When the user double-clicks Send (or the AI service fires `onComplete`
 * twice in quick succession — e.g. React 18 StrictMode), two callbacks
 * can read `elementThreads.value` *before either has called*
 * `addMessageToThread`. The message-based dedupe in
 * `threadAlreadyHasLearningContent` would then return `false` for both,
 * and both would add a placeholder — producing the duplicate cards.
 *
 * This Set is the synchronous part of the dedupe: a thread id is added
 * to it the moment `requestLogoDesignLearningContent` decides to add a
 * placeholder, and removed once the message-based dedupe will catch it
 * (i.e. once the placeholder is actually in the store and visible to
 * future readers). After that, the existing `threadAlreadyHasLearningContent`
 * check is sufficient for any future asks.
 */
const inFlightLearningContentThreads = new Set<ThreadId>();

/**
 * Idempotently kick off the Design School learning-content flow for a
 * thread:
 *   1. Synchronously dedupe (message-based + tick-level Set).
 *   2. Add a placeholder message that renders the loading skeleton.
 *   3. Schedule the swap to real cards after the standard loading delay.
 *
 * Returns `true` if a placeholder was added, `false` if the request was
 * deduped. Callers don't need to act on the return value — it's exposed
 * mainly for tests and logging.
 */
export function requestLogoDesignLearningContent(threadId: ThreadId): boolean {
  if (inFlightLearningContentThreads.has(threadId)) return false;

  const existingMessages = elementThreads.value[threadId]?.messages ?? [];
  if (threadAlreadyHasLearningContent(existingMessages)) return false;

  inFlightLearningContentThreads.add(threadId);
  const placeholderId = addMessageToThread('', 'assistant', threadId, {
    learningContentLoading: true,
  });
  // After the placeholder is in the store, the message-based dedupe
  // catches future asks, so we can release the synchronous guard. Use a
  // microtask (Promise.resolve) — `setTimeout(fn, 0)` would also work but
  // a microtask runs before any other layout/paint and can't be skipped
  // by a same-tick second `onComplete` callback.
  Promise.resolve().then(() => {
    inFlightLearningContentThreads.delete(threadId);
  });

  setTimeout(() => {
    setMessageLearningContent(threadId, placeholderId, getLogoDesignLearningContent());
  }, DESIGN_SCHOOL_LOADING_DURATION_MS);

  return true;
}
