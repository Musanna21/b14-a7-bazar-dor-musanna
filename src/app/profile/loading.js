export default function ProfileLoading () {
  return (
    <div className='bazar-container py-8 sm:py-12' role='status' aria-label='লোড হচ্ছে…'>
      <div className='h-10 w-56 animate-pulse rounded bg-gray-100' />
      <div className='mt-8 h-72 max-w-2xl animate-pulse rounded-3xl bg-gray-100' />
    </div>
  )
}
