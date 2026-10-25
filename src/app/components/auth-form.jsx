'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, GitHub, Leaf, LoaderCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { authClient } from '../../lib/auth-client'
import { UserRound } from "lucide-react";

const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === 'true'

const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_OAUTH_ENABLED === 'true'

export default function AuthForm ({ mode = 'signin' }) {
  const router = useRouter()

  const isSignUp = mode === 'signup'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [socialPending, setSocialPending] = useState('')

  function getSafeCallbackURL () {
    const candidate = new URLSearchParams(window.location.search).get(
      'callbackURL'
    )

    if (!candidate) return '/'

    try {
      const target = new URL(candidate, window.location.origin)

      // Only permit redirects back to this application.
      if (target.origin !== window.location.origin) {
        return '/'
      }

      return `${target.pathname}${target.search}${target.hash}`
    } catch {
      return '/'
    }
  }

  async function handleSubmit (event) {
    event.preventDefault()

    if (pending || socialPending) return

    if (isSignUp && !name.trim()) {
      toast.error('Please enter your name.')
      return
    }

    if (password.length < 8) {
      toast.error('Password must contain at least 8 characters.')
      return
    }

    setPending(true)

    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            name: name.trim(),
            email: email.trim(),
            password,
            callbackURL: getSafeCallbackURL(),
          })
        : await authClient.signIn.email({
            email: email.trim(),
            password,
            callbackURL: getSafeCallbackURL(),,
            rememberMe: true
          })

      if (result.error) {
        toast.error(
          result.error.message ||
            (isSignUp ? 'Registration failed.' : 'Unable to sign in.')
        )
        return
      }

      toast.success(
        isSignUp
          ? 'Account created successfully.'
          : 'Welcome back to Bazar Dor.'
      )

      router.replace('/')
      router.refresh()
    } catch (error) {
      console.error('Authentication failed:', error)
      toast.error(
        'Authentication failed. Check the server and database configuration.'
      )
    } finally {
      setPending(false)
    }
  }

  async function handleSocialSignIn (provider) {
    const enabled = provider === 'google' ? googleEnabled : githubEnabled

    if (!enabled) {
      toast.error(
        `${
          provider === 'google' ? 'Google' : 'GitHub'
        } login is not configured yet.`
      )
      return
    }

    if (pending || socialPending) return

    setSocialPending(provider)

    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: getSafeCallbackURL(),
      })

      if (result.error) {
        toast.error(result.error.message || 'Social login failed.')
      }
    } catch (error) {
      console.error(`${provider} sign-in failed:`, error)
      toast.error(
        `${
          provider === 'google' ? 'Google' : 'GitHub'
        } sign-in failed. Check OAuth configuration.`
      )
    } finally {
      setSocialPending('')
    }
  }

  return (
    <main className='bazar-container flex min-h-[75vh] items-center justify-center py-12 sm:py-16'>
      <section className='w-full max-w-md overflow-hidden rounded-3xl border border-[var(--bazar-border)] bg-white shadow-xl shadow-green-900/5'>
        <div className='bg-gradient-to-br from-green-50 to-amber-50 px-6 py-7 sm:px-8'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-sm font-bold text-green-800'
          >
            <Leaf size={18} />
            Bazar Dor
          </Link>

          <p className='mt-7 text-[10px] font-extrabold uppercase tracking-[0.2em] text-green-700'>
            {isSignUp ? 'Join the community' : 'Welcome back'}
          </p>

          <h1 className='mt-2 text-3xl font-black tracking-tight text-gray-950'>
            {isSignUp ? 'Create your account' : 'Sign in to Bazar Dor'}
          </h1>

          <p className='mt-2 text-sm leading-6 text-gray-600'>
            {isSignUp
              ? 'Create an account to access protected product details.'
              : 'Sign in to continue to the full market information.'}
          </p>
        </div>

        <div className='p-6 sm:p-8'>
          <div className='grid grid-cols-2 gap-3'>
            <button
              type='button'
              onClick={() => handleSocialSignIn('google')}
              disabled={pending || Boolean(socialPending)}
              title={
                googleEnabled
                  ? 'Continue with Google'
                  : 'Configure Google OAuth credentials to enable'
              }
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {socialPending === 'google' ? (
                <LoaderCircle size={17} className='animate-spin' />
              ) : (
                <span className='font-black text-blue-600'>G</span>
              )}
              Google
            </button>

            <button
              type='button'
              onClick={() => handleSocialSignIn('github')}
              disabled={pending || Boolean(socialPending)}
              title={
                githubEnabled
                  ? 'Continue with GitHub'
                  : 'Configure GitHub OAuth credentials to enable'
              }
              className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {socialPending === 'github' ? (
                <LoaderCircle size={17} className='animate-spin' />
              ) : (
                <GitHub size={18} />
              )}
              GitHub
            </button>
          </div>

          {(!googleEnabled || !githubEnabled) && (
            <p className='mt-3 text-xs leading-5 text-gray-500'>
              Social sign-in is enabled once its OAuth credentials have been
              configured.
            </p>
          )}

          <div className='my-6 flex items-center gap-3'>
            <div className='h-px flex-1 bg-gray-200' />
            <span className='text-[10px] font-bold uppercase tracking-wider text-gray-400'>
              Or use email
            </span>
            <div className='h-px flex-1 bg-gray-200' />
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {isSignUp && (
              <div>
                <label
                  htmlFor='name'
                  className='mb-1.5 block text-xs font-bold text-gray-700'
                >
                  Full name
                </label>

                <input
                  id='name'
                  name='name'
                  type='text'
                  autoComplete='name'
                  required
                  minLength={2}
                  maxLength={80}
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder='Your name'
                  className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600'
                />
              </div>
            )}

            <div>
              <label
                htmlFor='email'
                className='mb-1.5 block text-xs font-bold text-gray-700'
              >
                Email address
              </label>

              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder='you@example.com'
                className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600'
              />
            </div>

            <div>
              <label
                htmlFor='password'
                className='mb-1.5 block text-xs font-bold text-gray-700'
              >
                Password
              </label>

              <input
                id='password'
                name='password'
                type='password'
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
                minLength={8}
                maxLength={128}
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder='At least 8 characters'
                className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600'
              />
            </div>

            <button
              type='submit'
              disabled={pending || Boolean(socialPending)}
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {pending ? (
                <LoaderCircle size={18} className='animate-spin' />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-gray-600'>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Link
              href={isSignUp ? '/signin' : '/signup'}
              className='font-extrabold text-green-800 hover:underline'
            >
              {isSignUp ? 'Sign In' : 'Create one'}
            </Link>
          </p>

          <p className='mt-5 text-center text-xs leading-5 text-gray-400'>
            By continuing, you agree to use Bazar Dor responsibly.
          </p>
        </div>
      </section>
    </main>
  )
}
