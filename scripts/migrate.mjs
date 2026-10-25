// Creates the Better Auth tables (user, session, account, verification)
// in the database named by DATABASE_URL.
//
//   npm run db:migrate
//
// Reads DATABASE_URL from the environment, .env.local or .env.
import { existsSync, readFileSync } from 'node:fs'

for (const file of ['.env.local', '.env']) {
  if (!existsSync(file)) continue

  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i)

    if (!match || process.env[match[1]] !== undefined) continue

    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing. Add it to .env.local first.')
  process.exit(1)
}

const { getMigrations } = await import('better-auth/db/migration')
const { auth } = await import('../src/lib/auth.js')

const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options)

if (toBeCreated.length === 0 && toBeAdded.length === 0) {
  console.log('Database is already up to date.')
} else {
  await runMigrations()
  console.log(
    `Migration complete. Created: ${toBeCreated.map(t => t.table).join(', ') || 'none'}.`
  )
}

process.exit(0)
