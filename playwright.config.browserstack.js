/**
 * Configuration Playwright pour BrowserStack
 * Utilise browserstack-fixtures.js pour créer une session par test
 */

const { defineConfig } = require('@playwright/test');
const bsConfig = require('./browserstack.config');

module.exports = defineConfig({
  testDir: './tests',
  testOrder: 'file',
  fullyParallel: !bsConfig.runInOrder,
  forbidOnly: !!process.env.CI,
  retries: bsConfig.retries,
  workers: bsConfig.workers,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results.json' }],
    ['./browserstack-reporter.js'],
    ['@xray-app/playwright-junit-reporter', {
      outputFile: 'xray-report.xml',
      embedAnnotationsAsProperties: true,
      embedTestrunAnnotationsAsItemProperties: true,
      embedAttachmentsAsProperty: 'testrun_evidence',
      textContentAnnotations: ['test_description', 'testrun_comment']
    }],
    // GitHub Actions reporter - affiche un résumé visuel dans le Job Summary
    ...(process.env.GITHUB_ACTIONS ? [['@estruyf/github-actions-reporter', { 
      title: '🎭 Playwright Test Results - BrowserStack',
      useDetails: true,
      showError: true,
      showTags: true
    }]] : [])
  ],

  // Options communes à tous les tests
  use: {
    baseURL: 'https://demowebshop.tricentis.com',
    trace: 'on-first-retry',
    // Screenshots en viewport uniquement pour éviter les timeouts sur BrowserStack
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // null pour obtenir un viewport plein écran (1920x1080 par défaut sur BrowserStack)
    viewport: null,
  },

  timeout: bsConfig.timeout,
  expect: {
    timeout: 10000,
  },
});