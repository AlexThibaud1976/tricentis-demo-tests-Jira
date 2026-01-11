// BrowserStack configuration snippets

// Add new desktop browser configuration
{
  os: '[OS_NAME]',          // e.g., 'Windows', 'OS X'
  os_version: '[VERSION]',   // e.g., '11', 'Sonoma'
  browserName: '[BROWSER]',  // e.g., 'chrome', 'safari'
  browser_version: '[VER]',  // e.g., 'latest', '120.0'
  'bstack:options': {
    buildName: process.env.BROWSERSTACK_BUILD_NAME || 'Tricentis Demo Tests',
    projectName: 'Tricentis Demo Web Shop',
    sessionName: '[SESSION_NAME]',
    local: false,
    seleniumVersion: '4.25.0',
    consoleLogs: 'verbose'
  }
}

// Add new mobile device configuration
{
  'bstack:options': {
    osVersion: '[VERSION]',     // e.g., '17', '14.0'
    deviceName: '[DEVICE]',     // e.g., 'iPhone 15 Pro', 'Samsung Galaxy S23'
    realMobile: 'true',
    buildName: process.env.BROWSERSTACK_BUILD_NAME || 'Tricentis Demo Tests',
    projectName: 'Tricentis Demo Web Shop',
    local: false,
    consoleLogs: 'verbose'
  }
}

// Environment variables for testing
// BS_OS=Windows BS_OS_VERSION=11 BS_BROWSER=chrome BS_BROWSER_VERSION=latest npm test

// Validate configuration
// node scripts/resolve-browserstack-config.js --os [OS] --osVersion [VERSION] --browser [BROWSER] --browserVersion [VERSION]
