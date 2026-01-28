const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, createAccount, login } = require('../utils/helpers');

test.describe('Tests d\'Historique des Commandes', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Consultation historique des commandes - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-130' },
      { type: 'tags', description: '@orders @history' },
      { type: 'test_description', description: 'Affichage de la page historique des commandes' }
    );

    // Create account first
    const userData = await createAccount(page);
    await captureEvidence(page, testInfo, 'account-created');

    // Navigate to orders
    await page.goto('https://demowebshop.tricentis.com/customer/orders');
    await wait(1000);

    await captureEvidence(page, testInfo, 'orders-page');

    // Verify page loaded
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toContainText(/order/i);
  });

  test('Détails d\'une commande - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-131' },
      { type: 'tags', description: '@orders @details' },
      { type: 'test_description', description: 'Consultation du détail d\'une commande existante' }
    );

    // Create account
    const userData = await createAccount(page);

    // First place an order
    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add product to cart
    const addToCartBtn = page.locator('input[value="Add to cart"]').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await wait(1000);

      // Go to cart and checkout
      await page.goto('https://demowebshop.tricentis.com/cart');
      await wait(1000);

      const termsCheckbox = page.locator('#termsofservice');
      if (await termsCheckbox.isVisible()) {
        await termsCheckbox.check();
      }

      const checkoutBtn = page.locator('#checkout');
      if (await checkoutBtn.isVisible()) {
        await checkoutBtn.click();
        await wait(2000);
      }
    }

    // Navigate to orders
    await page.goto('https://demowebshop.tricentis.com/customer/orders');
    await wait(1000);

    await captureEvidence(page, testInfo, 'orders-list');

    // Try to view order details
    const detailsBtn = page.locator('input[value="Details"]').first();
    if (await detailsBtn.isVisible()) {
      await detailsBtn.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'order-details');
    }
  });
});
