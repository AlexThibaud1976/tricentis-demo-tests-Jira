# Guide d'utilisation du Reporter Xray pour Playwright

## 📖 Introduction

Ce projet utilise le reporter officiel **@xray-app/playwright-junit-reporter** pour générer des rapports JUnit XML enrichis, compatibles avec Xray Cloud. Ce reporter remplace le reporter JUnit natif de Playwright (déprécié depuis la v1.34).

## 🎯 Avantages

- ✅ **Traçabilité complète** : Lien automatique entre tests et issues Jira
- ✅ **Métadonnées enrichies** : Tags, descriptions, requirements
- ✅ **Custom fields Test Run** : Enrichissement avec informations d'environnement
- ✅ **Evidence intégrée** : Embed de screenshots et fichiers
- ✅ **Officiel et maintenu** : Supporté par l'équipe Xray

## 📦 Installation

Le package est déjà installé dans le projet :

```json
{
  "devDependencies": {
    "@xray-app/playwright-junit-reporter": "^0.11.0"
  }
}
```

## ⚙️ Configuration

### Configuration Playwright (playwright.config.js)

```javascript
reporter: [
  ['html'],
  ['list'],
  ['@xray-app/playwright-junit-reporter', {
    outputFile: 'xray-report.xml',
    embedAnnotationsAsProperties: true,
    embedTestrunAnnotationsAsItemProperties: true,
    embedAttachmentsAsProperty: 'testrun_evidence',
    textContentAnnotations: ['test_description', 'testrun_comment']
  }]
]
```

### Options de configuration

| Option | Description | Valeur |
|--------|-------------|--------|
| `outputFile` | Nom du fichier XML généré | `xray-report.xml` |
| `embedAnnotationsAsProperties` | Inclure toutes les annotations comme properties | `true` |
| `embedTestrunAnnotationsAsItemProperties` | Inclure les annotations TR custom fields | `true` |
| `embedAttachmentsAsProperty` | Property pour les attachments | `testrun_evidence` |
| `textContentAnnotations` | Annotations en inner content (vs attribut) | `['test_description', 'testrun_comment']` |

## 🏷️ Annotations supportées

### Annotations standard Xray

| Type | Description | Exemple |
|------|-------------|---------|
| `test_key` | Clé du test dans Jira | `DEMO-101` |
| `test_id` | ID numérique du test | `12345` |
| `requirements` | Issues liées (stories, bugs) | `DEMO-5,DEMO-6` |
| `test_summary` | Résumé du test | `Login avec credentials valides` |
| `test_description` | Description multilignes | `Vérifie la connexion...` |
| `tags` | Labels/tags | `smoke,regression,positive` |

### Custom fields Test Run (tr:xxx)

Pour enrichir les Test Runs avec des informations d'environnement :

| Type | Description | Exemple |
|------|-------------|---------|
| `tr:basic_cf` | Champ texte simple | `dummycontent` |
| `tr:multiselect_cf` | Champ multiselect | `a;b;c` (délimité par `;`) |
| `tr:multiline_cf` | Champ texte multiligne | `Hello\nWorld` |

## 💻 Utilisation dans les tests

### Exemple complet

```javascript
const { test, expect } = require('@playwright/test');

test('Test de connexion utilisateur', async ({ page }, testInfo) => {
  // Annotations Xray pour l'intégration Jira
  testInfo.annotations.push({ 
    type: 'test_key', 
    description: 'DEMO-201' 
  });
  testInfo.annotations.push({ 
    type: 'requirements', 
    description: 'DEMO-2,DEMO-10' 
  });
  testInfo.annotations.push({ 
    type: 'tags', 
    description: 'smoke,login,positive,critical' 
  });
  testInfo.annotations.push({ 
    type: 'test_description', 
    description: 'Vérifie la connexion avec des identifiants valides.\nCe test couvre le parcours utilisateur complet.' 
  });
  
  // Custom fields pour le Test Run
  testInfo.annotations.push({ 
    type: 'tr:environment', 
    description: 'staging' 
  });
  testInfo.annotations.push({ 
    type: 'tr:test_type', 
    description: 'regression;smoke' 
  });
  
  // Votre test
  await page.goto('/login');
  await page.fill('#email', 'user@test.com');
  await page.fill('#password', 'password');
  await page.click('button[type="submit"]');
  
  // Vérifications
  await expect(page).toHaveURL(/dashboard/);
  
  // Capture screenshot comme evidence
  await testInfo.attach('login-success', {
    path: await page.screenshot({ path: 'screenshots/login.png' }),
    contentType: 'image/png'
  });
});
```

### Ajout d'attachments (Evidence)

Les attachments sont automatiquement embarqués dans le XML :

```javascript
test('test avec evidence', async ({ page }, testInfo) => {
  testInfo.annotations.push({ type: 'test_key', description: 'DEMO-301' });
  
  // Attachment depuis un fichier
  const filePath = testInfo.outputPath('evidence.txt');
  require('fs').writeFileSync(filePath, 'Contenu du fichier', 'utf8');
  await testInfo.attach('evidence.txt', { 
    path: filePath, 
    contentType: 'text/plain' 
  });
  
  // Attachment depuis un buffer
  await testInfo.attach('data.json', { 
    body: Buffer.from(JSON.stringify({ test: 'data' })), 
    contentType: 'application/json' 
  });
  
  // Screenshot
  await testInfo.attach('screenshot', {
    body: await page.screenshot(),
    contentType: 'image/png'
  });
});
```

## 📄 Structure du XML généré

### Exemple de sortie

```xml
<testsuites>
  <testsuite name="01-account-creation.spec.js" tests="1" failures="0">
    <testcase name="Test 1: Création de compte" classname="01-account-creation.spec.js" time="2.5">
      <properties>
        <property name="test_key" value="DEMO-101"></property>
        <property name="requirements" value="DEMO-1"></property>
        <property name="tags" value="smoke,account-creation,positive"></property>
        <property name="test_description">
          <![CDATA[Vérifie la création d'un compte utilisateur avec des données valides.
Le test génère des données utilisateur uniques et valide le message de succès.]]>
        </property>
        <property name="testrun_evidence">
          <item name="screenshot.png" contentType="image/png">
            <![CDATA[iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==]]>
          </item>
        </property>
      </properties>
    </testcase>
  </testsuite>
</testsuites>
```

## 🔄 Upload vers Xray Cloud

### Script PowerShell

Le script `upload-xray.ps1` est configuré pour utiliser `xray-report.xml` :

```powershell
.\scripts\upload-xray.ps1 `
  -IssueKey "DEMO-100" `
  -DeviceName "win10-chrome" `
  -XrayEndpoint "xray.cloud.getxray.app" `
  -JiraProjectKey "DEMO"
```

### Variables d'environnement requises

```bash
XRAY_CLIENT_ID=your-client-id
XRAY_CLIENT_SECRET=your-client-secret
XRAY_ENDPOINT=xray.cloud.getxray.app
JIRA_PROJECT_KEY=DEMO
```

## 🎨 Mapping des test_key

Voici le mapping actuel des tests du projet :

| Test | Fichier | test_key |
|------|---------|----------|
| Création compte - cas passant | 01-account-creation.spec.js | DEMO-87 |
| Création compte - email invalide | 01-account-creation.spec.js | DEMO-88 |
| Création compte - mots de passe différents | 01-account-creation.spec.js | DEMO-89 |
| Connexion - cas passant | 02-login-logout.spec.js | DEMO-90 |
| Connexion - mot de passe incorrect | 02-login-logout.spec.js | DEMO-91 |
| Connexion - email inexistant | 02-login-logout.spec.js | DEMO-92 |
| Déconnexion | 02-login-logout.spec.js | DEMO-93 |
| Parcours catalogue | 03-catalog-navigation.spec.js | DEMO-94 |
| Navigation catégories | 03-catalog-navigation.spec.js | DEMO-95 |
| Recherche produits | 03-catalog-navigation.spec.js | DEMO-96 |
| Ajout produit au panier | 04-cart-management.spec.js | DEMO-97 |
| Ajout plusieurs produits | 04-cart-management.spec.js | DEMO-98 |
| Modification quantité | 04-cart-management.spec.js | DEMO-99 |
| Suppression produit | 04-cart-management.spec.js | DEMO-100 |
| Vider panier | 04-cart-management.spec.js | DEMO-101 |
| Commande complète | 05-order-checkout.spec.js | DEMO-102 |
| Checkout sans conditions | 05-order-checkout.spec.js | DEMO-103 |
| Commande plusieurs produits | 05-order-checkout.spec.js | DEMO-104 |
| Sanity test | 99-sanity.spec.js | DEMO-105 |

**⚠️ Important** : Adaptez ces test_key selon vos propres issues Jira/Xray.

## 🔍 Vérification du rapport

Après exécution des tests :

```powershell
# Vérifier l'existence du fichier
Test-Path xray-report.xml

# Voir les annotations
Get-Content xray-report.xml | Select-String -Pattern "test_key|tags"

# Voir la structure
Get-Content xray-report.xml | Select-Object -First 50
```

## 📚 Ressources

- [Documentation officielle du reporter](https://github.com/Xray-App/playwright-junit-reporter)
- [Format JUnit XML évolué pour Xray](https://docs.getxray.app/display/XRAYCLOUD/Taking+advantage+of+JUnit+XML+reports)
- [API Xray Cloud](https://docs.getxray.app/display/XRAYCLOUD/Import+Execution+Results+-+REST+v2)

## 🐛 Dépannage

### Le fichier xray-report.xml n'est pas généré

- Vérifier que le reporter est bien configuré dans playwright.config.js
- Vérifier que les tests s'exécutent correctement
- Regarder les logs de Playwright pour des erreurs

### Les annotations n'apparaissent pas dans le XML

- Vérifier que `embedAnnotationsAsProperties: true`
- Vérifier la syntaxe des annotations dans les tests
- S'assurer d'utiliser `testInfo` comme second paramètre

### Upload vers Xray échoue

- Vérifier les credentials Xray (client_id, client_secret)
- Vérifier que le projectKey et testPlanKey existent
- Valider que le XML est bien formé

### Erreurs d'encodage dans les descriptions

- Les caractères spéciaux sont automatiquement échappés en CDATA
- Si problème persiste, utiliser uniquement ASCII dans les descriptions

## ✅ Checklist migration

Si vous migrez depuis l'ancien système :

- [x] Installer @xray-app/playwright-junit-reporter
- [x] Configurer playwright.config.js avec le nouveau reporter
- [x] Ajouter annotations testInfo dans tous les tests
- [x] Adapter upload-xray.ps1 pour utiliser xray-report.xml
- [x] Tester la génération du rapport
- [x] Tester l'upload vers Xray Cloud
- [x] Mettre à jour la documentation

---

**Date de migration** : 27 janvier 2026  
**Version du reporter** : @xray-app/playwright-junit-reporter@0.11.0
