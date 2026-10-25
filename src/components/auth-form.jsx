'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LoaderCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { authClient } from '../lib/auth-client'
import { GitHubIcon, GoogleIcon } from './brand-icons'

const inputClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100'

const ERROR_MESSAGES = {
  INVALID_EMAIL_OR_PASSWORD: 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
  INVALID_PASSWORD: 'পাসওয়ার্ড সঠিক নয়।',
  INVALID_EMAIL: 'ইমেইলটি সঠিক নয়।',
  USER_NOT_FOUND: 'এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।',
  USER_ALREADY_EXISTS: 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।',
  PASSWORD_TOO_SHORT: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।',
  PASSWORD_TOO_LONG: 'পাসওয়ার্ড অনেক বড় হয়ে গেছে।',
  PROVIDER_NOT_FOUND: 'এই পদ্ধতিতে লগইন এখনও চালু করা হয়নি।'
}

function messageFor (error, fallback) {
  return ERROR_MESSAGES[error?.code] ?? fallback
}

export default function AuthForm ({
  mode = 'signin',
  callbackURL = '/',
  reason = ''
}) {
  const router = useRouter()
  const isSignUp = mode === 'signup'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [pending, setPending] = useState(false)
  const [socialPending, setSocialPending] = useState('')
  const [formError, setFormError] = useState('')

  // Told to sign in first (e.g. redirected away from a protected page).
  useEffect(() => {
    if (reason === 'login-required') {
      toast.error('এই পেজ দেখতে আগে সাইন ইন করুন।', { id: 'login-required' })
    }
  }, [reason])

  const busy = pending || Boolean(socialPending)

  function fail (message) {
    setFormError(message)
    toast.error(message)
  }

  async function handleSubmit (event) {
    event.preventDefault()

    if (busy) return

    setFormError('')

    if (isSignUp && !name.trim()) return fail('আপনার নাম লিখুন।')
    if (!email.trim()) return fail('ইমেইল লিখুন।')
    if (password.length < 8) return fail('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।')
    if (isSignUp && password !== confirm) {
      return fail('পাসওয়ার্ড দুটি মিলছে না।')
    }

    setPending(true)

    try {
      if (isSignUp) {
        const result = await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password
        })

        if (result.error) {
          return fail(messageFor(result.error, 'অ্যাকাউন্ট তৈরি করা যায়নি।'))
        }

        // Registration signs the user in; end that session so they log in
        // themselves on the sign-in page.
        await authClient.signOut()

        toast.success('অ্যাকাউন্ট তৈরি হয়েছে। এবার সাইন ইন করুন।')

        const next =
          callbackURL === '/'
            ? '/signin'
            : `/signin?callbackURL=${encodeURIComponent(callbackURL)}`

        router.push(next)
        return
      }

      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe: true
      })

      if (result.error) {
        return fail(messageFor(result.error, 'সাইন ইন করা যায়নি।'))
      }

      toast.success('সফলভাবে সাইন ইন হয়েছে।')
      router.replace(callbackURL)
      router.refresh()
    } catch (error) {
      console.error('Authentication failed:', error)
      fail('কিছু একটা সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন।')
    } finally {
      setPending(false)
    }
  }

  async function handleSocial (provider) {
    if (busy) return

    setFormError('')
    setSocialPending(provider)

    try {
      const result = await authClient.signIn.social({ provider, callbackURL })

      if (result?.error) {
        fail(messageFor(result.error, 'সোশ্যাল লগইন করা যায়নি।'))
      }
    } catch (error) {
      console.error(`${provider} sign-in failed:`, error)
      fail('সোশ্যাল লগইন করা যায়নি। আবার চেষ্টা করুন।')
    } finally {
      setSocialPending('')
    }
  }

  return (
    <div className='bazar-container flex min-h-[70vh] items-center justify-center py-10 sm:py-14'>
      <section className='w-full max-w-md overflow-hidden rounded-3xl border border-[var(--bazar-border)] bg-white shadow-xl shadow-green-900/5'>
        <div className='bg-gradient-to-br from-green-50 to-amber-50 px-6 py-7 sm:px-8'>
          <Link href='/' className='inline-flex items-center gap-2 text-sm font-bold text-green-800'>
            <span aria-hidden='true'>🛒</span>
            বাজার দর
          </Link>

          <h1 className='mt-5 text-3xl font-bold text-gray-950'>
            {isSignUp ? 'অ্যাকাউন্ট তৈরি করুন' : 'সাইন ইন করুন'}
          </h1>

          <p className='mt-2 text-sm leading-6 text-gray-600'>
            {isSignUp
              ? 'বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।'
              : 'বিস্তারিত দাম ও বাজার তুলনা দেখতে অ্যাকাউন্টে ঢুকুন।'}
          </p>
        </div>

        <div className='p-6 sm:p-8'>
          <div className='grid gap-3'>
            <button
              type='button'
              onClick={() => handleSocial('google')}
              disabled={busy}
              className='inline-flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {socialPending === 'google'
                ? <LoaderCircle size={18} className='animate-spin' />
                : <GoogleIcon />}
              Google দিয়ে চালিয়ে যান
            </button>

            <button
              type='button'
              onClick={() => handleSocial('github')}
              disabled={busy}
              className='inline-flex items-center justify-center gap-2.5 rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {socialPending === 'github'
                ? <LoaderCircle size={18} className='animate-spin' />
                : <GitHubIcon />}
              GitHub দিয়ে চালিয়ে যান
            </button>
          </div>

          <div className='my-6 flex items-center gap-3'>
            <div className='h-px flex-1 bg-gray-200' />
            <span className='text-xs font-semibold text-gray-400'>অথবা</span>
            <div className='h-px flex-1 bg-gray-200' />
          </div>

          <form onSubmit={handleSubmit} className='space-y-4' noValidate>
            {isSignUp && (
              <div>
                <label htmlFor='name' className='mb-1.5 block text-sm font-bold text-gray-700'>
                  নাম
                </label>
                <input
                  id='name'
                  type='text'
                  autoComplete='name'
                  value={name}
                  onChange={event => setName(event.target.value)}
                  placeholder='যেমন: রহিম উদ্দিন'
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <label htmlFor='email' className='mb-1.5 block text-sm font-bold text-gray-700'>
                ইমেইল
              </label>
              <input
                id='email'
                type='email'
                autoComplete='email'
                value={email}
                onChange={event => setEmail(event.target.value)}
                placeholder='you@example.com'
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor='password' className='mb-1.5 block text-sm font-bold text-gray-700'>
                পাসওয়ার্ড
              </label>
              <input
                id='password'
                type='password'
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                value={password}
                onChange={event => setPassword(event.target.value)}
                placeholder='কমপক্ষে ৮ অক্ষর'
                className={inputClass}
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor='confirm' className='mb-1.5 block text-sm font-bold text-gray-700'>
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <input
                  id='confirm'
                  type='password'
                  autoComplete='new-password'
                  value={confirm}
                  onChange={event => setConfirm(event.target.value)}
                  placeholder='পাসওয়ার্ড আবার লিখুন'
                  className={inputClass}
                />
              </div>
            )}

            {formError && (
              <p role='alert' className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
                {formError}
              </p>
            )}

            <button
              type='submit'
              disabled={busy}
              className='flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {pending && <LoaderCircle size={18} className='animate-spin' />}
              {isSignUp ? 'সাইন আপ করুন' : 'সাইন ইন করুন'}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-gray-600'>
            {isSignUp ? 'অ্যাকাউন্ট আছে?' : 'অ্যাকাউন্ট নেই?'}{' '}
            <Link
              href={
                isSignUp
                  ? callbackURL === '/' ? '/signin' : `/signin?callbackURL=${encodeURIComponent(callbackURL)}`
                  : callbackURL === '/' ? '/signup' : `/signup?callbackURL=${encodeURIComponent(callbackURL)}`
              }
              className='font-bold text-green-800 hover:underline'
            >
              {isSignUp ? 'সাইন ইন করুন' : 'সাইন আপ করুন'}
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}
