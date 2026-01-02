# Solution complète : Champs personnalisés Jira pour les Test Executions

## Vue d'ensemble

✅ **OUI, c'est entièrement possible !**

Vous pouvez créer 4 champs personnalisés dans Jira et les alimenter **automatiquement** avec les valeurs sélectionnées lors du lancement des tests.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ GitHub Actions Workflow                                     │
├─────────────────────────────────────────────────────────────┤
│  1. Utilisateur sélectionne :                               │
│     • OS (Windows / Mac)                                    │
│     • OS Version (11, Sonoma, etc.)                         │
│     • Browser (Chrome, Firefox, etc.)                       │
│     • Browser Version (143, latest, etc.)                   │
│                                                              │
│  2. resolve-browserstack-config.js exporte :                │
│     • BS_OS = "Windows"                                     │
│     • BS_OS_VERSION = "11"                                  │
│     • BS_BROWSER = "playwright-chromium"                    │
│     • BS_BROWSER_VERSION = "143"                            │
│     • DEVICE_NAME = "windows11-chromium-143"                │
│                                                              │
│  3. Tests exécutés sur BrowserStack                         │
│                                                              │
│  4. upload-xray.ps1 crée Test Execution                     │
│                                                              │
│  5. jira-post-execution.ps1 met à jour Jira :              │
│     ├─ [1/6] Champs personnalisés ← NOUVEAU                │
│     │         OS, OS Version, Browser, Browser Version      │
│     ├─ [2/6] Label (windows11-chromium-143)                 │
│     ├─ [3/6] Titre                                          │
│     ├─ [4/6] Rapport HTML                                   │
│     ├─ [5/6] Rapport PDF                                    │
│     └─ [6/6] Lien GitHub Actions                            │
└─────────────────────────────────────────────────────────────┘
```

## Champs à créer

| Champ | Type | Description |
|-------|------|-------------|
| **OS** | Short text | Système d'exploitation (Windows, Mac) |
| **OS Version** | Short text | Version du système (10, 11, Sonoma, Big Sur) |
| **Browser** | Short text | Navigateur (playwright-chromium, playwright-firefox) |
| **Browser Version** | Short text | Version du navigateur (143, latest, etc.) |

## Comment ça fonctionne

### 1. Source des données
Les valeurs viennent directement du script `resolve-browserstack-config.js` qui exporte les variables d'environnement :

```javascript
const config = {
  BS_OS: "Windows",                    // ← Pour le champ "OS"
  BS_OS_VERSION: "11",                 // ← Pour le champ "OS Version"
  BS_BROWSER: "playwright-chromium",   // ← Pour le champ "Browser"
  BS_BROWSER_VERSION: "143",           // ← Pour le champ "Browser Version"
  DEVICE_NAME: "windows11-chromium-143"
};
```

### 2. Mise à jour automatique
Le script `jira-post-execution.ps1` utilise l'API Jira pour mettre à jour les champs :

```powershell
$customFieldsObj = @{ fields = @{} }

if ($env:JIRA_CUSTOM_FIELD_OS -and $env:BS_OS) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_OS] = $env:BS_OS
}
# ... même chose pour les 3 autres champs
```

### 3. Résultat dans Jira
Le Test Execution aura les champs remplis automatiquement :

```
DEMO-123-1

Champs personnalisés:
├─ OS: Windows
├─ OS Version: 11
├─ Browser: playwright-chromium
└─ Browser Version: 143
```

## Avantages

✅ **Traçabilité** : Voir exactement quelle configuration a été utilisée  
✅ **Filtrage** : Chercher les tests par OS ou Browser  
✅ **Analyse** : Créer des dashboards par configuration  
✅ **Automatique** : Zéro action manuelle requise  
✅ **Fiable** : Données proviennent directement du code  

## Implémentation

### Phase 1 : Configuration Jira (5 min)

1. **Créer 4 champs personnalisés** dans Jira
   - Allez dans Settings > Issues > Custom fields
   - Create custom field pour chacun

2. **Récupérer les IDs**
   - Utilisez le script `get-custom-field-ids.ps1`
   - Ou notez-les manuellement

### Phase 2 : Configuration GitHub (3 min)

3. **Ajouter 4 secrets GitHub**
   - Allez dans Settings > Secrets and variables > Actions
   - Ajoutez les 4 IDs des champs

### Phase 3 : Vérification (2 min)

4. **Exécuter un test**
   - GitHub Actions > Playwright Tests > Run workflow
   - Sélectionnez OS, version, browser, version
   - Attendez la fin

5. **Vérifier dans Jira**
   - Ouvrez le Test Execution créé
   - Vérifiez que les champs sont remplis

**Temps total : ~10 minutes**

## Flux de données

```
┌──────────────────────────┐
│ GitHub Actions Input     │
│ - OS: Windows            │
│ - OS Version: 11         │
│ - Browser: chrome        │
│ - Browser Version: latest│
└────────────┬─────────────┘
             │
             ↓
┌──────────────────────────┐
│ resolve-browserstack     │
│ config.js                │
└────────────┬─────────────┘
             │
   ┌─────────┴─────────┬──────────────┬───────────────┐
   │                   │              │               │
   ↓                   ↓              ↓               ↓
BS_OS=Windows    BS_OS_VERSION=11   BS_BROWSER=     BS_BROWSER_
                                    playwright-     VERSION=143
                                    chromium
   │                   │              │               │
   └─────────┬─────────┴──────────────┴───────────────┘
             │
             ↓
┌──────────────────────────┐
│ GitHub Actions Env Vars  │
└────────────┬─────────────┘
             │
             ↓
┌──────────────────────────┐
│ jira-post-execution.ps1  │
│ Mise à jour API Jira     │
└────────────┬─────────────┘
             │
             ↓
┌──────────────────────────┐
│ Jira Test Execution      │
│ avec champs remplis      │
└──────────────────────────┘
```

## Configuration requise

### Dans Jira
- ✅ 4 champs personnalisés créés
- ✅ IDs des champs (customfield_10000, etc.)
- ✅ Champs assignés au type "Test Execution"

### Dans GitHub
- ✅ 4 secrets avec les IDs
- ✅ Code déjà modifié ✓

## Code modifié

### ✓ `scripts/jira-post-execution.ps1`
Ajout de l'étape [1/6] pour mettre à jour les champs personnalisés

```powershell
# 1. Add custom fields (OS, OS Version, Browser, Browser Version)
Write-Host "`n[1/6] Updating custom fields..."
$customFieldsUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"

$customFieldsObj = @{ fields = @{} }

if ($env:JIRA_CUSTOM_FIELD_OS -and $env:BS_OS) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_OS] = $env:BS_OS
}
if ($env:JIRA_CUSTOM_FIELD_OS_VERSION -and $env:BS_OS_VERSION) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_OS_VERSION] = $env:BS_OS_VERSION
}
if ($env:JIRA_CUSTOM_FIELD_BROWSER -and $env:BS_BROWSER) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_BROWSER] = $env:BS_BROWSER
}
if ($env:JIRA_CUSTOM_FIELD_BROWSER_VERSION -and $env:BS_BROWSER_VERSION) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_BROWSER_VERSION] = $env:BS_BROWSER_VERSION
}

if ($customFieldsObj.fields.Count -gt 0) {
  $customFieldsJson = $customFieldsObj | ConvertTo-Json
  Invoke-RestMethod -Method Put -Uri $customFieldsUrl -Headers $jsonHeaders `
    -ContentType "application/json" -Body $customFieldsJson | Out-Null
}
```

### ✓ `.github/workflows/playwright.yml`
Ajout des variables d'environnement pour les secrets

```yaml
- name: Update Jira Test Execution
  env:
    JIRA_CUSTOM_FIELD_OS: ${{ secrets.JIRA_CUSTOM_FIELD_OS }}
    JIRA_CUSTOM_FIELD_OS_VERSION: ${{ secrets.JIRA_CUSTOM_FIELD_OS_VERSION }}
    JIRA_CUSTOM_FIELD_BROWSER: ${{ secrets.JIRA_CUSTOM_FIELD_BROWSER }}
    JIRA_CUSTOM_FIELD_BROWSER_VERSION: ${{ secrets.JIRA_CUSTOM_FIELD_BROWSER_VERSION }}
```

### ✓ `scripts/get-custom-field-ids.ps1` (NOUVEAU)
Utilitaire pour récupérer les IDs des champs créés

```powershell
.\scripts\get-custom-field-ids.ps1 `
  -JiraUrl "https://your-jira.atlassian.net" `
  -JiraUser "your-email@example.com" `
  -JiraApiToken "your-api-token"
```

## Guides de référence

- **JIRA_CUSTOM_FIELDS_SETUP.md** : Guide détaillé sur la création des champs
- **JIRA_CUSTOM_FIELDS_IMPLEMENTATION_GUIDE.md** : Guide pratique étape par étape

## Dépannage rapide

| Problème | Cause | Solution |
|----------|-------|----------|
| Champs non remplis | Secrets manquants | Ajouter secrets dans GitHub |
| Erreur 400 | ID champ incorrect | Vérifier IDs via script |
| Erreur 403 | Permissions insuffisantes | Vérifier rôle Jira |
| Logs vides | Variables env non passées | Vérifier workflow YAML |

## Prochaines étapes

1. ✅ Créer les 4 champs dans Jira
2. ✅ Récupérer les IDs
3. ✅ Ajouter les secrets GitHub
4. ✅ Exécuter un test
5. ✅ Vérifier dans Jira
6. 🚀 Utiliser pour filtrer et analyser

## Questions fréquentes

### Les champs sont-ils obligatoires ?
Non, le code continue même si les secrets ne sont pas configurés.

### Puis-je ajouter d'autres champs ?
Oui, le pattern est identique - ajouter le champ, l'ID en secret, puis l'utiliser dans le script.

### Comment modifier les champs après création ?
Via Settings > Custom fields > Edit field

### Les valeurs sont-elles historisées ?
Oui, Jira garde un historique des modifications.
