const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

/**
 * Autokill - Automatically kill processes on a port
 *
 * Eliminates wasted time looking for the right terminal window when you need
 * to restart your app. Just run and it handles everything.
 */

class Autokill {
  constructor(options = {}) {
    this.port = options.port || process.env.PORT || 3000;
    this.verbose = options.verbose !== undefined ? options.verbose : true;
    this.graceful = options.graceful !== undefined ? options.graceful : false;
  }

  log(message) {
    if (this.verbose) {
      console.log(message);
    }
  }

  async findProcessOnPort() {
    try {
      const { stdout } = await execPromise(`lsof -ti:${this.port}`);
      return stdout.trim();
    } catch (error) {
      // lsof returns exit code 1 if no process found
      if (error.code === 1) {
        return null;
      }
      throw error;
    }
  }

  async killProcess(pid) {
    const signal = this.graceful ? 'TERM' : '9';
    const signalName = this.graceful ? 'SIGTERM' : 'SIGKILL';

    this.log(`Sending ${signalName} to process ${pid}...`);

    try {
      await execPromise(`kill -${signal} ${pid}`);
      this.log(`Process ${pid} killed successfully.`);

      // Give it a moment to clean up
      await new Promise(resolve => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      this.log(`Failed to kill process ${pid}: ${error.message}`);
      return false;
    }
  }

  async kill() {
    this.log(`Checking for processes on port ${this.port}...`);

    const pid = await this.findProcessOnPort();

    if (!pid) {
      this.log(`No process found running on port ${this.port}.`);
      return {
        killed: false,
        port: this.port,
        pid: null,
        message: 'No process found'
      };
    }

    const pids = pid.split('\n').filter(p => p.trim());
    this.log(`Found ${pids.length} process(es) running on port ${this.port}: ${pids.join(', ')}`);

    const results = await Promise.all(pids.map(p => this.killProcess(p)));
    const allKilled = results.every(r => r);

    return {
      killed: allKilled,
      port: this.port,
      pids: pids,
      message: allKilled ? 'All processes killed successfully' : 'Some processes failed to kill'
    };
  }

  async killAndRun(command) {
    const result = await this.kill();

    if (command) {
      this.log(`Starting command: ${command}`);
      const child = exec(command, {
        stdio: 'inherit',
        shell: true
      });

      child.stdout?.pipe(process.stdout);
      child.stderr?.pipe(process.stderr);

      return {
        ...result,
        child
      };
    }

    return result;
  }
}

module.exports = Autokill;
