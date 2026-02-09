# Guide de Reporting Confluence

Ce guide décrit les deux approches de reporting Confluence disponibles pour le projet Tricentis Demo Tests :

1. **Approche 1 — Macros Xray/Jira natives** (manuelle, sans CI/CD)
2. **Approche 2 — Mise à jour automatique via CI/CD** (script Node.js avec toggle on/off)

---

## Architecture de reporting

```
┌──────────────────────────────────────────────────────────┐
│                    Confluence                             │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Approche 1 : Macros Xray/Jira (temps réel)    │    │
│  │  - Couverture de test                            │    │
│  │  - État des Test Plans                           │    │
│  │  - Tableau JQL dynamique                         │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Approche 2 : Tableau CI/CD (historique)        │    │
│  │  - Ligne ajoutée à chaque run                    │    │
│  │  - Date, résultat, OS, navigateur, liens        │    │
│  │  - Activé via toggle workflow                    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
         ▲                            ▲
         │                            │
    Données Jira/Xray          Pipeline CI/CD
    (temps réel)               (post-exécution)
```

---

## Approche 1 — Macros Xray/Jira natives dans Confluence

### Prérequis

- Confluence Cloud sur le même site Atlassian que Jira
- Xray Cloud installé (les macros Confluence sont incluses)
- Permissions d'édition sur l'espace Confluence cible

### Étapes de mise en place

#### 1. Créer la page Dashboard

1. Aller dans l'espace Confluence cible
2. Créer une page nommée **"Dashboard Qualité - Tricentis Demo Shop"**
3. Choisir un template vierge

#### 2. Ajouter la macro "Xray Test Plan Board"

Cette macro affiche l'état de couverture d'un Test Plan.

1. Taper `/xray` dans l'éditeur Confluence
2. Sélectionner **Xray Test Plan Board**
3. Configurer :
   - **Test Plan** : sélectionner le Test Plan du projet (ex: DEMO-1)
   - **Columns** : Status, Priority, Test Type
4. La macro affichera automatiquement le nombre de tests PASS/FAIL/TODO

#### 3. Ajouter la macro "Jira Issues" (tableau JQL)

Cette macro crée un tableau dynamique des dernières Test Executions.

1. Taper `/jira` dans l'éditeur
2. Sélectionner **Jira Issues**
3. Configurer le JQL :
   ```jql
   project = DEMO AND issuetype = "Test Execution" ORDER BY created DESC
   ```
4. Colonnes recommandées :
   - Summary
   - Status
   - Labels
   - Created
   - (Custom fields : OS, Browser si visibles)
5. Limiter à 20 résultats

#### 4. Ajouter un graphique de tendance (Jira Chart macro)

1. Taper `/jira` dans l'éditeur
2. Sélectionner **Jira Chart**
3. Type : **Created vs Resolved**
4. JQL :
   ```jql
   project = DEMO AND issuetype = "Test Execution" AND created >= -30d
   ```
5. Période : 30 jours, granularité : semaine

#### 5. Ajouter un filtre par résultat

Pour voir uniquement les exécutions en échec :

```jql
project = DEMO AND issuetype = "Test Execution" AND labels = "FAIL" ORDER BY created DESC
```

Pour voir la couverture par navigateur :

```jql
project = DEMO AND issuetype = "Test Execution" AND labels in ("win-11-chrome-latest", "win-11-firefox-latest", "mac-sonoma-safari-18") ORDER BY created DESC
```

### Structure de page recommandée

```
📊 Dashboard Qualité - Tricentis Demo Shop
├── Section 1 : Vue d'ensemble
│   └── Macro Xray Test Plan Board (Test Plan principal)
├── Section 2 : Dernières exécutions
│   └── Macro Jira Issues (JQL : Test Executions récentes)
├── Section 3 : Tendances
│   └── Macro Jira Chart (Created vs Resolved, 30 jours)
├── Section 4 : Tests en échec
│   └── Macro Jira Issues (JQL : labels = FAIL)
└── Section 5 : Historique CI/CD (Approche 2, automatique)
    └── Tableau mis à jour par le pipeline
```

---

## Approche 2 — Mise à jour automatique via CI/CD

### Fonctionnement

Le script `scripts/update-confluence-report.js` s'exécute à la fin du pipeline GitHub Actions et :

1. Recherche la page Confluence par titre dans l'espace configuré
2. Si la page n'existe pas, la crée avec la structure initiale
3. Ajoute une ligne au tableau historique avec les données du run
4. Limite le tableau aux 50 dernières exécutions (les plus anciennes sont supprimées)

### Activation / Désactivation (toggle)

Le reporting Confluence est **désactivé par défaut**. Pour l'activer :

#### Via l'interface GitHub Actions

Lors du déclenchement manuel du workflow :

1. Aller dans **Actions > Playwright Tests > Run workflow**
2. Remplir les paramètres habituels (OS, browser, test scope...)
3. Cocher **"Publier le rapport sur Confluence"** → `true`
4. Lancer le workflow

#### Via Jira Automation (webhook)

Ajouter le paramètre `confluenceReport` dans le payload JSON du webhook :

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-123",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest",
    "testScope": "all",
    "confluenceReport": "true"
  }
}
```

Pour désactiver, omettre le paramètre ou le mettre à `"false"`.

### Secrets GitHub requis

| Secret | Description | Exemple |
|--------|-------------|---------|
| `CONFLUENCE_URL` | URL de base Confluence | `https://domaine.atlassian.net/wiki` |
| `CONFLUENCE_USER` | Email utilisateur | `user@domain.com` |
| `CONFLUENCE_API_TOKEN` | Token API Atlassian | (même token que JIRA_API_TOKEN si même site) |
| `CONFLUENCE_SPACE_KEY` | Clé de l'espace | `QA` |
| `CONFLUENCE_PAGE_TITLE` | Titre de la page (optionnel) | `Dashboard Qualité - Tricentis Demo` |
| `CONFLUENCE_PARENT_PAGE_ID` | ID page parente (optionnel) | `123456` |

> **Note** : Si Jira et Confluence sont sur le même site Atlassian Cloud, le `CONFLUENCE_USER` et `CONFLUENCE_API_TOKEN` peuvent être les mêmes que `JIRA_USER` et `JIRA_API_TOKEN`.

### Contenu du tableau généré

Chaque ligne du tableau contient :

| Colonne | Source | Exemple |
|---------|--------|---------|
| Date | Horodatage du run | `2026-02-09 14:32` |
| Résultat | Badge coloré (PASS/FAIL) | 🟢 PASS |
| Scope | Périmètre de test | `All Tests` |
| OS | OS + version BrowserStack | `Windows 11` |
| Navigateur | Browser + version | `chrome latest` |
| Jira | Lien vers Test Execution | `DEMO-456` |
| GitHub | Lien vers GitHub Actions run | `#42` |
| BrowserStack | Lien vers le build | `Build` |

### Test local du script

```bash
# Définir les variables d'environnement
export CONFLUENCE_URL="https://domaine.atlassian.net/wiki"
export CONFLUENCE_USER="user@domain.com"
export CONFLUENCE_API_TOKEN="votre-token"
export CONFLUENCE_SPACE_KEY="QA"
export CONFLUENCE_PAGE_TITLE="Dashboard Qualité - Test"
export DEVICE_NAME="win-11-chrome-latest"
export BS_OS="Windows"
export BS_OS_VERSION="11"
export BS_BROWSER="chrome"
export BS_BROWSER_VERSION="latest"
export JIRA_URL="https://domaine.atlassian.net"

# Exécuter le script
node scripts/update-confluence-report.js \
  --exec-key "DEMO-123" \
  --test-result "PASS" \
  --test-scope "All Tests" \
  --run-number "42" \
  --run-id "123456789" \
  --repository "owner/repo"
```

---

## Combinaison des deux approches

Les deux approches sont complémentaires :

| Aspect | Approche 1 (Macros) | Approche 2 (CI/CD) |
|--------|---------------------|---------------------|
| Mise à jour | Temps réel (dynamique) | Post-exécution (push) |
| Données | Jira/Xray (tous les champs) | Résumé du run CI/CD |
| Configuration | Manuelle (éditeur Confluence) | Automatique (script) |
| Maintenance | Aucune | Aucune (script idempotent) |
| Toggle | Toujours actif | On/off via workflow |

La page Confluence combine les deux :
- **Haut de page** : macros Xray/Jira pour la vue temps réel
- **Bas de page** : tableau CI/CD pour l'historique des exécutions automatisées
