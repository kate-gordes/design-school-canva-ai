import auth from '@canva-ct/auth';

export interface MediaResponse {
  mediaId: string;
  mediaVersion: number;
  url: string;
  width: number;
  height: number;
}

export type ContentType = 'ALL' | 'GRAPHIC' | 'PHOTO';

export interface SearchMediaParams {
  query: string;
  contentType?: ContentType;
  limit?: number;
  mapFields?: boolean;
}

const API_BASE_URL = 'https://api.playground.canva-experiments.com/canva/media';

/**
 * Gets authentication token from @canva-ct/auth
 */
const getAuthToken = (): string | null => {
  return auth.getToken();
};

/**
 * Searches for media elements using the Canva API
 * @param params Search parameters
 * @returns Array of media results
 */
export const searchMedia = async (params: SearchMediaParams): Promise<MediaResponse[]> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Authentication token not found');
  }

  const { query, contentType = 'ALL', limit = 20, mapFields = true } = params;

  // Build query string
  const searchParams = new URLSearchParams({
    query,
    contentType,
    limit: limit.toString(),
    mapFields: mapFields.toString(),
  });

  const url = `${API_BASE_URL}/search?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        console.error('Authentication error, redirecting to login');
        auth.handleAuthError();
        throw new Error(`Authentication error: ${response.status}`);
      }
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Media API Response:', data);

    // Handle different possible response structures
    if (Array.isArray(data)) {
      return data;
    }

    // Check for results array (expected mapped format)
    if (data.results && Array.isArray(data.results)) {
      return data.results;
    }

    // Check for other possible array fields
    if (data.media && Array.isArray(data.media)) {
      return data.media;
    }

    if (data.items && Array.isArray(data.items)) {
      return data.items;
    }

    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }

    // If we get here, the structure is unexpected
    console.error('Unexpected API response structure:', data);
    return [];
  } catch (error) {
    console.error('Error fetching media:', error);
    throw error;
  }
};
