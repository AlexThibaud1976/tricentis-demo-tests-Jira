# GitHub Actions Reporter - Guide d'utilisation

## 📊 Vue d'ensemble

Le **GitHub Actions Reporter** affiche un résumé visuel élégant des résultats de tests Playwright directement dans le **Job Summary** de GitHub Actions, accessible sans télécharger d'artifacts.

**Package** : `@estruyf/github-actions-reporter` v1.11.0  
**Repository** : https://github.com/estruyf/playwright-github-actions-reporter

---

## ✨ Fonctionnalités

- ✅ **Résumé visuel** dans le Job Summary GitHub Actions
- 📊 **Statistiques détaillées** : tests passés, échoués, ignorés
- 🏷️ **Affichage des tags** Playwright
- 🔍 **Détails des erreurs** pour les tests échoués
- 🎨 **Interface claire** avec sections expansibles
- ⚡ **Activation automatique** en mode CI uniquement

---

## 🔧 Configuration

Le reporter est déjà configuré dans les deux fichiers de configuration Playwright :

### `playwright.config.js` (tests locaux)

```javascript
reporter: [
  ['html'],
  ['list'],
  ['@xray-app/playwright-junit-reporter', { /* ... */ }],
  // GitHub Actions reporter - activé uniquement en CI
  ...(process.env.GITHUB_ACTIONS ? [['@estruyf/github-actions-reporter', { 
    title: '🎭 Playwright Test Results',
    useDetails: true,
    showError: true,
    showTags: true
  }]] : [])
]
```

### `playwright.config.browserstack.js` (tests BrowserStack)

```javascript
reporter: [
  ['list'],
  ['html', { open: 'never' }],
  ['json', { outputFile: 'test-results.json' }],
  ['./browserstack-reporter.js'],
  ['@xray-app/playwright-junit-reporter', { /* ... */ }],
  // GitHub Actions reporter - activé uniquement en CI
  ...(process.env.GITHUB_ACTIONS ? [['@estruyf/github-actions-reporter', { 
    title: '🎭 Playwright Test Results - BrowserStack',
    useDetails: true,
    showError: true,
    showTags: true
  }]] : [])
]
```

---

## 📝 Options de configuration

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `title` | `string` | `"Test results"` | Titre du rapport |
| `useDetails` | `boolean` | `false` | Utiliser des sections expansibles |
| `showError` | `boolean` | `false` | Afficher les messages d'erreur |
| `showTags` | `boolean` | `false` | Afficher les tags/labels des tests |
| `showAnnotations` | `boolean` | `true` | Afficher les annotations GitHub |

---

## 🚀 Utilisation

### Lors de l'exécution dans GitHub Actions

Le reporter s'active **automatiquement** quand :
1. Les tests sont exécutés dans GitHub Actions
2. La variable d'environnement `GITHUB_ACTIONS` est définie (automatique)

### Accéder au rapport

1. Allez dans **Actions** → Sélectionnez votre workflow run
2. Cliquez sur l'onglet **Summary** (en haut)
3. Le rapport s'affiche sous forme de tableau avec :
   - 📊 Statistiques globales
   - ✅ Tests réussis (si `useDetails: true`)
   - ❌ Tests échoués avec détails d'erreur
   - ⏭️ Tests ignorés
   - 🏷️ Tags associés

### Exemple de rendu

```
🎭 Playwright Test Results - BrowserStack

┌─────────────────────────────────────────┐
│ Tests:     42                           │
│ ✅ Passed:  40                          │
│ ❌ Failed:  2                           │
│ ⏭️ Skipped: 0                           │
│ Duration:  3m 24s                       │
└─────────────────────────────────────────┘

❌ Failed Tests
├─ [chromium] › 01-account-creation.spec.js:45
│  Error: Expected "Success" but got "Error"
│  Tags: @smoke, @critical
└─ ...
```

---

## 🎯 Avantages

### Par rapport au rapport HTML Playwright

| Critère | GitHub Actions Reporter | HTML Report |
|---------|------------------------|-------------|
| **Accès** | Dans le Job Summary | Télécharger artifact |
| **Vitesse** | Instantané | Téléchargement requis |
| **Synthèse** | Vue d'ensemble rapide | Détails complets |
| **Mobile** | ✅ Accessible | ❌ Nécessite extraction |
| **Historique** | ✅ GitHub conserve | ❌ Artifacts expirés (30j) |

### Complémentarité

Le **GitHub Actions Reporter** est complémentaire aux autres reporters :

1. **`@estruyf/github-actions-reporter`** → Vue rapide dans le Summary
2. **HTML report** → Détails complets avec traces et vidéos
3. **Xray reporter** → Intégration Jira pour suivi qualité
4. **BrowserStack reporter** → Liens vers les sessions BrowserStack

---

## 🔍 Exemples d'utilisation

### Workflow GitHub Actions

Le reporter est déjà intégré dans `.github/workflows/playwright.yml` :

```yaml
- name: Run tests on BrowserStack
  run: npx playwright test --config=playwright.config.browserstack.js
  env:
    GITHUB_ACTIONS: true  # Déjà défini automatiquement par GitHub
```

**Aucune configuration supplémentaire nécessaire !** 🎉

### Tester localement (le reporter ne s'activera pas)

```bash
# Le reporter ne s'affiche pas en local (normal)
npm test

# Forcer l'activation en local (pour test)
GITHUB_ACTIONS=true npm test
```

---

## 📚 Documentation officielle

- **Repository GitHub** : https://github.com/estruyf/playwright-github-actions-reporter
- **Package npm** : https://www.npmjs.com/package/@estruyf/github-actions-reporter
- **Auteur** : Elio Struyf (@eliostruyf)

---

## 🛠️ Troubleshooting

### Le rapport ne s'affiche pas

**Vérifiez** :
1. ✅ Les tests s'exécutent dans GitHub Actions
2. ✅ Le package est installé : `npm ls @estruyf/github-actions-reporter`
3. ✅ La configuration est dans `playwright.config.js`
4. ✅ Le workflow a des permissions d'écriture

### Message d'erreur du reporter

Si vous voyez une erreur du reporter, vérifiez :
- La syntaxe de configuration (voir exemples ci-dessus)
- La version du package (`npm ls @estruyf/github-actions-reporter`)
- Les logs complets du step de test

### Le rapport est vide

- Vérifiez que les tests se sont exécutés (pas d'erreur avant)
- Regardez dans l'onglet **Summary** du workflow run (pas dans les logs)

---

## 🎉 Avantages pour l'équipe

1. **Feedback rapide** : Voir les résultats sans ouvrir les artifacts
2. **Mobile-friendly** : Consultable depuis un smartphone
3. **Historique** : GitHub conserve les summaries plus longtemps
4. **Partage facile** : Lien direct vers le summary
5. **Zéro configuration** : Activé automatiquement en CI

---

## 📊 Comparaison avec autres solutions

| Solution | Activation | Détails | Traces | CI/CD |
|----------|-----------|---------|---------|-------|
| GitHub Actions Reporter | Auto CI | ⭐⭐⭐ | ❌ | ✅ |
| HTML Report | Manuel | ⭐⭐⭐⭐⭐ | ✅ | ❌ |
| Xray Reporter | Auto CI | ⭐⭐ | ❌ | ✅ |
| BrowserStack Reporter | Auto CI | ⭐⭐⭐ | ✅ | ✅ |

**Recommandation** : Utiliser **tous les reporters** pour couvrir différents besoins.

---

## 📝 Notes de version

**Version installée** : `1.11.0` (février 2026)

**Changements récents** :
- Amélioration de l'affichage des tags
- Support des annotations GitHub
- Meilleure gestion des erreurs

Pour mettre à jour :
```bash
npm update @estruyf/github-actions-reporter
```

---

## ✅ Checklist d'intégration

- [x] Package installé (`npm install`)
- [x] Configuration ajoutée à `playwright.config.js`
- [x] Configuration ajoutée à `playwright.config.browserstack.js`
- [x] Activation conditionnelle (CI uniquement)
- [x] Documentation créée
- [ ] Test dans GitHub Actions (prochain workflow run)

---

**Le reporter est maintenant configuré et prêt à l'emploi ! 🚀**

Au prochain workflow run, consultez l'onglet **Summary** pour voir le rapport visuel.
