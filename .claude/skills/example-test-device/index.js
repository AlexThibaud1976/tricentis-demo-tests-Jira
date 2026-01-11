/**
 * Test Device Skill
 *
 * Executes Playwright tests on a specific BrowserStack device configuration.
 * Validates the configuration before running tests.
 *
 * Usage: /test-device <os> <osVersion> <browser> [browserVersion] [testScope]
 * Example: /test-device Windows 11 chrome latest all
 */

const { execSync } = require('child_process');
const path = require('path');

/**
 * Main skill execution function
 * @param {Object} context - Skill execution context
 * @param {string[]} context.args - Command arguments
 * @param {Object} context.tools - Available tools (Read, Bash, etc.)
 * @returns {Promise<Object>} Execution result
 */
module.exports = async function testDevice(context) {
  const { args, tools } = context;

  // Parse arguments
  const [os, osVersion, browser, browserVersion = 'latest', testScope = 'all'] = args;

  // Validate required arguments
  if (!os || !osVersion || !browser) {
    return {
      success: false,
      error: 'Missing required arguments',
      usage: '/test-device <os> <osVersion> <browser> [browserVersion] [testScope]',
      examples: [
        '/test-device Windows 11 chrome',
        '/test-device Mac Sonoma safari latest sanity'
      ]
    };
  }

  try {
    // Step 1: Validate BrowserStack configuration
    console.log(`\n🔍 Validating configuration...`);
    console.log(`   OS: ${os} ${osVersion}`);
    console.log(`   Browser: ${browser} ${browserVersion}`);
    console.log(`   Test Scope: ${testScope}`);

    const validationCommand = [
      'node',
      'scripts/resolve-browserstack-config.js',
      '--os', `"${os}"`,
      '--osVersion', `"${osVersion}"`,
      '--browser', `"${browser}"`,
      '--browserVersion', `"${browserVersion}"`
    ].join(' ');

    try {
      execSync(validationCommand, { encoding: 'utf8', stdio: 'pipe' });
      console.log('✅ Configuration valid\n');
    } catch (validationError) {
      return {
        success: false,
        error: 'Invalid BrowserStack configuration',
        details: validationError.stderr?.toString() || validationError.message,
        suggestion: 'Check BROWSERSTACK_VERSIONS.md for valid combinations'
      };
    }

    // Step 2: Check BrowserStack credentials
    if (!process.env.BROWSERSTACK_USERNAME || !process.env.BROWSERSTACK_ACCESS_KEY) {
      return {
        success: false,
        error: 'BrowserStack credentials not configured',
        details: 'Missing BROWSERSTACK_USERNAME or BROWSERSTACK_ACCESS_KEY',
        suggestion: 'Set environment variables or create .env.browserstack file'
      };
    }

    // Step 3: Map test scope to test pattern
    const scopePatterns = {
      'all': 'tests/0[1-5]-*.spec.js',
      'sanity': 'tests/99-sanity.spec.js',
      'account-creation': 'tests/01-account-creation.spec.js',
      'login-logout': 'tests/02-login-logout.spec.js',
      'catalog-navigation': 'tests/03-catalog-navigation.spec.js',
      'cart-management': 'tests/04-cart-management.spec.js',
      'order-checkout': 'tests/05-order-checkout.spec.js'
    };

    const testPattern = scopePatterns[testScope] || testScope;

    // Step 4: Run tests on BrowserStack
    console.log(`🚀 Starting test execution on BrowserStack...\n`);

    const testCommand = `npm test -- --config=playwright.config.browserstack.js ${testPattern}`;

    const env = {
      ...process.env,
      BS_OS: os,
      BS_OS_VERSION: osVersion,
      BS_BROWSER: browser,
      BS_BROWSER_VERSION: browserVersion,
      DEVICE_NAME: `${os} ${osVersion} ${browser} ${browserVersion}`,
      BROWSERSTACK_BUILD_NAME: `Tricentis Demo Tests - ${os} ${osVersion} ${browser}`
    };

    try {
      const testOutput = execSync(testCommand, {
        encoding: 'utf8',
        env,
        stdio: 'inherit' // Show output in real-time
      });

      console.log('\n✅ Tests completed successfully!');

      return {
        success: true,
        message: `Tests passed on ${os} ${osVersion} ${browser} ${browserVersion}`,
        device: `${os} ${osVersion}`,
        browser: `${browser} ${browserVersion}`,
        testScope: testScope,
        nextSteps: [
          'View HTML report: npm run test:report',
          'Check BrowserStack dashboard for session recordings'
        ]
      };

    } catch (testError) {
      console.error('\n❌ Tests failed');

      return {
        success: false,
        error: 'Test execution failed',
        device: `${os} ${osVersion}`,
        browser: `${browser} ${browserVersion}`,
        testScope: testScope,
        exitCode: testError.status,
        suggestions: [
          'Check test-results/ directory for detailed failure logs',
          'View HTML report: npm run test:report',
          'Review BrowserStack session for video and console logs'
        ]
      };
    }

  } catch (error) {
    return {
      success: false,
      error: 'Unexpected error during skill execution',
      details: error.message,
      stack: error.stack
    };
  }
};

// Allow running directly for testing
if (require.main === module) {
  const args = process.argv.slice(2);
  module.exports({ args, tools: {} })
    .then(result => {
      console.log('\n📊 Skill Result:', JSON.stringify(result, null, 2));
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Skill execution error:', error);
      process.exit(1);
    });
}
