import { test, expect } from '@playwright/test';

test.describe('Product Browsing and Cart Management', () => {
  test('browse products and manage cart', async ({ page }) => {
    // Navigate to homepage
    await page.goto('https://www.demoblaze.com');

    // Browse categories - Laptops
    await page.getByRole('link', { name: 'Laptops' }).click();
    await expect(page.getByText('Sony vaio i5')).toBeVisible();

    // Browse categories - Monitors  
    await page.getByRole('link', { name: 'Monitors' }).click();
    await expect(page.getByText('Apple monitor 24')).toBeVisible();

    // Browse categories - Go back to Laptops for product
    await page.goto('https://www.demoblaze.com');
    await page.getByRole('link', { name: 'Laptops' }).click();

    // Check product details
    await page.getByRole('link', { name: 'Sony vaio i5' }).click();
    await expect(page.getByText('ultraportable laptop')).toBeVisible();
    await expect(page.getByText('790')).toBeVisible();

    // Add to cart
    const addToCartButton = page.getByRole('link', { name: 'Add to cart' });
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Go to cart and verify product
    await page.getByRole('link', { name: 'Cart', exact: true }).click();
    await expect(page.getByText('Sony vaio i5')).toBeVisible();
    await expect(page.getByText('790')).toBeVisible();

    // Delete product and verify cart empty
    await page.getByRole('link', { name: 'Delete' }).click();
    await expect(page.getByText('Sony vaio i5')).not.toBeVisible();
  });
});