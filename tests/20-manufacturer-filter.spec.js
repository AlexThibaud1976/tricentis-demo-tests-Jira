const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests du Filtre par Fabricant', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Filtrage par fabricant - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-200' },
      { type: 'tags', description: '@filter @manufacturer' },
      { type: 'test_description', description: 'Filtrage des produits par fabricant' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);
    await captureEvidence(page, testInfo, 'homepage');

    // Find manufacturers block
    const manufacturerLink = page.locator('.manufacturer-item a, .manufacturers-list a').first();
    if (await manufacturerLink.isVisible()) {
      const manufacturerName = await manufacturerLink.textContent();
      await manufacturerLink.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'manufacturer-page');

      // Verify manufacturer page
      const pageTitle = page.locator('.page-title, h1');
      await expect(pageTitle).toBeVisible();
    }
  });
});
