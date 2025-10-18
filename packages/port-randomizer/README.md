# @agentic-next/port-randomizer

Automatic port randomization for Next.js applications. Eliminates time wasted on port selection for every build by intelligently finding and persisting available ports.

## Installation

```bash
npm install @agentic-next/port-randomizer
```

## Usage

### Basic Usage

```javascript
const PortRandomizer = require('@agentic-next/port-randomizer');

const randomizer = new PortRandomizer({
  minPort: 3000,       // Optional: minimum port (default: 3000)
  maxPort: 9999,       // Optional: maximum port (default: 9999)
  persist: true,       // Optional: save port for reuse (default: true)
  verbose: true        // Optional: show log messages (default: true)
});

const result = await randomizer.getPort();
console.log(result);
// { port: 3542, env: 'PORT=3542', url: 'http://localhost:3542' }
```

### With Preferred Port

```javascript
// Try port 3000 first, fallback to random if unavailable
const result = await randomizer.getPort(3000);
```

### Start Your App

```javascript
const PortRandomizer = require('@agentic-next/port-randomizer');
const { exec } = require('child_process');

(async () => {
  const randomizer = new PortRandomizer();
  const { port, url } = await randomizer.getPort();

  console.log(`Starting app on ${url}`);

  const child = exec(`PORT=${port} next dev`, {
    stdio: 'inherit'
  });

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);
})();
```

## CLI Usage

Add to your `package.json`:

```json
{
  "scripts": {
    "dev:random": "node scripts/dev-random-port.js"
  }
}
```

Create `scripts/dev-random-port.js`:

```javascript
const PortRandomizer = require('@agentic-next/port-randomizer');
const { exec } = require('child_process');

(async () => {
  const randomizer = new PortRandomizer({
    minPort: 3000,
    maxPort: 4000
  });

  const { port } = await randomizer.getPort();

  const child = exec(`PORT=${port} next dev`, {
    stdio: 'inherit',
    shell: true
  });

  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);
})();
```

Then run:

```bash
npm run dev:random
```

## Features

- **Smart Port Selection**: Tries preferred port, then persisted port, then random
- **Port Persistence**: Saves last used port in `.port-config.json` for consistency
- **Availability Checking**: Automatically detects if a port is in use
- **Configurable Range**: Set min/max port bounds
- **Verbose Logging**: See the port selection process

## API

### `new PortRandomizer(options)`

Creates a new PortRandomizer instance.

**Options:**
- `minPort` (number): Minimum port to try (default: `3000`)
- `maxPort` (number): Maximum port to try (default: `9999`)
- `persist` (boolean): Save selected port for reuse (default: `true`)
- `verbose` (boolean): Enable verbose logging (default: `true`)
- `configFile` (string): Path to config file (default: `.port-config.json`)

### `randomizer.getPort(preferredPort)`

Finds an available port. Returns a Promise that resolves to:

```javascript
{
  port: 3542,
  env: 'PORT=3542',
  url: 'http://localhost:3542'
}
```

**Parameters:**
- `preferredPort` (number): Optional port to try first

### `randomizer.findAvailablePort(preferredPort)`

Lower-level method that just returns the port number.

### `randomizer.clearPersistedPort()`

Deletes the persisted port configuration.

## Port Selection Strategy

1. **Preferred Port**: If you provide a preferred port, tries that first
2. **Environment Variable**: Checks `process.env.PORT` if no preferred port given
3. **Persisted Port**: Tries the last successfully used port from `.port-config.json`
4. **Random Port**: Generates random ports within range until one is available

## Use Cases

### Multiple Projects

Run multiple Next.js projects simultaneously without port conflicts:

```bash
# Project A
cd project-a && npm run dev:random
# Uses port 3542

# Project B
cd project-b && npm run dev:random
# Automatically uses port 3789
```

### CI/CD

Ensure tests run on available ports:

```javascript
const randomizer = new PortRandomizer({ persist: false });
const { port } = await randomizer.getPort();
// Run tests on this port
```

### Docker Development

Avoid port conflicts when running containers:

```javascript
const { port } = await randomizer.getPort(3000);
// Use this port in docker-compose.yml
```

## License

MIT
