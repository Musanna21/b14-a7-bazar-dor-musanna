'use client'

import './globals.css'
import { useEffect } from 'react'

// Last-resort error page: it replaces the whole document when the root
// layout itself fails.
export default function GlobalError ({ error, reset }) {
  useEffect(() => {
    console.error('Bazar Dor root error:', error)
  }, [error])

  return (
    <html lang='bn'>
      <body className='flex min-h-screen items-center justify-center bg-[#f8faf5] px-5 text-gray-900'>
        <main className='max-w-md text-center'>
          <h1 className='text-3xl font-bold'>বাজার দর-এ সমস্যা হয়েছে</h1>

          <p className='mt-4 text-sm leading-6 text-gray-600'>
            অ্যাপটি লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।
          </p>

          <button
            type='button'
            onClick={() => reset()}
            className='mt-6 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800'
          >
            আবার চেষ্টা করুন
          </button>
        </main>
      </body>
    </html>
  )
}
