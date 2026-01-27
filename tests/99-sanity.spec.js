const { test, expect } = require('../test-fixtures');

test('sanity test', async ({ page }, testInfo) => {
  // Annotations Xray pour l'intégration Jira
  testInfo.annotations.push({ type: 'test_key', description: 'DEMO-105' });
  testInfo.annotations.push({ type: 'tags', description: 'sanity,smoke' });
  testInfo.annotations.push({ type: 'test_description', description: 'Test de sanité pour vérifier la détection Playwright et BrowserStack.' });
  
  // Simple test to verify Playwright detection
  await page.goto('/');
  expect(1 + 1).toBe(2);
});

test.afterEach(async ({ page }) => {
  if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
    try { await page.context().close(); } catch (e) {}
  }
});
