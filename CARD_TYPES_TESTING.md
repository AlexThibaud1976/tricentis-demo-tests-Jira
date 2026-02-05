# 💳 Tests des Types de Cartes de Crédit

## 📋 Vue d'ensemble

Le fichier [`tests/27b-card-types.spec.js`](tests/27b-card-types.spec.js) contient une suite complète de tests pour valider l'acceptation de différents types de cartes de crédit dans le processus de checkout.

**Objectif** : Garantir que le site accepte tous les types de cartes de crédit courants.

---

## 🎯 Cartes Testées

### Source des numéros de test
Les numéros de cartes utilisés proviennent de la documentation officielle **Adyen** :
[Test Card Numbers](https://docs.adyen.com/development-resources/test-cards-and-credentials/test-card-numbers)

### Liste des cartes

| Type de Carte | Numéro de Test | CVV | Expiration | Test ID |
|---------------|----------------|-----|------------|---------|
| **Visa** | 4111 1111 1111 1111 | 737 | 12/2027 | DEMO-CARD-001 |
| **Mastercard** | 5555 5555 5555 4444 | 737 | 12/2027 | DEMO-CARD-002 |
| **American Express** | 3700 0000 0000 002 | 7373 | 12/2027 | DEMO-CARD-003 |
| **Discover** | 6011 6011 6011 6611 | 737 | 12/2027 | DEMO-CARD-004 |
| **Diners Club** | 3600 6666 3333 44 | 737 | 12/2027 | DEMO-CARD-005 |
| **JCB** | 3569 9900 1009 5841 | 737 | 12/2027 | DEMO-CARD-006 |

---

## 🧪 Structure des Tests

Chaque test suit le même scénario :

1. **Création de compte** utilisateur
2. **Ajout d'un produit** au panier
3. **Passage au checkout** avec remplissage des adresses
4. **Sélection du moyen de paiement** : Credit Card
5. **Remplissage des informations de carte** avec le type spécifique
6. **Validation du checkout** complet
7. **Vérification** de la page de confirmation de commande

---

## 🚀 Exécution des Tests

### Tous les tests de types de cartes
```bash
npx playwright test tests/27b-card-types.spec.js
```

### Test d'un type spécifique
```bash
# Visa uniquement
npx playwright test tests/27b-card-types.spec.js -g "Visa"

# Mastercard uniquement
npx playwright test tests/27b-card-types.spec.js -g "Mastercard"

# American Express uniquement
npx playwright test tests/27b-card-types.spec.js -g "American Express"
```

### Avec projet spécifique
```bash
npx playwright test tests/27b-card-types.spec.js --project=chromium
npx playwright test tests/27b-card-types.spec.js --project=firefox
```

---

## 📊 Résultats Attendus

### ✅ Résumé d'exécution
- **Total tests** : 6
- **Statut attendu** : ✅ 6/6 passent
- **Temps d'exécution** : ~2.3 minutes (avec projet chromium)

### Logs de confirmation
Chaque test affiche un message de confirmation :
```
✅ Shipping method selected: Ground (0.00)
✅ Payment method selected: Credit Card
✅ Credit card info filled: Visa
✅ Order completed with Visa card (4111 1111 1111 1111)
```

---

## 🔧 Utilisation de fillCreditCardInfo()

La fonction `fillCreditCardInfo()` dans [`utils/helpers.js`](utils/helpers.js) a été améliorée pour supporter deux modes :

### Mode 1 : Par type de carte (string)
```javascript
await fillCreditCardInfo(page, 'visa');
await fillCreditCardInfo(page, 'mastercard');
await fillCreditCardInfo(page, 'amex');
await fillCreditCardInfo(page, 'discover');
await fillCreditCardInfo(page, 'diners');
await fillCreditCardInfo(page, 'jcb');
```

### Mode 2 : Par objet personnalisé
```javascript
await fillCreditCardInfo(page, {
  holderName: 'Custom Name',
  number: '4111111111111111',
  expMonth: '12',
  expYear: '2027',
  cvv: '737'
});
```

---

## 📦 Constante TEST_CARDS

Les détails des cartes sont stockés dans la constante `TEST_CARDS` exportée depuis `utils/helpers.js` :

```javascript
const TEST_CARDS = {
  visa: { 
    holderName: 'Visa Test', 
    number: '4111111111111111', 
    expMonth: '12', 
    expYear: '2027', 
    cvv: '737', 
    type: 'Visa' 
  },
  // ... autres cartes
};
```

Cette constante peut être réutilisée dans d'autres tests :
```javascript
const { TEST_CARDS } = require('../utils/helpers');
console.log(TEST_CARDS.visa.number); // "4111111111111111"
```

---

## 🏷️ Tags et Annotations

Chaque test est annoté avec :
- **test_key** : Identifiant unique (DEMO-CARD-001 à DEMO-CARD-006)
- **tags** : 
  - `@payment` - Catégorie paiement
  - `@creditcard` - Moyen de paiement carte
  - `@visa`, `@mastercard`, `@amex`, `@discover`, `@diners`, `@jcb` - Type spécifique

### Filtrage par tags
```bash
# Tous les tests de cartes
npx playwright test --grep "@creditcard"

# Tests Visa uniquement
npx playwright test --grep "@visa"
```

---

## 📈 Couverture

### Avant ces tests
- ❌ Un seul test générique "Credit Card"
- ❌ Pas de validation des différents types de cartes
- ❌ Couverture limitée des moyens de paiement

### Après ces tests
- ✅ 6 types de cartes testés individuellement
- ✅ Validation complète du flux pour chaque type
- ✅ Numéros de test officiels et validés
- ✅ Meilleure couverture des cas de paiement

---

## 🔗 Liens Connexes

- [Tests des moyens de paiement (27-payment-methods.spec.js)](tests/27-payment-methods.spec.js)
- [Helpers checkout (utils/helpers.js)](utils/helpers.js)
- [Documentation Adyen - Test Cards](https://docs.adyen.com/development-resources/test-cards-and-credentials/test-card-numbers)
- [Couverture checkout complète (CHECKOUT_COVERAGE_EXTENSION.md)](CHECKOUT_COVERAGE_EXTENSION.md)

---

## 📝 Notes Importantes

### ⚠️ Numéros de test uniquement
Les numéros de cartes fournis sont **exclusivement pour les tests**. Ils ne fonctionneront pas en environnement de production.

### 🔄 Maintenance
Si les numéros de test Adyen sont mis à jour, modifier la constante `TEST_CARDS` dans `utils/helpers.js`.

### 🌐 Compatibilité
Ces tests fonctionnent avec tous les navigateurs supportés (Chromium, Firefox, WebKit) et peuvent être exécutés sur BrowserStack.
