# Agentic Next Starter

> Open-source Next.js starter template with pre-loaded optimizations and AI-friendly development tools

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## What is Agentic Next Starter?

A production-ready Next.js template designed for modern development workflows with AI assistance. It includes optional productivity features that eliminate common friction points in Next.js development.

### Key Features

- ✅ **Next.js** with App Router
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **ESLint** for code quality
- ✅ **Turbopack** for faster development
- 🎯 **Agent Verify** - Health check utility (optional)
- 🔫 **Autokill** - Automatic process management (optional)
- 🎲 **Port Randomizer** - Smart port selection (optional)

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Next-AI-Labs-Inc/agentic-next-starter.git my-project
cd my-project

# Install dependencies
npm install

# Run configuration (first time only)
npm run configure

# Start development
npm run dev
```

### First-Run Configuration

On first run, you'll be guided through an interactive setup:

```bash
npm run configure
```

This configures optional agentic features:

1. **Agent Verify** - Health checking for your app
2. **Autokill** - Automatically kill processes on your port
3. **Port Randomizer** - Find available ports automatically

All features are **optional** and can be enabled/disabled anytime.

## Agentic Features

### 🎯 Agent Verify

**Problem Solved:** Manual health checking is tedious and error-prone.

**Solution:** Automated health verification with detailed reporting.

```bash
npm run agent-verify
```

**Features:**
- Checks if your app is responding
- Provides detailed error messages
- Suggests fixes for common issues
- Logs results to `.agent-health-check.log`

[📖 Full Documentation](packages/verify/README.md)

### 🔫 Autokill

**Problem Solved:** Multiple terminal windows make it hard to find which one is running your app.

**Solution:** Automatically kills processes on your port before starting.

```bash
npm run dev:autokill
```

**Features:**
- Finds all processes on your port
- Kills them automatically
- Starts your app immediately
- Handles multiple processes

[📖 Full Documentation](packages/autokill/README.md)

### 🎲 Port Randomizer

**Problem Solved:** Port conflicts waste time during development.

**Solution:** Automatically finds and uses available ports.

```bash
npm run dev:random
```

**Features:**
- Tries preferred port first
- Falls back to last used port
- Finds random available port
- Persists port for consistency

[📖 Full Documentation](packages/port-randomizer/README.md)

## Usage

### Standard Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### With Agentic Features

```bash
# Health check before starting
npm run agent-verify && npm run dev

# Auto-kill and start
npm run dev:autokill

# Use random available port
npm run dev:random
```

## Package Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "configure": "node scripts/configure.js",
  "agent-verify": "Uses @agentic-next/verify",
  "dev:autokill": "Uses @agentic-next/autokill",
  "dev:random": "Uses @agentic-next/port-randomizer"
}
```

## Configuration

Configuration is stored in `.agentic-config.json`:

```json
{
  "features": {
    "agentVerify": true,
    "autokill": true,
    "portRandomizer": false
  },
  "settings": {
    "port": 3000,
    "portRange": {
      "min": 3000,
      "max": 9999
    }
  }
}
```

**Reconfigure anytime:**

```bash
npm run configure -- --force
```

## Modules

All agentic features are separate npm modules:

| Module | Purpose | Status |
|--------|---------|--------|
| [@agentic-next/verify](packages/verify) | Health checking | ✅ Ready |
| [@agentic-next/autokill](packages/autokill) | Process management | ✅ Ready |
| [@agentic-next/port-randomizer](packages/port-randomizer) | Port selection | ✅ Ready |

Each module can be used independently in any Node.js project.

## For AI Agents

This starter is optimized for AI-assisted development. See [AGENTS.md](AGENTS.md) for:

- AI agent protocols
- Module development guidelines
- Configuration handling rules
- Publishing requirements

**Key Rules:**
- All features are optional
- Respect user configuration
- Modules work independently
- Never publish without consent

## Project Structure

```
agentic-next-starter/
├── app/                  # Next.js app directory
├── packages/             # Agentic feature modules
│   ├── verify/          # @agentic-next/verify
│   ├── autokill/        # @agentic-next/autokill
│   └── port-randomizer/ # @agentic-next/port-randomizer
├── scripts/             # Build and setup scripts
│   └── configure.js     # First-run configuration
├── public/              # Static assets
├── .agentic-config.json # Feature configuration
├── AGENTS.md            # AI agent rules
└── README.md            # This file
```

## Development Workflow

### Standard Workflow

```bash
# 1. Start development
npm run dev

# 2. Make changes
# 3. Build for production
npm run build

# 4. Test production build
npm start
```

### With Agentic Features

```bash
# 1. Verify app health
npm run agent-verify

# 2. Start with autokill (no port conflicts)
npm run dev:autokill

# 3. Or use random port
npm run dev:random

# 4. Make changes and verify again
npm run agent-verify
```

## Common Use Cases

### Multiple Projects

Run multiple Next.js projects simultaneously:

```bash
# Project A
cd project-a && npm run dev:random
# → Started on http://localhost:3542

# Project B
cd project-b && npm run dev:random
# → Started on http://localhost:3789
```

### CI/CD Integration

```bash
# In your CI pipeline
npm run agent-verify || exit 1
npm run build
```

### Docker Development

```javascript
// Use port randomizer to avoid conflicts
const PortRandomizer = require('@agentic-next/port-randomizer');
const { port } = await new PortRandomizer().getPort();
// Use in docker-compose.yml
```

## Customization

### Add Your Own Features

1. Create module in `packages/your-feature/`
2. Add to configuration system
3. Update README
4. See [AGENTS.md](AGENTS.md) for guidelines

### Modify Existing Features

Each module is independent:

```bash
cd packages/verify
# Make changes
npm link
# Test in your project
```

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Other Platforms

```bash
npm run build
npm start
```

## FAQ

### Do I have to use all features?

No! All features are optional. Enable only what you need.

### Can I use modules in other projects?

Yes! Each module works independently in any Node.js project.

### How do I disable a feature?

Run `npm run configure -- --force` and toggle features.

### Are modules published to npm?

Not yet. They will be published after thorough testing.

### Can I contribute?

Yes! See [AGENTS.md](AGENTS.md) for contribution guidelines.

## Roadmap

- [x] Agent Verify module
- [x] Autokill module
- [x] Port Randomizer module
- [x] Configuration system
- [x] Documentation
- [ ] Publish modules to npm
- [ ] Add more agentic features
- [ ] VS Code extension
- [ ] CLI tool

## Learn More

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub](https://github.com/vercel/next.js)

### Agentic Development

- [AGENTS.md](AGENTS.md) - AI agent protocols
- [Module READMEs](packages/) - Individual feature docs

## License

MIT License - see [LICENSE](LICENSE) for details

## Credits

Created by [Next AI Labs](https://github.com/Next-AI-Labs-Inc)

Built on [Next.js](https://nextjs.org) by Vercel

## Support

- 🐛 [Report Bug](https://github.com/Next-AI-Labs-Inc/agentic-next-starter/issues)
- 💡 [Request Feature](https://github.com/Next-AI-Labs-Inc/agentic-next-starter/issues)
- 📖 [Documentation](https://github.com/Next-AI-Labs-Inc/agentic-next-starter)

---

**Happy Building!** 🚀

Made with ❤️ for developers who build with AI
