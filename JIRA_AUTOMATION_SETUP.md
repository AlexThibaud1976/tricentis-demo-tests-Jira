# Configuration Jira Automation pour les Tests Dynamiques

Ce fichier contient des exemples de configuration pour les Automation Rules Jira.

## 📌 Configuration de base

### 1. Créer une Automation Rule simple

**Nom :** "Lancer les tests sur BrowserStack - Configuration fixe"

**Déclencheur :** Transition vers un statut (ex: "Ready for Testing")

**Action :** Send web request

```json
{
  "url": "https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_GITHUB_PAT_TOKEN",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  },
  "body": {
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
}
```

## 🎨 Configuration avancée avec Custom Fields

Si vous avez créé des champs personnalisés pour sélectionner OS, navigateur, etc., voici comment les utiliser :

### 2. Automation Rule avec paramètres dynamiques

**Nom :** "Lancer les tests avec sélection OS/Navigateur"

**Déclencheur :** Transition vers "Ready for Testing"

**Conditions :** 
- `OS Browser Test` est défini (custom field)

**Action :** Send web request

```json
{
  "url": "https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_GITHUB_PAT_TOKEN",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  },
  "body": {
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
}
```

## 🔧 Configuration des Custom Fields Jira

Pour supporter la sélection dynamique, créez ces champs personnalisés :

### Custom Field 1: "Système d'Exploitation"
- **Type :** Select List (single choice)
- **Options :**
  - Windows
  - Mac
- **Default :** Windows
- **ID de champ :** `customfield_10000` (remplacez par votre ID réel)

### Custom Field 2: "Version OS"
- **Type :** Select List (single choice)
- **Options (Windows) :**
  - 7
  - 8
  - 8.1
  - 10
  - 11
- **Options (Mac) :**
  - 10.15
  - 12
  - 13
  - 14
  - 15
- **Default :** 11
- **ID de champ :** `customfield_10001`

### Custom Field 3: "Navigateur"
- **Type :** Select List (single choice)
- **Options :**
  - chrome
  - firefox
  - safari
  - edge
- **Default :** chrome
- **ID de champ :** `customfield_10002`

### Custom Field 4: "Version Navigateur"
- **Type :** Select List (single choice)
- **Options :**
  - latest
  - 121
  - 120
  - 119
  - 118
  - 117
  - 116
  - 17
  - 16
  - 15
  - 14
- **Default :** latest
- **ID de champ :** `customfield_10003`

## 📋 Exemples de payloads pour différents scénarios

### Exemple 1: Windows 10 + Firefox latest

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-123",
    "summary": "Test de compatibilité Firefox",
    "os": "Windows",
    "osVersion": "10",
    "browser": "firefox",
    "browserVersion": "latest"
  }
}
```

### Exemple 2: Mac 14 + Safari 17

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-456",
    "summary": "Test Mac Safari",
    "os": "Mac",
    "osVersion": "14",
    "browser": "safari",
    "browserVersion": "17"
  }
}
```

### Exemple 3: Windows 11 + Chrome 120

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-789",
    "summary": "Régression Chrome",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "120"
  }
}
```

## 🔑 Comment obtenir votre GitHub PAT Token

1. Allez sur **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Cliquez sur **Generate new token**
3. Donnez un nom au token (ex: "Jira Automation Dispatch")
4. Sélectionnez les scopes:
   - ✅ `repo` (Accès complet au repo)
   - ✅ `workflow` (Gestion des workflows)
5. Cliquez sur **Generate token**
6. Copiez le token et stockez-le de manière sécurisée

⚠️ **Important :** Ne partagez jamais ce token publiquement !

## 🔐 Sécurité

### Stocker le token de manière sécurisée

**Option 1 : Utiliser GitHub Secrets (recommandé)**
- Les workflows peuvent utiliser `${{ secrets.GITHUB_TOKEN }}` automatiquement
- Créez une variable d'environnement dans Jira qui référence ce secret

**Option 2 : Custom Field Jira (moins sécurisé)**
- Stockez le token dans un custom field de type "Password"
- Utilisez `{{issue.customfield_XXXXX}}` pour l'accéder

**Option 3 : Environnement d'exécution Jira**
- Utilisez les variables de secret de Jira si disponibles

### Vérifier les permissions

Assurez-vous que votre GitHub token a les bonnes permissions :
```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

## 🧪 Tester votre configuration

Pour tester sans créer une issue Jira :

1. Allez sur GitHub → **Actions** → **Playwright Tests**
2. Cliquez sur **Run workflow**
3. Remplissez manuellement les paramètres
4. Observez les résultats

## 📊 Dépannage des Automation Rules

### Les tests ne se lancent pas

1. **Vérifiez le token GitHub :**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows
   ```

2. **Vérifiez les logs Jira Automation :**
   - Allez dans **Automation** → votre règle → **Audit logs**

3. **Testez manuellement la requête :**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     -H "Content-Type: application/json" \
     -d '{
       "ref": "main",
       "inputs": {
         "issueKey": "TEST-1",
         "summary": "Test",
         "os": "Windows",
         "osVersion": "11",
         "browser": "chrome",
         "browserVersion": "latest"
       }
     }' \
     https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches
   ```

### Erreur 404

- Vérifiez que le nom du repository est correct
- Vérifiez que le fichier workflow existe bien (`.github/workflows/playwright.yml`)

### Erreur 401 Unauthorized

- Vérifiez que le token est valide
- Vérifiez que le token n'a pas expiré
- Vérifiez que le token a les bonnes permissions

## 📚 Ressources

- [GitHub Automation Actions](https://docs.github.com/en/actions)
- [Jira Automation Webhook Integration](https://confluence.atlassian.com/jira/automation-rules-1004476436.html)
- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/rest/v3/)
