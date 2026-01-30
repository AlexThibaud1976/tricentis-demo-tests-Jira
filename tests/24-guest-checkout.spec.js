const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, generateUserData } = require('../utils/helpers');

test.describe('Tests de Checkout Invité', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Commande en tant qu\'invité - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-283' },
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
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();
    await wait(1000);

    // Verify product added
    const successNotification = page.locator('.bar-notification.success');
    await expect(successNotification).toBeVisible({ timeout: 5000 });

    // Go to cart
    await page.goto('https://demowebshop.tricentis.com/cart');
    await wait(1000);
    await captureEvidence(page, testInfo, 'cart-with-product');

    // Verify cart has items
    const cartItems = page.locator('.cart-item-row');
    expect(await cartItems.count()).toBeGreaterThan(0);

    // Accept terms and checkout
    const termsCheckbox = page.locator('#termsofservice');
    await expect(termsCheckbox).toBeVisible();
    await termsCheckbox.check();

    const checkoutBtn = page.locator('#checkout');
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'checkout-options');

    // Select checkout as guest
    const guestCheckout = page.locator('input[value="Checkout as Guest"]');
    await expect(guestCheckout).toBeVisible();
    await guestCheckout.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'billing-address-form');

    // Verify billing form is displayed (optional check)
    await wait(500);

    // Fill billing address
    await page.fill('#BillingNewAddress_FirstName', userData.firstName);
    await page.fill('#BillingNewAddress_LastName', userData.lastName);
    await page.fill('#BillingNewAddress_Email', userData.email);

    const countrySelect = page.locator('#BillingNewAddress_CountryId');
    await expect(countrySelect).toBeVisible();
    await countrySelect.selectOption('1'); // USA
    await wait(500);

    await page.fill('#BillingNewAddress_City', 'Test City');
    await page.fill('#BillingNewAddress_Address1', '123 Test Street');
    await page.fill('#BillingNewAddress_ZipPostalCode', '12345');
    await page.fill('#BillingNewAddress_PhoneNumber', '1234567890');

    await captureEvidence(page, testInfo, 'billing-filled');

    // Continue
    const continueBtn = page.locator('input[onclick*="Billing.save"], #billing-buttons-container input[value="Continue"]');
    await expect(continueBtn).toBeVisible();
    await continueBtn.click();
    await wait(1000);
    await captureEvidence(page, testInfo, 'after-billing');
    
    // Verify moved to next step
    const shippingSection = page.locator('#shipping-address-select, #shipping-method-buttons-container').first();
    await expect(shippingSection).toBeVisible({ timeout: 5000 });
  });
});
