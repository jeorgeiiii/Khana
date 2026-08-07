// @ts-check
import { test, expect } from '@playwright/test';

test('user can open the login page from the home header', async ({ page }) => {
  await page.goto('/');

  await page.getByText('Log in').click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Welcome back!' })).toBeVisible();
  await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
  await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
});
