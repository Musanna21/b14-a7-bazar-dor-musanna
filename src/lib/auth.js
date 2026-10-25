import { betterAuth } from 'better-auth'
import { Pool } from 'pg'

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn(
    'DATABASE_URL is not set. Sign in and sign up will not work until you add it (see .env.example).'
  )
}

// Reuse one pool across hot reloads / serverless invocations.
const globalForDb = globalThis

const pool =
  globalForDb.__bazarDorPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 5,
    connectionTimeoutMillis: 10000
  })

globalForDb.__bazarDorPool = pool

const socialProviders = {}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  }
}

// Origins allowed to call the auth API (the production URL, Vercel preview
// URLs and local development).
const trustedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  process.env.VERCEL_BRANCH_URL
    ? `https://${process.env.VERCEL_BRANCH_URL}`
    : undefined,
  'http://localhost:3000'
].filter(Boolean)

export const auth = betterAuth({
  appName: 'Bazar Dor',
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: pool,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Kept on so that registering with an email that already exists returns a
    // clear error. The sign-up form signs the user out again straight away and
    // sends them to the sign-in page, as the assignment requires.
    autoSignIn: true
  },

  socialProviders,
  trustedOrigins
})
