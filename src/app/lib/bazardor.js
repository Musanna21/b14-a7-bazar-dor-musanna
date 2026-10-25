const API_BASES = [
  'https://openapi.programming-hero.com/api/bazardor',
  'https://api.api-store.workers.dev/api/bazardor',
  'https://api.abcz.workers.dev/api/bazardor'
]

function slugify (value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseNumber (value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (value == null || typeof value === 'object') {
    return null
  }

  const bengaliDigits = '০১২৩৪৫৬৭৮৯'
  const englishDigits = '0123456789'

  const text = String(value)
    .replace(/[০-৯]/g, digit => englishDigits[bengaliDigits.indexOf(digit)])
    .replace(/,/g, '')
    .replace(/[^\d.-]/g, '')

  if (!text || text === '-' || text === '.') {
    return null
  }

  const result = Number(text)

  return Number.isFinite(result) ? result : null
}

function getFirstNumber (item, keys) {
  for (const key of keys) {
    const value = parseNumber(item?.[key])

    if (value !== null) return value
  }

  return null
}

function findArray (payload, depth = 0) {
  if (Array.isArray(payload)) return payload

  if (!payload || typeof payload !== 'object' || depth > 5) {
    return []
  }

  for (const key of ['data', 'products', 'categories', 'results', 'items']) {
    if (payload[key] === undefined) continue

    const result = findArray(payload[key], depth + 1)

    if (result.length > 0) return result
  }

  return []
}

function unwrapProduct (payload) {
  if (!payload || typeof payload !== 'object') return null

  if (Array.isArray(payload)) return payload[0] ?? null

  const candidates = [
    payload.product,
    payload.data?.product,
    payload.item,
    payload.data?.item,
    payload.data,
    payload
  ]

  return (
    candidates.find(
      item =>
        item &&
        typeof item === 'object' &&
        !Array.isArray(item) &&
        (item.slug != null ||
          item.id != null ||
          item.name != null ||
          item.nameBn != null ||
          item.nameEn != null)
    ) ?? null
  )
}

async function fetchFromApi (path) {
  for (const baseUrl of API_BASES) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(8000)
      })

      if (!response.ok) {
        console.warn(`API returned ${response.status}: ${baseUrl}${path}`)
        continue
      }

      return await response.json()
    } catch (error) {
      console.warn(`API request failed: ${baseUrl}${path}`, error)
    }
  }

  return null
}

function getEmoji (name, category) {
  const text = `${name} ${category}`.toLowerCase()

  if (/fish|ilish|salmon|shrimp|prawn/.test(text)) return '🐟'
  if (/chicken|meat|beef|mutton/.test(text)) return '🍗'
  if (/egg/.test(text)) return '🥚'
  if (/rice|chal|grain/.test(text)) return '🍚'
  if (/onion|peyaj/.test(text)) return '🧅'
  if (/potato|alu/.test(text)) return '🥔'
  if (/tomato/.test(text)) return '🍅'
  if (/chilli|chili|pepper/.test(text)) return '🌶️'
  if (/garlic/.test(text)) return '🧄'
  if (/ginger/.test(text)) return '🫚'
  if (/oil/.test(text)) return '🫙'
  if (/lentil|dal|pulse|bean/.test(text)) return '🫘'
  if (/vegetable|fruit|produce/.test(text)) return '🥬'

  return '🛒'
}

function normalizeMarket (market) {
  return {
    market: String(
      market?.market ??
        market?.name ??
        market?.bazaar ??
        market?.bazaarName ??
        'Market'
    ),
    division: String(market?.division ?? ''),
    min: getFirstNumber(market, [
      'min',
      'minPrice',
      'min_price',
      'minimumPrice',
      'minimum_price'
    ]),
    max: getFirstNumber(market, [
      'max',
      'maxPrice',
      'max_price',
      'maximumPrice',
      'maximum_price'
    ])
  }
}

function minimum (values) {
  const valid = values.filter(Number.isFinite)

  return valid.length ? Math.min(...valid) : null
}

function maximum (values) {
  const valid = values.filter(Number.isFinite)

  return valid.length ? Math.max(...valid) : null
}

export function normalizeProduct (item) {
  if (!item || typeof item !== 'object') return null

  // Prefer an English name if the API provides one.
  const rawName =
    item.nameEn ??
    item.name_en ??
    item.name ??
    item.productName ??
    item.product_name ??
    item.nameBn ??
    item.name_bn ??
    item.title

  if (!rawName) return null

  const name = String(rawName)

  const rawCategory =
    item.categoryNameEn ??
    item.category_name_en ??
    item.categoryName ??
    item.category_name ??
    item.categoryNameBn ??
    item.category_name_bn ??
    item.category ??
    ''

  const category =
    typeof rawCategory === 'object' && rawCategory !== null
      ? String(
          rawCategory.nameEn ?? rawCategory.name ?? rawCategory.nameBn ?? ''
        )
      : String(rawCategory)

  const categorySlug = String(
    item.categorySlug ??
      item.category_slug ??
      (typeof item.category === 'string' && item.category
        ? item.category
        : slugify(category))
  )

  const id = item.id ?? item._id ?? item.productId ?? item.product_id

  const slug = String(item.slug ?? id ?? slugify(name))

  const markets = Array.isArray(item.markets)
    ? item.markets.map(normalizeMarket)
    : Array.isArray(item.marketPrices)
    ? item.marketPrices.map(normalizeMarket)
    : Array.isArray(item.market_prices)
    ? item.market_prices.map(normalizeMarket)
    : []

  const price =
    getFirstNumber(item, [
      'today',
      'todayPrice',
      'today_price',
      'priceToday',
      'price_today',
      'currentPrice',
      'current_price',
      'price',
      'averagePrice',
      'average_price',
      'avgPrice',
      'avg_price'
    ]) ?? null

  const nestedChange =
    item.change && typeof item.change === 'object' ? item.change : {}

  let changePercent =
    parseNumber(nestedChange.pct) ??
    parseNumber(nestedChange.percent) ??
    getFirstNumber(item, [
      'changePercent',
      'change_percent',
      'changePercentage',
      'change_percentage',
      'priceChangePercent',
      'price_change_percent',
      'percentageChange',
      'percentage_change'
    ])

  const previousPrice = getFirstNumber(item, [
    'yesterday',
    'yesterdayPrice',
    'yesterday_price',
    'previousPrice',
    'previous_price'
  ])

  if (
    changePercent === null &&
    price !== null &&
    previousPrice !== null &&
    previousPrice > 0
  ) {
    changePercent = ((price - previousPrice) / previousPrice) * 100
  }

  const rawTrend = String(
    nestedChange.dir ??
      item.trend ??
      item.direction ??
      item.priceTrend ??
      item.price_trend ??
      ''
  ).toLowerCase()

  let trend = 'flat'

  if (changePercent !== null && changePercent > 0) {
    trend = 'up'
  } else if (changePercent !== null && changePercent < 0) {
    trend = 'down'
  } else if (/up|rise|increase/.test(rawTrend)) {
    trend = 'up'
  } else if (/down|fall|decrease/.test(rawTrend)) {
    trend = 'down'
  }

  const rawUnit =
    item.unit ?? item.unitName ?? item.unit_name ?? item.measurement ?? ''

  const unit =
    typeof rawUnit === 'object' && rawUnit !== null
      ? String(rawUnit.name ?? rawUnit.label ?? '')
      : String(rawUnit)

  const minimumFromApi = getFirstNumber(item, [
    'minPrice',
    'min_price',
    'minimumPrice',
    'minimum_price',
    'min'
  ])

  const maximumFromApi = getFirstNumber(item, [
    'maxPrice',
    'max_price',
    'maximumPrice',
    'maximum_price',
    'max'
  ])

  const minPrice = minimumFromApi ?? minimum(markets.map(market => market.min))

  const maxPrice = maximumFromApi ?? maximum(markets.map(market => market.max))

  const suppliedAverage = getFirstNumber(item, [
    'averagePrice',
    'average_price',
    'avgPrice',
    'avg_price',
    'average',
    'avg'
  ])

  // If the API does not supply an average, use the average of
  // available market-range midpoints. Mark this as derived.
  const marketMidpoints = markets
    .filter(market => market.min !== null && market.max !== null)
    .map(market => (market.min + market.max) / 2)

  const averagePrice =
    suppliedAverage ??
    (marketMidpoints.length
      ? marketMidpoints.reduce((sum, value) => sum + value, 0) /
        marketMidpoints.length
      : null)

  const icon = item.categoryIcon ?? item.category_icon ?? item.emoji ?? ''

  return {
    id: String(id ?? slug),
    slug,
    name,
    category,
    categorySlug,
    categoryIcon: icon,
    unit,
    price,
    changePercent,
    trend,
    emoji: getEmoji(name, category),
    image:
      item.image ?? item.imageUrl ?? item.image_url ?? item.thumbnail ?? '',
    description: String(
      item.descriptionEn ??
        item.description_en ??
        item.description ??
        item.details ??
        ''
    ),
    minPrice,
    maxPrice,
    averagePrice,
    averageDerived: suppliedAverage === null && marketMidpoints.length > 0,
    yesterday: previousPrice,
    lastWeek: getFirstNumber(item, ['lastWeek', 'last_week']),
    lastMonth: getFirstNumber(item, ['lastMonth', 'last_month']),
    markets
  }
}

export function normalizeCategory (item) {
  const name =
    typeof item === 'string'
      ? item
      : item?.nameEn ??
        item?.name ??
        item?.title ??
        item?.nameBn ??
        item?.name_bn ??
        ''

  if (!name) return null

  return {
    id: String(typeof item === 'object' ? item.id ?? name : name),
    name: String(name),
    slug: String(
      typeof item === 'object'
        ? item.slug ?? item.id ?? slugify(name)
        : slugify(name)
    ),
    icon: typeof item === 'object' ? item.icon ?? item.emoji ?? '' : ''
  }
}

export async function getProducts () {
  const payload = await fetchFromApi('/products')

  return payload ? findArray(payload).map(normalizeProduct).filter(Boolean) : []
}

export async function getCategories () {
  const payload = await fetchFromApi('/categories')

  let categories = payload
    ? findArray(payload).map(normalizeCategory).filter(Boolean)
    : []

  if (!categories.length) {
    const products = await getProducts()

    categories = products
      .filter(product => product.categorySlug && product.category)
      .map(product =>
        normalizeCategory({
          slug: product.categorySlug,
          name: product.category,
          icon: product.categoryIcon
        })
      )
      .filter(Boolean)
  }

  return Array.from(
    new Map(categories.map(category => [category.slug, category])).values()
  )
}

export async function getCategoryBySlug (slug) {
  const categories = await getCategories()

  return (
    categories.find(
      category =>
        category.slug === slug ||
        category.id === slug ||
        slugify(category.name) === slug
    ) ?? null
  )
}

export async function getProductsByCategory (slug) {
  const path = `/products?category=${encodeURIComponent(slug)}`
  const payload = await fetchFromApi(path)

  const categoryProducts = payload
    ? findArray(payload).map(normalizeProduct).filter(Boolean)
    : []

  if (categoryProducts.length) return categoryProducts

  // Fallback for APIs whose category filter is unavailable.
  const allProducts = await getProducts()

  return allProducts.filter(
    product =>
      product.categorySlug === slug || slugify(product.category) === slug
  )
}

export async function getProductBySlug (slug) {
  const products = await getProducts()

  const matchedProduct = products.find(
    product =>
      product.slug === slug ||
      product.id === String(slug) ||
      product.name === slug
  )

  if (matchedProduct) {
    // Try the single-product endpoint for full market details.
    const detailPayload = await fetchFromApi(
      `/products/${encodeURIComponent(matchedProduct.id)}`
    )

    const detail = detailPayload
      ? normalizeProduct(unwrapProduct(detailPayload))
      : null

    if (detail) {
      return {
        ...matchedProduct,
        ...detail,
        markets:
          detail.markets.length > 0 ? detail.markets : matchedProduct.markets
      }
    }

    return matchedProduct
  }

  // If the collection could not identify the slug, try the endpoint directly.
  const directPayload = await fetchFromApi(
    `/products/${encodeURIComponent(slug)}`
  )

  if (directPayload) {
    const directProduct = normalizeProduct(unwrapProduct(directPayload))

    if (directProduct) return directProduct
  }

  return null
}

export function formatPrice (value) {
  if (value == null || !Number.isFinite(Number(value))) {
    return 'Price unavailable'
  }

  return `৳${Number(value).toLocaleString('en-US', {
    maximumFractionDigits: 2
  })}`
}
