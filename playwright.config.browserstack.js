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
    }]
  ],

  // Options communes à tous les tests
  use: {
    baseURL: 'https://demowebshop.tricentis.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // null pour obtenir un viewport plein écran (1920x1080 par défaut sur BrowserStack)
    viewport: null,
  },
  
  // Note: Les screenshots automatiques sont complétés par une capture pleine page
  // dans browserstack-fixtures.js en cas d'échec

  timeout: bsConfig.timeout,
  expect: {
    timeout: 10000,
  },
});