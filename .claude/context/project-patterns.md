# Project Patterns and Conventions

Core patterns used throughout this project. Follow these when making changes.

## Test Structure Patterns

### File Naming
- Format: `[NUMBER]-[kebab-case-name].spec.js`
- Sequential numbering: 01, 02, 03...
- Example: `05-order-checkout.spec.js`

### Test Organization
```javascript
const { test, expect } = require('../test-fixtures');
const { helper1, helper2 } = require('../utils/helpers');

test.describe('[Feature] Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Common setup
  });

  test('[Specific scenario]', async ({ page }) => {
    // Test implementation
  });
});
```

### Data Generation Pattern
```javascript
// ALWAYS generate unique data per test run
const userData = generateUserData();
// Returns: { email: 'test-[timestamp]@example.com', ... }

// NEVER hardcode test data
// ❌ const email = 'test@example.com';
// ✅ const email = userData.email;
```

## Playwright Patterns

### Waiting for Elements
```javascript
// ALWAYS use explicit waits
await page.waitForSelector('[selector]', { state: 'visible' });
await page.waitForLoadState('domcontentloaded');

// NEVER rely on implicit waits
// ❌ await page.click('[selector]');
// ✅ await page.waitForSelector('[selector]'); await page.click('[selector]');
```

### BrowserStack-Compatible Assertions
```javascript
// Use custom assertUrl helper for mobile compatibility
const { assertUrl } = require('../utils/helpers');
await assertUrl(page, expectedUrl, 5000);

// For desktop-only, standard assertion OK
await expect(page).toHaveURL(expectedUrl);
```

### Sequential Execution
```javascript
// Tests MUST run sequentially (workers: 1)
// Each test creates unique data
// No test dependencies, but avoid parallel conflicts
```

## Helper Function Patterns

### Structure
```javascript
/**
 * Clear description of what the function does
 * @param {Page} page - Playwright page object
 * @param {string} param - Parameter description
 * @returns {Promise<ReturnType>} Return value description
 */
async function helperName(page, param) {
  await page.waitForLoadState('domcontentloaded');
  // Implementation with explicit waits
  return value;
}
```

### Usage
```javascript
// Import specific helpers
const { login, logout, clearCart } = require('../utils/helpers');

// Use in test
await login(page, userData.email, userData.password);
```

## BrowserStack Integration Patterns

### Test Fixtures Import
```javascript
// ALWAYS use test-fixtures for BrowserStack compatibility
const { test, expect } = require('../test-fixtures');

// NEVER use base Playwright test
// ❌ const { test, expect } = require('@playwright/test');
```

### Environment Variables
```javascript
// Access via process.env
const buildName = process.env.BROWSERSTACK_BUILD_NAME;
const deviceName = process.env.DEVICE_NAME;

// Required vars for BrowserStack:
// - BROWSERSTACK_USERNAME
// - BROWSERSTACK_ACCESS_KEY
// - BS_OS, BS_OS_VERSION
// - BS_BROWSER, BS_BROWSER_VERSION
```

### Configuration Pattern
```javascript
// browserstack.config.js exports capabilities
module.exports = {
  capabilities: [/* ... */],
  buildName: process.env.BROWSERSTACK_BUILD_NAME,
  projectName: 'Tricentis Demo Web Shop'
};
```

## PowerShell Script Patterns

### Cross-Platform Compatibility
```powershell
# ALWAYS use PowerShell 7+ compatible syntax
# Use Invoke-RestMethod instead of curl
$response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body

# Use Invoke-WebRequest for downloads
Invoke-WebRequest -Uri $url -OutFile $file

# NEVER use platform-specific tools
# ❌ curl -X POST ...
# ✅ Invoke-RestMethod -Method Post ...
```

### Error Handling
```powershell
# Check for required environment variables
if (-not $env:VARIABLE_NAME) {
    Write-Error "VARIABLE_NAME is required"
    exit 1
}

# Use try/catch for API calls
try {
    $response = Invoke-RestMethod ...
} catch {
    Write-Error "Failed: $_"
    exit 1
}
```

## Git Commit Patterns

### Conventional Commits
- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `refactor: Refactor code structure`
- `test: Add new test case`
- `chore: Update dependencies`

### Examples
```bash
git commit -m "feat: Add support for Windows 12 in BrowserStack config"
git commit -m "fix: Resolve mobile device URL assertion timeout"
git commit -m "docs: Update BROWSERSTACK_VERSIONS.md with new devices"
git commit -m "test: Add product search test suite"
```

## Documentation Patterns

### File Naming
- `SCREAMING_SNAKE_CASE.md` for guides
- `kebab-case.md` for configuration files
- `README.md` for directory overview

### Structure
```markdown
# Title

Brief description of purpose.

## Section 1

Content with examples.

## Common Issues

Troubleshooting section.

## Related Documentation

Links to related files.
```

## Configuration File Patterns

### JavaScript Config Files
```javascript
// Use module.exports
module.exports = {
  key: value,
  nested: {
    property: value
  }
};

// Environment variable access
const value = process.env.ENV_VAR || 'default';

// Comments for complex logic
// Explanation of why this configuration exists
```

### YAML (GitHub Actions)
```yaml
name: Workflow Name

on:
  workflow_dispatch:
    inputs:
      # Clear descriptions
      parameter:
        description: 'What this parameter controls'
        required: true
        type: choice
        options:
          - option1
          - option2
```

## Anti-Patterns (Avoid)

### ❌ Hardcoded Test Data
```javascript
// WRONG
const email = 'test@example.com';
```

### ❌ Implicit Waits
```javascript
// WRONG
await page.click('[selector]'); // Might fail if not loaded
```

### ❌ Test Dependencies
```javascript
// WRONG
test('Login', ...); // Creates user
test('Cart', ...);  // Depends on user from previous test
```

### ❌ Platform-Specific Code
```powershell
# WRONG
curl -X POST ... # Won't work on Windows without curl.exe
```

### ✅ Correct Patterns
```javascript
// RIGHT
const userData = generateUserData();
await page.waitForSelector('[selector]');
// Each test creates its own data
// Use PowerShell cmdlets: Invoke-RestMethod
```
