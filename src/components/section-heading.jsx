export default function SectionHeading ({ title, subtitle, tone = 'default' }) {
  const color =
    tone === 'up'
      ? 'text-green-700'
      : tone === 'down'
        ? 'text-red-600'
        : 'text-gray-900'

  return (
    <div className='mb-6'>
      <h2 className={`text-2xl font-bold sm:text-3xl ${color}`}>{title}</h2>

      {subtitle && (
        <p className='mt-1.5 max-w-2xl text-sm leading-6 text-gray-500'>
          {subtitle}
        </p>
      )}
    </div>
  )
}
