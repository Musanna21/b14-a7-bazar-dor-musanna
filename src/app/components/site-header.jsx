'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, LogIn, UserPlus } from 'lucide-react'
import PriceTicker from './price-ticker'
import { getCategories } from '../lib/bazardor'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { authClient } from '../../lib/auth-client'
export default function SiteHeader () {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = authClient.useSession()

  async function handleSignOut () {
    try {
      const result = await authClient.signOut()

      if (result.error) {
        toast.error(result.error.message || 'Could not sign out.')
        return
      }

      toast.success('You have signed out.')
      router.refresh()
    } catch (error) {
      console.error('Sign out failed:', error)
      toast.error('Sign out failed. Please try again.')
    }
  }
  const pathname = usePathname
  const [date, setDate] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const currentDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Dhaka'
    }).format(new Date())

    setDate(currentDate)

    let active = true

    getCategories()
      .then(data => {
        if (active) setCategories(data)
      })
      .catch(error => {
        console.error('Could not load categories:', error)
      })

    return () => {
      active = false
    }
  }, [])

  function isCategoryActive (slug) {
    return pathname === `/category/${slug}`
  }

  const baseLink =
    'flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition'

  return (
    <header className='sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-xl'>
      {/* Top row: brand and authentication */}
      <div className='bazar-container flex min-h-20 items-center justify-between gap-3 py-3'>
        <Link
          href='/'
          className='flex min-w-0 items-center gap-3'
          aria-label='Bazar Dor homepage'
        >
          <Image
            src='/images/logo-icon.png'
            alt=''
            width={48}
            height={48}
            priority
            className='h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12'
          />

          <div className='min-w-0'>
            <p className='text-xl font-black tracking-tight text-gray-900 sm:text-2xl'>
              Bazar <span className='text-green-700'>Dor</span>
            </p>

            <p className='mt-0.5 max-w-52 truncate text-[10px] text-gray-500 sm:max-w-none sm:text-xs'>
              {date || 'Market prices at a glance'}
            </p>
          </div>
        </Link>

        <div className='flex shrink-0 items-center gap-2'>
          <Link
            href='/signin'
            className='inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-100 sm:px-3 sm:text-sm'
          >
            <LogIn size={16} />
            <span>Sign In</span>
          </Link>

          <Link
            href='/signup'
            className='inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-green-800 sm:px-4 sm:text-sm'
          >
            <UserPlus size={16} />
            <span>Sign Up</span>
          </Link>
        </div>
      </div>

      {/* Second row: categories */}
      <div className='border-t border-gray-100'>
        <nav
          aria-label='Product categories'
          className='bazar-container bazar-category-nav flex items-center gap-2 overflow-x-auto py-2'
        >
          <Link
            href='/'
            className={`${baseLink} ${
              pathname === '/'
                ? 'bg-green-100 text-green-800'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            All Products
          </Link>

          {categories.map(category => (
            <Link
              key={category.slug}
              href={`/category/${encodeURIComponent(category.slug)}`}
              className={`${baseLink} ${
                isCategoryActive(category.slug)
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {category.name}
              <ChevronRight size={13} className='opacity-50' />
            </Link>
          ))}
        </nav>
      </div>

      {/* Third row: scrolling market ticker */}
      <PriceTicker />
    </header>
  )
}
