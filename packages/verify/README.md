# @agentic-next/verify

Health check utility for Next.js applications. Verifies that your app is running and responding correctly.

## Installation

```bash
npm install @agentic-next/verify
```

## Usage

```javascript
const AgentVerify = require('@agentic-next/verify');

const verifier = new AgentVerify({
  port: 3000,           // Optional: defaults to process.env.PORT or 3000
  verbose: true,        // Optional: enable verbose logging
  timeout: 5000         // Optional: request timeout in ms
});

// Run health check
const result = await verifier.verify();

// Display results
console.log(verifier.formatResults(result));

// Or get JSON output
console.log(verifier.formatResults(result, true));
```

## CLI Usage

Add to your `package.json`:

```json
{
  "scripts": {
    "agent-verify": "node -e \"const AgentVerify = require('@agentic-next/verify'); (async () => { const v = new AgentVerify({ verbose: true }); const r = await v.verify(); console.log(v.formatResults(r)); process.exit(r.status === 'OK' ? 0 : 1); })();\""
  }
}
```

Then run:

```bash
npm run agent-verify
```

## Features

- **Health Endpoint Checking**: Verifies `/api/health` endpoint
- **Detailed Error Reporting**: Provides specific error messages and recommendations
- **Logging**: Maintains a log file at `.agent-health-check.log`
- **Configurable**: Customizable port, timeout, and verbosity
- **Exit Codes**: Returns proper exit codes for CI/CD integration

## API

### `new AgentVerify(options)`

Creates a new verifier instance.

**Options:**
- `port` (number): Port to check (default: `process.env.PORT` or `3000`)
- `verbose` (boolean): Enable verbose logging (default: `false`)
- `timeout` (number): Request timeout in milliseconds (default: `5000`)
- `logFile` (string): Path to log file (default: `.agent-health-check.log`)

### `verifier.verify()`

Runs the health check. Returns a Promise that resolves to a result object:

```javascript
{
  timestamp: '2025-10-17T...',
  status: 'OK' | 'ERROR' | 'UNKNOWN',
  port: 3000,
  errors: [],
  warnings: [],
  recommendations: [],
  details: {}
}
```

### `verifier.formatResults(result, json)`

Formats the result for display.

**Parameters:**
- `result` (object): The result object from `verify()`
- `json` (boolean): Return JSON format (default: `false`)

## License

MIT
