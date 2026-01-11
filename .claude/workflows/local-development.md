# Workflow: Local Development

Standard workflow for developing and testing locally.

## Setup (First Time)

```bash
# 1. Install dependencies
npm ci

# 2. Install Playwright browsers
npx playwright install

# 3. Create local environment file (optional)
cp .env.example .env
```

## Development Cycle

### 1. Create New Test

```bash
# Create test file with sequential numbering
# Example: tests/06-new-feature.spec.js

# Use template from .claude/snippets/test-template.js
```

### 2. Run Tests Locally

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/06-new-feature.spec.js

# Run with UI for debugging
npm run test:ui

# Run in headed mode
npm run test:headed

# Run specific test by name
npx playwright test -g "test name"
```

### 3. Debug Failures

```bash
# Run with debugger
npx playwright test tests/06-new-feature.spec.js --debug

# View last test report
npm run test:report
```

### 4. Validate Changes

```bash
# Run affected test suite
npm run test:creation      # If account-related
npm run test:login         # If auth-related
npm run test:catalog       # If catalog-related
npm run test:cart          # If cart-related
npm run test:order         # If order-related

# Run all tests to ensure no regression
npm test
```

## Common Patterns

### Adding Helper Function

1. Edit [utils/helpers.js](utils/helpers.js)
2. Use template from `.claude/snippets/helper-function-template.js`
3. Export function at bottom of file
4. Import in test file: `const { newHelper } = require('../utils/helpers');`

### Testing BrowserStack Locally

```bash
# Set environment variables
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_key"
export BS_OS="Windows"
export BS_OS_VERSION="11"
export BS_BROWSER="chrome"
export BS_BROWSER_VERSION="latest"

# Run tests
npm test -- --config=playwright.config.browserstack.js
```

## Troubleshooting

### Tests Fail Locally But Pass in CI
- Check Playwright version: `npx playwright --version`
- Reinstall browsers: `npx playwright install --force`
- Clear test artifacts: `rm -rf test-results playwright-report`

### Selectors Not Working
- Use Playwright Inspector: `npx playwright test --debug`
- Check for timing issues: add `await page.waitForSelector('[selector]')`
- Verify element is visible: `await expect(page.locator('[selector]')).toBeVisible()`

### Cart Tests Failing
- Ensure cart is cleared: use `clearCart(page)` helper
- Check product availability on demo site
- Verify sequential execution (workers: 1)
