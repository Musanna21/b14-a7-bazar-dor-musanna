'use client'

import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ProductGrid from '../../../components/product-grid'

const SORT_OPTIONS = [
  { value: 'default', label: 'ডিফল্ট' },
  { value: 'price-asc', label: 'দাম: কম থেকে বেশি' },
  { value: 'price-desc', label: 'দাম: বেশি থেকে কম' }
]

export default function CategoryProducts ({ products }) {
  const [sortBy, setSortBy] = useState('default')

  // Prices are real numbers (never Bengali text), so numeric sorting is exact.
  const sorted = useMemo(() => {
    const list = [...products]

    if (sortBy === 'default') return list

    const direction = sortBy === 'price-asc' ? 1 : -1

    return list.sort((a, b) => {
      if (a.price == null && b.price == null) return 0
      if (a.price == null) return 1
      if (b.price == null) return -1

      return (a.price - b.price) * direction
    })
  }, [products, sortBy])

  return (
    <>
      <label className='mb-6 flex w-fit items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5'>
        <span className='text-sm font-semibold whitespace-nowrap text-gray-500'>
          সাজান:
        </span>

        <span className='relative flex items-center'>
          <select
            value={sortBy}
            onChange={event => setSortBy(event.target.value)}
            aria-label='পণ্য সাজান'
            className='cursor-pointer appearance-none bg-transparent pr-6 text-sm font-bold text-gray-800 outline-none'
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className='pointer-events-none absolute right-0 text-green-700'
            aria-hidden='true'
          />
        </span>
      </label>

      <ProductGrid products={sorted} />
    </>
  )
}
