const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait, generateUserData } = require('../utils/helpers');

test.describe('Tests du Formulaire de Contact', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Envoi message de contact valide - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-261' },
      { type: 'tags', description: '@contact @smoke' },
      { type: 'test_description', description: 'Envoi d\'un message via le formulaire de contact' }
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
      { type: 'test_key', description: 'DEMO-262' },
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
