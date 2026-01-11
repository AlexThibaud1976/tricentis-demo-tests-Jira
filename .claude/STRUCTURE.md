# .claude Directory Structure

Complete reference for the `.claude` configuration directory.

## Visual Structure

```
.claude/
│
├── 📄 INDEX.md                          Main navigation and quick links
├── 📄 README.md                         Directory overview
├── 📄 STRUCTURE.md                      This file - structure reference
├── 📄 settings.local.json               Local Claude Code settings
│
├── 📁 prompts/                          Reusable prompt templates
│   ├── add-new-test.md                  Template for adding test files
│   ├── debug-browserstack.md            Debug BrowserStack issues
│   └── update-jira-integration.md       Modify Jira/Xray integration
│
├── 📁 snippets/                         Code templates and examples
│   ├── test-template.js                 Playwright test file template
│   ├── helper-function-template.js      Helper function structure
│   └── browserstack-config-snippet.js   BrowserStack config examples
│
├── 📁 workflows/                        Step-by-step process guides
│   ├── local-development.md             Development cycle workflow
│   ├── github-actions.md                CI/CD testing workflow
│   └── adding-browserstack-device.md    Add device/browser support
│
├── 📁 context/                          Project knowledge base
│   ├── project-patterns.md              Core patterns and conventions
│   ├── architecture.md                  System architecture overview
│   ├── quick-reference.md               Commands and config lookup
│   └── common-tasks.md                  Step-by-step task guides
│
├── 📁 agents/                           Custom autonomous agents
│   └── README.md                        Agent development guide
│       └── (Future agents will be added here)
│
└── 📁 skills/                           Custom slash commands
    ├── README.md                        Skills development guide
    └── example-test-device/             Example skill implementation
        ├── skill.json                   Skill metadata
        ├── index.js                     Skill logic
        └── README.md                    Skill documentation
```

## File Count Summary

| Category | Files | Purpose |
|----------|-------|---------|
| **Root** | 4 | Navigation and configuration |
| **Prompts** | 3 | Reusable prompt templates |
| **Snippets** | 3 | Code templates |
| **Workflows** | 3 | Process guides |
| **Context** | 4 | Project knowledge |
| **Agents** | 1 | Agent development (expandable) |
| **Skills** | 4 | Skill commands (1 example) |
| **TOTAL** | 22 files | Complete Claude Code setup |

## Directory Purposes

### 📄 Root Files

- **INDEX.md**: Main entry point with quick navigation
- **README.md**: Overview of directory purpose
- **STRUCTURE.md**: This file - detailed structure reference
- **settings.local.json**: Local Claude Code configuration

### 📁 prompts/

**Purpose**: Templates for asking Claude to perform specific tasks

**When to use**: Copy and customize prompts for common requests

**Examples**:
- Need to add a test? → Use `add-new-test.md`
- Test failing on BrowserStack? → Use `debug-browserstack.md`
- Update Jira integration? → Use `update-jira-integration.md`

### 📁 snippets/

**Purpose**: Reusable code templates

**When to use**: Starting point for new code

**Examples**:
- New test file → `test-template.js`
- New helper function → `helper-function-template.js`
- BrowserStack config → `browserstack-config-snippet.js`

### 📁 workflows/

**Purpose**: Multi-step process documentation

**When to use**: Following established workflows

**Examples**:
- Local development → `local-development.md`
- CI/CD testing → `github-actions.md`
- Add device support → `adding-browserstack-device.md`

### 📁 context/

**Purpose**: Project-specific knowledge and patterns

**When to use**: Understanding project conventions

**Examples**:
- Code patterns → `project-patterns.md`
- System design → `architecture.md`
- Quick commands → `quick-reference.md`
- How-to guides → `common-tasks.md`

### 📁 agents/

**Purpose**: Custom autonomous agents for complex tasks

**When to use**: Building specialized agents that work independently

**Planned agents**:
- Test Analyzer: Analyze failures and suggest fixes
- BrowserStack Optimizer: Optimize device coverage
- Jira Integration Manager: Manage Jira configuration

### 📁 skills/

**Purpose**: Custom slash commands for quick workflows

**When to use**: Creating reusable commands

**Example skills**:
- `/test-device`: Run tests on specific device (implemented)
- `/analyze-failures`: Analyze test failures (planned)
- `/generate-test`: Generate test from template (planned)

## Quick Navigation

### I need to...

| Task | Go to |
|------|-------|
| Understand overall structure | [INDEX.md](INDEX.md) |
| Add a new test | [prompts/add-new-test.md](prompts/add-new-test.md) |
| Debug BrowserStack | [prompts/debug-browserstack.md](prompts/debug-browserstack.md) |
| Get code template | [snippets/](snippets/) |
| Follow a workflow | [workflows/](workflows/) |
| Learn patterns | [context/project-patterns.md](context/project-patterns.md) |
| Find a command | [context/quick-reference.md](context/quick-reference.md) |
| Create an agent | [agents/README.md](agents/README.md) |
| Create a skill | [skills/README.md](skills/README.md) |
| Run test on device | Use `/test-device` skill |

## Usage Patterns

### For Claude Code

These files help Claude:
1. **Understand project context** (context/)
2. **Follow established patterns** (context/project-patterns.md)
3. **Execute common workflows** (workflows/)
4. **Generate appropriate code** (snippets/)
5. **Provide accurate guidance** (prompts/)

### For Developers

Use these resources to:
1. **Get started quickly** (INDEX.md → Quick Start)
2. **Find examples** (snippets/)
3. **Follow best practices** (context/project-patterns.md)
4. **Execute tasks** (workflows/)
5. **Automate workflows** (skills/)

## Maintenance

### Adding Content

1. **Prompt Template**
   - Create in `prompts/`
   - Add link to INDEX.md
   - Include usage examples

2. **Code Snippet**
   - Create in `snippets/`
   - Add comments explaining usage
   - Include in relevant workflow

3. **Workflow Guide**
   - Create in `workflows/`
   - Include step-by-step instructions
   - Link related prompts/snippets

4. **Context Document**
   - Create in `context/`
   - Focus on project-specific knowledge
   - Update INDEX.md

5. **Custom Agent**
   - Create subdirectory in `agents/`
   - Include config.json and implementation
   - Document in agents/README.md

6. **Custom Skill**
   - Create subdirectory in `skills/`
   - Include skill.json, index.js, README.md
   - Update skills/README.md

### Keeping It Current

- Update [INDEX.md](INDEX.md) when adding files
- Increment version number in INDEX.md
- Update this STRUCTURE.md if organization changes
- Review and update context/ files quarterly
- Test skills/agents after updates

## Related Documentation

For project-wide documentation:
- [../CLAUDE.md](../CLAUDE.md) - Main Claude Code guidance
- [../README.md](../README.md) - Project overview
- [../DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md) - Complete docs

---

**Last Updated**: 2026-01-11
**Version**: 2.0.0
**Total Files**: 22
**Total Directories**: 7
