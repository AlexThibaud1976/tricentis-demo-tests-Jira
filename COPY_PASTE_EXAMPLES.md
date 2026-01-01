# 📌 Exemples prêts à copier-coller

## 🎯 Exemples de commandes

### Exemple 1: Windows 11 + Chrome latest
```bash
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser chrome --browserVersion latest
```

**Résultat attendu:**
```json
{
  "BS_OS": "Windows",
  "BS_OS_VERSION": "11",
  "BS_BROWSER": "chrome",
  "BS_BROWSER_VERSION": "latest",
  "DEVICE_NAME": "windows11-chrome-latest"
}
```

### Exemple 2: Windows 10 + Firefox latest
```bash
node scripts/resolve-browserstack-config.js --os Windows --osVersion 10 --browser firefox --browserVersion latest
```

**Résultat attendu:**
```json
{
  "BS_OS": "Windows",
  "BS_OS_VERSION": "10",
  "BS_BROWSER": "firefox",
  "BS_BROWSER_VERSION": "latest",
  "DEVICE_NAME": "windows10-firefox-latest"
}
```

### Exemple 3: Mac 14 + Safari 17
```bash
node scripts/resolve-browserstack-config.js --os Mac --osVersion Sonoma --browser safari --browserVersion 17
```

**Résultat attendu:**
```json
{
  "BS_OS": "OS X",
  "BS_OS_VERSION": "Sonoma",
  "BS_BROWSER": "playwright-webkit",
  "BS_BROWSER_VERSION": "17",
  "DEVICE_NAME": "macsonoma-safari-17"
}
```

### Exemple 4: Mac 15 + Safari latest
```bash
node scripts/resolve-browserstack-config.js --os Mac --osVersion Sequoia --browser safari --browserVersion latest
```

**Résultat attendu:**
```json
{
  "BS_OS": "OS X",
  "BS_OS_VERSION": "Sequoia",
  "BS_BROWSER": "playwright-webkit",
  "BS_BROWSER_VERSION": "latest",
  "DEVICE_NAME": "macsequoia-safari-latest"
}
```

### Exemple 5: Windows 11 + Edge 120
```bash
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser edge --browserVersion 120
```

**Résultat attendu:**
```json
{
  "BS_OS": "Windows",
  "BS_OS_VERSION": "11",
  "BS_BROWSER": "edge",
  "BS_BROWSER_VERSION": "120",
  "DEVICE_NAME": "windows11-edge-120"
}
```

---

## 🔄 Payloads JSON pour Jira Automation

### Template de base
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "VOTRE_CLE_JIRA",
    "summary": "Description du test",
    "os": "VALEUR_OS",
    "osVersion": "VALEUR_VERSION_OS",
    "browser": "VALEUR_NAVIGATEUR",
    "browserVersion": "VALEUR_VERSION_NAVIGATEUR"
  }
}
```

### Exemple 1: Test Chrome stable
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-123",
    "summary": "Test de régression Chrome Windows 11",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest"
  }
}
```

### Exemple 2: Test Firefox compatibilité
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-456",
    "summary": "Compatibilité Firefox version 120",
    "os": "Windows",
    "osVersion": "10",
    "browser": "firefox",
    "browserVersion": "120"
  }
}
```

### Exemple 3: Test Safari Mac
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-789",
    "summary": "Validation Safari macOS Sonoma",
    "os": "Mac",
    "osVersion": "Sonoma",
    "browser": "safari",
    "browserVersion": "17"
  }
}
```

### Exemple 4: Test multi-version
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-999",
    "summary": "Test Chrome version spécifique",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "119"
  }
}
```

### Exemple 5: Test Edge Chromium
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-111",
    "summary": "Test Edge Chromium",
    "os": "Windows",
    "osVersion": "11",
    "browser": "edge",
    "browserVersion": "latest"
  }
}
```

---

## 🎨 Configurations Jira Automation Rules

### Configuration 1: Règle simple (paramètres fixes)

**Nom:** "Lancer tests - Windows 11 Chrome"

**Déclencheur:** Transition vers "Ready for Testing"

**Action Web Request:**

```
URL: https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches

Method: POST

Headers:
Authorization: Bearer YOUR_GITHUB_PAT_TOKEN
Accept: application/vnd.github.v3+json
Content-Type: application/json

Body:
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest"
  }
}
```

### Configuration 2: Règle avec custom fields

**Nom:** "Lancer tests - Configuration personnalisée"

**Déclencheur:** Transition vers "Run Tests"

**Conditions:** Tous les champs requis sont remplis

**Action Web Request:**

```
URL: https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches

Method: POST

Headers:
Authorization: Bearer YOUR_GITHUB_PAT_TOKEN
Accept: application/vnd.github.v3+json
Content-Type: application/json

Body:
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "{{customfield_10000}}",
    "osVersion": "{{customfield_10001}}",
    "browser": "{{customfield_10002}}",
    "browserVersion": "{{customfield_10003}}"
  }
}
```

(Remplacez `customfield_XXXXX` par vos IDs réels)

### Configuration 3: Règle conditionnelle

**Nom:** "Lancer tests - Safari sur Mac uniquement"

**Déclencheur:** Transition vers "QA Testing"

**Conditions:** 
- Priority = High
- Component = "Web UI"

**Action Web Request:**

```
URL: https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches

Method: POST

Headers:
Authorization: Bearer YOUR_GITHUB_PAT_TOKEN
Accept: application/vnd.github.v3+json
Content-Type: application/json

Body:
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}} - Safari Test",
    "os": "Mac",
    "osVersion": "14",
    "browser": "safari",
    "browserVersion": "latest"
  }
}
```

---

## 🧪 Commandes PowerShell

### Test simple
```powershell
powershell -ExecutionPolicy Bypass -File scripts/test-browserstack-config.ps1
```

### Test avec paramètres
```powershell
powershell -ExecutionPolicy Bypass -File scripts/test-browserstack-config.ps1 `
  -OS Windows `
  -OSVersion 11 `
  -Browser chrome `
  -BrowserVersion latest
```

### Tous les tests rapides
```powershell
# Test 1
powershell -ExecutionPolicy Bypass -File scripts/test-browserstack-config.ps1 -OS Windows -OSVersion 11 -Browser chrome -BrowserVersion latest

# Test 2
powershell -ExecutionPolicy Bypass -File scripts/test-browserstack-config.ps1 -OS Windows -OSVersion 10 -Browser firefox -BrowserVersion latest

# Test 3
powershell -ExecutionPolicy Bypass -File scripts/test-browserstack-config.ps1 -OS Mac -OSVersion 14 -Browser safari -BrowserVersion 17

# Test 4
powershell -ExecutionPolicy Bypass -File scripts/test-browserstack-config.ps1 -OS Mac -OSVersion 15 -Browser safari -BrowserVersion latest
```

---

## 🔐 Configuration du token GitHub

### Créer un token
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. New token (classic)
3. Nom: "jira-automation-dispatch"
4. Scopes: `repo`, `workflow`
5. Copy token

### Utiliser le token dans Jira
```
Authorization: Bearer ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Vérifier le token
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" https://api.github.com/user
```

---

## 📊 Matrice de test complète

Voici toutes les combinaisons supportées:

### Windows
- [ ] Windows 7 + Chrome latest
- [ ] Windows 8 + Chrome latest
- [ ] Windows 8.1 + Chrome latest
- [ ] Windows 10 + Chrome latest
- [ ] Windows 10 + Firefox latest
- [ ] Windows 10 + Edge latest
- [ ] Windows 11 + Chrome latest
- [ ] Windows 11 + Firefox latest
- [ ] Windows 11 + Edge latest

### Mac
- [ ] Mac 10.15 + Safari latest
- [ ] Mac 12 + Safari latest
- [ ] Mac 13 + Safari latest
- [ ] Mac 14 + Safari latest
- [ ] Mac 14 + Safari 17
- [ ] Mac 14 + Safari 16
- [ ] Mac 15 + Safari latest
- [ ] Mac 15 + Safari 17

---

## 🔍 Checklist de test

Pour chaque configuration:
- [ ] Script valide la configuration
- [ ] GitHub Actions déclenche le workflow
- [ ] Tests s'exécutent sur BrowserStack
- [ ] Résultats générés (HTML, PDF)
- [ ] Résultats uploadés vers Xray
- [ ] Issue Jira mise à jour

---

## 📚 Templates à réutiliser

Gardez ces templates à portée de main:

**Template 1: Payload Jira minimal**
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-{{issueNumber}}",
    "summary": "{{issueSummary}}",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest"
  }
}
```

**Template 2: Web Request Jira minimaliste**
```
POST https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches
Authorization: Bearer {{GITHUB_TOKEN}}
Content-Type: application/json

{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest"
  }
}
```

---

**Astuce:** Sauvegardez ces exemples dans un document Jira pour un accès rapide! 📌
