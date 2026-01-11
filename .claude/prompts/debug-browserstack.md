# Prompt: Debug BrowserStack Issues

Use this template when debugging BrowserStack execution problems.

## Prompt Template

```
Debug BrowserStack test execution issue:

Problem: [DESCRIBE_THE_ISSUE]

Please investigate:

1. Validate BrowserStack configuration:
   - Check browserstack.config.js for correct capabilities
   - Verify environment variables (BS_OS, BS_BROWSER, etc.)
   - Run: node scripts/resolve-browserstack-config.js --os [OS] --osVersion [VERSION] --browser [BROWSER] --browserVersion [VERSION]

2. Check test compatibility:
   - Review test-fixtures.js integration
   - Verify browserstack-reporter.js configuration
   - Ensure tests use assertUrl() helper for mobile compatibility

3. Review workflow configuration:
   - Check .github/workflows/playwright.yml inputs
   - Verify secrets are properly configured
   - Review playwright.config.browserstack.js settings

4. Test locally if possible:
   - Set environment variables from .env.browserstack.example
   - Run: npm test -- --config=playwright.config.browserstack.js

Provide specific diagnostic steps and fixes.
```

## Common Issues

- Invalid OS/browser combinations → Check BROWSERSTACK_SUPPORT in resolve-browserstack-config.js
- Mobile device not recognized → Verify BS_DEVICE environment variable
- Session not starting → Check BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY
- Tests timing out → Review waitForSelector/waitForLoadState usage
