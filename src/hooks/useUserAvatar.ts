import { useEffect, useState } from 'react';
import auth from '@canva-ct/auth';
import { canvaworld } from '@canva-ct/canva';

interface UserAvatarState {
  avatarUrl: string | null;
  loading: boolean;
}

/**
 * Hook to fetch the current user's avatar via CanvaWorldService.getMe().
 */
export function useUserAvatar(): UserAvatarState {
  const [state, setState] = useState<UserAvatarState>({
    avatarUrl: null,
    loading: true,
  });

  useEffect(() => {
    if (!auth.getToken()) {
      setState({ avatarUrl: null, loading: false });
      return;
    }

    // Skip API call for test users (e.g. "test-mpuga-user-test")
    const token = auth.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
        const username = payload.email?.split('@')[0] ?? '';
        if (username.includes('user-test')) {
          setState({ avatarUrl: null, loading: false });
          return;
        }
      } catch {
        /* ignore decode errors */
      }
    }

    let cancelled = false;

    canvaworld
      .getMe({ fields: ['photos'] })
      .then(me => {
        if (!cancelled) {
          setState({ avatarUrl: me.photos?.[0] ?? null, loading: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ avatarUrl: null, loading: false });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
