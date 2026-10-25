'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { formatNumber } from '../lib/format'
import ProductGrid from './product-grid'

export default function AllProducts ({ products }) {
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    const text = query.trim().toLowerCase()

    if (!text) return products

    return products.filter(product =>
      `${product.name} ${product.categoryName}`.toLowerCase().includes(text)
    )
  }, [products, query])

  return (
    <>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <p className='text-sm text-gray-500'>
          মোট {formatNumber(visible.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        <label className='flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 sm:w-72'>
          <Search size={16} className='shrink-0 text-gray-400' aria-hidden='true' />

          <input
            type='search'
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder='পণ্যের নাম লিখুন…'
            aria-label='পণ্য খুঁজুন'
            className='min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400'
          />
        </label>
      </div>

      {visible.length > 0
        ? (
          <ProductGrid products={visible} />
          )
        : (
          <div className='rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center'>
            <p className='font-semibold text-gray-700'>
              “{query.trim()}” নামে কোনো পণ্য পাওয়া যায়নি।
            </p>

            <button
              type='button'
              onClick={() => setQuery('')}
              className='mt-4 rounded-lg bg-green-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-800'
            >
              আবার লিখুন
            </button>
          </div>
          )}
    </>
  )
}
