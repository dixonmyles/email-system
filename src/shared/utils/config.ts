import { parse } from 'dotenv';
import { readFileSync } from 'fs';

export function loadConfig() {
  const env = process.env.NODE_ENV || 'local';

  // Read and parse .env file for current environment
  const data: any = parse(readFileSync(`${env}.env`));

  // Set parsed vars to process.env
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      process.env[key] = data[key];
    }
  }
}
