const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests de Produits Configurables', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Configuration d\'un ordinateur personnalisé - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-150' },
      { type: 'tags', description: '@configurable @computers' },
      { type: 'test_description', description: 'Configuration d\'un PC avec options personnalisées' }
    );

    await page.goto('https://demowebshop.tricentis.com/build-your-own-computer');
    await wait(1000);
    await captureEvidence(page, testInfo, 'computer-config-page');

    // Select processor
    const processorSelect = page.locator('select[id*="product_attribute"]').first();
    if (await processorSelect.isVisible()) {
      await processorSelect.selectOption({ index: 1 });
      await wait(500);
    }

    // Select RAM
    const ramRadio = page.locator('input[type="radio"][id*="product_attribute"]').first();
    if (await ramRadio.isVisible()) {
      await ramRadio.check();
      await wait(500);
    }

    // Select HDD
    const hddRadio = page.locator('input[type="radio"][name*="product_attribute"]').nth(2);
    if (await hddRadio.isVisible()) {
      await hddRadio.check();
      await wait(500);
    }

    await captureEvidence(page, testInfo, 'computer-configured');

    // Check price update
    const price = page.locator('.product-price, .price-value');
    await expect(price).toBeVisible();

    // Add to cart
    const addToCartBtn = page.locator('#add-to-cart-button-16');
    await addToCartBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'added-to-cart');
  });

  test('Produit avec options multiples - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-151' },
      { type: 'tags', description: '@configurable' },
      { type: 'test_description', description: 'Sélection de plusieurs options sur un produit' }
    );

    await page.goto('https://demowebshop.tricentis.com/build-your-own-computer');
    await wait(1000);

    // Select multiple checkboxes if available
    const checkboxes = page.locator('input[type="checkbox"][id*="product_attribute"]');
    const count = await checkboxes.count();

    for (let i = 0; i < Math.min(count, 2); i++) {
      await checkboxes.nth(i).check();
      await wait(300);
    }

    await captureEvidence(page, testInfo, 'multiple-options-selected');

    // Verify options are selected
    for (let i = 0; i < Math.min(count, 2); i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
  });
});
