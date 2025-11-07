import { test, expect } from '@playwright/test';

test.describe('Authentication and Contact Form', () => {
  const timestamp = '20251107';  // Using fixed timestamp for demo
  const username = `testuser_${timestamp}`;
  const password = 'test123';

  test('signup, login and contact form', async ({ page }) => {
    // Set up dialog handler for all alerts
    page.on('dialog', dialog => dialog.accept());
    
    // Navigate to homepage
    await page.goto('https://www.demoblaze.com');

    // Test signup
    await page.getByRole('link', { name: 'Sign up' }).click();
    const signUpModal = page.locator('#signInModal');
    await expect(signUpModal).toBeVisible();
    await page.getByRole('textbox', { name: 'Username:' }).fill(username);
    await page.getByRole('textbox', { name: 'Password:' }).fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    
    // After signup success dialog, close the modal
    await page.waitForTimeout(500); // Brief pause for the alert to be handled
    await page.locator('#signInModal .btn-secondary').click();
    await expect(signUpModal).not.toBeVisible();

    // Test duplicate signup
    await page.getByRole('link', { name: 'Sign up' }).click();
    await expect(signUpModal).toBeVisible();
    await page.getByRole('textbox', { name: 'Username:' }).fill(username);
    await page.getByRole('textbox', { name: 'Password:' }).fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.waitForTimeout(500); // Brief pause for the alert to be handled
    await page.locator('#signInModal .btn-secondary').click();
    await expect(signUpModal).not.toBeVisible();

    // Test login
    await page.getByRole('link', { name: 'Log in' }).click();
    const loginModal = page.locator('#logInModal');
    await expect(loginModal).toBeVisible();
    await page.locator('#loginusername').fill(username);
    await page.locator('#loginpassword').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();
    await page.waitForTimeout(500); // Brief pause for potential alerts
    await expect(loginModal).not.toBeVisible();

    // Verify logged in state
    await expect(page.getByRole('link', { name: `Welcome ${username}` })).toBeVisible();
    
    // Test contact form
    await page.getByRole('link', { name: 'Contact' }).click();
    const contactModal = page.locator('#exampleModal');
    await expect(contactModal).toBeVisible();
    await page.locator('#recipient-email').fill('test@test.com');
    await page.getByRole('textbox', { name: 'Contact Email: Contact Name:' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Message:' }).fill('Test message');
    await page.getByRole('button', { name: 'Send message' }).click();
    await page.waitForTimeout(500); // Brief pause for the alert to be handled
    await expect(contactModal).not.toBeVisible();
  });
});