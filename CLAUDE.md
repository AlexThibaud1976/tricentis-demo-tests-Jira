# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Automated E2E test suite for the Tricentis Demo Web Shop using Playwright. Tests can run locally or on BrowserStack with integrated Jira/Xray reporting via GitHub Actions.

## Common Commands

### Local Development
```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install

# Run all tests locally
npm test

# Run with UI (debug mode)
npm run test:ui
npm run test:headed

# Run specific test suite
npm run test:creation      # Account creation tests
npm run test:login         # Login/logout tests
npm run test:catalog       # Catalog navigation tests
npm run test:cart          # Cart management tests
npm run test:order         # Order checkout tests

# View HTML report
npm run test:report
```

### Running Single Tests
```bash
# Run specific test file
npx playwright test tests/01-account-creation.spec.js

# Run with debugging
npx playwright test tests/01-account-creation.spec.js --debug

# Run specific test by name (use grep)
npx playwright test -g "Création de compte utilisateur"
```

### BrowserStack Testing
```bash
# Test BrowserStack configuration locally
node scripts/resolve-browserstack-config.js \
  --os Windows \
  --osVersion 11 \
  --browser chrome \
  --browserVersion latest

# Validate BrowserStack config (PowerShell)
pwsh scripts/test-browserstack-config.ps1
```

## Architecture

### Test Execution Flow

1. **Manual GitHub Actions Trigger**: User triggers workflow via GitHub UI or Jira Automation
2. **Configuration Resolution**: `resolve-browserstack-config.js` validates OS/browser parameters
3. **Test Execution**: Tests run on BrowserStack using `playwright.config.browserstack.js`
4. **Result Upload**: JUnit XML results uploaded to Xray via `upload-xray.ps1`
5. **Post-Execution**: `jira-post-execution.ps1` enriches Jira Test Execution with:
   - Custom fields (OS, browser, version, test scope)
   - Labels (device name, PASS/FAIL)
   - HTML report attachment
   - Remote links to GitHub Actions and BrowserStack
6. **Confluence Report** (optional): `update-confluence-report.js` updates a Confluence dashboard page (toggle on/off via workflow input)

### Key Files

- **playwright.config.js**: Local test configuration (Chrome/Firefox)
- **playwright.config.browserstack.js**: BrowserStack test configuration
- **browserstack.config.js**: BrowserStack capabilities (desktop/mobile)
- **test-fixtures.js**: Custom Playwright fixtures for BrowserStack integration
- **browserstack-reporter.js**: Custom reporter for BrowserStack Test Observability

### Directory Structure

```
tests/
  01-account-creation.spec.js    # User registration tests
  02-login-logout.spec.js        # Authentication tests
  03-catalog-navigation.spec.js  # Product catalog navigation
  04-cart-management.spec.js     # Shopping cart operations
  05-order-checkout.spec.js      # Order placement tests
  99-sanity.spec.js              # Smoke tests

utils/
  helpers.js                     # Shared test utilities

scripts/
  resolve-browserstack-config.js # BrowserStack parameter validation
  jira-post-execution.ps1        # Jira Test Execution enrichment
  upload-xray.ps1                # Xray result upload
  get-browserstack-build-link.js # Fetch BrowserStack build URL
  update-confluence-report.js  # Confluence dashboard update (optional)
```

### Test Utilities (utils/helpers.js)

Core helper functions for test reusability:

- `generateUserData()`: Creates unique user data with timestamps
- `createAccount(page)`: Automated account creation
- `login(page, email, password)`: User authentication
- `logout(page)`: User logout
- `clearCart(page)`: Remove all items from cart
- `addProductToCart(page, categoryUrl, index)`: Add product to cart
- `getCartItemCount(page)`: Get current cart item count
- `assertUrl(page, expected, timeout)`: URL assertion compatible with BrowserStack mobile

### GitHub Actions Workflow

**File**: `.github/workflows/playwright.yml`

The workflow supports dynamic test execution with parameters:
- **OS**: Windows, Mac (select list)
- **OS Version**: Free text, validated dynamically via BrowserStack API
- **Browser**: chrome, chromium, firefox, safari, edge (select list)
- **Browser Version**: Free text, validated dynamically (use `latest`, `latest-1`, or specific version)
- **Test Scope**: all, sanity, account-creation, login-logout, catalog-navigation, cart-management, order-checkout (select list)

Triggered by:
- Manual dispatch (GitHub UI)
- Jira Automation (via webhook with GitHub PAT)

### BrowserStack Configuration

**File**: `browserstack.config.js`

Centralized configuration that supports:
- Desktop browsers (Windows/Mac)
- Mobile devices (via `BS_DEVICE` env var)
- Sequential or parallel execution (`BS_RUN_IN_ORDER`)
- Configurable workers (`BS_WORKERS`)

Environment variables:
- `BROWSERSTACK_USERNAME` / `BROWSERSTACK_ACCESS_KEY`: Authentication
- `BS_OS`, `BS_OS_VERSION`: Operating system
- `BS_BROWSER`, `BS_BROWSER_VERSION`: Browser
- `BS_DEVICE`: Mobile device name (optional)
- `BS_WORKERS`: Number of parallel workers (default: 5)
- `BS_RUN_IN_ORDER`: Sequential execution flag (default: true)

### Jira Integration

**Secrets Required**:
- `XRAY_CLIENT_ID` / `XRAY_CLIENT_SECRET`: Xray Cloud authentication
- `JIRA_URL` / `JIRA_USER` / `JIRA_API_TOKEN`: Jira API access
- `JIRA_CUSTOM_FIELD_OS`, `JIRA_CUSTOM_FIELD_OS_VERSION`: Custom field IDs
- `JIRA_CUSTOM_FIELD_BROWSER`, `JIRA_CUSTOM_FIELD_BROWSER_VERSION`: Custom field IDs
- `JIRA_CUSTOM_FIELD_TEST_SCOPE`: Test scope custom field ID

**Post-Execution Enrichment** (`jira-post-execution.ps1`):
1. Updates custom fields with test configuration
2. Adds labels for device name and test result (PASS/FAIL)
3. Updates Test Execution title with emoji (✅/❌) and device info
4. Attaches HTML report
5. Creates remote links to GitHub Actions and BrowserStack builds

## Important Implementation Notes

### Test Design Principles

1. **Test Isolation**: Each test is independent and generates unique data (timestamp-based emails)
2. **Sequential Execution**: Tests run with `workers: 1` to avoid data conflicts
3. **No Cleanup Required**: Tests create new accounts each run (demo site limitation)
4. **Explicit Waits**: Uses `waitForSelector` and `waitForLoadState` for stability
5. **BrowserStack Compatibility**: Custom `assertUrl()` helper for mobile device support

### BrowserStack-Specific Patterns

- Tests use `test-fixtures.js` which extends Playwright's base test with BrowserStack session management
- Import pattern: `const { test, expect } = require('../test-fixtures');`
- Viewport set to `null` for full-screen execution (1920x1080 on BrowserStack)
- Custom reporter `browserstack-reporter.js` handles Test Observability integration

### Configuration Validation

The `resolve-browserstack-config.js` script validates all BrowserStack parameters before test execution:
- **Dynamic validation**: OS and browser versions are validated against the BrowserStack API
- **Fallback cache**: If the API is unavailable, a local cache of known versions is used
- **Latest patterns**: `latest`, `latest-1`, `latest-2` are always accepted without API validation
- Exports environment variables (`BS_OS`, `BS_BROWSER`, etc.)
- Creates standardized device name (`DEVICE_NAME`) for reporting

### PowerShell Scripts

All PowerShell scripts (`.ps1`) require PowerShell 7+ for cross-platform compatibility:
- Use `Invoke-RestMethod` and `Invoke-WebRequest` instead of curl
- Compatible with Windows, Linux, and macOS
- Avoid using curl.exe or platform-specific tools

## Testing Strategy

- **Test Ordering**: Tests numbered sequentially (01, 02, 03...) and executed in file order
- **Data Generation**: Every test creates fresh data using timestamps to ensure uniqueness
- **Cart Management**: Cart is cleared between relevant tests using `clearCart()` helper
- **Authentication**: Tests create accounts via `createAccount()` or use `login()` helpers
- **Assertions**: Multiple assertion types (URL, text content, element visibility, count)

## Common Development Tasks

### Adding a New Test

1. Create test file in `tests/` directory with sequential numbering
2. Import test fixtures: `const { test, expect } = require('../test-fixtures');`
3. Import needed helpers: `const { generateUserData, login } = require('../utils/helpers');`
4. Add test scope to GitHub Actions workflow inputs (if needed)
5. Update test scope mapping in workflow (`Determine test pattern` step)

### Modifying BrowserStack Configuration

OS and browser versions are now validated dynamically via the BrowserStack API. No manual updates needed for new versions.

To test a configuration locally:
```bash
# Set credentials for API validation
export BROWSERSTACK_USERNAME=xxx
export BROWSERSTACK_ACCESS_KEY=xxx

# Test configuration
node scripts/resolve-browserstack-config.js \
  --os Windows --osVersion 11 \
  --browser chrome --browserVersion latest
```

To update the fallback cache (used when API is unavailable), edit `FALLBACK_VERSIONS` in `resolve-browserstack-config.js`.

### Adding Custom Jira Fields

1. Obtain custom field ID from Jira (format: `customfield_XXXXX`)
2. Add as GitHub secret: `JIRA_CUSTOM_FIELD_<NAME>`
3. Update `jira-post-execution.ps1` to populate the field
4. Reference in workflow environment variables

### Confluence Reporting (optional)

High-level test reporting can be published to Confluence via two complementary approaches:

1. **Xray/Jira macros** (manual setup in Confluence editor): real-time dashboards
2. **CI/CD script** (`scripts/update-confluence-report.js`): historical execution table, updated automatically after each run

The CI/CD approach is controlled by a **toggle** (`confluenceReport`) in the GitHub Actions workflow dispatch inputs. It is disabled by default.

**Required secrets** (for CI/CD approach): `CONFLUENCE_URL`, `CONFLUENCE_USER`, `CONFLUENCE_API_TOKEN`, `CONFLUENCE_SPACE_KEY`. Optional: `CONFLUENCE_PAGE_TITLE`, `CONFLUENCE_PARENT_PAGE_ID`.

See `CONFLUENCE_REPORTING_GUIDE.md` for complete setup instructions.

## Related Documentation

Comprehensive documentation available:
- `README.md`: Project overview and installation
- `DOCUMENTATION_INDEX.md`: Documentation navigation guide
- `DYNAMIC_EXECUTION_GUIDE.md`: GitHub Actions workflow usage
- `JIRA_AUTOMATION_SETUP.md`: Jira integration configuration
- `IMPLEMENTATION_CHECKLIST.md`: Complete setup guide
- `COPY_PASTE_EXAMPLES.md`: Ready-to-use configuration examples
- `CONFLUENCE_REPORTING_GUIDE.md`: Confluence reporting setup (macros + CI/CD)
