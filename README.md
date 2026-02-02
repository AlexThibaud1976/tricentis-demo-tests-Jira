[![Playwright Tests](https://github.com/AlexThibaud1976/tricentis-demo-tests/actions/workflows/playwright.yml/badge.svg)](https://github.com/AlexThibaud1976/tricentis-demo-tests/actions/workflows/playwright.yml)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![Playwright](https://img.shields.io/badge/Playwright-45ba4b?logo=Playwright&logoColor=white)
![GitHub last commit](https://img.shields.io/github/last-commit/AlexThibaud1976/tricentis-demo-tests-Jira)
![GitHub stars](https://img.shields.io/github/stars/AlexThibaud1976/tricentis-demo-tests-Jira?style=social)
![Jira](https://img.shields.io/badge/jira-%230A0FFF.svg?logo=jira&logoColor=white)
![Xray](https://img.shields.io/badge/Xray-Test%20Management-blue)
![BrowserStack](https://img.shields.io/badge/BrowserStack-Enabled-orange?logo=browserstack&logoColor=white)
![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)

# 🧪 Suite de Tests Automatisés - Demo Web Shop Tricentis

Suite complète de tests end-to-end automatisés avec Playwright pour le site de démonstration [Demo Web Shop Tricentis](https://demowebshop.tricentis.com/).

**🎯 Reporter unique** : Utilise exclusivement `@xray-app/playwright-junit-reporter` pour une intégration optimale avec Xray Cloud.
**📸 Captures pleine page** : Screenshots complets (`fullPage: true`) sur échecs et evidence.

## 📋 Description

Ce projet contient **plus de 20 tests automatisés** couvrant l'ensemble des fonctionnalités du site e-commerce :

### 🎯 Fonctionnalités Core
- 🧾 **Création et gestion de compte** (création, modification, gestion des adresses, changement de mot de passe)
- 🔐 **Authentification** (login/logout, cas passants et non-passants)
- 🧭 **Navigation dans le catalogue** (catégories, recherche, filtres)
- 🛒 **Gestion du panier** (ajout, modification, suppression, codes promo)
- ✅ **Passage de commande** (checkout complet, checkout invité)

### 🌟 Fonctionnalités Avancées
- 🔍 **Recherche de produits** (recherche simple, recherche avancée, filtres)
- ⭐ **Liste de souhaits** (wishlist)
- 🛠️ **Produits configurables** (ordinateurs personnalisés, options multiples)
- 📧 **Newsletter & Contact** (inscription newsletter, formulaire de contact)
- ��� **Historique des commandes** (consultation, détails)
- 🏷️ **Tags produits** (navigation par tags)
- 👀 **Produits récemment consultés**
- 📮 **Recommandation par email** (email a friend)
- 🗳️ **Votes communautaires** (community poll)
- 🏭 **Filtres fabricants**
- 🆕 **Nouveaux produits**
- 🔗 **Liens footer** (vérification navigation)
- 📰 **Blog/Actualités** (consultation articles)

## 🚀 Installation

### ⚙️ Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. Cloner le repository :
```bash
git clone https://github.com/AlexThibaud1976/tricentis-demo-tests-Jira.git
cd tricentis-demo-tests-Jira
```

2. Installer les dépendances :
```bash
npm install
```

3. Installer les navigateurs Playwright :
```bash
npx playwright install
```

## 🧪 Exécution des tests

### Tous les tests

```bash
npm test
```

### Tests avec interface graphique (mode debug)

```bash
npm run test:headed
```

### Tests avec UI Mode (interface interactive)

```bash
npm run test:ui
```

### Tests en mode debug

```bash
npm run test:debug
```

### Exécution par catégorie

```bash
# Tests de sanité (smoke tests)
npm run test:sanity

# Tests de création de compte
npm run test:creation

# Tests de login/logout
npm run test:login

# Tests de navigation dans le catalogue
npm run test:catalog

# Tests de gestion du panier
npm run test:cart

# Tests de passage de commande
npm run test:order
```

## 📁 Structure du projet

```
tricentis-demo-tests-Jira/
├── .github/
│   └── workflows/
│       └── playwright.yml           # CI/CD avec GitHub Actions
├── tests/
│   ├── 01-account-creation.spec.js  # Tests création de compte
│   ├── 02-login-logout.spec.js      # Tests authentification
│   ├── 03-catalog-navigation.spec.js # Tests navigation catalogue
│   ├── 04-cart-management.spec.js   # Tests gestion panier
│   ├── 05-order-checkout.spec.js    # Tests passage commande
│   ├── 06-product-search.spec.js    # Tests recherche produits
│   ├── 07-wishlist.spec.js          # Tests liste de souhaits
│   ├── 08-product-comparison.spec.js # Tests comparaison
│   ├── 09-newsletter.spec.js        # Tests newsletter
│   ├── 10-contact-form.spec.js      # Tests formulaire contact
│   ├── 11-account-management.spec.js # Tests gestion compte
│   ├── 12-order-history.spec.js     # Tests historique commandes
│   ├── 13-product-filtering.spec.js # Tests filtres produits
│   ├── 14-configurable-products.spec.js # Tests produits configurables
│   ├── 16-product-tags.spec.js      # Tests tags produits
│   ├── 17-recently-viewed.spec.js   # Tests produits consultés
│   ├── 18-email-friend.spec.js      # Tests recommandation email
│   ├── 19-community-poll.spec.js    # Tests votes communautaires
│   ├── 20-manufacturer-filter.spec.js # Tests filtre fabricant
│   ├── 21-new-products.spec.js      # Tests nouveaux produits
│   ├── 22-footer-links.spec.js      # Tests liens footer
│   ├── 23-news-blog.spec.js         # Tests blog actualités
│   ├── 24-guest-checkout.spec.js    # Tests checkout invité
│   ├── 25-cart-update.spec.js       # Tests mise à jour panier
│   └── 99-sanity.spec.js            # Tests de sanité
├── utils/
│   └── helpers.js                    # Utilitaires réutilisables
├── scripts/
│   ├── resolve-browserstack-config.js # Configuration BrowserStack dynamique
│   ├── upload-xray.ps1              # Upload résultats vers Xray
│   ├── jira-post-execution.ps1      # Enrichissement Jira
│   ├── get-browserstack-build-link.js # Récupération lien BrowserStack
│   └── add-timestamps-to-xray-report.js # Ajout timestamps au rapport Xray
├── playwright.config.js              # Configuration locale
├── playwright.config.browserstack.js # Configuration BrowserStack
├── browserstack.config.js            # Capacités BrowserStack
├── test-fixtures.js                  # Fixtures Playwright custom
└── package.json
```

## 🔗 Intégration Jira / Xray

### ✨ Fonctionnalités d'intégration

- **Remontée automatique des résultats** vers Xray après chaque exécution
- **Annotations enrichies** dans les rapports XML :
  - `test_key` : Identifiant du test Jira
  - `tags` : Tags pour classification
  - `test_description` : Description détaillée
  - **Timestamps** : `started-at` et `finished-at` pour chaque test
  - **Evidence** : Screenshots encodés en Base64 intégrés au rapport
- **Champs personnalisés Jira** mis à jour automatiquement :
  - OS & version
  - Navigateur & version
  - Nom de l'appareil
  - Périmètre de test
  - Lien vers le build BrowserStack
  - Rapport HTML attaché
- **Labels dynamiques** : Résultat (PASS/FAIL) et nom de l'appareil

### 📊 Configuration

Les rapports Xray sont générés automatiquement avec `@xray-app/playwright-junit-reporter` et enrichis par les scripts :
- `add-timestamps-to-xray-report.js` : Ajoute les timestamps et evidence
- `upload-xray.ps1` : Upload vers Xray
- `jira-post-execution.ps1` : Enrichit les tickets Jira

## 🌐 Intégration BrowserStack

### 🎯 Exécution dynamique

Le projet supporte l'**exécution dynamique sur BrowserStack** avec sélection des paramètres :

- **Systèmes d'exploitation** : Windows (7, 8, 8.1, 10, 11), macOS (Big Sur, Monterey, Ventura, Sonoma)
- **Navigateurs** : Chrome, Firefox, Safari, Edge
- **Versions** : Dernière version (`latest`) ou version spécifique

### 🚀 Lancement depuis Jira

Configurez une **Automation Rule Jira** pour déclencher les tests directement depuis un ticket avec :
- Sélection de l'OS et de la version
- Sélection du navigateur et de la version
- Sélection du périmètre de test (all, sanity, account-creation, etc.)

Voir la documentation complète dans :
- [DYNAMIC_EXECUTION_GUIDE.md](./DYNAMIC_EXECUTION_GUIDE.md)
- [JIRA_AUTOMATION_SETUP.md](./JIRA_AUTOMATION_SETUP.md)
- [BROWSERSTACK.md](./BROWSERSTACK.md)

## 📚 Documentation

Le projet inclut une documentation complète :

| Document | Description |
|----------|-------------|
| [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) | Index de toute la documentation |
| [QUICK_START.md](./QUICK_START.md) | Guide de démarrage rapide |
| [PROJECT_STRUCTURE_OVERVIEW.md](./PROJECT_STRUCTURE_OVERVIEW.md) | Vue d'ensemble du projet |
| [BROWSERSTACK.md](./BROWSERSTACK.md) | Configuration BrowserStack |
| [XRAY_REPORTER_GUIDE.md](./XRAY_REPORTER_GUIDE.md) | Guide reporting Xray |
| [JIRA_CUSTOM_FIELDS_SETUP.md](./JIRA_CUSTOM_FIELDS_SETUP.md) | Configuration champs Jira |
| [CLAUDE.md](./CLAUDE.md) | Documentation pour Claude AI |
| [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md) | Résumé des changements |

## 🤖 Support Claude Code

Le projet inclut un répertoire `.claude/` avec :
- Contexte d'architecture
- Patterns et conventions
- Prompts réutilisables
- Snippets de code
- Workflows de développement

## 🔧 Technologies utilisées

- **Playwright** : Framework de tests E2E
- **Node.js** : Runtime JavaScript
- **BrowserStack** : Plateforme de tests cross-browser
- **Jira / Xray** : Gestion des tests et traçabilité
- **GitHub Actions** : CI/CD
- **PowerShell** : Scripts d'automatisation

## 🧑‍💻 Développement

### Ajout d'un nouveau test

1. Créer un fichier dans `tests/` avec le pattern `[NN]-[nom].spec.js`
2. Utiliser le template de test dans `.claude/snippets/test-template.js`
3. Ajouter les annotations Xray (`test_key`, `tags`, `test_description`)
4. Utiliser les helpers de `utils/helpers.js` pour les actions communes
5. Ajouter les captures d'écran avec `captureEvidence()`

### Bonnes pratiques

- ✅ Toujours générer des données uniques avec `generateUserData()`
- ✅ Nettoyer l'état entre les tests (panier, comptes)
- ✅ Utiliser `assertUrl()` pour les vérifications d'URL
- ✅ Ajouter `wait()` après les actions importantes
- ✅ Capturer des screenshots aux étapes clés
- ✅ Annoter les tests avec `test_key`, `tags` et `test_description`

## 📈 Évolutions récentes

### Janvier 2026
- ✨ **Extension massive de la couverture** : 15+ nouveaux scénarios de tests
- 🔧 **Amélioration du reporting Xray** : Timestamps et evidence automatiques
- 📸 **Screenshots intégrés** : Encodés en Base64 dans les rapports XML
- 🏗️ **Refactoring du code** : Amélioration de la lisibilité et maintenabilité
- 🎯 **Script de nettoyage** : Suppression automatique des `test_key` pour éviter les erreurs
- 📊 **Détermination du résultat** : Depuis le XML plutôt que les steps

## 📄 Licence

MIT

## 👤 Auteur

**Alex Thibaud**
- GitHub : [@AlexThibaud1976](https://github.com/AlexThibaud1976)
- Projet : [tricentis-demo-tests-Jira](https://github.com/AlexThibaud1976/tricentis-demo-tests-Jira)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Support

Pour toute question ou problème, consultez :
- La [documentation complète](./DOCUMENTATION_INDEX.md)
- Les [issues GitHub](https://github.com/AlexThibaud1976/tricentis-demo-tests-Jira/issues)
- Le [guide de démarrage rapide](./QUICK_START.md)
