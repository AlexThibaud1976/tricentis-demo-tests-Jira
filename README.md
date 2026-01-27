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

## 📋 Description

Ce projet contient **10 tests automatisés** couvrant les fonctionnalités principales du site e-commerce :

- 🧾 Création de compte (cas passants et non passants)
- 🔐 Authentification (login/logout)
- 🧭 Navigation dans le catalogue
- 🛒 Gestion du panier
- ✅ Passage de commande complet

## 🚀 Installation

### ⚙️ Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. Cloner le repository :
```bash
git clone https://github.com/votre-username/tricentis-demo-tests.git
cd tricentis-demo-tests
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
tricentis-demo-tests/

 tests/
    01-account-creation.spec.js     # Tests de création de compte
    02-login-logout.spec.js         # Tests de connexion/déconnexion
    03-catalog-navigation.spec.js   # Tests de navigation catalogue
    04-cart-management.spec.js      # Tests de gestion du panier
    05-order-checkout.spec.js       # Tests de passage de commande

 utils/
    helpers.js                       # Fonctions utilitaires réutilisables

 playwright.config.js                 # Configuration Playwright
 package.json                         # Dépendances du projet
 README.md                            # Documentation
```

## 📊 Couverture des tests

### Test 1-3 : Création de compte
-  Création avec données valides
-  Création avec email invalide
-  Création avec mots de passe différents

### Test 3-5 : Authentification
-  Connexion avec identifiants valides
-  Connexion avec mot de passe incorrect
-  Connexion avec email inexistant
-  Déconnexion

### Test 6 : Navigation catalogue
-  Parcours des catégories (Books, Computers, Electronics)
-  Visualisation détails produit
-  Recherche de produits

### Test 7-9 : Gestion du panier
-  Ajout d'un produit
-  Ajout de plusieurs produits
-  Modification de quantité
-  Suppression d'un produit
-  Vidage complet du panier

### Test 10 : Passage de commande
-  Commande complète avec un produit
-  Tentative sans accepter les conditions
-  Commande avec plusieurs produits

## 🔧 Fonctions utilitaires

Le fichier `utils/helpers.js` contient des fonctions réutilisables :

- `generateUserData()` - Génère des données utilisateur uniques
- `createAccount(page)` - Crée un compte automatiquement
- `login(page, email, password)` - Authentification
- `logout(page)` - Déconnexion
- `clearCart(page)` - Vide le panier
- `addProductToCart(page, categoryUrl, index)` - Ajout au panier
- `getCartItemCount(page)` - Récupère le nombre d'articles

### Reporters configurés

- **HTML Reporter** : Rapport visuel interactif
- **List Reporter** : Sortie console
- **@xray-app/playwright-junit-reporter** : Génère xray-report.xml avec annotations Xray

## 📈 Rapports de tests

Ce projet génère plusieurs types de rapports après l'exécution des tests :

### Rapport HTML Playwright

Après l'exécution, un rapport HTML est automatiquement généré :

```bash
npm run test:report
```

Le rapport s'ouvre dans votre navigateur et affiche :
- Résultats détaillés de chaque test
- Captures d'écran en cas d'échec
- Vidéos des tests échoués
- Traces d'exécution

### Rapport XML Xray (JUnit enrichi)

Le projet utilise le reporter officiel **@xray-app/playwright-junit-reporter** qui génère un fichier `xray-report.xml` compatible avec Xray Cloud. Ce rapport inclut automatiquement :

- **test_key** : Clé du test dans Jira (ex: DEMO-101)
- **requirements** : Lien vers les stories/requirements Jira
- **tags** : Labels pour catégoriser les tests (smoke, regression, etc.)
- **test_description** : Description multilignes du test
- **testrun_evidence** : Attachments embed (screenshots, fichiers)

#### Exemple d'annotations dans les tests

```javascript
test('Test de connexion', async ({ page }, testInfo) => {
  // Annotations Xray pour l'intégration Jira
  testInfo.annotations.push({ type: 'test_key', description: 'DEMO-201' });
  testInfo.annotations.push({ type: 'requirements', description: 'DEMO-2' });
  testInfo.annotations.push({ type: 'tags', description: 'smoke,login,positive' });
  testInfo.annotations.push({ 
    type: 'test_description', 
    description: 'Vérifie la connexion avec des identifiants valides' 
  });
  
  // Votre test...
});
```

Le fichier `xray-report.xml` est automatiquement créé lors de l'exécution des tests et peut être uploadé vers Xray Cloud via le script `upload-xray.ps1`.

## 🧩 Intégration Jira (Post-Execution)

Ce projet inclut un script d'intégration Jira pour publier automatiquement des artefacts d'exécution sur une issue de type "Test Execution".

- Met à jour le titre de l'exécution avec le nom du device
- Attache le rapport HTML (playwright-report/index.html)
- Ajoute un lien "Remote link" vers le run GitHub Actions
- Enrichit les Test Executions avec des champs personnalisés (OS, Browser, etc.)

### Scripts disponibles

- [scripts/jira-post-execution.ps1](scripts/jira-post-execution.ps1) - Publication des résultats vers Jira
- [scripts/get-custom-field-ids.ps1](scripts/get-custom-field-ids.ps1) - Récupération des IDs des champs personnalisés Jira
- [scripts/upload-xray.ps1](scripts/upload-xray.ps1) - Upload du rapport xray-report.xml vers Xray Cloud (format JUnit enrichi)

### Prérequis

- Accès Jira Cloud et un token API (compte utilisateur Jira)
- JiraUrl (ex. https://votre-domaine.atlassian.net)
- ExecKey (clé de l'issue Test Execution, ex. DEMO-131)
- PowerShell 7+ (fonctionne sur Windows, Linux et macOS)
- Rapport Playwright généré dans playwright-report (HTML requis)

### Configuration des champs personnalisés Jira

Ce projet utilise des champs personnalisés Jira pour enrichir les Test Executions avec des informations sur l'environnement de test :

| Champ | ID | Description |
|-------|-----|-------------|
| OS | `customfield_10048` | Système d'exploitation (Windows, Mac) |
| OS Version | `customfield_10049` | Version de l'OS (10, 11, etc.) |
| Browser | `customfield_10050` | Navigateur (Chrome, Firefox, Safari, Edge) |
| Browser Version | `customfield_10051` | Version du navigateur |

#### Récupérer les IDs de vos champs personnalisés

Pour obtenir les IDs de vos propres champs Jira :

```powershell
.\scripts\get-custom-field-ids.ps1 `
  -JiraUrl "https://votre-domaine.atlassian.net" `
  -JiraUser "votre-email@example.com" `
  -JiraApiToken "votre-token-api"
```

#### Configurer les GitHub Secrets

Ajoutez ces secrets dans votre repository GitHub (Settings → Secrets and variables → Actions) :

- `JIRA_CUSTOM_FIELD_OS` = `customfield_10048`
- `JIRA_CUSTOM_FIELD_OS_VERSION` = `customfield_10049`
- `JIRA_CUSTOM_FIELD_BROWSER` = `customfield_10050`
- `JIRA_CUSTOM_FIELD_BROWSER_VERSION` = `customfield_10051`
- `JIRA_USER` = votre email Jira
- `JIRA_API_TOKEN` = votre token API Jira
- `JIRA_BASE_URL` = https://votre-domaine.atlassian.net

### Utilisation

Windows / Linux / macOS (pwsh):

```powershell
pwsh -File ./scripts/jira-post-execution.ps1 \
   -ExecKey "DEMO-131" \
   -DeviceName "win10-firefox" \
   -JiraUrl "https://votre-domaine.atlassian.net" \
   -JiraUser "email@domaine.com" \
   -JiraApiToken "<token>" \
   -GitHubRepository "AlexThibaud1976/tricentis-demo-tests-Jira" \
   -GitHubRunId "20488622510" \
   -GitHubRunNumber "42"
```

Paramètres:

- -ExecKey: Clé de l'issue Test Execution
- -DeviceName: Libellé du device (affiché dans le titre)
- -JiraUrl: URL Jira Cloud
- -JiraUser: Email du compte Jira
- -JiraApiToken: Token API Jira
- -GitHubRepository: owner/repo du projet
- -GitHubRunId: ID du run GitHub Actions
- -GitHubRunNumber: Numéro du run GitHub Actions
- -ReportPath (optionnel): Chemin du rapport (playwright-report par défaut)

### Dépannage

- **Erreur "curl.exe non reconnu"**: le script utilise désormais des cmdlets PowerShell (Invoke-RestMethod, Invoke-WebRequest) compatibles multiplateforme. Assurez-vous d'utiliser PowerShell 7+.
- **Pièces jointes non trouvées**: vérifiez que playwright-report/index.html existe avant d'exécuter le script.
- **401/403 Jira**: confirmez JiraUser et JiraApiToken, et l'URL JiraUrl.
- **Champs personnalisés non mis à jour**: vérifiez que les IDs des champs sont correctement configurés dans les GitHub Secrets et correspondent aux champs de votre instance Jira.

### Ressources additionnelles

Pour plus d'informations sur la configuration Jira, consultez :
- [JIRA_CUSTOM_FIELDS_SETUP.md](JIRA_CUSTOM_FIELDS_SETUP.md) - Guide de configuration des champs personnalisés
- [JIRA_TEST_SCOPE_FIELD.md](JIRA_TEST_SCOPE_FIELD.md) - Configuration du champ "Test Scope"
- [LABELS_VIA_JIRA_IMPLEMENTATION.md](LABELS_VIA_JIRA_IMPLEMENTATION.md) - Utilisation des labels pour identifier les environnements

## ⚙️ Configuration

### Playwright Config

Le fichier `playwright.config.js` est configuré avec :

- **Base URL** : `https://demowebshop.tricentis.com`
- **Mode headless** : `false` (navigateur visible par défaut)
- **Workers** : `1` (exécution séquentielle pour éviter les conflits)
- **Timeout** : `60000ms` (1 minute)
- **Captures** : Screenshots et vidéos en cas d'échec
- **Traces** : Activées lors de la première tentative échouée

### Personnalisation

Modifiez `playwright.config.js` selon vos besoins :

```javascript
use: {
  headless: true,  // Mode sans interface
  screenshot: 'on', // Toujours capturer
  video: 'on',      // Toujours enregistrer
}
```

## 🎯 Bonnes pratiques implémentées

1. **Données dynamiques** : Chaque test génère des données uniques (email avec timestamp)
2. **Isolation** : Chaque test est indépendant
3. **Nettoyage** : Le panier est vidé entre les tests
4. **Réutilisabilité** : Fonctions utilitaires partagées
5. **Attentes explicites** : Utilisation de `waitForSelector` et `waitForLoadState`
6. **Assertions robustes** : Vérifications multiples
7. **Logs informatifs** : Messages console pour suivre l'exécution

## 🐛 Débogage

Pour déboguer un test spécifique :

```bash
npx playwright test tests/01-account-creation.spec.js --debug
```

Pour inspecter les sélecteurs :

```bash
npx playwright codegen https://demowebshop.tricentis.com/
```

## 📝 Notes importantes

- **Données persistantes** : Chaque exécution crée de nouveaux comptes
- **Pas de suppression** : Les comptes créés restent dans la base du site démo
- **Exécution séquentielle** : Les tests s'exécutent un par un pour éviter les conflits
- **Idempotence** : Les tests peuvent être relancés plusieurs fois

## 🤝 Contribution

Pour contribuer à ce projet :

1. Fork le repository
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout de nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créez une Pull Request

## 📄 Licence

MIT License - Libre d'utilisation et de modification

## 👤 Auteur

**Alexandre** - Software QA Expert @Itecor Geneva

## 🔗 Liens utiles

- [Documentation Playwright](https://playwright.dev/)
- [Site de test](https://demowebshop.tricentis.com/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

---

**Note** : Ce projet est à des fins éducatives et de démonstration. Le site testé est un environnement de démo fourni par Tricentis.
