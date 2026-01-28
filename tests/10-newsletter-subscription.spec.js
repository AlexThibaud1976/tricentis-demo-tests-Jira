const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, generateUserData } = require('../utils/helpers');

test.describe('Tests d\'Inscription Newsletter', () => {
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
      { type: 'test_description', description: 'Tentative d\'inscription avec email invalide' }
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
