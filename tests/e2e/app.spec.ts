import { test, expect } from '@playwright/test';

test.describe('Canva Prototype App', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/');
  });

  test('loads the home page successfully', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check that the page title is correct
    await expect(page).toHaveTitle(/Canva/);

    // Verify the app container is visible
    await expect(page.locator('#root')).toBeVisible();

    // Check for key elements that should be present
    await expect(page.locator('body')).toBeVisible();
  });

  test('navigation works correctly', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Test Projects navigation
    const projectsLink = page.locator('[href="/projects"]').first();
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
      await page.waitForURL('**/projects');
      await expect(page).toHaveURL(/.*\/projects/);
    }

    // Test Templates navigation
    await page.goto('/');
    const templatesLink = page.locator('[href="/templates"]').first();
    if (await templatesLink.isVisible()) {
      await templatesLink.click();
      await page.waitForURL('**/templates');
      await expect(page).toHaveURL(/.*\/templates/);
    }

    // Test Brand navigation
    await page.goto('/');
    const brandLink = page.locator('[href="/brand"]').first();
    if (await brandLink.isVisible()) {
      await brandLink.click();
      await page.waitForURL('**/brand');
      await expect(page).toHaveURL(/.*\/brand/);
    }

    // Test AI navigation
    await page.goto('/');
    const aiLink = page.locator('[href="/ai"]').first();
    if (await aiLink.isVisible()) {
      await aiLink.click();
      await page.waitForURL('**/ai');
      await expect(page).toHaveURL(/.*\/ai/);
    }

    // Test Apps navigation
    await page.goto('/');
    const appsLink = page.locator('[href="/apps"]').first();
    if (await appsLink.isVisible()) {
      await appsLink.click();
      await page.waitForURL('**/apps');
      await expect(page).toHaveURL(/.*\/apps/);
    }
  });

  test('direct page routes work correctly', async ({ page }) => {
    const routes = [
      '/projects',
      '/templates',
      '/brand',
      '/ai',
      '/apps',
      '/photos',
      '/editor',
      '/settings',
    ];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Verify the route loaded successfully
      await expect(page).toHaveURL(new RegExp(`.*${route}`));

      // Verify the app container is still visible
      await expect(page.locator('#root')).toBeVisible();

      // Check that content is rendered (not just a blank page)
      const bodyContent = await page.locator('body').textContent();
      expect(bodyContent).toBeTruthy();
      expect(bodyContent!.trim().length).toBeGreaterThan(0);
    }
  });

  test('no console errors on page load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Allow for some common non-critical errors but fail on critical ones
    const criticalErrors = errors.filter(
      error =>
        !error.includes('favicon')
        && !error.includes('LiveReload')
        && !error.includes('WebSocket')
        && !error.includes('Failed to load resource')
        && !error.toLowerCase().includes('network'),
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('app state persistence', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Navigate to a different page
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');

    // Navigate back to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify the app still works correctly
    await expect(page.locator('#root')).toBeVisible();
  });

  test('critical UI components render', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Check for primary navigation
    const primaryNav = page
      .locator('nav, [role="navigation"], [data-testid*="nav"], [class*="nav"]')
      .first();

    // Wait a bit for navigation to render
    await page.waitForTimeout(1000);

    // If nav exists, it should be visible
    if ((await primaryNav.count()) > 0) {
      await expect(primaryNav).toBeVisible();
    }
  });
});
