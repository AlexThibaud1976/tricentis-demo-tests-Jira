# Custom Skills

This directory contains custom skills (slash commands) for this project built with the Claude Agent SDK.

## What are Skills?

Skills are reusable commands that can be invoked with slash commands (e.g., `/test-device`, `/analyze-failures`). They provide quick access to common workflows.

## Available Skills

Currently, no custom skills are defined. Skills can be added here as needed.

## Potential Skills for This Project

### `/test-device` (Planned)
**Purpose**: Quick test execution on specific device
**Usage**: `/test-device Windows 11 chrome`
**What it does**:
- Validates device/browser combination
- Runs tests locally or on BrowserStack
- Shows results summary

### `/analyze-failures` (Planned)
**Purpose**: Analyze test failures and suggest fixes
**Usage**: `/analyze-failures`
**What it does**:
- Reads latest test results
- Identifies failure patterns
- Suggests code fixes
- Opens relevant files

### `/update-jira` (Planned)
**Purpose**: Update Jira configuration
**Usage**: `/update-jira add-field FIELD_NAME`
**What it does**:
- Adds new custom field to Jira integration
- Updates scripts and workflow
- Tests the integration

### `/device-coverage` (Planned)
**Purpose**: Analyze and optimize device coverage
**Usage**: `/device-coverage`
**What it does**:
- Lists current BrowserStack configurations
- Suggests missing device/browser combinations
- Shows usage statistics

### `/generate-test` (Planned)
**Purpose**: Generate new test from template
**Usage**: `/generate-test wishlist`
**What it does**:
- Creates test file with proper numbering
- Adds test structure from template
- Updates workflow if needed

## Creating a Custom Skill

### Structure
```javascript
// skills/test-device/skill.json
{
  "name": "test-device",
  "description": "Run tests on specific device",
  "version": "1.0.0",
  "author": "Your Name",
  "parameters": [
    {
      "name": "os",
      "description": "Operating system",
      "required": true,
      "type": "string"
    },
    {
      "name": "browser",
      "description": "Browser name",
      "required": true,
      "type": "string"
    }
  ]
}
```

```javascript
// skills/test-device/index.js
module.exports = async function testDevice(context) {
  const { args, tools } = context;
  const [os, osVersion, browser] = args;

  // Validate configuration
  const validation = await tools.bash(
    `node scripts/resolve-browserstack-config.js --os ${os} --osVersion ${osVersion} --browser ${browser}`
  );

  if (validation.exitCode !== 0) {
    return {
      success: false,
      error: 'Invalid device configuration',
      details: validation.stderr
    };
  }

  // Run tests
  const result = await tools.bash(
    `BS_OS=${os} BS_OS_VERSION=${osVersion} BS_BROWSER=${browser} npm test`
  );

  return {
    success: result.exitCode === 0,
    output: result.stdout,
    summary: `Tests ${result.exitCode === 0 ? 'passed' : 'failed'} on ${os} ${browser}`
  };
};
```

### Directory Structure
```
skills/
├── README.md                    # This file
├── test-device/
│   ├── skill.json              # Skill metadata
│   ├── index.js                # Skill implementation
│   └── README.md               # Skill documentation
└── analyze-failures/
    ├── skill.json
    ├── index.js
    └── README.md
```

## Using Custom Skills

### From Claude Code CLI
```bash
# Invoke skill
/test-device Windows 11 chrome

# List available skills
/help

# Get skill help
/test-device --help
```

### From Conversation
```
User: /test-device Windows 11 chrome
Claude: [Executes test-device skill]
Running tests on Windows 11 with Chrome...
✓ Tests passed (5/5)
```

## Skill vs Agent - When to Use What?

### Use a Skill when:
- Task is quick and focused (< 30 seconds)
- You want a simple slash command interface
- Task is frequently repeated
- Output is straightforward

**Example**: `/test-device`, `/generate-test`

### Use an Agent when:
- Task is complex and multi-step
- Requires analysis and decision-making
- May take several minutes
- Needs access to multiple tools
- Should run in background

**Example**: Analyzing test failures, optimizing configurations

## Best Practices

1. **Naming**: Use kebab-case (e.g., `test-device`, `analyze-failures`)
2. **Parameters**: Clear parameter names and descriptions
3. **Validation**: Always validate inputs before execution
4. **Feedback**: Provide clear progress and error messages
5. **Documentation**: Document usage, parameters, and examples
6. **Error Handling**: Gracefully handle all error cases
7. **Exit Codes**: Return proper success/failure indicators

## Example Skill Implementation

### Skill: `/test-device`

```javascript
// skills/test-device/index.js
const { execSync } = require('child_process');

module.exports = async function testDevice(context) {
  const { args, tools } = context;

  // Parse arguments
  const [os, osVersion, browser, browserVersion = 'latest'] = args;

  if (!os || !osVersion || !browser) {
    return {
      success: false,
      error: 'Usage: /test-device <os> <osVersion> <browser> [browserVersion]',
      example: '/test-device Windows 11 chrome latest'
    };
  }

  try {
    // Validate configuration
    console.log(`Validating configuration: ${os} ${osVersion} ${browser} ${browserVersion}...`);

    const validation = execSync(
      `node scripts/resolve-browserstack-config.js --os "${os}" --osVersion "${osVersion}" --browser "${browser}" --browserVersion "${browserVersion}"`,
      { encoding: 'utf8' }
    );

    console.log('✓ Configuration valid');

    // Run tests
    console.log('Running tests on BrowserStack...');

    const env = {
      ...process.env,
      BS_OS: os,
      BS_OS_VERSION: osVersion,
      BS_BROWSER: browser,
      BS_BROWSER_VERSION: browserVersion
    };

    const testResult = execSync(
      'npm test -- --config=playwright.config.browserstack.js',
      { encoding: 'utf8', env }
    );

    return {
      success: true,
      message: `Tests completed successfully on ${os} ${osVersion} ${browser} ${browserVersion}`,
      output: testResult
    };

  } catch (error) {
    return {
      success: false,
      error: 'Test execution failed',
      details: error.message,
      stderr: error.stderr?.toString()
    };
  }
};
```

## Registering Skills

Skills are automatically discovered from the `.claude/skills/` directory when they follow the proper structure:

1. Each skill in its own directory
2. `skill.json` with metadata
3. `index.js` with implementation
4. Optional `README.md` with documentation

## Testing Skills

```bash
# Test skill locally
node -e "
  const skill = require('./.claude/skills/test-device');
  skill({ args: ['Windows', '11', 'chrome'], tools: {} })
    .then(console.log)
    .catch(console.error);
"
```

## Resources

- [Claude Agent SDK Documentation](https://github.com/anthropics/claude-agent-sdk)
- [Skill Development Guide](https://docs.anthropic.com/claude/docs/skills)
- Project patterns: [../context/project-patterns.md](../context/project-patterns.md)
- Common tasks: [../context/common-tasks.md](../context/common-tasks.md)
