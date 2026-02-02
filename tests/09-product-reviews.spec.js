const { test, expect } = require('../test-fixtures');
const { assertUrl, wait, generateUserData } = require('../utils/helpers');

// Helper simplifié pour les screenshots viewport (sans fullPage)
async function captureSimpleScreenshot(page, testInfo, name) {
  try {
    const screenshot = await page.screenshot({ timeout: 5000 });
    await testInfo.attach(name, { body: screenshot, contentType: 'image/png' });
    console.log(`📸 Screenshot captured: ${name}`);
  } catch (error) {
    console.warn(`⚠️ Screenshot failed: ${error.message}`);
  }
}

test.describe('Tests des Avis Produits', () => {
  // Suppression du afterEach problématique qui cause des timeouts
  // Les screenshots d'échec sont déjà gérés par le hook dans browserstack-fixtures.js
  
  test('Consultation des avis existants - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-257' },
      { type: 'tags', description: '@reviews @smoke' },
      { type: 'test_description', description: 'Affichage des avis sur une page produit' }
    );

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Click on a product
    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    await captureSimpleScreenshot(page, testInfo, 'product-page');

    // Look for reviews section or add review link
    const reviewsTab = page.getByRole('link', { name: 'Add your review' });
    await expect(reviewsTab).toBeVisible({ timeout: 5000 });
    await reviewsTab.click();
    await wait(1000);
    await captureSimpleScreenshot(page, testInfo, 'reviews-section');
  });

  test('Soumission d\'un nouvel avis - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-258' },
      { type: 'tags', description: '@reviews' },
      { type: 'test_description', description: 'Ajout d\'un avis sur un produit' }
    );

    // Need to create account first to submit reviews
    const { createAccount } = require('../utils/helpers');
    const userData = await createAccount(page);
    await captureSimpleScreenshot(page, testInfo, 'account-created');

    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Click on a product
    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    // Find add review link
    const addReviewLink = page.getByRole('link', { name: 'Add your review' });
    await expect(addReviewLink).toBeVisible({ timeout: 5000 });
    await addReviewLink.click();
    await wait(1000);

    await captureSimpleScreenshot(page, testInfo, 'review-form');

    // Fill review form (enabled since we're logged in)
    const titleInput = page.locator('#AddProductReview_Title');
    await expect(titleInput).toBeEnabled({ timeout: 5000 });
    
    await page.fill('#AddProductReview_Title', 'Test Review Title');
    await page.fill('#AddProductReview_ReviewText', 'This is an automated test review for the product. The quality is excellent and I recommend it.');

    // Select rating
    const rating = page.locator('input[id*="addproductrating"]').first();
    await expect(rating).toBeVisible();
    await rating.click();

    await captureSimpleScreenshot(page, testInfo, 'review-filled');

    // Submit review - bouton submit avec plusieurs sélecteurs possibles
    const submitBtn = page.locator('input[name="add-review"], input[value*="ubmit"], button[type="submit"]').first();
    await expect(submitBtn).toBeVisible({ timeout: 10000 });
    await submitBtn.click();
    await wait(1000);
    await captureSimpleScreenshot(page, testInfo, 'review-submitted');

    // Verify review submission success
    const successMessage = page.locator('.result, .bar-notification.success').first();
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });
});
