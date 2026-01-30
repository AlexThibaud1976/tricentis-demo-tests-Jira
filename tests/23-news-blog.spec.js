const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests du Blog/Actualités', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Consultation des actualités - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-281' },
      { type: 'tags', description: '@news @blog' },
      { type: 'test_description', description: 'Affichage de la page des actualités' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);

    // Find news section on homepage
    const newsBlock = page.locator('.news-list-homepage');
    const hasNews = await newsBlock.count() > 0;
    
    if (hasNews) {
      await expect(newsBlock).toBeVisible();
      await captureEvidence(page, testInfo, 'news-on-homepage');
    }

    // Navigate to news page
    await page.goto('https://demowebshop.tricentis.com/news');
    await wait(1000);

    await captureEvidence(page, testInfo, 'news-page');

    // Verify news page loaded
    const pageTitle = page.locator('h1').first();
    await expect(pageTitle).toContainText(/news/i);
    
    // Verify page body is visible
    const pageBody = page.locator('.page-body');
    await expect(pageBody).toBeVisible();
  });

  test('Lecture d\'un article - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-282' },
      { type: 'tags', description: '@news @article' },
      { type: 'test_description', description: 'Lecture complète d\'un article d\'actualité' }
    );

    await page.goto('https://demowebshop.tricentis.com/news');
    await wait(1000);

    // Click on first news item
    const newsItem = page.locator('.news-items .news-item a, .news-list a').first();
    const hasArticle = await newsItem.count() > 0;
    
    if (hasArticle) {
      await expect(newsItem).toBeVisible();
      await newsItem.click();
      await wait(1000);
      await captureEvidence(page, testInfo, 'news-article');

      // Verify article content is displayed
      const articleContent = page.locator('.news-body, .news-content');
      await expect(articleContent).toBeVisible();
      
      // Verify article title is visible
      const articleTitle = page.locator('.news-title, h1');
      await expect(articleTitle).toBeVisible();
    } else {
      // No articles available, just verify news page loaded
      const pageTitle = page.locator('h1').first();
      await expect(pageTitle).toBeVisible();
    }
  });
});
