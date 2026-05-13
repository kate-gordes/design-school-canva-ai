import { signal, computed } from '@preact/signals-react';
import connect, { type CanvaDesign, type CanvaFolder, type CanvaUser } from '@canva-ct/connect';
import auth from '@canva-ct/auth';

// LocalStorage keys the Connect SDK writes to; we peek at them to decide
// whether to activate setup() (setup triggers an Okta redirect when no
// auth token is present, which would trap localhost dev behind a login wall).
const LS_ACCESS_TOKEN = 'canva_connect_access_token';

export const connectUser = signal<CanvaUser | null>(null);
export const connectDesigns = signal<CanvaDesign[]>([]);
export const connectFolders = signal<CanvaFolder[]>([]);
export const connectLoading = signal(false);
export const connectError = signal<string | null>(null);

export const isConnected = computed(() => connectUser.value !== null);

let hasBooted = false;

function hasStoredToken(): boolean {
  try {
    return localStorage.getItem(LS_ACCESS_TOKEN) !== null;
  } catch {
    return false;
  }
}

function hasOAuthCode(): boolean {
  try {
    return new URLSearchParams(window.location.search).has('code');
  } catch {
    return false;
  }
}

function hasReturnedFromOkta(): boolean {
  try {
    return new URLSearchParams(window.location.search).has('auth_token');
  } catch {
    return false;
  }
}

// Persisted across the Okta bounce so we know to auto-continue into the
// Canva OAuth step after login redirects us back with ?auth_token=.
const SS_RESUME_CONNECT = 'canva_connect_resume_after_okta';

// Preserved across the Okta + Canva OAuth round-trip so we can drop the
// user back on the route they initiated sign-in from (hash router, so the
// route lives in window.location.hash).
const SS_ORIGIN_HASH = 'canva_connect_origin_hash';

function saveOriginHash(): void {
  try {
    // Only overwrite if not already saved — avoids clobbering the original
    // route when bootConnect re-runs mid-flow (Okta resume, OAuth return).
    if (sessionStorage.getItem(SS_ORIGIN_HASH) === null) {
      sessionStorage.setItem(SS_ORIGIN_HASH, window.location.hash || '');
    }
  } catch {
    // ignore
  }
}

function restoreOriginHashAndCleanUrl(): void {
  try {
    const saved = sessionStorage.getItem(SS_ORIGIN_HASH);
    sessionStorage.removeItem(SS_ORIGIN_HASH);
    const url = new URL(window.location.href);
    // Strip OAuth/Okta artifacts so back-button / refresh don't re-trigger
    // the handshake.
    url.searchParams.delete('code');
    url.searchParams.delete('state');
    url.searchParams.delete('auth_token');
    const nextHash = saved ?? url.hash;
    const next = `${url.pathname}${url.search}${nextHash}`;
    window.history.replaceState({}, '', next);
  } catch {
    // ignore
  }
}

async function hydrate(): Promise<void> {
  connectLoading.value = true;
  connectError.value = null;
  try {
    const snapshot = await connect.getSnapshot('default');
    connectUser.value = snapshot.user;
    connectDesigns.value = snapshot.designs;
    connectFolders.value = snapshot.folders;
    // Successful hydrate after an OAuth redirect means the handshake is
    // done — pop the stored origin route back into the URL (no-op if we
    // weren't mid-flow).
    restoreOriginHashAndCleanUrl();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    connectError.value = message;
    connectUser.value = null;
    connectDesigns.value = [];
    connectFolders.value = [];
    // Stale tokens: clear both the Connect access token and the Okta cookie
    // so the next "Connect" click starts fresh instead of re-triggering 401s.
    try {
      localStorage.removeItem(LS_ACCESS_TOKEN);
    } catch {
      // ignore
    }
    if (/401|403|Unauthorized|Forbidden/i.test(message)) {
      auth.clearToken();
    }
  } finally {
    connectLoading.value = false;
  }
}

export function bootConnect(): void {
  if (hasBooted) return;
  hasBooted = true;

  const returningFromOkta = hasReturnedFromOkta();
  const shouldResume = returningFromOkta && sessionStorage.getItem(SS_RESUME_CONNECT) === '1';
  const returningFromOAuth = hasOAuthCode();

  console.log('[connect] boot', {
    returningFromOkta,
    shouldResume,
    returningFromOAuth,
    hasStoredToken: hasStoredToken(),
  });

  // Only activate when we have evidence of an existing session, a fresh
  // Canva OAuth redirect, or a return from Okta mid-connect-flow. Otherwise
  // setup() would needlessly redirect, breaking the "stay signed out by
  // default" UX.
  if (!hasStoredToken() && !returningFromOAuth && !shouldResume) return;

  // Connect API calls require an Okta JWT cookie. requireAuth() (called by
  // connect.setup) will promote ?auth_token= from the URL into a cookie,
  // so defer the missing-token check until after setup.
  connect.setup();

  if (!auth.getToken()) {
    try {
      localStorage.removeItem(LS_ACCESS_TOKEN);
    } catch {
      // ignore
    }
    return;
  }

  // Only auto-resume into OAuth if we DON'T already have a ?code= — that
  // would mean Canva already redirected us back and setup() is handling the
  // exchange, so triggering login() again would send us in circles.
  if (shouldResume && !returningFromOAuth) {
    // We bounced through Okta mid-flow; auto-continue into the Canva
    // OAuth authorize step instead of waiting for another click.
    sessionStorage.removeItem(SS_RESUME_CONNECT);

    console.log('[connect] auto-resuming into Canva OAuth authorize');
    void connect.auth.login().catch(err => {
      connectError.value = err instanceof Error ? err.message : String(err);
    });
    return;
  }

  if (shouldResume && returningFromOAuth) {
    sessionStorage.removeItem(SS_RESUME_CONNECT);
  }

  // If ?code= was present, connect.setup() kicked off an async token
  // exchange. getSnapshot() awaits the SDK's internal _ready promise, so
  // call hydrate unconditionally — don't gate on hasStoredToken() at this
  // tick (the token hasn't been written yet).
  if (returningFromOAuth) {
    console.log('[connect] returning from OAuth — hydrating');
    void hydrate();
    return;
  }

  if (hasStoredToken()) {
    void hydrate();
  }
}

export async function connectLogin(): Promise<void> {
  // Connect backend requires an Okta JWT cookie before /auth/config responds.
  // requireAuth() only checks JWT *structure*, not expiration — so a stale
  // cookie sails through but the backend still 401s. Proactively validate
  // against the playground /validate endpoint; on 401 it auto-clears the
  // cookie and redirects to Okta login for a fresh token.
  //
  // Mark "resume" so that when we return from Okta with ?auth_token=, boot
  // auto-continues into the Canva OAuth authorize step.
  sessionStorage.setItem(SS_RESUME_CONNECT, '1');
  // Remember the route we started from so we can restore it after the
  // Okta + Canva OAuth redirects land us back at "/".
  saveOriginHash();
  // Flip the shared loading flag up-front so UI can show a spinner
  // during the auth round-trip (otherwise the click looks unresponsive
  // until the redirect fires hundreds of ms later).
  connectLoading.value = true;
  connectError.value = null;
  if (!auth.requireAuth()) return;
  try {
    await auth.validateToken();
  } catch {
    // validateToken already called handleAuthError → redirect is in flight
    return;
  }
  sessionStorage.removeItem(SS_RESUME_CONNECT);
  // setup() must run before login() so the PKCE state cookie is initialised.
  connect.setup();
  try {
    await connect.auth.login();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    connectError.value = message;
    connectLoading.value = false;
    try {
      sessionStorage.removeItem(SS_ORIGIN_HASH);
    } catch {
      // ignore
    }
    // Backend 401 on auth/config means the Okta token was accepted by
    // /validate but refused here — likely a role/permission mismatch rather
    // than an expired token. Surface the error; don't auto-redirect.
  }
}

export function connectDisconnect(): void {
  connect.auth.disconnect();
  connectUser.value = null;
  connectDesigns.value = [];
  connectFolders.value = [];
  connectError.value = null;
  try {
    sessionStorage.removeItem(SS_ORIGIN_HASH);
  } catch {
    // ignore
  }
}

export async function connectRefresh(): Promise<void> {
  if (!hasStoredToken()) return;
  await hydrate();
}
