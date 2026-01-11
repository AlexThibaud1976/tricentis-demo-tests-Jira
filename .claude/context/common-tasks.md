# Common Tasks

Step-by-step instructions for frequently performed tasks.

## Task 1: Add a New Test

### Steps
1. Create new test file with sequential numbering
2. Follow test template structure
3. Import required fixtures and helpers
4. Implement test logic
5. Run locally to verify
6. Update workflow if new test category

### Example
```bash
# 1. Create file
touch tests/06-wishlist.spec.js

# 2. Use template from .claude/snippets/test-template.js
# Add test implementation

# 3. Run test locally
npx playwright test tests/06-wishlist.spec.js

# 4. If new category, update .github/workflows/playwright.yml
# Add "wishlist" to test_scope options
# Add pattern mapping in "Determine test pattern" step
```

## Task 2: Debug a Failing Test

### Local Debugging
```bash
# 1. Run test with debugger
npx playwright test tests/04-cart-management.spec.js --debug

# 2. Use Playwright Inspector
# - Step through test
# - Inspect selectors
# - View network requests

# 3. Check HTML report
npm run test:report
```

### BrowserStack Debugging
```bash
# 1. Check session on BrowserStack
# Login to BrowserStack → Automate → Find build → View session

# 2. Watch video recording
# Review timeline and console logs

# 3. Check GitHub Actions logs
# GitHub → Actions → Failed workflow → Review step logs

# 4. Download artifacts
# GitHub → Actions → Workflow run → Artifacts → Download HTML report
```

## Task 3: Update BrowserStack Configuration

### Add New Browser Version
```bash
# 1. Edit scripts/resolve-browserstack-config.js
# Add version to BROWSERSTACK_SUPPORT

# 2. Edit .github/workflows/playwright.yml
# Add version to browser_version options

# 3. Test locally
node scripts/resolve-browserstack-config.js \
  --os Windows \
  --osVersion 11 \
  --browser chrome \
  --browserVersion 121.0

# 4. Commit changes
git add scripts/resolve-browserstack-config.js .github/workflows/playwright.yml
git commit -m "feat: Add Chrome 121.0 support"
git push
```

### Add New Operating System
```bash
# 1. Edit scripts/resolve-browserstack-config.js
# Add OS to BROWSERSTACK_SUPPORT

# 2. Edit .github/workflows/playwright.yml
# Add OS and versions to workflow inputs

# 3. Update browserstack.config.js if needed
# Add specific capabilities

# 4. Test and commit
```

## Task 4: Add Custom Jira Field

### Steps
```bash
# 1. Get field ID from Jira
# Jira Settings → Issues → Custom fields → Find field → Note ID (customfield_XXXXX)

# 2. Add GitHub secret
# GitHub → Settings → Secrets → New repository secret
# Name: JIRA_CUSTOM_FIELD_[NAME]
# Value: customfield_XXXXX

# 3. Update scripts/jira-post-execution.ps1
# Add field to update payload:
```
```powershell
$customFields = @{
    $env:JIRA_CUSTOM_FIELD_NEW_FIELD = "value"
}
```

```bash
# 4. Update workflow environment variables
# Edit .github/workflows/playwright.yml
# Add to env section:
```
```yaml
JIRA_CUSTOM_FIELD_NEW_FIELD: ${{ secrets.JIRA_CUSTOM_FIELD_NEW_FIELD }}
```

```bash
# 5. Test and commit
git add .github/workflows/playwright.yml scripts/jira-post-execution.ps1
git commit -m "feat: Add new Jira custom field support"
```

## Task 5: Create New Helper Function

### Steps
```bash
# 1. Open utils/helpers.js
# 2. Add function with JSDoc comment
```
```javascript
/**
 * Add item to wishlist
 * @param {Page} page - Playwright page object
 * @param {string} productUrl - Product page URL
 * @returns {Promise<void>}
 */
async function addToWishlist(page, productUrl) {
  await page.goto(productUrl);
  await page.waitForSelector('.add-to-wishlist-button');
  await page.click('.add-to-wishlist-button');
  await page.waitForSelector('.bar-notification.success');
}
```

```bash
# 3. Export function
# Add to module.exports at bottom of file
```
```javascript
module.exports = {
  generateUserData,
  createAccount,
  login,
  logout,
  clearCart,
  addProductToCart,
  getCartItemCount,
  assertUrl,
  addToWishlist  // Add new function
};
```

```bash
# 4. Use in test
```
```javascript
const { addToWishlist } = require('../utils/helpers');

test('Add to wishlist', async ({ page }) => {
  await addToWishlist(page, 'https://demowebshop.tricentis.com/product');
});
```

## Task 6: Fix Merge Conflicts

### Steps
```bash
# 1. Pull latest changes
git checkout main
git pull origin main

# 2. Checkout your branch
git checkout feature/your-branch

# 3. Rebase on main
git rebase main

# 4. Resolve conflicts
# Edit conflicted files
# Look for <<<<<<< HEAD markers

# 5. Continue rebase
git add .
git rebase --continue

# 6. Force push (if already pushed)
git push --force-with-lease
```

## Task 7: Run Tests on Multiple Devices

### Using GitHub Actions
```bash
# 1. Trigger workflow for each device
# GitHub → Actions → Playwright Tests → Run workflow

# Device 1: Windows 11 + Chrome
os: Windows
os_version: 11
browser: chrome
browser_version: latest
test_scope: all

# Device 2: Mac Sonoma + Safari
os: Mac
os_version: Sonoma
browser: safari
browser_version: latest
test_scope: all

# Device 3: Windows 10 + Edge
os: Windows
os_version: 10
browser: edge
browser_version: latest
test_scope: all
```

### Using Local Script
```bash
# Create script: run-multiple-devices.sh
```
```bash
#!/bin/bash

devices=(
  "Windows 11 chrome latest"
  "Mac Sonoma safari latest"
  "Windows 10 edge latest"
)

for device in "${devices[@]}"; do
  read -r os os_version browser browser_version <<< "$device"

  export BS_OS="$os"
  export BS_OS_VERSION="$os_version"
  export BS_BROWSER="$browser"
  export BS_BROWSER_VERSION="$browser_version"

  npm test -- --config=playwright.config.browserstack.js
done
```

## Task 8: Update Test Data

### Modify User Data Generation
```javascript
// Edit utils/helpers.js → generateUserData()

function generateUserData() {
  const timestamp = Date.now();
  return {
    gender: 'male',
    firstName: `Test${timestamp}`,
    lastName: 'User',
    email: `test-${timestamp}@example.com`,
    password: 'Test@123',
    // Add new field
    phoneNumber: `555${timestamp.toString().slice(-7)}`
  };
}
```

### Update Tests to Use New Data
```javascript
test('Account creation with phone', async ({ page }) => {
  const userData = generateUserData();

  // Fill form including new field
  await page.fill('#Phone', userData.phoneNumber);
});
```

## Task 9: Analyze Test Results

### View HTML Report
```bash
# After local run
npm run test:report

# Navigate to specific test
# Click on test name → View trace → Step-by-step execution
```

### Check BrowserStack Results
```bash
# 1. Get build link from workflow
# GitHub → Actions → Workflow run → "Enrich Jira Test Execution" step
# Look for BrowserStack build URL

# 2. Or use script
export BROWSERSTACK_USERNAME="user"
export BROWSERSTACK_ACCESS_KEY="key"
export BROWSERSTACK_BUILD_NAME="Tricentis Demo Tests - Windows 11"

node scripts/get-browserstack-build-link.js

# 3. Open link in browser
# View sessions, videos, logs
```

### Review Jira Test Execution
```bash
# 1. Find Test Execution in Jira
# Jira → Project → Test Executions

# 2. Check custom fields
# OS, OS Version, Browser, Browser Version, Test Scope

# 3. Review labels
# Device name, PASS/FAIL status

# 4. Download HTML report
# Attachments section

# 5. Click remote links
# GitHub Actions run, BrowserStack build
```

## Task 10: Rollback Changes

### Revert Last Commit
```bash
# 1. View commit history
git log --oneline

# 2. Revert commit (creates new commit)
git revert HEAD

# 3. Push
git push
```

### Reset to Previous State
```bash
# 1. Find commit hash
git log --oneline

# 2. Reset (DANGEROUS - loses changes)
git reset --hard <commit-hash>

# 3. Force push (if needed)
git push --force
```

### Restore Single File
```bash
# 1. Restore from last commit
git checkout HEAD -- path/to/file

# 2. Restore from specific commit
git checkout <commit-hash> -- path/to/file

# 3. Commit restoration
git add path/to/file
git commit -m "fix: Restore file to working state"
```
