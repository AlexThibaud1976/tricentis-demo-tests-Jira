# Custom Agents

This directory contains custom agents built with the Claude Agent SDK for specialized tasks in this project.

## What are Agents?

Agents are specialized AI assistants that can be invoked to handle specific, complex tasks autonomously. They have access to specific tools and can work in the background or interactively.

## Agent Types for This Project

### Test Analyzer Agent (Planned)
**Purpose**: Analyze test failures and suggest fixes
**Tools**: Read, Grep, Glob, Bash
**Usage**: Automatically triggered when tests fail in CI/CD

### BrowserStack Optimizer Agent (Planned)
**Purpose**: Optimize BrowserStack configuration and suggest device combinations
**Tools**: Read, WebFetch, Bash
**Usage**: Review and optimize device coverage

### Jira Integration Agent (Planned)
**Purpose**: Manage Jira/Xray integration and custom field updates
**Tools**: Read, Edit, Bash, WebFetch
**Usage**: Update Jira configuration and troubleshoot integration issues

## Creating a Custom Agent

### Structure
```javascript
// agents/my-agent/index.js
module.exports = {
  name: 'my-agent',
  description: 'What this agent does',
  tools: ['Read', 'Write', 'Bash'], // Available tools

  async execute(context) {
    // Agent logic here
    const { prompt, tools } = context;

    // Use tools
    const content = await tools.read('path/to/file');

    return {
      success: true,
      message: 'Agent completed successfully',
      data: {}
    };
  }
};
```

### Directory Structure
```
agents/
├── README.md                 # This file
├── test-analyzer/
│   ├── index.js             # Agent implementation
│   ├── config.json          # Agent configuration
│   └── prompts.md           # Agent-specific prompts
└── browserstack-optimizer/
    ├── index.js
    ├── config.json
    └── prompts.md
```

## Using Custom Agents

### From Claude Code CLI
```bash
# Invoke agent
claude-code agent run test-analyzer --prompt "Analyze failed tests"

# List available agents
claude-code agent list
```

### From Conversation
```
User: Analyze the test failures from the last CI run
Claude: [Automatically invokes test-analyzer agent]
```

## Best Practices

1. **Single Responsibility**: Each agent should have one clear purpose
2. **Tool Access**: Only request tools the agent actually needs
3. **Error Handling**: Always handle errors gracefully
4. **Documentation**: Document agent purpose, inputs, and outputs
5. **Testing**: Test agents in isolation before integrating

## Example: Test Analyzer Agent

### Purpose
Analyze test failures and provide actionable insights.

### Workflow
1. Read test results from CI artifacts
2. Parse failure messages and stack traces
3. Search codebase for related code
4. Identify common failure patterns
5. Suggest specific fixes

### Expected Output
```json
{
  "failures": 3,
  "patterns": [
    {
      "type": "selector_not_found",
      "count": 2,
      "suggestion": "Update selector in helpers.js:42"
    }
  ],
  "fixes": [
    {
      "file": "utils/helpers.js",
      "line": 42,
      "current": "'.old-selector'",
      "suggested": "'.new-selector'"
    }
  ]
}
```

## Resources

- [Claude Agent SDK Documentation](https://github.com/anthropics/claude-agent-sdk)
- [Agent Development Guide](https://docs.anthropic.com/claude/docs/agents)
- Project patterns: [../context/project-patterns.md](../context/project-patterns.md)
