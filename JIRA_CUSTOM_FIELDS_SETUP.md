# Guide : Créer et alimenter les champs personnalisés Jira

## Vue d'ensemble

Nous allons créer 4 champs personnalisés dans Jira pour capturer les détails d'exécution des tests :
- **OS** : Système d'exploitation (Windows, Mac)
- **OS Version** : Version du système (10, 11, Sonoma, Big Sur, etc.)
- **Browser** : Navigateur (Chrome, Firefox, Safari, Edge, Chromium)
- **Browser Version** : Version du navigateur (143, 144, latest, etc.)

Ces champs seront automatiquement remplis lors de chaque exécution de test.

## Étape 1 : Créer les champs personnalisés dans Jira

### Accéder à la configuration des champs

1. Allez dans **Jira Settings** (icône engrenage en haut à droite)
2. Sélectionnez **Issues** dans le menu de gauche
3. Cliquez sur **Custom fields**
4. Cliquez sur le bouton **Create custom field**

### Créer le champ "OS"

**Configuration** :
- **Field type** : Short text (100 characters max)
- **Name** : `OS`
- **Description** : `Operating System (Windows, Mac, etc.)`
- **Applicable issue types** : Test Execution
- **Default value** : (laisser vide)

**Après création** :
- Notez l'ID du champ (ex: `customfield_10000`)
- Ce sera utilisé dans les scripts pour mettre à jour la valeur

### Créer le champ "OS Version"

**Configuration** :
- **Field type** : Short text (100 characters max)
- **Name** : `OS Version`
- **Description** : `Version of the Operating System (10, 11, Sonoma, Big Sur, etc.)`
- **Applicable issue types** : Test Execution
- **Default value** : (laisser vide)

### Créer le champ "Browser"

**Configuration** :
- **Field type** : Short text (100 characters max)
- **Name** : `Browser`
- **Description** : `Web Browser name (Chrome, Firefox, Safari, Edge, Chromium)`
- **Applicable issue types** : Test Execution
- **Default value** : (laisser vide)

### Créer le champ "Browser Version"

**Configuration** :
- **Field type** : Short text (100 characters max)
- **Name** : `Browser Version`
- **Description** : `Version of the Web Browser (143, latest, etc.)`
- **Applicable issue types** : Test Execution
- **Default value** : (laisser vide)

## Étape 2 : Trouver les IDs des champs personnalisés

Une fois créés, vous devez récupérer les IDs pour les utiliser dans les scripts.

### Via l'interface Jira

1. Allez dans **Settings** > **Issues** > **Custom fields**
2. Trouvez chaque champ et notez l'ID en haut du champ
3. Ils ressemblent à : `customfield_10000`, `customfield_10001`, etc.

### Via l'API Jira

Vous pouvez aussi utiliser PowerShell pour lister les champs :

```powershell
$JiraUrl = "https://your-jira.atlassian.net"
$JiraUser = "your-email@example.com"
$JiraApiToken = "your-api-token"

$credPair = "$JiraUser`:$JiraApiToken"
$encodedCred = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($credPair))
$headers = @{ Authorization = "Basic $encodedCred" }

$response = Invoke-RestMethod -Uri "$JiraUrl/rest/api/3/field" -Method GET -Headers $headers

$response | Where-Object { $_.name -match "OS|Browser" } | ForEach-Object {
    Write-Host "$($_.name) : $($_.id)"
}
```

## Étape 3 : Configurer les secrets GitHub

Vous devez ajouter les IDs des champs comme secrets GitHub Actions.

### Ajouter les secrets

1. Allez sur votre repo GitHub
2. Settings > Secrets and variables > Actions
3. Cliquez **New repository secret**

**Ajoutez** :
- `JIRA_CUSTOM_FIELD_OS` = `customfield_10000` (remplacez par l'ID réel)
- `JIRA_CUSTOM_FIELD_OS_VERSION` = `customfield_10001`
- `JIRA_CUSTOM_FIELD_BROWSER` = `customfield_10002`
- `JIRA_CUSTOM_FIELD_BROWSER_VERSION` = `customfield_10003`

## Étape 4 : Modifier le script post-execution

Le script `jira-post-execution.ps1` doit être mis à jour pour remplir ces champs.

Ajouter avant la mise à jour du titre :

```powershell
# Update custom fields
Write-Host "`n[1/6] Updating custom fields..."
$customFieldsUrl = "$JiraUrl/rest/api/3/issue/$ExecKey"

$customFieldsJson = @{
  fields = @{
    "$env:JIRA_CUSTOM_FIELD_OS" = $env:BS_OS
    "$env:JIRA_CUSTOM_FIELD_OS_VERSION" = $env:BS_OS_VERSION
    "$env:JIRA_CUSTOM_FIELD_BROWSER" = $env:BS_BROWSER
    "$env:JIRA_CUSTOM_FIELD_BROWSER_VERSION" = $env:BS_BROWSER_VERSION
  }
} | ConvertTo-Json

try {
  Invoke-RestMethod -Method Put -Uri $customFieldsUrl -Headers $jsonHeaders `
    -ContentType "application/json" -Body $customFieldsJson | Out-Null
  Write-Host "Custom fields updated successfully"
} catch {
  Write-Host "Warning: Could not update custom fields - $($_.Exception.Message)"
}
```

## Étape 5 : Mettre à jour le workflow GitHub Actions

Modifiez le workflow pour passer les variables d'environnement au script post-execution.

Ajoutez à l'étape "Update Jira Test Execution" :

```yaml
env:
  JIRA_CUSTOM_FIELD_OS: ${{ secrets.JIRA_CUSTOM_FIELD_OS }}
  JIRA_CUSTOM_FIELD_OS_VERSION: ${{ secrets.JIRA_CUSTOM_FIELD_OS_VERSION }}
  JIRA_CUSTOM_FIELD_BROWSER: ${{ secrets.JIRA_CUSTOM_FIELD_BROWSER }}
  JIRA_CUSTOM_FIELD_BROWSER_VERSION: ${{ secrets.JIRA_CUSTOM_FIELD_BROWSER_VERSION }}
```

## Architecture complète

```
GitHub Actions Workflow
    ↓
resolve-browserstack-config.js
    ├─ BS_OS (ex: "Windows")
    ├─ BS_OS_VERSION (ex: "11")
    ├─ BS_BROWSER (ex: "playwright-chromium")
    └─ BS_BROWSER_VERSION (ex: "143")
    ↓
Tests exécutés
    ↓
upload-xray.ps1
    └─ Crée Test Execution dans Jira
    ↓
jira-post-execution.ps1
    ├─ [1/6] Mettre à jour champs personnalisés ← NOUVEAU
    ├─ [2/6] Ajouter label
    ├─ [3/6] Mettre à jour titre
    ├─ [4/6] Attacher HTML report
    ├─ [5/6] Attacher PDF report
    └─ [6/6] Ajouter lien GitHub Actions
```

## Avantages

✅ **Traçabilité** : Voir exactement quel OS/Browser a été utilisé  
✅ **Filtrage** : Chercher les tests par OS/Browser dans Jira  
✅ **Rapports** : Créer des dashboards filtrés par configuration  
✅ **Analyse** : Identifier les problèmes par configuration  

## Exemple de résultat

Une fois configuré, chaque Test Execution aura :

```
Test Execution: DEMO-123-1

Détails:
- OS: Windows
- OS Version: 11
- Browser: playwright-chromium
- Browser Version: 143
- Labels: windows11-chromium-143
- Title: Test execution - device : windows11-chromium-143
- Attachments: [HTML Report] [PDF Report]
- Remote Links: [GitHub Actions Run #456]
```

## Vérification

Pour vérifier que tout fonctionne :

1. Lancez un test via GitHub Actions
2. Regardez les logs de l'étape "Update Jira Test Execution"
3. Allez sur le Test Execution dans Jira
4. Vérifiez que les champs sont remplis avec les bonnes valeurs
5. Testez le filtrage par champ

## Dépannage

### Les champs ne sont pas remplis

**Causes possibles** :
1. L'ID du champ est incorrect
2. Le champ n'est pas assigné au type "Test Execution"
3. L'utilisateur Jira n'a pas les permissions d'édition

**Solution** :
- Vérifier les logs de GitHub Actions pour les erreurs
- Vérifier manuellement l'ID du champ dans Jira
- Vérifier les permissions de l'utilisateur

### Erreur "Could not find issue type"

- Le champ personnalisé n'est pas lié au type "Test Execution"
- Allez dans le champ > Configure > add issue type "Test Execution"

### Erreur 400 ou 403 sur l'API

- Permissions insuffisantes
- Vérifier que l'utilisateur peut éditer les issues
- Vérifier le format JSON de la requête API
