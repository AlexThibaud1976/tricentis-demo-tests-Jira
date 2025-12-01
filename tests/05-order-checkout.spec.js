const { test, expect } = require('../test-fixtures');
const { createAccount, login, clearCart, wait, addProductToCart } = require('../utils/helpers');

test.describe('Tests de passage de commande', () => {
  let testUser;

  test.afterEach(async ({ page }) => {
    if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
      try { await page.context().close(); } catch (e) {}
    }
  });

  test.beforeEach(async ({ browser }) => {
    // Créer un compte pour les tests de commande
    const context = await browser.newContext();
    const page = await context.newPage();
    testUser = await createAccount(page);
    await context.close();
    console.log(`✅ Compte créé pour les tests de commande: ${testUser.email}`);
  });

  test.beforeEach(async ({ page }) => {
    // Se connecter et vider le panier avant chaque test
    await login(page, testUser.email, testUser.password);
    await clearCart(page);
  });

  test('Test 10: Passage de commande complet - Cas passant ✅', async ({ page }) => {
    // Aller dans la catégorie Books
    await page.goto('/books');
    await page.waitForSelector('.product-grid .product-item', { state: 'visible', timeout: 10000 });
    
    // Récupérer le nom du premier livre disponible
    const firstBook = page.locator('.product-grid .product-item').first();
    const productName = await firstBook.locator('.product-title a').textContent();
    console.log(`📖 Livre sélectionné: ${productName.trim()}`);
    
    // Ajouter le livre au panier
    await firstBook.locator('input[value="Add to cart"]').click();
    await wait(2000);
    
    // Aller au panier et vérifier
    await page.goto('/cart');
    await expect(page.locator('.cart-item-row')).toBeVisible();
    console.log('✅ Livre ajouté au panier');
    
    // Accepter les conditions de service et procéder au checkout
    await page.locator('input#termsofservice').check();
    await page.locator('button#checkout').click();
    
    // Attendre que le formulaire de facturation soit visible (plus fiable que l'URL)
    await page.waitForSelector('select#BillingNewAddress_CountryId, #billing-buttons-container', { state: 'visible', timeout: 15000 });
    console.log('✅ Page de checkout chargée (formulaire de facturation détecté)');
    
    // === Étape 1: Adresse de facturation ===
    await page.locator('select#BillingNewAddress_CountryId').selectOption({ label: 'France' });
    await wait(500);
    await page.locator('input#BillingNewAddress_City').fill('Paris');
    await page.locator('input#BillingNewAddress_Address1').fill('123 Rue de la Paix');
    await page.locator('input#BillingNewAddress_ZipPostalCode').fill('75001');
    await page.locator('input#BillingNewAddress_PhoneNumber').fill('0123456789');
    await page.locator('#billing-buttons-container input[value="Continue"]').click();
    await wait(1500);
    console.log('✅ Adresse de facturation remplie');
    
    // === Étape 2: Adresse de livraison (même adresse) ===
    await page.locator('#shipping-buttons-container input[value="Continue"]').click();
    await wait(1500);
    console.log('✅ Adresse de livraison confirmée');
    
    // === Étape 3: Méthode de livraison ===
    await page.locator('input#shippingoption_0').check();
    await page.locator('#shipping-method-buttons-container input[value="Continue"]').click();
    await wait(1500);
    console.log('✅ Méthode de livraison sélectionnée');
    
    // === Étape 4: Méthode de paiement (Cash On Delivery) ===
    await page.locator('input#paymentmethod_0').check();
    await page.locator('#payment-method-buttons-container input[value="Continue"]').click();
    await wait(1500);
    console.log('✅ Méthode de paiement sélectionnée');
    
    // === Étape 5: Informations de paiement ===
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(1500);
    console.log('✅ Informations de paiement confirmées');
    
    // === Étape 6: Confirmation de commande ===
    await expect(page.locator('.product-name').first()).toContainText(productName.trim());
    console.log('✅ Récapitulatif vérifié');
    
    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    
    // Attendre la page de confirmation
    await page.waitForURL(/.*checkout\/completed/, { timeout: 15000 });
    await expect(page.locator('.title')).toContainText('Your order has been successfully processed!');
    
    const orderNumberText = await page.locator('.details li').first().textContent();
    console.log(`✅ ${orderNumberText.trim()}`);
    
    // Vérifier que le panier est vide
    await page.goto('/cart');
    const emptyMessage = page.locator('.order-summary-content');
    await expect(emptyMessage).toContainText('Your Shopping Cart is empty!');
    
    console.log('✅ Commande complète réussie - Panier vidé');
  });

  test('Test 10 bis: Tentative de checkout sans accepter les conditions - Cas non passant ❌', async ({ page }) => {
    // Ajouter un produit au panier (premier livre disponible)
    await page.goto('/books');
    await page.waitForSelector('.product-grid .product-item', { state: 'visible', timeout: 10000 });
    await addProductToCart(page, '/books', 0);
    await wait(500);

    // Aller au panier
    await page.goto('/cart');
    await expect(page.locator('.cart-item-row')).toBeVisible();

    // NE PAS cocher les conditions de service
    // Enregistrer l'attente d'un dialog avant de cliquer sur Checkout
    let dialogHandled = false;
    const dialogPromise = page.waitForEvent('dialog', { timeout: 2000 }).then(async dialog => {
      expect(dialog.message()).toContain('agree');
      await dialog.accept();
      dialogHandled = true;
      console.log('✅ Alerte détectée: conditions non acceptées');
    }).catch(() => null);

    // Tenter de cliquer sur Checkout
    await page.locator('button#checkout').click();

    // Attendre la résolution du possible dialog ou un bref délai
    await dialogPromise;

    // Si aucun dialog, s'assurer qu'on reste sur la page panier
    if (!dialogHandled) {
      await wait(500);
      await expect(page).toHaveURL(/.*cart/);
      console.log('✅ Pas de dialog, reste sur la page panier comme attendu');
    }

    console.log('✅ Le système empêche le checkout sans accepter les conditions');
  });

  test('Test 10 ter: Commande avec plusieurs produits - Cas passant ✅', async ({ page }) => {
    // Ajouter deux livres (les deux premiers disponibles)
    await page.goto('/books');
    await page.waitForSelector('.product-grid .product-item', { state: 'visible', timeout: 10000 });
    await addProductToCart(page, '/books', 0);
    await wait(500);
    await addProductToCart(page, '/books', 1);
    await wait(500);

    // Aller au panier
    await page.goto('/cart');
  

    // Vérifier qu'il y a au moins 2 produits
    const cartItems = await page.locator('.cart-item-row').count();
    expect(cartItems).toBeGreaterThanOrEqual(2);

    // Récupérer le total (diagnostic)
    const totalText = await (page.locator('.product-price').first()).textContent();
    console.log(`Total de la commande: ${totalText}`);

    // Accepter les conditions et procéder au checkout
    await page.locator('input#termsofservice').check();
    await page.locator('button#checkout').click();

    // Attendre que le formulaire de facturation soit visible (même approche robuste que Test 10)
    await page.waitForSelector('select#BillingNewAddress_CountryId, #billing-buttons-container', { state: 'visible', timeout: 15000 });
    console.log('✅ Page de checkout chargée (formulaire de facturation détecté)');

    // Processus de checkout (mêmes étapes que Test 10)
    await page.locator('select#BillingNewAddress_CountryId').selectOption({ label: 'France' });
    await wait(500);
    await page.locator('input#BillingNewAddress_City').fill('Lyon');
    await page.locator('input#BillingNewAddress_Address1').fill('456 Avenue Test');
    await page.locator('input#BillingNewAddress_ZipPostalCode').fill('69001');
    await page.locator('input#BillingNewAddress_PhoneNumber').fill('0987654321');
    await page.locator('#billing-buttons-container input[value="Continue"]').click();
    await wait(1000);
    await page.locator('#shipping-buttons-container input[value="Continue"]').click();
    await wait(1000);
    await page.locator('input#shippingoption_0').check();
    await page.locator('#shipping-method-buttons-container input[value="Continue"]').click();
    await wait(1000);
    await page.locator('input#paymentmethod_0').check();
    await page.locator('#payment-method-buttons-container input[value="Continue"]').click();
    await wait(1000);
    await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
    await wait(1000);

    // Vérifier que les produits sont dans le récapitulatif
    const confirmItems = await page.locator('.product-name').count();
    expect(confirmItems).toBeGreaterThanOrEqual(2);

    await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
    await page.waitForURL(/.*checkout\/completed/, { timeout: 15000 });
    await expect(page.locator('.title')).toContainText('Your order has been successfully processed!');

    console.log('✅ Commande avec plusieurs produits réussie');
  });
});
