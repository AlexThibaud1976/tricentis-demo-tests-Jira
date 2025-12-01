const { test, expect } = require('../test-fixtures');
const { wait, clearCart, getCartItemCount, addProductToCart } = require('../utils/helpers');

test.describe('Tests de gestion du panier', () => {

  test.afterEach(async ({ page }) => {
    if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
      try { await page.context().close(); } catch (e) {}
    }
  });

  test.beforeEach(async ({ page }) => {
    // Vider le panier avant chaque test
    await clearCart(page);
  });

  test('Test 7: Ajout d\'un produit au panier - Cas passant ✅', async ({ page }) => {
    // Naviguer vers la catégorie Books
    await page.goto('/books');
    
    // Vérifier le compteur initial du panier
    const initialCount = await getCartItemCount(page);
    console.log(`Compteur panier initial: ${initialCount}`);
    
    // Récupérer le nom du premier produit
    const productName = await page.locator('.product-grid .product-item').first().locator('.product-title a').textContent();
    console.log(`Ajout du produit: ${productName.trim()}`);

    // Ajouter le premier produit au panier (utilise le helper qui gère la navigation et le click)
    await addProductToCart(page, '/books', 0);

    // Attendre activement que le compteur du panier augmente
    const start = Date.now();
    let newCount = await getCartItemCount(page);
    while (newCount === initialCount && Date.now() - start < 8000) {
      await wait(250);
      newCount = await getCartItemCount(page);
    }
    expect(newCount).toBe(initialCount + 1);
    console.log(`✅ Compteur panier mis à jour: ${newCount}`);
    
    // Aller sur la page du panier
    await (page.locator('a.ico-cart').first()).click();
    
    // Vérifier que le produit est dans le panier
    await expect(page.locator('.cart-item-row')).toBeVisible();
    await expect(page.locator('.product-name')).toContainText(productName.trim());
    
    // Vérifier que la quantité est 1
    const quantity = await page.locator('.qty-input').first().inputValue();
    expect(quantity).toBe('1');
    
    // Vérifier que le prix est affiché
    await expect(page.locator('.product-unit-price')).toBeVisible();
    
    console.log('✅ Produit ajouté avec succès au panier');
  });

  test('Test 8: Ajout de plusieurs produits au panier - Cas passant ✅', async ({ page }) => {
    // Ajouter un premier livre
    await page.goto('/books');
    await addProductToCart(page, '/books', 0);
    await wait(500);

    // Ajouter un deuxième livre
    await addProductToCart(page, '/books', 1);
    await wait(500);

    /// Ajouter un Troisième livre
    await addProductToCart(page, '/books', 2);
    await wait(500);

    // Vérifier le compteur du panier (attendre qu'il atteigne 3)
    const start2 = Date.now();
    let cartCount = await getCartItemCount(page);
    while (cartCount < 3 && Date.now() - start2 < 8000) {
      await wait(250);
      cartCount = await getCartItemCount(page);
    }
    expect(cartCount).toBeGreaterThanOrEqual(3);
    console.log(`✅ Compteur panier: ${cartCount}`);
    
    // Aller sur la page du panier
    await (page.locator('a.ico-cart').first()).click();
    
    // Vérifier qu'il y a 3 lignes dans le panier
    const cartItems = await page.locator('.cart-item-row').count();
    expect(cartItems).toBe(3);
    
    // Vérifier que le total est calculé
    await expect(page.locator('.product-price').first()).toBeVisible();
    
    console.log('✅ Trois produits différents ajoutés avec succès');
  });

  test('Test 9: Modification de la quantité dans le panier - Cas passant ✅', async ({ page }) => {
    // Ajouter un produit au panier
    await page.goto('/books');
    
    const productName = await page.locator('.product-grid .product-item').first().locator('.product-title a').textContent();
    await addProductToCart(page, '/books', 0);
    await wait(500);
    
    // Aller sur la page du panier
    await page.goto('/cart');
    
    // Récupérer le prix unitaire
    const unitPriceText = await page.locator('.product-unit-price').first().textContent();
    const unitPrice = parseFloat(unitPriceText.replace(/[^\d.]/g, ''));
    console.log(`Prix unitaire: ${unitPrice}`);
    
    // Modifier la quantité à 3
    await page.locator('.qty-input').first().clear();
    await page.locator('.qty-input').first().fill('3');
    
    // Cliquer sur "Update shopping cart"
    await page.locator('input[name="updatecart"]').click();
    await page.waitForLoadState('networkidle');
    
    // Vérifier que la quantité a été mise à jour
    const updatedQuantity = await page.locator('.qty-input').first().inputValue();
    expect(updatedQuantity).toBe('3');
    
    // Vérifier que le sous-total est correct (prix unitaire × 3)
    const subtotalText = await page.locator('.product-subtotal').first().textContent();
    const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, ''));
    
    const expectedSubtotal = unitPrice * 3;
    expect(Math.abs(subtotal - expectedSubtotal)).toBeLessThan(0.01); // Tolérance pour les arrondis
    
    console.log(`✅ Quantité mise à jour: 3, Sous-total: ${subtotal}`);
  });

  test('Test 9 bis: Suppression d\'un produit du panier - Cas passant ✅', async ({ page }) => {
    // Ajouter deux produits
    await page.goto('/books');
    await addProductToCart(page, '/books', 0);
    await wait(500);
    await addProductToCart(page, '/books', 1);
    await wait(500);
    
    // Aller sur la page du panier
    await page.goto('/cart');
    
    // Vérifier qu'il y a 2 produits
    let cartItems = await page.locator('.cart-item-row').count();
    expect(cartItems).toBe(2);
    
    // Cocher la case "Remove" du premier produit
    await page.locator('input[name="removefromcart"]').first().check();
    
    // Mettre à jour le panier
    await page.locator('input[name="updatecart"]').click();
    await page.waitForLoadState('networkidle');
    
    // Vérifier qu'il ne reste qu'un produit
    cartItems = await page.locator('.cart-item-row').count();
    expect(cartItems).toBe(1);
    
    console.log('✅ Produit supprimé avec succès du panier');
  });

  test('Test 9 ter: Vider complètement le panier - Cas passant ✅', async ({ page }) => {
    // Ajouter un produit
    await page.goto('/books');
    await addProductToCart(page, '/books', 0);
    await wait(500);
    
    // Vider le panier en utilisant la fonction helper
    await clearCart(page);
    
    // Vérifier que le panier est vide
    const emptyCartMessage = page.locator('.order-summary-content');
    await expect(emptyCartMessage).toContainText('Your Shopping Cart is empty!');
    
    // Vérifier que le compteur est à 0
    const cartCount = await getCartItemCount(page);
    expect(cartCount).toBe(0);
    
    console.log('✅ Panier vidé complètement');
  });
});
