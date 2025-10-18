# Agents.md - Rules of the Game

## Overview

Agentic Next Starter is an open-source Next.js template optimized for AI-assisted development. This document defines the rules and protocols for AI agents working with this codebase.

## Core Principles

### 1. Optional by Design

All agentic features are **optional**. Users configure their preferences during first run via the configuration script. AI agents must:

- **Respect** the `.agentic-config.json` configuration
- **Never** enable features without explicit user consent
- **Always** check configuration before suggesting feature usage
- **Provide** clear explanations when recommending features

### 2. Modularity First

Each feature is packaged as a standalone npm module:

- `@agentic-next/verify` - Health checking
- `@agentic-next/autokill` - Process management
- `@agentic-next/port-randomizer` - Port selection

**Rules:**
- Features must work independently
- No tight coupling between modules
- Each module has its own README and documentation
- Versioning follows semantic versioning

### 3. Developer Experience

Features exist to eliminate friction in development workflows:

- **Agent Verify**: Eliminates manual health checking
- **Autokill**: Eliminates terminal window hunting
- **Port Randomizer**: Eliminates port conflict resolution

**Rules:**
- Features should save time, not add complexity
- Verbose logging by default for transparency
- Clear error messages with actionable recommendations
- Zero configuration required (but configurable when needed)

## AI Agent Protocols

### Working with Configuration

When suggesting or implementing features, AI agents must:

1. **Check** if `.agentic-config.json` exists
2. **Read** the configuration to understand enabled features
3. **Respect** user preferences in all suggestions
4. **Explain** benefits before recommending new features

Example:

```javascript
const { existsSync, readFileSync } = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), '.agentic-config.json');

if (existsSync(configPath)) {
  const config = JSON.parse(readFileSync(configPath, 'utf8'));

  if (config.features.agentVerify) {
    // Suggest using agent-verify
  } else {
    // Explain the feature and ask if they want to enable it
  }
}
```

### Module Integration

When integrating agentic modules:

1. **Install** only requested modules
2. **Import** modules dynamically when possible
3. **Handle** missing modules gracefully
4. **Document** all integrations in README

### Feature Recommendations

When recommending features to users:

**DO:**
- Explain the specific problem the feature solves
- Show concrete time savings
- Provide usage examples
- Link to module documentation

**DON'T:**
- Enable features without permission
- Assume all features are needed
- Add unnecessary dependencies
- Create tight coupling

## Module Development Guidelines

### Creating New Agentic Features

When adding new features to the starter:

1. **Identify** a genuine pain point in Next.js development
2. **Design** as a standalone npm module
3. **Document** with clear README and examples
4. **Test** independently of other features
5. **Add** to configuration system
6. **Update** main README

### Module Structure

Each module should follow this structure:

```
packages/feature-name/
├── package.json       # npm package configuration
├── index.js          # Main module code
├── README.md         # Feature documentation
└── examples/         # Usage examples (optional)
```

### Module Requirements

All agentic modules must:

- Export a class or function as the main interface
- Accept configuration via constructor/options
- Provide verbose logging option
- Return structured results
- Handle errors gracefully
- Include complete README

### Documentation Standards

Each module README must include:

1. **Description**: What problem it solves
2. **Installation**: How to install
3. **Usage**: Basic and advanced examples
4. **API**: Complete API documentation
5. **Features**: Key capabilities
6. **License**: MIT

## Configuration System

### First-Run Experience

The `scripts/configure.js` script:

- Runs interactively on first setup
- Asks about each feature individually
- Explains what each feature does
- Saves preferences to `.agentic-config.json`
- Can be re-run with `--force` flag

### Configuration Schema

```json
{
  "features": {
    "agentVerify": boolean,
    "autokill": boolean,
    "portRandomizer": boolean
  },
  "settings": {
    "port": number,
    "portRange": {
      "min": number,
      "max": number
    }
  },
  "configured": boolean,
  "configuredAt": string (ISO 8601)
}
```

## Publishing Modules

**IMPORTANT**: Do NOT publish modules to npm without explicit consent.

When ready to publish:

1. **Test** thoroughly in real projects
2. **Document** all features completely
3. **Version** according to semver
4. **Get** explicit approval to publish
5. **Publish** to npm with proper scoping (@agentic-next/*)

## Contributing

When contributing to agentic features:

1. **Follow** these rules strictly
2. **Document** all changes
3. **Test** with and without feature enabled
4. **Update** configuration system if adding features
5. **Maintain** backward compatibility

## Version Control

### Commit Messages

Follow conventional commits for agentic features:

```
feat(verify): add health check timeout configuration
fix(autokill): handle multiple processes correctly
docs(port-randomizer): update API documentation
```

### Branching

- Feature development: `feature/module-name`
- Bug fixes: `fix/module-name-issue`
- Documentation: `docs/module-name`

## Testing

Modules should be tested:

- **Independently**: Each module works alone
- **Integrated**: Modules work together
- **Disabled**: App works without modules
- **Configured**: Respects user configuration

## Philosophy

This starter exists to:

1. **Accelerate** Next.js development
2. **Eliminate** common friction points
3. **Empower** developers with smart defaults
4. **Enable** AI-assisted workflows

Features should be:

- **Useful**: Solve real problems
- **Optional**: Never forced
- **Simple**: Easy to understand
- **Reliable**: Always work correctly

## Questions?

For questions about agentic development:

1. Check module READMEs
2. Review this document
3. Check .agentic-config.json
4. Ask the user for clarification

## Remember

The goal is to **assist**, not automate blindly. Always respect user preferences, explain your reasoning, and prioritize developer experience above all else.
