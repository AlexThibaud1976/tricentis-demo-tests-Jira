# Confluence Reporting - Guide de dépannage

## ❌ Erreur 404 : "JIRA dead link"

### Symptôme
Le script Confluence retourne une erreur 404 avec du HTML de JIRA :
```
[Confluence Report] Error: Confluence API 404: <!DOCTYPE html><html lang="en">...
Oops, you've found a dead link. - JIRA
```

### Cause
Le secret GitHub `CONFLUENCE_URL` pointe vers **JIRA** au lieu de **Confluence**.

### Solution

#### 1. Vérifiez vos URLs Atlassian Cloud

Pour Atlassian Cloud, les URLs sont **différentes** :

| Service | Format URL |
|---------|------------|
| **JIRA** | `https://votre-domaine.atlassian.net` |
| **Confluence** | `https://votre-domaine.atlassian.net/wiki` |

#### 2. Corrigez le secret GitHub

1. Allez dans votre repository GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Trouvez le secret `CONFLUENCE_URL`
4. Cliquez sur **Update**
5. Changez la valeur pour **inclure `/wiki`** :
   ```
   https://votre-domaine.atlassian.net/wiki
   ```
6. Sauvegardez

#### 3. Vérifiez les autres secrets requis

Le rapport Confluence nécessite ces secrets GitHub :

| Secret | Description | Exemple |
|--------|-------------|---------|
| `CONFLUENCE_URL` | URL de base Confluence | `https://domain.atlassian.net/wiki` |
| `CONFLUENCE_USER` | Email utilisateur | `votre.email@domaine.com` |
| `CONFLUENCE_API_TOKEN` | Token API Atlassian | `ATATT3x...` |
| `CONFLUENCE_SPACE_KEY` | Clé de l'espace | `QA` |
| `CONFLUENCE_PAGE_TITLE` | Titre de la page (optionnel) | `Dashboard Qualité - Tricentis Demo` |

#### 4. Testez à nouveau

Relancez le workflow avec l'option `confluenceReport: true`.

---

## ⚠️ Erreur : "Missing required environment variables"

### Cause
Un ou plusieurs secrets GitHub ne sont pas configurés.

### Solution
Configurez tous les secrets requis (voir tableau ci-dessus).

---

## 🔐 Comment créer un API Token Atlassian

1. Allez sur https://id.atlassian.com/manage-profile/security/api-tokens
2. Cliquez sur **Create API token**
3. Donnez-lui un nom (ex: "GitHub Actions")
4. Copiez le token
5. Ajoutez-le comme secret GitHub `CONFLUENCE_API_TOKEN`

**Important** : Utilisez le **même email et token** pour `CONFLUENCE_USER` et `CONFLUENCE_API_TOKEN` que celui qui a accès à l'espace Confluence.

---

## 🔍 Trouver votre Space Key

1. Ouvrez votre page Confluence
2. Regardez l'URL : `https://domain.atlassian.net/wiki/spaces/SPACEKEY/pages/...`
3. Le `SPACEKEY` est votre clé d'espace

---

## ✅ Vérification rapide

Exécutez cette commande pour tester votre configuration (remplacez les valeurs) :

```bash
# Linux/Mac
curl -u "votre.email@domaine.com:VOTRE_TOKEN" \
  "https://votre-domaine.atlassian.net/wiki/rest/api/space/VOTRE_SPACE_KEY"

# PowerShell
$headers = @{
    "Authorization" = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("votre.email@domaine.com:VOTRE_TOKEN"))
}
Invoke-RestMethod -Uri "https://votre-domaine.atlassian.net/wiki/rest/api/space/VOTRE_SPACE_KEY" -Headers $headers
```

Si vous obtenez des informations JSON sur l'espace, votre configuration est correcte !

---

## 📚 Voir aussi

- [CONFLUENCE_REPORTING_GUIDE.md](CONFLUENCE_REPORTING_GUIDE.md) - Guide complet
- [Documentation API Confluence](https://developer.atlassian.com/cloud/confluence/rest/v1/intro/)
