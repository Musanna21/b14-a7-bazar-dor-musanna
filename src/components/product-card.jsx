import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { formatPercent, formatTaka, unitLabel } from '../lib/format'

export function ChangeBadge ({ trend, percent }) {
  if (trend === 'up') {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-800'>
        <ArrowUpRight size={13} aria-hidden='true' />▲ {formatPercent(percent)}
      </span>
    )
  }

  if (trend === 'down') {
    return (
      <span className='inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700'>
        <ArrowDownRight size={13} aria-hidden='true' />▼ {formatPercent(percent)}
      </span>
    )
  }

  return (
    <span className='inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600'>
      <Minus size={13} aria-hidden='true' />—০.০%
    </span>
  )
}

export default function ProductCard ({ product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(product.slug)}`}
      aria-label={`${product.name} - বিস্তারিত দেখুন`}
      className='group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--bazar-border)] bg-white transition duration-200 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg hover:shadow-green-900/5'
    >
      <div className='flex h-32 items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 sm:h-36'>
        <span
          className='text-6xl transition-transform duration-300 group-hover:scale-110'
          aria-hidden='true'
        >
          {product.emoji}
        </span>
      </div>

      <div className='flex flex-1 flex-col p-4'>
        <h3 className='text-base leading-snug font-bold text-gray-900 transition group-hover:text-green-800'>
          {product.name}
        </h3>

        <p className='mt-0.5 text-xs text-gray-500'>{unitLabel(product.unit)}</p>

        <div className='mt-4 flex flex-wrap items-end justify-between gap-2 border-t border-gray-100 pt-3'>
          <div>
            <p className='text-[11px] font-semibold text-gray-500'>আজকের দাম</p>

            <p className='mt-0.5 text-xl leading-tight font-bold text-gray-900'>
              {formatTaka(product.price)}
            </p>
          </div>

          <ChangeBadge trend={product.trend} percent={product.changePercent} />
        </div>
      </div>
    </Link>
  )
}
