# @agentic-next/autokill

Automatically kill processes on a port before starting your Next.js app. Since many terminal windows is the new normal, this eliminates wasted time looking for the right window when you need to restart your app.

## Installation

```bash
npm install @agentic-next/autokill
```

## Usage

### Basic Usage

```javascript
const Autokill = require('@agentic-next/autokill');

const autokill = new Autokill({
  port: 3000,          // Optional: defaults to process.env.PORT or 3000
  verbose: true,       // Optional: show log messages (default: true)
  graceful: false      // Optional: use SIGTERM instead of SIGKILL (default: false)
});

// Just kill processes on the port
const result = await autokill.kill();
console.log(result);
// { killed: true, port: 3000, pids: ['12345'], message: 'All processes killed successfully' }
```

### Kill and Run

```javascript
// Kill processes and start your app
const result = await autokill.killAndRun('npm run dev');
// Automatically kills any process on port 3000 and starts your dev server
```

## CLI Usage

Add to your `package.json`:

```json
{
  "scripts": {
    "dev": "node -e \"const Autokill = require('@agentic-next/autokill'); (async () => { const ak = new Autokill(); await ak.killAndRun('next dev'); })();\"",
    "dev:autokill": "node scripts/autokill-dev.js"
  }
}
```

Create `scripts/autokill-dev.js`:

```javascript
const Autokill = require('@agentic-next/autokill');

(async () => {
  const autokill = new Autokill({
    port: process.env.PORT || 3000,
    verbose: true
  });

  await autokill.killAndRun('next dev');
})();
```

Then run:

```bash
npm run dev:autokill
```

## Features

- **Automatic Process Detection**: Finds all processes using your port
- **Clean Termination**: Optional graceful shutdown with SIGTERM
- **Multiple Processes**: Handles multiple processes on the same port
- **Verbose Logging**: See exactly what's happening
- **Run After Kill**: Optionally start a command after killing processes

## API

### `new Autokill(options)`

Creates a new Autokill instance.

**Options:**
- `port` (number): Port to check (default: `process.env.PORT` or `3000`)
- `verbose` (boolean): Enable verbose logging (default: `true`)
- `graceful` (boolean): Use SIGTERM instead of SIGKILL (default: `false`)

### `autokill.kill()`

Kills all processes on the configured port. Returns a Promise that resolves to:

```javascript
{
  killed: true,
  port: 3000,
  pids: ['12345', '67890'],
  message: 'All processes killed successfully'
}
```

### `autokill.killAndRun(command)`

Kills processes and then runs a command. Returns the same result as `kill()` plus a `child` property with the child process.

**Parameters:**
- `command` (string): Command to run after killing processes

## Use Cases

### Development Workflow

Perfect for when you have multiple terminal windows and can't remember which one is running your dev server:

```bash
npm run dev:autokill
```

### CI/CD

Ensure clean port state before running tests:

```javascript
const autokill = new Autokill({ port: 3000, verbose: false });
await autokill.kill();
// Now run tests
```

### Multiple Environments

Different ports for different environments:

```javascript
const autokill = new Autokill({
  port: process.env.NODE_ENV === 'production' ? 3000 : 3001
});
```

## License

MIT
