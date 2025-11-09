// spec: TEST_PLAN_F1TCloud.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('Login: Successful login (Happy path)', async ({ page }) => {
    // 1. Navigate to https://f1tcloud.f1tdemo.xyz/login
    await page.goto('https://f1tcloud.f1tdemo.xyz/login');

  // 2. Verify login form elements (Email, Password, Submit)
  // Use placeholder/role locators which are more resilient if <label> elements are not present
  const emailInput = page.getByPlaceholder('Email');
  const passwordInput = page.getByPlaceholder('Password');
  const submitButton = page.getByRole('button', { name: /submit|sign in|log ?in|login/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();

    // 3. Fill in credentials and submit the form
    // Uses environment variables if provided; fallbacks are provided for local runs
    const EMAIL = process.env.F1T_EMAIL ?? 'admin@test.com';
    const PASSWORD = process.env.F1T_PASS ?? '123456';

    await emailInput.fill(EMAIL);
    await passwordInput.fill(PASSWORD);

    // Make sure the submit control is enabled and visible, then click it
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 4. Verify login succeeded.
    // Some apps redirect after login; others update the UI without navigation.
    // First wait a bit longer for any redirect away from /login. If that doesn't
    // happen, fall back to checking for common post-login UI like a Dashboard link
    // or a Logout/Sign out button.
    try {
      await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 });
    } catch {
      // Some apps don't redirect on login. Wait for a common post-login UI element.
      // Use a single combined locator that matches either a dashboard link or a logout button.
      const postLogin = page.locator(
        'role=link[name=/dashboard|members|overview|home/i], role=button[name=/logout|sign out|log out/i]'
      );
      await expect(postLogin.first()).toBeVisible({ timeout: 15000 });
    }
  });
});
