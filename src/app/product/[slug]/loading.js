export default function ProductLoading () {
  return (
    <div className='bazar-container py-8 sm:py-12' role='status' aria-label='লোড হচ্ছে…'>
      <div className='mb-6 h-5 w-40 animate-pulse rounded bg-gray-100' />

      <div className='flex flex-col gap-6 rounded-3xl border border-green-100 bg-green-50/50 p-5 sm:flex-row sm:p-8'>
        <div className='h-28 w-28 shrink-0 animate-pulse rounded-3xl bg-white sm:h-36 sm:w-36' />

        <div className='flex-1 space-y-4'>
          <div className='h-10 w-2/3 animate-pulse rounded bg-white' />
          <div className='h-4 w-full animate-pulse rounded bg-white' />
          <div className='h-4 w-1/2 animate-pulse rounded bg-white' />
        </div>
      </div>

      <div className='mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className='h-28 animate-pulse rounded-2xl bg-gray-100' />
        ))}
      </div>

      <div className='mt-10 h-72 animate-pulse rounded-2xl bg-gray-100' />
    </div>
  )
}
