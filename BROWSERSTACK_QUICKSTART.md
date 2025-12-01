# Guide de démarrage rapide BrowserStack

## 🚀 Démarrage en 3 étapes

### 1️⃣ Configurer les identifiants

```powershell
$env:BROWSERSTACK_USERNAME="votre_username"
$env:BROWSERSTACK_ACCESS_KEY="votre_access_key"
```

### 2️⃣ Lancer les tests

```bash
npx playwright test --config=playwright.config.browserstack.js
```

### 3️⃣ Voir les résultats

Ouvrir [BrowserStack Dashboard](https://automate.browserstack.com/) pour voir les résultats en temps réel.

---

## ⚙️ Personnalisation rapide

### Changer le navigateur
```powershell
# Firefox
$env:BS_BROWSER="firefox"
npx playwright test --config=playwright.config.browserstack.js

# Edge
$env:BS_BROWSER="edge"
npx playwright test --config=playwright.config.browserstack.js
```

### Changer l'OS
```powershell
# Windows 10
$env:BS_OS="Windows"
$env:BS_OS_VERSION="10"
npx playwright test --config=playwright.config.browserstack.js

# macOS + Safari
$env:BS_OS="OS X"
$env:BS_OS_VERSION="Monterey"
$env:BS_BROWSER="safari"
npx playwright test --config=playwright.config.browserstack.js
```

### Parallélisation
```powershell
# 3 tests en parallèle
$env:BS_WORKERS="3"
npx playwright test --config=playwright.config.browserstack.js

# 10 tests en parallèle (plan premium requis)
$env:BS_WORKERS="10"
npx playwright test --config=playwright.config.browserstack.js
```

---

## 📖 Documentation complète

Voir [BROWSERSTACK.md](./BROWSERSTACK.md) pour:
- Configuration détaillée
- Exemples avancés
- Architecture technique
- Débogage
- Intégration CI/CD
