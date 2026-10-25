import { GRID_CLASS } from './product-grid'

export function ProductCardSkeleton () {
  return (
    <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white'>
      <div className='h-32 animate-pulse bg-green-50 sm:h-36' />

      <div className='space-y-3 p-4'>
        <div className='h-4 w-3/4 animate-pulse rounded bg-gray-100' />
        <div className='h-3 w-1/3 animate-pulse rounded bg-gray-100' />

        <div className='flex items-end justify-between border-t border-gray-100 pt-3'>
          <div className='h-6 w-24 animate-pulse rounded bg-gray-100' />
          <div className='h-6 w-16 animate-pulse rounded-full bg-gray-100' />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton ({ count = 8 }) {
  return (
    <div className={GRID_CLASS} role='status' aria-label='লোড হচ্ছে…'>
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

export function SectionSkeleton ({ count = 4 }) {
  return (
    <section className='bazar-container py-10 sm:py-12'>
      <div className='mb-6 h-8 w-56 animate-pulse rounded bg-gray-100' />
      <ProductGridSkeleton count={count} />
    </section>
  )
}
