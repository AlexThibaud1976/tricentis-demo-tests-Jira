# Confluence URL Bug - Résolution

## 🐛 Bug identifié et corrigé

### Le problème

Le script `scripts/update-confluence-report.js` utilisait `new URL(path, baseUrl)` pour construire les URLs de l'API Confluence.

**Comportement de JavaScript** : Quand le `path` commence par `/`, il **remplace complètement** le chemin de la `baseUrl`.

```javascript
// ❌ BUGGY
const baseUrl = 'https://kisskool.atlassian.net/wiki';
const path = '/rest/api/content';
const url = new URL(path, baseUrl);
console.log(url.href); 
// Résultat: https://kisskool.atlassian.net/rest/api/content
// ❌ Le /wiki est perdu !
```

### La solution

Concaténer d'abord les URLs, puis créer l'objet URL :

```javascript
// ✅ FIXED  
const baseUrl = 'https://kisskool.atlassian.net/wiki';
const path = '/rest/api/content';
const fullUrl = baseUrl + path;
const url = new URL(fullUrl);
console.log(url.href);
// Résultat: https://kisskool.atlassian.net/wiki/rest/api/content
// ✅ Le /wiki est préservé !
```

## 📝 Changements effectués

### Fichier modifié : `scripts/update-confluence-report.js`

**Ligne ~103** - Fonction `request()` :

```javascript
// AVANT (buggy)
const url = new URL(path, config.confluenceUrl);

// APRÈS (fixed)
const fullUrl = config.confluenceUrl + path;
const url = new URL(fullUrl);
```

### Améliorations supplémentaires

1. **Debug logging** : Ajout d'un log debug pour voir l'URL construite
2. **Validation améliorée** : Avertissement si `CONFLUENCE_URL` ne contient pas `/wiki`
3. **Message d'erreur amélioré** : Détection quand JIRA répond au lieu de Confluence

## ✅ Tests de validation

Deux scripts de test créés pour valider la correction :

1. `scripts/test-confluence-url.js` - Test simple montrant le bug
2. `scripts/test-confluence-url-integration.js` - Test complet avec tous les endpoints

```bash
# Exécuter les tests
node scripts/test-confluence-url.js
node scripts/test-confluence-url-integration.js
```

**Résultat attendu** : ✅ TOUS LES TESTS PASSENT

## 🚀 Pour tester en production

### Vérifiez vos secrets GitHub

Assurez-vous que ces secrets sont correctement configurés :

| Secret | Format attendu | Exemple |
|--------|----------------|---------|
| `CONFLUENCE_URL` | `https://domain.atlassian.net/wiki` | `https://kisskool.atlassian.net/wiki` |
| `CONFLUENCE_USER` | Email | `votre.email@domaine.com` |
| `CONFLUENCE_API_TOKEN` | Token Atlassian | `ATATT3x...` |
| `CONFLUENCE_SPACE_KEY` | Clé d'espace | `QA` ou `DEMO` |

### Lancez un workflow avec Confluence Report

1. Allez dans **Actions** → **Playwright Tests** → **Run workflow**
2. Remplissez les paramètres requis
3. ✅ **Activez** `confluenceReport: true`
4. Lancez le workflow

### Vérifiez les logs

Dans les logs du step "Update Confluence Report", vous devriez voir :

```
==============================================
[Confluence Report] Starting update
  URL:    https://kisskool.atlassian.net/wiki
  Space:  QA
  Page:   Dashboard Qualité - Tricentis Demo
  Result: PASS
  Scope:  Footer Links Tests
  Device: windows-11-chrome-latest
==============================================
[DEBUG] Requesting: GET https://kisskool.atlassian.net/wiki/rest/api/content?title=...
Page found: 123456 (version 5)
Page updated successfully (version 6).
✅ Confluence report updated successfully!
```

## 📚 Voir aussi

- [CONFLUENCE_REPORTING_GUIDE.md](../CONFLUENCE_REPORTING_GUIDE.md) - Guide complet
- [CONFLUENCE_TROUBLESHOOTING.md](../CONFLUENCE_TROUBLESHOOTING.md) - Dépannage
- [Documentation API Confluence](https://developer.atlassian.com/cloud/confluence/rest/v1/intro/)

## 🎯 Résumé

| Avant | Après |
|-------|-------|
| ❌ URL incorrecte : `/rest/api/content` | ✅ URL correcte : `/wiki/rest/api/content` |
| ❌ Erreur 404 de JIRA | ✅ API Confluence fonctionne |
| ❌ Pas de debug | ✅ Logs détaillés |
| ❌ Erreur obscure | ✅ Messages clairs |

**Le bug est corrigé et testé. Le rapport Confluence devrait maintenant fonctionner ! 🎉**
