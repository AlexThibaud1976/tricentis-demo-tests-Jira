# 🚀 Exécution Dynamique des Tests BrowserStack depuis Jira

## 📌 Résumé de la solution

Vous pouvez maintenant **lancer les tests sur BrowserStack avec n'importe quelle combinaison OS/Navigateur** directement depuis une **Automation Rule Jira**.

### ✨ Nouvelles fonctionnalités

✅ Sélection dynamique du **Système d'exploitation** (Windows, Mac)  
✅ Sélection dynamique de la **version de l'OS** (7, 8, 8.1, 10, 11, 10.15, 12, 13, 14, 15)  
✅ Sélection dynamique du **navigateur** (Chrome, Firefox, Safari, Edge)  
✅ Sélection dynamique de la **version du navigateur** (latest ou numéro spécifique)  
✅ Validation automatique des paramètres  
✅ Rapports Xray enrichis (reporter unique `@xray-app/playwright-junit-reporter`)  
✅ Remontée des résultats dans Xray/Jira  
✅ Captures d'écran pleine page automatiques (échecs + evidence)  

---

## 🎯 Comment l'utiliser

### Option 1 : Lancer manuellement depuis GitHub Actions

1. Allez sur **GitHub Actions** → **Playwright Tests**
2. Cliquez **Run workflow**
3. Remplissez les paramètres et lancez

### Option 2 : Lancer depuis une Automation Rule Jira (recommandé)

1. Créez une **Automation Rule** dans Jira (voir [JIRA_AUTOMATION_SETUP.md](./JIRA_AUTOMATION_SETUP.md))
2. Configurez la règle pour appeler le workflow GitHub avec les paramètres
3. Créez une issue dans Jira → les tests se lancent automatiquement

---

## 📚 Documentation complète

| Document | Contenu |
|----------|---------|
| [DYNAMIC_EXECUTION_GUIDE.md](./DYNAMIC_EXECUTION_GUIDE.md) | Guide utilisateur complet avec exemples |
| [JIRA_AUTOMATION_SETUP.md](./JIRA_AUTOMATION_SETUP.md) | Configuration Jira Automation Rules |
| [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) | Checklist d'implémentation étape par étape |

---

## 🔧 Fichiers modifiés/créés

### Nouveaux fichiers
```
scripts/
  ├── resolve-browserstack-config.js    # Script de validation et mapping
  └── test-browserstack-config.ps1      # Script de test PowerShell

Documentation/
  ├── DYNAMIC_EXECUTION_GUIDE.md        # Guide utilisateur
  ├── JIRA_AUTOMATION_SETUP.md          # Guide intégration Jira
  └── IMPLEMENTATION_CHECKLIST.md       # Checklist d'implémentation
```

### Fichiers modifiés
```
.github/workflows/
  └── playwright.yml                    # Remplacé 2 jobs fixes par 1 job dynamique
```

---

## ⚡ Quick Start (5 minutes)

### 1. Tester localement
```bash
node scripts/resolve-browserstack-config.js \
  --os Windows \
  --osVersion 11 \
  --browser chrome \
  --browserVersion latest
```

### 2. Lancer via GitHub Actions
- Allez sur **GitHub Actions** → **Playwright Tests** → **Run workflow**
- Remplissez: OS=Windows, OSVersion=11, Browser=chrome, BrowserVersion=latest
- Cliquez **Run workflow**

### 3. Configurer Jira Automation (optionnel)
- Voir [JIRA_AUTOMATION_SETUP.md](./JIRA_AUTOMATION_SETUP.md) - Section "Phase 3"

---

## 📋 Paramètres supportés

### Système d'exploitation
- **Windows** : 7, 8, 8.1, 10, 11
- **Mac** : 10.15, 12, 13, 14, 15

### Navigateurs et versions
- **Chrome** : latest, 120, 119, 118, 117, 116
- **Firefox** : latest, 121, 120, 119, 118
- **Safari** : latest, 17, 16, 15, 14
- **Edge** : latest, 120, 119, 118, 117

---

## 🔐 Secrets GitHub requis

Vérifiez que ces secrets sont configurés :
- `BROWSERSTACK_USERNAME`
- `BROWSERSTACK_ACCESS_KEY`
- `XRAY_CLIENT_ID`
- `XRAY_CLIENT_SECRET`
- `JIRA_USER`
- `JIRA_API_TOKEN`
- `JIRA_URL`

---

## 🚨 Points importants

### ⚠️ Avant de commencer
1. ✅ Vérifiez que les secrets GitHub sont configurés
2. ✅ Assurez-vous que vous avez les accès BrowserStack
3. ✅ Créez un GitHub PAT si vous voulez utiliser Jira Automation

### 🔒 Sécurité
- Ne committez **JAMAIS** votre GitHub PAT
- Stockez-le dans un secret ou variable d'environnement
- Limitez les permissions du token au minimum

### ⏱️ Performance
- Un test = un workflow dispatch
- Durée typique : 10-15 minutes par test
- Les rapports sont conservés 30 jours

---

## 📊 Architecture

```
Jira Automation Rule
      ↓
GitHub Actions Workflow Dispatch
      ↓
Validate Parameters (resolve-browserstack-config.js)
      ↓
Run Tests on BrowserStack
      ↓
Generate Reports (HTML, PDF)
      ↓
Upload Results to Xray
      ↓
Update Jira Issue
```

---

## 🐛 Dépannage rapide

**Les tests ne se lancent pas ?**
→ Voir [DYNAMIC_EXECUTION_GUIDE.md#-dépannage](./DYNAMIC_EXECUTION_GUIDE.md#-dépannage)

**La configuration est invalide ?**
→ Vérifiez la casse et les paramètres supportés ci-dessus

**Erreur lors de l'exécution ?**
→ Vérifiez les logs du workflow GitHub Actions

---

## 📞 Support

1. Consultez la documentation spécialisée
2. Vérifiez les logs du workflow GitHub Actions
3. Vérifiez les audit logs de l'Automation Rule Jira
4. Utilisez le script de test local `test-browserstack-config.ps1`

---

## ✅ Exemple complet

### Sur GitHub Actions

```
Jira Test Plan Key: DEMO-456
Summary: Test compatibilité mobile
OS: Windows
OS Version: 11
Browser: chrome
Browser Version: latest

→ Les tests se lancent sur: Windows 11, Chrome latest
→ Les résultats sont remontés dans Xray
→ L'issue Jira DEMO-456 est mise à jour avec les résultats
```

### Via Jira Automation

```
Issue DEMO-789 créée
    ↓
Transition vers "Ready for Testing"
    ↓
Automation Rule déclenche le workflow GitHub
    ↓
Paramètres lus depuis les custom fields Jira
    ↓
Tests exécutés sur BrowserStack
    ↓
Résultats remontés dans Xray + Jira
```

---

## 🎓 En savoir plus

- [Guide d'utilisation complet](./DYNAMIC_EXECUTION_GUIDE.md)
- [Configuration Jira Automation](./JIRA_AUTOMATION_SETUP.md)
- [Checklist d'implémentation](./IMPLEMENTATION_CHECKLIST.md)
- [Documentation BrowserStack](https://www.browserstack.com/docs/automate/playwright)
- [Documentation Xray](https://docs.getxray.app/)

---

**Bon testing ! 🚀**
