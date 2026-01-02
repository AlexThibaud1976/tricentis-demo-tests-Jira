# Sélection du périmètre de test

## Vue d'ensemble

Le workflow GitHub Actions permet maintenant de sélectionner le **périmètre de test** à exécuter, offrant une flexibilité totale pour lancer soit tous les tests, soit une catégorie spécifique.

## Périmètres disponibles

| Valeur | Description | Fichier(s) exécuté(s) |
|--------|-------------|----------------------|
| **all** | Tous les tests | `tests/*.spec.js` (tous) |
| **sanity** | Tests de sanité rapides | `tests/99-sanity.spec.js` |
| **account-creation** | Tests de création de compte | `tests/01-account-creation.spec.js` |
| **login-logout** | Tests de connexion/déconnexion | `tests/02-login-logout.spec.js` |
| **catalog-navigation** | Tests de navigation catalogue | `tests/03-catalog-navigation.spec.js` |
| **cart-management** | Tests de gestion du panier | `tests/04-cart-management.spec.js` |
| **order-checkout** | Tests de commande/checkout | `tests/05-order-checkout.spec.js` |

## Utilisation dans GitHub Actions

### Interface GitHub

1. Allez sur **Actions** dans votre repo GitHub
2. Sélectionnez le workflow **Playwright Tests**
3. Cliquez sur **Run workflow**
4. Remplissez les paramètres:
   - **Jira Test Plan Key**: Votre clé de test plan (ex: DEMO-123)
   - **OS**: Windows ou Mac
   - **OS Version**: Choisissez la version
   - **Browser**: chrome, firefox, safari, etc.
   - **Browser Version**: latest, 144, 143, etc.
   - **Test Scope**: 👉 **Sélectionnez le périmètre de test**

### Depuis Jira avec Automation

Pour déclencher le workflow depuis Jira, ajoutez le paramètre `testScope` dans le JSON payload:

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "{{issue.customfield_10048}}",
    "osVersion": "{{issue.customfield_10049}}",
    "browser": "{{issue.customfield_10050}}",
    "browserVersion": "{{issue.customfield_10051}}",
    "testScope": "all"
  }
}
```

## Cas d'usage

### 🚀 Tests rapides (Sanity)
Pour vérifier rapidement que la plateforme fonctionne:
```
testScope: sanity
```
⏱️ Durée: ~1 minute

### 🎯 Tests ciblés
Pour tester une fonctionnalité spécifique après un changement:
```
testScope: cart-management
```
⏱️ Durée: Variable selon la catégorie

### 🌐 Suite complète
Pour une validation complète avant une release:
```
testScope: all
```
⏱️ Durée: ~15-30 minutes (selon configuration)

## Modification de la règle d'automatisation Jira

### Option 1: Champ personnalisé dans Jira

Créez un nouveau champ personnalisé **"Test Scope"** dans Jira:
- **Type**: Select List (single choice)
- **Options**: all, sanity, account-creation, login-logout, catalog-navigation, cart-management, order-checkout
- **Issue Type**: Test Execution

Puis dans l'automation Jira, utilisez:
```json
{
  "testScope": "{{issue.customfield_10052}}"
}
```
*(Remplacez `customfield_10052` par l'ID de votre champ)*

### Option 2: Valeur fixe par défaut

Si vous voulez toujours exécuter tous les tests par défaut depuis Jira:
```json
{
  "testScope": "all"
}
```

### Option 3: Sélection basée sur le type de ticket

Dans l'automation Jira, utilisez une condition:
```json
{
  "testScope": "{{#if(equals(issue.labels,'quick-test'))}}sanity{{else}}all{{/if}}"
}
```

## Avantages

✅ **Économie de temps**: Tests ciblés plus rapides  
✅ **Économie de coûts**: Moins de minutes BrowserStack consommées  
✅ **Feedback rapide**: Tests sanity en 1 minute  
✅ **Flexibilité**: Choix du périmètre selon le besoin  
✅ **Tests de régression**: Suite complète disponible quand nécessaire

## Exemples de scénarios

### Scénario 1: Développement d'une nouvelle fonctionnalité panier
```
testScope: cart-management
```
Permet de tester uniquement la gestion du panier sans relancer toute la suite.

### Scénario 2: Vérification rapide après déploiement
```
testScope: sanity
```
Confirme que le site est accessible et fonctionnel.

### Scénario 3: Validation avant release en production
```
testScope: all
```
Exécute la suite complète de tests de non-régression.

## Configuration technique

Le périmètre de test est géré par le step **"Determine test pattern"** dans le workflow:
- Il convertit la sélection en pattern de fichier Playwright
- Passe le pattern à la commande `npx playwright test`
- Génère une description lisible pour les logs

## Notes importantes

⚠️ **Ordre d'exécution**: Quand `testScope=all`, les tests s'exécutent dans l'ordre des noms de fichiers (01, 02, 03, etc.)  
⚠️ **Dépendances**: Si des tests dépendent d'autres tests, sélectionnez le périmètre approprié  
⚠️ **BrowserStack**: Chaque exécution compte dans votre quota BrowserStack

## Questions fréquentes

### Q: Puis-je exécuter plusieurs catégories mais pas toutes ?
R: Actuellement, c'est soit une catégorie, soit toutes. Pour exécuter plusieurs catégories spécifiques, lancez plusieurs workflows.

### Q: Le test sanity exécute quels tests exactement ?
R: Le fichier `99-sanity.spec.js` contient un test minimaliste de vérification de la plateforme.

### Q: Comment ajouter une nouvelle catégorie ?
R: 
1. Créez le fichier de test (ex: `06-new-category.spec.js`)
2. Ajoutez l'option dans `testScope` du workflow
3. Ajoutez le case dans le step "Determine test pattern"

---

**Dernière mise à jour**: 2 janvier 2026  
**Version du workflow**: 2.0
