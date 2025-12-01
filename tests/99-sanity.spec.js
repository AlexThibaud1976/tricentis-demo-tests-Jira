const { test, expect } = require('../test-fixtures');

test('sanity test', async ({ page }) => {
  // Simple test to verify Playwright detection
  await page.goto('/');
  expect(1 + 1).toBe(2);
});

test.afterEach(async ({ page }) => {
  if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
    try { await page.context().close(); } catch (e) {}
  }
});
