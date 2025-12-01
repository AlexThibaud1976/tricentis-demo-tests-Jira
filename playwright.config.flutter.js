const { defineConfig, devices } = require('@playwright/test');

/**
 * Configuration Playwright pour tester l'application Flutter
 *
 * Cette configuration pointe vers l'application Flutter locale
 * et utilise des sélecteurs adaptés aux labels ARIA générés par Flutter
 */
module.exports = defineConfig({
  testDir: './tests-flutter',
  testOrder: 'file',
  fullyParallel: false, // Tests séquentiels pour éviter les conflits
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Un seul worker pour éviter les conflits de données
  reporter: [
    ['html', { outputFolder: 'playwright-report-flutter' }],
    ['list']
  ],
  use: {
    // URL de l'application Flutter (locale ou Docker)
    baseURL: process.env.FLUTTER_BASE_URL || 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false,
    // Timeout plus long pour Flutter Web qui peut être plus lent au démarrage
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  timeout: 90000, // 90 secondes pour Flutter Web
  expect: {
    timeout: 15000
  },

  // Serveur web pour l'application Flutter (optionnel)
  // Décommenter si vous voulez que Playwright lance Flutter
  // webServer: {
  //   command: 'cd demowebshop-flutter && flutter run -d web-server --web-port=8080',
  //   url: 'http://localhost:8080',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000, // 2 minutes pour le démarrage de Flutter
  // },
});
