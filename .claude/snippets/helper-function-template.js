// Template for adding new helper function to utils/helpers.js

/**
 * [FUNCTION_DESCRIPTION]
 * @param {Page} page - Playwright page object
 * @param {string} [PARAM] - Description of parameter
 * @returns {Promise<[RETURN_TYPE]>} Description of return value
 */
async function [functionName](page, [params]) {
  // Wait for page to be ready
  await page.waitForLoadState('domcontentloaded');

  // Implementation with explicit waits
  await page.waitForSelector('[SELECTOR]', { state: 'visible' });

  // Perform actions
  await page.click('[SELECTOR]');

  // Return value if needed
  return [value];
}

// Export at bottom of helpers.js
module.exports = {
  // ... existing exports
  [functionName],
};

// Example usage in test:
// const { [functionName] } = require('../utils/helpers');
// await [functionName](page, [args]);
