# Sélection du périmètre de test

## Vue d'ensemble

Le workflow GitHub Actions permet maintenant de sélectionner le **périmètre de test** à exécuter, offrant une flexibilité totale pour lancer soit tous les tests, soit une catégorie spécifique.

## Périmètres disponibles

### 🎯 Tests généraux
| Valeur | Description | Fichier(s) exécuté(s) |
|--------|-------------|----------------------|
| **all** | Tous les tests | `tests/*.spec.js` (tous) |
| **sanity** | Tests de sanité rapides | `tests/99-sanity.spec.js` |

### 👤 Gestion de compte
| Valeur | Description | Fichier(s) exécuté(s) |
|--------|-------------|----------------------|
| **account-creation** | Tests de création de compte | `tests/01-account-creation.spec.js` |
| **login-logout** | Tests de connexion/déconnexion | `tests/02-login-logout.spec.js` |
| **account-management** | Tests de gestion de compte | `tests/12-account-management.spec.js` |

### 📦 Catalogue et navigation
| Valeur | Description | Fichier(s) exécuté(s) |
|--------|-------------|----------------------|
| **catalog-navigation** | Tests de navigation catalogue | `tests/03-catalog-navigation.spec.js` |
| **product-search** | Tests de recherche de produits | `tests/06-product-search.spec.js` |
| **product-filtering** | Tests de filtrage de produits | `tests/14-product-filtering.spec.js` |
| **manufacturer-filter** | Tests de filtre fabricant | `tests/20-manufacturer-filter.spec.js` |
| **new-products** | Tests nouveaux produits | `tests/21-new-products.spec.js` |

### 🛍️ Produits
| Valeur | Description | Fichier(s) exécuté(s) |
|--------|-------------|----------------------|
| **configurable-products** | Tests produits configurables | `tests/15-configurable-products.spec.js` |
| **product-comparison** | Tests comparaison de produits | `tests/08-product-comparison.spec.js` |
| **product-reviews** | Tests avis produits | `tests/09-product-reviews.spec.js` |
| **product-tags** | Tests tags produits | `tests/16-product-tags.spec.js` |
| **recently-viewed** | Tests produits récemment consultés | `tests/17-recently-viewed.spec.js` |
| **email-friend** | Tests recommandation par email | `tests/18-email-friend.spec.js` |

### 🛒 Panier et commandes
| Valeur | Description | Fichier(s) exécuté(s) |
|--------|-------------|----------------------|
| **cart-management** | Tests de gestion du panier | `tests/04-cart-management.spec.js` |
| **cart-updates** | Tests de mise à jour du panier | `tests/25-cart-updates.spec.js` |
| **order-checkout** | Tests de commande/checkout | `tests/05-order-checkout.spec.js` |
| **order-history** | Tests d'historique des commandes | `tests/13-order-history.spec.js` |
| **guest-checkout** | Tests de checkout invité | `tests/24-guest-checkout.spec.js` |

### ⭐ Liste de souhaits
| Valeur | Description | Fichier(s) exécuté(s) |
|--------|-------------|----------------------|
| **wishlist-management** | Tests de gestion de la wishlist | `tests/07-wishlist-management.spec.js` |

### 📧 Communication
| Valeur | Description | Fichier(s) exécuté(s) |
|--------|-------------|----------------------|
| **newsletter-subscription** | Tests d'inscription newsletter | `tests/10-newsletter-subscription.spec.js` |
| **contact-form** | Tests de formulaire de contact | `tests/11-contact-form.spec.js` |

### 🌐 Communauté et contenu
| Valeur | Description | Fichier(s) exécuté(s) |
|--------|-------------|----------------------|
| **community-poll** | Tests de sondage communautaire | `tests/19-community-poll.spec.js` |
| **news-blog** | Tests actualités/blog | `tests/23-news-blog.spec.js` |
| **footer-links** | Tests liens footer | `tests/22-footer-links.spec.js` |

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

⚠️ **IMPORTANT** : Le step "Determine test pattern" dans le workflow ne gère actuellement que les 6 premiers tests (01-05) plus sanity. Les autres périmètres sont **listés dans l'interface** mais **ne sont pas encore implémentés** dans le case statement.

Pour activer les périmètres 06-25, il faut ajouter les cases correspondants dans `.github/workflows/playwright.yml`:

```bash
"product-search")
  echo "pattern=tests/06-product-search.spec.js" >> $GITHUB_OUTPUT
  echo "description=Product Search Tests" >> $GITHUB_OUTPUT
  ;;
# ... etc pour chaque périmètre  
⚠️ **Reporter unique**: Seul `xray-report.xml` est généré (plus de `results.xml`)  
⚠️ **Périmètres 06-25**: Non encore implémentés dans le workflow - sélectionner ces périmètres exécute TOUS les tests
```

**Comportement actuel** : Si vous sélectionnez un périmètre non implémenté (ex: `product-search`), le workflow exécute **tous les tests** (comportement par défaut du case `*`).

Le périmètre de test est géré par le step **"Determine test pattern"** dans le workflow:
- Il convertit la sélection en pattern de fichier Playwright
- Passe le pattern à la commande `npx playwright test`
- Génère une description lisible pour les logs
- Génère `xray-report.xml` (reporter Xray uniquement, plus de `results.xml`)

## Notes importantes

⚠️ **Ordre d'exécution**: Quand `testScope=all`, les tests s'exécutent dans l'ordre des noms de fichiers (01, 02, 03, etc.)  
⚠️ **Dépendances**: Si des tests dépendent d'autres tests, sélectionnez le périmètre approprié  
⚠️ **BrowserStack**: Chaque exécution compte dans votre quota BrowserStack

## Questions fréquentes
 **Note**: Les périmètres 06-25 ne sont pas encore implémentés dans le workflow.

### Q: Le test sanity exécute quels tests exactement ?
R: Le fichier `99-sanity.spec.js` contient un test minimaliste de vérification de la plateforme.

### Q: Comment ajouter une nouvelle catégorie ?
R: 
1. Créez le fichier de test (ex: `26-new-category.spec.js`)
2. Ajoutez l'option dans `testScope` du workflow (section inputs)
3. Ajoutez le case dans le step "Determine test pattern"
4. Mettez à jour ce fichier de documentation

### Q: Pourquoi certains périmètres exécutent tous les tests ?
R: Les périmètres listés dans l'interface (06-25) ne sont pas encore implémentés dans le case statement. Le case `*` (défaut) exécute tous les tests. Il faut ajouter les cases manquants dans le workflow.

---

**Dernière mise à jour**: 2 février 2026  
**Version du workflow**: 2.1  
**Statut**: 23 périmètres listés, 7 implémentés (01-05, sanity, all)
**Dernière mise à jour**: 2 février 2026  
**Version du workflow**: 2.0
