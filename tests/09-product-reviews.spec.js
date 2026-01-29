const { test, expect } = require('../test-fixtures');
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

    // Look for reviews section or add review link
    const reviewsTab = page.getByRole('link', { name: 'Add your review' });
    await expect(reviewsTab).toBeVisible({ timeout: 5000 });
    await reviewsTab.click();
    await wait(1000);
    await captureEvidence(page, testInfo, 'reviews-section');
  });

  test('Soumission d\'un nouvel avis - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-091' },
      { type: 'tags', description: '@reviews' },
      { type: 'test_description', description: 'Ajout d\'un avis sur un produit' }
    );

    // Need to create account first to submit reviews
    const { createAccount } = require('../utils/helpers');
    const userData = await createAccount(page);
    await captureEvidence(page, testInfo, 'account-created');

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

    await captureEvidence(page, testInfo, 'review-form');

    // Fill review form (enabled since we're logged in)
    const titleInput = page.locator('#AddProductReview_Title');
    await expect(titleInput).toBeEnabled({ timeout: 5000 });
    
    await page.fill('#AddProductReview_Title', 'Test Review Title');
    await page.fill('#AddProductReview_ReviewText', 'This is an automated test review for the product. The quality is excellent and I recommend it.');

    // Select rating
    const rating = page.locator('input[id*="addproductrating"]').first();
    await expect(rating).toBeVisible();
    await rating.click();

    await captureEvidence(page, testInfo, 'review-filled');

    // Submit review
    const submitBtn = page.locator('input[value="Submit review"]');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();
    await wait(1000);
    await captureEvidence(page, testInfo, 'review-submitted');

    // Verify review submission success
    const successMessage = page.locator('.result, .bar-notification.success').first();
    await expect(successMessage).toBeVisible({ timeout: 5000 });
  });
});
