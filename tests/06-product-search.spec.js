const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests de Recherche Produit', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Recherche simple par nom de produit - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-100' },
      { type: 'tags', description: '@smoke @search' },
      { type: 'test_description', description: 'Recherche d\'un produit par son nom exact' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await captureEvidence(page, testInfo, 'homepage');

    // Search for a product
    await page.fill('#small-searchterms', 'laptop');
    await page.click('input[type="submit"][value="Search"]');
    await wait(1000);

    await captureEvidence(page, testInfo, 'search-results');

    // Verify search results
    const resultsTitle = page.locator('.search-results h1, .page-title');
    await expect(resultsTitle).toContainText(/search/i);

    // Verify products are displayed
    const products = page.locator('.product-item, .item-box');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Recherche avec terme partiel - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-101' },
      { type: 'tags', description: '@search' },
      { type: 'test_description', description: 'Recherche avec un terme partiel retourne des résultats' }
    );

    await page.goto('https://demowebshop.tricentis.com/');

    await page.fill('#small-searchterms', 'comp');
    await page.click('input[type="submit"][value="Search"]');
    await wait(1000);

    await captureEvidence(page, testInfo, 'partial-search-results');

    // Should find computer-related products
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toMatch(/computer|comp/);
  });

  test('Recherche sans résultat - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-104' },
      { type: 'tags', description: '@search' },
      { type: 'test_description', description: 'Recherche avec terme inexistant affiche message approprié' }
    );

    await page.goto('https://demowebshop.tricentis.com/');

    await page.fill('#small-searchterms', 'xyznonexistent123');
    await page.click('input[type="submit"][value="Search"]');
    await wait(1000);

    await captureEvidence(page, testInfo, 'no-results');

    // Should show no products found message
    const noResults = page.locator('.no-result, .search-results');
    await expect(noResults).toBeVisible();
  });

  test('Recherche avancée avec filtres - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-105' },
      { type: 'tags', description: '@search @advanced' },
      { type: 'test_description', description: 'Utilisation de la recherche avancée avec catégorie' }
    );

    await page.goto('https://demowebshop.tricentis.com/search');
    await wait(1000);
    await captureEvidence(page, testInfo, 'advanced-search-page');

    // Check advanced search checkbox
    const advancedCheckbox = page.locator('#adv');
    const hasAdvanced = await advancedCheckbox.count() > 0;
    if (hasAdvanced) {
      await advancedCheckbox.check();
      await wait(500);
    }

    // Fill search term
    const searchInput = page.locator('input.search-text, #q, input[name="q"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('book');

    // Select category if available
    const categorySelect = page.locator('#cid, select[name="cid"]');
    const hasCategory = await categorySelect.count() > 0;
    if (hasCategory) {
      await categorySelect.selectOption({ index: 1 });
    }

    await page.click('input.search-button, input[type="submit"][value="Search"]');
    await wait(1000);

    await captureEvidence(page, testInfo, 'advanced-search-results');

    // Verify search executed successfully
    const searchResults = page.locator('.search-results, .product-grid').first();
    await expect(searchResults).toBeVisible();
  });
});
