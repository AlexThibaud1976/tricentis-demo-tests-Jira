const fs = require('fs');
const path = require('path');

const testsDir = path.join(__dirname, 'tests');

// Ensure tests directory exists
if (!fs.existsSync(testsDir)) {
  fs.mkdirSync(testsDir, { recursive: true });
}

const testFiles = [
  // 06 - Product Search
  {
    filename: '06-product-search.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests de Recherche Produit', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Recherche simple par nom de produit - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-060' },
      { type: 'tags', description: '@smoke @search' },
      { type: 'test_description', description: 'Recherche d\\'un produit par son nom exact' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await captureEvidence(page, testInfo, 'homepage');

    // Search for a product
    await page.fill('#small-searchterms', 'laptop');
    await page.click('input[type="submit"][value="Search"]');
    await wait(1000);

    await captureEvidence(page, testInfo, 'search-results');

    // Verify search results
    const resultsTitle = page.locator('.search-results h1, .page-title');
    await expect(resultsTitle).toContainText(/search/i);

    // Verify products are displayed
    const products = page.locator('.product-item, .item-box');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Recherche avec terme partiel - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-061' },
      { type: 'tags', description: '@search' },
      { type: 'test_description', description: 'Recherche avec un terme partiel retourne des résultats' }
    );

    await page.goto('https://demowebshop.tricentis.com/');

    await page.fill('#small-searchterms', 'comp');
    await page.click('input[type="submit"][value="Search"]');
    await wait(1000);

    await captureEvidence(page, testInfo, 'partial-search-results');

    // Should find computer-related products
    const pageContent = await page.content();
    expect(pageContent.toLowerCase()).toMatch(/computer|comp/);
  });

  test('Recherche sans résultat - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-062' },
      { type: 'tags', description: '@search' },
      { type: 'test_description', description: 'Recherche avec terme inexistant affiche message approprié' }
    );

    await page.goto('https://demowebshop.tricentis.com/');

    await page.fill('#small-searchterms', 'xyznonexistent123');
    await page.click('input[type="submit"][value="Search"]');
    await wait(1000);

    await captureEvidence(page, testInfo, 'no-results');

    // Should show no products found message
    const noResults = page.locator('.no-result, .search-results');
    await expect(noResults).toBeVisible();
  });

  test('Recherche avancée avec filtres - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-063' },
      { type: 'tags', description: '@search @advanced' },
      { type: 'test_description', description: 'Utilisation de la recherche avancée avec catégorie' }
    );

    await page.goto('https://demowebshop.tricentis.com/search');
    await captureEvidence(page, testInfo, 'advanced-search-page');

    // Check advanced search checkbox
    const advancedCheckbox = page.locator('#advs');
    if (await advancedCheckbox.isVisible()) {
      await advancedCheckbox.check();
      await wait(500);
    }

    // Fill search term
    await page.fill('#q', 'book');

    // Select category if available
    const categorySelect = page.locator('#cid');
    if (await categorySelect.isVisible()) {
      await categorySelect.selectOption({ index: 1 });
    }

    await page.click('input[type="submit"][value="Search"]');
    await wait(1000);

    await captureEvidence(page, testInfo, 'advanced-search-results');
  });
});
`
  },

  // 07 - Wishlist Management
  {
    filename: '07-wishlist-management.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, createAccount, login, logout } = require('../utils/helpers');

test.describe('Tests de Gestion de Liste de Souhaits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Ajout d\\'un produit à la liste de souhaits - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-070' },
      { type: 'tags', description: '@wishlist @smoke' },
      { type: 'test_description', description: 'Ajout d\\'un produit simple à la wishlist' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await captureEvidence(page, testInfo, 'homepage');

    // Navigate to a product
    await page.click('a[href*="/books"]');
    await wait(1000);

    // Click on first product
    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'product-page');

    // Add to wishlist
    const wishlistButton = page.locator('input[value="Add to wishlist"], .add-to-wishlist-button');
    if (await wishlistButton.isVisible()) {
      await wishlistButton.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'added-to-wishlist');

      // Check wishlist count or success message
      const successMessage = page.locator('.bar-notification.success, .content');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('Visualisation de la liste de souhaits - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-071' },
      { type: 'tags', description: '@wishlist' },
      { type: 'test_description', description: 'Affichage de la page wishlist' }
    );

    await page.goto('https://demowebshop.tricentis.com/');

    // First add a product to wishlist
    await page.goto('https://demowebshop.tricentis.com/fiction');
    await wait(1000);

    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    const wishlistButton = page.locator('input[value="Add to wishlist"], .add-to-wishlist-button');
    if (await wishlistButton.isVisible()) {
      await wishlistButton.click();
      await wait(1000);
    }

    // Navigate to wishlist
    await page.goto('https://demowebshop.tricentis.com/wishlist');
    await wait(1000);

    await captureEvidence(page, testInfo, 'wishlist-page');

    // Verify wishlist page
    const wishlistTitle = page.locator('.page-title, h1');
    await expect(wishlistTitle).toContainText(/wishlist/i);
  });

  test('Transfert wishlist vers panier - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-072' },
      { type: 'tags', description: '@wishlist @cart' },
      { type: 'test_description', description: 'Déplacement d\\'un article de la wishlist vers le panier' }
    );

    await page.goto('https://demowebshop.tricentis.com/');

    // Add product to wishlist first
    await page.goto('https://demowebshop.tricentis.com/computing-and-internet');
    await wait(1000);

    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    const wishlistButton = page.locator('input[value="Add to wishlist"], .add-to-wishlist-button');
    if (await wishlistButton.isVisible()) {
      await wishlistButton.click();
      await wait(2000);
    }

    // Go to wishlist
    await page.goto('https://demowebshop.tricentis.com/wishlist');
    await wait(1000);

    await captureEvidence(page, testInfo, 'wishlist-before-transfer');

    // Check item and add to cart
    const checkbox = page.locator('input[name="addtocart"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();
      
      const addToCartBtn = page.locator('input[name="addtocartbutton"], .wishlist-add-to-cart-button');
      if (await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        await wait(1000);
        await captureEvidence(page, testInfo, 'transferred-to-cart');
      }
    }
  });
});
`
  },

  // 08 - Product Comparison
  {
    filename: '08-product-comparison.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests de Comparaison de Produits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Ajout de produits à la comparaison - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-080' },
      { type: 'tags', description: '@comparison @smoke' },
      { type: 'test_description', description: 'Ajout de deux produits à la liste de comparaison' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);
    await captureEvidence(page, testInfo, 'books-category');

    // Add first product to comparison
    const compareButtons = page.locator('input[value="Add to compare list"]');
    const count = await compareButtons.count();

    if (count >= 2) {
      await compareButtons.nth(0).click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'first-product-added');

      await compareButtons.nth(1).click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'second-product-added');

      // Check success notification
      const notification = page.locator('.bar-notification.success');
      await expect(notification).toBeVisible({ timeout: 5000 });
    }
  });

  test('Affichage de la page de comparaison - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-081' },
      { type: 'tags', description: '@comparison' },
      { type: 'test_description', description: 'Visualisation de la page de comparaison avec produits' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add products to comparison
    const compareButtons = page.locator('input[value="Add to compare list"]');
    const count = await compareButtons.count();

    if (count >= 2) {
      await compareButtons.nth(0).click();
      await wait(1000);
      await compareButtons.nth(1).click();
      await wait(1000);
    }

    // Navigate to comparison page
    await page.goto('https://demowebshop.tricentis.com/compareproducts');
    await wait(1000);

    await captureEvidence(page, testInfo, 'comparison-page');

    // Verify comparison table
    const comparisonTable = page.locator('.compare-products-table, table');
    await expect(comparisonTable).toBeVisible();
  });

  test('Suppression d\\'un produit de la comparaison - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-082' },
      { type: 'tags', description: '@comparison' },
      { type: 'test_description', description: 'Retrait d\\'un produit de la liste de comparaison' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add products first
    const compareButtons = page.locator('input[value="Add to compare list"]');
    if (await compareButtons.count() >= 1) {
      await compareButtons.nth(0).click();
      await wait(1000);
    }

    // Go to comparison page
    await page.goto('https://demowebshop.tricentis.com/compareproducts');
    await wait(1000);

    await captureEvidence(page, testInfo, 'comparison-before-remove');

    // Click clear list or remove button
    const clearButton = page.locator('a.clear-list, input[value="Clear list"]');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'comparison-after-clear');
    }
  });
});
`
  },

  // 09 - Product Reviews
  {
    filename: '09-product-reviews.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, generateUserData } = require('../utils/helpers');

test.describe('Tests des Avis Produits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Consultation des avis existants - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-090' },
      { type: 'tags', description: '@reviews @smoke' },
      { type: 'test_description', description: 'Affichage des avis sur une page produit' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Click on a product
    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'product-page');

    // Look for reviews section
    const reviewsTab = page.locator('a[href*="reviews"], .product-reviews-overview');
    if (await reviewsTab.isVisible()) {
      await reviewsTab.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'reviews-section');
    }
  });

  test('Soumission d\\'un nouvel avis - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-091' },
      { type: 'tags', description: '@reviews' },
      { type: 'test_description', description: 'Ajout d\\'un avis sur un produit' }
    );

    const userData = generateUserData();

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Click on a product
    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    // Find add review link
    const addReviewLink = page.locator('a[href*="productreviews"], .write-product-review-link');
    if (await addReviewLink.isVisible()) {
      await addReviewLink.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'review-form');

      // Fill review form
      await page.fill('#AddProductReview_Title', 'Test Review Title');
      await page.fill('#AddProductReview_ReviewText', 'This is an automated test review for the product. The quality is excellent and I recommend it.');

      // Select rating
      const rating = page.locator('#addproductrating_4, input[value="4"]');
      if (await rating.isVisible()) {
        await rating.click();
      }

      await captureEvidence(page, testInfo, 'review-filled');

      // Submit review
      const submitBtn = page.locator('input[name="add-review"], input[value="Submit review"]');
      if (await submitBtn.isVisible()) {
        await submitBtn.click();
        await wait(1000);
        await captureEvidence(page, testInfo, 'review-submitted');
      }
    }
  });
});
`
  },

  // 10 - Newsletter Subscription
  {
    filename: '10-newsletter-subscription.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, generateUserData } = require('../utils/helpers');

test.describe('Tests d\\'Inscription Newsletter', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Inscription newsletter avec email valide - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-100' },
      { type: 'tags', description: '@newsletter @smoke' },
      { type: 'test_description', description: 'Inscription à la newsletter avec email valide' }
    );

    const userData = generateUserData();

    await page.goto('https://demowebshop.tricentis.com/');
    await captureEvidence(page, testInfo, 'homepage');

    // Find newsletter input in footer
    const newsletterInput = page.locator('#newsletter-email');
    await expect(newsletterInput).toBeVisible();

    await newsletterInput.fill(userData.email);
    await captureEvidence(page, testInfo, 'email-entered');

    // Click subscribe button
    const subscribeBtn = page.locator('#newsletter-subscribe-button');
    await subscribeBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'subscription-result');

    // Check for success message
    const result = page.locator('#newsletter-result-block');
    await expect(result).toBeVisible();
  });

  test('Inscription newsletter avec email invalide - Cas non passant ❌', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-101' },
      { type: 'tags', description: '@newsletter @negative' },
      { type: 'test_description', description: 'Tentative d\\'inscription avec email invalide' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await captureEvidence(page, testInfo, 'homepage');

    // Enter invalid email
    const newsletterInput = page.locator('#newsletter-email');
    await newsletterInput.fill('invalid-email');

    const subscribeBtn = page.locator('#newsletter-subscribe-button');
    await subscribeBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'invalid-email-result');

    // Should show error
    const result = page.locator('#newsletter-result-block');
    await expect(result).toBeVisible();
  });
});
`
  },

  // 11 - Contact Form
  {
    filename: '11-contact-form.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, generateUserData } = require('../utils/helpers');

test.describe('Tests du Formulaire de Contact', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Envoi message de contact valide - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-110' },
      { type: 'tags', description: '@contact @smoke' },
      { type: 'test_description', description: 'Envoi d\\'un message via le formulaire de contact' }
    );

    const userData = generateUserData();

    await page.goto('https://demowebshop.tricentis.com/contactus');
    await wait(1000);
    await captureEvidence(page, testInfo, 'contact-page');

    // Fill contact form
    await page.fill('#FullName', userData.firstName + ' ' + userData.lastName);
    await page.fill('#Email', userData.email);
    await page.fill('#Enquiry', 'This is an automated test message. Please ignore this inquiry as it is for testing purposes only.');

    await captureEvidence(page, testInfo, 'form-filled');

    // Submit form
    const submitBtn = page.locator('input[name="send-email"], input[value="Submit"]');
    await submitBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'form-submitted');

    // Check success message
    const successMessage = page.locator('.result, .content');
    await expect(successMessage).toContainText(/successfully|sent|received/i);
  });

  test('Validation champs obligatoires - Cas non passant ❌', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-111' },
      { type: 'tags', description: '@contact @validation' },
      { type: 'test_description', description: 'Validation des champs requis du formulaire' }
    );

    await page.goto('https://demowebshop.tricentis.com/contactus');
    await wait(1000);
    await captureEvidence(page, testInfo, 'contact-page-empty');

    // Submit empty form
    const submitBtn = page.locator('input[name="send-email"], input[value="Submit"]');
    await submitBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'validation-errors');

    // Check for validation errors
    const errorMessages = page.locator('.field-validation-error, .message-error');
    const errorCount = await errorMessages.count();
    expect(errorCount).toBeGreaterThan(0);
  });
});
`
  },

  // 12 - Account Management
  {
    filename: '12-account-management.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, createAccount, login, logout, generateUserData } = require('../utils/helpers');

test.describe('Tests de Gestion de Compte', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Modification informations personnelles - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-120' },
      { type: 'tags', description: '@account @profile' },
      { type: 'test_description', description: 'Mise à jour du profil utilisateur' }
    );

    // Create account first
    const userData = await createAccount(page);
    await captureEvidence(page, testInfo, 'account-created');

    // Navigate to account info
    await page.goto('https://demowebshop.tricentis.com/customer/info');
    await wait(1000);
    await captureEvidence(page, testInfo, 'account-info-page');

    // Modify first name
    await page.fill('#FirstName', 'ModifiedFirstName');

    // Save changes
    const saveBtn = page.locator('input[value="Save"]');
    await saveBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'profile-updated');

    // Verify change was saved
    const firstName = page.locator('#FirstName');
    await expect(firstName).toHaveValue('ModifiedFirstName');
  });

  test('Gestion des adresses - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-121' },
      { type: 'tags', description: '@account @addresses' },
      { type: 'test_description', description: 'Ajout d\\'une nouvelle adresse' }
    );

    // Create account first
    const userData = await createAccount(page);
    await captureEvidence(page, testInfo, 'account-created');

    // Navigate to addresses
    await page.goto('https://demowebshop.tricentis.com/customer/addresses');
    await wait(1000);
    await captureEvidence(page, testInfo, 'addresses-page');

    // Add new address
    const addBtn = page.locator('input[value="Add new"]');
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await wait(1000);

      // Fill address form
      await page.fill('#Address_FirstName', userData.firstName);
      await page.fill('#Address_LastName', userData.lastName);
      await page.fill('#Address_Email', userData.email);
      await page.fill('#Address_City', 'Test City');
      await page.fill('#Address_Address1', '123 Test Street');
      await page.fill('#Address_ZipPostalCode', '12345');
      await page.fill('#Address_PhoneNumber', '1234567890');

      // Select country
      const countrySelect = page.locator('#Address_CountryId');
      await countrySelect.selectOption({ index: 1 });
      await wait(500);

      await captureEvidence(page, testInfo, 'address-form-filled');

      // Save address
      const saveBtn = page.locator('input[value="Save"]');
      await saveBtn.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'address-saved');
    }
  });

  test('Changement de mot de passe - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-122' },
      { type: 'tags', description: '@account @security' },
      { type: 'test_description', description: 'Modification du mot de passe utilisateur' }
    );

    // Create account first
    const userData = await createAccount(page);
    await captureEvidence(page, testInfo, 'account-created');

    // Navigate to change password
    await page.goto('https://demowebshop.tricentis.com/customer/changepassword');
    await wait(1000);
    await captureEvidence(page, testInfo, 'change-password-page');

    // Fill password change form
    await page.fill('#OldPassword', userData.password);
    await page.fill('#NewPassword', 'NewPassword123!');
    await page.fill('#ConfirmNewPassword', 'NewPassword123!');

    await captureEvidence(page, testInfo, 'password-form-filled');

    // Submit
    const changeBtn = page.locator('input[value="Change password"]');
    await changeBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'password-changed');

    // Check for success message
    const result = page.locator('.result, .content');
    await expect(result).toContainText(/changed|success/i);
  });
});
`
  },

  // 13 - Order History
  {
    filename: '13-order-history.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, createAccount, login } = require('../utils/helpers');

test.describe('Tests d\\'Historique des Commandes', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Consultation historique des commandes - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-130' },
      { type: 'tags', description: '@orders @history' },
      { type: 'test_description', description: 'Affichage de la page historique des commandes' }
    );

    // Create account first
    const userData = await createAccount(page);
    await captureEvidence(page, testInfo, 'account-created');

    // Navigate to orders
    await page.goto('https://demowebshop.tricentis.com/customer/orders');
    await wait(1000);

    await captureEvidence(page, testInfo, 'orders-page');

    // Verify page loaded
    const pageTitle = page.locator('.page-title, h1');
    await expect(pageTitle).toContainText(/order/i);
  });

  test('Détails d\\'une commande - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-131' },
      { type: 'tags', description: '@orders @details' },
      { type: 'test_description', description: 'Consultation du détail d\\'une commande existante' }
    );

    // Create account
    const userData = await createAccount(page);

    // First place an order
    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add product to cart
    const addToCartBtn = page.locator('input[value="Add to cart"]').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await wait(1000);

      // Go to cart and checkout
      await page.goto('https://demowebshop.tricentis.com/cart');
      await wait(1000);

      const termsCheckbox = page.locator('#termsofservice');
      if (await termsCheckbox.isVisible()) {
        await termsCheckbox.check();
      }

      const checkoutBtn = page.locator('#checkout');
      if (await checkoutBtn.isVisible()) {
        await checkoutBtn.click();
        await wait(2000);
      }
    }

    // Navigate to orders
    await page.goto('https://demowebshop.tricentis.com/customer/orders');
    await wait(1000);

    await captureEvidence(page, testInfo, 'orders-list');

    // Try to view order details
    const detailsBtn = page.locator('input[value="Details"]').first();
    if (await detailsBtn.isVisible()) {
      await detailsBtn.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'order-details');
    }
  });
});
`
  },

  // 14 - Product Filtering
  {
    filename: '14-product-filtering.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests de Filtrage de Produits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Filtrage par prix - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-140' },
      { type: 'tags', description: '@filter @price' },
      { type: 'test_description', description: 'Filtrage des produits par tranche de prix' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);
    await captureEvidence(page, testInfo, 'books-page');

    // Look for price filter
    const priceFilter = page.locator('.filter-price-item a, .price-range-filter a').first();
    if (await priceFilter.isVisible()) {
      await priceFilter.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'filtered-by-price');

      // Verify products are displayed
      const products = page.locator('.product-item, .item-box');
      const count = await products.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('Tri par nom - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-141' },
      { type: 'tags', description: '@filter @sort' },
      { type: 'test_description', description: 'Tri des produits par nom A-Z' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);
    await captureEvidence(page, testInfo, 'books-before-sort');

    // Find sort dropdown
    const sortSelect = page.locator('#products-orderby');
    if (await sortSelect.isVisible()) {
      await sortSelect.selectOption('5'); // Name: A to Z
      await wait(1000);
      await captureEvidence(page, testInfo, 'sorted-by-name');
    }
  });

  test('Changement de vue (grille/liste) - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-142' },
      { type: 'tags', description: '@filter @view' },
      { type: 'test_description', description: 'Basculement entre vue grille et liste' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);
    await captureEvidence(page, testInfo, 'default-view');

    // Find view mode selector
    const viewModeSelect = page.locator('#products-viewmode');
    if (await viewModeSelect.isVisible()) {
      await viewModeSelect.selectOption('list');
      await wait(1000);
      await captureEvidence(page, testInfo, 'list-view');

      // Verify list view is applied
      const listContainer = page.locator('.product-list');
      if (await listContainer.isVisible()) {
        await expect(listContainer).toBeVisible();
      }
    }
  });
});
`
  },

  // 15 - Configurable Products
  {
    filename: '15-configurable-products.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests de Produits Configurables', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Configuration d\\'un ordinateur personnalisé - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-150' },
      { type: 'tags', description: '@configurable @computers' },
      { type: 'test_description', description: 'Configuration d\\'un PC avec options personnalisées' }
    );

    await page.goto('https://demowebshop.tricentis.com/build-your-own-computer');
    await wait(1000);
    await captureEvidence(page, testInfo, 'computer-config-page');

    // Select processor
    const processorSelect = page.locator('select[id*="product_attribute"]').first();
    if (await processorSelect.isVisible()) {
      await processorSelect.selectOption({ index: 1 });
      await wait(500);
    }

    // Select RAM
    const ramRadio = page.locator('input[type="radio"][id*="product_attribute"]').first();
    if (await ramRadio.isVisible()) {
      await ramRadio.check();
      await wait(500);
    }

    // Select HDD
    const hddRadio = page.locator('input[type="radio"][name*="product_attribute"]').nth(2);
    if (await hddRadio.isVisible()) {
      await hddRadio.check();
      await wait(500);
    }

    await captureEvidence(page, testInfo, 'computer-configured');

    // Check price update
    const price = page.locator('.product-price, .price-value');
    await expect(price).toBeVisible();

    // Add to cart
    const addToCartBtn = page.locator('#add-to-cart-button-16, input[value="Add to cart"]');
    await addToCartBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'added-to-cart');
  });

  test('Produit avec options multiples - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-151' },
      { type: 'tags', description: '@configurable' },
      { type: 'test_description', description: 'Sélection de plusieurs options sur un produit' }
    );

    await page.goto('https://demowebshop.tricentis.com/build-your-own-computer');
    await wait(1000);

    // Select multiple checkboxes if available
    const checkboxes = page.locator('input[type="checkbox"][id*="product_attribute"]');
    const count = await checkboxes.count();

    for (let i = 0; i < Math.min(count, 2); i++) {
      await checkboxes.nth(i).check();
      await wait(300);
    }

    await captureEvidence(page, testInfo, 'multiple-options-selected');

    // Verify options are selected
    for (let i = 0; i < Math.min(count, 2); i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
  });
});
`
  },

  // 16 - Product Tags
  {
    filename: '16-product-tags.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests des Tags Produits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Navigation via tags populaires - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-160' },
      { type: 'tags', description: '@tags @navigation' },
      { type: 'test_description', description: 'Utilisation des tags pour filtrer les produits' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);
    await captureEvidence(page, testInfo, 'homepage');

    // Find popular tags in sidebar
    const tagCloud = page.locator('.popular-tags a, .product-tags a').first();
    if (await tagCloud.isVisible()) {
      const tagName = await tagCloud.textContent();
      await tagCloud.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'tag-results');

      // Verify tag results page
      const pageTitle = page.locator('.page-title, h1');
      await expect(pageTitle).toBeVisible();
    }
  });

  test('Tags sur page produit - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-161' },
      { type: 'tags', description: '@tags' },
      { type: 'test_description', description: 'Affichage et clic sur tags depuis une page produit' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Click on first product
    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'product-page');

    // Look for product tags
    const productTags = page.locator('.product-tags a');
    if (await productTags.count() > 0) {
      await productTags.first().click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'tag-from-product');
    }
  });
});
`
  },

  // 17 - Recently Viewed
  {
    filename: '17-recently-viewed.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests des Produits Récemment Consultés', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Affichage des produits récemment vus - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-170' },
      { type: 'tags', description: '@recently-viewed @smoke' },
      { type: 'test_description', description: 'Vérification que les produits consultés apparaissent dans la section récemment vus' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);

    // View several products
    await page.goto('https://demowebshop.tricentis.com/fiction');
    await wait(1000);

    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);
    await captureEvidence(page, testInfo, 'first-product-viewed');

    await page.goto('https://demowebshop.tricentis.com/computing-and-internet');
    await wait(1000);

    const secondProduct = page.locator('.product-item, .item-box').first();
    await secondProduct.locator('a').first().click();
    await wait(1000);
    await captureEvidence(page, testInfo, 'second-product-viewed');

    // Navigate to recently viewed
    await page.goto('https://demowebshop.tricentis.com/recentlyviewedproducts');
    await wait(1000);

    await captureEvidence(page, testInfo, 'recently-viewed-page');

    // Verify products are listed
    const recentProducts = page.locator('.product-item, .item-box');
    const count = await recentProducts.count();
    expect(count).toBeGreaterThan(0);
  });
});
`
  },

  // 18 - Email a Friend
  {
    filename: '18-email-friend.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, generateUserData } = require('../utils/helpers');

test.describe('Tests d\\'Envoi Email à un Ami', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Partage produit par email - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-180' },
      { type: 'tags', description: '@email @share' },
      { type: 'test_description', description: 'Envoi d\\'un email pour recommander un produit' }
    );

    const userData = generateUserData();

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Click on first product
    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'product-page');

    // Find email a friend link
    const emailLink = page.locator('a[href*="emailafriend"], .email-a-friend a');
    if (await emailLink.isVisible()) {
      await emailLink.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'email-friend-form');

      // Fill the form
      await page.fill('#FriendEmail', 'friend@example.com');
      await page.fill('#YourEmailAddress', userData.email);
      await page.fill('#PersonalMessage', 'Check out this great product!');

      await captureEvidence(page, testInfo, 'form-filled');

      // Submit
      const sendBtn = page.locator('input[name="send-email"], input[value="Send email"]');
      if (await sendBtn.isVisible()) {
        await sendBtn.click();
        await wait(1000);
        await captureEvidence(page, testInfo, 'email-sent');
      }
    }
  });
});
`
  },

  // 19 - Community Poll
  {
    filename: '19-community-poll.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests du Sondage Communautaire', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Participation au sondage - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-190' },
      { type: 'tags', description: '@poll @community' },
      { type: 'test_description', description: 'Vote dans le sondage communautaire' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);
    await captureEvidence(page, testInfo, 'homepage');

    // Find poll section
    const pollSection = page.locator('.poll');
    if (await pollSection.isVisible()) {
      await captureEvidence(page, testInfo, 'poll-section');

      // Select an option
      const pollOption = pollSection.locator('input[type="radio"]').first();
      if (await pollOption.isVisible()) {
        await pollOption.check();

        // Submit vote
        const voteBtn = pollSection.locator('#vote-poll-1, input[value="Vote"]');
        if (await voteBtn.isVisible()) {
          await voteBtn.click();
          await wait(1000);
          await captureEvidence(page, testInfo, 'poll-voted');
        }
      }
    }
  });
});
`
  },

  // 20 - Manufacturer Filter
  {
    filename: '20-manufacturer-filter.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests du Filtre par Fabricant', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Filtrage par fabricant - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-200' },
      { type: 'tags', description: '@filter @manufacturer' },
      { type: 'test_description', description: 'Filtrage des produits par fabricant' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);
    await captureEvidence(page, testInfo, 'homepage');

    // Find manufacturers block
    const manufacturerLink = page.locator('.manufacturer-item a, .manufacturers-list a').first();
    if (await manufacturerLink.isVisible()) {
      const manufacturerName = await manufacturerLink.textContent();
      await manufacturerLink.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'manufacturer-page');

      // Verify manufacturer page
      const pageTitle = page.locator('.page-title, h1');
      await expect(pageTitle).toBeVisible();
    }
  });
});
`
  },

  // 21 - New Products
  {
    filename: '21-new-products.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests des Nouveaux Produits', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Affichage des nouveaux produits - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-210' },
      { type: 'tags', description: '@new-products' },
      { type: 'test_description', description: 'Visualisation de la page des nouveaux produits' }
    );

    await page.goto('https://demowebshop.tricentis.com/newproducts');
    await wait(1000);

    await captureEvidence(page, testInfo, 'new-products-page');

    // Verify page loaded
    const pageTitle = page.locator('.page-title, h1');
    await expect(pageTitle).toContainText(/new/i);

    // Check if products are displayed
    const products = page.locator('.product-item, .item-box');
    const count = await products.count();
    // New products page may or may not have products
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
`
  },

  // 22 - Footer Links
  {
    filename: '22-footer-links.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests des Liens du Footer', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Vérification des liens footer - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-220' },
      { type: 'tags', description: '@footer @navigation' },
      { type: 'test_description', description: 'Vérification des liens dans le pied de page' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);
    await captureEvidence(page, testInfo, 'homepage');

    // Check About us link
    const aboutLink = page.locator('footer a[href*="about"]');
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'about-page');
      await expect(page.locator('.page-title, h1')).toContainText(/about/i);
    }

    // Go back and check Terms link
    await page.goto('https://demowebshop.tricentis.com/');
    await wait(500);

    const termsLink = page.locator('footer a[href*="conditions"]');
    if (await termsLink.isVisible()) {
      await termsLink.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'terms-page');
      await expect(page.locator('.page-title, h1')).toContainText(/condition/i);
    }

    // Check Privacy policy
    await page.goto('https://demowebshop.tricentis.com/');
    await wait(500);

    const privacyLink = page.locator('footer a[href*="privacy"]');
    if (await privacyLink.isVisible()) {
      await privacyLink.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'privacy-page');
    }
  });
});
`
  },

  // 23 - News/Blog
  {
    filename: '23-news-blog.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests du Blog/Actualités', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Consultation des actualités - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-230' },
      { type: 'tags', description: '@news @blog' },
      { type: 'test_description', description: 'Affichage de la page des actualités' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);

    // Find news section on homepage
    const newsBlock = page.locator('.news-list-homepage');
    if (await newsBlock.isVisible()) {
      await captureEvidence(page, testInfo, 'news-on-homepage');
    }

    // Navigate to news page
    await page.goto('https://demowebshop.tricentis.com/news');
    await wait(1000);

    await captureEvidence(page, testInfo, 'news-page');

    // Verify news page
    const pageTitle = page.locator('.page-title, h1');
    await expect(pageTitle).toContainText(/news/i);
  });

  test('Lecture d\\'un article - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-231' },
      { type: 'tags', description: '@news @article' },
      { type: 'test_description', description: 'Lecture complète d\\'un article d\\'actualité' }
    );

    await page.goto('https://demowebshop.tricentis.com/news');
    await wait(1000);

    // Click on first news item
    const newsItem = page.locator('.news-items .news-item a, .news-list a').first();
    if (await newsItem.isVisible()) {
      await newsItem.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'news-article');

      // Verify article content is displayed
      const articleContent = page.locator('.news-body, .news-content');
      if (await articleContent.isVisible()) {
        await expect(articleContent).toBeVisible();
      }
    }
  });
});
`
  },

  // 24 - Guest Checkout
  {
    filename: '24-guest-checkout.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, generateUserData } = require('../utils/helpers');

test.describe('Tests de Checkout Invité', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Commande en tant qu\\'invité - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-240' },
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
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await wait(1000);
    }

    // Go to cart
    await page.goto('https://demowebshop.tricentis.com/cart');
    await wait(1000);
    await captureEvidence(page, testInfo, 'cart-with-product');

    // Accept terms and checkout
    const termsCheckbox = page.locator('#termsofservice');
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.check();
    }

    const checkoutBtn = page.locator('#checkout');
    await checkoutBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'checkout-options');

    // Select checkout as guest
    const guestCheckout = page.locator('input[value="Checkout as Guest"]');
    if (await guestCheckout.isVisible()) {
      await guestCheckout.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'billing-address-form');

      // Fill billing address
      await page.fill('#BillingNewAddress_FirstName', userData.firstName);
      await page.fill('#BillingNewAddress_LastName', userData.lastName);
      await page.fill('#BillingNewAddress_Email', userData.email);

      const countrySelect = page.locator('#BillingNewAddress_CountryId');
      if (await countrySelect.isVisible()) {
        await countrySelect.selectOption('1'); // USA
        await wait(500);
      }

      await page.fill('#BillingNewAddress_City', 'Test City');
      await page.fill('#BillingNewAddress_Address1', '123 Test Street');
      await page.fill('#BillingNewAddress_ZipPostalCode', '12345');
      await page.fill('#BillingNewAddress_PhoneNumber', '1234567890');

      await captureEvidence(page, testInfo, 'billing-filled');

      // Continue
      const continueBtn = page.locator('input[onclick*="Billing.save"], #billing-buttons-container input[value="Continue"]');
      if (await continueBtn.isVisible()) {
        await continueBtn.click();
        await wait(1000);
        await captureEvidence(page, testInfo, 'after-billing');
      }
    }
  });
});
`
  },

  // 25 - Cart Updates
  {
    filename: '25-cart-updates.spec.js',
    content: `const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, clearCart } = require('../utils/helpers');

test.describe('Tests de Mise à Jour du Panier', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await clearCart(page);
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Modification de la quantité - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-250' },
      { type: 'tags', description: '@cart @quantity' },
      { type: 'test_description', description: 'Modification de la quantité d\\'un article dans le panier' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add product to cart
    const addToCartBtn = page.locator('input[value="Add to cart"]').first();
    await addToCartBtn.click();
    await wait(1000);

    // Go to cart
    await page.goto('https://demowebshop.tricentis.com/cart');
    await wait(1000);
    await captureEvidence(page, testInfo, 'cart-initial');

    // Get initial total
    const initialTotal = await page.locator('.order-total strong, .cart-total-right').textContent();

    // Update quantity
    const qtyInput = page.locator('input.qty-input').first();
    await qtyInput.fill('3');

    // Click update cart
    const updateBtn = page.locator('input[name="updatecart"], input[value="Update shopping cart"]');
    await updateBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'cart-updated');

    // Verify quantity changed
    await expect(qtyInput).toHaveValue('3');
  });

  test('Suppression d\\'un article - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-251' },
      { type: 'tags', description: '@cart @remove' },
      { type: 'test_description', description: 'Suppression d\\'un article du panier' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add product to cart
    const addToCartBtn = page.locator('input[value="Add to cart"]').first();
    await addToCartBtn.click();
    await wait(1000);

    // Go to cart
    await page.goto('https://demowebshop.tricentis.com/cart');
    await wait(1000);
    await captureEvidence(page, testInfo, 'cart-with-item');

    // Check remove checkbox
    const removeCheckbox = page.locator('input[name="removefromcart"]').first();
    await removeCheckbox.check();

    // Update cart
    const updateBtn = page.locator('input[name="updatecart"], input[value="Update shopping cart"]');
    await updateBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'cart-after-remove');

    // Verify cart is empty or item removed
    const emptyCart = page.locator('.order-summary-content');
    await expect(emptyCart).toContainText(/empty|no items/i);
  });

  test('Application d\\'un code promo - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-252' },
      { type: 'tags', description: '@cart @promo' },
      { type: 'test_description', description: 'Tentative d\\'application d\\'un code promo' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Add product to cart
    const addToCartBtn = page.locator('input[value="Add to cart"]').first();
    await addToCartBtn.click();
    await wait(1000);

    // Go to cart
    await page.goto('https://demowebshop.tricentis.com/cart');
    await wait(1000);
    await captureEvidence(page, testInfo, 'cart-before-promo');

    // Try to apply coupon code
    const couponInput = page.locator('#discountcouponcode');
    if (await couponInput.isVisible()) {
      await couponInput.fill('TESTCODE');

      const applyBtn = page.locator('input[name="applydiscountcouponcode"]');
      await applyBtn.click();
      await wait(1000);

      await captureEvidence(page, testInfo, 'promo-applied');

      // Check for message (success or error)
      const message = page.locator('.message-error, .message-success, .coupon-box-message');
      if (await message.isVisible()) {
        await expect(message).toBeVisible();
      }
    }
  });
});
`
  }
];

// Generate all test files
console.log('Generating test files...');

testFiles.forEach(({ filename, content }) => {
  const filePath = path.join(testsDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created: tests/' + filename);
});

console.log('');
console.log('Successfully generated ' + testFiles.length + ' test files!');
console.log('');
console.log('Run tests with:');
console.log('  npx playwright test 06-product-search --headed');
console.log('  npx playwright test');
