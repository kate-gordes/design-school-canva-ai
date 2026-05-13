import { effect } from '@preact/signals-react';
import { streamingConfig } from './docsStreaming';
import {
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
} from './streamingConfigPanel';
import type { InputVariant } from './streamingConfigPanel';
import {
  collabCanvaAIMode,
  collabInstantApply,
  collabAILingerMs,
  setCollabCanvaAIMode,
  setCollabInstantApply,
  setCollabAILingerMs,
} from './collaborationSim';

interface DocsConfig {
  s: number; // speed 0–1
  l: number; // lingerMs
  a: boolean; // allAtOnce
  cm: boolean; // collabCanvaAIMode
  ci: boolean; // collabInstantApply
  cl: number; // collabAILingerMs
}

interface PresentationConfig {
  et: boolean; // showExpandThread
  em: boolean; // showExpandThreadMobile
  sc: boolean; // useSelectionChip
  dn: boolean; // useDeferredNavigation
  iv?: string; // inputVariant
}

interface ConfigPayload {
  docs: DocsConfig;
  pres: PresentationConfig;
}

/** Reverse-derive speed (0–1) from minTickMs. minTickMs: 60→0, 10→1 */
function deriveSpeed(minTickMs: number): number {
  return Math.max(0, Math.min(1, (60 - minTickMs) / 50));
}

/** Read all config signals and encode as base64 JSON. */
function encodeConfig(): string {
  const payload: ConfigPayload = {
    docs: {
      s: Math.round(deriveSpeed(streamingConfig.value.minTickMs) * 100) / 100,
      l: streamingConfig.value.lingerMs,
      a: streamingConfig.value.allAtOnce,
      cm: collabCanvaAIMode.value,
      ci: collabInstantApply.value,
      cl: collabAILingerMs.value,
    },
    pres: {
      et: showExpandThread.value,
      em: showExpandThreadMobile.value,
      sc: useSelectionChip.value,
      dn: useDeferredNavigation.value,
      iv: inputVariant.value,
    },
  };
  return btoa(JSON.stringify(payload));
}

function decodeConfig(encoded: string): ConfigPayload | null {
  try {
    const json = atob(encoded);
    const parsed = JSON.parse(json);
    if (typeof parsed !== 'object' || parsed === null) return null;

    // New namespaced format
    if (parsed.docs && parsed.pres) {
      return parsed as ConfigPayload;
    }

    // Legacy flat format — migrate
    if (typeof parsed.s === 'number') {
      return {
        docs: {
          s: parsed.s,
          l: parsed.l,
          a: parsed.a,
          cm: parsed.cm,
          ci: parsed.ci,
          cl: parsed.cl,
        },
        pres: {
          et: typeof parsed.et === 'boolean' ? parsed.et : false,
          em: false,
          sc: false,
          dn: false,
          iv: 'bottom',
        },
      };
    }

    return null;
  } catch {
    return null;
  }
}

// --- Restore config from URL at module load time ---
// Runs before any React component renders, so signals are set
// before StreamingConfigPanel's useState initializers capture them.
(function restoreConfigFromUrl() {
  const hashPath = window.location.hash.slice(1);
  if (!hashPath) return;
  try {
    const url = new URL(hashPath, window.location.origin);
    const data = url.searchParams.get('data');
    if (!data) return;
    const config = decodeConfig(data);
    if (!config) return;

    // Apply docs config
    applySpeedAndLinger(config.docs.s, config.docs.l);
    setAllAtOnce(config.docs.a);
    setCollabCanvaAIMode(config.docs.cm);
    setCollabInstantApply(config.docs.ci);
    setCollabAILingerMs(config.docs.cl);

    // Apply presentation config
    setShowExpandThread(config.pres.et);
    setShowExpandThreadMobile(config.pres.em);
    setUseSelectionChip(config.pres.sc);
    if (typeof config.pres.dn === 'boolean') setUseDeferredNavigation(config.pres.dn);
    if (config.pres.iv) setInputVariant(config.pres.iv as InputVariant);
  } catch {
    // Invalid hash — ignore
  }
})();

// --- Write config to URL on every signal change ---
let initialized = false;
effect(() => {
  const encoded = encodeConfig();

  // Skip the first synchronous run — signals already match the URL.
  if (!initialized) {
    initialized = true;
    return;
  }

  const currentHash = window.location.hash.slice(1);
  if (!currentHash) return;

  try {
    const url = new URL(currentHash, window.location.origin);
    url.searchParams.set('data', encoded);
    history.replaceState(null, '', '#' + url.pathname + url.search);
  } catch {
    // Invalid hash — ignore
  }
});
