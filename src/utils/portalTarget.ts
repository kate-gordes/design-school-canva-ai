/**
 * Get the portal target element for components that need to escape stacking contexts
 * but still inherit app styles (fonts, theme, etc.)
 *
 * Portals to #root instead of document.body to inherit global CSS styles.
 */
export function getPortalTarget(): HTMLElement {
  return document.getElementById('root') || document.body;
}
