const { test, expect } = require('../test-fixtures');
const { generateUserData, login, logout } = require('../utils/helpers');

test.describe('Tests de connexion et déconnexion', () => {
  let testUser;

  test.afterEach(async ({ page }) => {
      if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
        try {
          await page.context().close();
        } catch (e) {
          // ignore
        }
      }
  });

  test('Test 3: Connexion utilisateur - Cas passant ✅', async ({ page }) => {
    // Créer un compte (comme dans Test 1 de 01-account-creation.spec.js)
    testUser = generateUserData();
    
    await page.goto('/');
    await page.locator('a.ico-register').click();
    await expect(page).toHaveURL(/.*register/);
    
    await page.locator('input#gender-male').check();
    await page.locator('input#FirstName').fill(testUser.firstName);
    await page.locator('input#LastName').fill(testUser.lastName);
    await page.locator('input#Email').fill(testUser.email);
    await page.locator('input#Password').fill(testUser.password);
    await page.locator('input#ConfirmPassword').fill(testUser.password);
    await page.locator('input#register-button').click();
    
    await expect(page.locator('.result')).toContainText('Your registration completed');
    await page.locator('.button-1.register-continue-button').click();
    await expect(page).toHaveURL('/');
    
    console.log(`✅ Compte créé avec succès: ${testUser.email}`);
    
    // Se déconnecter
    await page.locator('a.ico-logout').click();
    await page.waitForLoadState('networkidle');
    
    // Maintenant tester la connexion avec ce compte
    await page.goto('/');
    await page.locator('a.ico-login').click();
    await expect(page).toHaveURL(/.*login/);
    
    await page.locator('input#Email').fill(testUser.email);
    await page.locator('input#Password').fill(testUser.password);
    await page.locator('.button-1.login-button').click();
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('a.ico-logout')).toBeVisible();
    await expect(page.locator('.account').first()).toContainText(testUser.email);
    await expect(page.locator('a.ico-login')).not.toBeVisible();
    
    console.log(`✅ Connexion réussie avec: ${testUser.email}`);
  });

  test('Test 4: Connexion utilisateur - Cas non passant (mot de passe incorrect) ❌', async ({ page }) => {
    // Créer un compte pour ce test
    const userData = generateUserData();
    
    await page.goto('/register');
    await page.locator('input#gender-male').check();
    await page.locator('input#FirstName').fill(userData.firstName);
    await page.locator('input#LastName').fill(userData.lastName);
    await page.locator('input#Email').fill(userData.email);
    await page.locator('input#Password').fill(userData.password);
    await page.locator('input#ConfirmPassword').fill(userData.password);
    await page.locator('input#register-button').click();
    await expect(page.locator('.result')).toContainText('Your registration completed');
    await page.locator('.button-1.register-continue-button').click();
    
    // Se déconnecter
    await page.locator('a.ico-logout').click();
    await page.waitForLoadState('networkidle');
    
    // Tester avec un mauvais mot de passe
    await page.goto('/login');
    await page.locator('input#Email').fill(userData.email);
    await page.locator('input#Password').fill('MauvaisMotDePasse123');
    await page.locator('.button-1.login-button').click();
    
    // Vérifier le message d'erreur
    await expect(page.locator('.validation-summary-errors')).toBeVisible();
    await expect(page.locator('.validation-summary-errors')).toContainText('Login was unsuccessful');
    
    // Vérifier que nous sommes toujours sur la page de connexion
    await expect(page).toHaveURL(/.*login/);
    
    // Vérifier que nous ne sommes pas connectés
    await expect(page.locator('a.ico-login')).toBeVisible();
    
    console.log('✅ Le système a correctement rejeté le mot de passe incorrect');
  });

  test('Test 4 bis: Connexion - Cas non passant (email inexistant) ❌', async ({ page }) => {
    await page.goto('/login');
    
    await page.locator('input#Email').fill('emailinexistant@test.com');
    await page.locator('input#Password').fill('Password123');
    
    await page.locator('.button-1.login-button').click();
    
    await expect(page.locator('.validation-summary-errors')).toBeVisible();
    await expect(page.locator('.validation-summary-errors')).toContainText('Login was unsuccessful');
    
    console.log('✅ Le système a correctement rejeté l\'email inexistant');
  });

  test('Test 5: Déconnexion utilisateur - Cas passant ✅', async ({ page }) => {
    // Créer un compte pour ce test
    const userData = generateUserData();
    
    await page.goto('/register');
    await page.locator('input#gender-male').check();
    await page.locator('input#FirstName').fill(userData.firstName);
    await page.locator('input#LastName').fill(userData.lastName);
    await page.locator('input#Email').fill(userData.email);
    await page.locator('input#Password').fill(userData.password);
    await page.locator('input#ConfirmPassword').fill(userData.password);
    await page.locator('input#register-button').click();
    await expect(page.locator('.result')).toContainText('Your registration completed');
    await page.locator('.button-1.register-continue-button').click();
    
    // Vérifier que nous sommes connectés
    await expect(page.locator('a.ico-logout')).toBeVisible();
    
    // Cliquer sur Log out
    await page.locator('a.ico-logout').click();
    
    // Attendre la redirection
    await page.waitForLoadState('networkidle');
    
    // Vérifier que nous sommes déconnectés
    await expect(page).toHaveURL('/');
    await expect(page.locator('a.ico-login')).toBeVisible();
    await expect(page.locator('a.ico-register')).toBeVisible();
    await expect(page.locator('a.ico-logout')).not.toBeVisible();
    
    console.log('✅ Déconnexion réussie');
  });
});
