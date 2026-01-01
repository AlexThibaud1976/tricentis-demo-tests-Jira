# Solution : Ajouter les labels via l'API Jira

## Aperçu

Au lieu d'ajouter les labels via le paramètre Xray API, nous utilisons **l'API Jira directement** pour mettre à jour le Test Execution avec le label du device.

## Pourquoi cette approche ?

- ✅ L'API Xray ne supporte pas les labels en paramètre URL
- ✅ L'API Jira supporte nativement la gestion des labels
- ✅ Plus fiable et direct
- ✅ Permet d'ajouter d'autres champs facilement

## Architecture du flux

```
1. Tests exécutés sur BrowserStack
                ↓
2. Résultats uploadés à Xray
   └─ upload-xray.ps1 → Crée Test Execution dans Jira
                ↓
3. Post-traitement dans Jira
   └─ jira-post-execution.ps1 → Ajoute label au Test Execution
```

## Détails de l'implémentation

### Script `upload-xray.ps1`
- Upload simplement les résultats JUnit à Xray
- **Pas** de paramètre `labels` dans l'URL
- Retourne la clé du Test Execution (`exec_key`)

**URI** :
```
https://xray.cloud.getxray.app/api/v2/import/execution/junit?projectKey=DEMO&testPlanKey=<IssueKey>
```

### Script `jira-post-execution.ps1`
- **Nouvelle étape** : Ajoute le label au Test Execution
- Utilise l'API Jira REST pour mettre à jour le champ `labels`
- **Étapes maintenant** :
  1. ✨ **Ajouter label pour device/environnement** (NOUVEAU)
  2. Mettre à jour le titre du Test Execution
  3. Attacher le rapport HTML
  4. Attacher le rapport PDF
  5. Ajouter lien vers GitHub Actions

**Appel API** :
```powershell
$labelJson = "{`"fields`": {`"labels`": [`"$DeviceName`"]}}"
Invoke-RestMethod -Method Put -Uri "$JiraUrl/rest/api/3/issue/$ExecKey" `
  -Headers $jsonHeaders -Body $labelJson
```

## Format du label

Le `DeviceName` généré est utilisé directement comme label :
- `windows10-chromium-143`
- `windows11-edge-131`
- `macsonoma-safari-latest`
- `macbigsur-firefox-144`

## Avantages

| Aspect | Valeur |
|--------|--------|
| Fiabilité | ✅ API Jira native |
| Flexibilité | ✅ Peut ajouter plusieurs labels |
| Simplicité | ✅ Pas de paramètres URL complexes |
| Traçabilité | ✅ Logs clairs dans Jira |
| Maintenance | ✅ Facile à étendre |

## Gestion des erreurs

Si l'ajout du label échoue :
- ✅ Le script continue (non-bloquant)
- ℹ️ Un message d'avertissement est affiché
- ✅ Les autres étapes (rapports, liens) continuent

## Vérification dans Jira

Après l'exécution du workflow :

1. Allez sur le Test Execution dans Jira
2. Consultez le champ "Labels"
3. Vous verrez le device name comme label
4. Vous pouvez filtrer par ce label

## Exemple complet

```
Test Execution créée : DEMO-123-1
Device Name : windows10-chromium-143

Script jira-post-execution.ps1 ajoute label:
  API Call: PUT /rest/api/3/issue/DEMO-123-1
  Payload: {"fields": {"labels": ["windows10-chromium-143"]}}
  
Résultat : Test Execution DEMO-123-1 a le label "windows10-chromium-143"
```

## Migration depuis l'ancienne approche

L'ancienne approche tentait d'ajouter le label via Xray :
```
?labels=$DeviceName  ← N'a jamais fonctionné
```

La nouvelle approche utilise Jira directement :
```
jira-post-execution.ps1 → API Jira /rest/api/3/issue/{key}  ← Fiable
```

Aucune action manuelle requise - le changement est automatique !

## Dépannage

### Le label n'apparaît pas dans Jira

**Causes possibles** :
1. Permissions insuffisantes - L'utilisateur Jira doit pouvoir éditer les issues
2. Script arrêté avant l'étape de label - Vérifiez les logs
3. Erreur de connexion - Vérifiez les secrets GitHub

**Solution** :
- Vérifiez que le rôle Jira a les permissions "Edit" sur les issues
- Réexécutez le workflow
- Consultez les logs pour les erreurs

### Ajouter manuellement un label

Si nécessaire :
1. Ouvrez le Test Execution dans Jira
2. Cliquez sur "Labels"
3. Entrez le device name
4. Sauvegardez
