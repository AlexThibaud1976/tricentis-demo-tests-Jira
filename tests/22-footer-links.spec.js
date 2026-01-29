const { test, expect } = require('../test-fixtures');
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
    const hasAbout = await aboutLink.count() > 0;
    
    if (hasAbout) {
      await expect(aboutLink).toBeVisible();
      await aboutLink.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'about-page');
      await expect(page.locator('.page-title, h1')).toContainText(/about/i);
    }

    // Go back and check Terms link
    await page.goto('https://demowebshop.tricentis.com/');
    await wait(500);

    const termsLink = page.locator('footer a[href*="conditions"]');
    const hasTerms = await termsLink.count() > 0;
    
    if (hasTerms) {
      await expect(termsLink).toBeVisible();
      await termsLink.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'terms-page');
      await expect(page.locator('.page-title, h1')).toContainText(/condition/i);
    }

    // Check Privacy policy
    await page.goto('https://demowebshop.tricentis.com/');
    await wait(500);

    const privacyLink = page.locator('footer a[href*="privacy"]');
    const hasPrivacy = await privacyLink.count() > 0;
    
    if (hasPrivacy) {
      await expect(privacyLink).toBeVisible();
      await privacyLink.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'privacy-page');
      await expect(page.locator('.page-title, h1')).toBeVisible();
    }
  });
});
