const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testOrder: 'file',
  fullyParallel: false, // Tests séquentiels pour éviter les conflits
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 5, // Un seul worker pour éviter les conflits de données
  reporter: [
    ['html'],
    ['list'],
    ['@xray-app/playwright-junit-reporter', {
      outputFile: 'xray-report.xml',
      embedAnnotationsAsProperties: true,
      embedTestrunAnnotationsAsItemProperties: true,
      embedAttachmentsAsProperty: 'testrun_evidence',
      textContentAnnotations: ['test_description', 'testrun_comment'],
      // Ne pas inclure test_key pour éviter les erreurs avec des tests non existants dans Jira
      annotationsToExclude: ['test_key']
    }],
    // GitHub Actions reporter - affiche un résumé visuel dans le Job Summary
    ...(process.env.GITHUB_ACTIONS ? [['@estruyf/github-actions-reporter', { 
      title: '🎭 Playwright Test Results',
      useDetails: true,
      showError: true,
      showTags: true
    }]] : [])
  ],
  use: {
    baseURL: 'https://demowebshop.tricentis.com',
    trace: 'on-first-retry',
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    video: 'retain-on-failure',
    headless: false,
  },
  
  // Note: Pour ajouter des screenshots pleine page en cas d'échec,
  // utiliser testInfo.attach() dans un hook afterEach global

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  timeout: 60000,
  expect: {
    timeout: 10000
  },
});
