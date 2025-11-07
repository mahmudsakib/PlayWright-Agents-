import { test, expect } from '@playwright/test';

test('smoke: add product to cart and complete purchase', async ({ page }) => {
  // Go to site
  await page.goto('https://www.demoblaze.com/');

  // Set up dialog handler at the start
  page.on('dialog', dialog => dialog.accept());

  // Open first product from the listing
  const firstProduct = page.locator('#tbodyid .card-title a').first();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    firstProduct.click(),
  ]);

  // Click Add to cart
  await page.getByText('Add to cart').click();
  await page.waitForTimeout(1000); // Wait for alert to be handled

  // Go to Cart page with navigation wait
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.click('a[href="cart.html"]'),
  ]);

  // Open Place Order modal (use role to avoid matching modal title)
  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.waitForTimeout(1000); // Wait for modal animation

  // Fill order form (dummy data)
  await page.fill('#name', 'Playwright Test User');
  await page.fill('#country', 'Testland');
  await page.fill('#city', 'Testville');
  await page.fill('#card', '4111111111111111');
  await page.fill('#month', '01');
  await page.fill('#year', '2030');

  // Submit purchase
  await page.getByRole('button', { name: 'Purchase' }).click();

  // Verify success dialog appears with increased timeout
  await expect(page.locator('.sweet-alert')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.sweet-alert')).toContainText('Thank you');
});