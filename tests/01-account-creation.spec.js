const { test, expect } = require('../test-fixtures');
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
  
  test('Test 1: Création de compte utilisateur - Cas passant ✅', async ({ page }) => {
    // Générer des données utilisateur uniques
    const userData = generateUserData();
    
    // Naviguer vers la page d'accueil
    await page.goto('/');
    
    // Cliquer sur le lien Register
    await page.locator('a.ico-register').click();
    
    // Vérifier que nous sommes sur la page d'inscription
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('.page-title h1')).toContainText('Register');
    
    // Remplir le formulaire
    await page.locator('input#gender-male').check();
    await page.locator('input#FirstName').fill(userData.firstName);
    await page.locator('input#LastName').fill(userData.lastName);
    await page.locator('input#Email').fill(userData.email);
    await page.locator('input#Password').fill(userData.password);
    await page.locator('input#ConfirmPassword').fill(userData.password);
    
    // Soumettre le formulaire
    await page.locator('input#register-button').click();
    
    // Vérifier le message de succès
    await expect(page.locator('.result')).toContainText('Your registration completed');
    
    // Cliquer sur Continue
    await page.locator('.button-1.register-continue-button').click();
    
    // Vérifier que nous sommes de retour sur la page d'accueil
    await expect(page).toHaveURL('/');
    

    
    console.log(`✅ Compte créé avec succès: ${userData.email}`);
  });

  test('Test 2: Création de compte - Cas non passant (email invalide) ❌', async ({ page }) => {
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
    
    // Vérifier que nous sommes toujours sur la page d'inscription
    await expect(page).toHaveURL(/.*register/);
    
    console.log('✅ Le système a correctement rejeté l\'email invalide');
  });

  test('Test 2 bis: Création de compte - Cas non passant (mots de passe différents) ❌', async ({ page }) => {
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
    
    await expect(page).toHaveURL(/.*register/);
    
    console.log('✅ Le système a correctement détecté les mots de passe différents');
  });
});
