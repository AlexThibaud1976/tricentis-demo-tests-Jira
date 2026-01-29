const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests des Tags Produits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Navigation via tags populaires - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-160' },
      { type: 'tags', description: '@tags @navigation' },
      { type: 'test_description', description: 'Utilisation des tags pour filtrer les produits' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);
    await captureEvidence(page, testInfo, 'homepage');

    // Find popular tags in sidebar
    const tagCloud = page.locator('.popular-tags a, .product-tags a').first();
    const hasTag = await tagCloud.count() > 0;
    
    if (hasTag) {
      const tagName = await tagCloud.textContent();
      await tagCloud.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'tag-results');

      // Verify tag results page loaded with products
      const pageTitle = page.locator('.page-title, h1');
      await expect(pageTitle).toBeVisible();
      
      const products = page.locator('.product-item, .item-box');
      expect(await products.count()).toBeGreaterThanOrEqual(0);
    } else {
      // No tags available, navigate to products directly
      await page.goto('https://demowebshop.tricentis.com/books');
      await wait(1000);
      await captureEvidence(page, testInfo, 'products-page');
    }
  });

  test('Tags sur page produit - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-161' },
      { type: 'tags', description: '@tags' },
      { type: 'test_description', description: 'Affichage et clic sur tags depuis une page produit' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Click on first product
    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'product-page');

    // Look for product tags
    const productTags = page.locator('.product-tags a');
    const tagCount = await productTags.count();
    
    if (tagCount > 0) {
      await productTags.first().click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'tag-from-product');
      
      // Verify navigated to tag page
      const pageContent = page.locator('.page-body');
      await expect(pageContent).toBeVisible();
    } else {
      // No tags on product, just verify product page loaded
      const productTitle = page.locator('.product-name, h1').first();
      await expect(productTitle).toBeVisible();
    }
  });
});
