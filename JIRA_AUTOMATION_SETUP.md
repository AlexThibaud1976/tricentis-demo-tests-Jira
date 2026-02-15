# Configuration Jira Automation pour les Tests Dynamiques

## ⚠️ Mise à jour importante (Février 2026)

**Deux nouveaux paramètres obligatoires** ont été ajoutés au workflow :

1. **`testScope`** (obligatoire) - Sélectionner quel périmètre de tests exécuter
2. **`confluenceReport`** (obligatoire) - Activer/désactiver la publication sur Confluence

**📌 Action requise :** Si vous avez déjà des règles d'automatisation Jira, vous devez les mettre à jour pour inclure ces deux paramètres. Voir les exemples ci-dessous.

**Valeurs minimales à ajouter :**
```json
{
  "inputs": {
    ...vos paramètres existants...,
    "testScope": "all",
    "confluenceReport": "false"
  }
}
```

---

Ce fichier contient des exemples de configuration pour les Automation Rules Jira.

## 📌 Configuration de base

### 1. Créer une Automation Rule simple

**Nom :** "Lancer les tests sur BrowserStack - Configuration fixe"

**Déclencheur :** Transition vers un statut (ex: "Ready for Testing")

**Action :** Send web request

```json
{
  "url": "https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_GITHUB_PAT_TOKEN",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  },
  "body": {
    "ref": "main",
    "inputs": {
      "issueKey": "{{issue.key}}",
      "summary": "{{issue.summary}}",
      "os": "Windows",
      "osVersion": "11",
      "browser": "chrome",
      "browserVersion": "latest",
      "testScope": "all",
      "confluenceReport": "false"
    }
  }
}
```

**📝 Nouveaux paramètres obligatoires :**
- `testScope` : Périmètre de test (voir liste complète ci-dessous)
- `confluenceReport` : Publication sur Confluence (`true` ou `false`)

## 🎨 Configuration avancée avec Custom Fields

Si vous avez créé des champs personnalisés pour sélectionner OS, navigateur, etc., voici comment les utiliser :

### 2. Automation Rule avec paramètres dynamiques

**Nom :** "Lancer les tests avec sélection OS/Navigateur"

**Déclencheur :** Transition vers "Ready for Testing"

**Conditions :** 
- `OS Browser Test` est défini (custom field)

**Action :** Send web request

```json
{
  "url": "https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer YOUR_GITHUB_PAT_TOKEN",
    "Accept": "application/vnd.github.v3+json",
    "Content-Type": "application/json"
  },
  "body": {
    "ref": "main",
    "inputs": {
      "issueKey": "{{issue.key}}",
      "summary": "{{issue.summary}}",
      "os": "{{issue.customfield_10048}}",
      "osVersion": "{{issue.customfield_10049}}",
      "browser": "{{issue.customfield_10050}}",
      "browserVersion": "{{issue.customfield_10051}}",
      "testScope": "{{issue.customfield_10052}}",
      "confluenceReport": "{{issue.customfield_10053}}"
    }
  }
}
```

**📝 Nouveaux custom fields suggérés :**
- `customfield_10052` : Périmètre de test (Test Scope)
- `customfield_10053` : Publication Confluence (checkbox ou select)

## 🔧 Configuration des Custom Fields Jira

Pour supporter la sélection dynamique, créez ces champs personnalisés :

### Custom Field 1: "Système d'Exploitation"
- **Type :** Select List (single choice)
- **Options :**
  - Windows
  - Mac
- **Default :** Windows
- **ID de champ :** `customfield_10000` (remplacez par votre ID réel)

### Custom Field 2: "Version OS"
- **Type :** Text Field (single line)
- **Description :** Version de l'OS (ex: 11, Monterey, Sonoma)
- **Default :** 11
- **ID de champ :** `customfield_10001`

> 💡 **Note :** Ce champ est maintenant un champ texte libre. Les versions sont validées dynamiquement via l'API BrowserStack lors de l'exécution du workflow.
>
> **Exemples de valeurs valides :**
> - Windows : `7`, `8`, `8.1`, `10`, `11`
> - Mac : `Catalina`, `Big Sur`, `Monterey`, `Ventura`, `Sonoma`, `Sequoia`

### Custom Field 3: "Navigateur"
- **Type :** Select List (single choice)
- **Options :**
  - chrome
  - firefox
  - safari
  - edge
- **Default :** chrome
- **ID de champ :** `customfield_10002`

### Custom Field 4: "Version Navigateur"
- **Type :** Text Field (single line)
- **Description :** Version du navigateur (ex: latest, 131, 18)
- **Default :** latest
- **ID de champ :** `customfield_10003`

> 💡 **Note :** Ce champ est maintenant un champ texte libre. Les versions sont validées dynamiquement via l'API BrowserStack.
>
> **Valeurs recommandées :**
> - `latest` : Dernière version stable (recommandé)
> - `latest-1`, `latest-2` : Versions précédentes
> - Version spécifique : `131`, `18`, etc.

### Custom Field 5: "Périmètre de Test" (Test Scope) ⭐ NOUVEAU

- **Type :** Select List (single choice)
- **Description :** Sélectionner quel ensemble de tests exécuter
- **Default :** all
- **ID de champ :** `customfield_10004`
- **Options :**

**🎯 Tests généraux**
- `all` - Tous les tests
- `sanity` - Tests de sanity

**👤 Gestion de compte**
- `account-creation` - Création de compte
- `login-logout` - Connexion/Déconnexion
- `account-management` - Gestion de compte

**📦 Catalogue et navigation**
- `catalog-navigation` - Navigation catalogue
- `product-search` - Recherche de produits
- `product-filtering` - Filtrage de produits
- `manufacturer-filter` - Filtre fabricant
- `new-products` - Nouveaux produits

**🛍️ Produits**
- `configurable-products` - Produits configurables
- `product-comparison` - Comparaison de produits
- `product-reviews` - Avis produits
- `product-tags` - Tags produits
- `recently-viewed` - Produits récemment vus
- `email-friend` - Envoi par email

**🛒 Panier et commandes**
- `cart-management` - Gestion du panier
- `cart-updates` - Mises à jour du panier
- `order-checkout` - Processus de commande
- `order-history` - Historique des commandes
- `guest-checkout` - Commande invité

**⭐ Liste de souhaits**
- `wishlist-management` - Gestion de la wishlist

**📧 Communication**
- `newsletter-subscription` - Abonnement newsletter
- `contact-form` - Formulaire de contact

**🌐 Communauté et contenu**
- `community-poll` - Sondage communauté
- `news-blog` - Blog actualités
- `footer-links` - Liens footer

### Custom Field 6: "Publication Confluence" ⭐ NOUVEAU

- **Type :** Checkbox (ou Select List)
- **Description :** Publier le rapport de test sur Confluence
- **Default :** Non coché / false
- **ID de champ :** `customfield_10005`

**Options (si Select List) :**
- `true` - Publier sur Confluence
- `false` - Ne pas publier (défaut)

> 📊 **Note :** La publication Confluence nécessite la configuration des secrets GitHub :
> - `CONFLUENCE_URL`
> - `CONFLUENCE_USER`
> - `CONFLUENCE_API_TOKEN`
> - `CONFLUENCE_SPACE_KEY`
> 
> Voir [CONFLUENCE_REPORTING_GUIDE.md](CONFLUENCE_REPORTING_GUIDE.md) pour la configuration complète.

## 📋 Exemples de payloads pour différents scénarios

### Exemple 1: Windows 10 + Firefox latest + Tests de login

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-123",
    "summary": "Test de compatibilité Firefox",
    "os": "Windows",
    "osVersion": "10",
    "browser": "firefox",
    "browserVersion": "latest",
    "testScope": "login-logout",
    "confluenceReport": "false"
  }
}
```

### Exemple 2: Mac Sonoma + Safari 18 + Tests checkout avec Confluence

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-456",
    "summary": "Test Mac Safari checkout",
    "os": "Mac",
    "osVersion": "Sonoma",
    "browser": "safari",
    "browserVersion": "18",
    "testScope": "order-checkout",
    "confluenceReport": "true"
  }
}
```

### Exemple 3: Windows 11 + Chrome 120 + Tous les tests + Confluence

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-789",
    "summary": "Régression complète Chrome",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "120",
    "testScope": "all",
    "confluenceReport": "true"
  }
}
```

### Exemple 4: Tests de sanity rapides sans Confluence

```json
{
  "ref": "main",
  "inputs": {
    "issueKey": "DEMO-999",
    "summary": "Smoke tests rapides",
    "os": "Windows",
    "osVersion": "11",
    "browser": "chrome",
    "browserVersion": "latest",
    "testScope": "sanity",
    "confluenceReport": "false"
  }
}
```

---

## 📊 Configuration de la publication Confluence

### Prérequis

Avant d'activer `confluenceReport: true` dans vos règles d'automatisation, assurez-vous que les **secrets GitHub sont configurés** :

| Secret GitHub | Description | Exemple |
|---------------|-------------|---------|
| `CONFLUENCE_URL` | URL Confluence (avec `/wiki`) | `https://domain.atlassian.net/wiki` |
| `CONFLUENCE_USER` | Email utilisateur Atlassian | `votre.email@domaine.com` |
| `CONFLUENCE_API_TOKEN` | Token API Atlassian | `ATATT3x...` |
| `CONFLUENCE_SPACE_KEY` | Clé de l'espace Confluence | `QA` |
| `CONFLUENCE_PAGE_TITLE` | Titre de la page (optionnel) | `Dashboard Qualité - Tricentis Demo` |

**Voir :** [CONFLUENCE_REPORTING_GUIDE.md](CONFLUENCE_REPORTING_GUIDE.md) pour la configuration détaillée.

### Utilisation avec Custom Fields Jira

#### Option 1: Checkbox Jira (Recommandé)

Créez un custom field de type **Checkbox** :

```
Nom: "Publier sur Confluence"
Type: Checkbox
ID: customfield_10005
```

Dans l'automation rule, utilisez :

```json
{
  "inputs": {
    ...
    "confluenceReport": "{{#if(equals(issue.customfield_10005, 'true'))}}true{{else}}false{{/if}}"
  }
}
```

#### Option 2: Select List

Créez un custom field de type **Select List** :

```
Nom: "Publication Confluence"
Type: Select List (single choice)
Options:
  - Oui (valeur: true)
  - Non (valeur: false)
Default: Non
ID: customfield_10005
```

Dans l'automation rule :

```json
{
  "inputs": {
    ...
    "confluenceReport": "{{issue.customfield_10005}}"
  }
}
```

#### Option 3: Valeur fixe par règle

Créez différentes règles d'automatisation :

**Règle 1:** "Tests avec publication Confluence"
```json
{
  "inputs": {
    ...
    "confluenceReport": "true"
  }
}
```

**Règle 2:** "Tests sans publication"
```json
{
  "inputs": {
    ...
    "confluenceReport": "false"
  }
}
```

### Qu'est-ce qui est publié sur Confluence ?

Quand `confluenceReport: true`, le workflow ajoute automatiquement :

1. **Une ligne dans le tableau historique** avec :
   - Date et heure d'exécution
   - Résultat (PASS/FAIL)
   - Périmètre de test
   - OS et navigateur
   - Lien vers la Test Execution Jira
   - Lien vers le workflow GitHub Actions
   - Lien vers le build BrowserStack

2. **Badges de statut** colorés (vert/rouge)

3. **Historique des 50 dernières exécutions**

### Désactiver temporairement

Pour désactiver la publication Confluence lors d'un test manuel :

1. Dans **GitHub Actions** → **Run workflow**
2. Décochez **"Publier le rapport sur Confluence"**
3. OU dans Jira : décochez le custom field avant de transitionner

---

## 🔑 Comment obtenir votre GitHub PAT Token

1. Allez sur **GitHub** → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Cliquez sur **Generate new token**
3. Donnez un nom au token (ex: "Jira Automation Dispatch")
4. Sélectionnez les scopes:
   - ✅ `repo` (Accès complet au repo)
   - ✅ `workflow` (Gestion des workflows)
5. Cliquez sur **Generate token**
6. Copiez le token et stockez-le de manière sécurisée

⚠️ **Important :** Ne partagez jamais ce token publiquement !

## 🔐 Sécurité

### Stocker le token de manière sécurisée

**Option 1 : Utiliser GitHub Secrets (recommandé)**
- Les workflows peuvent utiliser `${{ secrets.GITHUB_TOKEN }}` automatiquement
- Créez une variable d'environnement dans Jira qui référence ce secret

**Option 2 : Custom Field Jira (moins sécurisé)**
- Stockez le token dans un custom field de type "Password"
- Utilisez `{{issue.customfield_XXXXX}}` pour l'accéder

**Option 3 : Environnement d'exécution Jira**
- Utilisez les variables de secret de Jira si disponibles

### Vérifier les permissions

Assurez-vous que votre GitHub token a les bonnes permissions :
```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user
```

## 🧪 Tester votre configuration

Pour tester sans créer une issue Jira :

1. Allez sur GitHub → **Actions** → **Playwright Tests**
2. Cliquez sur **Run workflow**
3. Remplissez manuellement les paramètres :
   - **Jira Test Plan Key** : Clé de votre Test Plan
   - **OS** : Windows ou Mac
   - **OS Version** : 11, Sonoma, etc.
   - **Browser** : chrome, firefox, safari, edge
   - **Browser Version** : latest, 131, etc.
   - **Test Scope** : Sélectionnez le périmètre (ex: login-logout)
   - **Confluence Report** : Cochez si vous voulez tester la publication
4. Cliquez sur **Run workflow**
5. Observez les résultats dans les logs
6. Si Confluence activé, vérifiez la page Confluence

### Test rapide de la publication Confluence

Pour vérifier que Confluence fonctionne :

```bash
# Test avec publication Confluence
testScope: footer-links
confluenceReport: true
```

Vérifiez ensuite votre page Confluence pour voir la nouvelle ligne ajoutée.

## 📊 Dépannage des Automation Rules

### Les tests ne se lancent pas

1. **Vérifiez le token GitHub :**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows
   ```

2. **Vérifiez les logs Jira Automation :**
   - Allez dans **Automation** → votre règle → **Audit logs**

3. **Testez manuellement la requête :**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Accept: application/vnd.github.v3+json" \
     -H "Content-Type: application/json" \
     -d '{
       "ref": "main",
       "inputs": {
         "issueKey": "TEST-1",
         "summary": "Test",
         "os": "Windows",
         "osVersion": "11",
         "browser": "chrome",
         "browserVersion": "latest",
         "testScope": "sanity",
         "confluenceReport": "false"
       }
     }' \
     https://api.github.com/repos/AlexThibaud1976/tricentis-demo-tests-Jira/actions/workflows/playwright.yml/dispatches
   ```

### Erreur "Required input not provided: testScope"

- **Cause :** Le paramètre `testScope` est obligatoire depuis la mise à jour
- **Solution :** Ajoutez `"testScope": "all"` (ou autre valeur) dans le body de votre requête
- **Valeurs valides :** Voir la liste complète dans Custom Field 5 ci-dessus

### La publication Confluence ne fonctionne pas

1. **Vérifiez les secrets GitHub :**
   - Allez dans **Settings** → **Secrets and variables** → **Actions**
   - Vérifiez que tous les secrets Confluence sont configurés

2. **Vérifiez l'URL Confluence :**
   - Doit se terminer par `/wiki` : `https://domain.atlassian.net/wiki`
   - PAS : `https://domain.atlassian.net`

3. **Consultez les logs du step "Update Confluence Report"**

4. **Voir le guide de dépannage :**
   - [CONFLUENCE_TROUBLESHOOTING.md](CONFLUENCE_TROUBLESHOOTING.md)

### Erreur 404 Confluence

- Voir [CONFLUENCE_TROUBLESHOOTING.md](CONFLUENCE_TROUBLESHOOTING.md)
- Cause probable : URL incorrecte (manque `/wiki`)

### Les tests ne correspondent pas au testScope

- **Vérifiez** : Le mapping dans le workflow (`.github/workflows/playwright.yml`)
- **Exemple** : `testScope: "login-logout"` exécute `tests/02-login-logout.spec.js`

### Erreur 404

- Vérifiez que le nom du repository est correct
- Vérifiez que le fichier workflow existe bien (`.github/workflows/playwright.yml`)

### Erreur 401 Unauthorized

- Vérifiez que le token est valide
- Vérifiez que le token n'a pas expiré
- Vérifiez que le token a les bonnes permissions

## 📚 Ressources

### Documentation de ce projet

- [CONFLUENCE_REPORTING_GUIDE.md](CONFLUENCE_REPORTING_GUIDE.md) - Guide complet de configuration Confluence
- [CONFLUENCE_TROUBLESHOOTING.md](CONFLUENCE_TROUBLESHOOTING.md) - Dépannage Confluence (erreurs 404)
- [DYNAMIC_EXECUTION_GUIDE.md](DYNAMIC_EXECUTION_GUIDE.md) - Guide d'exécution dynamique des tests
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Index complet de la documentation

### Documentation externe

- [GitHub Automation Actions](https://docs.github.com/en/actions)
- [Jira Automation Webhook Integration](https://confluence.atlassian.com/jira/automation-rules-1004476436.html)
- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/rest/v3/)
- [Confluence REST API](https://developer.atlassian.com/cloud/confluence/rest/v1/intro/)

---

## 🎯 Résumé des paramètres

| Paramètre | Type | Obligatoire | Valeurs | Description |
|-----------|------|-------------|---------|-------------|
| `issueKey` | string | ✅ | Ex: DEMO-123 | Clé Jira du Test Plan |
| `summary` | string | ❌ | Texte libre | Résumé de l'issue Jira |
| `os` | choice | ✅ | Windows, Mac | Système d'exploitation |
| `osVersion` | string | ✅ | Ex: 11, Sonoma | Version de l'OS |
| `browser` | choice | ✅ | chrome, firefox, safari, edge | Navigateur |
| `browserVersion` | string | ✅ | Ex: latest, 131 | Version du navigateur |
| `testScope` | choice | ✅ | Voir liste Custom Field 5 | Périmètre de test |
| `confluenceReport` | boolean | ✅ | true, false | Publication Confluence |

**Valeur par défaut recommandée pour `confluenceReport` :** `false`  
**Activer uniquement** pour les exécutions importantes à documenter.

---

## ✅ Checklist de configuration

### Configuration initiale

- [ ] GitHub PAT token créé avec scopes `repo` et `workflow`
- [ ] Token stocké de manière sécurisée (secret Jira ou variable)
- [ ] Automation Rule Jira créée avec le bon payload
- [ ] Mapping des custom fields correct (si utilisé)
- [ ] Test manuel via GitHub Actions réussi

### Configuration Confluence (optionnelle)

- [ ] Secrets GitHub Confluence configurés
  - [ ] `CONFLUENCE_URL` (avec `/wiki`)
  - [ ] `CONFLUENCE_USER`
  - [ ] `CONFLUENCE_API_TOKEN`
  - [ ] `CONFLUENCE_SPACE_KEY`
- [ ] Page Confluence créée ou identifiée
- [ ] Test de publication réussi
- [ ] Custom field "Publication Confluence" créé (si désiré)

### Nouveaux custom fields (recommandés)

- [ ] Custom field "Périmètre de Test" créé
- [ ] Custom field "Publication Confluence" créé
- [ ] IDs des custom fields notés et utilisés dans l'automation
- [ ] Valeurs par défaut configurées

---

**📌 Important :** Avec les nouveaux paramètres `testScope` et `confluenceReport`, assurez-vous que toutes vos règles d'automatisation Jira existantes sont mises à jour pour inclure ces deux paramètres obligatoires.
