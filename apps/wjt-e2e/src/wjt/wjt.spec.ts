import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  const version = page.locator('text=version: ');

  await expect(version).toBeVisible();
});
