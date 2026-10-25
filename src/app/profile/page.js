import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Pencil } from 'lucide-react'
import { getSession } from '../../lib/session'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'আমার প্রোফাইল | বাজার দর'
}

function formatMemberSince (value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Dhaka'
  }).format(date)
}

export default async function ProfilePage () {
  const session = await getSession()

  if (!session) redirect('/signin?reason=login-required&callbackURL=%2Fprofile')

  const { user } = session
  const initial = (user.name || user.email || '?').trim().charAt(0).toUpperCase()
  const memberSince = formatMemberSince(user.createdAt)

  return (
    <div className='bazar-container py-8 sm:py-12'>
      <h1 className='text-3xl font-bold text-gray-950 sm:text-4xl'>
        <span aria-hidden='true'>👤 </span>আমার প্রোফাইল
      </h1>

      <p className='mt-2 text-sm text-gray-600'>
        আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
      </p>

      <section className='mt-8 max-w-2xl overflow-hidden rounded-3xl border border-[var(--bazar-border)] bg-white shadow-sm'>
        <div className='flex items-center gap-4 bg-gradient-to-br from-green-50 to-amber-50 px-6 py-6 sm:px-8'>
          {user.image
            ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt=''
                className='h-16 w-16 rounded-full border-2 border-white object-cover shadow-sm'
              />
              )
            : (
              <span
                className='flex h-16 w-16 items-center justify-center rounded-full bg-green-700 text-2xl font-bold text-white shadow-sm'
                aria-hidden='true'
              >
                {initial}
              </span>
              )}

          <div className='min-w-0'>
            <p className='truncate text-xl font-bold text-gray-950'>{user.name}</p>
            <p className='truncate text-sm text-gray-600'>{user.email}</p>
          </div>
        </div>

        <div className='p-6 sm:p-8'>
          <h2 className='text-lg font-bold text-gray-900'>তথ্য</h2>

          <dl className='mt-4 divide-y divide-gray-100 text-sm'>
            <div className='flex flex-col gap-1 py-3 sm:flex-row sm:justify-between'>
              <dt className='font-semibold text-gray-500'>নাম</dt>
              <dd className='font-bold text-gray-900'>{user.name}</dd>
            </div>

            <div className='flex flex-col gap-1 py-3 sm:flex-row sm:justify-between'>
              <dt className='font-semibold text-gray-500'>ইমেইল</dt>
              <dd className='font-bold break-all text-gray-900'>{user.email}</dd>
            </div>

            {memberSince && (
              <div className='flex flex-col gap-1 py-3 sm:flex-row sm:justify-between'>
                <dt className='font-semibold text-gray-500'>যোগ দিয়েছেন</dt>
                <dd className='font-bold text-gray-900'>{memberSince}</dd>
              </div>
            )}
          </dl>

          <Link
            href='/profile/update'
            className='mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800'
          >
            <Pencil size={16} aria-hidden='true' />
            আপডেট
          </Link>
        </div>
      </section>
    </div>
  )
}
