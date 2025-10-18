#!/usr/bin/env node

/**
 * Agentic Next Starter - First Run Configuration
 *
 * This script runs on first setup to configure optional features.
 * Users can choose which optimizations to enable.
 */

const { writeFileSync, existsSync } = require('fs');
const path = require('path');
const readline = require('readline');

const CONFIG_FILE = path.join(process.cwd(), '.agentic-config.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function configure() {
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   Agentic Next Starter - Configuration Setup        ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  console.log('Welcome to Agentic Next Starter!');
  console.log('This setup will help you configure optional features.\n');

  const config = {
    features: {
      agentVerify: false,
      autokill: false,
      portRandomizer: false
    },
    settings: {
      port: 3000,
      portRange: {
        min: 3000,
        max: 9999
      }
    },
    configured: true,
    configuredAt: new Date().toISOString()
  };

  // Feature 1: Agent Verify
  console.log('\n📋 Feature 1: Agent Verify');
  console.log('───────────────────────────────────────────────────────');
  console.log('Health check utility to verify your app is running correctly.');
  console.log('Adds: npm run agent-verify\n');

  const enableVerify = await question('Enable Agent Verify? (y/n): ');
  config.features.agentVerify = enableVerify.toLowerCase() === 'y';

  // Feature 2: Autokill
  console.log('\n🔫 Feature 2: Autokill on Launch');
  console.log('───────────────────────────────────────────────────────');
  console.log('Automatically kills processes on your port before starting.');
  console.log('Eliminates searching for the right terminal window.\n');

  const enableAutokill = await question('Enable Autokill? (y/n): ');
  config.features.autokill = enableAutokill.toLowerCase() === 'y';

  // Feature 3: Port Randomization
  console.log('\n🎲 Feature 3: Automatic Port Randomization');
  console.log('───────────────────────────────────────────────────────');
  console.log('Automatically finds and uses an available port.');
  console.log('Eliminates time wasted on port selection.\n');

  const enablePortRandom = await question('Enable Port Randomization? (y/n): ');
  config.features.portRandomizer = enablePortRandom.toLowerCase() === 'y';

  if (config.features.portRandomizer) {
    const minPort = await question('  Minimum port (default: 3000): ');
    const maxPort = await question('  Maximum port (default: 9999): ');

    if (minPort) config.settings.portRange.min = parseInt(minPort);
    if (maxPort) config.settings.portRange.max = parseInt(maxPort);
  } else {
    const preferredPort = await question('  Preferred port (default: 3000): ');
    if (preferredPort) config.settings.port = parseInt(preferredPort);
  }

  // Save configuration
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf8');

  console.log('\n✅ Configuration saved to .agentic-config.json');
  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   Configuration Complete!                            ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');

  console.log('Enabled features:');
  console.log(`  • Agent Verify: ${config.features.agentVerify ? '✓' : '✗'}`);
  console.log(`  • Autokill: ${config.features.autokill ? '✓' : '✗'}`);
  console.log(`  • Port Randomization: ${config.features.portRandomizer ? '✓' : '✗'}`);

  if (config.features.portRandomizer) {
    console.log(`\nPort range: ${config.settings.portRange.min} - ${config.settings.portRange.max}`);
  } else {
    console.log(`\nPreferred port: ${config.settings.port}`);
  }

  console.log('\nYou can reconfigure anytime by running:');
  console.log('  npm run configure\n');

  rl.close();
}

// Check if already configured
if (existsSync(CONFIG_FILE) && !process.argv.includes('--force')) {
  console.log('\n⚠️  Configuration file already exists!');
  console.log('Run with --force to reconfigure: npm run configure -- --force\n');
  process.exit(0);
}

configure().catch(error => {
  console.error('Error during configuration:', error);
  rl.close();
  process.exit(1);
});
