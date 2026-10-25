import Link from 'next/link'
import { ArrowLeft, SearchX } from 'lucide-react'

// Friendly 404-style message with a link back home.
export default function NotFoundCard ({
  title = 'পেজটি খুঁজে পাওয়া যায়নি',
  message = 'আপনি যে পেজ বা পণ্যটি খুঁজছেন সেটি নেই, অথবা ঠিকানাটি ভুল।'
}) {
  return (
    <section className='bazar-container flex min-h-[60vh] items-center justify-center py-16'>
      <div className='max-w-lg text-center'>
        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-green-100 bg-green-50 text-green-800'>
          <SearchX size={30} aria-hidden='true' />
        </div>

        <p className='mt-6 text-sm font-bold text-green-700'>৪০৪</p>

        <h1 className='mt-2 text-3xl font-bold text-gray-900 sm:text-4xl'>
          {title}
        </h1>

        <p className='mt-4 text-sm leading-7 text-gray-500'>{message}</p>

        <Link
          href='/'
          className='mt-7 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800'
        >
          <ArrowLeft size={16} aria-hidden='true' />
          হোম পেজে ফিরে যান
        </Link>
      </div>
    </section>
  )
}
