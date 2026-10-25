'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { authClient } from '../lib/auth-client'

export default function AuthButtons () {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  async function handleSignOut () {
    try {
      const result = await authClient.signOut()

      if (result?.error) {
        toast.error(result.error.message || 'সাইন আউট করা যায়নি।')
        return
      }

      toast.success('আপনি সাইন আউট করেছেন।')

      // Go home. (No router.refresh() here: it would cancel this navigation,
      // and every page is rendered fresh on each visit anyway.)
      router.replace('/')
    } catch (error) {
      console.error('Sign out failed:', error)
      toast.error('সাইন আউট করা যায়নি। আবার চেষ্টা করুন।')
    }
  }

  if (isPending) {
    return (
      <div className='flex items-center gap-2' aria-hidden='true'>
        <span className='h-9 w-20 animate-pulse rounded-lg bg-gray-100' />
        <span className='h-9 w-20 animate-pulse rounded-lg bg-gray-100' />
      </div>
    )
  }

  if (session?.user) {
    return (
      <div className='flex shrink-0 items-center gap-2'>
        <Link
          href='/profile'
          className='inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-800 sm:px-3 sm:text-sm'
        >
          <span aria-hidden='true'>👤</span>
          <span className='hidden sm:inline'>আমার প্রোফাইল</span>
          <span className='sm:hidden'>প্রোফাইল</span>
        </Link>

        <button
          type='button'
          onClick={handleSignOut}
          className='inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:text-sm'
        >
          <LogOut size={15} />
          সাইন আউট
        </button>
      </div>
    )
  }

  return (
    <div className='flex shrink-0 items-center gap-2'>
      <Link
        href='/signin'
        className='inline-flex items-center rounded-lg px-3 py-2 text-xs font-bold text-gray-700 transition hover:bg-green-50 hover:text-green-800 sm:text-sm'
      >
        সাইন ইন
      </Link>

      <Link
        href='/signup'
        className='inline-flex items-center rounded-lg bg-green-700 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-green-800 sm:text-sm'
      >
        সাইন আপ
      </Link>
    </div>
  )
}
