# Analyse des Options de Checkout - Résultats

## 📝 Contexte

Extraction des options disponibles sur https://demowebshop.tricentis.com/ pour créer une couverture de test complète des fonctionnalités de checkout.

**Date d'analyse**: ${new Date().toISOString().split('T')[0]}

---

## 🚚 Méthodes de Livraison (Shipping Methods)

### Options Disponibles (3)

| Index | ID | Value | Label | Prix |
|-------|----------|--------------------------------|----------------|--------|
| 0 | `shippingoption_0` | `Ground___Shipping.FixedRate` | Ground | 0.00 € |
| 1 | `shippingoption_1` | `Next Day Air___Shipping.FixedRate` | Next Day Air | 0.00 € |
| 2 | `shippingoption_2` | `2nd Day Air___Shipping.FixedRate` | 2nd Day Air | 0.00 € |

### Notes
- Les méthodes de livraison ne sont disponibles que pour les **produits physiques**
- Les produits virtuels (gift cards, e-books) sautent les étapes de livraison
- Tous les frais de livraison sont actuellement à 0.00 € (configuration demo)
- Pattern des sélecteurs: `input#shippingoption_{N}` et `label[for="shippingoption_{N}"]`

---

## 💳 Moyens de Paiement (Payment Methods)

### Options Disponibles (4)

| Index | ID | Value | Label | Frais | Champs Requis |
|-------|-------|------------------------------|------------------------------|-------|-------------------|
| 0 | `paymentmethod_0` | `Payments.CashOnDelivery` | Cash On Delivery (COD) | 7.00 € | Aucun |
| 1 | `paymentmethod_1` | `Payments.CheckMoneyOrder` | Check / Money Order | 5.00 € | À analyser |
| 2 | `paymentmethod_2` | `Payments.Manual` | Credit Card | - | Carte bancaire |
| 3 | `paymentmethod_3` | `Payments.PurchaseOrder` | Purchase Order | - | Numéro PO |

### Notes
- Pattern des sélecteurs: `input#paymentmethod_{N}` et `label[for="paymentmethod_{N}"]`
- Chaque méthode a une page "Payment Information" différente
- COD (paymentmethod_0) ne nécessite aucune information supplémentaire
- Credit Card (paymentmethod_2) nécessite: Cardholder Name, Card Number, Expiration Date, CVV
- Purchase Order (paymentmethod_3) nécessite: PO Number

---

## 📊 Couverture de Test Actuelle

### Tests Existants
- ✅ **05-order-checkout.spec.js**: Checkout complet mais utilise uniquement:
  - `shippingoption_0` (Ground)
  - `paymentmethod_0` (COD)

### Lacunes de Couverture
- ❌ Next Day Air (shippingoption_1) - **NON TESTÉ**
- ❌ 2nd Day Air (shippingoption_2) - **NON TESTÉ** 
- ❌ Check / Money Order (paymentmethod_1) - **NON TESTÉ**
- ❌ Credit Card (paymentmethod_2) - **NON TESTÉ**
- ❌ Purchase Order (paymentmethod_3) - **NON TESTÉ**
- ❌ Combinaisons shipping × payment - **NON TESTÉES**

---

## 📈 Plan de Tests Recommandés

### Nouveaux Fichiers de Test (40-60 tests)

#### 1. **26-shipping-methods.spec.js** (~9 tests)
- Test de chaque méthode de livraison individuellement
- Vérification des prix
- Validation des délais estimés
- Shipping methods avec différents produits (livre, électronique, etc.)

#### 2. **27-payment-methods.spec.js** (~12 tests)
- Test de chaque moyen de paiement avec validation des champs
- COD: validation du flow sans champs additionnels
- Check/Money Order: validation des informations
- Credit Card: validation des champs de carte
- Purchase Order: validation du numéro PO
- Cas d'erreur pour chaque méthode

#### 3. **28-checkout-combinations.spec.js** (~12 tests)
- Combinaisons shipping × payment (3 × 4 = 12 tests)
- Ground + COD
- Ground + Check
- Ground + Credit Card
- Ground + PO
- Next Day Air + COD
- Next Day Air + Check
- etc.

#### 4. **29-shipping-addresses.spec.js** (~8 tests)
- Adresse de livraison identique à facturation
- Adresse de livraison différente
- Validation des champs d'adresse
- Adresses internationales

#### 5. **30-payment-validation.spec.js** (~10-15 tests)
- Carte bancaire expirée
- Numéro de carte invalide
- CVV incorrect
- PO number vide
- Champs requis manquants

---

## 🛠️ Helpers à Créer

### Dans `utils/helpers.js`

```javascript
// Sélectionner une méthode de livraison
async function selectShippingMethod(page, index) {
  await page.locator(`input#shippingoption_${index}`).check();
  await page.locator('#shipping-method-buttons-container input[value="Continue"]').click();
  await page.waitForLoadState('networkidle');
}

// Sélectionner un moyen de paiement
async function selectPaymentMethod(page, index) {
  await page.locator(`input#paymentmethod_${index}`).check();
  await page.locator('#payment-method-buttons-container input[value="Continue"]').click();
  await page.waitForLoadState('networkidle');
}

// Remplir une adresse de livraison
async function fillShippingAddress(page, addressData, differentFromBilling = true) {
  if (differentFromBilling) {
    await page.locator('input#ShipToSameAddress').uncheck();
    // Remplir les champs d'adresse...
  }
}

// Remplir les informations de carte bancaire
async function fillCreditCardInfo(page, cardData) {
  await page.locator('input#CardholderName').fill(cardData.holderName);
  await page.locator('input#CardNumber').fill(cardData.number);
  await page.locator('select#ExpireMonth').selectOption(cardData.expMonth);
  await page.locator('select#ExpireYear').selectOption(cardData.expYear);
  await page.locator('input#CardCode').fill(cardData.cvv);
}

// Remplir un Purchase Order
async function fillPurchaseOrder(page, poNumber) {
  await page.locator('input#PurchaseOrderNumber').fill(poNumber);
}
```

---

## 📋 Prochaines Étapes

1. ✅ **Analyse terminée** - Options extraites
2. ⏳ **Créer helpers** - Fonctions réutilisables dans `utils/helpers.js`
3. ⏳ **Créer tests shipping** - `26-shipping-methods.spec.js`
4. ⏳ **Créer tests payment** - `27-payment-methods.spec.js`
5. ⏳ **Créer tests combinaisons** - `28-checkout-combinations.spec.js`
6. ⏳ **Créer tests addresses** - `29-shipping-addresses.spec.js`
7. ⏳ **Créer tests validation** - `30-payment-validation.spec.js`
8. ⏳ **Intégration Jira** - Ajouter custom fields et labels
9. ⏳ **Documentation** - Mettre à jour README et guides

---

## ⚠️ Limitations Connues

1. **Analyse Payment Info incomplète**: Le test a timeout lors du retour arrière pour analyser Check/Money Order en détail
2. **Prix en mode demo**: Tous les shipping methods montrent 0.00 € (valeurs de démonstration)
3. **Validation des cartes**: À vérifier si le site accepte vraiment les paiements ou si c'est une simulation

---

## 📚 Références

- Test d'origine: `tests/05-order-checkout.spec.js`
- Script d'analyse: `tests/temp_analyze.spec.js`
- Site web: https://demowebshop.tricentis.com/
