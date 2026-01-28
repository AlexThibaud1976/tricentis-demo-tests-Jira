const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, generateUserData } = require('../utils/helpers');

test.describe('Tests d\'Envoi Email à un Ami', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Partage produit par email - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-180' },
      { type: 'tags', description: '@email @share' },
      { type: 'test_description', description: 'Envoi d\'un email pour recommander un produit' }
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
