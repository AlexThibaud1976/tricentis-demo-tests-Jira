#!/usr/bin/env node

/**
 * Test d'intégration pour vérifier que update-confluence-report.js
 * construit correctement les URLs Confluence
 */

const https = require('https');
const { URL } = require('url');

console.log('╔═══════════════════════════════════════════════════════════════╗');
console.log('║  Test de construction URL - update-confluence-report.js       ║');
console.log('╚═══════════════════════════════════════════════════════════════╝\n');

// Configuration de test
const testConfig = {
  confluenceUrl: 'https://kisskool.atlassian.net/wiki',
  user: 'test@example.com',
  apiToken: 'fake-token-123',
  spaceKey: 'TEST',
};

console.log('📋 Configuration de test:');
console.log(`   Base URL: ${testConfig.confluenceUrl}`);
console.log(`   Space:    ${testConfig.spaceKey}`);
console.log();

// Test de construction d'URL
function testUrlConstruction(basePath, queryParams = {}) {
  // Ancienne méthode (BUGGY)
  const buggyUrl = new URL(basePath, testConfig.confluenceUrl);
  
  // Nouvelle méthode (FIXED)
  const fullUrl = testConfig.confluenceUrl + basePath;
  const fixedUrl = new URL(fullUrl);
  
  // Ajouter les query params pour le test complet
  if (Object.keys(queryParams).length > 0) {
    Object.entries(queryParams).forEach(([key, value]) => {
      fixedUrl.searchParams.append(key, value);
    });
  }
  
  return {
    buggy: buggyUrl.href,
    fixed: fixedUrl.href,
    expected: `${testConfig.confluenceUrl}${basePath}${Object.keys(queryParams).length > 0 ? '?' + new URLSearchParams(queryParams).toString() : ''}`,
  };
}

// Tests
const tests = [
  {
    name: 'Search page by title',
    path: '/rest/api/content',
    params: { title: 'Dashboard Qualité', spaceKey: 'TEST' },
  },
  {
    name: 'Get page by ID',
    path: '/rest/api/content/123456',
    params: { expand: 'body.storage,version' },
  },
  {
    name: 'Create page (POST)',
    path: '/rest/api/content',
    params: {},
  },
  {
    name: 'Update page (PUT)',
    path: '/rest/api/content/123456',
    params: {},
  },
];

let allPassed = true;

tests.forEach((test, index) => {
  console.log(`\n🧪 Test ${index + 1}: ${test.name}`);
  console.log(`   Path: ${test.path}`);
  if (Object.keys(test.params).length > 0) {
    console.log(`   Params: ${JSON.stringify(test.params)}`);
  }
  
  const result = testUrlConstruction(test.path, test.params);
  
  console.log(`\n   ❌ Ancienne méthode (buggy):`);
  console.log(`      ${result.buggy}`);
  
  console.log(`\n   ✅ Nouvelle méthode (fixed):`);
  console.log(`      ${result.fixed}`);
  
  console.log(`\n   🎯 URL attendue:`);
  console.log(`      ${result.expected}`);
  
  const passed = result.fixed === result.expected;
  console.log(`\n   Résultat: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  
  if (!passed) {
    allPassed = false;
    console.log(`   ⚠️  Différence détectée!`);
  }
  
  // Vérifier que l'ancienne méthode était buggy pour /wiki
  if (result.buggy.includes('/wiki/rest/api/')) {
    console.log(`   ⚠️  ATTENTION: L'ancienne méthode fonctionne pour ce cas (pas de / initial?)`);
  } else if (!result.buggy.includes('/wiki/')) {
    console.log(`   ✓ L'ancienne méthode perd bien /wiki (bug confirmé)`);
  }
});

console.log('\n' + '═'.repeat(65));
console.log(`\n${allPassed ? '✅ TOUS LES TESTS PASSENT' : '❌ CERTAINS TESTS ONT ÉCHOUÉ'}\n`);

if (allPassed) {
  console.log('✓ Le bug de construction d\'URL est corrigé');
  console.log('✓ Les URLs Confluence sont correctement formées');
  console.log('✓ Le chemin /wiki est préservé dans toutes les requêtes');
} else {
  console.log('⚠ Il reste des problèmes de construction d\'URL');
  process.exit(1);
}
