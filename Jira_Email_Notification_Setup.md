# Configuration de la règle Jira Automation - Notification Email

## Vue d'ensemble

Cette règle envoie automatiquement un email de notification lorsqu'une Test Execution est mise à jour avec un label PASS ou FAIL.

---

## Configuration pas à pas

### Étape 1 : Créer la règle

1. Allez dans **Jira** → **Paramètres du projet** → **Automatisation**
2. Cliquez sur **Créer une règle**
3. Nommez la règle : `Notification Email - Test Execution Results`

---

### Étape 2 : Configurer le déclencheur

**Déclencheur** : `Issue updated` (Problème mis à jour)

---

### Étape 3 : Ajouter la condition de type

**+ Add component** → **Condition** → `Issue fields condition`

Configuration :
- **Champ** : `Issue Type` (Type de problème)
- **Condition** : `equals`
- **Valeur** : `Test Execution`

---

### Étape 4 : Ajouter la condition de labels

**+ Add component** → **Condition** → `Issue fields condition`

Configuration :
- **Champ** : `Labels` (Étiquettes)
- **Condition** : `contains any of`
- **Valeur** : `PASS, FAIL`

---

### Étape 5 : Ajouter les branches conditionnelles

**+ Add component** → **Branch rule / Add related branches**

---

### Branche 1 : Tests PASS ✅

#### Condition de branche

**+ Add condition** → `Issue fields condition`

Configuration :
- **Champ** : `Labels`
- **Condition** : `contains`
- **Valeur** : `PASS`

#### Action : Send email

**+ Add action** → `Send email`

**To (Destinataires):**
```
votre-email@example.com
```

**Subject (Objet):**
```
[{{issue.key}}] ✅ PASSED - {{issue.summary}}
```

**Body (Corps - HTML):**
```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
  
  <!-- Header vert pour PASS -->
  <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 600;">✅ Tests PASSED</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Tous les tests ont réussi</p>
  </div>
  
  <!-- Contenu -->
  <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px; background-color: #ffffff;">
    
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; width: 140px; color: #6b7280; font-size: 14px;">
          <strong>Test Execution</strong>
        </td>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6;">
          <a href="{{issue.url}}" style="color: #0052CC; font-weight: 600; text-decoration: none; font-size: 15px;">{{issue.key}}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">
          <strong>Titre</strong>
        </td>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px;">
          {{issue.summary}}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">
          <strong>Résultat</strong>
        </td>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6;">
          <span style="background-color: #dcfce7; color: #166534; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">
            ✅ PASS
          </span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">
          <strong>Configuration</strong>
        </td>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px;">
          {{issue.labels}}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 12px; color: #6b7280; font-size: 14px;">
          <strong>Date</strong>
        </td>
        <td style="padding: 14px 12px; font-size: 14px;">
          {{issue.updated.jiraDate}}
        </td>
      </tr>
    </table>
    
    <!-- Bouton -->
    <div style="text-align: center; margin-top: 28px;">
      <a href="{{issue.url}}" style="display: inline-block; background: linear-gradient(135deg, #0052CC 0%, #0747A6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(0,82,204,0.3);">
        Voir la Test Execution
      </a>
    </div>
    
  </div>
  
  <!-- Footer -->
  <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 20px;">
    Email envoyé automatiquement par Jira Automation • {{now.jiraDate}}
  </p>
  
</div>
```

---

### Branche 2 : Tests FAIL ❌

#### Condition de branche

**+ Add condition** → `Issue fields condition`

Configuration :
- **Champ** : `Labels`
- **Condition** : `contains`
- **Valeur** : `FAIL`

#### Action : Send email

> 💡 **Note** : Le template HTML utilise une requête JQL `lookupIssues` pour récupérer automatiquement la liste des tests en échec. Aucune sous-branche n'est nécessaire !

**+ Add action** → `Send email`

**To (Destinataires):**
```
votre-email@example.com
```

**Subject (Objet):**
```
[{{issue.key}}] ❌ FAILED - {{issue.summary}}
```

**Body (Corps - HTML):**
```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
  
  <!-- Header rouge pour FAIL -->
  <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="margin: 0; font-size: 28px; font-weight: 600;">❌ Tests FAILED</h1>
    <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">Des tests ont échoué - Action requise</p>
  </div>
  
  <!-- Contenu -->
  <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 12px 12px; background-color: #ffffff;">
    
    <!-- Alerte -->
    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
      <p style="margin: 0; color: #991b1b; font-size: 14px;">
        ⚠️ <strong>Attention :</strong> Veuillez analyser les résultats et corriger les problèmes détectés.
      </p>
    </div>
    
    <!-- Liste des tests en échec (approche lookupIssues avec JQL) -->
    {{#lookupIssues}}issue in linkedIssuesOf("{{issue.key}}") and type = Test and status in (FAIL, Failed, Error){{/}}
    <div style="background-color: #fef9f5; border: 1px solid #fed7aa; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
      <h3 style="margin: 0 0 12px 0; color: #9a3412; font-size: 16px;">❌ Tests en échec ({{lookupIssues.size}})</h3>
      
      {{#if(lookupIssues.size)}}
      <table style="width: 100%; border-collapse: collapse;">
        {{#lookupIssues}}
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #fed7aa; width: 120px;">
            <a href="{{url}}" style="color: #c2410c; font-weight: 600; text-decoration: none; font-size: 14px;">
              {{key}}
            </a>
          </td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #fed7aa; color: #7c2d12; font-size: 14px;">
            {{summary}}
          </td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #fed7aa; width: 90px; text-align: center;">
            <span style="background-color: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">
              {{status.name}}
            </span>
          </td>
        </tr>
        {{/}}
      </table>
      {{else}}
      <p style="margin: 8px 0; color: #7c2d12; font-size: 14px; font-style: italic;">
        ℹ️ Impossible de récupérer la liste des tests. Consultez la Test Execution pour plus de détails.
      </p>
      {{/}}
      
    </div>
    
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; width: 140px; color: #6b7280; font-size: 14px;">
          <strong>Test Execution</strong>
        </td>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6;">
          <a href="{{issue.url}}" style="color: #0052CC; font-weight: 600; text-decoration: none; font-size: 15px;">{{issue.key}}</a>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">
          <strong>Titre</strong>
        </td>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px;">
          {{issue.summary}}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">
          <strong>Résultat</strong>
        </td>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6;">
          <span style="background-color: #fee2e2; color: #991b1b; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600;">
            ❌ FAIL
          </span>
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px;">
          <strong>Configuration</strong>
        </td>
        <td style="padding: 14px 12px; border-bottom: 1px solid #f3f4f6; font-size: 14px;">
          {{issue.labels}}
        </td>
      </tr>
      <tr>
        <td style="padding: 14px 12px; color: #6b7280; font-size: 14px;">
          <strong>Date</strong>
        </td>
        <td style="padding: 14px 12px; font-size: 14px;">
          {{issue.updated.jiraDate}}
        </td>
      </tr>
    </table>
    
    <!-- Bouton -->
    <div style="text-align: center; margin-top: 28px;">
      <a href="{{issue.url}}" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(239,68,68,0.3);">
        Analyser les résultats
      </a>
    </div>
    
  </div>
  
  <!-- Footer -->
  <p style="color: #9ca3af; font-size: 11px; text-align: center; margin-top: 20px;">
    Email envoyé automatiquement par Jira Automation • {{now.jiraDate}}
  </p>
  
</div>
```

---

## Structure finale de la règle

```
📋 Règle : Notification Email - Test Execution Results
│
├─ 🎯 Déclencheur : Issue updated
│
├─ ✅ Condition 1 : Issue Type = Test Execution
│
├─ ✅ Condition 2 : Labels contains any of [PASS, FAIL]
│
└─ 🔀 Branches :
   │
   ├─ Branche 1 : Labels contains "PASS"
   │  └─ Action : Send email
   │     ├─ Subject: [{{issue.key}}] ✅ PASSED - {{issue.summary}}
   │     └─ Body: Template vert
   │
   └─ Branche 2 : Labels contains "FAIL"
      └─ Action : Send email
         ├─ Subject: [{{issue.key}}] ❌ FAILED - {{issue.summary}}
         └─ Body: Template rouge + lookupIssues JQL pour lister les tests KO
```

> 💡 **Fonctionnalité clé** : La requête `lookupIssues` dans le template HTML recherche automatiquement tous les tests liés avec statut FAIL/Failed/Error et les affiche dans un tableau.

---

## Options avancées

### Envoyer à plusieurs destinataires

```
email1@example.com, email2@example.com, email3@example.com
```

### Envoyer au créateur du Test Plan

```
{{issue.reporter.emailAddress}}
```

### Envoyer à un groupe Jira

Utilisez la smart value :
```
{{lookupIssues.issue.assignee.emailAddress}}
```

---

## Test de la règle

1. Cliquez sur **Save** pour enregistrer la règle
2. Activez la règle avec le toggle
3. Cliquez sur **Run rule** → **Test**
4. Sélectionnez une Test Execution existante avec un label PASS ou FAIL
5. Vérifiez que l'email est bien reçu

### Test spécifique : Vérifier la liste des tests KO

Pour tester la fonctionnalité de listage des tests en échec :

1. **Créez une Test Execution** (ou utilisez-en une existante)
2. **Liez plusieurs Tests** à cette Test Execution avec différents statuts :
   - Au moins 2-3 tests avec statut `FAIL`, `Failed` ou `Error`
   - Quelques tests avec statut `PASS` (pour vérifier le filtrage)
3. **Ajoutez le label `FAIL`** à la Test Execution
4. L'email devrait montrer :
   - ✅ Le bandeau rouge avec alerte
   - ✅ Un tableau listant uniquement les tests KO (pas les PASS)
   - ✅ Pour chaque test : clé (lien cliquable), nom, statut
   - ✅ Le nombre total de tests en échec dans le titre : "❌ Tests en échec (3)"

### Exemple de résultat attendu dans l'email

```
┌─────────────────────────────────────────────────────┐
│ ❌ Tests en échec (3)                               │
├──────────┬──────────────────────────────┬──────────┤
│ TEST-123 │ Login avec email invalide     │ FAIL    │
│ TEST-124 │ Checkout sans produit         │ Failed  │
│ TEST-125 │ Paiement carte expirée        │ Error   │
└──────────┴──────────────────────────────┴──────────┘
```

---

## Dépannage

### L'email n'est pas envoyé

1. Vérifiez que la règle est **activée**
2. Vérifiez les **Audit logs** de la règle pour voir les erreurs
3. Assurez-vous que les labels `PASS` ou `FAIL` sont bien présents sur l'issue

### La liste des tests KO ne s'affiche pas

Si la section "Tests en échec" est vide ou montre le message "Impossible de récupérer la liste" :

1. **Vérifiez les liens entre issues** :
   - Les Tests doivent être **liés** à la Test Execution (relation "is tested by" ou "tests")
   - Utilisez Xray pour créer un Test Plan qui lie automatiquement les Tests

2. **Vérifiez le type d'issue** :
   - Les tests doivent avoir le type `Test` (ou votre type personnalisé)
   - Si différent, modifiez la requête JQL : `type = "Votre Type"`

3. **Vérifiez les statuts** :
   - Les statuts peuvent varier : `FAIL`, `Failed`, `Error`, `Échec`, etc.
   - Ajoutez vos statuts dans la JQL : `status in (FAIL, Failed, Error, "Votre Statut")`
   - Pour voir tous les statuts disponibles : Jira → Issue → Status (en bas à droite)

4. **Testez la requête JQL manuellement** :
   ```
   issue in linkedIssuesOf("TEST-EXEC-123") and type = Test and status in (FAIL, Failed)
   ```
   Remplacez `TEST-EXEC-123` par votre clé réelle et exécutez dans la recherche Jira

5. **Permissions** :
   - L'utilisateur qui déclenche la règle doit avoir accès aux Tests liés
   - Vérifiez les permissions du projet

### Personnaliser la requête JQL

Pour adapter la requête à votre configuration Xray, modifiez cette ligne dans le template HTML :

```html
<!-- Version de base -->
{{#lookupIssues}}issue in linkedIssuesOf("{{issue.key}}") and type = Test and status in (FAIL, Failed, Error){{/}}

<!-- Si vos Tests sont dans un projet spécifique -->
{{#lookupIssues}}project = MYPROJECT and issue in linkedIssuesOf("{{issue.key}}") and type = Test and status = FAIL{{/}}

<!-- Si vous utilisez un champ personnalisé pour le statut -->
{{#lookupIssues}}issue in linkedIssuesOf("{{issue.key}}") and "Test Status" = FAIL{{/}}

<!-- Pour voir TOUS les tests liés (debug) -->
{{#lookupIssues}}issue in linkedIssuesOf("{{issue.key}}") and type = Test{{/}}
```

### Les smart values ne fonctionnent pas

- Vérifiez la syntaxe : `{{issue.key}}` et non `{{issue.Key}}`
- Testez avec des valeurs simples d'abord

### L'email arrive dans les spams

- Ajoutez l'adresse d'expédition Jira à vos contacts
- Configurez un domaine d'envoi personnalisé dans Jira (admin)

---

## 🎯 Affichage des tests en échec (Approches alternatives)

La version configurée ci-dessus utilise **l'Approche 1 (lookupIssues avec JQL)** qui est recommandée. Si elle ne fonctionne pas avec votre configuration, voici des alternatives :

### ✅ Approche 1 : lookupIssues avec JQL (IMPLÉMENTÉE)

**Cette approche est déjà configurée dans le template HTML ci-dessus.**

Requête JQL utilisée :
```
issue in linkedIssuesOf("{{issue.key}}") and type = Test and status in (FAIL, Failed, Error)
```

**Avantages** :
- ✅ Native à Jira (pas d'API externe)
- ✅ Compatible Xray
- ✅ Filtrage automatique des tests KO
- ✅ Affiche : clé, nom, statut de chaque test
- ✅ Compteur du nombre de tests en échec

**Si ça ne fonctionne pas**, consultez la section "Dépannage → La liste des tests KO ne s'affiche pas" ci-dessus.

### Approche 2 : Utiliser une Web Request vers l'API Xray

Pour obtenir les résultats détaillés des tests, ajoutez une action **Web Request** avant l'envoi d'email :

1. **URL** : `https://your-domain.atlassian.net/rest/raven/1.0/api/testexec/{{issue.key}}/test`
2. **Headers** : `Authorization: Basic <votre-token-base64>`
3. **Method** : GET
4. Stockez la réponse dans une variable et utilisez-la dans l'email

### Approche 3 : Lien vers le rapport HTML Playwright

Si vous utilisez GitHub Actions, ajoutez dans l'email un lien vers le rapport :

```html
<div style="text-align: center; margin: 20px 0;">
  <a href="https://github.com/{{repository}}/actions/runs/{{run-id}}" 
     style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; 
            text-decoration: none; border-radius: 8px; font-weight: 600;">
    📊 Voir le rapport HTML complet
  </a>
</div>
```

### Approche 4 : Variables personnalisées dans la description

Modifiez votre script `jira-post-execution.ps1` pour ajouter les tests en échec dans la **description** de la Test Execution :

```powershell
$failedTests = $testResults | Where-Object { $_.status -eq "FAIL" }
$failedTestsList = $failedTests | ForEach-Object { "- $($_.key): $($_.summary)" }
$description = "Tests en échec:`n$($failedTestsList -join "`n")"

# Utilisez ensuite {{issue.description}} dans l'email
```

### Comparaison des approches

| Approche | Complexité | Fiabilité | Détails |
|----------|-----------|-----------|---------|
| **Smart values basiques** | ⭐ Faible | ⭐⭐ Moyenne | Peut ne pas fonctionner avec Xray |
| **lookupIssues (JQL)** | ⭐⭐ Moyenne | ⭐⭐⭐ Élevée | **Recommandé** - Utilise JQL natif |
| **Web Request API** | ⭐⭐⭐ Élevée | ⭐⭐⭐ Élevée | Nécessite configuration auth |
| **Lien vers GitHub** | ⭐ Faible | ⭐⭐⭐ Élevée | Simple mais moins détaillé |
| **Description personnalisée** | ⭐⭐ Moyenne | ⭐⭐⭐ Élevée | Nécessite modification du script |

**Ma recommandation** : Commencez par l'**Approche 1 (lookupIssues)** car elle utilise JQL natif de Jira et fonctionne bien avec Xray.