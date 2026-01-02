# Guide : Sélection du périmètre de test dans la règle d'automatisation Jira

## Vue d'ensemble

Cette solution permet de choisir le **périmètre de test** directement dans la règle d'automatisation Jira, sans créer de champ personnalisé. Le paramètre `testScope` est simplement passé à GitHub Actions comme les autres paramètres (OS, Browser, etc.).

## Architecture simplifiée

```
┌────────────────────────────────────────┐
│     RÈGLE D'AUTOMATISATION JIRA        │
│                                        │
│  Webhook vers GitHub:                 │
│  {                                    │
│    "ref": "main",                     │
│    "inputs": {                        │
│      "issueKey": "{{issue.key}}",     │
│      "os": "Windows",                 │
│      "osVersion": "11",               │
│      "browser": "chrome",             │
│      "browserVersion": "latest",      │
│      "testScope": "all"            ◄─ │ Paramètre ajouté
│    }                                  │
│  }                                    │
└──────────────┬─────────────────────────┘
               │
               ▼
┌────────────────────────────────────────┐
│       GITHUB ACTIONS WORKFLOW          │
│                                        │
│  • Reçoit le paramètre testScope      │
│  • Détermine les tests à exécuter     │
│  • Lance uniquement ces tests         │
└────────────────────────────────────────┘
```

## Valeurs disponibles pour testScope

| Valeur | Description | Fichier(s) exécuté(s) | Durée |
|--------|-------------|----------------------|-------|
| `all` | Tous les tests | `tests/*.spec.js` | ~15-30 min |
| `sanity` | Tests de sanité | `tests/99-sanity.spec.js` | ~1 min |
| `account-creation` | Création de compte | `tests/01-account-creation.spec.js` | ~3-5 min |
| `login-logout` | Connexion/déconnexion | `tests/02-login-logout.spec.js` | ~2-3 min |
| `catalog-navigation` | Navigation catalogue | `tests/03-catalog-navigation.spec.js` | ~3-5 min |
| `cart-management` | Gestion du panier | `tests/04-cart-management.spec.js` | ~5-7 min |
| `order-checkout` | Commande/checkout | `tests/05-order-checkout.spec.js` | ~5-7 min |

## Configuration de la règle d'automatisation Jira

### Option 1: Valeur fixe (plus simple)

Dans l'action **"Send web request"** de votre règle d'automatisation, modifiez le Body pour ajouter le paramètre `testScope`:

**Avant**:
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "{{issue.customfield_10048}}",
    "osVersion": "{{issue.customfield_10049}}",
    "browser": "{{issue.customfield_10050}}",
    "browserVersion": "{{issue.customfield_10051}}"
  }
}
```

**Après** (avec valeur fixe):
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "{{issue.customfield_10048}}",
    "osVersion": "{{issue.customfield_10049}}",
    "browser": "{{issue.customfield_10050}}",
    "browserVersion": "{{issue.customfield_10051}}",
    "testScope": "all"
  }
}
```

### Option 2: Valeur conditionnelle basée sur les labels

Vous pouvez utiliser une logique conditionnelle pour choisir le périmètre selon un label:

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "{{issue.customfield_10048}}",
    "osVersion": "{{issue.customfield_10049}}",
    "browser": "{{issue.customfield_10050}}",
    "browserVersion": "{{issue.customfield_10051}}",
    "testScope": "{{#if(contains(issue.labels,'quick-test'))}}sanity{{else}}all{{/if}}"
  }
}
```

**Labels utilisables**:
- `quick-test` → exécute `sanity`
- `cart-test` → exécute `cart-management`
- Pas de label → exécute `all`

### Option 3: Plusieurs règles d'automatisation

Créez plusieurs règles avec des périmètres différents:

**Règle 1**: "Tests complets" → `"testScope": "all"`
**Règle 2**: "Tests rapides" → `"testScope": "sanity"`
**Règle 3**: "Tests panier" → `"testScope": "cart-management"`

Chaque règle est déclenchée par un bouton différent ou une transition différente.

### Option 4: Valeur saisie manuellement

Si vous déclenchez la règle manuellement, vous pouvez créer un **Smart value** ou **Variable** dans Jira Automation:

1. Dans la règle, ajoutez une action **"Create variable"** avant le webhook
2. Nom de la variable: `testScope`
3. Valeur: Saisie manuelle ou menu déroulant
4. Dans le webhook, utilisez: `"testScope": "{{testScope}}"`

## Exemples de cas d'usage

### Cas 1: Tests complets par défaut

```json
{
  "testScope": "all"
}
```

✅ Tous les tests s'exécutent  
⏱️ Durée: ~15-30 minutes  
💰 Coût BrowserStack: Complet

### Cas 2: Smoke test après déploiement

Ajoutez le label `quick-test` au ticket, puis:

```json
{
  "testScope": "{{#if(contains(issue.labels,'quick-test'))}}sanity{{else}}all{{/if}}"
}
```

✅ Uniquement tests sanity si label présent  
⏱️ Durée: ~1 minute  
💰 Coût BrowserStack: Minimal

### Cas 3: Tests ciblés par composant

Ajoutez des labels par fonctionnalité:

```json
{
  "testScope": "{{#if(contains(issue.labels,'cart'))}}cart-management{{else if(contains(issue.labels,'login'))}}login-logout{{else}}all{{/if}}"
}
```

Labels:
- `cart` → Tests panier uniquement
- `login` → Tests connexion uniquement
- Aucun → Tous les tests

## Avantages de cette approche

✅ **Simplicité**: Pas de champ personnalisé à créer dans Jira  
✅ **Flexibilité**: Modifiable directement dans la règle d'automatisation  
✅ **Rapidité**: Configuration en 2 minutes  
✅ **Économie**: Tests ciblés = moins de minutes BrowserStack  
✅ **Compatibilité**: Fonctionne avec la configuration actuelle

## Inconvénient

⚠️ **Pas de traçabilité dans Jira**: Le périmètre de test n'est pas enregistré dans le ticket Jira (seulement visible dans les logs GitHub Actions).

Si vous avez besoin de traçabilité, vous pouvez créer un champ personnalisé (voir [JIRA_TEST_SCOPE_FIELD.md](JIRA_TEST_SCOPE_FIELD.md)).

## Visualisation du workflow complet

```
┌─────────────────────────────┐
│   Ticket Jira + Label       │
│   (ou valeur fixe)          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   Règle d'Automatisation    │
│   Construit le JSON avec    │
│   testScope: "sanity"       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   GitHub Actions Workflow   │
│   - Reçoit testScope        │
│   - Détermine pattern       │
│   - Exécute tests ciblés    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   Résultats dans Jira       │
│   (sans le champ testScope) │
└─────────────────────────────┘
```

## Configuration complète recommandée

### 1. Règle d'automatisation "Tests complets"

**Déclencheur**: Bouton "Run Full Tests" ou transition "Ready for Testing"

**Webhook Body**:
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "{{issue.customfield_10048}}",
    "osVersion": "{{issue.customfield_10049}}",
    "browser": "{{issue.customfield_10050}}",
    "browserVersion": "{{issue.customfield_10051}}",
    "testScope": "all"
  }
}
```

### 2. Règle d'automatisation "Tests rapides"

**Déclencheur**: Bouton "Run Quick Tests" ou label "quick-test"

**Webhook Body**:
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "{{issue.customfield_10048}}",
    "osVersion": "{{issue.customfield_10049}}",
    "browser": "{{issue.customfield_10050}}",
    "browserVersion": "{{issue.customfield_10051}}",
    "testScope": "sanity"
  }
}
```

### 3. Règle d'automatisation "Tests conditionnels"

**Déclencheur**: Label ajouté

**Condition**: Label matches "test-.*"

**Webhook Body**:
```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "{{issue.key}}",
    "summary": "{{issue.summary}}",
    "os": "{{issue.customfield_10048}}",
    "osVersion": "{{issue.customfield_10049}}",
    "browser": "{{issue.customfield_10050}}",
    "browserVersion": "{{issue.customfield_10051}}",
    "testScope": "{{#if(contains(issue.labels,'test-cart'))}}cart-management{{else if(contains(issue.labels,'test-login'))}}login-logout{{else}}all{{/if}}"
  }
}
```

## Dépannage

### Les tests ne s'exécutent pas avec le bon périmètre

✓ Vérifiez que le paramètre `testScope` est bien dans le JSON  
✓ Vérifiez l'orthographe exacte de la valeur (all, sanity, cart-management, etc.)  
✓ Consultez les logs GitHub Actions pour voir la valeur reçue

### Erreur "testScope parameter is required"

✓ Le paramètre `testScope` est obligatoire dans le workflow  
✓ Ajoutez-le au JSON avec au minimum `"testScope": "all"`

### Je veux exécuter plusieurs catégories

❌ Pas possible actuellement (seulement une catégorie ou toutes)  
✓ Solution: Lancez plusieurs workflows ou utilisez `"testScope": "all"`

## Résumé

**Configuration minimale** (1 minute):
1. Ouvrez votre règle d'automatisation Jira
2. Modifiez le Body du webhook
3. Ajoutez la ligne: `"testScope": "all"`
4. Enregistrez

**Vous êtes prêt !** 🎉

---

**Date de création**: 2 janvier 2026  
**Version**: 2.0 (solution simplifiée sans champ Jira)
