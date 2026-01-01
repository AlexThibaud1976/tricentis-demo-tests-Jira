# Guide d'Exécution Dynamique des Tests via Jira et GitHub Actions

## 📋 Vue d'ensemble

Le système permet de lancer les tests Playwright sur **BrowserStack avec des paramètres personnalisés** directement depuis :
- Une **Automation Rule dans Jira** (recommandé)
- Manuellement via **GitHub Actions Workflow Dispatch**

## 🎯 Paramètres disponibles

### Système d'Exploitation (OS)
- **Windows** : versions 7, 8, 8.1, 10, 11
- **Mac** : versions 10.15, 12, 13, 14, 15

### Navigateurs
- **Chrome** : versions latest, 120, 119, 118, 117, 116
- **Firefox** : versions latest, 121, 120, 119, 118
- **Safari** : versions latest, 17, 16, 15, 14
- **Edge** : versions latest, 120, 119, 118, 117

### Versions
- Chaque navigateur accepte `latest` ou une version numérique spécifique

## 🚀 Utilisation via GitHub Actions

### Option 1 : Lancer manuellement depuis GitHub

1. Accédez à **Actions** → **Playwright Tests**
2. Cliquez sur **Run workflow**
3. Remplissez les paramètres :
   - **Jira Test Plan Key** : ex. `DEMO-123`
   - **Jira issue summary** : description optionnelle
   - **Système d'exploitation** : Windows ou Mac
   - **Version du système d'exploitation** : ex. 11
   - **Navigateur** : chrome, firefox, safari ou edge
   - **Version du navigateur** : latest ou numéro de version

4. Cliquez sur **Run workflow**

### Option 2 : Depuis une Automation Rule Jira (recommandé)

#### Configuration Jira

1. Allez dans **Jira** → **Project settings** → **Automation**
2. Créez une nouvelle règle ou modifiez-en une existante
3. Sélectionnez le déclencheur souhaité (ex: Transition, Comment, etc.)
4. Ajoutez l'action **Send web request** :

```
URL: https://api.github.com/repos/{YOUR_ORG}/{YOUR_REPO}/actions/workflows/playwright.yml/dispatches

Method: POST

Headers:
  Authorization: Bearer {YOUR_GITHUB_TOKEN}
  Accept: application/vnd.github.v3+json
  Content-Type: application/json

Body (JSON):
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

#### Variables Jira disponibles

- `{{issue.key}}` : Clé de l'issue (ex: DEMO-123)
- `{{issue.summary}}` : Titre de l'issue
- `{{issue.description}}` : Description de l'issue

#### Paramètres d'entrée Jira

Vous pouvez rendre les paramètres d'entrée dynamiques via **Custom fields** Jira :

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "{{issue.customfield_10000}}",
    "osVersion": "{{issue.customfield_10001}}",
    "browser": "{{issue.customfield_10002}}",
    "browserVersion": "{{issue.customfield_10003}}"
  }
}
```

Remplacez `customfield_10000`, etc. par vos IDs de custom fields réels.

## 🔄 Flux d'exécution

```
GitHub Actions Workflow Dispatch
         ↓
   Validation des paramètres
    (scripts/resolve-browserstack-config.js)
         ↓
   Résolution de la configuration BrowserStack
         ↓
   Installation des dépendances Playwright
         ↓
   Exécution des tests sur BrowserStack
         ↓
   Génération du rapport HTML/PDF
         ↓
   Upload des résultats vers Xray
         ↓
   Mise à jour de Jira avec les résultats
```

## 🔐 Secrets GitHub requis

Assurez-vous que les secrets suivants sont configurés dans GitHub :

- `BROWSERSTACK_USERNAME` : Nom d'utilisateur BrowserStack
- `BROWSERSTACK_ACCESS_KEY` : Clé d'accès BrowserStack
- `XRAY_CLIENT_ID` : Client ID Xray
- `XRAY_CLIENT_SECRET` : Client Secret Xray
- `JIRA_USER` : Utilisateur Jira (email)
- `JIRA_API_TOKEN` : Token API Jira
- `JIRA_URL` : URL de votre instance Jira

### Configuration du Token GitHub pour Jira

1. Créez un **Personal Access Token (PAT)** dans GitHub :
   - Settings → Developer settings → Personal access tokens
   - Cochez les permissions : `repo`, `workflow`

2. Ajoutez-le à vos secrets GitHub ou utilisez-le directement dans la requête Jira

## 📊 Exemple d'utilisation complète

### Scénario : Tester Chrome latest sur Windows 11

**Via GitHub :**
```bash
os: Windows
osVersion: 11
browser: chrome
browserVersion: latest
issueKey: DEMO-456
```

**Via Jira Automation :**
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-456",
    "summary": "Test de compatibilité",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest"
  }
}
```

## 🧪 Tester localement

Pour valider la configuration sans lancer les tests :

```bash
node scripts/resolve-browserstack-config.js \
  --os Windows \
  --osVersion 11 \
  --browser chrome \
  --browserVersion latest
```

Output attendu :
```
✅ Variables d'environnement exportées vers GITHUB_ENV
{
  "BS_OS": "Windows",
  "BS_OS_VERSION": "11",
  "BS_BROWSER": "chrome",
  "BS_BROWSER_VERSION": "latest",
  "DEVICE_NAME": "windows11-chrome-latest"
}
```

## 🐛 Dépannage

### Erreur : "OS invalide"
Vérifiez que vous utilisez exactement `Windows` ou `Mac` (casse importante).

### Erreur : "Version OS invalide"
Assurez-vous que la version est supportée pour l'OS choisi :
- Windows : 7, 8, 8.1, 10, 11
- Mac : 10.15, 12, 13, 14, 15

### Erreur : "Navigateur invalide"
Vérifiez que vous utilisez : `chrome`, `firefox`, `safari` ou `edge` (minuscules).

### Erreur : "Version navigateur invalide"
Utilisez `latest` ou un numéro de version valide. Voir [Paramètres disponibles](#-paramètres-disponibles).

### Les tests ne se lancent pas
1. Vérifiez que les secrets GitHub sont bien configurés
2. Vérifiez que le workflow n'a pas d'erreur de syntaxe YAML
3. Vérifiez que les paramètres sont dans les bonnes casses

## 📚 Resources additionnelles

- [Documentation BrowserStack Playwright](https://www.browserstack.com/docs/automate/playwright/getting-started)
- [GitHub Actions Workflow Dispatch](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow)
- [Jira Automation Rules](https://confluence.atlassian.com/jira/automation-rules-1004476436.html)
- [Xray Test Management](https://xray.cloud.getxray.app/)
