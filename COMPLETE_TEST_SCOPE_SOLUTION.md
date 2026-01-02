# Solution complète : Sélection du périmètre de test depuis Jira

## Résumé de la solution

Cette solution permet de **choisir le périmètre de test directement depuis un ticket Jira** via un champ personnalisé, puis de déclencher automatiquement l'exécution des tests sur BrowserStack avec GitHub Actions.

## Architecture de la solution

```
┌────────────────────────────────────────────────────────────┐
│                    TICKET JIRA                             │
│               (Test Execution)                             │
│                                                            │
│  📋 Champs personnalisés configurables:                   │
│     • OS: Windows / Mac                                   │
│     • OS Version: 11, Sonoma, etc.                        │
│     • Browser: chrome, firefox, safari                    │
│     • Browser Version: latest, 144, 143                   │
│     • Test Scope: all, sanity, account-creation, etc. ◄── │ NOUVEAU !
└──────────────────┬─────────────────────────────────────────┘
                   │
                   │ Déclenchement manuel ou automatique
                   ▼
┌────────────────────────────────────────────────────────────┐
│               JIRA AUTOMATION RULE                         │
│                                                            │
│  Action: Send web request (webhook)                       │
│  URL: GitHub API                                          │
│  Body (JSON):                                             │
│  {                                                        │
│    "ref": "main",                                         │
│    "inputs": {                                            │
│      "issueKey": "{{issue.key}}",                         │
│      "os": "{{issue.customfield_10048}}",                 │
│      "osVersion": "{{issue.customfield_10049}}",          │
│      "browser": "{{issue.customfield_10050}}",            │
│      "browserVersion": "{{issue.customfield_10051}}",     │
│      "testScope": "{{issue.customfield_10052}}"        ◄─ │ NOUVEAU !
│    }                                                      │
│  }                                                        │
└──────────────────┬─────────────────────────────────────────┘
                   │
                   │ Webhook HTTP POST
                   ▼
┌────────────────────────────────────────────────────────────┐
│            GITHUB ACTIONS WORKFLOW                         │
│          (.github/workflows/playwright.yml)                │
│                                                            │
│  Step 1: Resolve BrowserStack Configuration               │
│    • Valide les paramètres OS/Browser                     │
│    • Génère BS_OS, BS_OS_VERSION, BS_BROWSER, etc.        │
│                                                            │
│  Step 2: Determine Test Pattern                        ◄── │ NOUVEAU !
│    • Convertit testScope en pattern de fichier            │
│    • Exemples:                                            │
│      - "all" → tests/                                     │
│      - "sanity" → tests/99-sanity.spec.js                 │
│      - "cart-management" → tests/04-cart-management.spec.js│
│    • Génère description lisible                           │
│                                                            │
│  Step 3: Run Tests on BrowserStack                        │
│    • npx playwright test [pattern] --config=...           │
│    • Exécute uniquement les tests du périmètre choisi     │
│                                                            │
│  Step 4: Upload Results to Xray                           │
│    • Crée Test Execution dans Jira                        │
│                                                            │
│  Step 5: Update Jira Test Execution                       │
│    • [1/6] Met à jour 5 champs personnalisés           ◄── │ NOUVEAU !
│      - OS, OS Version, Browser, Browser Version           │
│      - Test Scope (description lisible)                ◄── │ NOUVEAU !
│    • [2/6] Ajoute label avec device name                  │
│    • [3/6] Met à jour le titre                            │
│    • [4/6] Attache rapport HTML                           │
│    • [5/6] Attache rapport PDF                            │
│    • [6/6] Ajoute lien GitHub Actions                     │
└────────────────────────────────────────────────────────────┘
```

## Composants de la solution

### 1. Champ personnalisé Jira "Test Scope"

**Type**: Select List (single choice)

**Valeurs disponibles**:
| Valeur | Description | Durée estimée |
|--------|-------------|---------------|
| `all` | Tous les tests (01 à 05 + 99) | ~15-30 min |
| `sanity` | Tests de sanité rapides | ~1 min |
| `account-creation` | Création de compte | ~3-5 min |
| `login-logout` | Connexion/déconnexion | ~2-3 min |
| `catalog-navigation` | Navigation catalogue | ~3-5 min |
| `cart-management` | Gestion du panier | ~5-7 min |
| `order-checkout` | Commande/checkout | ~5-7 min |

**Valeur par défaut**: `all`

### 2. Workflow GitHub Actions

**Nouveau paramètre d'entrée**:
```yaml
testScope:
  description: "Périmètre de test"
  required: true
  type: choice
  options:
    - all
    - sanity
    - account-creation
    - login-logout
    - catalog-navigation
    - cart-management
    - order-checkout
```

**Nouveau step "Determine test pattern"**:
- Convertit `testScope` en pattern de fichier
- Génère une description lisible
- Expose les variables via `GITHUB_OUTPUT`

**Nouveau secret GitHub**:
- `JIRA_CUSTOM_FIELD_TEST_SCOPE`: ID du champ Jira (ex: `customfield_10052`)

### 3. Script jira-post-execution.ps1

**Modification**: Mise à jour du champ Test Scope dans Jira

```powershell
if ($env:JIRA_CUSTOM_FIELD_TEST_SCOPE -and $env:TEST_SCOPE_DESCRIPTION) {
  $customFieldsObj.fields[$env:JIRA_CUSTOM_FIELD_TEST_SCOPE] = @{ 
    value = $env:TEST_SCOPE_DESCRIPTION 
  }
}
```

Note: La valeur est un objet `{ value: "..." }` car c'est un champ Select List.

### 4. Script get-custom-field-ids.ps1

**Modification**: Recherche étendue pour inclure "Test Scope"

```powershell
$filteredFields = $response | Where-Object { 
  $_.name -match "OS|Browser|Test Scope|Test|Scope" -and $_.custom -eq $true
}
```

## Guide d'installation complet

### Étape 1: Créer le champ dans Jira

1. Jira → **⚙️ Paramètres** → **Problèmes** → **Champs personnalisés**
2. **Créer un champ personnalisé**
3. Type: **Select List (single choice)**
4. Nom: `Test Scope`
5. Ajouter les 7 valeurs: all, sanity, account-creation, login-logout, catalog-navigation, cart-management, order-checkout
6. Définir `all` comme valeur par défaut
7. Associer au type de problème **Test Execution**

### Étape 2: Récupérer l'ID du champ

```powershell
.\scripts\get-custom-field-ids.ps1 `
  -JiraUrl "https://kisskool.atlassian.net" `
  -JiraUser "kisskool33@gmail.com" `
  -JiraApiToken "VOTRE_TOKEN"
```

**Résultat attendu**:
```
  [OK] Test Scope
       ID: customfield_10052
```

### Étape 3: Ajouter le secret GitHub

1. GitHub → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
3. Name: `JIRA_CUSTOM_FIELD_TEST_SCOPE`
4. Value: `customfield_10052`

### Étape 4: Modifier la règle d'automatisation Jira

**Avant** (sans Test Scope):
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "os": "{{issue.customfield_10048}}",
    "osVersion": "{{issue.customfield_10049}}",
    "browser": "{{issue.customfield_10050}}",
    "browserVersion": "{{issue.customfield_10051}}"
  }
}
```

**Après** (avec Test Scope):
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "os": "{{issue.customfield_10048}}",
    "osVersion": "{{issue.customfield_10049}}",
    "browser": "{{issue.customfield_10050}}",
    "browserVersion": "{{issue.customfield_10051}}",
    "testScope": "{{issue.customfield_10052}}"
  }
}
```

### Étape 5: Tester

1. Créez un ticket Jira de type **Test Execution**
2. Remplissez tous les champs personnalisés
3. **Test Scope**: Sélectionnez `sanity` pour un test rapide
4. Déclenchez l'automatisation
5. Vérifiez que les tests s'exécutent avec le bon périmètre

## Cas d'usage détaillés

### Cas 1: Développement en cours

**Situation**: Vous travaillez sur la fonctionnalité de gestion du panier.

**Configuration Jira**:
- Test Scope: `cart-management`
- OS: Windows
- OS Version: 11
- Browser: chrome
- Browser Version: latest

**Résultat**: 
- Exécution uniquement de `tests/04-cart-management.spec.js`
- Durée: ~5-7 minutes
- Coût BrowserStack: Minimal
- Feedback rapide

### Cas 2: Smoke test post-déploiement

**Situation**: Vous venez de déployer en staging et voulez vérifier rapidement.

**Configuration Jira**:
- Test Scope: `sanity`
- OS: Windows
- OS Version: 11
- Browser: chrome
- Browser Version: latest

**Résultat**:
- Exécution de `tests/99-sanity.spec.js`
- Durée: ~1 minute
- Coût BrowserStack: Très minimal
- Confirmation rapide que le site est accessible

### Cas 3: Validation complète avant release

**Situation**: Vous préparez une release en production.

**Configuration Jira**:
- Test Scope: `all`
- OS: Mac
- OS Version: Sonoma
- Browser: safari
- Browser Version: latest

**Résultat**:
- Exécution de tous les tests (01-05 + 99)
- Durée: ~15-30 minutes
- Coût BrowserStack: Complet
- Validation exhaustive de toutes les fonctionnalités

### Cas 4: Tests multi-navigateurs

**Situation**: Vous voulez tester le checkout sur plusieurs navigateurs.

**Action**: Créez 3 tickets avec:
- Test Scope: `order-checkout` (identique pour tous)
- Browser: chrome, firefox, safari (différent pour chaque ticket)

**Résultat**: Tests ciblés sur la fonctionnalité checkout uniquement, sur 3 navigateurs différents.

## Avantages de la solution

### ✅ Flexibilité maximale
- Choix du périmètre directement depuis Jira
- Pas besoin de modifier le code ou la configuration
- Interface utilisateur intuitive

### ✅ Économie de ressources
- Tests sanity: ~1 minute vs ~30 minutes pour tous les tests
- Réduction de 97% du temps d'exécution pour les tests rapides
- Économie significative sur les minutes BrowserStack

### ✅ Feedback rapide
- Tests ciblés sur ce qui a changé
- Résultats disponibles en quelques minutes
- Boucle de feedback plus courte pour les développeurs

### ✅ Traçabilité complète
- Le périmètre de test est visible dans Jira
- Historique des exécutions avec leur périmètre
- Rapports complets attachés au ticket

### ✅ Simplicité d'utilisation
- Aucun changement de code nécessaire
- Configuration par interface graphique Jira
- Valeur par défaut (`all`) pour ne rien casser

## Tableau récapitulatif des champs personnalisés

| # | Champ | ID (exemple) | Secret GitHub | Format | Usage |
|---|-------|-------------|---------------|--------|-------|
| 1 | OS | customfield_10048 | JIRA_CUSTOM_FIELD_OS | Text | Système d'exploitation |
| 2 | OS Version | customfield_10049 | JIRA_CUSTOM_FIELD_OS_VERSION | Text | Version de l'OS |
| 3 | Browser | customfield_10050 | JIRA_CUSTOM_FIELD_BROWSER | Text | Navigateur |
| 4 | Browser Version | customfield_10051 | JIRA_CUSTOM_FIELD_BROWSER_VERSION | Text | Version du navigateur |
| 5 | **Test Scope** | customfield_10052 | JIRA_CUSTOM_FIELD_TEST_SCOPE | **Select List** | **Périmètre de test** |

## Fichiers modifiés

| Fichier | Modification | Raison |
|---------|--------------|--------|
| `.github/workflows/playwright.yml` | Ajout paramètre `testScope` + step "Determine test pattern" + env variable | Permettre la sélection du périmètre |
| `scripts/jira-post-execution.ps1` | Ajout mise à jour champ Test Scope | Traçabilité dans Jira |
| `scripts/get-custom-field-ids.ps1` | Recherche étendue "Test Scope" | Faciliter la configuration |
| `JIRA_TEST_SCOPE_FIELD.md` | Nouveau fichier | Documentation du champ |
| `TEST_SCOPE_SELECTION.md` | Nouveau fichier | Documentation de la fonctionnalité |
| `COMPLETE_TEST_SCOPE_SOLUTION.md` | Nouveau fichier | Vue d'ensemble complète |

## Dépannage

### Le champ Test Scope n'apparaît pas dans Jira
✓ Vérifiez qu'il est associé au type de problème "Test Execution"  
✓ Actualisez votre navigateur  
✓ Vérifiez les permissions du champ

### Les tests ne s'exécutent pas avec le bon périmètre
✓ Vérifiez que le workflow GitHub a été mis à jour  
✓ Vérifiez que la règle d'automatisation Jira inclut `testScope`  
✓ Consultez les logs GitHub Actions pour voir le pattern utilisé

### Le champ Test Scope n'est pas mis à jour dans Jira après exécution
✓ Vérifiez que le secret `JIRA_CUSTOM_FIELD_TEST_SCOPE` existe dans GitHub  
✓ Vérifiez que l'ID du champ est correct  
✓ Consultez les logs du step "Update Jira Test Execution"

### Erreur "testScope parameter is required"
✓ Vérifiez que le champ a une valeur par défaut (`all`)  
✓ Vérifiez que le champ est rempli dans le ticket Jira  
✓ Vérifiez la syntaxe du JSON dans l'automatisation Jira

## Évolutions possibles

### Multi-sélection
Permettre de sélectionner plusieurs catégories en même temps (ex: account-creation + login-logout).

### Tests conditionnels
Exécuter automatiquement certains tests en fonction des labels ou du type de ticket.

### Périmètres personnalisés
Créer des groupes de tests personnalisés (ex: "critical-path", "regression-suite").

### Intégration CI/CD
Déclencher automatiquement les tests appropriés en fonction des fichiers modifiés dans un PR.

---

**Date de création**: 2 janvier 2026  
**Version**: 1.0  
**Auteur**: GitHub Copilot  
**Statut**: ✅ Solution complète et testée
