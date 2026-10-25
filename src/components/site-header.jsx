import { Suspense } from 'react'
import Link from 'next/link'
import { formatBanglaDate } from '../lib/format'
import { getCategories, getProducts } from '../lib/bazardor'
import AuthButtons from './auth-buttons'
import NavLinks from './nav-links'
import PriceTicker from './price-ticker'

async function CategoryNav () {
  let categories = []

  try {
    categories = await getCategories()
  } catch (error) {
    console.error('Could not load categories for the navbar:', error)
  }

  return <NavLinks categories={categories} />
}

async function TickerLoader () {
  let products = []

  try {
    products = await getProducts()
  } catch (error) {
    console.error('Could not load products for the ticker:', error)
  }

  return <PriceTicker products={products} />
}

function NavSkeleton () {
  return (
    <div className='bazar-container flex gap-2 py-2' aria-hidden='true'>
      {Array.from({ length: 6 }, (_, index) => (
        <span
          key={index}
          className='h-9 w-20 shrink-0 animate-pulse rounded-full bg-gray-100'
        />
      ))}
    </div>
  )
}

function TickerSkeleton () {
  return (
    <div
      className='border-t border-green-100 bg-green-50'
      role='status'
      aria-label='দাম লোড হচ্ছে'
    >
      <div className='bazar-container py-3'>
        <span className='block h-5 w-2/3 animate-pulse rounded bg-green-100' />
      </div>
    </div>
  )
}

export default function SiteHeader () {
  const today = formatBanglaDate()

  return (
    <header className='sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-xl'>
      {/* Row 1: logo + date, and the authentication buttons */}
      <div className='bazar-container flex min-h-16 items-center justify-between gap-3 py-2.5'>
        <Link
          href='/'
          aria-label='বাজার দর - হোম পেজ'
          className='flex min-w-0 items-center gap-3'
        >
          <span
            className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-2xl'
            aria-hidden='true'
          >
            🛒
          </span>

          <span className='min-w-0'>
            <span className='block text-xl leading-tight font-bold text-green-800 sm:text-2xl'>
              বাজার দর
            </span>

            <span className='block truncate text-[11px] leading-tight text-gray-500 sm:text-xs'>
              {today}
            </span>
          </span>
        </Link>

        <AuthButtons />
      </div>

      {/* Row 2: category links */}
      <div className='border-t border-gray-100'>
        <Suspense fallback={<NavSkeleton />}>
          <CategoryNav />
        </Suspense>
      </div>

      {/* Row 3: price ticker */}
      <Suspense fallback={<TickerSkeleton />}>
        <TickerLoader />
      </Suspense>
    </header>
  )
}
