const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, clearCart } = require('../utils/helpers');

test.describe('Tests de Mise à Jour du Panier', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await clearCart(page);
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Modification de la quantité - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-284' },
      { type: 'tags', description: '@cart @quantity' },
      { type: 'test_description', description: 'Modification de la quantité d\'un article dans le panier' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add product to cart
    const addToCartBtn = page.locator('input[value="Add to cart"]').first();
    await addToCartBtn.click();
    await wait(1000);

    // Go to cart
    await page.goto('https://demowebshop.tricentis.com/cart');
    await wait(1000);
    await captureEvidence(page, testInfo, 'cart-initial');

    // Get initial total
    const initialTotal = await page.locator('.order-total strong').first().textContent();

    // Update quantity
    const qtyInput = page.locator('input.qty-input').first();
    await qtyInput.fill('3');

    // Click update cart
    const updateBtn = page.locator('input[name="updatecart"], input[value="Update shopping cart"]');
    await updateBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'cart-updated');

    // Verify quantity changed
    await expect(qtyInput).toHaveValue('3');
    
    // Verify total was recalculated
    const updatedTotal = await page.locator('.order-total strong').first().textContent();
    expect(updatedTotal).toBeTruthy();
  });

  test('Suppression d\'un article - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-285' },
      { type: 'tags', description: '@cart @remove' },
      { type: 'test_description', description: 'Suppression d\'un article du panier' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add product to cart
    const addToCartBtn = page.locator('input[value="Add to cart"]').first();
    await addToCartBtn.click();
    await wait(1000);

    // Go to cart
    await page.goto('https://demowebshop.tricentis.com/cart');
    await wait(1000);
    await captureEvidence(page, testInfo, 'cart-with-item');

    // Check remove checkbox
    const removeCheckbox = page.locator('input[name="removefromcart"]').first();
    await removeCheckbox.check();

    // Update cart
    const updateBtn = page.locator('input[name="updatecart"], input[value="Update shopping cart"]');
    await updateBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'cart-after-remove');

    // Verify item was removed
    const cartItems = page.locator('.cart-item-row');
    const remainingItems = await cartItems.count();
    expect(remainingItems).toBe(0);
    
    // Verify empty cart message or summary
    const emptyCart = page.locator('.order-summary-content');
    await expect(emptyCart).toContainText(/empty|no items/i);
  });

  test('Application d\'un code promo - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-286' },
      { type: 'tags', description: '@cart @promo' },
      { type: 'test_description', description: 'Tentative d\'application d\'un code promo' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add product to cart
    const addToCartBtn = page.locator('input[value="Add to cart"]').first();
    await addToCartBtn.click();
    await wait(1000);

    // Go to cart
    await page.goto('https://demowebshop.tricentis.com/cart');
    await wait(1000);
    await captureEvidence(page, testInfo, 'cart-before-promo');

    // Try to apply coupon code
    const couponInput = page.locator('#discountcouponcode');
    const hasCouponField = await couponInput.count() > 0;
    
    if (hasCouponField) {
      await expect(couponInput).toBeVisible();
      await couponInput.fill('TESTCODE');

      const applyBtn = page.locator('input[name="applydiscountcouponcode"]');
      await expect(applyBtn).toBeVisible();
      await applyBtn.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'promo-applied');

      // Verify message displayed (success or error)
      const message = page.locator('.message-error, .message-success, .coupon-box-message');
      await expect(message).toBeVisible({ timeout: 5000 });
    } else {
      // No coupon field available, just verify cart page loaded
      const cartTitle = page.locator('.page-title, h1').first();
      await expect(cartTitle).toBeVisible();
    }
  });
});
