const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests des Produits Récemment Consultés', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Affichage des produits récemment vus - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-275' },
      { type: 'tags', description: '@recently-viewed @smoke' },
      { type: 'test_description', description: 'Vérification que les produits consultés apparaissent dans la section récemment vus' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);

    // View several products
    await page.goto('https://demowebshop.tricentis.com/fiction');
    await wait(1000);

    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);
    await captureEvidence(page, testInfo, 'first-product-viewed');

    await page.goto('https://demowebshop.tricentis.com/computing-and-internet');
    await wait(1000);

    const secondProduct = page.locator('.product-item, .item-box').first();
    await secondProduct.locator('a').first().click();
    await wait(1000);
    await captureEvidence(page, testInfo, 'second-product-viewed');

    // Navigate to recently viewed
    await page.goto('https://demowebshop.tricentis.com/recentlyviewedproducts');
    await wait(1000);

    await captureEvidence(page, testInfo, 'recently-viewed-page');

    // Verify products are listed
    const recentProducts = page.locator('.product-item, .item-box');
    const count = await recentProducts.count();
    expect(count).toBeGreaterThan(0);
    
    // Verify page title
    const pageTitle = page.locator('.page-title, h1').first();
    await expect(pageTitle).toBeVisible();
  });
});
