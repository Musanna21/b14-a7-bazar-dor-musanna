import { ProductGridSkeleton } from '../../../components/skeletons'

export default function CategoryLoading () {
  return (
    <section className='bazar-container min-h-[60vh] py-8 sm:py-12'>
      <div className='mb-8 flex items-center gap-4'>
        <span className='h-16 w-16 animate-pulse rounded-2xl bg-green-50' />

        <div className='space-y-2'>
          <span className='block h-8 w-44 animate-pulse rounded bg-gray-100' />
          <span className='block h-4 w-28 animate-pulse rounded bg-gray-100' />
        </div>
      </div>

      <ProductGridSkeleton count={8} />
    </section>
  )
}
