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

/**
 * ==============================================================================
 * CHECKOUT HELPERS - Shipping & Payment Methods
 * ==============================================================================
 */

/**
 * Sélectionner une méthode de livraison et continuer
 * @param {Page} page - Page Playwright
 * @param {number} index - Index de la méthode (0=Ground, 1=Next Day Air, 2=2nd Day Air)
 * @returns {Promise<string>} - Label de la méthode sélectionnée
 */
async function selectShippingMethod(page, index) {
  // Vérifier que l'option existe
  const option = page.locator(`input#shippingoption_${index}`);
  await expect(option).toBeVisible({ timeout: 10000 });
  
  // Récupérer le label avant de sélectionner
  const labels = await page.locator(`label[for="shippingoption_${index}"]`).all();
  const labelText = labels.length > 0 ? await labels[labels.length - 1].textContent() : '';
  
  // Sélectionner l'option
  await option.check();
  await wait(500);
  
  // Cliquer sur Continue
  await page.locator('#shipping-method-buttons-container input[value="Continue"]').click();
  await wait(2000);
  
  console.log(`✅ Shipping method selected: ${labelText.trim()}`);
  return labelText.trim();
}

/**
 * Obtenir toutes les méthodes de livraison disponibles
 * @param {Page} page - Page Playwright  
 * @returns {Promise<Array>} - Liste des méthodes {index, id, label, price}
 */
async function getAvailableShippingMethods(page) {
  await page.waitForSelector('input[name="shippingoption"]', { timeout: 10000 });
  const options = await page.locator('input[name="shippingoption"]').all();
  
  const methods = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const id = await option.getAttribute('id');
    const label = page.locator(`label[for="${id}"]`);
    const labelText = await label.textContent();
    
    // Extraire le prix du label (ex: "Ground (0.00)")
    const priceMatch = labelText.match(/\(([0-9.]+)\)/);
    const price = priceMatch ? priceMatch[1] : '0.00';
    
    methods.push({
      index: i,
      id,
      label: labelText.trim(),
      price
    });
  }
  
  return methods;
}

/**
 * Sélectionner un moyen de paiement et continuer
 * @param {Page} page - Page Playwright
 * @param {number} index - Index du moyen (0=COD, 1=CheckMoneyOrder, 2=CreditCard, 3=PO)
 * @returns {Promise<string>} - Label du moyen sélectionné
 */
async function selectPaymentMethod(page, index) {
  // Vérifier que l'option existe
  const option = page.locator(`input#paymentmethod_${index}`);
  await expect(option).toBeVisible({ timeout: 10000 });
  
  // Récupérer le label avant de sélectionner
  const labels = await page.locator(`label[for="paymentmethod_${index}"]`).all();
  const labelText = labels.length > 0 ? await labels[labels.length - 1].textContent() : '';
  
  // Sélectionner l'option
  await option.check();
  await wait(500);
  
  // Cliquer sur Continue
  await page.locator('#payment-method-buttons-container input[value="Continue"]').click();
  await wait(2000);
  
  console.log(`✅ Payment method selected: ${labelText.trim()}`);
  return labelText.trim();
}

/**
 * Obtenir tous les moyens de paiement disponibles
 * @param {Page} page - Page Playwright
 * @returns {Promise<Array>} - Liste des moyens {index, id, label}
 */
async function getAvailablePaymentMethods(page) {
  await page.waitForSelector('input[name="paymentmethod"]', { timeout: 10000 });
  const options = await page.locator('input[name="paymentmethod"]').all();
  
  const methods = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const id = await option.getAttribute('id');
    const labels = await page.locator(`label[for="${id}"]`).all();
    const labelText = labels.length > 0 ? await labels[labels.length - 1].textContent() : '';
    
    methods.push({
      index: i,
      id,
      label: labelText.trim()
    });
  }
  
  return methods;
}

/**
 * Remplir les informations de carte bancaire
 * @param {Page} page - Page Playwright
 * @param {string|Object} cardData - Nom de la carte ('visa', 'mastercard', etc.) ou objet {holderName, number, expMonth, expYear, cvv}
 * @param {TestInfo} testInfo - (Optionnel) Info du test pour capture d'écran
 * @param {string} evidenceName - (Optionnel) Nom de la capture d'écran
 * @returns {Promise<Object>} - Carte utilisée
 */
/**
 * Cartes de test Adyen
 * Source: https://docs.adyen.com/development-resources/test-cards-and-credentials/test-card-numbers
 */
const TEST_CARDS = {
  visa: { holderName: 'Visa Test', number: '4111111111111111', expMonth: '12', expYear: '2027', cvv: '737', type: 'Visa' },
  mastercard: { holderName: 'Mastercard Test', number: '5555555555554444', expMonth: '12', expYear: '2027', cvv: '737', type: 'Mastercard' },
  amex: { holderName: 'Amex Test', number: '370000000000002', expMonth: '12', expYear: '2027', cvv: '7373', type: 'American Express' },
  discover: { holderName: 'Discover Test', number: '6011601160116611', expMonth: '12', expYear: '2027', cvv: '737', type: 'Discover' },
  diners: { holderName: 'Diners Test', number: '36006666333344', expMonth: '12', expYear: '2027', cvv: '737', type: 'Diners Club' },
  jcb: { holderName: 'JCB Test', number: '3569990010095841', expMonth: '12', expYear: '2027', cvv: '737', type: 'JCB' }
};

async function fillCreditCardInfo(page, cardData = {}, testInfo = null, evidenceName = null) {
  let card;
  if (typeof cardData === 'string') {
    card = TEST_CARDS[cardData.toLowerCase()] || TEST_CARDS.visa;
  } else {
    card = { ...TEST_CARDS.visa, ...cardData };
  }
  
  // Remplir les champs
  await page.locator('input#CardholderName').fill(card.holderName);
  await page.locator('input#CardNumber').fill(card.number);
  await page.locator('select#ExpireMonth').selectOption(card.expMonth);
  await page.locator('select#ExpireYear').selectOption(card.expYear);
  await page.locator('input#CardCode').fill(card.cvv);
  
  // Attendre un peu que les champs soient bien remplis
  await wait(500);
  
  // Vérifier que les champs sont bien remplis
  await expect(page.locator('input#CardholderName')).toHaveValue(card.holderName);
  await expect(page.locator('input#CardNumber')).toHaveValue(card.number);
  await expect(page.locator('input#CardCode')).toHaveValue(card.cvv);
  
  console.log(`✅ Credit card info filled: ${card.type || card.holderName}`);
  
  // Prendre une capture d'écran si testInfo est fourni
  if (testInfo) {
    const screenshotName = evidenceName || `Carte_${card.type}_completee`;
    await captureEvidence(page, testInfo, screenshotName);
  }
  
  return card;
}

/**
 * Remplir un numéro de Purchase Order
 * @param {Page} page - Page Playwright
 * @param {string} poNumber - Numéro de PO
 */
async function fillPurchaseOrder(page, poNumber = 'PO-TEST-001') {
  await page.locator('input#PurchaseOrderNumber').fill(poNumber);
  console.log(`✅ Purchase Order filled: ${poNumber}`);
}

/**
 * Remplir une adresse de livraison différente
 * @param {Page} page - Page Playwright
 * @param {Object} addressData - Données d'adresse
 */
async function fillShippingAddress(page, addressData = {}) {
  const defaultAddress = {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    country: 'United States',
    city: 'Los Angeles',
    address1: '456 Shipping Ave',
    zip: '90001',
    phone: '5559876543'
  };
  
  const address = { ...defaultAddress, ...addressData };
  
  // Décocher "Ship to same address"
  const sameAddressCheckbox = page.locator('input#ShipToSameAddress');
  const isChecked = await sameAddressCheckbox.isChecked();
  if (isChecked) {
    await sameAddressCheckbox.uncheck();
    await wait(1000);
  }
  
  // Remplir les champs
  await page.locator('select#ShippingNewAddress_CountryId').selectOption({ label: address.country });
  await wait(500);
  await page.locator('input#ShippingNewAddress_City').fill(address.city);
  await page.locator('input#ShippingNewAddress_Address1').fill(address.address1);
  await page.locator('input#ShippingNewAddress_ZipPostalCode').fill(address.zip);
  await page.locator('input#ShippingNewAddress_PhoneNumber').fill(address.phone);
  
  console.log(`✅ Shipping address filled: ${address.address1}, ${address.city}`);
}

/**
 * Effectuer un checkout complet avec options personnalisées
 * @param {Page} page - Page Playwright
 * @param {Object} options - Options de checkout {shippingMethodIndex, paymentMethodIndex, differentShipping, cardData, poNumber}
 */
async function completeCheckout(page, options = {}) {
  const {
    shippingMethodIndex = 0,
    paymentMethodIndex = 0,
    differentShipping = false,
    cardData = null,
    poNumber = null
  } = options;
  
  // Aller au panier
  await page.goto('/cart');
  await expect(page.locator('.cart-item-row')).toBeVisible();
  
  // Accepter TOS et checkout
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
  
  // Adresse de livraison
  if (differentShipping) {
    await fillShippingAddress(page);
  }
  await page.locator('#shipping-buttons-container input[value="Continue"]').click();
  await wait(2000);
  
  // Méthode de livraison
  await selectShippingMethod(page, shippingMethodIndex);
  
  // Moyen de paiement
  await selectPaymentMethod(page, paymentMethodIndex);
  
  // Informations de paiement spécifiques
  if (paymentMethodIndex === 2 && cardData) {
    // Credit Card
    await fillCreditCardInfo(page, cardData);
  } else if (paymentMethodIndex === 3 && poNumber) {
    // Purchase Order
    await fillPurchaseOrder(page, poNumber);
  }
  
  // Continue to confirm
  await page.locator('#payment-info-buttons-container input[value="Continue"]').click();
  await wait(2000);
  
  // Confirm order
  await page.locator('#confirm-order-buttons-container input[value="Confirm"]').click();
  await wait(3000);
  
  // Vérifier la confirmation
  await expect(page.locator('.order-completed')).toBeVisible();
  console.log('✅ Order completed successfully');
}

module.exports = {
  getTimestamp,
  generateUserData,
  wait,
  clearCart,
  createAccount,
  login,
  logout,
  TEST_CARDS,
  addProductToCart,
  getCartItemCount,
  assertUrl,
  captureEvidence,
  verifyWithEvidence,
  selectShippingMethod,
  getAvailableShippingMethods,
  selectPaymentMethod,
  getAvailablePaymentMethods,
  fillCreditCardInfo,
  fillPurchaseOrder,
  fillShippingAddress,
  completeCheckout,
  EVIDENCE_DIR
};


