# Configuration BrowserStack pour Tricentis Demo Tests

## 📋 Vue d'ensemble

Cette intégration BrowserStack permet d'exécuter tous les tests Playwright sur BrowserStack Cloud avec:
- ✅ **Build unique** par exécution (tous les tests regroupés)
- ✅ **Statuts visibles** dans le dashboard BrowserStack
- ✅ **Configuration facile** de l'OS, navigateur et parallélisation
- ✅ **Aucune modification des tests** (gestion automatique via fixtures)

## 🚀 Installation

### 1. Prérequis

- Compte BrowserStack ([créer un compte](https://www.browserstack.com/))
- Identifiants depuis le [Dashboard Automate](https://automate.browserstack.com/)

### 2. Configuration des identifiants

#### GitHub Actions (CI/CD)

Ajouter les secrets dans votre repository GitHub:
- `Settings` → `Secrets and variables` → `Actions` → `New repository secret`
- Créer `BROWSERSTACK_USERNAME` et `BROWSERSTACK_ACCESS_KEY`

#### Exécution locale

**PowerShell (Windows):**
```powershell
$env:BROWSERSTACK_USERNAME="votre_username"
$env:BROWSERSTACK_ACCESS_KEY="votre_access_key"
```

**Bash (Linux/Mac):**
```bash
export BROWSERSTACK_USERNAME="votre_username"
export BROWSERSTACK_ACCESS_KEY="votre_access_key"
```

## ⚙️ Configuration personnalisée

### Fichier `browserstack.config.js`

Toute la configuration est centralisée dans ce fichier. Vous pouvez personnaliser via des variables d'environnement:

| Variable | Description | Défaut | Exemples |
|----------|-------------|--------|----------|
| `BS_OS` | Système d'exploitation | `Windows` | `Windows`, `OS X`, `android` |
| `BS_OS_VERSION` | Version de l'OS | `11` | `11`, `10`, `Monterey`, `13.0` |
| `BS_BROWSER` | Navigateur | `chrome` | `chrome`, `firefox`, `edge`, `safari` |
| `BS_BROWSER_VERSION` | Version du navigateur | `latest` | `latest`, `120`, `119` |
| `BS_WORKERS` | Tests en parallèle | `5` | `1` à `10` |
| `BROWSERSTACK_BUILD_NAME` | Nom du build | Auto-généré | Personnalisé |

### Exemples de configuration

#### Windows 11 + Chrome (par défaut)
```powershell
npx playwright test --config=playwright.config.browserstack.js
```

#### macOS + Safari
```powershell
$env:BS_OS="OS X"
$env:BS_OS_VERSION="Monterey"
$env:BS_BROWSER="safari"
$env:BS_BROWSER_VERSION="latest"
npx playwright test --config=playwright.config.browserstack.js
```

#### Windows 10 + Firefox avec 3 workers
```powershell
$env:BS_OS="Windows"
$env:BS_OS_VERSION="10"
$env:BS_BROWSER="firefox"
$env:BS_BROWSER_VERSION="latest"
$env:BS_WORKERS="3"
npx playwright test --config=playwright.config.browserstack.js
```

#### Android + Chrome Mobile
```powershell
$env:BS_OS="android"
$env:BS_OS_VERSION="13.0"
$env:BS_BROWSER="chrome"
npx playwright test --config=playwright.config.browserstack.js
```

## 🧪 Utilisation

### Lancer tous les tests
```bash
npx playwright test --config=playwright.config.browserstack.js
```

### Lancer une suite spécifique
```bash
npx playwright test tests/01-account-creation.spec.js --config=playwright.config.browserstack.js
```

### Build personnalisé
```powershell
$env:BROWSERSTACK_BUILD_NAME="Sprint 12 - Regression Tests"
npx playwright test --config=playwright.config.browserstack.js
```

### Mode debug (un seul worker)
```powershell
$env:BS_WORKERS="1"
npx playwright test --config=playwright.config.browserstack.js --headed
```

## 📊 Visualisation des résultats

### Dashboard BrowserStack
1. Connectez-vous à [BrowserStack Automate](https://automate.browserstack.com/)
2. Trouvez votre build (nom auto-généré ou personnalisé)
3. **Vous verrez 19 sessions distinctes**, une pour chaque test, avec:
   - ✅ Nom complet du test (ex: "Tests de connexion › Test 3: Connexion utilisateur")
   - ✅ Statut individuel (passed/failed)
   - 📹 Vidéo dédiée de l'exécution du test
   - 📝 Logs de console spécifiques au test
   - 🌐 Logs réseau du test
   - 📸 Screenshots du test

**Important**: Chaque test crée sa propre session BrowserStack, vous aurez donc 19 sessions par exécution complète, toutes regroupées dans le même build.

### Rapport local
Un rapport HTML est également généré localement:
```bash
npx playwright show-report
```

## 🔧 Architecture

### Fichiers créés (aucune modification des tests)

```
tricentis-demo-tests/
├── browserstack.config.js           # Configuration centralisée
├── browserstack-fixtures.js         # Crée une session BrowserStack par test
├── browserstack-reporter.js         # Reporter personnalisé
├── playwright.config.browserstack.js # Config Playwright BrowserStack
└── test-fixtures.js                 # Switch auto local/BrowserStack
```

### Fonctionnement

1. **Configuration**: `browserstack.config.js` centralise tous les paramètres
2. **Session par test**: `browserstack-fixtures.js` crée une connexion CDP BrowserStack dédiée pour chaque test
3. **Naming**: Le nom complet du test (suite › test) est défini lors de la création de la session
4. **Status**: Le statut (passed/failed) est mis à jour automatiquement après chaque test
5. **Build unique**: Tous les tests d'une même exécution sont groupés sous un build unique
6. **Logs séparés**: Chaque test a ses propres logs console, réseau, vidéo dans BrowserStack

### Avantages de cette architecture

- ✅ **19 sessions distinctes** dans BrowserStack (une par test)
- ✅ **Noms complets** visibles (ex: "Tests de connexion › Test 3: Connexion utilisateur - Cas passant ✅")
- ✅ **Logs individuels** pour chaque test (console, réseau, vidéo)
- ✅ **Build unique** regroupant tous les tests
- ✅ **Aucune modification** des fichiers de tests
- ✅ **Mode local** fonctionne sans BrowserStack

## 🎯 Configurations recommandées par navigateur

### Chrome (recommandé pour la stabilité)
```powershell
$env:BS_BROWSER="chrome"
$env:BS_BROWSER_VERSION="latest"
$env:BS_WORKERS="5"
```

### Firefox
```powershell
$env:BS_BROWSER="firefox"
$env:BS_BROWSER_VERSION="latest"
$env:BS_WORKERS="3"  # Firefox est plus lent
```

### Safari (macOS uniquement)
```powershell
$env:BS_OS="OS X"
$env:BS_OS_VERSION="Monterey"
$env:BS_BROWSER="safari"
$env:BS_BROWSER_VERSION="latest"
$env:BS_WORKERS="3"
```

### Edge
```powershell
$env:BS_BROWSER="edge"
$env:BS_BROWSER_VERSION="latest"
$env:BS_WORKERS="5"
```

## 🤖 GitHub Actions

Le workflow `.github/workflows/playwright.yml` inclut un job `test-browserstack` qui:
- S'exécute en parallèle du job local
- Utilise les secrets configurés dans GitHub
- Crée un build avec le numéro de run GitHub
- Upload les rapports en artifacts

### Personnaliser le workflow

Éditez `.github/workflows/playwright.yml` section `test-browserstack` → `env`:

```yaml
env:
  BS_OS: "Windows"           # Changer l'OS
  BS_OS_VERSION: "10"        # Changer la version
  BS_BROWSER: "firefox"      # Changer le navigateur
  BS_BROWSER_VERSION: "119"  # Changer la version
  BS_WORKERS: "3"            # Changer la parallélisation
```

## 🐛 Débogage

### Vérifier la configuration
```bash
node -e "console.log(require('./browserstack.config.js'))"
```

### Tester avec un seul test
```bash
npx playwright test tests/99-sanity.spec.js --config=playwright.config.browserstack.js
```

### Logs verbeux
Les logs BrowserStack sont automatiquement activés:
- Console logs
- Network logs
- Debug mode

## 📝 Notes importantes

- **Build unique**: Chaque exécution crée automatiquement un nouveau build BrowserStack
- **Tests inchangés**: Aucune modification des fichiers `tests/*.spec.js` nécessaire
- **Fixtures auto**: Les fixtures `browserstack-fixtures.js` gèrent tout automatiquement
- **Parallélisation**: Ajustez `BS_WORKERS` selon vos besoins (limité par votre plan BrowserStack)
- **Timeout**: Augmenté à 90s pour compenser la latence réseau

## 🔗 Liens utiles

- [BrowserStack Dashboard](https://automate.browserstack.com/)
- [Liste des OS supportés](https://www.browserstack.com/list-of-browsers-and-platforms/automate)
- [Documentation Playwright CDP](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp)
- [BrowserStack Playwright Guide](https://www.browserstack.com/docs/automate/playwright)

## 💡 Astuces

### Tests rapides (smoke tests)
```bash
$env:BS_WORKERS="1"
npx playwright test tests/99-sanity.spec.js --config=playwright.config.browserstack.js
```

### Multi-navigateurs (séquentiel)
```bash
# Chrome
$env:BS_BROWSER="chrome"; npx playwright test --config=playwright.config.browserstack.js

# Firefox
$env:BS_BROWSER="firefox"; npx playwright test --config=playwright.config.browserstack.js
```

### Build nommé par feature
```bash
$env:BROWSERSTACK_BUILD_NAME="Feature-Login-Tests"
npx playwright test tests/02-login-logout.spec.js --config=playwright.config.browserstack.js
```
