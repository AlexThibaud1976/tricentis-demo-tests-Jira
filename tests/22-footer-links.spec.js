const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests des Liens du Footer - Section INFORMATION', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Vérification lien "Sitemap" ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-280' },
      { type: 'tags', description: '@footer @information @navigation' },
      { type: 'test_description', description: 'Vérifier que le lien Sitemap est accessible' }
    );
    
    await page.goto('https://demowebshop.tricentis.com/');
    await wait(500);
    await captureEvidence(page, testInfo, 'homepage');
    
    const link = page.locator('.footer a[href*="sitemap"]');
    await expect(link).toBeVisible();
    await link.click();
    await wait(1000);
    
    await expect(page).toHaveURL(/sitemap/);
    await captureEvidence(page, testInfo, 'sitemap-page');
  });

  test('Vérification lien "Shipping & Returns" ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-281' },
      { type: 'tags', description: '@footer @information @navigation' },
      { type: 'test_description', description: 'Vérifier que le lien Shipping & Returns est accessible' }
    );
    
    await page.goto('https://demowebshop.tricentis.com/');
    await wait(500);
    await captureEvidence(page, testInfo, 'homepage');
    
    const link = page.locator('.footer a[href*="shipping"]');
    await expect(link).toBeVisible();
    await link.click();
    await wait(1000);
    
    await expect(page).toHaveURL(/shipping/);
    await captureEvidence(page, testInfo, 'shipping-page');
  });

  test('Vérification lien "Privacy Notice" ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-282' },
      { type: 'tags', description: '@footer @information @navigation' },
      { type: 'test_description', description: 'Vérifier que le lien Privacy Notice est accessible' }
    );
    
    await page.goto('https://demowebshop.tricentis.com/');
    await wait(500);
    await captureEvidence(page, testInfo, 'homepage');
    
    const link = page.locator('.footer a[href*="privacy"]');
    await expect(link).toBeVisible();
    await link.click();
    await wait(1000);
    
    await expect(page).toHaveURL(/privacy/);
    await captureEvidence(page, testInfo, 'privacy-page');
  });

  test('Vérification lien "Conditions of Use" ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-283' },
      { type: 'tags', description: '@footer @information @navigation' },
      { type: 'test_description', description: 'Vérifier que le lien Conditions of Use est accessible' }
    );
    
    await page.goto('https://demowebshop.tricentis.com/');
    await wait(500);
    await captureEvidence(page, testInfo, 'homepage');
    
    const link = page.locator('.footer a[href*="conditions"]');
    await expect(link).toBeVisible();
    await link.click();
    await wait(1000);
    
    await expect(page).toHaveURL(/conditions/);
    await captureEvidence(page, testInfo, 'conditions-page');
  });

  test('Vérification lien "About us" ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-284' },
      { type: 'tags', description: '@footer @information @navigation' },
      { type: 'test_description', description: 'Vérifier que le lien About us est accessible' }
    );
    
    await page.goto('https://demowebshop.tricentis.com/');
    await wait(500);
    await captureEvidence(page, testInfo, 'homepage');
    
    const link = page.locator('.footer a[href*="about"]');
    await expect(link).toBeVisible();
    await link.click();
    await wait(1000);
    
    await expect(page).toHaveURL(/about/);
    await captureEvidence(page, testInfo, 'about-page');
  });

  test('Vérification lien "Contact us" ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-285' },
      { type: 'tags', description: '@footer @information @navigation' },
      { type: 'test_description', description: 'Vérifier que le lien Contact us est accessible' }
    );
    
    await page.goto('https://demowebshop.tricentis.com/');
    await wait(500);
    await captureEvidence(page, testInfo, 'homepage');
    
    const link = page.locator('.footer a[href*="contact"]');
    await expect(link).toBeVisible();
    await link.click();
    await wait(1000);
    
    await expect(page).toHaveURL(/contact/);
    await captureEvidence(page, testInfo, 'contact-page');
  });
});
