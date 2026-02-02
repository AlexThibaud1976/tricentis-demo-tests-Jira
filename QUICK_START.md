# ⚡ Démarrage rapide - 5 minutes

## 🎯 Objectif
Lancer les tests sur BrowserStack avec des paramètres personnalisés depuis Jira ou GitHub.

---

## 📋 Condition préalable
✅ Secrets GitHub configurés  
✅ Accès à BrowserStack  
✅ Accès à Xray Cloud (optionnel)

**📊 Reporter** : Utilise exclusivement `@xray-app/playwright-junit-reporter` (plus de reporter junit standard)  
**📸 Screenshots** : Captures pleine page automatiques sur échecs et evidence  

---

## 🚀 3 options pour lancer les tests

### Option 1️⃣ : Tester en local (1 minute)

```bash
cd e:\Code\tricentis-demo-tests-Jira

node scripts/resolve-browserstack-config.js \
  --os Windows \
  --osVersion 11 \
  --browser chrome \
  --browserVersion latest
```

✅ Si ça affiche une config JSON → c'est bon!

---

### Option 2️⃣ : Via GitHub Actions (3 minutes)

1. Allez sur → **GitHub** → **Actions** → **Playwright Tests**
2. Cliquez **Run workflow**
3. Remplissez:
   - OS: `Windows`
   - OS Version: `11`
   - Browser: `chrome`
   - Browser Version: `latest`
   - Issue Key: `DEMO-123`
4. Cliquez **Run workflow**

✅ Regardez les logs en temps réel

---

### Option 3️⃣ : Via Jira Automation (5 minutes + configuration)

#### Étape 1: Créer le token GitHub (1 minute)
- GitHub → Settings → Developer settings → **Personal access tokens** → **Tokens (classic)**
- **Generate new token**
- Nom: `jira-dispatch`
- Scopes: `repo`, `workflow`
- **Copy token**

#### Étape 2: Créer la Automation Rule Jira (4 minutes)
- Jira → Project Settings → **Automation** → **Create rule**
- **Nom:** "Lancer tests BrowserStack"
- **Déclencheur:** Transition vers "Ready for Testing"
- **Action:** Send web request
- **Configuration:**

```
Method: POST

URL: https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches

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

#### Étape 3: Tester (5 minutes)
- Créez une issue Jira
- Transitionne vers "Ready for Testing"
- 🎉 Les tests se lancent automatiquement!

---

## 📊 Paramètres rapides

### Système d'exploitation
- `Windows` (versions: 7, 8, 8.1, 10, 11)
- `Mac` (versions: Catalina, Big Sur, Monterey, Ventura, Sonoma, Sequoia)

### Navigateurs
- `chrome` ou `chromium` (latest, 144, 143, 142, 141, 140)
- `firefox` (latest, 144, 143, 142, 141, 140)
- `safari` (latest, 18, 17, 16, 15)
- `edge` (latest, 131, 130, 129, 128)

---

## 🧪 Exemples prêts à copier

### Windows 11 + Chrome latest
```bash
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser chrome --browserVersion latest
```

### Mac 14 + Safari 17
```bash
node scripts/resolve-browserstack-config.js --os Mac --osVersion Sonoma --browser safari --browserVersion 17
```

### Windows 10 + Firefox latest
```bash
node scripts/resolve-browserstack-config.js --os Windows --osVersion 10 --browser firefox --browserVersion latest
```

---

## 🐛 Si ça ne marche pas

### ❌ "Configuration rejetée"
→ Vérifiez la casse: `Windows` (pas `windows`)

### ❌ "Tests ne se lancent pas"
→ Vérifiez les secrets GitHub
→ Voir [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md#-dépannage-par-symptôme)

### ❌ "Jira Automation ne fonctionne pas"
→ Vérifiez le token GitHub est valide
→ Vérifiez le JSON est correct
→ Voir [JIRA_AUTOMATION_SETUP.md#-dépannage-des-automation-rules](./JIRA_AUTOMATION_SETUP.md#-dépannage-des-automation-rules)

---

## 📚 En savoir plus

- **Guide complet:** [DYNAMIC_TESTING_README.md](./DYNAMIC_TESTING_README.md)
- **Exemples prêts à copier:** [COPY_PASTE_EXAMPLES.md](./COPY_PASTE_EXAMPLES.md)
- **Documentation Jira:** [JIRA_AUTOMATION_SETUP.md](./JIRA_AUTOMATION_SETUP.md)
- **Index complet:** [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

---

**C'est tout! 🎉 Vous êtes prêt à lancer vos tests!**
