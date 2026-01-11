# Test Device Skill

Quick test execution on specific BrowserStack device configurations.

## Purpose

This skill allows you to quickly run tests on any BrowserStack device/browser combination without manually configuring environment variables or workflow triggers.

## Usage

```bash
/test-device <os> <osVersion> <browser> [browserVersion] [testScope]
```

## Parameters

| Parameter | Required | Description | Examples |
|-----------|----------|-------------|----------|
| `os` | Yes | Operating system | Windows, Mac |
| `osVersion` | Yes | OS version | 11, 10, Sonoma, Ventura |
| `browser` | Yes | Browser name | chrome, safari, edge, firefox |
| `browserVersion` | No | Browser version (default: latest) | latest, 120.0, 119.0 |
| `testScope` | No | Test scope (default: all) | all, sanity, cart-management |

## Examples

### Run all tests on Windows 11 with Chrome
```bash
/test-device Windows 11 chrome
```

### Run sanity tests on Mac Sonoma with Safari
```bash
/test-device Mac Sonoma safari latest sanity
```

### Run cart tests on Windows 10 with Edge 120.0
```bash
/test-device Windows 10 edge 120.0 cart-management
```

### Run specific test suite
```bash
/test-device Windows 11 chrome latest login-logout
```

## Test Scopes

| Scope | Tests Run | Files |
|-------|-----------|-------|
| `all` | All tests | 01-05 |
| `sanity` | Smoke tests | 99 |
| `account-creation` | Account tests | 01 |
| `login-logout` | Auth tests | 02 |
| `catalog-navigation` | Catalog tests | 03 |
| `cart-management` | Cart tests | 04 |
| `order-checkout` | Order tests | 05 |

## Prerequisites

### BrowserStack Credentials
Set environment variables:
```bash
export BROWSERSTACK_USERNAME="your_username"
export BROWSERSTACK_ACCESS_KEY="your_access_key"
```

Or create `.env.browserstack` file:
```bash
BROWSERSTACK_USERNAME=your_username
BROWSERSTACK_ACCESS_KEY=your_access_key
```

### Dependencies
Ensure all dependencies are installed:
```bash
npm ci
npx playwright install
```

## What It Does

1. **Validates Configuration**
   - Checks OS/browser/version combination is supported
   - Uses `scripts/resolve-browserstack-config.js`

2. **Verifies Credentials**
   - Ensures BrowserStack credentials are configured
   - Checks environment variables

3. **Maps Test Scope**
   - Converts test scope to file pattern
   - Validates scope is recognized

4. **Executes Tests**
   - Sets BrowserStack environment variables
   - Runs Playwright tests on BrowserStack
   - Shows real-time output

5. **Reports Results**
   - Success: Shows summary and next steps
   - Failure: Shows error details and suggestions

## Output

### Success
```
🔍 Validating configuration...
   OS: Windows 11
   Browser: chrome latest
   Test Scope: all
✅ Configuration valid

🚀 Starting test execution on BrowserStack...

Running 5 tests...
✓ Account creation [15.2s]
✓ User login [8.3s]
✓ Catalog navigation [12.1s]
✓ Cart management [18.7s]
✓ Order checkout [22.4s]

✅ Tests completed successfully!

📊 Skill Result: {
  "success": true,
  "message": "Tests passed on Windows 11 chrome latest",
  "device": "Windows 11",
  "browser": "chrome latest",
  "testScope": "all",
  "nextSteps": [
    "View HTML report: npm run test:report",
    "Check BrowserStack dashboard for session recordings"
  ]
}
```

### Failure (Invalid Configuration)
```
🔍 Validating configuration...
   OS: Windows 11
   Browser: safari latest
   Test Scope: all
❌ Configuration invalid

📊 Skill Result: {
  "success": false,
  "error": "Invalid BrowserStack configuration",
  "details": "Unsupported browser safari for Windows 11",
  "suggestion": "Check BROWSERSTACK_VERSIONS.md for valid combinations"
}
```

### Failure (Test Execution)
```
🔍 Validating configuration...
✅ Configuration valid

🚀 Starting test execution on BrowserStack...

Running 5 tests...
✓ Account creation [15.2s]
✗ User login [8.3s]
  - Timeout waiting for selector '.login-button'
✗ Catalog navigation [5.1s]

❌ Tests failed

📊 Skill Result: {
  "success": false,
  "error": "Test execution failed",
  "device": "Windows 11",
  "browser": "chrome latest",
  "testScope": "all",
  "exitCode": 1,
  "suggestions": [
    "Check test-results/ directory for detailed failure logs",
    "View HTML report: npm run test:report",
    "Review BrowserStack session for video and console logs"
  ]
}
```

## Testing the Skill

Run the skill directly from command line:

```bash
# Test validation
node .claude/skills/example-test-device/index.js Windows 11 chrome

# Test with all parameters
node .claude/skills/example-test-device/index.js Windows 11 chrome latest sanity

# Test error handling
node .claude/skills/example-test-device/index.js Windows 11 safari
```

## Troubleshooting

### "Missing required arguments"
**Cause**: Not enough parameters provided
**Fix**: Provide at least OS, OS version, and browser
```bash
/test-device Windows 11 chrome
```

### "Invalid BrowserStack configuration"
**Cause**: OS/browser combination not supported
**Fix**: Check [BROWSERSTACK_VERSIONS.md](../../../BROWSERSTACK_VERSIONS.md) for valid combinations

### "BrowserStack credentials not configured"
**Cause**: Environment variables not set
**Fix**: Set `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`

### Tests fail with selector timeouts
**Cause**: Elements not found on page
**Fix**: Check test-results/ for detailed logs, review BrowserStack video

## Integration with Workflows

This skill complements other workflows:

- **Local Development**: Quick device testing during development
- **GitHub Actions**: Manual workflow trigger does similar job remotely
- **Jira Integration**: Use before committing to verify changes

## Related Documentation

- [Adding BrowserStack Device](../../workflows/adding-browserstack-device.md)
- [BrowserStack Configuration](../../../browserstack.config.js)
- [Test Patterns](../../context/project-patterns.md)
- [Quick Reference](../../context/quick-reference.md)

## Future Enhancements

Potential improvements:
- [ ] Support for mobile devices (BS_DEVICE)
- [ ] Parallel execution across multiple devices
- [ ] Integration with Jira Test Execution creation
- [ ] Automatic retry on failure
- [ ] Test result comparison between devices
