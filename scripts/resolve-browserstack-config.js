#!/usr/bin/env node
/**
 * Résout et valide la configuration BrowserStack à partir des paramètres d'entrée
 * 
 * Usage:
 *   node scripts/resolve-browserstack-config.js \
 *     --os Windows \
 *     --osVersion 11 \
 *     --browser chrome \
 *     --browserVersion latest
 * 
 * Variables d'environnement définies:
 *   - BS_OS (ex: Windows, OS X)
 *   - BS_OS_VERSION (ex: 10, 11, 14, 15)
 *   - BS_BROWSER (ex: chrome, firefox, safari, edge)
 *   - BS_BROWSER_VERSION (ex: latest, 120, 119, etc)
 *   - DEVICE_NAME (ex: win11-chrome-latest)
 */

const fs = require('fs');
const path = require('path');

// Configuration des OS et navigateurs supportés par BrowserStack
const BROWSERSTACK_SUPPORT = {
  os: {
    windows: {
      label: 'Windows',
      versions: ['7', '8', '8.1', '10', '11'],
    },
    mac: {
      label: 'OS X',
      // BrowserStack utilise les noms de versions macOS, pas les numéros
      versions: ['Catalina', 'Big Sur', 'Monterey', 'Ventura', 'Sonoma', 'Sequoia', 'Tahoe'],
      // Mapping pour l'affichage
      versionMapping: {
        'Catalina': '10.15',
        'Big Sur': '11',
        'Monterey': '12',
        'Ventura': '13',
        'Sonoma': '14',
        'Sequoia': '15',
        'Tahoe': '16'
      }
    },
  },
  browsers: {
    chrome: {
      displayName: 'Chrome',
      browserName: 'playwright-chromium',
      versions: ['latest', '144', '143', '142', '141', '140'],
    },
    chromium: {
      displayName: 'Chromium',
      browserName: 'playwright-chromium',
      versions: ['latest', '144', '143', '142', '141', '140'],
    },
    firefox: {
      displayName: 'Firefox',
      browserName: 'playwright-firefox',
      versions: ['latest', '144', '143', '142', '141', '140'],
    },
    safari: {
      displayName: 'Safari',
      browserName: 'playwright-webkit',
      versions: ['latest', '18', '17', '16', '15'],
    },
    edge: {
      displayName: 'Edge',
      browserName: 'playwright-chromium',
      versions: ['latest', '131', '130', '129', '128'],
    },
  },
};

// Parse les arguments de ligne de commande
function parseArguments() {
  const args = process.argv.slice(2);
  const params = {
    os: null,
    osVersion: null,
    browser: null,
    browserVersion: null,
  };

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];

    if (key in params) {
      params[key] = value;
    }
  }

  return params;
}

// Valide les paramètres
function validateParams(params) {
  const errors = [];

  // Validation OS
  if (!params.os) {
    errors.push('--os est requis (Windows ou Mac)');
  } else {
    const osKey = params.os.toLowerCase();
    if (!BROWSERSTACK_SUPPORT.os[osKey]) {
      errors.push(
        `OS invalide: '${params.os}'. Valeurs acceptées: ${Object.keys(BROWSERSTACK_SUPPORT.os).join(', ')}`
      );
    } else if (!params.osVersion) {
      errors.push(`--osVersion est requis pour ${params.os}`);
    } else if (!BROWSERSTACK_SUPPORT.os[osKey].versions.includes(params.osVersion)) {
      errors.push(
        `Version OS invalide: '${params.osVersion}'. Valeurs acceptées pour ${params.os}: ${BROWSERSTACK_SUPPORT.os[osKey].versions.join(', ')}`
      );
    }
  }

  // Validation navigateur
  if (!params.browser) {
    errors.push('--browser est requis (chrome, firefox, safari, edge)');
  } else {
    const browserKey = params.browser.toLowerCase();
    if (!BROWSERSTACK_SUPPORT.browsers[browserKey]) {
      errors.push(
        `Navigateur invalide: '${params.browser}'. Valeurs acceptées: ${Object.keys(BROWSERSTACK_SUPPORT.browsers).join(', ')}`
      );
    } else if (!params.browserVersion) {
      errors.push(`--browserVersion est requis pour ${params.browser}`);
    } else if (!BROWSERSTACK_SUPPORT.browsers[browserKey].versions.includes(params.browserVersion)) {
      errors.push(
        `Version navigateur invalide: '${params.browserVersion}'. Valeurs acceptées pour ${params.browser}: ${BROWSERSTACK_SUPPORT.browsers[browserKey].versions.join(', ')}`
      );
    }
  }

  return errors;
}

/**
 * Résout et construit la configuration BrowserStack à partir des paramètres validés
 * @param {Object} params - Paramètres de configuration (os, osVersion, browser, browserVersion)
 * @returns {Object} Configuration résolue avec variables d'environnement
 */
function resolveConfig(params) {
  const osKey = params.os.toLowerCase();
  const browserKey = params.browser.toLowerCase();

  const osLabel = BROWSERSTACK_SUPPORT.os[osKey].label;
  const browserInfo = BROWSERSTACK_SUPPORT.browsers[browserKey];

  // Utiliser le nom de navigateur BrowserStack (ex: playwright-firefox)
  const browserName = browserInfo.browserName;

  const config = {
    BS_OS: osLabel,
    BS_OS_VERSION: params.osVersion,
    BS_BROWSER: browserName,
    BS_BROWSER_VERSION: params.browserVersion,
    DEVICE_NAME: `${osKey}-${params.osVersion.replace(/\s+/g, '')}-${browserKey}-${params.browserVersion}`.toLowerCase(),
  };

  return config;
}

/**
 * Exporte la configuration en tant que variables d'environnement
 * En mode GitHub Actions: écrit dans GITHUB_ENV
 * En mode local: affiche les variables dans la console
 * @param {Object} config - Configuration à exporter
 * @returns {Object} Configuration exportée
 */
function exportForGitHub(config) {
  const gitHubEnv = process.env.GITHUB_ENV;

  if (gitHubEnv) {
    // Mode GitHub Actions: écrire dans GITHUB_ENV pour persistance entre les steps
    const envContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.appendFileSync(gitHubEnv, envContent + '\n');
    console.log('✅ Variables d\'environnement exportées vers GITHUB_ENV');
  } else {
    // Développement local: afficher les variables
    console.log('\n📋 Configuration BrowserStack résolue:');
    Object.entries(config).forEach(([key, value]) => {
      console.log(`   ${key}=${value}`);
    });
  }

  return config;
}

// Main
function main() {
  const params = parseArguments();

  const errors = validateParams(params);
  if (errors.length > 0) {
    console.error('❌ Erreur de validation:\n');
    errors.forEach((error) => console.error(`   • ${error}`));
    console.error('\n📖 Usage:');
    console.error('   node scripts/resolve-browserstack-config.js \\');
    console.error('     --os <os> \\');
    console.error('     --osVersion <version> \\');
    console.error('     --browser <browser> \\');
    console.error('     --browserVersion <version>');
    console.error('\n💡 Exemples:');
    console.error('   node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser chrome --browserVersion latest');
    console.error('   node scripts/resolve-browserstack-config.js --os Mac --osVersion 14 --browser safari --browserVersion latest');
    process.exit(1);
  }

  const config = resolveConfig(params);
  exportForGitHub(config);

  // Retourner la config en JSON pour parsing
  console.log(JSON.stringify(config));
  process.exit(0);
}

main();
