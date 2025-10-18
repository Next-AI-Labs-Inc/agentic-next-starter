const { exec } = require('child_process');
const { promisify } = require('util');
const { writeFileSync, readFileSync, existsSync } = require('fs');
const path = require('path');

const execPromise = promisify(exec);

/**
 * Port Randomizer - Automatic port selection for Next.js apps
 *
 * Eliminates time wasted on port selection for every build.
 * Finds an available port and persists it for consistency.
 */

class PortRandomizer {
  constructor(options = {}) {
    this.minPort = options.minPort || 3000;
    this.maxPort = options.maxPort || 9999;
    this.configFile = options.configFile || path.join(process.cwd(), '.port-config.json');
    this.verbose = options.verbose !== undefined ? options.verbose : true;
    this.persist = options.persist !== undefined ? options.persist : true;
  }

  log(message) {
    if (this.verbose) {
      console.log(message);
    }
  }

  async isPortAvailable(port) {
    try {
      await execPromise(`lsof -ti:${port}`);
      // If lsof succeeds, port is in use
      return false;
    } catch (error) {
      // If lsof fails (exit code 1), port is available
      return error.code === 1;
    }
  }

  randomPort() {
    return Math.floor(Math.random() * (this.maxPort - this.minPort + 1)) + this.minPort;
  }

  loadPersistedPort() {
    if (!this.persist || !existsSync(this.configFile)) {
      return null;
    }

    try {
      const config = JSON.parse(readFileSync(this.configFile, 'utf8'));
      return config.port;
    } catch (error) {
      this.log(`Failed to load persisted port: ${error.message}`);
      return null;
    }
  }

  persistPort(port) {
    if (!this.persist) {
      return;
    }

    try {
      const config = {
        port,
        lastUpdated: new Date().toISOString()
      };
      writeFileSync(this.configFile, JSON.stringify(config, null, 2), 'utf8');
      this.log(`Port ${port} persisted to ${this.configFile}`);
    } catch (error) {
      this.log(`Failed to persist port: ${error.message}`);
    }
  }

  async findAvailablePort(preferredPort = null) {
    // First, try the preferred port if provided
    if (preferredPort) {
      this.log(`Checking preferred port ${preferredPort}...`);
      if (await this.isPortAvailable(preferredPort)) {
        this.log(`Preferred port ${preferredPort} is available!`);
        return preferredPort;
      }
      this.log(`Preferred port ${preferredPort} is in use.`);
    }

    // Next, try the persisted port
    const persistedPort = this.loadPersistedPort();
    if (persistedPort) {
      this.log(`Checking persisted port ${persistedPort}...`);
      if (await this.isPortAvailable(persistedPort)) {
        this.log(`Persisted port ${persistedPort} is available!`);
        return persistedPort;
      }
      this.log(`Persisted port ${persistedPort} is in use.`);
    }

    // Finally, find a random available port
    this.log(`Finding random available port between ${this.minPort} and ${this.maxPort}...`);

    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      const port = this.randomPort();
      this.log(`Trying port ${port}...`);

      if (await this.isPortAvailable(port)) {
        this.log(`Found available port: ${port}`);
        this.persistPort(port);
        return port;
      }

      attempts++;
    }

    throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
  }

  async getPort(preferredPort = null) {
    const port = await this.findAvailablePort(preferredPort || process.env.PORT);

    return {
      port,
      env: `PORT=${port}`,
      url: `http://localhost:${port}`
    };
  }

  clearPersistedPort() {
    if (existsSync(this.configFile)) {
      const fs = require('fs');
      fs.unlinkSync(this.configFile);
      this.log(`Cleared persisted port from ${this.configFile}`);
    }
  }
}

module.exports = PortRandomizer;
