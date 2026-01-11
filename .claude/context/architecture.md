# Architecture Overview

High-level architecture of the test automation system.

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Trigger Sources                          │
├─────────────────────────────────────────────────────────────┤
│  • GitHub UI (Manual)                                        │
│  • Jira Automation (Webhook)                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  GitHub Actions Workflow                     │
│              (.github/workflows/playwright.yml)              │
├─────────────────────────────────────────────────────────────┤
│  1. Validate parameters (resolve-browserstack-config.js)     │
│  2. Setup environment (npm ci, install browsers)             │
│  3. Execute tests (Playwright + BrowserStack)                │
│  4. Generate reports (JUnit XML + HTML)                      │
│  5. Upload results (Xray)                                    │
│  6. Enrich Jira (jira-post-execution.ps1)                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
┌────────────┐ ┌──────────────┐ ┌──────────┐
│BrowserStack│ │  Xray Cloud  │ │   Jira   │
│  Automate  │ │              │ │          │
├────────────┤ ├──────────────┤ ├──────────┤
│• Test exec │ │• Test results│ │• Test    │
│• Videos    │ │• Traceability│ │  Exec    │
│• Logs      │ │              │ │• Fields  │
│• Sessions  │ │              │ │• Reports │
└────────────┘ └──────────────┘ └──────────┘
```

## Data Flow

### Test Execution Flow

```
User Input → GitHub Actions → BrowserStack → Results → Xray → Jira
   ↓              ↓                ↓            ↓        ↓      ↓
 Params      Validation        Remote Exec   JUnit   Upload  Enrich
                                              XML
```

### Configuration Resolution

```
Workflow Inputs (OS, Browser, Version, Scope)
         ↓
resolve-browserstack-config.js
         ↓
    Validation
         ↓
Environment Variables (BS_OS, BS_BROWSER, etc.)
         ↓
browserstack.config.js
         ↓
Playwright Config (browserstack)
         ↓
Test Execution
```

## Component Responsibilities

### Tests (`tests/`)
- **Purpose**: E2E test scenarios
- **Pattern**: Independent, sequential, data-isolated
- **Import**: `test-fixtures.js` for BrowserStack compatibility
- **Helpers**: `utils/helpers.js` for reusable functions

### Utilities (`utils/`)
- **helpers.js**: Shared test utilities
  - User data generation
  - Account creation/login/logout
  - Cart management
  - Custom assertions

### Configuration Files

#### Local Testing
- **playwright.config.js**: Chrome/Firefox local execution
- Settings: 1 worker, headed mode options, HTML reporter

#### BrowserStack Testing
- **playwright.config.browserstack.js**: BrowserStack execution
- **browserstack.config.js**: Capabilities and settings
- **test-fixtures.js**: Custom Playwright fixtures for BrowserStack
- **browserstack-reporter.js**: Test Observability reporter

### Scripts (`scripts/`)

#### Configuration Validation
- **resolve-browserstack-config.js**
  - Validates OS/browser/version combinations
  - Exports environment variables
  - Creates device name for reporting

#### Jira Integration
- **upload-xray.ps1**
  - Authenticates with Xray Cloud
  - Uploads JUnit XML results
  - Associates with Test Plan

- **jira-post-execution.ps1**
  - Updates Test Execution custom fields
  - Adds labels (device name, PASS/FAIL)
  - Updates title with emoji and device info
  - Attaches HTML report
  - Creates remote links (GitHub Actions, BrowserStack)

- **get-browserstack-build-link.js**
  - Fetches BrowserStack build URL
  - Uses BrowserStack API

### GitHub Actions (`.github/workflows/`)

#### playwright.yml
- **Triggers**: workflow_dispatch (manual + Jira webhook)
- **Inputs**: OS, OS Version, Browser, Browser Version, Test Scope
- **Steps**:
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies
  4. Validate BrowserStack config
  5. Run tests on BrowserStack
  6. Upload results to Xray
  7. Enrich Jira Test Execution
  8. Upload artifacts

## Integration Points

### BrowserStack Integration
```javascript
// test-fixtures.js extends Playwright test
const base = require('@playwright/test');
const cp = require('child_process');

exports.test = base.test.extend({
  page: async ({ page }, use) => {
    // BrowserStack session management
    await use(page);
    // Mark session pass/fail
  }
});
```

### Xray Integration
```powershell
# upload-xray.ps1
# 1. Get authentication token
$authResponse = Invoke-RestMethod -Uri "$xrayUrl/authenticate" ...

# 2. Upload JUnit XML
Invoke-RestMethod -Uri "$xrayUrl/import/execution/junit" ...
```

### Jira API Integration
```powershell
# jira-post-execution.ps1
# 1. Update custom fields
Invoke-RestMethod -Uri "$jiraUrl/issue/$testExecutionKey" -Method Put ...

# 2. Add labels
Invoke-RestMethod -Uri "$jiraUrl/issue/$testExecutionKey" -Method Put ...

# 3. Attach files
Invoke-RestMethod -Uri "$jiraUrl/issue/$testExecutionKey/attachments" ...

# 4. Create remote links
Invoke-RestMethod -Uri "$jiraUrl/issue/$testExecutionKey/remotelink" ...
```

## Environment Variables

### Required for BrowserStack
- `BROWSERSTACK_USERNAME`: BrowserStack account username
- `BROWSERSTACK_ACCESS_KEY`: BrowserStack access key
- `BS_OS`: Operating system (Windows, Mac)
- `BS_OS_VERSION`: OS version (11, Sonoma, etc.)
- `BS_BROWSER`: Browser name (chrome, safari, etc.)
- `BS_BROWSER_VERSION`: Browser version (latest, 120.0, etc.)

### Required for Jira/Xray
- `XRAY_CLIENT_ID`: Xray Cloud client ID
- `XRAY_CLIENT_SECRET`: Xray Cloud client secret
- `JIRA_URL`: Jira instance URL
- `JIRA_USER`: Jira user email
- `JIRA_API_TOKEN`: Jira API token
- `JIRA_CUSTOM_FIELD_*`: Custom field IDs

### Optional
- `BS_DEVICE`: Mobile device name
- `BS_WORKERS`: Number of parallel workers
- `BS_RUN_IN_ORDER`: Sequential execution flag
- `DEVICE_NAME`: Computed device name for reports
- `BROWSERSTACK_BUILD_NAME`: Custom build name

## Security Architecture

### Secrets Management
- All credentials stored in GitHub Secrets
- Never committed to repository
- Accessed only in GitHub Actions environment
- PowerShell scripts use environment variables

### API Authentication
```
Xray: OAuth 2.0 (client credentials)
Jira: Basic Auth (email + API token)
BrowserStack: HTTP Basic Auth (username + access key)
GitHub: PAT (Personal Access Token) for Jira webhooks
```

## Scalability Considerations

### Parallel Execution
- Local: Single worker (sequential)
- BrowserStack: Configurable workers (BS_WORKERS)
- Default: 5 parallel workers on BrowserStack

### Test Isolation
- Each test generates unique data
- No shared state between tests
- Can run tests in parallel without conflicts

### Resource Usage
- BrowserStack: Concurrent test limit based on plan
- GitHub Actions: 2000 minutes/month (free tier)
- Jira/Xray: API rate limits apply

## Monitoring and Observability

### Test Results
- **GitHub Actions**: Workflow logs and artifacts
- **BrowserStack**: Session recordings and logs
- **Xray**: Test execution history and traceability
- **Jira**: Test Execution issues with reports

### Debugging
1. GitHub Actions logs: Step-by-step execution
2. BrowserStack videos: Visual test replay
3. HTML reports: Local test results
4. Console logs: Verbose logging enabled

## Extension Points

### Adding New Test Suites
1. Create test file in `tests/`
2. Add test scope to workflow inputs
3. Update test pattern mapping

### Adding New Integrations
1. Create script in `scripts/`
2. Add to workflow steps
3. Configure secrets if needed
4. Update documentation

### Custom Reporters
1. Extend Playwright reporter interface
2. Add to playwright.config.js
3. Configure in workflow
