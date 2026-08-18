import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env from apps/api or root monorepo directory
const envPaths = [
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '.env.local'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../.env.local'),
];

for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
  }
}

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error(
    '\n❌ DATABASE_URL is missing!\n' +
    'Please create a file at "apps/api/.env" containing:\n' +
    'DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres\n'
  );
}

/**
 * Drizzle Kit config — works with both Neon and Supabase.
 */
export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
} satisfies Config;


