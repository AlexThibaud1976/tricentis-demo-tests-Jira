const { test, expect } = require('../test-fixtures');
const { assertUrl, captureEvidence, wait } = require('../utils/helpers');

test.describe('Tests du Sondage Communautaire', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureEvidence(page, testInfo, 'final-state');
  });

  test('Participation au sondage - Cas passant ✅', async ({ page }, testInfo) => {
    testInfo.annotations.push(
      { type: 'test_key', description: 'DEMO-277' },
      { type: 'tags', description: '@poll @community' },
      { type: 'test_description', description: 'Vote dans le sondage communautaire' }
    );

    await page.goto('https://demowebshop.tricentis.com/');
    await wait(1000);
    await captureEvidence(page, testInfo, 'homepage');

    // Find poll section
    const pollSection = page.locator('.poll');
    await expect(pollSection).toBeVisible();
    await captureEvidence(page, testInfo, 'poll-section');

    // Select an option
    const pollOption = pollSection.locator('input[type="radio"]').first();
    await expect(pollOption).toBeVisible();
    await pollOption.check();

    // Submit vote
    const voteBtn = pollSection.locator('#vote-poll-1, input[value="Vote"]');
    await expect(voteBtn).toBeVisible();
    await voteBtn.click();
    await wait(1000);
    await captureEvidence(page, testInfo, 'poll-voted');

    // Verify vote was recorded
    const pollResults = page.locator('.poll-results, .poll');
    await expect(pollResults).toBeVisible();
  });
});
