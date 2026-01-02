# Guide : Champ personnalisé "Test Scope" dans Jira

## Vue d'ensemble

Ce guide vous aide à créer un **cinquième champ personnalisé** dans Jira pour sélectionner le périmètre de test directement depuis Jira.

## Étape 1 : Créer le champ personnalisé dans Jira

### Accès aux paramètres
1. Connectez-vous à Jira Cloud
2. Cliquez sur l'icône **⚙️ Paramètres** (en haut à droite)
3. Sélectionnez **Problèmes** dans le menu

### Création du champ
4. Dans le menu de gauche, cliquez sur **Champs personnalisés**
5. Cliquez sur **Créer un champ personnalisé**
6. Sélectionnez le type de champ :
   - **Type** : **Select List (single choice)** ou **Liste déroulante (choix unique)**
   - Cliquez sur **Suivant**

### Configuration du champ
7. **Nom du champ** : `Test Scope`
8. **Description** : `Périmètre de test à exécuter (all, sanity, ou catégorie spécifique)`
9. Cliquez sur **Créer**

### Ajout des options
10. Dans la fenêtre qui s'ouvre, ajoutez les **7 valeurs** suivantes (dans cet ordre) :
    
    | Valeur | Description |
    |--------|-------------|
    | `all` | Tous les tests |
    | `sanity` | Tests de sanité rapides |
    | `account-creation` | Tests de création de compte |
    | `login-logout` | Tests de connexion/déconnexion |
    | `catalog-navigation` | Tests de navigation catalogue |
    | `cart-management` | Tests de gestion du panier |
    | `order-checkout` | Tests de commande/checkout |

11. Pour chaque valeur :
    - Tapez la valeur dans le champ
    - Cliquez sur **Ajouter**

12. **Important** : Définissez `all` comme **valeur par défaut**
    - Cliquez sur l'icône ⭐ à côté de `all`

### Association au type de problème
13. Cliquez sur **Associer aux écrans**
14. Cochez **Test Execution** (type de problème Xray)
15. Cliquez sur **Mettre à jour**

## Étape 2 : Récupérer l'ID du champ

Exécutez le script PowerShell pour obtenir l'ID du nouveau champ :

```powershell
.\scripts\get-custom-field-ids.ps1 `
  -JiraUrl "https://kisskool.atlassian.net" `
  -JiraUser "kisskool33@gmail.com" `
  -JiraApiToken "VOTRE_TOKEN"
```

**Résultat attendu** :
```
  [OK] Test Scope
       ID: customfield_10052
```

📝 **Notez cet ID**, vous en aurez besoin pour l'automatisation !

## Étape 3 : Ajouter le secret GitHub

1. Allez sur votre repo GitHub : `AlexThibaud1976/tricentis-demo-tests-Jira`
2. Cliquez sur **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **New repository secret**
4. Ajoutez le secret :
   - **Name** : `JIRA_CUSTOM_FIELD_TEST_SCOPE`
   - **Value** : `customfield_10052` (ou l'ID trouvé à l'étape 2)
5. Cliquez sur **Add secret**

## Étape 4 : Modifier la règle d'automatisation Jira

### Configuration actuelle (sans Test Scope)
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

### Nouvelle configuration (avec Test Scope)
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
    "testScope": "{{issue.customfield_10052}}"
  }
}
```

⚠️ **Remplacez `customfield_10052` par votre ID réel**

### Modification dans Jira Automation

1. Allez dans **Paramètres** → **Système** → **Règles d'automatisation**
2. Trouvez votre règle de déclenchement de tests
3. Ouvrez l'action **"Send web request"** ou **"Webhook"**
4. Dans le champ **Body** (Corps), ajoutez la ligne `testScope` comme ci-dessus
5. **Enregistrez** la règle

## Étape 5 : Utilisation

### Création d'un Test Execution depuis Jira

1. Créez un nouveau ticket de type **Test Execution**
2. Remplissez les champs :
   - **OS** : Windows ou Mac
   - **OS Version** : 11, Sonoma, etc.
   - **Browser** : chrome, firefox, etc.
   - **Browser Version** : latest, 144, etc.
   - **Test Scope** : 👉 **Sélectionnez le périmètre** (all, sanity, account-creation, etc.)
3. Déclenchez l'automatisation (selon votre configuration)
4. Les tests s'exécutent avec le périmètre sélectionné

## Exemples de scénarios

### Scénario 1 : Tests rapides de smoke
```
Test Scope: sanity
```
⏱️ Durée : ~1 minute  
💰 Coût BrowserStack : Minimal

### Scénario 2 : Tests ciblés après modification du panier
```
Test Scope: cart-management
```
⏱️ Durée : ~5 minutes  
💰 Coût BrowserStack : Moyen

### Scénario 3 : Suite complète avant release
```
Test Scope: all
```
⏱️ Durée : ~15-30 minutes  
💰 Coût BrowserStack : Complet

## Avantages de cette approche

✅ **Flexibilité maximale** : Choisissez le périmètre depuis Jira  
✅ **Pas de valeur en dur** : Tout est paramétrable  
✅ **Traçabilité** : Le périmètre est visible dans le ticket Jira  
✅ **Valeur par défaut** : "all" sélectionné automatiquement  
✅ **Interface utilisateur** : Pas besoin de modifier le JSON manuellement  
✅ **Économie** : Exécutez uniquement ce dont vous avez besoin

## Dépannage

### Le champ Test Scope n'apparaît pas dans le ticket
- Vérifiez que le champ est associé au type de problème "Test Execution"
- Rafraîchissez votre navigateur
- Vérifiez les permissions du champ

### L'automatisation ne prend pas en compte le Test Scope
- Vérifiez que l'ID du champ est correct dans le JSON
- Vérifiez que la règle d'automatisation a été enregistrée
- Testez avec un nouveau ticket

### Erreur "testScope parameter is required"
- Vérifiez que le champ Test Scope a une valeur par défaut ("all")
- Vérifiez que le champ est rempli dans le ticket Jira
- Vérifiez le JSON de l'automatisation

## Récapitulatif de tous les champs personnalisés

| Champ | ID (exemple) | Secret GitHub | Utilisation |
|-------|-------------|---------------|-------------|
| OS | customfield_10048 | JIRA_CUSTOM_FIELD_OS | Système d'exploitation |
| OS Version | customfield_10049 | JIRA_CUSTOM_FIELD_OS_VERSION | Version de l'OS |
| Browser | customfield_10050 | JIRA_CUSTOM_FIELD_BROWSER | Navigateur |
| Browser Version | customfield_10051 | JIRA_CUSTOM_FIELD_BROWSER_VERSION | Version du navigateur |
| **Test Scope** | customfield_10052 | JIRA_CUSTOM_FIELD_TEST_SCOPE | **Périmètre de test** |

## Visualisation du workflow complet

```
┌─────────────────────────────────────┐
│   Ticket Jira Test Execution        │
│   - OS: Windows                     │
│   - OS Version: 11                  │
│   - Browser: chrome                 │
│   - Browser Version: latest         │
│   - Test Scope: cart-management  ◄──┤ NOUVEAU !
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Jira Automation Rule              │
│   Envoie webhook à GitHub           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   GitHub Actions Workflow           │
│   - Résout la config BrowserStack   │
│   - Détermine le pattern de test ◄──┤ NOUVEAU !
│   - Exécute tests ciblés            │
│   - Upload résultats vers Xray      │
│   - Met à jour 5 champs Jira     ◄──┤ NOUVEAU !
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Test Execution mis à jour         │
│   - Titre avec device info          │
│   - Rapports HTML et PDF attachés   │
│   - Lien vers GitHub Actions        │
│   - Labels ajoutés                  │
│   - 5 champs mis à jour          ◄──┤ NOUVEAU !
└─────────────────────────────────────┘
```

---

**Dernière mise à jour** : 2 janvier 2026  
**Version** : 1.0
