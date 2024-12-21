import { test, expect } from '@playwright/test';

test('blog post should be visible', async ({ page }) => {
  await page.goto('/blog/example-post.html');
  const blogHeading = page.locator('text=Example Post');

  expect(blogHeading).toBeVisible();
});
