const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence } = require('../utils/helpers');
const { generateUserData } = require('../utils/helpers');

test.describe('Tests de création de compte', () => {
  test.afterEach(async ({ page }) => {
    if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
      // Fermer le contexte uniquement en local pour laisser BrowserStack gérer la fermeture
      try {
        await page.context().close();
      } catch (e) {
        // ignore
      }
    }
  });
  
  test('Test 1: Création de compte utilisateur - Cas passant ✅', async ({ page }, testInfo) => {
    // Annotations Xray pour l'intégration Jira
    testInfo.annotations.push({ type: 'test_key', description: 'DEMO-87' });
    testInfo.annotations.push({ type: 'tags', description: 'smoke,account-creation,positive' });
    testInfo.annotations.push({ type: 'test_description', description: 'Vérifie la création d\'un compte utilisateur avec des données valides.\nLe test génère des données utilisateur uniques et valide le message de succès.' });
    
    // Générer des données utilisateur uniques
    const userData = generateUserData();
    
    // Naviguer vers la page d'accueil
    await page.goto('/');
    
    // Cliquer sur le lien Register
    await page.locator('a.ico-register').click();
    
    // Vérifier que nous sommes sur la page d'inscription
    await assertUrl(page, /.*register/);
    await expect(page.locator('.page-title h1')).toContainText('Register');
    await captureEvidence(page, testInfo, 'register_page_loaded');
    
    // Remplir le formulaire
    await page.locator('input#gender-male').check();
    await page.locator('input#FirstName').fill(userData.firstName);
    await page.locator('input#LastName').fill(userData.lastName);
    await page.locator('input#Email').fill(userData.email);
    await page.locator('input#Password').fill(userData.password);
    await page.locator('input#ConfirmPassword').fill(userData.password);
    await captureEvidence(page, testInfo, 'form_filled');
    
    // Soumettre le formulaire
    await page.locator('input#register-button').click();
    
    // Vérifier le message de succès
    await expect(page.locator('.result')).toContainText('Your registration completed');
    await captureEvidence(page, testInfo, 'registration_success');
    
    // Cliquer sur Continue
    await page.locator('.button-1.register-continue-button').click();
    
    // Vérifier que nous sommes de retour sur la page d'accueil
    await assertUrl(page, '/');
    await captureEvidence(page, testInfo, 'homepage_after_registration');
    

    
    console.log(`✅ Compte créé avec succès: ${userData.email}`);
  });

  test('Test 2: Création de compte - Cas non passant (email invalide) ❌', async ({ page }, testInfo) => {
    // Annotations Xray pour l'intégration Jira
    testInfo.annotations.push({ type: 'test_key', description: 'DEMO-88' });
    testInfo.annotations.push({ type: 'tags', description: 'account-creation,negative,validation' });
    testInfo.annotations.push({ type: 'test_description', description: 'Vérifie que le système rejette un email invalide lors de la création de compte.' });
    
    // Naviguer vers la page d'inscription
    await page.goto('/register');
    
    // Remplir le formulaire avec un email invalide
    await page.locator('input#gender-female').check();
    await page.locator('input#FirstName').fill('TestFail');
    await page.locator('input#LastName').fill('InvalidEmail');
    await page.locator('input#Email').fill('emailinvalide'); // Email sans @ ni domaine
    await page.locator('input#Password').fill('Test@123');
    await page.locator('input#ConfirmPassword').fill('Test@123');
    
    // Soumettre le formulaire
    await page.locator('input#register-button').click();
    
    // Vérifier qu'un message d'erreur s'affiche
    await expect(page.locator('.field-validation-error')).toBeVisible();
    await expect(page.locator('.field-validation-error')).toContainText('Wrong email');
    await captureEvidence(page, testInfo, 'email_validation_error');
    
    // Vérifier que nous sommes toujours sur la page d'inscription
    await assertUrl(page, /.*register/);
    
    console.log('✅ Le système a correctement rejeté l\'email invalide');
  });

  test('Test 2 bis: Création de compte - Cas non passant (mots de passe différents) ❌', async ({ page }, testInfo) => {
    // Annotations Xray pour l'intégration Jira
    testInfo.annotations.push({ type: 'test_key', description: 'DEMO-89' });
    testInfo.annotations.push({ type: 'tags', description: 'account-creation,negative,validation' });
    testInfo.annotations.push({ type: 'test_description', description: 'Vérifie que le système détecte les mots de passe non identiques lors de la création de compte.' });
    
    const userData = generateUserData();
    
    await page.goto('/register');
    
    await page.locator('input#gender-male').check();
    await page.locator('input#FirstName').fill(userData.firstName);
    await page.locator('input#LastName').fill(userData.lastName);
    await page.locator('input#Email').fill(userData.email);
    await page.locator('input#Password').fill('Test@123456');
    await page.locator('input#ConfirmPassword').fill('DifferentPassword@123'); // Mot de passe différent
    
    await page.locator('input#register-button').click();
    
    // Vérifier le message d'erreur
    await expect(page.locator('.field-validation-error')).toBeVisible();
    await expect(page.locator('.field-validation-error')).toContainText(/password/i);
    await captureEvidence(page, testInfo, 'password_mismatch_error');
    
    await assertUrl(page, /.*register/);
    
    console.log('✅ Le système a correctement détecté les mots de passe différents');
  });
});
