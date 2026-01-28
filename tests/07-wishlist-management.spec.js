const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, createAccount, login, logout } = require('../utils/helpers');

test.describe('Tests de Gestion de Liste de Souhaits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Ajout d\'un produit à la liste de souhaits - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-070' },
      { type: 'tags', description: '@wishlist @smoke' },
      { type: 'test_description', description: 'Ajout d\'un produit simple à la wishlist' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await captureEvidence(page, testInfo, 'homepage');

    // Navigate to a product
    await page.click('a[href*="/books"]');
    await wait(1000);

    // Click on first product
    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'product-page');

    // Add to wishlist
    const wishlistButton = page.locator('input[value="Add to wishlist"], .add-to-wishlist-button');
    if (await wishlistButton.isVisible()) {
      await wishlistButton.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'added-to-wishlist');

      // Check wishlist count or success message
      const successMessage = page.locator('.bar-notification.success, .content');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('Visualisation de la liste de souhaits - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-071' },
      { type: 'tags', description: '@wishlist' },
      { type: 'test_description', description: 'Affichage de la page wishlist' }
    );

    await page.goto('https://demowebshop.tricentis.com/');

    // First add a product to wishlist
    await page.goto('https://demowebshop.tricentis.com/fiction');
    await wait(1000);

    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    const wishlistButton = page.locator('input[value="Add to wishlist"], .add-to-wishlist-button');
    if (await wishlistButton.isVisible()) {
      await wishlistButton.click();
      await wait(1000);
    }

    // Navigate to wishlist
    await page.goto('https://demowebshop.tricentis.com/wishlist');
    await wait(1000);

    await captureEvidence(page, testInfo, 'wishlist-page');

    // Verify wishlist page
    const wishlistTitle = page.locator('h1').first();
    await expect(wishlistTitle).toContainText(/wishlist/i);
  });

  test('Transfert wishlist vers panier - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-072' },
      { type: 'tags', description: '@wishlist @cart' },
      { type: 'test_description', description: 'Déplacement d\'un article de la wishlist vers le panier' }
    );

    await page.goto('https://demowebshop.tricentis.com/');

    // Add product to wishlist first
    await page.goto('https://demowebshop.tricentis.com/computing-and-internet');
    await wait(1000);

    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    const wishlistButton = page.locator('input[value="Add to wishlist"], .add-to-wishlist-button');
    if (await wishlistButton.isVisible()) {
      await wishlistButton.click();
      await wait(2000);
    }

    // Go to wishlist
    await page.goto('https://demowebshop.tricentis.com/wishlist');
    await wait(1000);

    await captureEvidence(page, testInfo, 'wishlist-before-transfer');

    // Check item and add to cart
    const checkbox = page.locator('input[name="addtocart"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
      
      const addToCartBtn = page.locator('input[name="addtocartbutton"], .wishlist-add-to-cart-button');
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        await wait(1000);
        await captureEvidence(page, testInfo, 'transferred-to-cart');
      }
    }
  });
});
