# .claude Directory Overview

Complete Claude Code configuration for Tricentis Demo Tests project.

## 📊 Statistics

- **Total Files**: 23
- **Total Directories**: 8
- **Version**: 2.0.0
- **Last Updated**: 2026-02-02

## 🎯 Purpose

This directory optimizes Claude Code interactions for this Playwright/BrowserStack test automation project by providing:
- Project-specific context and patterns
- Reusable prompts and code templates
- Step-by-step workflows
- Custom skills and agents (SDK)

## 📁 Directory Structure

```
.claude/
│
├── 🏠 Navigation & Config (4 files)
│   ├── INDEX.md              ← Start here!
│   ├── OVERVIEW.md           ← This file
│   ├── QUICK_START.md        ← Fast track guide
│   ├── STRUCTURE.md          ← Detailed structure
│   ├── README.md             ← Directory purpose
│   └── settings.local.json   ← Local settings
│
├── 💬 Prompts (3 files)
│   ├── add-new-test.md
│   ├── debug-browserstack.md
│   └── update-jira-integration.md
│
├── 📝 Snippets (3 files)
│   ├── test-template.js
│   ├── helper-function-template.js
│   └── browserstack-config-snippet.js
│
├── 🔄 Workflows (3 files)
│   ├── local-development.md
│   ├── github-actions.md
│   └── adding-browserstack-device.md
│
├── 📚 Context (4 files)
│   ├── project-patterns.md
│   ├── architecture.md
│   ├── quick-reference.md
│   └── common-tasks.md
│
├── 🤖 Agents (1 file + expandable)
│   └── README.md
│       └── Future: Test Analyzer, BrowserStack Optimizer, Jira Manager
│
└── ⚡ Skills (4 files)
    ├── README.md
    └── example-test-device/
        ├── skill.json
        ├── index.js
        └── README.md
```

## 🚀 Quick Access

### For First-Time Users
1. 📖 [QUICK_START.md](QUICK_START.md) - Fast track introduction
2. 📑 [INDEX.md](INDEX.md) - Complete navigation
3. 🏗️ [context/architecture.md](context/architecture.md) - System overview

### For Development Work
1. 📝 [snippets/](snippets/) - Code templates
2. 🔄 [workflows/local-development.md](workflows/local-development.md) - Dev cycle
3. 📚 [context/project-patterns.md](context/project-patterns.md) - Conventions

### For Quick Reference
1. ⚡ [context/quick-reference.md](context/quick-reference.md) - Commands cheat sheet
2. 📋 [context/common-tasks.md](context/common-tasks.md) - How-to guides
3. 🎯 [prompts/](prompts/) - Task templates

## 🎨 What's Inside?

### 1. Navigation Files (Root)
| File | Purpose | Size |
|------|---------|------|
| [INDEX.md](INDEX.md) | Main entry point | Comprehensive |
| [OVERVIEW.md](OVERVIEW.md) | This file | Quick summary |
| [QUICK_START.md](QUICK_START.md) | Fast introduction | Minimal |
| [STRUCTURE.md](STRUCTURE.md) | Detailed structure | Reference |
| [README.md](README.md) | Directory purpose | Overview |

### 2. Prompts (3 templates)
Ready-to-use request templates:
- **add-new-test.md**: Adding new test files
- **debug-browserstack.md**: Debugging BrowserStack issues
- **update-jira-integration.md**: Modifying Jira/Xray integration

### 3. Snippets (3 templates)
Code starting points:
- **test-template.js**: Playwright test structure
- **helper-function-template.js**: Helper function pattern
- **browserstack-config-snippet.js**: BrowserStack configuration

### 4. Workflows (3 guides)
Step-by-step processes:
- **local-development.md**: Development cycle
- **github-actions.md**: CI/CD testing
- **adding-browserstack-device.md**: Device/browser support

### 5. Context (4 knowledge files)
Project expertise:
- **project-patterns.md**: Coding conventions & patterns
- **architecture.md**: System architecture & data flow
- **quick-reference.md**: Commands & configs cheat sheet
- **common-tasks.md**: Step-by-step task instructions

### 6. Agents (Expandable)
Custom autonomous agents:
- **README.md**: Agent development guide
- *Planned*: Test Analyzer, BrowserStack Optimizer, Jira Manager

### 7. Skills (1 implemented + expandable)
Custom slash commands:
- **example-test-device/**: `/test-device` command (working example)
- *Planned*: `/analyze-failures`, `/generate-test`, `/device-coverage`

## 💡 Key Features

### ✅ For Claude Code
- Project-specific context and conventions
- Established patterns and best practices
- Common workflows and tasks
- Code templates and examples

### ✅ For Developers
- Quick reference guides
- Copy-paste code templates
- Step-by-step workflows
- Troubleshooting guides

### ✅ For Automation
- Custom skills (slash commands)
- Autonomous agents (planned)
- Reusable prompts
- Integrated workflows

## 🎯 Usage Patterns

### Scenario 1: Adding a New Test
```
1. Review: prompts/add-new-test.md
2. Copy: snippets/test-template.js
3. Follow: workflows/local-development.md
4. Reference: context/project-patterns.md
```

### Scenario 2: Debugging BrowserStack
```
1. Follow: prompts/debug-browserstack.md
2. Check: context/quick-reference.md (Troubleshooting)
3. Review: context/architecture.md (BrowserStack section)
```

### Scenario 3: Quick Test Run
```
Use skill: /test-device Windows 11 chrome
See: skills/example-test-device/README.md
```

### Scenario 4: Understanding the Project
```
1. Start: INDEX.md
2. Read: context/architecture.md
3. Review: context/project-patterns.md
4. Reference: context/quick-reference.md
```

## 📈 Expansion Roadmap

### Phase 1: Foundation ✅ (Complete)
- [x] Directory structure
- [x] Navigation files
- [x] Prompts, snippets, workflows
- [x] Context documentation
- [x] Example skill

### Phase 2: Skills (Planned)
- [ ] `/analyze-failures` - Test failure analysis
- [ ] `/generate-test` - Test generation
- [ ] `/device-coverage` - Coverage analysis
- [ ] `/update-jira` - Jira config updates

### Phase 3: Agents (Planned)
- [ ] Test Analyzer Agent - Autonomous failure analysis
- [ ] BrowserStack Optimizer Agent - Device optimization
- [ ] Jira Integration Agent - Configuration management

### Phase 4: Integration (Future)
- [ ] IDE integration shortcuts
- [ ] Automated skill discovery
- [ ] Agent orchestration
- [ ] Workflow automation

## 🔗 Integration Points

### With Main Project
- **CLAUDE.md**: High-level guidance (references this directory)
- **README.md**: Project overview (links to this directory)
- **DOCUMENTATION_INDEX.md**: Complete docs (includes this directory)

### With Development Workflow
- Local testing → Use skills and workflows
- CI/CD → Reference patterns and configs
- Troubleshooting → Use prompts and quick reference

### With Tools
- **Claude Code CLI**: Discovers skills automatically
- **VS Code**: Can use markdown links for navigation
- **GitHub**: Documentation accessible in repo

## 📚 Related Resources

### Project Documentation
- [../CLAUDE.md](../CLAUDE.md) - Main Claude Code guidance
- [../README.md](../README.md) - Project README
- [../DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md) - Complete documentation index

### External Resources
- [Claude Code Documentation](https://claude.ai/code)
- [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk)
- [Playwright Documentation](https://playwright.dev)
- [BrowserStack Documentation](https://www.browserstack.com/docs)

## 🎓 Learning Path

### Beginner
1. Read [QUICK_START.md](QUICK_START.md)
2. Review [context/quick-reference.md](context/quick-reference.md)
3. Try example skill: `/test-device`

### Intermediate
1. Study [context/project-patterns.md](context/project-patterns.md)
2. Follow [workflows/local-development.md](workflows/local-development.md)
3. Use [prompts/](prompts/) and [snippets/](snippets/)

### Advanced
1. Understand [context/architecture.md](context/architecture.md)
2. Create custom skills ([skills/README.md](skills/README.md))
3. Develop agents ([agents/README.md](agents/README.md))

## 🤝 Contributing

### Adding Content
1. Choose appropriate directory (prompts/snippets/workflows/context/agents/skills)
2. Follow existing file patterns
3. Update [INDEX.md](INDEX.md) with links
4. Update this OVERVIEW.md if structure changes

### Maintenance
- Review quarterly for accuracy
- Update version numbers
- Test skills after changes
- Keep examples current

## 📞 Support

For questions or issues:
1. Check [INDEX.md](INDEX.md) for navigation
2. Review [context/quick-reference.md](context/quick-reference.md) for answers
3. See [context/common-tasks.md](context/common-tasks.md) for how-tos
4. Refer to main [CLAUDE.md](../CLAUDE.md) for project guidance

---

**Start Here**: [INDEX.md](INDEX.md) | **Quick Guide**: [QUICK_START.md](QUICK_START.md) | **Details**: [STRUCTURE.md](STRUCTURE.md)

**Version**: 2.1.0 | **Last Updated**: 2026-02-02 | **Status**: Complete ✅
