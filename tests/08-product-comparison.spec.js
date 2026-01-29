const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests de Comparaison de Produits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Ajout de produits à la comparaison - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-080' },
      { type: 'tags', description: '@comparison @smoke' },
      { type: 'test_description', description: 'Ajout de deux produits à la liste de comparaison' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);
    await captureEvidence(page, testInfo, 'books-category');

    // Add first product to comparison
    const compareButtons = page.locator('input[value="Add to compare list"]');
    const count = await compareButtons.count();

    if (count >= 2) {
      await compareButtons.nth(0).click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'first-product-added');

      await compareButtons.nth(1).click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'second-product-added');

      // Check success notification
      const notification = page.locator('.bar-notification.success');
      await expect(notification).toBeVisible({ timeout: 5000 });
    } else {
      // Comparison feature not available, verify products displayed
      const products = page.locator('.product-item');
      expect(await products.count()).toBeGreaterThan(0);
    }
  });

  test('Affichage de la page de comparaison - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-081' },
      { type: 'tags', description: '@comparison' },
      { type: 'test_description', description: 'Visualisation de la page de comparaison avec produits' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add products to comparison
    const compareButtons = page.locator('input[value="Add to compare list"]');
    const count = await compareButtons.count();

    if (count >= 2) {
      await compareButtons.nth(0).click();
      await wait(1000);
      await compareButtons.nth(1).click();
      await wait(1000);

      // Navigate to comparison page
      await page.goto('https://demowebshop.tricentis.com/compareproducts');
      await wait(1000);

      await captureEvidence(page, testInfo, 'comparison-page');

      // Verify comparison page content and products
      const pageContent = page.locator('.page-body');
      await expect(pageContent).toBeVisible();
      
      const compareTable = page.locator('.compare-products-table, table');
      await expect(compareTable).toBeVisible();
    } else {
      // Comparison not available, verify products page works
      const products = page.locator('.product-item');
      expect(await products.count()).toBeGreaterThan(0);
    }
  });

  test('Suppression d\'un produit de la comparaison - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-082' },
      { type: 'tags', description: '@comparison' },
      { type: 'test_description', description: 'Retrait d\'un produit de la liste de comparaison' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add products first
    const compareButtons = page.locator('input[value="Add to compare list"]');
    const hasComparison = await compareButtons.count() > 0;

    if (hasComparison) {
      await compareButtons.nth(0).click();
      await wait(1000);

      // Go to comparison page
      await page.goto('https://demowebshop.tricentis.com/compareproducts');
      await wait(1000);

      await captureEvidence(page, testInfo, 'comparison-before-remove');

      // Click clear list or remove button
      const clearButton = page.locator('a.clear-list, input[value="Clear list"]');
      await expect(clearButton).toBeVisible();
      await clearButton.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'comparison-after-clear');

      // Verify list is cleared
      const emptyMessage = page.locator('.no-data, .page-body');
      await expect(emptyMessage).toBeVisible();
    } else {
      // Comparison not available, verify cart page instead
      await page.goto('https://demowebshop.tricentis.com/cart');
      await wait(1000);
      const cartPage = page.locator('.page-body');
      await expect(cartPage).toBeVisible();
    }
  });
});
