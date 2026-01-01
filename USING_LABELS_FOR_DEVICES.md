# Solution : Utiliser les Labels Jira pour identifier les environnements de test

## Vue d'ensemble

Au lieu de créer des environnements de test dans Jira, nous utilisons le système de **labels** de Jira. Cela offre plusieurs avantages :

- ✅ Pas besoin de pré-créer des environnements
- ✅ Plus flexible - vous pouvez ajouter n'importe quel label
- ✅ Les labels sont automatiquement associés aux exécutions de test
- ✅ Facile à filtrer et rechercher dans Jira

## Fonctionnement

### 1. Génération du nom du device

Quand vous lancez un test via GitHub Actions, le script `resolve-browserstack-config.js` génère automatiquement un `DEVICE_NAME` qui inclut :
- Le système d'exploitation
- La version du système d'exploitation
- Le navigateur
- La version du navigateur

**Exemple** : `windows10-chromium-143`

### 2. Ajout comme label à la Test Execution

Le script `upload-xray.ps1` ajoute automatiquement le `DEVICE_NAME` comme **label** à la test execution :

```powershell
$importUri = "https://$XrayEndpoint/api/v2/import/execution/junit?projectKey=DEMO&testPlanKey=$IssueKey&labels=$DeviceName"
```

Le paramètre `labels=$DeviceName` ajoute le label automatiquement lors de l'upload des résultats.

### 3. Visualization dans Jira

Une fois uploadée, la test execution aura le label dans Jira :
- Allez sur Test Plan (la clé d'issue que vous avez passée)
- Ouvrez la Test Execution
- Vous verrez le label dans le champ "Labels"

## Exemples de labels générés

Les labels générés suivent ce pattern : `OS + VERSION + BROWSER + VERSION`

```
windows7-chrome-144
windows10-chromium-143
windows11-edge-131
macbigsur-firefox-144
macsonoma-safari-latest
macsoquoia-webkit-18
```

## Avantages par rapport aux Environnements

| Aspect | Labels | Environnements |
|--------|--------|-----------------|
| Pré-création requise | ❌ Non | ✅ Oui |
| Flexibilité | ✅ Très flexible | ⚠️ Limité aux environnements créés |
| Ajout automatique | ✅ Automatique | ❌ Manuel |
| Filtrage | ✅ Facile | ⚠️ Plus complexe |
| Scalabilité | ✅ Excellente | ⚠️ Beaucoup de pré-configuration |

## Utilisation pratique

### Filtrer les tests par device dans Jira

1. Allez sur votre Test Plan
2. Cliquez sur "Labels"
3. Sélectionnez le label du device que vous voulez (ex: `windows10-chromium-143`)
4. Vous verrez uniquement les exécutions pour ce device

### Voir l'historique des tests

Avec les labels, vous pouvez facilement :
- Comparer les résultats entre différents devices
- Voir quels devices ont des problèmes
- Identifier les regressions par configuration

### Rapports et analyses

Les labels dans Jira permettent :
- De créer des dashboards filtrés par device
- D'analyser les tendances par configuration
- De générer des rapports détaillés par device

## Flux complet

```
1. Utilisateur lance test via GitHub Actions
                    ↓
2. Sélectionne OS, version, navigateur, version navigateur
                    ↓
3. resolve-browserstack-config.js génère DEVICE_NAME
                    ↓
4. Tests exécutés sur BrowserStack
                    ↓
5. Résultats uploadés à Xray avec label DEVICE_NAME
                    ↓
6. Test Execution visible dans Jira avec le label
                    ↓
7. Utilisateur peut filtrer/analyser par device
```

## Configuration

Aucune configuration n'est nécessaire ! Le système fonctionne automatiquement :

- Le script de résolution génère le `DEVICE_NAME`
- Le script d'upload ajoute le label
- Jira gère les labels automatiquement

## Absence de label

Si pour une raison quelconque le label n'apparaît pas, vous pouvez l'ajouter manuellement :

1. Ouvrez la Test Execution dans Jira
2. Cliquez sur "Labels"
3. Entrez le device name (ex: `windows10-chromium-143`)
4. Sauvegardez

Les labels persisteront pour les analyses futures.
