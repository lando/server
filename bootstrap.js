/**
 * Bootstraps runtime with env vars and other pre-requisites.
 */

const dotenv = require('dotenv');
const fs = require('fs');

/**
 * Loads .env files into environment variables.
 * @param file Path to .env file
 */
const loadEnv = file => {
  if (fs.existsSync(file)) {
    const envConfig = dotenv.parse(fs.readFileSync(file));
    for (const k in envConfig) {
      process.env[k] = envConfig[k]
    }
  }
}

// Load defaults.
dotenv.config();
const landoEnv = process.env['LANDO_ENV'];
// Load env specific config & overrides.
const envFiles = [`.env.${landoEnv}`, '.env.local', `.env.${landoEnv}.local`];
envFiles.forEach(file => (loadEnv(file)));
