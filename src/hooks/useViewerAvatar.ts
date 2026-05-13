import { useEffect, useState } from 'react';
import auth from '@canva-ct/auth';
import { canvaworld } from '@canva-ct/canva';

export interface Collaborator {
  id: string;
  name: string;
  avatar: string | null;
  borderColor: string;
}

interface CollaboratorsState {
  collaborators: Collaborator[];
  loading: boolean;
}

const KNOWN_USERNAMES = ['mpuga', 'lucyd'] as const;
const BORDER_COLORS = ['#7d2ae8', '#0095ff', '#00a846', '#f5a623'];

/**
 * Fetches the header collaborators (mpuga, lucyd) and the current viewer
 * from CanvaWorldService. If the viewer is someone other than mpuga/lucyd,
 * they are appended as a third collaborator.
 */
export function useCollaborators(): CollaboratorsState {
  const [state, setState] = useState<CollaboratorsState>({
    collaborators: [],
    loading: true,
  });

  useEffect(() => {
    if (!auth.getToken()) {
      setState({ collaborators: [], loading: false });
      return;
    }

    // Skip API calls for test users (e.g. "test-mpuga-user-test")
    const token = auth.getToken()!;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      const username = payload.email?.split('@')[0] ?? '';
      if (username.includes('user-test')) {
        setState({ collaborators: [], loading: false });
        return;
      }
    } catch {
      /* ignore decode errors */
    }

    let cancelled = false;

    async function fetchAll() {
      try {
        const [lucyd, mpuga, me] = await Promise.all([
          canvaworld.getEmployee('lucyd', { fields: ['full_name', 'photos'] }),
          canvaworld.getEmployee('mpuga', { fields: ['full_name', 'photos'] }),
          canvaworld.getMe({ fields: ['full_name', 'photos'] }),
        ]);

        if (cancelled) return;

        const base: Collaborator[] = [
          {
            id: 'lucyd',
            name: lucyd.full_name ?? 'Lucy',
            avatar: lucyd.photos?.[0] ?? null,
            borderColor: BORDER_COLORS[0],
          },
          {
            id: 'mpuga',
            name: mpuga.full_name ?? 'Mpuga',
            avatar: mpuga.photos?.[0] ?? null,
            borderColor: BORDER_COLORS[1],
          },
        ];

        // Extract viewer username from JWT
        let viewerUsername: string | null = null;
        const token = auth.getToken();
        if (token) {
          try {
            const payload = JSON.parse(
              atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
            );
            viewerUsername = payload.email?.split('@')[0] ?? null;
          } catch {
            // ignore decode errors
          }
        }

        const isKnownUser =
          viewerUsername !== null
          && (KNOWN_USERNAMES as readonly string[]).includes(viewerUsername);

        if (!isKnownUser && viewerUsername) {
          base.push({
            id: viewerUsername,
            name: me.full_name ?? 'You',
            avatar: me.photos?.[0] ?? null,
            borderColor: BORDER_COLORS[base.length] ?? BORDER_COLORS[BORDER_COLORS.length - 1],
          });
        }

        setState({ collaborators: base, loading: false });
      } catch {
        if (!cancelled) {
          setState({ collaborators: [], loading: false });
        }
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
