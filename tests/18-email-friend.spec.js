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

    // Register a new account for this test
    await page.goto('https://demowebshop.tricentis.com/register');
    await page.check('#gender-male');
    await page.fill('#FirstName', userData.firstName);
    await page.fill('#LastName', userData.lastName);
    await page.fill('#Email', userData.email);
    await page.fill('#Password', userData.password);
    await page.fill('#ConfirmPassword', userData.password);
    await page.click('#register-button');
    await wait(2000);

    // Navigate to books
    await page.goto('https://demowebshop.tricentis.com/books');
    await wait(1000);

    // Click on first product
    const firstProduct = page.locator('.product-item, .item-box').first();
    await firstProduct.locator('a').first().click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'product-page');

    // Find and click email a friend button (need to be logged in)
    const emailButton = page.locator('input.button-2.email-a-friend-button, input[value*="Email a friend"]');
    await expect(emailButton).toBeVisible();
    await emailButton.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'email-friend-form');

    // Fill the form
    await page.fill('#FriendEmail', 'friend@example.com');
    await page.fill('#YourEmailAddress', userData.email);
    await page.fill('#PersonalMessage', 'Check out this great product!');

    await captureEvidence(page, testInfo, 'form-filled');

    // Click Send button
    const sendBtn = page.locator('input[name="send-email"], input[value="Send email"]');
    await expect(sendBtn).toBeVisible();
    await sendBtn.click();
    await wait(1000);

    await captureEvidence(page, testInfo, 'email-sent');

    // Verify success message
    await wait(2000);
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Your message has been sent');
    
    await captureEvidence(page, testInfo, 'success-confirmation');
  });
});
