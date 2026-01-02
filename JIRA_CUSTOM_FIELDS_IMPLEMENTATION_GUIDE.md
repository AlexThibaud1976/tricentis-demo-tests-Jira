# Guide pratique : Implémenter les champs personnalisés Jira

## Résumé

Vous allez créer 4 champs personnalisés dans Jira et les alimenter automatiquement lors de chaque exécution de test.

**Résultat final** : Chaque Test Execution aura ces informations :
```
OS: Windows
OS Version: 11
Browser: playwright-chromium
Browser Version: 143
```

## Implémentation en 5 étapes

### ✅ ÉTAPE 1 : Créer les champs personnalisés dans Jira

**Durée estimée : 10 minutes**

1. Connectez-vous à Jira Cloud
2. Allez dans **Settings** (icône engrenage) > **Issues** > **Custom fields**
3. Cliquez **Create custom field** (bouton bleu)

**Pour chaque champ à créer** :
- **Field type** : `Short text (100 characters max)`
- **Name** : Entrez exactement comme indiqué ci-dessous

**Champ 1** :
```
Name: OS
Description: Operating System (Windows, Mac, etc.)
Issue types: Test Execution
```

**Champ 2** :
```
Name: OS Version
Description: Version of the Operating System (10, 11, Sonoma, Big Sur, etc.)
Issue types: Test Execution
```

**Champ 3** :
```
Name: Browser
Description: Web Browser name (Chrome, Firefox, Safari, Edge, Chromium)
Issue types: Test Execution
```

**Champ 4** :
```
Name: Browser Version
Description: Version of the Web Browser (143, latest, etc.)
Issue types: Test Execution
```

✅ Après la création, vous verrez chaque champ avec son ID (ex: `customfield_10000`)

### ✅ ÉTAPE 2 : Récupérer les IDs des champs

**Méthode A : Via PowerShell (Recommandé)**

```powershell
cd E:\Code\tricentis-demo-tests-Jira
.\scripts\get-custom-field-ids.ps1 `
  -JiraUrl "https://your-jira.atlassian.net" `
  -JiraUser "your-email@example.com" `
  -JiraApiToken "your-api-token"
```

Le script affichera :
```
Custom fields related to OS and Browser:

✓ OS
  ID: customfield_10000

✓ OS Version
  ID: customfield_10001

✓ Browser
  ID: customfield_10002

✓ Browser Version
  ID: customfield_10003
```

**Notez ces IDs** - Vous les utiliserez à l'étape suivante.

**Méthode B : Manuellement dans Jira**

1. Allez dans **Settings** > **Issues** > **Custom fields**
2. Pour chaque champ (OS, OS Version, Browser, Browser Version) :
   - Cliquez sur le champ
   - Regardez l'URL de la page : `https://your-jira.atlassian.net/secure/admin/EditCustomField.jspa?id=customfield_10000`
   - L'ID est la valeur après `id=`

### ✅ ÉTAPE 3 : Ajouter les secrets GitHub

1. Allez sur votre repo GitHub
2. Cliquez **Settings** en haut
3. **Secrets and variables** > **Actions**
4. Cliquez **New repository secret**

**Ajoutez 4 secrets** (remplacez les valeurs par vos IDs) :

```
JIRA_CUSTOM_FIELD_OS = customfield_10000
JIRA_CUSTOM_FIELD_OS_VERSION = customfield_10001
JIRA_CUSTOM_FIELD_BROWSER = customfield_10002
JIRA_CUSTOM_FIELD_BROWSER_VERSION = customfield_10003
```

✅ Les secrets sont maintenant configurés.

### ✅ ÉTAPE 4 : Vérifier les changements de code

Le code a déjà été mis à jour automatiquement :

**Fichier** : `.github/workflows/playwright.yml`
```yaml
- name: Update Jira Test Execution
  env:
    JIRA_CUSTOM_FIELD_OS: ${{ secrets.JIRA_CUSTOM_FIELD_OS }}
    JIRA_CUSTOM_FIELD_OS_VERSION: ${{ secrets.JIRA_CUSTOM_FIELD_OS_VERSION }}
    JIRA_CUSTOM_FIELD_BROWSER: ${{ secrets.JIRA_CUSTOM_FIELD_BROWSER }}
    JIRA_CUSTOM_FIELD_BROWSER_VERSION: ${{ secrets.JIRA_CUSTOM_FIELD_BROWSER_VERSION }}
```

**Fichier** : `scripts/jira-post-execution.ps1`
```powershell
# 1. Add custom fields (OS, OS Version, Browser, Browser Version)
Write-Host "`n[1/6] Updating custom fields..."
$customFieldsObj = @{ fields = @{} }

if ($env:JIRA_CUSTOM_FIELD_OS -and $env:BS_OS) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_OS] = $env:BS_OS
}
# ... plus pour les autres champs
```

### ✅ ÉTAPE 5 : Tester

1. Allez dans GitHub
2. Cliquez **Actions**
3. Cliquez **Playwright Tests** (ou le nom du workflow)
4. Cliquez **Run workflow**
5. Sélectionnez :
   - **OS** : Windows (ou Mac)
   - **OS Version** : 11 (ou autre)
   - **Browser** : chrome (ou autre)
   - **Browser Version** : latest (ou numéro)
6. Cliquez **Run workflow** (bouton vert)

**Attendez la fin** (2-5 minutes)

**Vérifiez le résultat dans Jira** :
1. Allez sur le Test Execution créé
2. Vérifiez les champs personnalisés :
   ```
   OS: Windows
   OS Version: 11
   Browser: playwright-chromium
   Browser Version: latest
   ```

✅ C'est fait !

## Flux complet

```
1️⃣ Vous créez 4 champs dans Jira (OS, OS Version, Browser, Browser Version)
                          ↓
2️⃣ Vous récupérez les IDs des champs (customfield_10000, etc.)
                          ↓
3️⃣ Vous ajoutez les IDs comme secrets GitHub
                          ↓
4️⃣ Le code utilise ces secrets pour mettre à jour les champs
                          ↓
5️⃣ Chaque Test Execution a les champs automatiquement remplis
```

## Exemple complet de résultat

**Dans Jira Test Execution** :

```
DEMO-123-1 : Test execution - device : windows11-chromium-143

Champs personnalisés:
├─ OS: Windows
├─ OS Version: 11
├─ Browser: playwright-chromium
└─ Browser Version: 143

Labels:
└─ windows11-chromium-143

Titre: Test execution - device : windows11-chromium-143

Attachments:
├─ index.html (Playwright Report)
└─ report.pdf (PDF Report)

Remote Links:
└─ GitHub Actions Run #456
```

## Dépannage

### Erreur : "Custom field environment variables not set (optional)"

**Cause** : Les secrets ne sont pas configurés

**Solution** : 
1. Allez dans GitHub > Settings > Secrets
2. Vérifiez que les 4 secrets sont bien ajoutés
3. Réexécutez le workflow

### Les champs ne sont pas remplis

**Vérifier** :
1. Les IDs sont corrects (pas d'espace, pas de typo)
2. Les champs sont assignés au type "Test Execution"
3. L'utilisateur Jira a les permissions d'édition

**Dans Jira** :
1. Allez dans **Settings** > **Issues** > **Custom fields**
2. Cliquez sur chaque champ
3. Vérifiez que "Test Execution" est dans la liste des types

### Erreur 400 ou 403 de l'API

**Cause** : Permissions insuffisantes

**Solution** :
1. Vérifiez que l'utilisateur Jira a le rôle "Project Admin" ou supérieur
2. Essayez d'éditer manuellement un Test Execution
3. Si vous pouvez éditer manuellement, c'est un problème de token

### Comment obtenir un nouveau token API Jira

1. Allez sur https://id.atlassian.com/manage-profile/security/api-tokens
2. Cliquez **Create API token**
3. Copiez le token
4. Mettez à jour le secret GitHub `JIRA_API_TOKEN`

## Prochaines étapes

Une fois que tout fonctionne :

1. **Filtrer par configuration dans Jira** :
   - Allez sur un Test Plan
   - Cliquez sur "Filters"
   - Sélectionnez OS = "Windows" pour voir tous les tests Windows

2. **Créer des dashboards** :
   - Utiliser les champs pour créer des widgets
   - Voir les résultats par OS/Browser

3. **Analyser les résultats** :
   - Identifier les configurations problématiques
   - Comparer les résultats entre configurations

## Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs du workflow GitHub Actions
2. Cherchez l'erreur exacte dans l'étape "Update Jira Test Execution"
3. Consultez le guide `JIRA_CUSTOM_FIELDS_SETUP.md` pour plus de détails
4. Vérifiez les permissions de votre utilisateur Jira
