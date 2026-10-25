'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const baseClass =
  'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition'

const activeClass = 'bg-green-700 text-white'
const idleClass = 'text-gray-600 hover:bg-green-50 hover:text-green-800'

export default function NavLinks ({ categories }) {
  const pathname = usePathname()

  function isCategoryActive (slug) {
    return (
      pathname === `/category/${slug}` ||
      pathname === `/category/${encodeURIComponent(slug)}`
    )
  }

  return (
    <nav
      aria-label='পণ্যের বিভাগ'
      className='bazar-container bazar-category-nav flex items-center gap-1.5 overflow-x-auto py-2'
    >
      <Link
        href='/'
        aria-current={pathname === '/' ? 'page' : undefined}
        className={`${baseClass} ${pathname === '/' ? activeClass : idleClass}`}
      >
        হোম
      </Link>

      {categories.map(category => {
        const active = isCategoryActive(category.slug)

        return (
          <Link
            key={category.slug}
            href={`/category/${encodeURIComponent(category.slug)}`}
            aria-current={active ? 'page' : undefined}
            className={`${baseClass} ${active ? activeClass : idleClass}`}
          >
            {category.icon && <span aria-hidden='true'>{category.icon}</span>}
            {category.name}
          </Link>
        )
      })}
    </nav>
  )
}
