import { headers } from 'next/headers'
import { auth } from './auth'

/** Returns the current session (or null) on the server. */
export async function getSession () {
  try {
    return await auth.api.getSession({ headers: await headers() })
  } catch (error) {
    console.error('Could not read the session:', error)

    return null
  }
}

/** Only allows redirects back into this site (blocks open redirects). */
export function safeCallbackPath (value, fallback = '/') {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return fallback
  }

  return value
}
