const CDN_URL =
  import.meta.env.VITE_CDN_URL
  || (import.meta.env.DEV
    ? '/assets-cdn/'
    : 'https://public.canva-experiments.com/canva-prototype/');

export function cdn(path: string): string {
  const trimmedBase = CDN_URL.replace(/\/$/, '');
  const trimmedPath = path.replace(/^\//, '');
  return `${trimmedBase}/${trimmedPath}`;
}
