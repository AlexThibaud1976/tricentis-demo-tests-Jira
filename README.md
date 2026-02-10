# 🧪 Tricentis Demo Tests - Suite de Tests Automatisés Playwright

[![Playwright Tests](https://github.com/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/badge.svg)](https://github.com/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml)

Suite complète de tests end-to-end automatisés pour [Tricentis Demo Web Shop](https://demowebshop.tricentis.com) utilisant Playwright, avec intégration BrowserStack, Jira/Xray et reporting Confluence.

## 📋 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Fonctionnalités principales](#-fonctionnalités-principales)
- [Démarrage rapide](#-démarrage-rapide)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Exécution des tests](#-exécution-des-tests)
- [Intégration BrowserStack](#-intégration-browserstack)
- [Intégration Jira/Xray](#-intégration-jiraxray)
- [Reporting Confluence](#-reporting-confluence)
- [Structure du projet](#-structure-du-projet)
- [Documentation](#-documentation)

## 🎯 Vue d'ensemble

Ce projet fournit une suite complète de tests automatisés pour valider toutes les fonctionnalités du Tricentis Demo Web Shop, incluant:

- **30+ tests** couvrant toutes les fonctionnalités e-commerce
- **Exécution dynamique** sur BrowserStack avec paramétrage OS/navigateur
- **Intégration Jira** via Xray pour la traçabilité des tests
- **Reporting automatisé** dans Confluence et BrowserStack
- **CI/CD** via GitHub Actions avec déclenchement manuel ou automatique depuis Jira

## ✨ Fonctionnalités principales

### 🎭 Tests automatisés complets

- ✅ **Création de compte** - Enregistrement utilisateur avec validation
- ✅ **Connexion/Déconnexion** - Authentification et gestion de session
- ✅ **Navigation catalogue** - Parcours catégories et produits
- ✅ **Recherche** - Recherche simple et avancée de produits
- ✅ **Gestion panier** - Ajout, modification, suppression d'articles
- ✅ **Commande et paiement** - Processus checkout complet
- ✅ **Compte client** - Gestion profil, adresses, historique
- ✅ **Wishlist** - Liste de souhaits et comparaisons produits
- ✅ **Formulaire contact** - Envoi de messages au support
- ✅ **Produits configurables** - Build your own computer
- ✅ **Méthodes de paiement** - Cash on delivery, Credit card, etc.
- ✅ **Types de cartes** - Visa, MasterCard, Discover, Amex
- ✅ **Méthodes de livraison** - Ground, Next day air, 2nd day air
- ✅ **Tests combinatoires** - Checkout avec différentes options
- ✅ **Navigation pieds de page** - Vérification liens footer
- ✅ **Blog et actualités** - Section news et blog
- ✅ **Sondage communautaire** - Interaction avec le poll
- ✅ **Produits récents** - Recently viewed products
- ✅ **Filtres fabricants** - Filtrage par manufacturer
- ✅ **Tags produits** - Navigation par tags
- ✅ **Email ami** - Partage de produits

### 🌐 Exécution multi-environnements

- **BrowserStack Cloud** - Tests sur OS/navigateurs réels
- **Configuration dynamique** - Choix OS, version, navigateur depuis Jira
- **Validation automatique** - Vérification des combinaisons valides
- **Parallélisation** - Jusqu'à 10 tests simultanés
- **Screenshots pleine page** - Captures automatiques sur échecs

### 🔗 Intégration complète

- **Jira Automation** - Déclenchement automatique des tests
- **Xray Cloud** - Traçabilité test_key → requirements
- **Confluence** - Tableaux de bord temps réel avec macros JQL
- **GitHub Actions** - Pipeline CI/CD complet
- **Custom Fields** - Enrichissement metadata (OS, Browser, Device)

## ⚡ Démarrage rapide

### Prérequis

- Node.js 16+ et npm
- Compte BrowserStack (optionnel pour exécution cloud)
- Accès Jira/Xray Cloud (optionnel pour intégration)

### Installation rapide

```bash
# Cloner le repository
git clone https://github.com/AlexThibaud1976/tricentis-demo-tests-Jira.git
cd tricentis-demo-tests-Jira

# Installer les dépendances
npm install

# Installer Playwright browsers (local uniquement)
npx playwright install
```

### Premier test local

```bash
# Lancer tous les tests
npm test

# Lancer un test spécifique
npm run test:login

# Voir le rapport
npm run test:report
```

### Premier test sur BrowserStack

```bash
# Configurer les identifiants
$env:BROWSERSTACK_USERNAME="votre_username"
$env:BROWSERSTACK_ACCESS_KEY="votre_access_key"

# Lancer sur BrowserStack
npx playwright test --config=playwright.config.browserstack.js
```

📚 **Guide complet**: Consultez [QUICK_START.md](QUICK_START.md) pour un guide détaillé (5 minutes)

## 🛠️ Installation

### 1. Cloner le repository

```bash
git clone https://github.com/AlexThibaud1976/tricentis-demo-tests-Jira.git
cd tricentis-demo-tests-Jira
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Installer les navigateurs Playwright (optionnel - local uniquement)

```bash
npx playwright install
```

### 4. Configuration des secrets (optionnel - pour BrowserStack/Xray)

Créer un fichier `.env` à la racine du projet:

```env
# BrowserStack (optionnel)
BROWSERSTACK_USERNAME=votre_username
BROWSERSTACK_ACCESS_KEY=votre_access_key

# Xray Cloud (optionnel)
XRAY_CLIENT_ID=votre_client_id
XRAY_CLIENT_SECRET=votre_client_secret
```

## ⚙️ Configuration

### Configuration Playwright

Le projet inclut deux fichiers de configuration:

- **`playwright.config.js`** - Exécution locale
- **`playwright.config.browserstack.js`** - Exécution sur BrowserStack Cloud

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `BROWSERSTACK_USERNAME` | Username BrowserStack | - |
| `BROWSERSTACK_ACCESS_KEY` | Access key BrowserStack | - |
| `BS_OS` | Système d'exploitation | `Windows` |
| `BS_OS_VERSION` | Version OS | `11` |
| `BS_BROWSER` | Navigateur | `chrome` |
| `BS_BROWSER_VERSION` | Version navigateur | `latest` |
| `BS_WORKERS` | Parallélisation | `5` |
| `XRAY_CLIENT_ID` | Client ID Xray | - |
| `XRAY_CLIENT_SECRET` | Client secret Xray | - |

## 🧪 Exécution des tests

### Scripts npm disponibles

```bash
# Lancer tous les tests
npm test

# Mode headed (voir le navigateur)
npm run test:headed

# Mode UI interactif
npm run test:ui

# Mode debug
npm run test:debug

# Voir le rapport HTML
npm run test:report

# Tests par suite
npm run test:creation    # Tests création compte
npm run test:login       # Tests connexion/déconnexion
npm run test:catalog     # Tests navigation catalogue
npm run test:cart        # Tests gestion panier
npm run test:order       # Tests commande/paiement
```

### Exécution locale

```bash
# Tous les tests
npx playwright test

# Un fichier spécifique
npx playwright test tests/01-account-creation.spec.js

# Un test spécifique
npx playwright test -g "Test 1: Création de compte avec email valide"

# Mode debug
npx playwright test --debug

# Mode headed
npx playwright test --headed
```

### Exécution sur BrowserStack

```bash
# Windows 11 + Chrome (défaut)
npx playwright test --config=playwright.config.browserstack.js

# macOS + Safari
$env:BS_OS="OS X"
$env:BS_OS_VERSION="Sonoma"
$env:BS_BROWSER="safari"
$env:BS_BROWSER_VERSION="18"
npx playwright test --config=playwright.config.browserstack.js

# Windows 10 + Firefox avec 3 workers
$env:BS_OS="Windows"
$env:BS_OS_VERSION="10"
$env:BS_BROWSER="firefox"
$env:BS_BROWSER_VERSION="latest"
$env:BS_WORKERS="3"
npx playwright test --config=playwright.config.browserstack.js
```

📚 **Documentation complète**: Voir [BROWSERSTACK.md](BROWSERSTACK.md)

## 🌐 Intégration BrowserStack

### Fonctionnalités

- ✅ **19 tests** individuels, chacun avec sa propre session BrowserStack
- ✅ **Build unique** regroupant toutes les sessions
- ✅ **Statuts visibles** dans le dashboard (passed/failed par test)
- ✅ **Vidéos et logs** dédiés pour chaque test
- ✅ **Configuration dynamique** OS/navigateur via variables d'environnement
- ✅ **Screenshots pleine page** automatiques sur échecs

### Systèmes supportés

**Desktop:**
- Windows 11, 10
- macOS (Sonoma, Ventura, Monterey, Big Sur)

**Navigateurs:**
- Chrome (latest, latest-1, versions spécifiques)
- Firefox (latest, latest-1, versions spécifiques)
- Edge (latest, latest-1, versions spécifiques)
- Safari (18, 17, 16, 15)

**Mobile:**
- Android 13.0, 12.0, 11.0
- iOS 17, 16, 15

### Validation des paramètres

Le script `scripts/resolve-browserstack-config.js` valide automatiquement les combinaisons OS/navigateur:

```bash
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser chrome --browserVersion latest
```

### Dashboard BrowserStack

Accédez à [BrowserStack Automate](https://automate.browserstack.com/) pour voir:
- 📊 **Builds** - Un build par exécution complète
- 🎬 **Sessions** - 19 sessions (une par test) par build
- 📹 **Vidéos** - Enregistrement complet de chaque test
- 📝 **Logs** - Console et réseau par session
- 📸 **Screenshots** - Captures automatiques pleine page

📚 **Guide complet**: Voir [BROWSERSTACK.md](BROWSERSTACK.md) et [BROWSERSTACK_QUICKSTART.md](BROWSERSTACK_QUICKSTART.md)

## 🔗 Intégration Jira/Xray

### Fonctionnalités Xray

- ✅ **Reporter officiel** `@xray-app/playwright-junit-reporter`
- ✅ **Traçabilité** test_key → requirements
- ✅ **Custom fields Test Run** (OS, Browser, Device Name)
- ✅ **Evidence** Screenshots encodés Base64
- ✅ **Annotations enrichies** tags, descriptions, requirements

### Structure Jira

```
DEMO (Project)
├── User Stories / Requirements (Story)
│   └── DEMO-1, DEMO-2, ...
├── Test Cases (Test)
│   └── DEMO-101, DEMO-201, ... (avec test_key dans les tests)
└── Test Executions (Test Execution)
    └── Créés automatiquement via upload Xray
```

### Annotations dans les tests

```javascript
test('Login utilisateur valide', async ({ page }, testInfo) => {
  // Traçabilité Xray
  testInfo.annotations.push({ type: 'test_key', description: 'DEMO-201' });
  testInfo.annotations.push({ type: 'requirements', description: 'DEMO-2' });
  testInfo.annotations.push({ type: 'tags', description: 'smoke,login,positive' });
  
  // ... test code ...
});
```

### Upload automatique

Le workflow GitHub Actions upload automatiquement les résultats vers Xray:

```bash
# Upload manuel
.\scripts\upload-xray.ps1
```

### Custom Fields disponibles

- **Test Run Custom Fields:**
  - `OS` (ex: Windows, macOS)
  - `Browser` (ex: chrome, firefox, safari)
  - `Browser Version` (ex: latest, 120)
  - `Device Name` (ex: win-11-chrome-latest)

📚 **Guide complet**: Voir [XRAY_REPORTER_GUIDE.md](XRAY_REPORTER_GUIDE.md) et [JIRA_CUSTOM_FIELDS_SETUP.md](JIRA_CUSTOM_FIELDS_SETUP.md)

## 📊 Reporting Confluence

### Approche 1: Macros Jira natives (Temps réel)

Créez une page Dashboard Confluence avec:

**Tableau JQL des dernières exécutions:**
```jql
project = DEMO AND issuetype = "Test Execution" ORDER BY created DESC
```

**Graphique de tendance (30 jours):**
```jql
project = DEMO AND issuetype = "Test Execution" AND created >= -30d
```

**Filtre par résultat:**
```jql
project = DEMO AND issuetype = "Test Execution" AND labels = "FAIL" ORDER BY created DESC
```

### Approche 2: Tableau historique CI/CD

Le workflow GitHub peut mettre à jour automatiquement un tableau Confluence avec:
- Date d'exécution
- Résultat (✅/❌)
- OS et navigateur
- Liens BrowserStack et GitHub Actions

Activez via l'input `update_confluence: true` dans le workflow.

📚 **Guide complet**: Voir [CONFLUENCE_REPORTING_GUIDE.md](CONFLUENCE_REPORTING_GUIDE.md)

## 🏗️ Structure du projet

```
tricentis-demo-tests-Jira/
│
├── 📄 README.md                          # Ce fichier
├── 📄 package.json                       # Dépendances npm
│
├── ⚙️ CONFIGURATION
│   ├── playwright.config.js              # Config locale
│   ├── playwright.config.browserstack.js # Config BrowserStack
│   ├── browserstack.config.js            # Paramètres BS
│   ├── browserstack-fixtures.js          # Fixtures BS (sessions)
│   ├── browserstack-reporter.js          # Reporter BS
│   └── test-fixtures.js                  # Fixtures tests
│
├── 🧪 TESTS (30+ tests)
│   ├── tests/01-account-creation.spec.js
│   ├── tests/02-login-logout.spec.js
│   ├── tests/03-catalog-navigation.spec.js
│   ├── tests/04-cart-management.spec.js
│   ├── tests/05-order-checkout.spec.js
│   ├── tests/06-search-functionality.spec.js
│   ├── tests/07-product-details.spec.js
│   ├── tests/08-wishlist.spec.js
│   ├── tests/09-compare-products.spec.js
│   ├── tests/10-shopping-cart.spec.js
│   ├── tests/11-contact-form.spec.js
│   ├── tests/12-account-management.spec.js
│   ├── tests/13-order-history.spec.js
│   ├── tests/14-product-filtering.spec.js
│   ├── tests/15-configurable-products.spec.js
│   ├── tests/16-product-tags.spec.js
│   ├── tests/17-recently-viewed.spec.js
│   ├── tests/18-email-friend.spec.js
│   ├── tests/19-community-poll.spec.js
│   ├── tests/20-manufacturer-filter.spec.js
│   ├── tests/21-new-products.spec.js
│   ├── tests/22-footer-links.spec.js
│   ├── tests/23-news-blog.spec.js
│   ├── tests/24-guest-checkout.spec.js
│   ├── tests/25-cart-updates.spec.js
│   ├── tests/26-shipping-methods.spec.js
│   ├── tests/27-payment-methods.spec.js
│   ├── tests/27b-card-types.spec.js
│   ├── tests/28-checkout-combinations.spec.js
│   └── tests/99-sanity.spec.js
│
├── 🔧 SCRIPTS
│   ├── scripts/resolve-browserstack-config.js   # Validation paramètres
│   ├── scripts/test-browserstack-config.ps1     # Test config PS
│   ├── scripts/upload-xray.ps1                  # Upload vers Xray
│   ├── scripts/jira-post-execution.ps1          # Post-traitement Jira
│   ├── scripts/get-browserstack-build-link.js   # Récupère lien BS
│   ├── scripts/update-confluence-report.js      # MAJ Confluence
│   ├── scripts/add-timestamps-to-xray-report.js # Timestamps Xray
│   ├── scripts/remove-test-keys.js              # Nettoyage test_key
│   └── scripts/get-custom-field-ids.ps1         # IDs custom fields
│
├── 🛠️ UTILS
│   └── utils/helpers.js                  # Fonctions helpers
│
├── 🤖 CI/CD
│   └── .github/workflows/playwright.yml  # GitHub Actions workflow
│
├── 📊 RAPPORTS
│   ├── playwright-report/               # Rapport HTML Playwright
│   ├── test-results/                    # Résultats individuels
│   ├── xray-report.xml                  # Rapport Xray JUnit
│   └── test-results.json                # Résultats JSON
│
└── 📚 DOCUMENTATION
    ├── QUICK_START.md                   # ⭐ Démarrage rapide (5 min)
    ├── BROWSERSTACK.md                  # Guide BrowserStack
    ├── BROWSERSTACK_QUICKSTART.md       # Quickstart BrowserStack
    ├── XRAY_REPORTER_GUIDE.md           # Guide reporter Xray
    ├── CONFLUENCE_REPORTING_GUIDE.md    # Guide reporting Confluence
    ├── JIRA_CUSTOM_FIELDS_SETUP.md      # Setup custom fields
    ├── JIRA_AUTOMATION_SETUP.md         # Setup automation Jira
    ├── DYNAMIC_TESTING_README.md        # Tests dynamiques
    ├── DYNAMIC_EXECUTION_GUIDE.md       # Guide exécution dynamique
    ├── PROJECT_STRUCTURE_OVERVIEW.md    # Vue d'ensemble structure
    ├── COMPREHENSIVE_TEST_PLAN.md       # Plan de test complet
    ├── DOCUMENTATION_INDEX.md           # Index documentation
    └── ... (autres docs)
```

## 📚 Documentation

### 🚀 Pour commencer

- **[QUICK_START.md](QUICK_START.md)** - ⭐ Guide de démarrage en 5 minutes
- **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Index de toute la documentation

### 🌐 BrowserStack

- **[BROWSERSTACK.md](BROWSERSTACK.md)** - Guide complet BrowserStack
- **[BROWSERSTACK_QUICKSTART.md](BROWSERSTACK_QUICKSTART.md)** - Démarrage rapide BrowserStack
- **[BROWSERSTACK_VERSIONS.md](BROWSERSTACK_VERSIONS.md)** - Versions supportées

### 🔗 Jira/Xray

- **[XRAY_REPORTER_GUIDE.md](XRAY_REPORTER_GUIDE.md)** - Guide du reporter Xray
- **[JIRA_CUSTOM_FIELDS_SETUP.md](JIRA_CUSTOM_FIELDS_SETUP.md)** - Configuration custom fields
- **[JIRA_AUTOMATION_SETUP.md](JIRA_AUTOMATION_SETUP.md)** - Setup automation Jira
- **[JIRA_TEST_SCOPE_FIELD.md](JIRA_TEST_SCOPE_FIELD.md)** - Champ Test Scope

### 📊 Reporting

- **[CONFLUENCE_REPORTING_GUIDE.md](CONFLUENCE_REPORTING_GUIDE.md)** - Guide reporting Confluence

### 🧪 Tests

- **[COMPREHENSIVE_TEST_PLAN.md](COMPREHENSIVE_TEST_PLAN.md)** - Plan de test complet
- **[DYNAMIC_TESTING_README.md](DYNAMIC_TESTING_README.md)** - Tests dynamiques
- **[DYNAMIC_EXECUTION_GUIDE.md](DYNAMIC_EXECUTION_GUIDE.md)** - Guide exécution dynamique

### 🏗️ Projet

- **[PROJECT_STRUCTURE_OVERVIEW.md](PROJECT_STRUCTURE_OVERVIEW.md)** - Structure du projet
- **[IMPLEMENTATION_CHECKLIST.md](IMPLEMENTATION_CHECKLIST.md)** - Checklist implémentation
- **[GITHUB_SETUP.md](GITHUB_SETUP.md)** - Configuration GitHub

### 📋 Guides spécifiques

- **[COPY_PASTE_EXAMPLES.md](COPY_PASTE_EXAMPLES.md)** - Exemples copier-coller
- **[CARD_TYPES_TESTING.md](CARD_TYPES_TESTING.md)** - Tests types de cartes
- **[CHECKOUT_OPTIONS_ANALYSIS.md](CHECKOUT_OPTIONS_ANALYSIS.md)** - Analyse options checkout

## 🚀 GitHub Actions

### Déclenchement manuel

1. Allez sur **GitHub** → **Actions** → **Playwright Tests**
2. Cliquez **Run workflow**
3. Configurez:
   - `os`: Windows, macOS, etc.
   - `osVersion`: 11, Sonoma, etc.
   - `browser`: chrome, firefox, safari, edge
   - `browserVersion`: latest, latest-1, ou version spécifique
   - `issueKey`: (optionnel) DEMO-XXX
   - `update_confluence`: true/false
4. Cliquez **Run workflow**

### Déclenchement automatique depuis Jira

Configurez une Automation Rule Jira qui appelle l'API GitHub:

```
POST https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches

Headers:
  Authorization: Bearer YOUR_GITHUB_PAT
  Accept: application/vnd.github.v3+json

Body:
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest"
  }
}
```

📚 **Guide complet**: Voir [JIRA_AUTOMATION_SETUP.md](JIRA_AUTOMATION_SETUP.md)

## 🛠️ Technologies utilisées

- **[Playwright](https://playwright.dev/)** - Framework de tests E2E
- **[BrowserStack](https://www.browserstack.com/)** - Cloud testing platform
- **[Xray Cloud](https://www.getxray.app/)** - Test management pour Jira
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD
- **[Jira Cloud](https://www.atlassian.com/software/jira)** - Gestion de projet
- **[Confluence Cloud](https://www.atlassian.com/software/confluence)** - Documentation et reporting

## 📝 Licence

MIT License - Voir le fichier LICENSE pour plus de détails

## 👤 Auteur

**Alexandre Thibaud**
- GitHub: [@AlexThibaud1976](https://github.com/AlexThibaud1976)

## 🤝 Contribution

Les contributions sont les bienvenues! N'hésitez pas à:
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème:
- Ouvrez une [Issue GitHub](https://github.com/AlexThibaud1976/tricentis-demo-tests-Jira/issues)
- Consultez la [Documentation](DOCUMENTATION_INDEX.md)
- Voir le [Quick Start Guide](QUICK_START.md)

---

**⭐ Si ce projet vous est utile, n'hésitez pas à lui donner une étoile!**