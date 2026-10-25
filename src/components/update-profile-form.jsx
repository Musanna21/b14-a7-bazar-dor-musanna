'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LoaderCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { authClient } from '../lib/auth-client'

export default function UpdateProfileForm ({ currentName }) {
  const router = useRouter()
  const [name, setName] = useState(currentName)
  const [pending, setPending] = useState(false)

  async function handleSubmit (event) {
    event.preventDefault()

    if (pending) return

    const trimmed = name.trim()

    if (trimmed.length < 2) {
      toast.error('নাম কমপক্ষে ২ অক্ষরের হতে হবে।')
      return
    }

    if (trimmed === currentName) {
      toast('নামে কোনো পরিবর্তন করা হয়নি।')
      return
    }

    setPending(true)

    try {
      const result = await authClient.updateUser({ name: trimmed })

      if (result.error) {
        toast.error(result.error.message || 'তথ্য আপডেট করা যায়নি।')
        return
      }

      toast.success('আপনার তথ্য আপডেট হয়েছে।')
      router.push('/profile')
      router.refresh()
    } catch (error) {
      console.error('Profile update failed:', error)
      toast.error('কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className='bazar-container py-8 sm:py-12'>
      <Link
        href='/profile'
        className='mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-green-800'
      >
        <ArrowLeft size={16} aria-hidden='true' />
        প্রোফাইলে ফিরে যান
      </Link>

      <section className='max-w-xl rounded-3xl border border-[var(--bazar-border)] bg-white p-6 shadow-sm sm:p-8'>
        <h1 className='text-2xl font-bold text-gray-950 sm:text-3xl'>
          তথ্য আপডেট করুন
        </h1>

        <form onSubmit={handleSubmit} className='mt-6 space-y-5' noValidate>
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
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100'
            />
          </div>

          <button
            type='submit'
            disabled={pending}
            className='inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {pending && <LoaderCircle size={17} className='animate-spin' />}
            আপডেট
          </button>
        </form>
      </section>
    </div>
  )
}
