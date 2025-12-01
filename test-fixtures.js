const base = require('@playwright/test');
const bsFixtures = require('./browserstack-fixtures');

// Si BrowserStack est configuré, utiliser les fixtures BrowserStack
// Sinon, utiliser les fixtures Playwright par défaut
if (process.env.BROWSERSTACK_USERNAME && process.env.BROWSERSTACK_ACCESS_KEY) {
  module.exports = bsFixtures;
} else {
  module.exports = { test: base.test, expect: base.expect };
}
