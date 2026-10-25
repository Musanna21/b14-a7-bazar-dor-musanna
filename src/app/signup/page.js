import { redirect } from 'next/navigation'
import AuthForm from '../../components/auth-form'
import { getSession, safeCallbackPath } from '../../lib/session'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'সাইন আপ | বাজার দর'
}

export default async function Page ({ searchParams }) {
  const params = await searchParams

  let callbackURL = safeCallbackPath(params?.callbackURL)

  // Never bounce back into the sign-in / sign-up pages.
  if (callbackURL.startsWith('/signin') || callbackURL.startsWith('/signup')) {
    callbackURL = '/'
  }

  // Already signed in: nothing to do here.
  if (await getSession()) redirect(callbackURL)

  return (
    <AuthForm
      mode='signup'
      callbackURL={callbackURL}
      reason={typeof params?.reason === 'string' ? params.reason : ''}
    />
  )
}
