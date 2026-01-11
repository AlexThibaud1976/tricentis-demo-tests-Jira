# Workflow: GitHub Actions Testing

How to trigger and manage test execution via GitHub Actions.

## Manual Trigger (GitHub UI)

1. Go to repository → Actions tab
2. Select "Playwright Tests" workflow
3. Click "Run workflow" button
4. Fill in parameters:
   - **OS**: Windows, Mac
   - **OS Version**: Specific version for selected OS
   - **Browser**: chrome, chromium, firefox, safari, edge
   - **Browser Version**: latest or specific version
   - **Test Scope**: all, sanity, account-creation, login-logout, catalog-navigation, cart-management, order-checkout
5. Click "Run workflow"

## Trigger via Jira Automation

Jira can trigger tests automatically using webhook with GitHub PAT.

### Webhook Payload Example

```json
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

See [JIRA_AUTOMATION_SETUP.md](../../JIRA_AUTOMATION_SETUP.md) for complete configuration.

## Workflow Execution Flow

```
1. Trigger (Manual/Jira) → GitHub Actions
2. Validate Parameters → resolve-browserstack-config.js
3. Setup Environment → Install dependencies
4. Run Tests → BrowserStack execution
5. Generate Reports → JUnit XML + HTML
6. Upload to Xray → upload-xray.ps1
7. Enrich Jira → jira-post-execution.ps1
   - Update custom fields
   - Add labels
   - Attach report
   - Add remote links
```

## Monitoring Execution

### View Run Progress
1. GitHub → Actions tab
2. Click on running workflow
3. Expand job steps to see live logs

### Check BrowserStack
1. Login to BrowserStack Automate
2. Find build by name: "Tricentis Demo Tests - [Device]"
3. View session recordings and logs

### View Results in Jira
1. Test Execution created automatically
2. Custom fields populated (OS, Browser, Version, Scope)
3. Labels added (device name, PASS/FAIL)
4. HTML report attached
5. Links to GitHub Actions and BrowserStack

## Common Operations

### Re-run Failed Tests
1. Go to failed workflow run
2. Click "Re-run failed jobs"
3. Or modify parameters and run new workflow

### Test Specific Suite
```yaml
inputs:
  test_scope: "cart-management"  # Only run cart tests
```

### Test on Multiple Devices
Run workflow multiple times with different OS/browser combinations:
- Windows 11 + Chrome latest
- Windows 10 + Edge latest
- Mac Sonoma + Safari latest

## Troubleshooting

### Workflow Fails to Start
- Check GitHub secrets are configured
- Verify BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY
- Ensure Jira secrets are set (if using Jira integration)

### Invalid OS/Browser Combination
- Check BROWSERSTACK_SUPPORT in [resolve-browserstack-config.js](../../scripts/resolve-browserstack-config.js)
- See [BROWSERSTACK_VERSIONS.md](../../BROWSERSTACK_VERSIONS.md) for valid combinations

### Xray Upload Fails
- Verify XRAY_CLIENT_ID and XRAY_CLIENT_SECRET
- Check Test Plan key exists in Jira
- Ensure JUnit XML format is correct

### Jira Enrichment Fails
- Verify JIRA_URL, JIRA_USER, JIRA_API_TOKEN
- Check custom field IDs are correct
- Ensure Test Execution issue exists

## Security Notes

- Never commit secrets to repository
- Use GitHub encrypted secrets only
- Rotate API tokens periodically
- Review workflow permissions regularly
