import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test('complete purchase as new user', async ({ page }) => {
    // Set up dialog handler at the start
    page.on('dialog', dialog => dialog.accept());
    
    // Navigate to homepage
    await page.goto('https://www.demoblaze.com');

    // Generate unique username
    const timestamp = Date.now();
    const username = `user_${timestamp}`;
    const password = 'test_pass';

    // Clean up storage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Sign up new user
    await page.getByRole('link', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'Username:' }).fill(username);
    await page.getByRole('textbox', { name: 'Password:' }).fill(password);
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.waitForTimeout(1000); // Wait for sign up to complete

    // Log in with new user
    await page.getByRole('link', { name: 'Log in' }).click();
    await page.locator('#loginusername').fill(username);
    await page.locator('#loginpassword').fill(password);
    await page.getByRole('button', { name: 'Log in' }).click();

    // Verify successful login
    await expect(page.getByText(`Welcome ${username}`)).toBeVisible();
    
    // Browse and add product to cart
    await page.getByRole('link', { name: 'Phones' }).click();
    await expect(page.locator('#tbodyid')).toBeVisible();
    await page.getByRole('link', { name: 'Samsung galaxy s6' }).click();
    await expect(page.locator('.product-content')).toBeVisible();
    await page.getByRole('link', { name: 'Add to cart' }).click();
    await page.waitForTimeout(1000); // Wait for product to be added

    // Complete purchase flow - with extra waits
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'load' }),
      page.getByRole('link', { name: 'Cart', exact: true }).click()
    ]);
    await expect(page.locator('#tbodyid')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Samsung galaxy s6')).toBeVisible();
    await page.getByRole('button', { name: 'Place Order' }).click();

    // Fill order details - with retries for Firefox
    await page.waitForTimeout(1000);
    await page.locator('#name').fill('Test User');
    await page.locator('#country').fill('Test Country');
    await page.locator('#city').fill('Test City');
    await page.locator('#card').fill('4111111111111111');
    await page.locator('#month').fill('11');
    await page.locator('#year').fill('2025');

    // Complete purchase and verify - with increased timeouts
    await page.getByRole('button', { name: 'Purchase' }).click();
    await expect(page.locator('.sweet-alert')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Thank you for your purchase!')).toBeVisible();
    await page.getByRole('button', { name: 'OK' }).click();
  });
});