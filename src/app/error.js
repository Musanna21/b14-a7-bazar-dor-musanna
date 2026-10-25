'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'

export default function ErrorPage ({ error, reset }) {
  useEffect(() => {
    console.error('Bazar Dor error:', error)
  }, [error])

  return (
    <section className='bazar-container flex min-h-[60vh] items-center justify-center py-16'>
      <div className='max-w-lg text-center'>
        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-700'>
          <AlertTriangle size={30} aria-hidden='true' />
        </div>

        <h1 className='mt-6 text-3xl font-bold text-gray-900 sm:text-4xl'>
          কিছু একটা সমস্যা হয়েছে
        </h1>

        <p className='mt-4 text-sm leading-7 text-gray-600'>
          পেজটি লোড করা যায়নি। দামের তথ্যের সার্ভার হয়তো সাময়িকভাবে বন্ধ আছে।
          একটু পরে আবার চেষ্টা করুন।
        </p>

        <div className='mt-7 flex flex-wrap justify-center gap-3'>
          <button
            type='button'
            onClick={() => reset()}
            className='inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800'
          >
            <RefreshCw size={16} aria-hidden='true' />
            আবার চেষ্টা করুন
          </button>

          <Link
            href='/'
            className='inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50'
          >
            <ArrowLeft size={16} aria-hidden='true' />
            হোম পেজে ফিরে যান
          </Link>
        </div>
      </div>
    </section>
  )
}
