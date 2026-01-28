const { test, expect } = require('../test-fixtures');
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
      { type: 'test_description', description: 'Ajout d\'une nouvelle adresse' }
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
