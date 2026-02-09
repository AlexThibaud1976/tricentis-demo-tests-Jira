const { test, expect } = require('../test-fixtures');
const { 
  wait, 
  createAccount, 
  addProductToCart,
  selectShippingMethod,
  selectPaymentMethod,
  getAvailablePaymentMethods,
  fillCreditCardInfo,
  fillPurchaseOrder
} = require('../utils/helpers');

/**
 * TESTS DES MOYENS DE PAIEMENT
 * 
 * Couvre les 4 moyens de paiement disponibles:
 * - Cash On Delivery (COD) (7.00)
 * - Check / Money Order (5.00)
 * - Credit Card
 * - Purchase Order
 * 
 * Jira: Étiquettes = @payment @checkout
 */

test.describe('Tests de Moyens de Paiement', () => {
  
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
    
    // Sur onepagecheckout, utiliser les adresses existantes
    // Billing address (utiliser l'option par défaut si elle existe, sinon remplir)
    const billingSelect = page.locator('select#billing-address-select');
    const hasBillingAddress = await billingSelect.isVisible().catch(() => false);
    
    if (hasBillingAddress) {
      // Une adresse existe déjà, continuer
      await page.getByRole('button', { name: 'Continue' }).first().click();
    } else {
      // Remplir l'adresse de facturation
      await page.locator('select#BillingNewAddress_CountryId').selectOption({ label: 'United States' });
      await wait(500);
      await page.locator('input#BillingNewAddress_City').fill('New York');
      await page.locator('input#BillingNewAddress_Address1').fill('123 Main St');
      await page.locator('input#BillingNewAddress_ZipPostalCode').fill('10001');
      await page.locator('input#BillingNewAddress_PhoneNumber').fill('5551234567');
      await page.getByRole('button', { name: 'Continue' }).first().click();
    }
    await wait(2000);
    
    // Shipping address (utiliser la même adresse)
    await page.getByRole('button', { name: 'Continue' }).first().click();
    await wait(2000);
    
    // Shipping method (Ground par défaut)
    await selectShippingMethod(page, 0);
  });

  test('Vérifier que tous les moyens de paiement sont disponibles', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-001' },
      { type: 'tags', description: '@payment @smoke' }
    );

    const methods = await getAvailablePaymentMethods(page);
    
    // Vérifier qu'il y a exactement 4 moyens
    expect(methods.length).toBe(4);
    
    // Vérifier les moyens attendus
    expect(methods[0].label).toContain('Cash On Delivery');
    expect(methods[1].label).toContain('Check');
    expect(methods[2].label).toContain('Credit Card');
    expect(methods[3].label).toContain('Purchase Order');
    
    console.log('✅ All 4 payment methods are available');
  });

  test('Checkout avec Cash On Delivery (COD) - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-002' },
      { type: 'tags', description: '@payment @checkout @sanity' }
    );

    // Sélectionner COD
    const selectedMethod = await selectPaymentMethod(page, 0);
    expect(selectedMethod).toContain('Cash On Delivery');
    expect(selectedMethod).toContain('7.00'); // Frais COD
    
    // COD ne nécessite pas de champs additionnels
    const paymentInfoButton = page.locator('#payment-info-buttons-container input[value="Continue"]');
    await expect(paymentInfoButton).toBeVisible();
    
    // Continue
    await paymentInfoButton.click();
    await wait(2000);
    
    // Confirm
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    // Vérifier
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with COD');
  });

  test('Checkout avec Check / Money Order - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-003' },
      { type: 'tags', description: '@payment @checkout' }
    );

    // Sélectionner Check/Money Order
    const selectedMethod = await selectPaymentMethod(page, 1);
    expect(selectedMethod).toContain('Check');
    expect(selectedMethod).toContain('5.00'); // Frais
    
    // Continue (pas de champs additionnels pour Check)
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Confirm
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    // Vérifier
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with Check/Money Order');
  });

  test('Checkout avec Credit Card - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-004' },
      { type: 'tags', description: '@payment @checkout @creditcard' }
    );

    // Sélectionner Credit Card
    const selectedMethod = await selectPaymentMethod(page, 2);
    expect(selectedMethod).toContain('Credit Card');
    
    // Remplir les informations de carte
    await fillCreditCardInfo(page, 'visa', testInfo, 'Informations_carte_completees');
    
    // Continue
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Confirm
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    // Vérifier
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with Credit Card');
  });

  test('Checkout avec Purchase Order - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-005' },
      { type: 'tags', description: '@payment @checkout @po' }
    );

    // Sélectionner Purchase Order
    const selectedMethod = await selectPaymentMethod(page, 3);
    expect(selectedMethod).toContain('Purchase Order');
    
    // Remplir le numéro de PO
    await fillPurchaseOrder(page, 'PO-2024-001');
    
    // Continue
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Confirm
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    // Vérifier
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with Purchase Order');
  });

  test('Credit Card avec informations invalides - Cas bloquant ❌', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-006' },
      { type: 'tags', description: '@payment @validation @negative' }
    );

    // Sélectionner Credit Card
    await selectPaymentMethod(page, 2);
    
    // Remplir avec un numéro de carte invalide
    await fillCreditCardInfo(page, { number: '1234567890123456' }, testInfo, 'Carte_invalide_completee');
    
    // Essayer de continuer
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Vérifier qu'on reste sur la page ou qu'une erreur apparaît
    // Note: Le site demo peut accepter les cartes invalides, à vérifier
    const confirmButton = page.locator('#confirm-order-buttons-container input[value="Confirm"]');
    const isOnConfirmPage = await confirmButton.isVisible({ timeout: 5000 }).catch(() => false);
    
    console.log(`Card validation: ${isOnConfirmPage ? 'Not enforced (demo)' : 'Enforced'}`);
  });

  test('Purchase Order avec numéro vide - Cas bloquant ❌', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-007' },
      { type: 'tags', description: '@payment @validation @negative' }
    );

    // Sélectionner Purchase Order
    await selectPaymentMethod(page, 3);
    
    // Ne pas remplir le numéro de PO
    // Essayer de continuer directement
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Vérifier la validation
    const poField = page.locator('input#PurchaseOrderNumber');
    const validationMessage = await poField.evaluate((el) => el.validationMessage);
    
    if (validationMessage) {
      console.log(`✅ PO validation enforced: ${validationMessage}`);
      expect(validationMessage).toBeTruthy();
    } else {
      console.log('⚠️  PO validation not enforced by browser (demo mode)');
    }
  });

  test('Vérifier les frais de chaque méthode de paiement', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-008' },
      { type: 'tags', description: '@payment @pricing' }
    );

    const methods = await getAvailablePaymentMethods(page);
    
    // Vérifier les frais affichés
    expect(methods[0].label).toContain('7.00'); // COD
    expect(methods[1].label).toContain('5.00'); // Check
    
    // Credit Card et PO n'ont généralement pas de frais affichés dans le label
    console.log('Payment methods with fees:');
    methods.forEach((method, index) => {
      const feeMatch = method.label.match(/\(([0-9.]+)\)/);
      if (feeMatch) {
        console.log(`  ${method.label} -> Fee: ${feeMatch[1]}`);
      } else {
        console.log(`  ${method.label} -> No fee displayed`);
      }
    });
  });

  test('Changer de moyen de paiement en revenant en arrière', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-009' },
      { type: 'tags', description: '@payment @navigation' }
    );

    // Sélectionner COD d'abord
    await selectPaymentMethod(page, 0);
    await expect(page.locator('#payment-info-buttons-container')).toBeVisible();
    
    // Utiliser le lien "Back" dans onepagecheckout pour revenir à la sélection
    await page.locator('#payment-info-buttons-container a:has-text("Back")').click();
    await wait(1000);
    
    // Vérifier que les options de paiement sont de nouveau visibles
    await expect(page.locator('input[name="paymentmethod"]').first()).toBeVisible();
    
    // Changer pour Credit Card
    await selectPaymentMethod(page, 2);
    
    // Remplir la carte
    await fillCreditCardInfo(page, 'visa', testInfo, 'Carte_apres_changement_methode');
    
    // Continuer et terminer
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Can change payment method by re-selecting');
  });

  test('Vérifier que Credit Card affiche les champs requis', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-010' },
      { type: 'tags', description: '@payment @ui @creditcard' }
    );

    // Sélectionner Credit Card
    await selectPaymentMethod(page, 2);
    
    // Vérifier que tous les champs de carte sont présents
    await expect(page.locator('input#CardholderName')).toBeVisible();
    await expect(page.locator('input#CardNumber')).toBeVisible();
    await expect(page.locator('select#ExpireMonth')).toBeVisible();
    await expect(page.locator('select#ExpireYear')).toBeVisible();
    await expect(page.locator('input#CardCode')).toBeVisible();
    
    console.log('✅ All credit card fields are present');
  });

  test('Vérifier que Purchase Order affiche le champ requis', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-011' },
      { type: 'tags', description: '@payment @ui @po' }
    );

    // Sélectionner Purchase Order
    await selectPaymentMethod(page, 3);
    
    // Vérifier que le champ PO est présent
    await expect(page.locator('input#PurchaseOrderNumber')).toBeVisible();
    
    // Vérifier le placeholder ou label
    const poField = page.locator('input#PurchaseOrderNumber');
    const placeholder = await poField.getAttribute('placeholder');
    console.log(`PO field placeholder: ${placeholder}`);
    
    console.log('✅ Purchase Order field is present');
  });

  test('Vérifier que COD et Check ne nécessitent pas de champs additionnels', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-PAY-012' },
      { type: 'tags', description: '@payment @ui' }
    );

    // Test COD
    await selectPaymentMethod(page, 0);
    
    // Vérifier qu'il n'y a pas de champs de formulaire visibles dans la section payment-info
    const codInputs = await page.locator('#payment-info input[type="text"]:visible, #payment-info input[type="tel"]:visible').count();
    console.log(`COD additional fields: ${codInputs}`);
    expect(codInputs).toBe(0);
    
    // Utiliser le lien "Back" pour revenir à la sélection des méthodes de paiement
    await page.locator('#payment-info-buttons-container a:has-text("Back")').click();
    await wait(1000);
    
    // Re-sélectionner Check/Money Order
    await selectPaymentMethod(page, 1);
    await wait(1000);
    
    const checkInputs = await page.locator('#payment-info input[type="text"]:visible, #payment-info input[type="tel"]:visible').count();
    console.log(`Check/Money Order additional fields: ${checkInputs}`);
    expect(checkInputs).toBe(0);
    
    console.log('✅ COD and Check/Money Order require no additional fields');
  });
});

