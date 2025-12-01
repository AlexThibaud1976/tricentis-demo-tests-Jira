# Guide de Test de l'Application Flutter avec Playwright

Ce document explique comment adapter les tests Playwright existants pour tester l'application Flutter.

## 🎯 Pourquoi ce guide ?

L'application Flutter utilise un **DOM différent** du site HTML original. Flutter Web génère son propre DOM via son moteur de rendu, ce qui signifie que les sélecteurs CSS traditionnels (`#Email`, `.button-1`, etc.) ne fonctionnent pas.

## 🔄 Approche de Migration

### Solution implémentée : Attributs ARIA

Nous avons ajouté des widgets `Semantics` avec des `label` dans le code Flutter. Ces labels sont exposés comme `aria-label` dans le DOM, ce qui permet à Playwright de les cibler.

```dart
// Flutter
Semantics(
  label: 'Email',
  textField: true,
  child: TextFormField(...),
)
```

```javascript
// Playwright
await page.getByLabel('Email').fill(email);
```

## 📋 Mapping des Sélecteurs

### RegisterScreen (Page d'inscription)

| Élément | Sélecteur Original | Sélecteur Flutter | Widget Dart |
|---------|-------------------|-------------------|-------------|
| Champ Prénom | `input#FirstName` | `page.getByLabel('FirstName')` | `Semantics(label: 'FirstName')` |
| Champ Nom | `input#LastName` | `page.getByLabel('LastName')` | `Semantics(label: 'LastName')` |
| Champ Email | `input#Email` | `page.getByLabel('Email')` | `Semantics(label: 'Email')` |
| Champ Password | `input#Password` | `page.getByLabel('Password')` | `Semantics(label: 'Password')` |
| Champ Confirm | `input#ConfirmPassword` | `page.getByLabel('ConfirmPassword')` | `Semantics(label: 'ConfirmPassword')` |
| Radio Male | `input#gender-male` | `page.getByLabel('gender-male')` | `Semantics(label: 'gender-male')` |
| Radio Female | `input#gender-female` | `page.getByLabel('gender-female')` | `Semantics(label: 'gender-female')` |
| Bouton Register | `input#register-button` | `page.getByLabel('register-button')` | `Semantics(label: 'register-button')` |
| Message succès | `.result` | `page.getByLabel('registration-success-message')` | `Semantics(label: 'registration-success-message')` |

### LoginScreen (Page de connexion)

| Élément | Sélecteur Original | Sélecteur Flutter | À Implémenter |
|---------|-------------------|-------------------|---------------|
| Champ Email | `input#Email` | `page.getByLabel('Email')` | ✅ TODO |
| Champ Password | `input#Password` | `page.getByLabel('Password')` | ✅ TODO |
| Bouton Login | `.button-1.login-button` | `page.getByLabel('login-button')` | ✅ TODO |
| Message d'erreur | `.validation-summary-errors` | `page.getByLabel('login-error-message')` | ✅ TODO |

### HomeScreen (Page d'accueil)

| Élément | Sélecteur Original | Sélecteur Flutter | À Implémenter |
|---------|-------------------|-------------------|---------------|
| Lien Register | `a.ico-register` | `page.getByLabel('ico-register')` | ✅ TODO |
| Lien Login | `a.ico-login` | `page.getByLabel('ico-login')` | ✅ TODO |
| Lien Logout | `a.ico-logout` | `page.getByLabel('ico-logout')` | ✅ TODO |
| Lien Cart | `a.ico-cart` | `page.getByLabel('ico-cart')` | ✅ TODO |
| Champ recherche | `input#small-searchterms` | `page.getByLabel('search-input')` | ✅ TODO |
| Bouton recherche | `.button-1.search-box-button` | `page.getByLabel('search-button')` | ✅ TODO |
| Email utilisateur | `.account` | `page.getByLabel('user-email')` | ✅ TODO |

### CartScreen (Page panier)

| Élément | Sélecteur Original | Sélecteur Flutter | À Implémenter |
|---------|-------------------|-------------------|---------------|
| Item panier | `.cart-item-row` | `page.getByLabel('cart-item')` | ✅ TODO |
| Nom produit | `.product-name` | `page.getByLabel('product-name')` | ✅ TODO |
| Prix unitaire | `.product-unit-price` | `page.getByLabel('unit-price')` | ✅ TODO |
| Sous-total | `.product-subtotal` | `page.getByLabel('subtotal')` | ✅ TODO |
| Input quantité | `.qty-input` | `page.getByLabel('quantity-input')` | ✅ TODO |
| Bouton Update | `input[name="updatecart"]` | `page.getByLabel('update-cart-button')` | ✅ TODO |
| Checkbox Remove | `input[name="removefromcart"]` | `page.getByLabel('remove-checkbox')` | ✅ TODO |
| Checkbox Terms | `input#termsofservice` | `page.getByLabel('terms-of-service')` | ✅ TODO |
| Bouton Checkout | `button#checkout` | `page.getByLabel('checkout-button')` | ✅ TODO |

### CheckoutScreen (Page commande)

| Élément | Sélecteur Original | Sélecteur Flutter | À Implémenter |
|---------|-------------------|-------------------|---------------|
| Select Pays | `select#BillingNewAddress_CountryId` | `page.getByLabel('billing-country')` | ✅ TODO |
| Input Ville | `input#BillingNewAddress_City` | `page.getByLabel('billing-city')` | ✅ TODO |
| Input Adresse | `input#BillingNewAddress_Address1` | `page.getByLabel('billing-address')` | ✅ TODO |
| Input Code postal | `input#BillingNewAddress_ZipPostalCode` | `page.getByLabel('billing-zip')` | ✅ TODO |
| Input Téléphone | `input#BillingNewAddress_PhoneNumber` | `page.getByLabel('billing-phone')` | ✅ TODO |
| Bouton Continue (étapes) | `.Continue` (dans containers) | `page.getByLabel('continue-button')` | ✅ TODO |
| Bouton Confirm | `input[value="Confirm"]` | `page.getByLabel('confirm-order-button')` | ✅ TODO |

## 🚀 Lancer les Tests Flutter

### Prérequis

1. **Lancer l'application Flutter** (une des options) :
   ```bash
   # Option A: Avec Docker
   cd demowebshop-flutter
   docker-compose up -d
   # Application sur http://localhost:8080

   # Option B: En local
   cd demowebshop-flutter
   flutter run -d chrome --web-port=8080
   ```

2. **Vérifier que l'app est accessible** :
   ```bash
   curl http://localhost:8080
   ```

### Exécuter les Tests

```bash
# Tous les tests Flutter
npm run test:flutter

# Avec interface visible
npm run test:flutter:headed

# Mode UI interactif
npm run test:flutter:ui

# Mode debug
npm run test:flutter:debug
```

## 📝 Exemple de Test Migré

### Avant (Site original)

```javascript
test('Connexion utilisateur', async ({ page }) => {
  await page.goto('/login');

  await page.locator('input#Email').fill('test@example.com');
  await page.locator('input#Password').fill('password123');
  await page.locator('.button-1.login-button').click();

  await expect(page.locator('a.ico-logout')).toBeVisible();
});
```

### Après (Application Flutter)

```javascript
test('Connexion utilisateur', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Flutter Web peut être plus lent

  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByLabel('login-button').click();

  await page.waitForTimeout(1000);
  await expect(page.getByLabel('ico-logout')).toBeVisible();
});
```

### Différences clés

1. **Sélecteurs** : `getByLabel()` au lieu de `locator('input#...')`
2. **Timeouts** : Plus généreux car Flutter Web est plus lent
3. **Waits** : Ajout de `waitForLoadState` et `waitForTimeout` pour Flutter

## ⚠️ Points d'Attention

### 1. Performance
Flutter Web est **plus lent** que du HTML classique au premier chargement. Ajoutez des timeouts :
```javascript
await page.waitForTimeout(2000); // Après navigation
```

### 2. Chargement initial
Attendez que Flutter soit complètement initialisé :
```javascript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000);
```

### 3. Navigation
Les routes Flutter peuvent se comporter différemment :
```javascript
// Vérifier l'URL de manière flexible
await expect(page).toHaveURL(/.*register/);
```

### 4. Messages d'erreur
Les messages peuvent apparaître dans des Snackbars (notifications temporaires) :
```javascript
const errorMessage = page.getByLabel('error-message');
if (await errorMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
  await expect(errorMessage).toContainText(/error/i);
}
```

## 📊 État d'Avancement

| Screen | Labels ajoutés | Tests créés | Statut |
|--------|---------------|-------------|--------|
| RegisterScreen | ✅ 100% (9 labels) | ✅ Exemple complet | ✅ Prêt |
| LoginScreen | ✅ 100% (5 labels) | ⏳ À créer | 🟡 Labels OK |
| HomeScreen | ✅ 100% (7 labels) | ⏳ À créer | 🟡 Labels OK |
| CartScreen | ✅ 100% (10 labels) | ⏳ À créer | 🟡 Labels OK |
| CheckoutScreen | ✅ 100% (12 labels) | ⏳ À créer | 🟡 Labels OK |

**Total : 43 labels Semantics ajoutés sur 5 screens ✅**

## 🎯 Prochaines Étapes

1. ✅ RegisterScreen - Labels ajoutés et tests créés
2. ✅ LoginScreen - Labels Semantics ajoutés (5 labels)
3. ✅ HomeScreen - Labels Semantics ajoutés (7 labels)
4. ✅ CartScreen - Labels Semantics ajoutés (10 labels)
5. ✅ CheckoutScreen - Labels Semantics ajoutés (12 labels)
6. ⏳ Créer les tests Playwright adaptés pour LoginScreen
7. ⏳ Créer les tests Playwright adaptés pour HomeScreen
8. ⏳ Créer les tests Playwright adaptés pour CartScreen
9. ⏳ Créer les tests Playwright adaptés pour CheckoutScreen

## 🔗 Ressources

- [Flutter Semantics](https://api.flutter.dev/flutter/widgets/Semantics-class.html)
- [Playwright getByLabel](https://playwright.dev/docs/locators#locate-by-label)
- [Flutter Web Rendering](https://docs.flutter.dev/platform-integration/web/renderers)

## 💡 Conseils

1. **Utilisez getByLabel()** plutôt que getByRole() pour plus de flexibilité
2. **Soyez patient** avec les timeouts - Flutter Web est plus lent
3. **Testez en headed mode** d'abord pour voir ce qui se passe
4. **Vérifiez le DOM** avec les DevTools pour trouver les bons labels

---

**Note** : Ce guide évoluera au fur et à mesure que nous ajoutons les labels Semantics aux autres screens.
