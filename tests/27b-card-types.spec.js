const { test, expect } = require('../test-fixtures');
const { 
  wait, 
  createAccount, 
  addProductToCart,
  selectShippingMethod,
  selectPaymentMethod,
  fillCreditCardInfo
} = require('../utils/helpers');

/**
 * TESTS DES DIFFÉRENTS TYPES DE CARTES DE CRÉDIT
 * 
 * Teste tous les types de cartes supportés avec des numéros de test Adyen:
 * - Visa (4111 1111 1111 1111)
 * - Mastercard (5555 5555 5555 4444)
 * - American Express (3700 0000 0000 002)
 * - Discover (6011 6011 6011 6611)
 * - Diners Club (3600 6666 3333 44)
 * - JCB (3569 9900 1009 5841)
 * 
 * Source: https://docs.adyen.com/development-resources/test-cards-and-credentials/test-card-numbers
 * 
 * Jira: Étiquettes = @payment @creditcard @cardtypes
 */

test.describe('Tests des Types de Cartes de Crédit', () => {
  
  test.beforeEach(async ({ page }) => {
    // Créer un compte et ajouter un produit
    await createAccount(page);
    await addProductToCart(page, '/books', 0);
    
    // Aller au checkout et passer les étapes jusqu'au paiement
    await page.goto('/cart');
    await expect(page.locator('.cart-item-row')).toBeVisible();
    await page.locator('input#termsofservice').check();
    await page.locator('button#checkout').click();
    await wait(2000);
    
    // Billing address
    await page.locator('select#BillingNewAddress_CountryId').selectOption({ label: 'United States' });
    await wait(500);
    await page.locator('input#BillingNewAddress_City').fill('New York');
    await page.locator('input#BillingNewAddress_Address1').fill('123 Main St');
    await page.locator('input#BillingNewAddress_ZipPostalCode').fill('10001');
    await page.locator('input#BillingNewAddress_PhoneNumber').fill('5551234567');
    await page.locator('#billing-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Shipping address
    await page.locator('#shipping-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Shipping method (Ground par défaut)
    await selectShippingMethod(page, 0);
  });

  test('Checkout avec carte Visa - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-CARD-001' },
      { type: 'tags', description: '@payment @creditcard @visa' }
    );

    await selectPaymentMethod(page, 2);
    await fillCreditCardInfo(page, 'visa');
    
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with Visa card (4111 1111 1111 1111)');
  });

  test('Checkout avec carte Mastercard - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-CARD-002' },
      { type: 'tags', description: '@payment @creditcard @mastercard' }
    );

    await selectPaymentMethod(page, 2);
    await fillCreditCardInfo(page, 'mastercard');
    
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with Mastercard (5555 5555 5555 4444)');
  });

  test('Checkout avec carte American Express - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-CARD-003' },
      { type: 'tags', description: '@payment @creditcard @amex' }
    );

    await selectPaymentMethod(page, 2);
    await fillCreditCardInfo(page, 'amex');
    
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with American Express (3700 0000 0000 002)');
  });

  test('Checkout avec carte Discover - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-CARD-004' },
      { type: 'tags', description: '@payment @creditcard @discover' }
    );

    await selectPaymentMethod(page, 2);
    await fillCreditCardInfo(page, 'discover');
    
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with Discover (6011 6011 6011 6611)');
  });

  test('Checkout avec carte Diners Club - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-CARD-005' },
      { type: 'tags', description: '@payment @creditcard @diners' }
    );

    await selectPaymentMethod(page, 2);
    await fillCreditCardInfo(page, 'diners');
    
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with Diners Club (3600 6666 3333 44)');
  });

  test('Checkout avec carte JCB - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-CARD-006' },
      { type: 'tags', description: '@payment @creditcard @jcb' }
    );

    await selectPaymentMethod(page, 2);
    await fillCreditCardInfo(page, 'jcb');
    
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with JCB (3569 9900 1009 5841)');
  });
});
