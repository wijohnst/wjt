import { test, expect } from '@playwright/test';

test('version number should be displayed', async ({ page }) => {
  await page.goto('/');
  const version = page.locator('text=version: ');

  await expect(version).toBeVisible();
});

test('heading should be visible', async ({ page }) => {
  await page.goto('/');
  const mainHeading = page.getByText('willjohnston.tech');

  await expect(mainHeading).toBeVisible();
});
