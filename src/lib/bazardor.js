// Data layer for the Bazar Dor API.
//
// Product fields used: id, slug, nameBn, category, categoryNameBn,
// categoryIcon, unit, image (an emoji), today, yesterday, lastWeek,
// lastMonth, change { dir, pct } and markets [{ market, division, min, max }].
//
// Everything is normalised here so no component has to guess field names.

const API_BASES = [
  process.env.BAZARDOR_API_URL,
  'https://api.api-store.workers.dev/api/bazardor',
  'https://api.abcz.workers.dev/api/bazardor',
  'https://openapi.programming-hero.com/api/bazardor'
].filter(Boolean)

const REQUEST_TIMEOUT_MS = 6000
const REVALIDATE_SECONDS = 300

export class ApiUnavailableError extends Error {
  constructor (message = 'The Bazar Dor price API is unavailable.') {
    super(message)
    this.name = 'ApiUnavailableError'
  }
}

/* ------------------------------ helpers ------------------------------ */

function slugify (value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const BN_DIGITS = '০১২৩৪৫৬৭৮৯'

/** Accepts 148, "148", "১৪৮", "1,850" ... returns a number or null. */
function toNumber (value) {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null
  if (value == null || typeof value === 'object') return null

  const text = String(value)
    .replace(/[০-৯]/g, digit => String(BN_DIGITS.indexOf(digit)))
    .replace(/,/g, '')
    .replace(/[^\d.-]/g, '')

  if (!text || text === '-' || text === '.') return null

  const result = Number(text)

  return Number.isFinite(result) ? result : null
}

function firstNumber (item, keys) {
  for (const key of keys) {
    const value = toNumber(item?.[key])

    if (value !== null) return value
  }

  return null
}

function isUrl (value) {
  return typeof value === 'string' && /^(https?:)?\/\/|^\//.test(value.trim())
}

/** Finds the array inside { data: [...] }, { products: [...] }, [...] ... */
function findArray (payload, depth = 0) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object' || depth > 4) return []

  for (const key of ['data', 'products', 'categories', 'results', 'items']) {
    if (payload[key] === undefined) continue

    const result = findArray(payload[key], depth + 1)

    if (result.length > 0) return result
  }

  return []
}

/** Finds a single object inside { data: {...} }, { product: {...} } ... */
function findObject (payload, depth = 0) {
  if (!payload || typeof payload !== 'object' || depth > 4) return null
  if (Array.isArray(payload)) return payload[0] ? findObject(payload[0], depth + 1) : null

  if (payload.id != null || payload.slug != null || payload.nameBn != null) {
    return payload
  }

  for (const key of ['data', 'product', 'item', 'result']) {
    const found = findObject(payload[key], depth + 1)

    if (found) return found
  }

  return null
}

/**
 * Fetches a path, trying each API base in turn.
 *  - returns the parsed JSON on success
 *  - returns null when the API answers 404 (the thing does not exist)
 *  - throws ApiUnavailableError when every base fails
 */
async function fetchJson (path) {
  for (const baseUrl of API_BASES) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
      })

      if (response.status === 404) return null
      if (!response.ok) continue

      return await response.json()
    } catch (error) {
      console.warn(`Bazar Dor API request failed: ${baseUrl}${path}`, error?.message)
    }
  }

  throw new ApiUnavailableError()
}

/* ---------------------------- normalisation --------------------------- */

function normalizeMarket (raw) {
  const min = firstNumber(raw, ['min', 'minPrice', 'min_price'])
  const max = firstNumber(raw, ['max', 'maxPrice', 'max_price'])

  return {
    market: String(raw?.market ?? raw?.name ?? raw?.nameBn ?? 'বাজার'),
    division: String(raw?.division ?? raw?.divisionBn ?? ''),
    min,
    max,
    avg: min !== null && max !== null ? (min + max) / 2 : (min ?? max)
  }
}

function directionFrom (text) {
  const value = String(text ?? '').toLowerCase()

  if (/up|rise|increase|high|\+/.test(value)) return 1
  if (/down|fall|decrease|drop|low|-/.test(value)) return -1

  return 0
}

export function normalizeProduct (raw) {
  if (!raw || typeof raw !== 'object') return null

  const name = raw.nameBn ?? raw.name_bn ?? raw.name ?? raw.nameEn ?? raw.title

  if (!name) return null

  const id = raw.id ?? raw._id ?? raw.productId
  const slug = String(raw.slug ?? id ?? slugify(name))

  const today = firstNumber(raw, ['today', 'todayPrice', 'price'])
  const yesterday = firstNumber(raw, ['yesterday', 'yesterdayPrice'])

  // Direction and size of today's change. The API's own `change` wins;
  // otherwise it is worked out from today's and yesterday's price.
  const change = raw.change && typeof raw.change === 'object' ? raw.change : {}
  const apiPct = toNumber(change.pct ?? change.percent ?? raw.changePercent)
  const difference =
    today !== null && yesterday !== null ? today - yesterday : null

  let changePercent = null

  if (apiPct !== null) {
    const direction =
      directionFrom(change.dir ?? change.direction) ||
      Math.sign(difference ?? 0) ||
      Math.sign(apiPct)

    changePercent = Math.abs(apiPct) * direction
  } else if (difference !== null && yesterday > 0) {
    changePercent = (difference / yesterday) * 100
  }

  // Treat anything that rounds to 0.0% as "no change".
  const rounded = changePercent === null ? null : Math.round(changePercent * 10) / 10
  const trend = rounded === null || rounded === 0 ? 'flat' : rounded > 0 ? 'up' : 'down'

  const markets = (
    Array.isArray(raw.markets)
      ? raw.markets
      : Array.isArray(raw.marketPrices)
        ? raw.marketPrices
        : []
  ).map(normalizeMarket)

  const icon = raw.categoryIcon ?? raw.category_icon ?? ''
  const image = typeof raw.image === 'string' ? raw.image.trim() : ''
  const category = String(raw.category?.slug ?? raw.category ?? '')

  return {
    id: String(id ?? slug),
    slug,
    name: String(name),
    category,
    categoryName: String(raw.categoryNameBn ?? raw.category?.nameBn ?? category),
    categoryIcon: String(icon),
    unit: String(raw.unit ?? ''),
    // `image` is an emoji in this API. A URL is kept separately.
    emoji: image && !isUrl(image) ? image : icon || '🛒',
    imageUrl: isUrl(image) ? image : '',
    price: today,
    yesterday,
    lastWeek: firstNumber(raw, ['lastWeek', 'last_week']),
    lastMonth: firstNumber(raw, ['lastMonth', 'last_month']),
    difference,
    changePercent: rounded === null ? null : changePercent,
    trend,
    markets
  }
}

export function normalizeCategory (raw) {
  if (!raw || typeof raw !== 'object') return null

  const name = raw.nameBn ?? raw.name_bn ?? raw.name ?? raw.title

  if (!name) return null

  return {
    slug: String(raw.slug ?? raw.id ?? slugify(name)),
    name: String(name),
    icon: String(raw.icon ?? raw.emoji ?? raw.categoryIcon ?? '')
  }
}

/* ------------------------------ public API ---------------------------- */

export async function getProducts () {
  const payload = await fetchJson('/products')

  return findArray(payload).map(normalizeProduct).filter(Boolean)
}

export async function getCategories () {
  let categories = []

  try {
    const payload = await fetchJson('/categories')

    categories = findArray(payload).map(normalizeCategory).filter(Boolean)
  } catch {
    // Fall through: categories can also be derived from the products.
  }

  if (categories.length === 0) {
    const products = await getProducts()

    categories = products
      .filter(product => product.category)
      .map(product => ({
        slug: product.category,
        name: product.categoryName,
        icon: product.categoryIcon
      }))
  }

  // Remove duplicates but keep the API's order.
  return Array.from(new Map(categories.map(item => [item.slug, item])).values())
}

export async function getCategoryBySlug (slug) {
  const categories = await getCategories()

  return categories.find(category => category.slug === slug) ?? null
}

export async function getProductsByCategory (slug) {
  try {
    const payload = await fetchJson(`/products?category=${encodeURIComponent(slug)}`)
    const filtered = findArray(payload).map(normalizeProduct).filter(Boolean)

    if (filtered.length > 0) return filtered
  } catch {
    // Fall back to filtering the full list below.
  }

  const products = await getProducts()

  return products.filter(product => product.category === slug)
}

export async function getProductBySlug (slug) {
  const products = await getProducts()
  const product = products.find(item => item.slug === slug || item.id === slug)

  if (!product) return null

  // The list may not carry the per-market prices; the detail endpoint does.
  if (product.markets.length > 0) return product

  try {
    const payload = await fetchJson(`/products/${encodeURIComponent(product.id)}`)
    const detail = normalizeProduct(findObject(payload))

    if (detail) {
      return {
        ...product,
        ...detail,
        markets: detail.markets.length > 0 ? detail.markets : product.markets
      }
    }
  } catch {
    // Show what the list already told us.
  }

  return product
}

/** Min / max / average across the markets, plus the cheapest and dearest. */
export function summarizeMarkets (markets) {
  const withPrices = markets.filter(market => market.min !== null || market.max !== null)

  if (withPrices.length === 0) {
    return { min: null, max: null, avg: null, cheapest: null, priciest: null }
  }

  const lows = withPrices.map(market => market.min ?? market.max)
  const highs = withPrices.map(market => market.max ?? market.min)
  const mids = withPrices.map(market => market.avg)

  const cheapest = withPrices.reduce((best, market) =>
    (market.avg ?? Infinity) < (best.avg ?? Infinity) ? market : best
  )

  const priciest = withPrices.reduce((best, market) =>
    (market.avg ?? -Infinity) > (best.avg ?? -Infinity) ? market : best
  )

  return {
    min: Math.min(...lows),
    max: Math.max(...highs),
    avg: mids.reduce((sum, value) => sum + value, 0) / mids.length,
    cheapest,
    priciest
  }
}
