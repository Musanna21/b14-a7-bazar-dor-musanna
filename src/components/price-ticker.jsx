import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { formatPerUnit, formatPercent } from '../lib/format'

function TickerItem ({ product }) {
  const color =
    product.trend === 'up'
      ? 'text-green-700'
      : product.trend === 'down'
        ? 'text-red-600'
        : 'text-gray-500'

  const Icon =
    product.trend === 'up'
      ? ArrowUpRight
      : product.trend === 'down'
        ? ArrowDownRight
        : Minus

  return (
    <div className='flex shrink-0 items-center gap-2.5 px-5 py-2.5 text-sm'>
      <span className='text-lg' aria-hidden='true'>
        {product.emoji}
      </span>

      <span className='font-semibold whitespace-nowrap text-gray-800'>
        {product.name}
      </span>

      <span className='font-bold whitespace-nowrap text-gray-950'>
        {formatPerUnit(product.price, product.unit)}
      </span>

      <span
        className={`inline-flex items-center gap-0.5 text-xs font-bold whitespace-nowrap ${color}`}
      >
        <Icon size={14} aria-hidden='true' />
        {formatPercent(product.changePercent ?? 0)}
      </span>

      <span className='text-green-200' aria-hidden='true'>
        |
      </span>
    </div>
  )
}

export default function PriceTicker ({ products }) {
  if (products.length === 0) {
    return (
      <div className='border-t border-green-100 bg-green-50'>
        <p className='bazar-container py-2.5 text-xs text-gray-600'>
          দামের তথ্য এখন পাওয়া যাচ্ছে না।
        </p>
      </div>
    )
  }

  return (
    <div className='border-t border-green-100 bg-green-50'>
      <div className='bazar-ticker-viewport' aria-label='আজকের পণ্যের দাম'>
        <div className='bazar-ticker-track'>
          {[0, 1].map(copy => (
            <div
              key={copy}
              className='flex shrink-0'
              aria-hidden={copy === 1 ? 'true' : undefined}
            >
              {products.map(product => (
                <TickerItem key={product.id} product={product} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
