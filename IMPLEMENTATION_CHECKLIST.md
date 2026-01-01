# 🎯 Implémentation : Exécution Dynamique des Tests depuis Jira

## ✅ Checklist d'implémentation

### Phase 1 : Préparation GitHub

- [ ] Créer un **Personal Access Token (PAT)** GitHub
  - Allez sur **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
  - Créez un nouveau token avec scopes: `repo`, `workflow`
  - Copiez le token (vous en aurez besoin pour Jira)

- [ ] Vérifier que les secrets GitHub sont configurés
  - `BROWSERSTACK_USERNAME`
  - `BROWSERSTACK_ACCESS_KEY`
  - `XRAY_CLIENT_ID`
  - `XRAY_CLIENT_SECRET`
  - `JIRA_USER`
  - `JIRA_API_TOKEN`
  - `JIRA_URL`

### Phase 2 : Mettre à jour le Workflow GitHub (✅ FAIT)

- [x] Modifier `.github/workflows/playwright.yml`
  - Remplacer les jobs multiples (win10-firefox, win11-chrome) par un job unique dynamique
  - Ajouter les inputs pour OS, version OS, navigateur, version navigateur
  - Intégrer le script de résolution de configuration

- [x] Créer `scripts/resolve-browserstack-config.js`
  - Valider les paramètres d'entrée
  - Mapper vers les valeurs BrowserStack
  - Exporter les variables d'environnement

### Phase 3 : Configurer l'Automation Rule Jira

**Accès :** Project Settings → Automation

#### Option A : Configuration simple (tests avec paramètres fixes)

1. Cliquez sur **Create rule**
2. **Nom :** "Lancer les tests BrowserStack"
3. **Déclencheur :** "Issue transitioned" ou votre déclencheur préféré
4. **Action :** "Send web request"
5. **Configuration :**
   ```
   Method: POST
   URL: https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches
   Headers:
     Authorization: Bearer [YOUR_GITHUB_PAT_TOKEN]
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

#### Option B : Configuration avancée (avec Custom Fields)

1. **Créer les Custom Fields dans Jira** (Administration → Custom Fields)
   - Field 1: "Test Environment - OS" (Select: Windows, Mac)
   - Field 2: "Test Environment - OS Version" (Select: 7,8,8.1,10,11,10.15,12,13,14,15)
   - Field 3: "Test Environment - Browser" (Select: chrome,firefox,safari,edge)
   - Field 4: "Test Environment - Browser Version" (Select: latest,121,120,119,...)

2. Créer la Automation Rule avec:
   ```
   Method: POST
   URL: https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches
   Headers:
     Authorization: Bearer [YOUR_GITHUB_PAT_TOKEN]
     Accept: application/vnd.github.v3+json
     Content-Type: application/json
   
   Body:
   {
     "ref": "main",
     "inputs": {
       "issueKey": "{{issue.key}}",
       "summary": "{{issue.summary}}",
       "os": "{{issue.Test Environment - OS}}",
       "osVersion": "{{issue.Test Environment - OS Version}}",
       "browser": "{{issue.Test Environment - Browser}}",
       "browserVersion": "{{issue.Test Environment - Browser Version}}"
     }
   }
   ```

### Phase 4 : Tester l'intégration

#### Test 1 : Validation du script localement

```bash
cd e:\Code\tricentis-demo-tests-Jira

# Test 1: Configuration valide
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser chrome --browserVersion latest

# Test 2: Configuration invalide (pour vérifier la validation)
node scripts/resolve-browserstack-config.js --os InvalidOS --osVersion 11 --browser chrome --browserVersion latest
```

#### Test 2 : Déclencher manuellement depuis GitHub

1. Allez sur GitHub → **Actions** → **Playwright Tests**
2. Cliquez sur **Run workflow**
3. Remplissez les paramètres de test
4. Vérifiez les logs du workflow

#### Test 3 : Créer une issue de test dans Jira

1. Créez une nouvelle issue dans votre projet DEMO
2. Remplissez les custom fields (si vous avez utilisé l'Option B)
3. Effectuez la transition qui déclenche l'automation
4. Vérifiez que:
   - Un workflow GitHub Actions a été créé
   - Les tests s'exécutent sur BrowserStack
   - Les résultats sont remontés à Jira via Xray

## 📊 Architecture finale

```
┌─────────────────────────────────────────────────────────────────┐
│                         JIRA                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Automation Rule                                         │  │
│  │  "Lancer les tests"                                      │  │
│  │                                                          │  │
│  │  - Déclencheur: Transition de statut                   │  │
│  │  - Action: Send web request                            │  │
│  │  - Paramètres: OS, Browser, Versions                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           ↓                                      │
│                   (Web request)                                  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │    GitHub Actions Workflow Dispatch   │
        │    playwright.yml                     │
        └───────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │  Validate Parameters                  │
        │  (resolve-browserstack-config.js)     │
        └───────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │  Run Tests on BrowserStack            │
        │  (avec la config résolue)             │
        └───────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │  Generate Reports                     │
        │  (HTML, PDF, JUnit)                   │
        └───────────────────────────────────────┘
                            ↓
        ┌───────────────────────────────────────┐
        │  Upload Results to Xray               │
        │  Update Jira Issue                    │
        └───────────────────────────────────────┘
```

## 🔧 Fichiers modifiés/créés

### Créés
- ✅ `scripts/resolve-browserstack-config.js` - Script de validation et mapping
- ✅ `DYNAMIC_EXECUTION_GUIDE.md` - Guide utilisateur complet
- ✅ `JIRA_AUTOMATION_SETUP.md` - Guide d'intégration Jira
- ✅ `IMPLEMENTATION_CHECKLIST.md` - Ce fichier

### Modifiés
- ✅ `.github/workflows/playwright.yml`
  - Remplacé les 2 jobs fixés par 1 job dynamique
  - Ajouté les inputs pour OS, osVersion, browser, browserVersion
  - Intégré l'appel au script de résolution

## 📝 Configuration recommandée

### Pour démarrer rapidement : Option Simple

```
Cas d'usage: Tester toujours sur Windows 11 + Chrome latest
Effort: 10 minutes
Avantages: Pas de custom fields à créer
```

Suivez **Phase 1-3 Option A** ci-dessus.

### Pour plus de flexibilité : Option Avancée

```
Cas d'usage: Permettre aux testeurs de choisir l'OS et le navigateur
Effort: 30-45 minutes (création des custom fields)
Avantages: Flexibilité complète, interface Jira native
```

Suivez **Phase 1-3 Option B** ci-dessus.

## 🚨 Points importants

### Sécurité
- 🔒 Ne commitez **JAMAIS** votre GitHub PAT dans le code
- 🔒 Stockez-le dans un secret Jira ou utilisez les GitHub Secrets
- 🔒 Limitez les permissions du token au minimum nécessaire

### Performance
- ⏱️ Vous pouvez exécuter 1 seul test par workflow dispatch
- ⏱️ Pour tester plusieurs configurations en parallèle, créez plusieurs issues ou utilisez une boucle

### Maintenance
- 📝 Mettez à jour `scripts/resolve-browserstack-config.js` si BrowserStack ajoute de nouvelles versions
- 📝 Testez régulièrement pour vérifier que les versions listées sont toujours disponibles

## 🎓 Ressources d'apprentissage

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jira Automation Rules](https://confluence.atlassian.com/jira/automation-rules-1004476436.html)
- [BrowserStack Playwright](https://www.browserstack.com/docs/automate/playwright)
- [Xray Cloud Documentation](https://docs.getxray.app/display/XRAYCLOUD/Home)

## ✉️ Support

Pour toute question ou problème :
1. Consultez [DYNAMIC_EXECUTION_GUIDE.md](./DYNAMIC_EXECUTION_GUIDE.md#-dépannage)
2. Consultez [JIRA_AUTOMATION_SETUP.md](./JIRA_AUTOMATION_SETUP.md#-dépannage-des-automation-rules)
3. Vérifiez les logs du workflow GitHub Actions
4. Vérifiez les audit logs de l'Automation Rule Jira
