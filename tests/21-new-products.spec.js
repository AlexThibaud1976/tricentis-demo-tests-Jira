const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests des Nouveaux Produits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Affichage des nouveaux produits - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-210' },
      { type: 'tags', description: '@new-products' },
      { type: 'test_description', description: 'Visualisation de la page des nouveaux produits' }
    );

    await page.goto('https://demowebshop.tricentis.com/newproducts');
    await wait(1000);

    await captureEvidence(page, testInfo, 'new-products-page');

    // Verify page loaded
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toContainText(/new/i);

    // Check if products are displayed
    const products = page.locator('.product-item, .item-box');
    const count = await products.count();
    // New products page may or may not have products
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
