import './globals.css'
import SiteHeader from '../components/site-header'
import SiteFooter from '../components/site-footer'
import ToastProvider from '../components/toast-provider'

export const metadata = {
  title: 'বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে',
  description:
    'চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের বাজারদর, দামের ওঠানামা এবং বাজারভিত্তিক তুলনা এক জায়গায়।'
}

export default function RootLayout ({ children }) {
  return (
    <html lang='bn'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap'
        />
      </head>

      <body className='flex min-h-screen flex-col antialiased'>
        <SiteHeader />

        <main className='min-w-0 flex-1'>{children}</main>

        <SiteFooter />
        <ToastProvider />
      </body>
    </html>
  )
}
