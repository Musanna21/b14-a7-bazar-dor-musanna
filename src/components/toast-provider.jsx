'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider () {
  return (
    <Toaster
      position='top-right'
      gutter={10}
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: '12px',
          background: '#ffffff',
          color: '#1d2b21',
          border: '1px solid #e1e9df',
          padding: '12px 16px',
          fontSize: '14px'
        },
        success: {
          duration: 3000,
          iconTheme: { primary: '#23764d', secondary: '#ffffff' }
        },
        error: {
          duration: 4500,
          iconTheme: { primary: '#dc2626', secondary: '#ffffff' }
        }
      }}
    />
  )
}
