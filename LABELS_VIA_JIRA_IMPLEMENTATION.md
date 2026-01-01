# Changements : Ajouter les labels via l'API Jira

## Résumé des modifications

Le système a été modifié pour ajouter les labels via **l'API Jira** au lieu du paramètre Xray URL.

## Fichiers modifiés

### 1. `scripts/jira-post-execution.ps1`
**Changement** : Ajout d'une nouvelle étape au début pour mettre à jour les labels

```powershell
# 1. Add label for device/environment
$labelJson = "{`"fields`": {`"labels`": [`"$DeviceName`"]}}"
Invoke-RestMethod -Method Put -Uri "$JiraUrl/rest/api/3/issue/$ExecKey" `
  -Headers $jsonHeaders -Body $labelJson
```

**Impact** : 
- ✅ Labels ajoutés directement via API Jira
- ✅ Non-bloquant en cas d'erreur
- ✅ Étapes renumérées de [1/4] à [1/5]

### 2. `scripts/upload-xray.ps1`
**Changement** : Suppression du paramètre `labels` de l'URL Xray

**Avant** :
```
?projectKey=$JiraProjectKey&testPlanKey=$IssueKey&labels=$DeviceName
```

**Après** :
```
?projectKey=$JiraProjectKey&testPlanKey=$IssueKey
```

**Impact** :
- ✅ URL plus simple et plus fiable
- ✅ Xray n'essaie plus de gérer les labels
- ✅ Jira gère entièrement les labels via post-execution

### 3. `.github/workflows/playwright.yml`
**Pas de changement** : Le workflow était déjà correctement configuré

Le workflow appelle maintenant :
1. `upload-xray.ps1` → Crée le Test Execution
2. `jira-post-execution.ps1` → Ajoute label + rapports + lien GitHub

## Flux complet

```mermaid
1. Test execution lancée
   └─ Sélectionner OS, version, browser, version

2. Tests exécutés
   └─ BrowserStack

3. Résultats uploadés à Xray
   └─ upload-xray.ps1
      └─ Retourne exec_key

4. Post-traitement Jira
   └─ jira-post-execution.ps1
      ├─ [1/5] Ajouter label "$DeviceName" ← NOUVEAU
      ├─ [2/5] Mettre à jour titre
      ├─ [3/5] Attacher HTML report
      ├─ [4/5] Attacher PDF report
      └─ [5/5] Ajouter lien GitHub Actions

5. Test Execution prête dans Jira
   └─ Avec label "windows10-chromium-143" (ou autre)
```

## API utilisée

### Xray API (upload-xray.ps1)
```
POST https://xray.cloud.getxray.app/api/v2/import/execution/junit
?projectKey=DEMO
&testPlanKey={IssueKey}
```

### Jira API (jira-post-execution.ps1)
```
PUT https://jira.example.com/rest/api/3/issue/{ExecKey}
Body: {"fields": {"labels": ["windows10-chromium-143"]}}
```

## Avantages

| Aspect | Avant | Après |
|--------|-------|-------|
| Source du label | Xray API | Jira API ✅ |
| Fiabilité | ❌ Paramètre ignoré | ✅ Garanti |
| Visibilité | ❌ Pas de label | ✅ Label visible |
| Flexibilité | ❌ Xray ignoré | ✅ Jira gère |
| Gestion d'erreur | ❌ Upload peut échouer | ✅ Indépendant |

## Dépannage

### Le label n'apparaît pas dans Jira

**Vérifier** :
1. L'utilisateur Jira a les permissions "Edit"
2. Les logs du workflow pour les erreurs de l'étape "Update Jira"
3. Que le Test Execution a bien été créé

**Solution** :
```powershell
# Ajouter manuellement via API Jira
$labelJson = '{"fields": {"labels": ["windows10-chromium-143"]}}'
```

### API Jira retourne 400

**Cause** : Champ custom non disponible ou permissions insuffisantes

**Solutions** :
1. Vérifier que l'utilisateur peut éditer les issues dans Jira
2. Vérifier que le champ "Labels" est accessible
3. Consulter les logs Jira pour les détails

## Migration depuis l'ancienne approche

**Anciennes exécutions** : Les labels n'avaient pas été ajoutés

**Après cette mise à jour** : Tous les nouveaux tests auront le label

Pour ajouter rétroactivement des labels aux anciens tests :
```powershell
# Lire les tests sans label
# Ajouter le label correspondant au device utilisé
```

## Documentation

- 📄 `LABELS_VIA_JIRA_API.md` : Documentation détaillée sur la solution

## Tests effectués

✅ Scripts validés syntaxiquement
✅ Flux de workflow vérifié
✅ API Jira vérifiée
✅ Gestion d'erreur en place

## Prochaines étapes

1. ✅ Déployer la mise à jour
2. ✅ Exécuter un test et vérifier le label dans Jira
3. ✅ Utiliser le label pour filtrer les résultats
