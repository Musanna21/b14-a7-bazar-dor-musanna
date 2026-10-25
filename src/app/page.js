import { Suspense } from 'react'
import Image from 'next/image'
import { ArrowDown } from 'lucide-react'
import HomeProducts from '../components/home-products'
import { SectionSkeleton } from '../components/skeletons'
import { getProducts } from '../lib/bazardor'
import { formatNumber } from '../lib/format'

// Prices come from a live API, so render on request (the API responses
// themselves are cached for a few minutes).
export const dynamic = 'force-dynamic'

async function HeroStats () {
  let products = []

  try {
    products = await getProducts()
  } catch {
    return null
  }

  if (products.length === 0) return null

  const marketCount = Math.max(...products.map(product => product.markets.length))

  return (
    <div className='mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-green-200/70 pt-6'>
      <p className='text-sm text-gray-600'>
        <span className='text-2xl font-bold text-green-800'>
          {formatNumber(products.length)}
        </span>{' '}
        টি নিত্যদিনের পণ্য
      </p>

      {marketCount > 0 && (
        <p className='text-sm text-gray-600'>
          <span className='text-2xl font-bold text-green-800'>
            {formatNumber(marketCount)}
          </span>{' '}
          টি বাজার অন্তর্ভুক্ত
        </p>
      )}
    </div>
  )
}

export default function HomePage () {
  return (
    <>
      {/* Hero / banner */}
      <section className='relative overflow-hidden border-b border-green-100 bg-gradient-to-br from-[#f3f9ed] via-[#fffdf5] to-[#e3f2e6]'>
        <div className='bazar-container grid items-center gap-8 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:py-16'>
          <div className='relative z-10'>
            <p className='inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-1.5 text-xs font-bold text-green-800 shadow-sm sm:text-sm'>
              <span aria-hidden='true'>🍃</span>
              প্রতিদিনের বাজারদর
            </p>

            <h1 className='mt-5 text-4xl leading-[1.2] font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl'>
              আজকের বাজারের দাম{' '}
              <span className='text-green-700'>এক নজরে</span>
            </h1>

            <p className='mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base'>
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক
              জায়গায়।
            </p>

            {/* An anchor link: scrolls to the products section on this page */}
            <a
              href='#সব-পণ্য'
              className='mt-7 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-green-800 sm:text-base'
            >
              সব পণ্য দেখুন
              <ArrowDown size={18} aria-hidden='true' />
            </a>

            <Suspense fallback={null}>
              <HeroStats />
            </Suspense>
          </div>

          <div className='relative mx-auto w-full max-w-md lg:max-w-none'>
            <div className='absolute inset-8 rounded-full bg-green-300/30 blur-3xl' />

            <div className='relative overflow-hidden rounded-[2rem] border border-white bg-white/70 p-4 shadow-xl shadow-green-900/5 sm:p-6'>
              <Image
                src='/images/bazar-hero.png'
                alt='সবজি ভর্তি বাজারের ঝুড়ি'
                width={900}
                height={700}
                priority
                className='relative z-10 h-auto w-full object-contain'
              />
            </div>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <>
            <SectionSkeleton count={4} />
            <SectionSkeleton count={4} />
            <SectionSkeleton count={8} />
          </>
        }
      >
        <HomeProducts />
      </Suspense>
    </>
  )
}
