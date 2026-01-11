# Quick Reference Guide

Fast lookup for common commands, patterns, and configurations.

## Common Commands

### Local Testing
```bash
npm test                              # Run all tests
npm run test:ui                       # Run with UI
npm run test:headed                   # Run headed mode
npx playwright test [file]            # Run specific file
npx playwright test -g "[name]"       # Run by test name
npx playwright test --debug           # Debug mode
npm run test:report                   # View HTML report
```

### Test Suites
```bash
npm run test:creation                 # Account creation
npm run test:login                    # Login/logout
npm run test:catalog                  # Catalog navigation
npm run test:cart                     # Cart management
npm run test:order                    # Order checkout
```

### BrowserStack Local
```bash
# Set environment
export BROWSERSTACK_USERNAME="user"
export BROWSERSTACK_ACCESS_KEY="key"
export BS_OS="Windows"
export BS_OS_VERSION="11"
export BS_BROWSER="chrome"
export BS_BROWSER_VERSION="latest"

# Run tests
npm test -- --config=playwright.config.browserstack.js

# Validate config
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser chrome --browserVersion latest
```

## File Locations

### Configuration
| File | Purpose |
|------|---------|
| `playwright.config.js` | Local test config |
| `playwright.config.browserstack.js` | BrowserStack test config |
| `browserstack.config.js` | BrowserStack capabilities |
| `test-fixtures.js` | Custom Playwright fixtures |

### Tests
| Directory | Contents |
|-----------|----------|
| `tests/` | All test files (*.spec.js) |
| `utils/` | Shared helpers (helpers.js) |

### Scripts
| File | Purpose |
|------|---------|
| `scripts/resolve-browserstack-config.js` | Config validation |
| `scripts/upload-xray.ps1` | Xray upload |
| `scripts/jira-post-execution.ps1` | Jira enrichment |
| `scripts/get-browserstack-build-link.js` | BrowserStack URL |

### Documentation
| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `CLAUDE.md` | Claude Code guide |
| `DOCUMENTATION_INDEX.md` | Doc navigation |
| `DYNAMIC_EXECUTION_GUIDE.md` | GitHub Actions usage |
| `JIRA_AUTOMATION_SETUP.md` | Jira integration |

## Code Snippets

### New Test File
```javascript
const { test, expect } = require('../test-fixtures');
const { generateUserData } = require('../utils/helpers');

test.describe('Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/');
  });

  test('Test case', async ({ page }) => {
    const userData = generateUserData();
    // Test implementation
  });
});
```

### Helper Function
```javascript
async function helperName(page, param) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('[selector]');
  await page.click('[selector]');
  return result;
}
```

### BrowserStack Config
```javascript
{
  os: 'Windows',
  os_version: '11',
  browserName: 'chrome',
  browser_version: 'latest',
  'bstack:options': {
    buildName: process.env.BROWSERSTACK_BUILD_NAME,
    projectName: 'Tricentis Demo Web Shop',
    local: false
  }
}
```

## Environment Variables

### BrowserStack
```bash
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_key
BS_OS=Windows
BS_OS_VERSION=11
BS_BROWSER=chrome
BS_BROWSER_VERSION=latest
BS_DEVICE=                    # Optional for mobile
BS_WORKERS=5                  # Parallel workers
BS_RUN_IN_ORDER=true          # Sequential execution
```

### Jira/Xray
```bash
XRAY_CLIENT_ID=your_client_id
XRAY_CLIENT_SECRET=your_secret
JIRA_URL=https://your-domain.atlassian.net
JIRA_USER=your-email@example.com
JIRA_API_TOKEN=your_api_token
JIRA_CUSTOM_FIELD_OS=customfield_xxxxx
JIRA_CUSTOM_FIELD_OS_VERSION=customfield_xxxxx
JIRA_CUSTOM_FIELD_BROWSER=customfield_xxxxx
JIRA_CUSTOM_FIELD_BROWSER_VERSION=customfield_xxxxx
JIRA_CUSTOM_FIELD_TEST_SCOPE=customfield_xxxxx
```

## Selectors Reference

### Common Selectors
```javascript
// Login
'.ico-login'                          // Login link
'#Email'                              // Email input
'#Password'                           // Password input
'.login-button'                       // Login button
'.ico-logout'                         // Logout link

// Registration
'.ico-register'                       // Register link
'#gender-male'                        // Male radio
'#gender-female'                      // Female radio
'#FirstName'                          // First name
'#LastName'                           // Last name
'#Email'                              // Email
'#Password'                           // Password
'#ConfirmPassword'                    // Confirm password
'#register-button'                    // Register button

// Cart
'.ico-cart'                           // Cart link
'[name="removefromcart"]'             // Remove checkbox
'[name="updatecart"]'                 // Update button
'.cart-qty'                           // Cart quantity
'.shopping-cart .product'             // Cart items

// Checkout
'#termsofservice'                     // Terms checkbox
'#checkout'                           // Checkout button
```

## API Endpoints

### Xray Cloud
```
POST https://xray.cloud.getxray.app/api/v2/authenticate
POST https://xray.cloud.getxray.app/api/v2/import/execution/junit
```

### Jira REST API
```
GET    /rest/api/3/issue/{key}
PUT    /rest/api/3/issue/{key}
POST   /rest/api/3/issue/{key}/attachments
POST   /rest/api/3/issue/{key}/remotelink
```

### BrowserStack
```
GET https://api.browserstack.com/automate/builds.json
GET https://api.browserstack.com/automate/sessions/{sessionId}.json
```

## Troubleshooting Quick Fixes

### Tests Failing Locally
```bash
npx playwright install --force        # Reinstall browsers
rm -rf test-results playwright-report # Clear artifacts
npm ci                                # Reinstall dependencies
```

### BrowserStack Session Not Starting
```bash
# Check credentials
echo $BROWSERSTACK_USERNAME
echo $BROWSERSTACK_ACCESS_KEY

# Validate config
node scripts/resolve-browserstack-config.js --os Windows --osVersion 11 --browser chrome --browserVersion latest
```

### Xray Upload Failing
```bash
# Check authentication
curl -H "Content-Type: application/json" \
  -X POST -d '{"client_id":"xxx","client_secret":"xxx"}' \
  https://xray.cloud.getxray.app/api/v2/authenticate
```

### Jira API Errors
```bash
# Test authentication
curl -u email@example.com:api_token \
  https://your-domain.atlassian.net/rest/api/3/myself
```

## GitHub Actions Workflow

### Trigger Manually
1. GitHub → Actions → Playwright Tests → Run workflow
2. Select parameters (OS, Browser, Version, Scope)
3. Click Run workflow

### Trigger from Jira
```json
POST https://api.github.com/repos/owner/repo/actions/workflows/playwright.yml/dispatches
{
  "ref": "main",
  "inputs": {
    "os": "Windows",
    "os_version": "11",
    "browser": "chrome",
    "browser_version": "latest",
    "test_scope": "all"
  }
}
```

## Test Scope Options

| Scope | Tests Run |
|-------|-----------|
| `all` | All tests (01-05) |
| `sanity` | Smoke tests (99) |
| `account-creation` | Account tests (01) |
| `login-logout` | Auth tests (02) |
| `catalog-navigation` | Catalog tests (03) |
| `cart-management` | Cart tests (04) |
| `order-checkout` | Order tests (05) |

## Browser/OS Combinations

### Windows
| OS Version | Browsers |
|------------|----------|
| 11, 10, 8.1, 8, 7 | Chrome, Edge, Firefox |

### macOS
| OS Version | Browsers |
|------------|----------|
| Tahoe, Sequoia, Sonoma, Ventura, Monterey, Big Sur, Catalina | Chrome, Safari, Edge, Firefox |

## Helper Functions

```javascript
const {
  generateUserData,      // Create unique user data
  createAccount,         // Register new account
  login,                 // User login
  logout,                // User logout
  clearCart,             // Remove all cart items
  addProductToCart,      // Add product from category
  getCartItemCount,      // Get cart item count
  assertUrl             // BrowserStack-compatible URL assert
} = require('../utils/helpers');
```

## Git Workflow

```bash
# Check status
git status

# Create branch
git checkout -b feature/description

# Commit changes
git add .
git commit -m "feat: Description"

# Push changes
git push -u origin feature/description

# Create PR
gh pr create --title "Title" --body "Description"
```
