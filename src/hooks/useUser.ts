import { useMemo } from 'react';
import auth from '@canva-ct/auth';

export interface UserInfo {
  email: string;
  sub: string;
  given_name: string;
  family_name: string;
  iss: string;
  iat: number;
  exp: number;
}

/**
 * Decodes a JWT token and returns the payload
 */
function decodeJwt(token: string): UserInfo | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Hook to get the current user's information from the auth token
 */
export function useUser(): UserInfo | null {
  return useMemo(() => {
    const token = auth.getToken();
    if (!token) {
      return null;
    }
    return decodeJwt(token);
  }, []);
}

/**
 * Gets the user's first name for personalized greetings
 */
export function useUserFirstName(): string | null {
  const user = useUser();
  return user?.given_name ?? null;
}
