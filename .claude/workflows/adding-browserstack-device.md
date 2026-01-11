# Workflow: Adding BrowserStack Device/Browser Support

Step-by-step guide to add support for new OS/browser combinations.

## Overview

This workflow updates the configuration to support new devices, operating systems, or browser versions.

## Steps

### 1. Identify BrowserStack Capabilities

Check BrowserStack documentation for available capabilities:
- Desktop: https://www.browserstack.com/automate/capabilities
- Mobile: https://www.browserstack.com/app-automate/capabilities

Note the exact values for:
- `os` / `osVersion` (desktop)
- `deviceName` (mobile)
- `browserName` / `browser_version`

### 2. Update Configuration Validator

Edit [scripts/resolve-browserstack-config.js](../../scripts/resolve-browserstack-config.js):

```javascript
const BROWSERSTACK_SUPPORT = {
  'Windows': {
    versions: ['7', '8', '8.1', '10', '11'],  // Add new version
    browsers: {
      chrome: ['latest', '120.0', '119.0'],    // Add new browser version
      edge: ['latest', '120.0'],
      firefox: ['latest', '121.0']
    }
  },
  'Mac': {
    versions: ['Catalina', 'Big Sur', 'Monterey', 'Ventura', 'Sonoma', 'Sequoia', 'Tahoe'],
    browsers: {
      chrome: ['latest', '120.0'],
      safari: ['latest', '17.0', '16.0'],
      firefox: ['latest', '121.0'],
      edge: ['latest', '120.0']
    }
  }
};
```

### 3. Update GitHub Actions Workflow

Edit [.github/workflows/playwright.yml](../../.github/workflows/playwright.yml):

Add to workflow inputs:

```yaml
inputs:
  os:
    description: 'Operating System'
    required: true
    type: choice
    options:
      - Windows
      - Mac
      # Add new OS if needed

  os_version:
    description: 'OS Version'
    required: true
    type: choice
    options:
      # Windows versions
      - '7'
      - '8'
      - '8.1'
      - '10'
      - '11'
      # Add new Windows version

      # Mac versions
      - Catalina
      - 'Big Sur'
      - Monterey
      - Ventura
      - Sonoma
      - Sequoia
      - Tahoe
      # Add new Mac version

  browser_version:
    description: 'Browser Version'
    required: true
    type: choice
    options:
      - latest
      - '120.0'
      - '119.0'
      # Add new browser version
```

### 4. Update BrowserStack Config (Optional)

If adding mobile device support, edit [browserstack.config.js](../../browserstack.config.js):

```javascript
const mobileCapabilities = {
  'bstack:options': {
    osVersion: '17',              // iOS/Android version
    deviceName: 'iPhone 15 Pro',  // Device name
    realMobile: 'true',
    buildName: process.env.BROWSERSTACK_BUILD_NAME || 'Tricentis Demo Tests',
    projectName: 'Tricentis Demo Web Shop',
    local: false,
    consoleLogs: 'verbose'
  }
};
```

### 5. Test Configuration Locally

```bash
# Validate new configuration
node scripts/resolve-browserstack-config.js \
  --os Windows \
  --osVersion 11 \
  --browser chrome \
  --browserVersion latest

# Expected output:
# ✅ Configuration validated successfully
# Export these environment variables:
# export BS_OS="Windows"
# export BS_OS_VERSION="11"
# ...
```

### 6. Test Execution

```bash
# Set environment variables
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_key"
export BS_OS="Windows"
export BS_OS_VERSION="11"
export BS_BROWSER="chrome"
export BS_BROWSER_VERSION="latest"

# Run test
npm test -- --config=playwright.config.browserstack.js tests/99-sanity.spec.js
```

### 7. Update Documentation

Update the following files:
- [BROWSERSTACK_VERSIONS.md](../../BROWSERSTACK_VERSIONS.md) - Add to supported combinations
- [COPY_PASTE_EXAMPLES.md](../../COPY_PASTE_EXAMPLES.md) - Add example commands
- [CLAUDE.md](../../CLAUDE.md) - Update if workflow changed

### 8. Commit Changes

```bash
git add scripts/resolve-browserstack-config.js
git add .github/workflows/playwright.yml
git add browserstack.config.js  # If modified
git add BROWSERSTACK_VERSIONS.md
git commit -m "feat: Add support for [OS] [Version] with [Browser]"
git push
```

## Validation Checklist

- [ ] Configuration validator accepts new OS/browser combination
- [ ] GitHub Actions workflow includes new options
- [ ] Test executes successfully on BrowserStack
- [ ] Device name appears correctly in reports
- [ ] Jira Test Execution shows correct custom fields
- [ ] Documentation updated

## Common Issues

### Invalid OS/Browser Combination
**Error**: "Unsupported browser [X] for [OS] [Version]"
**Fix**: Verify browser is supported on this OS version in BrowserStack docs

### Mobile Device Not Found
**Error**: "Device [name] not found"
**Fix**: Check exact device name spelling in BrowserStack capabilities

### Browser Version Not Available
**Error**: "Browser version [X] not available"
**Fix**: Use 'latest' or check available versions in BrowserStack

## Example: Adding Windows 12 Support

```javascript
// 1. Update resolve-browserstack-config.js
'Windows': {
  versions: ['7', '8', '8.1', '10', '11', '12'],  // Added '12'
  browsers: {
    chrome: ['latest', '120.0'],
    edge: ['latest', '120.0']
  }
}

// 2. Update playwright.yml
os_version:
  options:
    - '12'  # Add to Windows versions list

// 3. Test
node scripts/resolve-browserstack-config.js --os Windows --osVersion 12 --browser chrome --browserVersion latest
```
