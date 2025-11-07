import { test, expect } from '@playwright/test';

test.describe('Product Browsing and Cart Management', () => {
  test('browse products and manage cart', async ({ page }) => {
    // Set up dialog handler at the start
    page.on('dialog', dialog => dialog.accept());

    // Navigate to homepage
    await page.goto('https://www.demoblaze.com');

    // Browse laptop category
    await page.getByRole('link', { name: 'Laptops' }).click();
    // Wait for category content to load
    await expect(page.locator('#tbodyid')).toBeVisible();
    await expect(page.getByText('Sony vaio i5')).toBeVisible();

    // Browse monitor category
    await page.getByRole('link', { name: 'Monitors' }).click();
    // Wait for category content to load
    await expect(page.locator('#tbodyid')).toBeVisible();
    await expect(page.getByText('Apple monitor 24')).toBeVisible();

    // Check product details
    await page.getByRole('link', { name: 'Apple monitor 24' }).click();
    await expect(page.locator('.product-content')).toBeVisible();
    await expect(page.getByText('LED Cinema Display features a 27-inch glossy LED-backlit TFT')).toBeVisible();
    await expect(page.getByRole('heading', { name: /\$400/ })).toBeVisible();

    // Add to cart
    await page.getByRole('link', { name: 'Add to cart' }).click();
    await page.waitForTimeout(500); // Brief pause for the alert to be handled

    // Go to cart and verify product
    await page.getByRole('link', { name: 'Cart', exact: true }).click();
    // Wait for cart content to load
    await expect(page.locator('#tbodyid')).toBeVisible();
    // Wait for the specific product row
    const productRow = page.locator('tr', { has: page.getByText('Apple monitor 24') });
    await expect(productRow).toBeVisible();
    await expect(page.getByRole('cell', { name: '400' })).toBeVisible();

    // Store the current number of items in cart
    const itemCount = await page.locator('#tbodyid tr').count();
    
    // Delete product
    await page.getByRole('link', { name: 'Delete' }).click();
    
    // Wait for the item count to decrease
    await expect.poll(async () => {
      return await page.locator('#tbodyid tr').count();
    }).toBe(itemCount - 1);
    
    // Verify product is removed
    await expect(page.getByText('Apple monitor 24')).not.toBeVisible();
  });
});