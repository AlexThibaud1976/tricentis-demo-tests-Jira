const { test, expect } = require('@playwright/test');

/**
 * Tests de création de compte pour l'application Flutter
 *
 * Ces tests sont adaptés pour utiliser les labels ARIA
 * générés par les widgets Semantics de Flutter
 */

// Fonction helper pour générer des données utilisateur uniques
function generateUserData() {
  const timestamp = Date.now();
  return {
    firstName: `Test${timestamp}`,
    lastName: `User${timestamp}`,
    email: `test.user.${timestamp}@example.com`,
    password: 'Test@123456',
  };
}

test.describe('Tests de création de compte Flutter', () => {

  test('Test 1: Création de compte utilisateur - Cas passant ✅', async ({ page }) => {
    // Générer des données utilisateur uniques
    const userData = generateUserData();

    // Naviguer vers la page d'accueil
    await page.goto('/');

    // Attendre que Flutter soit chargé (important pour Flutter Web)
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Délai supplémentaire pour Flutter

    // Cliquer sur le lien Register (en utilisant le texte car c'est un lien)
    await page.getByRole('button', { name: /register/i }).click();

    // Vérifier que nous sommes sur la page d'inscription
    await expect(page).toHaveURL(/.*register/);

    // Attendre que le formulaire soit chargé
    await page.waitForLoadState('networkidle');

    // Sélectionner le genre (Male)
    await page.getByLabel('gender-male').click();

    // Remplir le formulaire en utilisant les labels ARIA
    await page.getByLabel('FirstName').fill(userData.firstName);
    await page.getByLabel('LastName').fill(userData.lastName);
    await page.getByLabel('Email').fill(userData.email);
    await page.getByLabel('Password').fill(userData.password);
    await page.getByLabel('ConfirmPassword').fill(userData.password);

    // Soumettre le formulaire
    await page.getByLabel('register-button').click();

    // Attendre le dialog de succès
    await page.waitForTimeout(1000);

    // Vérifier le message de succès dans le dialog
    await expect(page.getByLabel('registration-success-message')).toBeVisible();
    await expect(page.getByLabel('registration-success-message')).toContainText('Your registration completed');

    // Cliquer sur Continue
    await page.getByLabel('register-continue-button').click();

    // Vérifier que nous sommes de retour sur la page d'accueil
    await expect(page).toHaveURL('/');

    console.log(`✅ Compte créé avec succès: ${userData.email}`);
  });

  test('Test 2: Création de compte - Cas non passant (email invalide) ❌', async ({ page }) => {
    // Naviguer vers la page d'inscription
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Sélectionner le genre (Female)
    await page.getByLabel('gender-female').click();

    // Remplir le formulaire avec un email invalide
    await page.getByLabel('FirstName').fill('TestFail');
    await page.getByLabel('LastName').fill('InvalidEmail');
    await page.getByLabel('Email').fill('emailinvalide'); // Email sans @ ni domaine
    await page.getByLabel('Password').fill('Test@123');
    await page.getByLabel('ConfirmPassword').fill('Test@123');

    // Soumettre le formulaire
    await page.getByLabel('register-button').click();

    // Attendre un peu pour la validation
    await page.waitForTimeout(500);

    // Vérifier qu'un message d'erreur s'affiche
    // Note: La validation peut se faire de différentes manières dans Flutter
    // On peut vérifier si on est toujours sur la page register
    await expect(page).toHaveURL(/.*register/);

    // Ou vérifier si un message d'erreur apparaît (Snackbar)
    const errorMessage = page.getByLabel('registration-error-message');
    if (await errorMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(errorMessage).toContainText(/email|wrong/i);
    }

    console.log('✅ Le système a correctement rejeté l\'email invalide');
  });

  test('Test 2 bis: Création de compte - Cas non passant (mots de passe différents) ❌', async ({ page }) => {
    const userData = generateUserData();

    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.getByLabel('gender-male').click();
    await page.getByLabel('FirstName').fill(userData.firstName);
    await page.getByLabel('LastName').fill(userData.lastName);
    await page.getByLabel('Email').fill(userData.email);
    await page.getByLabel('Password').fill('Test@123456');
    await page.getByLabel('ConfirmPassword').fill('DifferentPassword@123'); // Mot de passe différent

    await page.getByLabel('register-button').click();

    await page.waitForTimeout(500);

    // Vérifier qu'on reste sur la page d'inscription
    await expect(page).toHaveURL(/.*register/);

    // Vérifier le message d'erreur
    const errorMessage = page.getByLabel('registration-error-message');
    if (await errorMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(errorMessage).toContainText(/password/i);
    }

    console.log('✅ Le système a correctement détecté les mots de passe différents');
  });
});
