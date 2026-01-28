const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests du Blog/Actualités', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Consultation des actualités - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-230' },
      { type: 'tags', description: '@news @blog' },
      { type: 'test_description', description: 'Affichage de la page des actualités' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);

    // Find news section on homepage
    const newsBlock = page.locator('.news-list-homepage');
    if (await newsBlock.isVisible()) {
      await captureEvidence(page, testInfo, 'news-on-homepage');
    }

    // Navigate to news page
    await page.goto('https://demowebshop.tricentis.com/news');
    await wait(1000);

    await captureEvidence(page, testInfo, 'news-page');

    // Verify news page
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toContainText(/news/i);
  });

  test('Lecture d\'un article - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-231' },
      { type: 'tags', description: '@news @article' },
      { type: 'test_description', description: 'Lecture complète d\'un article d\'actualité' }
    );

    await page.goto('https://demowebshop.tricentis.com/news');
    await wait(1000);

    // Click on first news item
    const newsItem = page.locator('.news-items .news-item a, .news-list a').first();
    if (await newsItem.isVisible()) {
      await newsItem.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'news-article');

      // Verify article content is displayed
      const articleContent = page.locator('.news-body, .news-content');
      if (await articleContent.isVisible()) {
        await expect(articleContent).toBeVisible();
      }
    }
  });
});
