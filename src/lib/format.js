// Formatting helpers: Bengali digits, taka, percentages, units and dates.

const bnNumber = new Intl.NumberFormat('bn-BD', { maximumFractionDigits: 2 })
const bnPercent = new Intl.NumberFormat('bn-BD', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
})

const UNIT_NAMES = {
  kg: 'কেজি',
  kilogram: 'কেজি',
  litre: 'লিটার',
  liter: 'লিটার',
  l: 'লিটার',
  dozen: 'ডজন',
  piece: 'পিস',
  pcs: 'পিস',
  pc: 'পিস',
  gram: 'গ্রাম',
  g: 'গ্রাম'
}

function isNumber (value) {
  return typeof value === 'number' && Number.isFinite(value)
}

/** 1850 -> ১,৮৫০ ; 65.5 -> ৬৫.৫ */
export function formatNumber (value) {
  return isNumber(value) ? bnNumber.format(value) : '—'
}

/** 148 -> ১৪৮ টাকা ; 65.5 -> ৬৫.৫০ টাকা */
export function formatTaka (value) {
  if (!isNumber(value)) return '—'

  const text = Number.isInteger(value)
    ? bnNumber.format(value)
    : new Intl.NumberFormat('bn-BD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value)

  return `${text} টাকা`
}

/** 2.14 -> ২.১% */
export function formatPercent (value) {
  return isNumber(value) ? `${bnPercent.format(Math.abs(value))}%` : '—'
}

/** 'kg' -> 'কেজি' (unknown units are returned unchanged) */
export function unitName (unit) {
  const key = String(unit ?? '').trim().toLowerCase()

  return UNIT_NAMES[key] ?? String(unit ?? '').trim()
}

/** 'kg' -> 'প্রতি কেজি' */
export function unitLabel (unit) {
  const name = unitName(unit)

  if (!name) return ''

  return /^প্রতি/.test(name) ? name : `প্রতি ${name}`
}

/** Ticker style: 148, 'kg' -> '১৪৮ টাকা/কেজি' */
export function formatPerUnit (value, unit) {
  const name = unitName(unit)

  return name ? `${formatTaka(value)}/${name}` : formatTaka(value)
}

/** মঙ্গলবার, ৬ অক্টোবর ২০২৬ (Dhaka time) */
export function formatBanglaDate (date = new Date()) {
  return new Intl.DateTimeFormat('bn-BD', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Dhaka'
  }).format(date)
}
