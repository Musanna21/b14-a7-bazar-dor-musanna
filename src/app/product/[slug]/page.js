import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
import { getProductBySlug, summarizeMarkets } from '../../../lib/bazardor'
import {
  formatNumber,
  formatPercent,
  formatTaka,
  unitLabel
} from '../../../lib/format'
import { getSession } from '../../../lib/session'
import { ChangeBadge } from '../../../components/product-card'

export const dynamic = 'force-dynamic'

function safeDecode (value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function StatCard ({ label, value, note, tone = 'default' }) {
  const color =
    tone === 'low'
      ? 'text-green-700'
      : tone === 'high'
        ? 'text-red-600'
        : 'text-gray-900'

  return (
    <div className='rounded-2xl border border-[var(--bazar-border)] bg-white p-5'>
      <p className='text-sm font-semibold text-gray-500'>{label}</p>
      <p className={`mt-2 text-2xl font-bold sm:text-3xl ${color}`}>{value}</p>
      {note && <p className='mt-1.5 text-xs leading-5 text-gray-500'>{note}</p>}
    </div>
  )
}

function changeSentence (product) {
  if (product.trend === 'flat') {
    return 'গতকালের তুলনায় আজ দামে কোনো পরিবর্তন নেই'
  }

  const verb = product.trend === 'up' ? 'বেড়েছে' : 'কমেছে'
  const amount =
    product.difference != null && product.difference !== 0
      ? ` · ${formatTaka(Math.abs(product.difference))}`
      : ''

  return `গতকালের তুলনায় আজ দাম ${verb}${amount}`
}

export async function generateMetadata ({ params }) {
  const { slug } = await params

  return { title: `${safeDecode(slug)} | বাজার দর` }
}

export default async function ProductPage ({ params }) {
  const slug = safeDecode((await params).slug)

  // Protected route: send visitors to sign in, then bring them back here.
  const session = await getSession()

  if (!session) {
    const back = encodeURIComponent(`/product/${encodeURIComponent(slug)}`)

    redirect(`/signin?reason=login-required&callbackURL=${back}`)
  }

  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const stats = summarizeMarkets(product.markets)
  const marketCount = product.markets.length
  const unit = unitLabel(product.unit)

  const summaryLine =
    stats.min !== null
      ? `${formatNumber(marketCount)}টি বাজারে ${unit}-এর হিসাবে দাম ${formatTaka(stats.min)} থেকে ${formatTaka(stats.max)}।`
      : `${unit}-এর হিসাবে আজকের দাম ${formatTaka(product.price)}।`

  const trendColor =
    product.trend === 'up'
      ? 'text-green-700'
      : product.trend === 'down'
        ? 'text-red-600'
        : 'text-gray-600'

  const history = [
    { label: 'আজ', value: product.price },
    { label: 'গতকাল', value: product.yesterday },
    { label: 'গত সপ্তাহ', value: product.lastWeek },
    { label: 'গত মাস', value: product.lastMonth }
  ].filter(item => item.value !== null)

  return (
    <div className='bazar-container py-8 sm:py-12'>
      <Link
        href='/'
        className='mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-green-800'
      >
        <ArrowLeft size={16} aria-hidden='true' />
        হোম পেজে ফিরে যান
      </Link>

      {/* Summary */}
      <section className='flex flex-col gap-6 rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-amber-50 p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-8'>
        <span
          className='flex h-28 w-28 shrink-0 items-center justify-center self-start rounded-3xl bg-white text-7xl shadow-sm sm:h-36 sm:w-36 sm:self-center sm:text-8xl'
          aria-hidden='true'
        >
          {product.emoji}
        </span>

        <div className='min-w-0 flex-1'>
          <h1 className='text-3xl font-bold text-gray-950 sm:text-5xl'>
            {product.name}
          </h1>

          <p className='mt-3 text-sm leading-7 text-gray-600 sm:text-base'>
            {summaryLine}
          </p>

          <div className='mt-4 flex flex-wrap items-center gap-2'>
            {product.category && (
              <Link
                href={`/category/${encodeURIComponent(product.category)}`}
                className='rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-800 transition hover:bg-green-100'
              >
                {product.categoryIcon} {product.categoryName}
              </Link>
            )}

            {unit && (
              <span className='rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600'>
                {unit}
              </span>
            )}
          </div>

          <div className='mt-5 flex flex-wrap items-end gap-x-6 gap-y-2'>
            <div>
              <p className='text-xs font-semibold text-gray-500'>আজকের দাম</p>
              <p className='text-3xl font-bold text-gray-950'>
                {formatTaka(product.price)}
              </p>
            </div>

            <div className='pb-1'>
              <ChangeBadge trend={product.trend} percent={product.changePercent} />
            </div>
          </div>

          <p className={`mt-3 text-sm font-semibold ${trendColor}`}>
            {changeSentence(product)}
            {product.trend !== 'flat' && product.changePercent != null
              ? ` (${formatPercent(product.changePercent)})`
              : ''}
          </p>
        </div>
      </section>

      {/* Price summary */}
      <section className='mt-10 sm:mt-12'>
        <h2 className='mb-5 text-2xl font-bold text-gray-900'>দামের সারসংক্ষেপ</h2>

        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          <StatCard label='সর্বনিম্ন দাম' value={formatTaka(stats.min)} tone='low' />
          <StatCard label='গড় দাম' value={formatTaka(stats.avg)} note='প্রতিটি বাজারের সর্বনিম্ন-সর্বাধিক দামের গড়।' />
          <StatCard label='সর্বাধিক দাম' value={formatTaka(stats.max)} tone='high' />
        </div>

        {stats.cheapest && stats.priciest && (
          <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <StatCard
              label='সবচেয়ে কম দামের বাজার'
              value={stats.cheapest.market}
              note={`${stats.cheapest.division} · গড় ${formatTaka(stats.cheapest.avg)}`}
              tone='low'
            />

            <StatCard
              label='সবচেয়ে বেশি দামের বাজার'
              value={stats.priciest.market}
              note={`${stats.priciest.division} · গড় ${formatTaka(stats.priciest.avg)}`}
              tone='high'
            />
          </div>
        )}
      </section>

      {/* Price history */}
      {history.length > 1 && (
        <section className='mt-10 sm:mt-12'>
          <h2 className='mb-5 text-2xl font-bold text-gray-900'>দামের ইতিহাস</h2>

          <div className='grid grid-cols-2 gap-3 lg:grid-cols-4'>
            {history.map(item => (
              <div
                key={item.label}
                className='rounded-xl border border-gray-200 bg-white p-4'
              >
                <p className='text-xs font-semibold text-gray-500'>{item.label}</p>
                <p className='mt-2 text-lg font-bold text-gray-900'>
                  {formatTaka(item.value)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Prices by market */}
      <section className='mt-10 sm:mt-12'>
        <div className='mb-5 flex items-center gap-3'>
          <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800'>
            <MapPin size={21} aria-hidden='true' />
          </span>

          <div>
            <h2 className='text-2xl font-bold text-gray-900'>
              বাজারভিত্তিক আজকের দাম
            </h2>

            {marketCount > 0 && (
              <p className='text-sm text-gray-500'>
                {formatNumber(marketCount)} টি বাজার অন্তর্ভুক্ত
              </p>
            )}
          </div>
        </div>

        {marketCount > 0
          ? (
            <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white'>
              <div className='overflow-x-auto'>
                <table className='w-full min-w-[34rem] border-collapse text-left text-sm'>
                  <thead className='bg-green-50 text-gray-600'>
                    <tr>
                      <th scope='col' className='px-4 py-3.5 font-bold sm:px-5'>বাজার</th>
                      <th scope='col' className='px-4 py-3.5 font-bold sm:px-5'>বিভাগ</th>
                      <th scope='col' className='px-4 py-3.5 font-bold sm:px-5'>সর্বনিম্ন</th>
                      <th scope='col' className='px-4 py-3.5 font-bold sm:px-5'>সর্বাধিক</th>
                      <th scope='col' className='px-4 py-3.5 font-bold sm:px-5'>গড়</th>
                    </tr>
                  </thead>

                  <tbody>
                    {product.markets.map((market, index) => (
                      <tr
                        key={`${market.market}-${index}`}
                        className='border-t border-gray-100 transition hover:bg-green-50/40'
                      >
                        <td className='px-4 py-3.5 font-bold text-gray-900 sm:px-5'>
                          {market.market}
                        </td>
                        <td className='px-4 py-3.5 text-gray-600 sm:px-5'>
                          {market.division || '—'}
                        </td>
                        <td className='px-4 py-3.5 font-semibold text-green-700 sm:px-5'>
                          {formatTaka(market.min)}
                        </td>
                        <td className='px-4 py-3.5 font-semibold text-red-600 sm:px-5'>
                          {formatTaka(market.max)}
                        </td>
                        <td className='px-4 py-3.5 font-semibold text-gray-800 sm:px-5'>
                          {formatTaka(market.avg)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )
          : (
            <div className='rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center text-sm text-gray-500'>
              এই পণ্যের বাজারভিত্তিক দামের তথ্য এখন পাওয়া যাচ্ছে না।
            </div>
            )}
      </section>
    </div>
  )
}
