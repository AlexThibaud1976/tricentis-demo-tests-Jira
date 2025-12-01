# Tests Playwright pour l'Application Flutter

Ce dossier contient les tests Playwright adaptés pour tester l'application Flutter.

## Différences avec les tests originaux

Les tests Flutter utilisent des **sélecteurs ARIA** au lieu des sélecteurs CSS/ID traditionnels car Flutter Web génère un DOM différent.

### Exemples de sélecteurs

#### Tests originaux (HTML classique)
```javascript
await page.locator('input#Email').fill(email);
await page.locator('input#Password').fill(password);
await page.locator('.button-1.login-button').click();
```

#### Tests Flutter (ARIA labels)
```javascript
await page.getByLabel('Email').fill(email);
await page.getByLabel('Password').fill(password);
await page.getByLabel('register-button').click();
```

## Sélecteurs disponibles

Les widgets Flutter avec `Semantics(label: 'xxx')` sont exposés comme `aria-label="xxx"` dans le DOM.

### RegisterScreen
- `getByLabel('FirstName')` - Champ prénom
- `getByLabel('LastName')` - Champ nom
- `getByLabel('Email')` - Champ email
- `getByLabel('Password')` - Champ mot de passe
- `getByLabel('ConfirmPassword')` - Champ confirmation
- `getByLabel('gender-male')` - Radio bouton homme
- `getByLabel('gender-female')` - Radio bouton femme
- `getByLabel('register-button')` - Bouton d'inscription
- `getByLabel('registration-success-message')` - Message de succès

### LoginScreen
- `getByLabel('Email')` - Champ email
- `getByLabel('Password')` - Champ mot de passe
- `getByLabel('login-button')` - Bouton de connexion

### HomeScreen
- `getByLabel('ico-register')` - Lien inscription
- `getByLabel('ico-login')` - Lien connexion
- `getByLabel('ico-logout')` - Lien déconnexion
- `getByLabel('ico-cart')` - Lien panier
- `getByLabel('search-input')` - Barre de recherche

## Lancement des tests

```bash
# Avec l'application Flutter en local
flutter run -d chrome --web-port=8080

# Dans un autre terminal
npm run test:flutter
```

## Configuration

Le fichier `playwright.config.flutter.js` à la racine contient la configuration spécifique.

## État actuel

✅ RegisterScreen - Labels ajoutés (9 labels) + Tests créés
✅ LoginScreen - Labels ajoutés (5 labels)
✅ HomeScreen - Labels ajoutés (7 labels)
✅ CartScreen - Labels ajoutés (10 labels)
✅ CheckoutScreen - Labels ajoutés (12 labels)

**Total: 43 labels Semantics ajoutés - Tous les écrans sont prêts pour les tests ✅**

## Notes importantes

1. **Flutter Web est différent** : Le DOM généré par Flutter n'est pas du HTML traditionnel
2. **ARIA labels** : Flutter expose les `semanticsLabel` comme `aria-label`
3. **Performance** : Flutter Web peut être plus lent au premier chargement
4. **Compatibilité** : Les fonctionnalités sont identiques, seuls les sélecteurs changent
