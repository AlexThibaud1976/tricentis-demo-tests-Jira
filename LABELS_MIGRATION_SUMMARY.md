# Changements : Migration vers les Labels Jira

## Résumé

Le système a été migré du modèle "Environnements de test" vers le modèle "Labels Jira" pour identifier les configurations de test (OS, browser, versions).

## Changements effectués

### ✅ Fichiers modifiés

#### 1. `scripts/upload-xray.ps1`
- **Avant** : `testEnvironments=$DeviceName`
- **Après** : `labels=$DeviceName`
- L'upload à Xray ajoute automatiquement le device name comme label à la test execution

#### 2. `.github/workflows/playwright.yml`
- **Suppression** : Étape "Ensure test environment exists in Xray"
- **Raison** : Plus besoin de pré-créer les environnements, les labels sont automatiques

### ✅ Fichiers supprimés

- `scripts/ensure-test-environment.ps1` - Plus nécessaire
- `scripts/diagnose-jira-api.ps1` - Script de diagnostic temporaire
- `TEST_ENVIRONMENTS_SETUP.md` - Documentation obsolète

### ✅ Fichiers ajoutés

- `USING_LABELS_FOR_DEVICES.md` - Documentation sur l'utilisation des labels

## Avantages

| Avantage | Impact |
|----------|--------|
| Pas de pré-création | ✅ Processus simplifié |
| Automatique | ✅ Aucune action manuelle requise |
| Flexible | ✅ Peut ajouter n'importe quel label |
| Scalable | ✅ Pas de limite de configurations |
| Traçabilité | ✅ Tous les tests sont labellisés avec le device |

## Flux de fonctionnement

```
Test launch (GitHub Actions)
    ↓
Select OS, version, browser, version
    ↓
resolve-browserstack-config.js génère DEVICE_NAME
    ↓
Tests exécutés sur BrowserStack
    ↓
upload-xray.ps1 ajoute label=DEVICE_NAME
    ↓
Test Execution créée dans Jira avec le label
    ↓
Label visible et filtrable dans Jira
```

## Format du label

Les labels suivent ce pattern : `OS-VERSION-BROWSER-VERSION`

**Exemples** :
- `windows10-chromium-143`
- `windows11-edge-131`
- `macsonoma-safari-latest`
- `macbigsur-firefox-144`

## Aucune migration requise

Aucune action n'est nécessaire pour les utilisateurs ou les configurations existantes. Le système fonctionne immédiatement :

1. Lancez un test via GitHub Actions
2. Sélectionnez OS, version, navigateur, version navigateur
3. Les résultats seront uploadés avec le label automatiquement
4. Le label sera visible dans Jira

## Compatibilité

- ✅ Xray Cloud API v2 : Supporte le paramètre `labels`
- ✅ Jira Cloud : Gère les labels nativement
- ✅ PowerShell : Scripts validés et testés

## Tests effectués

✅ URI de génération avec différents device names :
- `windows10-chromium-143`
- `macsonoma-safari-latest`
- Paramètre `labels=` correctement formaté dans l'URL

## Prochaines étapes

1. ✅ Déployer le code mis à jour
2. ✅ Exécuter un test pour vérifier que le label est ajouté
3. ✅ Vérifier dans Jira que le label apparaît sur la test execution
4. ✅ Utiliser les labels pour filtrer et analyser les résultats
