# ✅ Mise à jour - Versions BrowserStack correctes

## 🎯 Changements effectués

Les paramètres ont été mis à jour pour refléter les **valeurs exactes** attendues par BrowserStack.

---

## 📊 Avant / Après

### ❌ AVANT (Incorrect)

#### macOS
- Versions : `10.15`, `11`, `12`, `13`, `14`, `15` (numéros)
- Problème : BrowserStack n'accepte pas les numéros pour macOS

#### Navigateurs
- `chrome`, `firefox`, `safari`, `edge` (noms simples)
- Problème : BrowserStack s'attend à `playwright-chromium`, `playwright-firefox`, etc.

#### Versions navigateurs
- Chrome: `120`, `119`, `118`, etc.
- Problème : Versions obsolètes

### ✅ APRÈS (Correct)

#### macOS
- Versions : `Catalina`, `Big Sur`, `Monterey`, `Ventura`, `Sonoma`, `Sequoia` (noms)
- ✅ Conforme à BrowserStack

#### Navigateurs
- `chrome` → `playwright-chromium`
- `chromium` → `playwright-chromium`
- `firefox` → `playwright-firefox`
- `safari` → `playwright-webkit`
- `edge` → `playwright-chromium`
- ✅ Conversion automatique par le script

#### Versions navigateurs
- Chrome/Chromium: `144`, `143`, `142`, `141`, `140`
- Firefox: `144`, `143`, `142`, `141`, `140`
- Safari: `18`, `17`, `16`, `15`
- Edge: `131`, `130`, `129`, `128`
- ✅ Versions actuelles

---

## 🔧 Fichiers modifiés

### 1. `scripts/resolve-browserstack-config.js`

**Changements:**
- ✅ Ajout des noms de versions macOS (Catalina, Big Sur, etc.)
- ✅ Ajout du mapping macOS numéro ↔ nom
- ✅ Mise à jour des versions de navigateurs
- ✅ Utilisation des noms BrowserStack corrects (playwright-chromium, etc.)
- ✅ Ajout du support de `chromium` en plus de `chrome`

### 2. `.github/workflows/playwright.yml`

**Changements:**
- ✅ Options macOS mises à jour : Catalina, Big Sur, Monterey, Ventura, Sonoma, Sequoia
- ✅ Options navigateurs mises à jour : chrome, chromium, firefox, safari, edge
- ✅ Versions navigateurs actualisées : 144, 143, 142, etc.

### 3. Documentation

**Fichiers créés:**
- ✅ `BROWSERSTACK_VERSIONS.md` - Référence complète des versions supportées

**Fichiers mis à jour:**
- ✅ `QUICK_START.md` - Versions et exemples actualisés
- ✅ `COPY_PASTE_EXAMPLES.md` - Exemples avec les bonnes valeurs

---

## 🧪 Tests validés

### ✅ Test 1: macOS Sonoma + Firefox 144
```bash
node scripts/resolve-browserstack-config.js --os Mac --osVersion Sonoma --browser firefox --browserVersion 144
```
**Résultat:**
```json
{
  "BS_OS": "OS X",
  "BS_OS_VERSION": "Sonoma",
  "BS_BROWSER": "playwright-firefox",
  "BS_BROWSER_VERSION": "144",
  "DEVICE_NAME": "macsonoma-firefox-144"
}
```

### ✅ Test 2: Windows 11 + Chromium 143
```bash
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser chromium --browserVersion 143
```
**Résultat:**
```json
{
  "BS_OS": "Windows",
  "BS_OS_VERSION": "11",
  "BS_BROWSER": "playwright-chromium",
  "BS_BROWSER_VERSION": "143",
  "DEVICE_NAME": "windows11-chromium-143"
}
```

### ✅ Test 3: macOS Big Sur + Safari latest
```bash
node scripts/resolve-browserstack-config.js --os Mac --osVersion "Big Sur" --browser safari --browserVersion latest
```
**Résultat:**
```json
{
  "BS_OS": "OS X",
  "BS_OS_VERSION": "Big Sur",
  "BS_BROWSER": "playwright-webkit",
  "BS_BROWSER_VERSION": "latest",
  "DEVICE_NAME": "macbigsur-safari-latest"
}
```

---

## 📋 Nouvelles valeurs supportées

### macOS

| Nom | Numéro équivalent | Valeur à utiliser |
|-----|-------------------|-------------------|
| Catalina | 10.15 | `Catalina` |
| Big Sur | 11 | `Big Sur` |
| Monterey | 12 | `Monterey` |
| Ventura | 13 | `Ventura` |
| Sonoma | 14 | `Sonoma` |
| Sequoia | 15 | `Sequoia` |

### Navigateurs

| Navigateur | Valeur d'entrée | Nom BrowserStack |
|-----------|----------------|------------------|
| Chrome | `chrome` | `playwright-chromium` |
| Chromium | `chromium` | `playwright-chromium` |
| Firefox | `firefox` | `playwright-firefox` |
| Safari | `safari` | `playwright-webkit` |
| Edge | `edge` | `playwright-chromium` |

### Versions navigateurs

| Navigateur | Versions supportées |
|-----------|-------------------|
| Chrome/Chromium | latest, 144, 143, 142, 141, 140 |
| Firefox | latest, 144, 143, 142, 141, 140 |
| Safari | latest, 18, 17, 16, 15 |
| Edge | latest, 131, 130, 129, 128 |

---

## 🎯 Exemples d'utilisation

### Via GitHub Actions

**Avant:**
```
OS: Mac
OS Version: 14
Browser: safari
Browser Version: 17
```

**Après:**
```
OS: Mac
OS Version: Sonoma
Browser: safari
Browser Version: 17
```

### Via Jira Automation

**Avant:**
```json
{
  "os": "Mac",
  "osVersion": "14",
  "browser": "safari",
  "browserVersion": "17"
}
```

**Après:**
```json
{
  "os": "Mac",
  "osVersion": "Sonoma",
  "browser": "safari",
  "browserVersion": "17"
}
```

---

## ⚠️ Points d'attention

### 1. Noms macOS avec espaces

Pour les versions macOS avec espaces (ex: "Big Sur"), utilisez des guillemets dans les commandes shell:

```bash
# ✅ Correct
node scripts/resolve-browserstack-config.js --os Mac --osVersion "Big Sur" --browser safari --browserVersion latest

# ❌ Incorrect (sans guillemets)
node scripts/resolve-browserstack-config.js --os Mac --osVersion Big Sur --browser safari --browserVersion latest
```

### 2. Conversion automatique des navigateurs

Le script convertit automatiquement les noms de navigateurs:
- `chrome` → `playwright-chromium`
- `chromium` → `playwright-chromium`
- `firefox` → `playwright-firefox`
- `safari` → `playwright-webkit`
- `edge` → `playwright-chromium`

Vous n'avez **pas besoin** d'utiliser les noms `playwright-*` directement.

### 3. Compatibilité des versions

- **Safari** n'est disponible que sur macOS
- **Edge** est disponible sur Windows uniquement
- **Chrome/Chromium/Firefox** sont disponibles sur Windows et macOS

---

## 📚 Documentation actualisée

Tous les documents suivants ont été mis à jour avec les nouvelles valeurs:

- ✅ `BROWSERSTACK_VERSIONS.md` - Nouveau fichier de référence
- ✅ `QUICK_START.md` - Guide de démarrage
- ✅ `COPY_PASTE_EXAMPLES.md` - Exemples
- ✅ `.github/workflows/playwright.yml` - Workflow GitHub

---

## 🚀 Prochaines étapes

1. **Tester** la nouvelle configuration localement
2. **Mettre à jour** vos Automation Rules Jira existantes
3. **Consulter** [BROWSERSTACK_VERSIONS.md](./BROWSERSTACK_VERSIONS.md) pour la référence complète

---

**Date de mise à jour:** Janvier 2026  
**Raison:** Alignement avec les valeurs BrowserStack officielles  
**Impact:** Les anciennes configurations avec numéros macOS ne fonctionneront plus
