# 🔄 Guide de Migration - Règles d'automatisation Jira

## ⚠️ Mise à jour requise

Si vous avez créé des règles d'automatisation Jira **avant février 2026**, vous devez les mettre à jour pour ajouter deux nouveaux paramètres obligatoires.

---

## 📝 Changements requis

### Avant (ancienne version)

```json
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

### Après (nouvelle version) ✅

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest",
    "testScope": "all",
    "confluenceReport": "false"
  }
}
```

**Nouveaux paramètres :**
- `"testScope": "all"` - Exécute tous les tests (recommandé pour commencer)
- `"confluenceReport": "false"` - Désactive la publication Confluence (activez si configuré)

---

## 🚀 Procédure de mise à jour

### Étape 1 : Identifier vos règles

1. Allez dans **Jira** → **Paramètres** → **Système** → **Automation**
2. Cherchez les règles qui appellent le workflow GitHub Actions
3. Identifiez celles qui utilisent `playwright.yml`

### Étape 2 : Modifier chaque règle

Pour chaque règle trouvée :

1. Cliquez sur la règle
2. Trouvez l'action **"Send web request"**
3. Cliquez sur **Edit**
4. Dans le champ **Body**, ajoutez les deux lignes :
   ```json
   "testScope": "all",
   "confluenceReport": "false"
   ```
5. Sauvegardez

### Étape 3 : Tester

1. Créez une issue de test
2. Déclenchez la règle (transition vers le bon statut)
3. Vérifiez dans GitHub Actions que le workflow démarre
4. ✅ Si succès → passez à la règle suivante
5. ❌ Si échec → Consultez le dépannage ci-dessous

---

## 🎯 Valeurs recommandées

### testScope

| Situation | Valeur recommandée | Description |
|-----------|-------------------|-------------|
| **Tests complets** | `"all"` | Exécute toute la suite de tests |
| **Tests de fumée** | `"sanity"` | Tests rapides de base |
| **Tests ciblés** | `"login-logout"`, `"order-checkout"`, etc. | Périmètre spécifique |

**Liste complète des valeurs :** Voir [JIRA_AUTOMATION_SETUP.md](JIRA_AUTOMATION_SETUP.md#custom-field-5-périmètre-de-test-test-scope--nouveau)

### confluenceReport

| Situation | Valeur | Quand utiliser |
|-----------|--------|----------------|
| **Par défaut** | `"false"` | La plupart des exécutions |
| **Reporting important** | `"true"` | Releases, milestones, rapports |

**⚠️ Prérequis pour `"true"` :** Secrets GitHub Confluence configurés. Voir [CONFLUENCE_REPORTING_GUIDE.md](CONFLUENCE_REPORTING_GUIDE.md)

---

## 🔧 Exemples pratiques

### Règle 1: "Lancer tests complets"

**Avant :**
```json
{
  "inputs": {
    "issueKey": "{{issue.key}}",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest"
  }
}
```

**Après :**
```json
{
  "inputs": {
    "issueKey": "{{issue.key}}",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest",
    "testScope": "all",
    "confluenceReport": "false"
  }
}
```

### Règle 2: "Tests de login uniquement"

**Avant :**
```json
{
  "inputs": {
    "issueKey": "{{issue.key}}",
    "os": "Mac",
    "osVersion": "Sonoma",
    "browser": "safari",
    "browserVersion": "latest"
  }
}
```

**Après :**
```json
{
  "inputs": {
    "issueKey": "{{issue.key}}",
    "os": "Mac",
    "osVersion": "Sonoma",
    "browser": "safari",
    "browserVersion": "latest",
    "testScope": "login-logout",
    "confluenceReport": "false"
  }
}
```

### Règle 3: "Tests production avec rapport Confluence"

**Avant :**
```json
{
  "inputs": {
    "issueKey": "{{issue.key}}",
    "os": "Windows",
    "osVersion": "11",
    "browser": "edge",
    "browserVersion": "latest"
  }
}
```

**Après :**
```json
{
  "inputs": {
    "issueKey": "{{issue.key}}",
    "os": "Windows",
    "osVersion": "11",
    "browser": "edge",
    "browserVersion": "latest",
    "testScope": "all",
    "confluenceReport": "true"
  }
}
```

---

## 🛠️ Dépannage

### Erreur : "Required input not provided: testScope"

**Cause :** Le paramètre `testScope` est manquant
**Solution :** Ajoutez `"testScope": "all"` dans le body

### Erreur : "Required input not provided: confluenceReport"

**Cause :** Le paramètre `confluenceReport` est manquant  
**Solution :** Ajoutez `"confluenceReport": "false"` dans le body

### Erreur : Invalid value for testScope

**Cause :** Valeur invalide pour `testScope`  
**Solution :** Vérifiez que la valeur fait partie de la liste autorisée (voir JIRA_AUTOMATION_SETUP.md)

### Tests ne démarrent pas

1. Vérifiez les logs d'audit Jira Automation
2. Testez manuellement via GitHub Actions pour valider les paramètres
3. Vérifiez que le token GitHub est toujours valide

---

## ✅ Checklist de migration

- [ ] Identifier toutes les règles d'automatisation existantes
- [ ] Noter le nombre de règles à modifier
- [ ] Pour chaque règle :
  - [ ] Ouvrir l'action "Send web request"
  - [ ] Ajouter `"testScope"`
  - [ ] Ajouter `"confluenceReport"`
  - [ ] Sauvegarder
  - [ ] Tester
- [ ] Documenter les modifications
- [ ] Former l'équipe sur les nouveaux paramètres

---

## 📚 Documentation

| Guide | Contenu |
|-------|---------|
| [JIRA_AUTOMATION_SETUP.md](JIRA_AUTOMATION_SETUP.md) | Configuration complète et exemples |
| [CONFLUENCE_REPORTING_GUIDE.md](CONFLUENCE_REPORTING_GUIDE.md) | Configuration de la publication Confluence |
| [DYNAMIC_EXECUTION_GUIDE.md](DYNAMIC_EXECUTION_GUIDE.md) | Guide d'exécution dynamique |

---

## 💡 Conseil

**Approche progressive :**

1. Commencez par ajouter les valeurs par défaut :
   - `testScope: "all"`
   - `confluenceReport: "false"`

2. Une fois stable, affinez :
   - Créez des règles spécialisées par `testScope`
   - Activez Confluence pour les exécutions importantes

3. Ajoutez des custom fields Jira pour rendre ces paramètres configurables par issue

---

**Questions ?** Consultez la [documentation complète](DOCUMENTATION_INDEX.md) ou ouvrez une issue GitHub.
