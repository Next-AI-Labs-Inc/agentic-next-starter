const http = require('http');
const { writeFileSync, appendFileSync } = require('fs');
const path = require('path');

/**
 * Agent Verify - Health check utility for Next.js applications
 *
 * Verifies that your Next.js application is running and responding correctly.
 * Provides detailed health check results with error reporting and recommendations.
 */

class AgentVerify {
  constructor(options = {}) {
    this.port = options.port || process.env.PORT || 3000;
    this.logFile = options.logFile || path.join(process.cwd(), '.agent-health-check.log');
    this.verbose = options.verbose || false;
    this.timeout = options.timeout || 5000;
  }

  log(message, level = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}\n`;

    if (this.verbose) {
      console.log(message);
    }

    try {
      appendFileSync(this.logFile, logMessage);
    } catch (err) {
      console.error('Error writing to log file:', err);
    }
  }

  async checkEndpoint(url) {
    return new Promise((resolve, reject) => {
      const req = http.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        });
      });

      req.on('error', (err) => {
        reject(err);
      });

      req.setTimeout(this.timeout, () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });
    });
  }

  async verify() {
    // Initialize log file
    writeFileSync(this.logFile, `Agent health check started at ${new Date().toISOString()}\n`, 'utf8');

    this.log('===== NEXT.JS APP HEALTH CHECK =====');
    this.log(`URL: http://localhost:${this.port}`);

    const result = {
      timestamp: new Date().toISOString(),
      status: 'UNKNOWN',
      port: this.port,
      errors: [],
      warnings: [],
      recommendations: [],
      details: {}
    };

    try {
      // Check main health endpoint
      this.log('Checking app health endpoint...');
      const healthResponse = await this.checkEndpoint(`http://localhost:${this.port}/api/health`);
      result.details.apiHealth = healthResponse.statusCode === 200 ? 'OK' : 'ERROR';

      if (healthResponse.statusCode !== 200) {
        result.status = 'ERROR';
        result.errors.push(`Health check failed with status ${healthResponse.statusCode}`);
        result.recommendations.push('Check server logs for errors');
      } else {
        this.log('App health endpoint is OK', 'SUCCESS');
        result.status = 'OK';
      }
    } catch (err) {
      result.status = 'ERROR';
      result.errors.push(err.message);

      if (err.code === 'ECONNREFUSED') {
        result.errors.push('The application is not running or responding correctly');
        result.recommendations.push('Start the app with "npm run dev" or "npm start"');
        result.recommendations.push('Check terminal output for startup errors');
      } else if (err.message === 'Request timed out') {
        result.errors.push('The application is taking too long to respond');
        result.recommendations.push('Check server logs for performance issues');
      }
    }

    return result;
  }

  formatResults(result, json = false) {
    if (json) {
      return JSON.stringify(result, null, 2);
    }

    let output = '===== HEALTH CHECK RESULTS =====\n';
    output += `App Status: ${result.status}\n`;
    output += `URL: http://localhost:${result.port}\n`;

    if (result.errors.length > 0) {
      output += '\nERRORS:\n';
      result.errors.forEach(error => {
        output += `  • ${error}\n`;
      });
    }

    if (result.warnings.length > 0) {
      output += '\nWARNINGS:\n';
      result.warnings.forEach(warning => {
        output += `  • ${warning}\n`;
      });
    }

    if (result.recommendations.length > 0) {
      output += '\nRECOMMENDED ACTIONS:\n';
      result.recommendations.forEach(recommendation => {
        output += `  • ${recommendation}\n`;
      });
    }

    if (this.verbose && Object.keys(result.details).length > 0) {
      output += '\nDETAILS:\n';
      Object.entries(result.details).forEach(([key, value]) => {
        output += `  • ${key}: ${value}\n`;
      });
    }

    return output;
  }
}

module.exports = AgentVerify;
