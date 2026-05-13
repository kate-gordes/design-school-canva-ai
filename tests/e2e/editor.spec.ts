import { test, expect } from '@playwright/test';

test.describe('Editor Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/editor');
    await page.waitForLoadState('networkidle');
  });

  test('editor page loads successfully', async ({ page }) => {
    // Verify we're on the editor page
    await expect(page).toHaveURL(/.*\/editor/);

    // Check that the page content is visible
    await expect(page.locator('#root')).toBeVisible();

    // Wait for any dynamic content to load
    await page.waitForTimeout(2000);

    // Verify no critical JavaScript errors
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && !msg.text().includes('favicon')) {
        errors.push(msg.text());
      }
    });

    // Additional wait to catch any delayed errors
    await page.waitForTimeout(1000);

    // Filter out non-critical errors
    const criticalErrors = errors.filter(
      error =>
        !error.includes('LiveReload')
        && !error.includes('WebSocket')
        && !error.includes('Failed to load resource')
        && !error.toLowerCase().includes('network'),
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('editor UI components are interactive', async ({ page }) => {
    // Wait for the editor to fully load
    await page.waitForTimeout(3000);

    // Look for clickable elements (buttons, links, interactive components)
    const clickableElements = page.locator('button, [role="button"], a, [data-testid*="button"]');
    const clickableCount = await clickableElements.count();

    // Verify that there are interactive elements present
    expect(clickableCount).toBeGreaterThan(0);

    // Test clicking the first few interactive elements (if they exist)
    for (let i = 0; i < Math.min(3, clickableCount); i++) {
      const element = clickableElements.nth(i);
      if ((await element.isVisible()) && (await element.isEnabled())) {
        try {
          await element.click({ timeout: 5000 });
          // Small delay between clicks
          await page.waitForTimeout(500);
        } catch (error) {
          // Some elements might not be clickable in the test environment
          console.log(`Element ${i} not clickable:`, error);
        }
      }
    }
  });

  test('editor handles navigation back to other pages', async ({ page }) => {
    // From editor, navigate to other pages to ensure routing works
    const testRoutes = ['/', '/projects', '/templates'];

    for (const route of testRoutes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(new RegExp(`.*${route === '/' ? '$' : route}`));

      // Navigate back to editor
      await page.goto('/editor');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/.*\/editor/);
    }
  });

  test('editor page accessibility basics', async ({ page }) => {
    // Check for basic accessibility features
    await page.waitForTimeout(2000);

    // Look for elements with proper ARIA labels
    const ariaElements = page.locator('[aria-label], [aria-labelledby], [role]');
    const ariaCount = await ariaElements.count();

    // Modern apps should have some accessibility attributes
    expect(ariaCount).toBeGreaterThan(0);

    // Check that the page has a proper title
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});
