import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ShoppingBasket } from 'lucide-react'
import {
  getCategoryBySlug,
  getProductsByCategory
} from '../../../lib/bazardor'
import { formatNumber } from '../../../lib/format'
import CategoryProducts from './category-products'

export const dynamic = 'force-dynamic'

function safeDecode (value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

export async function generateMetadata ({ params }) {
  const { slug } = await params

  try {
    const category = await getCategoryBySlug(safeDecode(slug))

    return { title: category ? `${category.name} | বাজার দর` : 'বাজার দর' }
  } catch {
    return { title: 'বাজার দর' }
  }
}

export default async function CategoryPage ({ params }) {
  const slug = safeDecode((await params).slug)

  const category = await getCategoryBySlug(slug)

  // Unknown category -> the friendly 404 page.
  if (!category) notFound()

  const products = await getProductsByCategory(slug)

  return (
    <section className='bazar-container min-h-[60vh] py-8 sm:py-12'>
      <Link
        href='/'
        className='mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-green-800'
      >
        <ArrowLeft size={16} aria-hidden='true' />
        হোম পেজে ফিরে যান
      </Link>

      <div className='mb-8 flex items-center gap-4'>
        <span
          className='flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-green-100 bg-green-50 text-4xl'
          aria-hidden='true'
        >
          {category.icon || '🛒'}
        </span>

        <div>
          <h1 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
            {category.name}
          </h1>

          <p className='mt-1 text-sm text-gray-500'>
            এই বিভাগে {formatNumber(products.length)}টি পণ্য
          </p>
        </div>
      </div>

      {products.length > 0
        ? (
          <CategoryProducts products={products} />
          )
        : (
          <div className='rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center'>
            <ShoppingBasket
              size={32}
              className='mx-auto mb-4 text-gray-400'
              aria-hidden='true'
            />

            <h2 className='text-xl font-bold text-gray-900'>
              এই বিভাগে এখন কোনো পণ্য নেই
            </h2>

            <Link
              href='/'
              className='mt-6 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800'
            >
              <ArrowLeft size={16} aria-hidden='true' />
              হোম পেজে ফিরে যান
            </Link>
          </div>
          )}
    </section>
  )
}
