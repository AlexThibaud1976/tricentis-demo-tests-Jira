/**
 * Fonctions utilitaires pour les tests Playwright
 */

/**
 * Génère un timestamp unique
 */
function getTimestamp() {
  return Date.now();
}

/**
 * Génère des données utilisateur uniques
 */
function generateUserData() {
  const timestamp = getTimestamp();
  return {
    firstName: `TestUser_${timestamp}`,
    lastName: `AutoTest_${timestamp}`,
    email: `testuser_${timestamp}@test.com`,
    password: 'Test@123456'
  };
}

/**
 * Attend un délai en millisecondes
 */
async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Vide le panier en supprimant tous les articles
 */
async function clearCart(page) {
  await page.goto('/cart');
  
  // Vérifie si le panier contient des éléments
  const cartItems = await page.locator('.cart-item-row').count();
  
  if (cartItems > 0) {
    // Coche toutes les cases "Remove"
    const removeCheckboxes = await page.locator('input[name="removefromcart"]');
    const count = await removeCheckboxes.count();
    
    for (let i = 0; i < count; i++) {
      await removeCheckboxes.nth(i).check();
    }
    
    // Clique sur "Update shopping cart"
    await page.locator('input[name="updatecart"]').click();
    await page.waitForLoadState('networkidle');
  }
}

/**
 * Crée un compte utilisateur et retourne les credentials
 */
async function createAccount(page) {
  const userData = generateUserData();
  
  await page.goto('/register');
  await page.locator('input#gender-male').check();
  await page.locator('input#FirstName').fill(userData.firstName);
  await page.locator('input#LastName').fill(userData.lastName);
  await page.locator('input#Email').fill(userData.email);
  await page.locator('input#Password').fill(userData.password);
  await page.locator('input#ConfirmPassword').fill(userData.password);
  await page.locator('input#register-button').click();
  
  await page.waitForSelector('.result', { timeout: 10000 });
  
  return userData;
}

/**
 * Connexion avec des credentials
 */
async function login(page, email, password) {
  await page.goto('/login');
  await page.locator('input#Email').fill(email);
  await page.locator('input#Password').fill(password);
  await page.locator('.button-1.login-button').click();
  await page.waitForLoadState('networkidle');
}

/**
 * Déconnexion
 */
async function logout(page) {
  await page.locator('a.ico-logout').click();
  await page.waitForLoadState('networkidle');
}

/**
 * Ajoute un produit au panier depuis une catégorie
 */
async function addProductToCart(page, categoryUrl, productIndex = 0) {
  await page.goto(categoryUrl);
  const addToCartButton = page.locator('.product-item input[value="Add to cart"]').nth(productIndex);
  await addToCartButton.click();
  await wait(2000); // Attendre la mise à jour du panier
}

/**
 * Obtient le nombre d'articles dans le panier
 */
async function getCartItemCount(page) {
  const cartQty = await page.locator('.cart-qty').textContent();
  const match = cartQty.match(/\((\d+)\)/);
  return match ? parseInt(match[1]) : 0;
}

module.exports = {
  getTimestamp,
  generateUserData,
  wait,
  clearCart,
  createAccount,
  login,
  logout,
  addProductToCart,
  getCartItemCount
};
