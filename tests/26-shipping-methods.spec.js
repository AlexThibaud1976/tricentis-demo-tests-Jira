const { test, expect } = require('../test-fixtures');
const { 
  wait, 
  createAccount, 
  addProductToCart,
  selectShippingMethod,
  getAvailableShippingMethods,
  selectPaymentMethod
} = require('../utils/helpers');

/**
 * TESTS DES MÉTHODES DE LIVRAISON
 * 
 * Couvre les 3 méthodes de livraison disponibles:
 * - Ground (0.00)
 * - Next Day Air (0.00)
 * - 2nd Day Air (0.00)
 * 
 * Jira: Étiquettes = @shipping @checkout
 */

test.describe('Tests de Méthodes de Livraison', () => {
  
  test.beforeEach(async ({ page }) => {
    // Créer un compte et ajouter un produit physique
    await createAccount(page);
    await addProductToCart(page, '/books', 0);
    
    // Aller au checkout
    await page.goto('/cart');
    await expect(page.locator('.cart-item-row')).toBeVisible();
    await page.locator('input#termsofservice').check();
    await page.locator('button#checkout').click();
    await wait(2000);
    
    // Remplir adresse de facturation
    await page.locator('select#BillingNewAddress_CountryId').selectOption({ label: 'United States' });
    await wait(500);
    await page.locator('input#BillingNewAddress_City').fill('New York');
    await page.locator('input#BillingNewAddress_Address1').fill('123 Main St');
    await page.locator('input#BillingNewAddress_ZipPostalCode').fill('10001');
    await page.locator('input#BillingNewAddress_PhoneNumber').fill('5551234567');
    await page.locator('#billing-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Confirmer adresse de livraison
    await page.locator('#shipping-buttons-container input[value="Continue"]').click();
    await wait(2000);
  });

  test('Vérifier que toutes les méthodes de livraison sont disponibles', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-SHIP-001' },
      { type: 'tags', description: '@shipping @smoke' }
    );

    const methods = await getAvailableShippingMethods(page);
    
    // Vérifier qu'il y a exactement 3 méthodes
    expect(methods.length).toBe(3);
    
    // Vérifier les méthodes attendues
    expect(methods[0].label).toContain('Ground');
    expect(methods[1].label).toContain('Next Day Air');
    expect(methods[2].label).toContain('2nd Day Air');
    
    console.log('✅ All 3 shipping methods are available');
  });

  test('Checkout avec Ground Shipping (option 0) - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-SHIP-002' },
      { type: 'tags', description: '@shipping @checkout @sanity' }
    );

    // Sélectionner Ground
    const selectedMethod = await selectShippingMethod(page, 0);
    expect(selectedMethod).toContain('Ground');
    
    // Continuer avec COD pour finir rapidement
    await selectPaymentMethod(page, 0);
    
    // Payment info (COD ne nécessite rien)
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Confirmer la commande
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    // Vérifier la confirmation
    await expect(page.locator('.order-completed')).toBeVisible();
    expect(page.url()).toContain('/checkout/completed/');
    
    console.log('✅ Order completed with Ground shipping');
  });

  test('Checkout avec Next Day Air (option 1) - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-SHIP-003' },
      { type: 'tags', description: '@shipping @checkout' }
    );

    // Sélectionner Next Day Air
    const selectedMethod = await selectShippingMethod(page, 1);
    expect(selectedMethod).toContain('Next Day Air');
    
    // Continuer avec COD
    await selectPaymentMethod(page, 0);
    
    // Payment info
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Confirmer
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    // Vérifier
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with Next Day Air shipping');
  });

  test('Checkout avec 2nd Day Air (option 2) - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-SHIP-004' },
      { type: 'tags', description: '@shipping @checkout' }
    );

    // Sélectionner 2nd Day Air
    const selectedMethod = await selectShippingMethod(page, 2);
    expect(selectedMethod).toContain('2nd Day Air');
    
    // Continuer avec COD
    await selectPaymentMethod(page, 0);
    
    // Payment info
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Confirmer
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    // Vérifier
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order completed with 2nd Day Air shipping');
  });

  test('Vérifier les prix des méthodes de livraison', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-SHIP-005' },
      { type: 'tags', description: '@shipping @pricing' }
    );

    const methods = await getAvailableShippingMethods(page);
    
    // Vérifier que les prix sont affichés (mode demo = 0.00)
    methods.forEach((method, index) => {
      console.log(`Method ${index}: ${method.label} = ${method.price}`);
      expect(method.price).toBeDefined();
      expect(method.label).toMatch(/\([0-9.]+\)/); // Prix entre parenthèses
    });
    
    console.log('✅ All shipping methods display prices');
  });

  test('Vérifier que les méthodes de livraison ne s\'appliquent pas aux produits virtuels', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-SHIP-006' },
      { type: 'tags', description: '@shipping @virtualproduct' }
    );

    // Nettoyer le panier (supprimer le produit physique du beforeEach)
    await page.goto('/cart');
    
    const removeButtons = await page.locator('.remove-from-cart input[type="checkbox"]').all();
    for (const button of removeButtons) {
      await button.check();
    }
    await page.locator('input[name="updatecart"]').click();
    await wait(2000);
    
    // Ajouter une gift card virtuelle
    await page.goto('/gift-cards');
    const firstGiftCard = page.locator('.product-item input[value="Add to cart"]').first();
    await firstGiftCard.click();
    
    // Remplir les champs requis pour la gift card
    await page.locator('input[name="giftcard_1.RecipientName"]').fill('John Doe');
    await page.locator('input[name="giftcard_1.RecipientEmail"]').fill('recipient@test.com');
    
    // Ajouter au panier - utiliser getByRole pour plus de fiabilité
    await page.getByRole('button', { name: 'Add to cart', exact: false }).first().click();
    
    // Attendre la notification de succès
    const successNotification = page.locator('.bar-notification.success');
    await successNotification.waitFor({ state: 'visible', timeout: 10000 });
    await wait(1000);
    
    // Checkout
    await page.goto('/cart');
    await page.locator('input#termsofservice').check();
    await page.locator('button#checkout').click();
    await wait(2000);
    
    // Sur onepagecheckout, utiliser l'adresse de facturation existante
    await page.getByRole('button', { name: 'Continue' }).first().click();
    await wait(2000);
    
    // Vérifier qu'on saute directement au paiement (pas de shipping pour produits virtuels)
    const paymentOptions = page.locator('input[name="paymentmethod"]');
    await expect(paymentOptions.first()).toBeVisible({ timeout: 10000 });
    
    // Vérifier explicitement qu'il n'y a PAS de section shipping method visible
    const shippingSection = page.locator('#opc-shipping_method');
    await expect(shippingSection).not.toBeVisible();
    
    console.log('✅ Virtual products skip shipping method selection');
  });

  test('Sélectionner une méthode puis revenir en arrière', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-SHIP-007' },
      { type: 'tags', description: '@shipping @navigation' }
    );

    // Sélectionner Ground
    await selectShippingMethod(page, 0);
    
    // Vérifier qu'on est sur la page payment
    await expect(page.locator('input[name="paymentmethod"]').first()).toBeVisible();
    
    // Aller au checkout depuis le début pour revenir à shipping
    await page.goto('/cart');
    await expect(page.locator('.cart-item-row')).toBeVisible();
    await page.locator('input#termsofservice').check();
    await page.locator('button#checkout').click();
    await wait(2000);
    
    // Continuer billing (déjà rempli)
    await page.locator('#billing-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Continuer shipping address (déjà rempli)
    await page.locator('#shipping-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Vérifier qu'on est de retour sur shipping
    await expect(page.locator('input[name="shippingoption"]').first()).toBeVisible();
    
    // Changer de méthode
    await selectShippingMethod(page, 1); // Next Day Air
    
    // Vérifier qu'on peut continuer
    await expect(page.locator('input[name="paymentmethod"]').first()).toBeVisible();
    
    console.log('✅ Can navigate back and change shipping method');
  });

  test('Vérifier que toutes les méthodes ont des labels clairs', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-SHIP-008' },
      { type: 'tags', description: '@shipping @ui' }
    );

    const methods = await getAvailableShippingMethods(page);
    
    methods.forEach((method, index) => {
      // Vérifier que le label n'est pas vide
      expect(method.label.length).toBeGreaterThan(0);
      
      // Vérifier que le label contient un nom de méthode
      const hasValidName = method.label.includes('Ground') || 
                           method.label.includes('Next Day') || 
                           method.label.includes('2nd Day');
      expect(hasValidName).toBeTruthy();
      
      // Vérifier que le prix est entre parenthèses
      expect(method.label).toMatch(/\(.+\)/);
      
      console.log(`✅ Method ${index}: ${method.label} - Valid label format`);
    });
  });

  test('Checkout avec différents types de produits physiques', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-SHIP-009' },
      { type: 'tags', description: '@shipping @multiproduct' }
    );

    // Le produit book est déjà dans le panier (beforeEach)
    // Ajouter un produit électronique (cell phone)
    await page.goto('/cell-phones');
    const electronics = page.locator('.product-item input[value="Add to cart"]').first();
    await electronics.click();
    
    // Attendre la notification de succès
    const successNotification = page.locator('.bar-notification.success');
    await successNotification.waitFor({ state: 'visible', timeout: 10000 });
    await wait(1000);
    
    // Retourner au checkout
    await page.goto('/cart');
    await expect(page.locator('.cart-item-row')).toHaveCount(2); // 2 produits
    await page.locator('input#termsofservice').check();
    await page.locator('button#checkout').click();
    await wait(2000);
    
    // Utiliser l'adresse de facturation existante (onepagecheckout)
    await page.getByRole('button', { name: 'Continue' }).first().click();
    await wait(2000);
    
    // Utiliser la même adresse pour la livraison
    await page.getByRole('button', { name: 'Continue' }).first().click();
    await wait(2000);
    
    // Vérifier que les méthodes de livraison sont disponibles
    const methods = await getAvailableShippingMethods(page);
    expect(methods.length).toBe(3);
    
    // Sélectionner Next Day Air
    await selectShippingMethod(page, 1);
    
    // Payment
    await selectPaymentMethod(page, 0);
    
    // Continuer
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(2000);
    
    // Confirm
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await wait(3000);
    
    // Vérifier
    await expect(page.locator('.order-completed')).toBeVisible();
    console.log('✅ Order with multiple physical products completed');
  });
});
