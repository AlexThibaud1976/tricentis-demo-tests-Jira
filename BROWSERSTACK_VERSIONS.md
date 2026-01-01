# 🌐 Référence BrowserStack - Versions supportées

## 📋 Vue d'ensemble

Ce document liste les valeurs **exactes** acceptées par BrowserStack pour l'exécution des tests Playwright.

---

## 🖥️ Systèmes d'exploitation

### Windows

| Version | Valeur à utiliser |
|---------|-------------------|
| Windows 7 | `7` |
| Windows 8 | `8` |
| Windows 8.1 | `8.1` |
| Windows 10 | `10` |
| Windows 11 | `11` |

**Exemple:**
```bash
--os Windows --osVersion 11
```

### macOS (OS X)

⚠️ **Important:** BrowserStack utilise les **noms** de versions macOS, pas les numéros.

| Nom de version | Numéro équivalent | Valeur à utiliser |
|----------------|-------------------|-------------------|
| macOS Catalina | 10.15 | `Catalina` |
| macOS Big Sur | 11 | `Big Sur` |
| macOS Monterey | 12 | `Monterey` |
| macOS Ventura | 13 | `Ventura` |
| macOS Sonoma | 14 | `Sonoma` |
| macOS Sequoia | 15 | `Sequoia` |

**Exemples:**
```bash
--os Mac --osVersion Sonoma
--os Mac --osVersion "Big Sur"
--os Mac --osVersion Ventura
```

---

## 🌐 Navigateurs

### Chromium / Chrome

| Navigateur | Nom BrowserStack | Versions récentes |
|-----------|------------------|-------------------|
| Chrome | `playwright-chromium` | latest, 144, 143, 142, 141, 140 |
| Chromium | `playwright-chromium` | latest, 144, 143, 142, 141, 140 |

**Exemples:**
```bash
--browser chrome --browserVersion latest
--browser chromium --browserVersion 143
```

### Firefox

| Navigateur | Nom BrowserStack | Versions récentes |
|-----------|------------------|-------------------|
| Firefox | `playwright-firefox` | latest, 144, 143, 142, 141, 140 |

**Exemples:**
```bash
--browser firefox --browserVersion latest
--browser firefox --browserVersion 144
```

### Safari (macOS uniquement)

| Navigateur | Nom BrowserStack | Versions récentes |
|-----------|------------------|-------------------|
| Safari | `playwright-webkit` | latest, 18, 17, 16, 15 |

**Exemples:**
```bash
--os Mac --osVersion Sonoma --browser safari --browserVersion latest
--os Mac --osVersion Ventura --browser safari --browserVersion 17
```

### Edge

| Navigateur | Nom BrowserStack | Versions récentes |
|-----------|------------------|-------------------|
| Edge | `playwright-chromium` | latest, 131, 130, 129, 128 |

**Exemples:**
```bash
--browser edge --browserVersion latest
--browser edge --browserVersion 131
```

---

## 📊 Configurations validées

### Windows + Chrome/Chromium
```bash
# Windows 11 + Chrome latest
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser chrome --browserVersion latest

# Windows 10 + Chromium 143
node scripts/resolve-browserstack-config.js --os Windows --osVersion 10 --browser chromium --browserVersion 143
```

### Windows + Firefox
```bash
# Windows 11 + Firefox 144
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser firefox --browserVersion 144

# Windows 10 + Firefox latest
node scripts/resolve-browserstack-config.js --os Windows --osVersion 10 --browser firefox --browserVersion latest
```

### macOS + Safari
```bash
# macOS Sonoma + Safari latest
node scripts/resolve-browserstack-config.js --os Mac --osVersion Sonoma --browser safari --browserVersion latest

# macOS Ventura + Safari 17
node scripts/resolve-browserstack-config.js --os Mac --osVersion Ventura --browser safari --browserVersion 17
```

### macOS + Firefox
```bash
# macOS Sonoma + Firefox 144
node scripts/resolve-browserstack-config.js --os Mac --osVersion Sonoma --browser firefox --browserVersion 144

# macOS Big Sur + Firefox latest
node scripts/resolve-browserstack-config.js --os Mac --osVersion "Big Sur" --browser firefox --browserVersion latest
```

---

## 🎯 Payloads JSON pour Jira

### Windows 11 + Chrome latest
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-123",
    "summary": "Test Chrome Windows 11",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest"
  }
}
```

### macOS Sonoma + Firefox 144
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-456",
    "summary": "Test Firefox macOS Sonoma",
    "os": "Mac",
    "osVersion": "Sonoma",
    "browser": "firefox",
    "browserVersion": "144"
  }
}
```

### Windows 10 + Chromium 143
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-789",
    "summary": "Test Chromium Windows 10",
    "os": "Windows",
    "osVersion": "10",
    "browser": "chromium",
    "browserVersion": "143"
  }
}
```

### macOS Ventura + Safari 17
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-999",
    "summary": "Test Safari macOS Ventura",
    "os": "Mac",
    "osVersion": "Ventura",
    "browser": "safari",
    "browserVersion": "17"
  }
}
```

---

## ⚠️ Erreurs courantes

### ❌ Utiliser des numéros pour macOS
```bash
# INCORRECT
--os Mac --osVersion 14

# CORRECT
--os Mac --osVersion Sonoma
```

### ❌ Oublier les guillemets pour "Big Sur"
```bash
# INCORRECT (si lancé dans un shell)
--osVersion Big Sur

# CORRECT
--osVersion "Big Sur"
```

### ❌ Utiliser le mauvais nom de navigateur
```bash
# INCORRECT
--browser chrome  # BrowserStack s'attend à "playwright-chromium"

# Le script gère automatiquement la conversion:
--browser chrome → BS_BROWSER=playwright-chromium ✅
```

---

## 🔄 Mapping automatique

Le script `resolve-browserstack-config.js` effectue automatiquement les conversions suivantes :

| Entrée | Sortie BrowserStack |
|--------|---------------------|
| `--browser chrome` | `playwright-chromium` |
| `--browser chromium` | `playwright-chromium` |
| `--browser firefox` | `playwright-firefox` |
| `--browser safari` | `playwright-webkit` |
| `--browser edge` | `playwright-chromium` |
| `--os Mac` | `OS X` |
| `--os Windows` | `Windows` |

---

## 📚 Ressources BrowserStack

- [BrowserStack Playwright Documentation](https://www.browserstack.com/docs/automate/playwright)
- [BrowserStack Capabilities](https://www.browserstack.com/docs/automate/playwright/getting-started#capabilities)
- [Supported Browsers](https://www.browserstack.com/docs/automate/playwright/browsers-and-os)

---

## 🧪 Tester localement

Pour vérifier qu'une configuration est valide avant de lancer les tests :

```bash
# Test 1: Windows 11 + Chrome
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser chrome --browserVersion latest

# Test 2: macOS Sonoma + Firefox
node scripts/resolve-browserstack-config.js --os Mac --osVersion Sonoma --browser firefox --browserVersion 144

# Test 3: Windows 10 + Chromium
node scripts/resolve-browserstack-config.js --os Windows --osVersion 10 --browser chromium --browserVersion 143

# Test 4: macOS Ventura + Safari
node scripts/resolve-browserstack-config.js --os Mac --osVersion Ventura --browser safari --browserVersion 17
```

Si la configuration est valide, vous verrez :
```
✅ Configuration BrowserStack résolue:
   BS_OS=...
   BS_OS_VERSION=...
   BS_BROWSER=...
   BS_BROWSER_VERSION=...
   DEVICE_NAME=...
```

---

**Dernière mise à jour:** Janvier 2026  
**Source:** Exemple de configuration BrowserStack fourni par l'utilisateur
