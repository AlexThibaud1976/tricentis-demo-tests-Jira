/**
 * Fonctions utilitaires pour les tests Playwright
 */

const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Dossier pour stocker les screenshots d'evidence
const EVIDENCE_DIR = 'test-results/evidence';

/**
 * Prend une capture d'écran et l'attache comme evidence pour Xray
 * @param {Page} page - Page Playwright
 * @param {TestInfo} testInfo - Info du test en cours
 * @param {string} name - Nom descriptif de la capture
 * @returns {Promise<string>} - Chemin du fichier screenshot
 */
async function captureEvidence(page, testInfo, name) {
  // Créer le dossier evidence si nécessaire
  if (!fs.existsSync(EVIDENCE_DIR)) {
    fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
  }
  
  // Générer un nom de fichier unique
  const timestamp = Date.now();
  const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
  const testKey = testInfo.annotations.find(a => a.type === 'test_key')?.description || 'unknown';
  const filename = `${testKey}_${sanitizedName}_${timestamp}.png`;
  const filepath = path.join(EVIDENCE_DIR, filename);
  
  try {
    // Prendre la capture d'écran (viewport uniquement pour éviter timeouts sur BrowserStack)
    await page.screenshot({ 
      path: filepath, 
      fullPage: false,
      timeout: 5000
    });
    
    // Attacher au rapport Playwright
    await testInfo.attach(name, { path: filepath, contentType: 'image/png' });
    
    console.log(`📸 Evidence captured: ${name}`);
  } catch (error) {
    console.error(`❌ Screenshot failed: ${error.message}`);
  }
  
  return filepath;
}

/**
 * Effectue une vérification avec capture d'écran automatique
 * @param {Page} page - Page Playwright
 * @param {TestInfo} testInfo - Info du test en cours
 * @param {Function} assertion - Fonction d'assertion à exécuter
 * @param {string} evidenceName - Nom de l'evidence
 */
async function verifyWithEvidence(page, testInfo, assertion, evidenceName) {
  // Exécuter l'assertion
  await assertion();
  
  // Capturer l'evidence après la vérification réussie
  await captureEvidence(page, testInfo, evidenceName);
}

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
  
  // Wait for success notification to confirm product was added
  const successNotification = page.locator('.bar-notification.success');
  await successNotification.waitFor({ state: 'visible', timeout: 10000 });
  await wait(1000);
}

/**
 * Obtient le nombre d'articles dans le panier
 */
async function getCartItemCount(page) {
  const cartQty = await page.locator('.cart-qty').textContent();
  const match = cartQty.match(/\((\d+)\)/);
  return match ? parseInt(match[1]) : 0;
}

/**
 * Assertion URL compatible desktop et mobile BrowserStack.
 * Utilise page.waitForURL (supporté) plutôt que expect(page).toHaveURL (non supporté mobile).
 */
async function assertUrl(page, expected, timeoutMs = 10000) {
  const waitOptions = { timeout: timeoutMs, waitUntil: 'networkidle' };

  try {
    await page.waitForURL(expected, waitOptions);
  } catch (err) {
    const current = page.url();
    throw new Error(
      `URL mismatch. Expected ${expected} but got ${current}. Original: ${err.message}`
    );
  }
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
  getCartItemCount,
  assertUrl,
  captureEvidence,
  verifyWithEvidence,
  EVIDENCE_DIR
};
