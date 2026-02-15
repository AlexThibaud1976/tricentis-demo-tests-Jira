#!/usr/bin/env node

/**
 * Test de construction d'URL pour Confluence
 */

const { URL } = require('url');

console.log('=== Test de construction d\'URL Confluence ===\n');

const baseUrl = 'https://kisskool.atlassian.net/wiki';
const path = '/rest/api/content';

// Méthode actuelle (BUGGY)
console.log('❌ BUGGY - new URL(path, baseUrl) quand path commence par /');
const buggyUrl = new URL(path, baseUrl);
console.log('  Résultat:', buggyUrl.href);
console.log('  Attendu: ', baseUrl + '/rest/api/content');
console.log('  Status:  ', buggyUrl.href === 'https://kisskool.atlassian.net/rest/api/content' ? '❌ BUG' : '✅ OK');
console.log();

// Solution 1: Concaténation simple
console.log('✅ Solution 1 - baseUrl + path');
const solution1 = baseUrl + path;
console.log('  Résultat:', solution1);
console.log('  Status:  ', solution1 === 'https://kisskool.atlassian.net/wiki/rest/api/content' ? '✅ OK' : '❌ BUG');
console.log();

// Solution 2: Enlever le / du path
console.log('✅ Solution 2 - new URL(path sans /, baseUrl/)');
const pathWithoutSlash = path.substring(1); // Enlever le / du début
const baseUrlWithSlash = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
const solution2 = new URL(pathWithoutSlash, baseUrlWithSlash);
console.log('  Résultat:', solution2.href);
console.log('  Status:  ', solution2.href === 'https://kisskool.atlassian.net/wiki/rest/api/content' ? '✅ OK' : '❌ BUG');
console.log();

// Solution 3: URL complète directe
console.log('✅ Solution 3 - new URL(baseUrl + path)');
const solution3 = new URL(baseUrl + path);
console.log('  Résultat:', solution3.href);
console.log('  Status:  ', solution3.href === 'https://kisskool.atlassian.net/wiki/rest/api/content' ? '✅ OK' : '❌ BUG');
console.log();

console.log('=== Recommandation: utiliser Solution 1 ou 3 ===');
