import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Lightweight wrapper around the YouTube IFrame Player API.
 *
 * Loads `https://www.youtube.com/iframe_api` once per page, attaches a
 * `YT.Player` instance to an existing `<iframe id={iframeId}>`, polls
 * `getCurrentTime()` while the player is active, and exposes a `seekTo`
 * helper. Used by the Design School video panel so the transcript drawer
 * can highlight the line currently being spoken and let the user click any
 * line to jump there.
 *
 * Requirements on the iframe element:
 *   - Must have `id={iframeId}` (the same value passed into the hook).
 *   - The `src` URL must include `enablejsapi=1` (and ideally `origin=...`).
 *   - The iframe must be present in the DOM before this hook runs the
 *     `onYouTubeIframeAPIReady` step.
 */

interface YTPlayer {
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  destroy: () => void;
}

interface YTConstructor {
  Player: new (
    elementId: string,
    options: {
      events?: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { target: YTPlayer; data: number }) => void;
      };
    },
  ) => YTPlayer;
}

declare global {
  interface Window {
    YT?: YTConstructor;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise<void>(resolve => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    // Chain onto any existing readiness callback so we don't clobber other
    // YT API consumers on the page.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    document.body.appendChild(tag);
  });
  return ytApiPromise;
}

interface UseYouTubePlayerResult {
  currentTime: number;
  seekTo: (seconds: number) => void;
  isReady: boolean;
}

/**
 * @param iframeId DOM `id` of the YouTube `<iframe>` to bind to.
 * @param enabled  Skip API load + polling when `false` (e.g. transcript
 *                 drawer closed) so we don't pay the cost when nobody's
 *                 watching the timeline.
 */
export default function useYouTubePlayer(
  iframeId: string,
  enabled: boolean,
): UseYouTubePlayerResult {
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let intervalId: number | null = null;
    let lookupTimerId: number | null = null;

    const bind = (YT: YTConstructor) => {
      if (cancelled) return;
      // The constructor mutates the iframe in place; we capture the player
      // reference in the `onReady` callback below, so we don't need to hold
      // onto the return value here.
      new YT.Player(iframeId, {
        events: {
          onReady: event => {
            if (cancelled) return;
            playerRef.current = event.target;
            setIsReady(true);
            // Poll at ~4Hz — fast enough that the highlighted line tracks
            // the audio comfortably without spinning the CPU.
            intervalId = window.setInterval(() => {
              const t = event.target.getCurrentTime?.();
              if (typeof t === 'number' && !Number.isNaN(t)) {
                setCurrentTime(t);
              }
            }, 250);
          },
        },
      });
    };

    // Surfaces like the mobile `Sheet` mount the iframe inside an
    // animating container, so `document.getElementById(iframeId)` can come
    // back `null` on the first effect tick even though React has committed
    // the JSX. A bare `if (!iframeEl) return;` would silently lose the
    // binding for the lifetime of the panel. Retry a few times with a
    // short delay so we catch the iframe as soon as it's actually
    // attached to the DOM.
    const tryLookupAndBind = (attempt: number) => {
      if (cancelled) return;
      const YT = window.YT;
      if (!YT) return;
      const iframeEl = document.getElementById(iframeId);
      if (iframeEl) {
        bind(YT);
        return;
      }
      if (attempt >= 20) {
        // ~2s of retries (20 × 100ms). If the iframe still isn't in the
        // DOM after that, the panel almost certainly never mounted in
        // this session — fail quietly so we don't leak retries forever.
        return;
      }
      lookupTimerId = window.setTimeout(() => tryLookupAndBind(attempt + 1), 100);
    };

    loadYouTubeApi().then(() => {
      tryLookupAndBind(0);
    });

    return () => {
      cancelled = true;
      if (intervalId !== null) window.clearInterval(intervalId);
      if (lookupTimerId !== null) window.clearTimeout(lookupTimerId);
      try {
        playerRef.current?.destroy();
      } catch {
        // YT.Player.destroy() throws if the iframe was already removed from
        // the DOM (which can happen during fast unmount/remount cycles).
        // Nothing useful we can do — just swallow.
      }
      playerRef.current = null;
      setIsReady(false);
    };
  }, [iframeId, enabled]);

  const seekTo = useCallback((seconds: number) => {
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(seconds, true);
    player.playVideo?.();
  }, []);

  return { currentTime, seekTo, isReady };
}
