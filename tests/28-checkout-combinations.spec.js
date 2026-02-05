const { test, expect } = require('../test-fixtures');
const { 
  wait, 
  createAccount, 
  addProductToCart,
  selectShippingMethod,
  selectPaymentMethod,
  fillCreditCardInfo,
  fillPurchaseOrder
} = require('../utils/helpers');

/**
 * TESTS DES COMBINAISONS SHIPPING × PAYMENT
 * 
 * Teste toutes les combinaisons possibles de méthodes de livraison et moyens de paiement:
 * 3 shipping methods × 4 payment methods = 12 tests de combinaisons
 * 
 * Jira: Étiquettes = @checkout @combinations @integration
 */

test.describe('Tests des Combinaisons Shipping × Payment', () => {
  
  /**
   * Helper pour préparer un checkout jusqu'à la sélection des méthodes
   */
  async function prepareCheckout(page) {
    await createAccount(page);
    await addProductToCart(page, '/books', 0);
    
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
  }

  /**
   * Helper pour finaliser la commande selon le moyen de paiement
   */
  async function finalizeOrder(page, paymentIndex) {
    // Remplir les champs selon le moyen de paiement
    if (paymentIndex === 2) {
      // Credit Card
      await fillCreditCardInfo(page);
    } else if (paymentIndex === 3) {
      // Purchase Order
      await fillPurchaseOrder(page);
    }
    // COD (0) et Check (1) ne nécessitent rien
    
    // Continue
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Confirm
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    // Vérifier
    await expect(page.locator('.order-completed')).toBeVisible();
  }

  // ===== GROUND SHIPPING (index 0) =====
  
  test('Ground + Cash On Delivery (COD) - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-001' },
      { type: 'tags', description: '@checkout @combinations @sanity' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 0); // Ground
    await selectPaymentMethod(page, 0);  // COD
    await finalizeOrder(page, 0);
    
    console.log('✅ Ground + COD combination successful');
  });

  test('Ground + Check / Money Order - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-002' },
      { type: 'tags', description: '@checkout @combinations' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 0); // Ground
    await selectPaymentMethod(page, 1);  // Check
    await finalizeOrder(page, 1);
    
    console.log('✅ Ground + Check combination successful');
  });

  test('Ground + Credit Card - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-003' },
      { type: 'tags', description: '@checkout @combinations @creditcard' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 0); // Ground
    await selectPaymentMethod(page, 2);  // Credit Card
    await finalizeOrder(page, 2);
    
    console.log('✅ Ground + Credit Card combination successful');
  });

  test('Ground + Purchase Order - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-004' },
      { type: 'tags', description: '@checkout @combinations @po' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 0); // Ground
    await selectPaymentMethod(page, 3);  // PO
    await finalizeOrder(page, 3);
    
    console.log('✅ Ground + Purchase Order combination successful');
  });

  // ===== NEXT DAY AIR (index 1) =====
  
  test('Next Day Air + Cash On Delivery (COD) - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-005' },
      { type: 'tags', description: '@checkout @combinations @express' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 1); // Next Day Air
    await selectPaymentMethod(page, 0);  // COD
    await finalizeOrder(page, 0);
    
    console.log('✅ Next Day Air + COD combination successful');
  });

  test('Next Day Air + Check / Money Order - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-006' },
      { type: 'tags', description: '@checkout @combinations @express' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 1); // Next Day Air
    await selectPaymentMethod(page, 1);  // Check
    await finalizeOrder(page, 1);
    
    console.log('✅ Next Day Air + Check combination successful');
  });

  test('Next Day Air + Credit Card - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-007' },
      { type: 'tags', description: '@checkout @combinations @express @creditcard' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 1); // Next Day Air
    await selectPaymentMethod(page, 2);  // Credit Card
    await finalizeOrder(page, 2);
    
    console.log('✅ Next Day Air + Credit Card combination successful');
  });

  test('Next Day Air + Purchase Order - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-008' },
      { type: 'tags', description: '@checkout @combinations @express @po' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 1); // Next Day Air
    await selectPaymentMethod(page, 3);  // PO
    await finalizeOrder(page, 3);
    
    console.log('✅ Next Day Air + Purchase Order combination successful');
  });

  // ===== 2ND DAY AIR (index 2) =====
  
  test('2nd Day Air + Cash On Delivery (COD) - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-009' },
      { type: 'tags', description: '@checkout @combinations @express' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 2); // 2nd Day Air
    await selectPaymentMethod(page, 0);  // COD
    await finalizeOrder(page, 0);
    
    console.log('✅ 2nd Day Air + COD combination successful');
  });

  test('2nd Day Air + Check / Money Order - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-010' },
      { type: 'tags', description: '@checkout @combinations @express' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 2); // 2nd Day Air
    await selectPaymentMethod(page, 1);  // Check
    await finalizeOrder(page, 1);
    
    console.log('✅ 2nd Day Air + Check combination successful');
  });

  test('2nd Day Air + Credit Card - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-011' },
      { type: 'tags', description: '@checkout @combinations @express @creditcard' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 2); // 2nd Day Air
    await selectPaymentMethod(page, 2);  // Credit Card
    await finalizeOrder(page, 2);
    
    console.log('✅ 2nd Day Air + Credit Card combination successful');
  });

  test('2nd Day Air + Purchase Order - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-COMBO-012' },
      { type: 'tags', description: '@checkout @combinations @express @po' }
    );

    await prepareCheckout(page);
    await selectShippingMethod(page, 2); // 2nd Day Air
    await selectPaymentMethod(page, 3);  // PO
    await finalizeOrder(page, 3);
    
    console.log('✅ 2nd Day Air + Purchase Order combination successful');
  });
});
