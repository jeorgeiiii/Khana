// @ts-check
import { test, expect } from '@playwright/test';

test('frontend loads and backend API responds', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('#root')).toBeVisible();

  const response = await request.get('http://127.0.0.1:5000/api/v1/test/test-user');
  expect(response.ok()).toBeTruthy();
  await expect(response.text()).resolves.toContain('Test User Data');
});
