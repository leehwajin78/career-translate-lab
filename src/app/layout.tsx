import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: '꿈몰다 브랜드 매니지먼트 | 경력을 무대로 번역합니다',
  description:
    '5060 전문가의 축적된 경험을 브랜드 언어, 강의 자산, B2B 제안 자산으로 정리하는 프리미엄 1:1 브랜드 매니지먼트.',
  authors: [{ name: '꿈몰다' }],
  openGraph: {
    title: '꿈몰다 브랜드 매니지먼트',
    description: '경력을 무대로 번역하는 프리미엄 1:1 브랜드 매니지먼트',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
