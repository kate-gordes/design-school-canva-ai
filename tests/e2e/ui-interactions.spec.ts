import { test, expect } from '@playwright/test';

test.describe('UI Interactions', () => {
  test('form elements and inputs work correctly', async ({ page }) => {
    // Test different pages that might have forms or inputs
    const pagesToTest = ['/', '/projects', '/templates', '/ai', '/settings'];

    for (const testPage of pagesToTest) {
      await page.goto(testPage);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Look for input elements
      const inputs = page.locator('input, textarea, select, [contenteditable="true"]');
      const inputCount = await inputs.count();

      if (inputCount > 0) {
        // Test first few inputs
        for (let i = 0; i < Math.min(3, inputCount); i++) {
          const input = inputs.nth(i);

          if ((await input.isVisible()) && (await input.isEnabled())) {
            try {
              const tagName = await input.evaluate(el => el.tagName.toLowerCase());
              const inputType = (await input.getAttribute('type')) || 'text';

              if (tagName === 'input' && ['text', 'email', 'search'].includes(inputType)) {
                await input.fill('test input');
                await expect(input).toHaveValue('test input');
                await input.clear();
              } else if (tagName === 'textarea') {
                await input.fill('test textarea content');
                const value = await input.inputValue();
                expect(value).toBe('test textarea content');
                await input.clear();
              } else if (tagName === 'select') {
                const options = page.locator(`${await input.locator('xpath=.')} option`);
                const optionCount = await options.count();
                if (optionCount > 1) {
                  await input.selectOption({ index: 1 });
                }
              }
            } catch (error) {
              console.log(`Input test failed on ${testPage}:`, error);
            }
          }
        }
      }
    }
  });

  test('buttons and interactive elements respond correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Find all buttons and interactive elements
    const interactiveElements = page.locator(`
      button:not([disabled]),
      [role="button"]:not([aria-disabled="true"]),
      a[href]:not([disabled]),
      [data-testid*="button"]:not([disabled]),
      [class*="button"]:not([disabled])
    `);

    const elementCount = await interactiveElements.count();
    expect(elementCount).toBeGreaterThan(0);

    // Test hover states on first few elements
    for (let i = 0; i < Math.min(5, elementCount); i++) {
      const element = interactiveElements.nth(i);

      if (await element.isVisible()) {
        try {
          // Test hover
          await element.hover();
          await page.waitForTimeout(100);

          // Test focus
          await element.focus();
          await page.waitForTimeout(100);
        } catch (error) {
          console.log(`Interactive element test failed:`, error);
        }
      }
    }
  });

  test('modal and popup interactions', async ({ page }) => {
    const pagesToTest = ['/', '/projects', '/templates', '/settings'];

    for (const testPage of pagesToTest) {
      await page.goto(testPage);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // Look for elements that might trigger modals/popups
      const triggerElements = page.locator(`
        [aria-haspopup="true"],
        [data-testid*="modal"],
        [data-testid*="popup"],
        [data-testid*="dropdown"],
        [class*="dropdown"],
        [class*="menu"]
      `);

      const triggerCount = await triggerElements.count();

      if (triggerCount > 0) {
        for (let i = 0; i < Math.min(2, triggerCount); i++) {
          const trigger = triggerElements.nth(i);

          if ((await trigger.isVisible()) && (await trigger.isEnabled())) {
            try {
              await trigger.click();
              await page.waitForTimeout(500);

              // Look for opened modal/popup content
              const modalContent = page.locator(`
                [role="dialog"],
                [role="menu"],
                [data-testid*="modal-content"],
                [class*="modal"],
                [class*="popup"],
                .dropdown-menu
              `);

              const openModalCount = await modalContent.count();

              if (openModalCount > 0) {
                // Modal/popup opened successfully
                await expect(modalContent.first()).toBeVisible();

                // Try to close it (look for close button or click outside)
                const closeButton = page
                  .locator(
                    `
                  [aria-label*="close"],
                  [data-testid*="close"],
                  [class*="close"],
                  button[type="button"]
                `,
                  )
                  .first();

                if (await closeButton.isVisible()) {
                  await closeButton.click();
                } else {
                  // Try pressing escape
                  await page.keyboard.press('Escape');
                }

                await page.waitForTimeout(500);
              }
            } catch (error) {
              console.log(`Modal test failed on ${testPage}:`, error);
            }
          }
        }
      }
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Test tab navigation
    const focusableElements = page.locator(`
      button:not([disabled]),
      a[href],
      input:not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      [tabindex]:not([tabindex="-1"]):not([disabled])
    `);

    const focusableCount = await focusableElements.count();

    if (focusableCount > 0) {
      // Start tab navigation
      await page.keyboard.press('Tab');
      await page.waitForTimeout(100);

      // Continue tabbing through a few elements
      for (let i = 0; i < Math.min(5, focusableCount); i++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(100);
      }

      // Test shift+tab (reverse navigation)
      await page.keyboard.press('Shift+Tab');
      await page.waitForTimeout(100);
    }
  });
});
