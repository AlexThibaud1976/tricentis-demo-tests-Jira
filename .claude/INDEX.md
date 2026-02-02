# Claude Configuration Index

Quick navigation for all Claude-specific resources in this directory.

## Overview

This `.claude` directory provides Claude Code with project-specific context, patterns, and workflows to work more effectively on this Playwright/BrowserStack test automation project.

## Directory Contents

### 📁 Prompts (`prompts/`)
Reusable prompt templates for common tasks:

- [add-new-test.md](prompts/add-new-test.md) - Template for adding new test files
- [debug-browserstack.md](prompts/debug-browserstack.md) - Debug BrowserStack issues
- [update-jira-integration.md](prompts/update-jira-integration.md) - Modify Jira/Xray integration

### 📁 Snippets (`snippets/`)
Code templates and examples:

- [test-template.js](snippets/test-template.js) - Playwright test file template
- [helper-function-template.js](snippets/helper-function-template.js) - Helper function template
- [browserstack-config-snippet.js](snippets/browserstack-config-snippet.js) - BrowserStack config examples

### 📁 Workflows (`workflows/`)
Step-by-step guides for common workflows:

- [local-development.md](workflows/local-development.md) - Local development cycle
- [github-actions.md](workflows/github-actions.md) - GitHub Actions testing workflow
- [adding-browserstack-device.md](workflows/adding-browserstack-device.md) - Add new OS/browser support

### 📁 Context (`context/`)
Project-specific patterns and architecture:

- [project-patterns.md](context/project-patterns.md) - Core patterns and conventions
- [architecture.md](context/architecture.md) - System architecture overview
- [quick-reference.md](context/quick-reference.md) - Quick lookup for commands and configs
- [common-tasks.md](context/common-tasks.md) - Step-by-step task instructions

### 📁 Agents (`agents/`)

Custom agents built with Claude Agent SDK:

- [README.md](agents/README.md) - Agent development guide and examples
- Future agents for test analysis, BrowserStack optimization, and Jira integration

### 📁 Skills (`skills/`)

Custom skills (slash commands) for quick workflows:

- [README.md](skills/README.md) - Skills development guide
- [example-test-device/](skills/example-test-device/) - Example skill: Run tests on specific device

## How to Use This Directory

### For Claude Code
These files help Claude understand:
- Project structure and patterns
- Common workflows and tasks
- Best practices and conventions
- Configuration requirements

### For Developers
Use these resources to:
- Get started quickly with common tasks
- Find code templates and examples
- Understand project architecture
- Debug issues efficiently

## Quick Start

### I want to...

#### Add a new test
→ See [prompts/add-new-test.md](prompts/add-new-test.md)
→ Use [snippets/test-template.js](snippets/test-template.js)
→ Follow [workflows/local-development.md](workflows/local-development.md)

#### Debug a test failure
→ See [prompts/debug-browserstack.md](prompts/debug-browserstack.md)
→ Check [context/quick-reference.md](context/quick-reference.md) for commands
→ Review [context/common-tasks.md](context/common-tasks.md) Task 2

#### Add BrowserStack support
→ See [workflows/adding-browserstack-device.md](workflows/adding-browserstack-device.md)
→ Use [snippets/browserstack-config-snippet.js](snippets/browserstack-config-snippet.js)
→ Check [context/project-patterns.md](context/project-patterns.md)

#### Update Jira integration
→ See [prompts/update-jira-integration.md](prompts/update-jira-integration.md)
→ Follow [context/common-tasks.md](context/common-tasks.md) Task 4
→ Review [context/architecture.md](context/architecture.md)

#### Understand the architecture
→ See [context/architecture.md](context/architecture.md)
→ Check [context/project-patterns.md](context/project-patterns.md)
→ Review main [CLAUDE.md](../CLAUDE.md)

#### Find a command quickly

→ See [context/quick-reference.md](context/quick-reference.md)

#### Run tests on specific device

→ Use skill: `/test-device Windows 11 chrome`
→ See [skills/example-test-device/](skills/example-test-device/)
→ Check [skills/README.md](skills/README.md) for more skills

## Related Documentation

For comprehensive project documentation, see:
- [../CLAUDE.md](../CLAUDE.md) - Main Claude Code guidance
- [../README.md](../README.md) - Project overview
- [../DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md) - Complete doc navigation

## Maintaining This Directory

### Adding New Content
1. Create file in appropriate subdirectory
2. Use markdown format
3. Add link to this INDEX.md
4. Keep content focused and actionable

### Organization Principles
- **Prompts**: Templates for asking Claude to do something
- **Snippets**: Code examples and templates
- **Workflows**: Multi-step processes
- **Context**: Background information and patterns
- **Agents**: Custom autonomous agents for complex tasks
- **Skills**: Slash commands for quick workflows

## Structure Summary

```
.claude/
├── INDEX.md                          # This file
├── README.md                         # Directory overview
├── prompts/                          # Prompt templates
│   ├── add-new-test.md
│   ├── debug-browserstack.md
│   └── update-jira-integration.md
├── snippets/                         # Code templates
│   ├── test-template.js
│   ├── helper-function-template.js
│   └── browserstack-config-snippet.js
├── workflows/                        # Process guides
│   ├── local-development.md
│   ├── github-actions.md
│   └── adding-browserstack-device.md
├── context/                          # Project context
│   ├── project-patterns.md
│   ├── architecture.md
│   ├── quick-reference.md
│   └── common-tasks.md
├── agents/                           # Custom agents
│   └── README.md
└── skills/                           # Custom skills
    ├── README.md
    └── example-test-device/          # Example skill
        ├── skill.json
        ├── index.js
        └── README.md
```

---

**Last Updated**: 2026-02-02
**Version**: 2.0.0
