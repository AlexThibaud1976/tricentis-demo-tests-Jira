const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, generateUserData } = require('../utils/helpers');

test.describe('Tests de Checkout Invité', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Commande en tant qu\'invité - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-240' },
      { type: 'tags', description: '@checkout @guest @smoke' },
      { type: 'test_description', description: 'Processus complet de commande sans création de compte' }
    );

    const userData = generateUserData();

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);

    // Add a simple product to cart
    await page.goto('https://demowebshop.tricentis.com/fiction');
    await wait(1000);

    const addToCartBtn = page.locator('input[value="Add to cart"]').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await wait(1000);
    }

    // Go to cart
    await page.goto('https://demowebshop.tricentis.com/cart');
    await wait(1000);
    await captureEvidence(page, testInfo, 'cart-with-product');

    // Accept terms and checkout
    const termsCheckbox = page.locator('#termsofservice');
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.check();
    }

    const checkoutBtn = page.locator('#checkout');
    await checkoutBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'checkout-options');

    // Select checkout as guest
    const guestCheckout = page.locator('input[value="Checkout as Guest"]');
    if (await guestCheckout.isVisible()) {
      await guestCheckout.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'billing-address-form');

      // Fill billing address
      await page.fill('#BillingNewAddress_FirstName', userData.firstName);
      await page.fill('#BillingNewAddress_LastName', userData.lastName);
      await page.fill('#BillingNewAddress_Email', userData.email);

      const countrySelect = page.locator('#BillingNewAddress_CountryId');
      if (await countrySelect.isVisible()) {
        await countrySelect.selectOption('1'); // USA
        await wait(500);
      }

      await page.fill('#BillingNewAddress_City', 'Test City');
      await page.fill('#BillingNewAddress_Address1', '123 Test Street');
      await page.fill('#BillingNewAddress_ZipPostalCode', '12345');
      await page.fill('#BillingNewAddress_PhoneNumber', '1234567890');

      await captureEvidence(page, testInfo, 'billing-filled');

      // Continue
      const continueBtn = page.locator('input[onclick*="Billing.save"], #billing-buttons-container input[value="Continue"]');
      if (await continueBtn.isVisible()) {
        await continueBtn.click();
        await wait(1000);
        await captureEvidence(page, testInfo, 'after-billing');
      }
    }
  });
});
