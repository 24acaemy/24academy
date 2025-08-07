import type { Metadata } from 'next'
import './globals.css'

import AuthProvider from '@/provider/AuthProvider'
import Header from './components/Nav'

export const metadata: Metadata = {
  title: 'اكاديمية 24 للغات والتدريب',
  description: 'اكاديمية 24 هي منصة للتدريب والتأهيل عبر الإنترنت لمساعدة الأفراد على تطوير مهاراتهم في مختلف المجالات.',
  themeColor: '#051568',
  keywords: 'اليمن, اونلاين, اكاديمية 24, تعليم عبر الإنترنت, دورات تدريبية, تأهيل مهني, تعلم عبر الإنترنت',
  authors: [{ name: '24 Academy' }],
  
  // Open Graph Meta Tags
  og: {
    title: 'اكاديمية 24 للغات والتدريب',
    description: 'انضم إلى أكاديمية 24 للحصول على أفضل الدورات التدريبية عبر الإنترنت في مجالات متعددة.',
    url: 'https://www.24academy.net/', // رابط الموقع
    image: '/logo.png', // مسار صورة الشعار في مجلد public
    type: 'website',
  },

  // Twitter Meta Tags
  twitter: {
    card: 'summary_large_image',
    title: 'اكاديمية 24 للغات والتدريب',
    description: 'انضم إلى أكاديمية 24 للحصول على أفضل الدورات التدريبية عبر الإنترنت في مجالات متعددة.',
    image: '/logo.png', // مسار صورة الشعار في مجلد public
  },

  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar"  bbai-tooltip-injected="true"
>
      <head>
        {/* Google Fonts Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Load Cairo and Amiri fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Amiri:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* ميتا بيانات إضافية للموقع */}
        <meta name="theme-color" content="#051568" />
        <meta name="description" content="اكاديمية 24 هي منصة للتدريب والتأهيل عبر الإنترنت لمساعدة الأفراد على تطوير مهاراتهم في مختلف المجالات ابرزها اللغات." />
        <meta name="keywords" content=",اليمن, اونلاين, اكاديمية 24, تعليم عبر الإنترنت, دورات تدريبية, تأهيل مهني, تعلم عبر الإنترنت" />
        <meta name="author" content="24 Academy" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="اكاديمية 24 للغات والتدريب" />
        <meta property="og:description" content="انضم إلى أكاديمية 24 للحصول على أفضل الدورات التدريبية عبر الإنترنت في مجالات متعددة." />
        <meta property="og:url" content="https://24academy.net/" />
        <meta property="og:image" content="/logo.png" /> {/* الشعار من مجلد public */}
        <meta property="og:type" content="website" />
<link rel="icon" href="/logo.ico" type="image/x-icon" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="اكاديمية 24 للغات والتدريب" />
        <meta name="twitter:description" content="انضم إلى أكاديمية 24 للحصول على أفضل الدورات التدريبية عبر الإنترنت في مجالات متعددة." />
        <meta name="twitter:image" content="/logo.png" /> {/* الشعار من مجلد public */}
      </head>
      <body className="font-cairo">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
