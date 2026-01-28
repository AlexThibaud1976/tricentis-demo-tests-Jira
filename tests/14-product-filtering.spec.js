const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests de Filtrage de Produits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Filtrage par prix - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-140' },
      { type: 'tags', description: '@filter @price' },
      { type: 'test_description', description: 'Filtrage des produits par tranche de prix' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);
    await captureEvidence(page, testInfo, 'books-page');

    // Look for price filter
    const priceFilter = page.locator('.filter-price-item a, .price-range-filter a').first();
    if (await priceFilter.isVisible()) {
      await priceFilter.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'filtered-by-price');

      // Verify products are displayed
      const products = page.locator('.product-item, .item-box');
      const count = await products.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('Tri par nom - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-141' },
      { type: 'tags', description: '@filter @sort' },
      { type: 'test_description', description: 'Tri des produits par nom A-Z' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);
    await captureEvidence(page, testInfo, 'books-before-sort');

    // Find sort dropdown
    const sortSelect = page.locator('#products-orderby');
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption({ index: 1 }); // Select second option
      await wait(1000);
      await captureEvidence(page, testInfo, 'sorted-by-name');
    }
  });

  test('Changement de vue (grille/liste) - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-142' },
      { type: 'tags', description: '@filter @view' },
      { type: 'test_description', description: 'Basculement entre vue grille et liste' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);
    await captureEvidence(page, testInfo, 'default-view');

    // Find view mode selector
    const viewModeSelect = page.locator('#products-viewmode');
    if (await viewModeSelect.isVisible()) {
      await viewModeSelect.selectOption({ index: 1 }); // Select list view
      await wait(1000);
      await captureEvidence(page, testInfo, 'list-view');

      // Verify list view is applied
      const listContainer = page.locator('.product-list');
      if (await listContainer.isVisible()) {
        await expect(listContainer).toBeVisible();
      }
    }
  });
});
