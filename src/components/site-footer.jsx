export default function SiteFooter () {
  return (
    <footer className='border-t border-green-100 bg-white'>
      <div className='bazar-container flex flex-col gap-3 py-7 text-sm text-gray-600 md:flex-row md:items-center md:justify-between'>
        <p className='font-bold text-gray-900'>
          <span aria-hidden='true'>🛒 </span>
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className='text-xs leading-6 text-gray-500 md:max-w-md md:text-right'>
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  )
}
