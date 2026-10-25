import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, Minus, ExternalLink } from 'lucide-react'
import { formatPrice } from '../lib/bazardor'
import ProductImage from './product-image'

function formatUnit (unit) {
  if (!unit) return 'Unit not specified'

  if (/^(per\b|\/)/i.test(unit.trim())) {
    return unit
  }

  return `Per ${unit}`
}

function PriceChangeBadge ({ product }) {
  const { changePercent, trend } = product

  if (changePercent == null) {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500'>
        <Minus size={13} />
        Change unavailable
      </span>
    )
  }

  if (changePercent === 0) {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600'>
        <Minus size={13} />
        0.0%
      </span>
    )
  }

  const isUp = trend === 'up'
  const Icon = isUp ? ArrowUpRight : ArrowDownRight

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
        isUp ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
      }`}
    >
      <Icon size={13} />
      {Math.abs(changePercent).toLocaleString('en-US', {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1
      })}
      %
    </span>
  )
}

export default function ProductCard ({ product }) {
  const productHref = `/product/${encodeURIComponent(
    product.slug || product.id
  )}`

  return (
    <Link
      href={productHref}
      className='group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--bazar-border)] bg-white transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg hover:shadow-green-900/5'
      aria-label={`View ${product.name} details`}
    >
      {/* Product image or illustration */}
      <div className='relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 to-amber-50 sm:h-44'>
        <span className='pointer-events-none text-7xl transition-transform duration-300 group-hover:scale-110'>
          {product.emoji}
        </span>

        <ProductImage
          src={product.image}
          alt={product.name}
          className='absolute inset-0 h-full w-full object-cover'
        />

        {product.category && (
          <span className='absolute top-3 left-3 max-w-[75%] truncate rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[10px] font-bold text-green-800 shadow-sm'>
            {product.category}
          </span>
        )}

        <span className='absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-green-700 opacity-0 shadow-sm transition group-hover:opacity-100'>
          <ExternalLink size={15} />
        </span>
      </div>

      {/* Product details */}
      <div className='flex flex-1 flex-col p-4 sm:p-5'>
        <h3 className='text-base font-extrabold leading-snug text-gray-900 transition group-hover:text-green-800'>
          {product.name}
        </h3>

        <p className='mt-1 text-xs text-gray-500'>{formatUnit(product.unit)}</p>

        <div className='mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-gray-100 pt-4'>
          <div>
            <p className='text-[10px] font-bold uppercase tracking-wider text-gray-500'>
              Today&apos;s price
            </p>

            <p className='mt-1 text-xl font-black tracking-tight text-gray-900'>
              {formatPrice(product.price)}
            </p>
          </div>

          <PriceChangeBadge product={product} />
        </div>
      </div>
    </Link>
  )
}
