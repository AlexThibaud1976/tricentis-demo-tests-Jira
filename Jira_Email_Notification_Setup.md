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
         └─ Body: Template rouge
```

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

---

## Dépannage

### L'email n'est pas envoyé

1. Vérifiez que la règle est **activée**
2. Vérifiez les **Audit logs** de la règle pour voir les erreurs
3. Assurez-vous que les labels `PASS` ou `FAIL` sont bien présents sur l'issue

### Les smart values ne fonctionnent pas

- Vérifiez la syntaxe : `{{issue.key}}` et non `{{issue.Key}}`
- Testez avec des valeurs simples d'abord

### L'email arrive dans les spams

- Ajoutez l'adresse d'expédition Jira à vos contacts
- Configurez un domaine d'envoi personnalisé dans Jira (admin)