# Prompt: Add New Test

Use this template when adding a new test to the suite.

## Prompt Template

```
Add a new test file for [TEST_DESCRIPTION] with the following requirements:

1. Create test file: tests/[NUMBER]-[NAME].spec.js
2. Test should verify: [SPECIFIC_FUNCTIONALITY]
3. Use helpers from utils/helpers.js where applicable
4. Follow existing test patterns for:
   - Data generation (timestamp-based uniqueness)
   - BrowserStack compatibility (test-fixtures import)
   - Sequential execution design
   - Explicit waits for stability

5. If this is a new test category, update:
   - GitHub Actions workflow (.github/workflows/playwright.yml)
   - Add test scope option to workflow inputs
   - Update test pattern mapping in workflow

Test should be compatible with both local execution and BrowserStack.
```

## Example

```
Add a new test file for product search functionality with the following requirements:

1. Create test file: tests/06-search.spec.js
2. Test should verify:
   - Search bar functionality
   - Search results display
   - No results handling
3. Use helpers from utils/helpers.js where applicable
4. Follow existing test patterns
```
