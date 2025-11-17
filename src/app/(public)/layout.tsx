import React from 'react'
import { headers } from 'next/headers'
import Header from '@/components/Header'
import DynamicFooter from '@/components/DynamicFooter'
import DynamicFloatingIcons from '@/components/DynamicFloatingIcons'
import StickySocialButton from '@/components/ui/atoms/StickySocialButton'
import { getBusinessServer } from '@/lib/api/serverApi'
import ProgressBar from '@/components/ui/organisms/ProgressBar'

interface PublicLayoutProps {
  children: React.ReactNode
  hideHeaderOnMobile?: boolean
  hideFooter?: boolean
}
export async function generateMetadata() {
  return {
    title: "AttireIdyll - Best Online Shopping Platform",
    description:
      "Discover amazing deals and shop for your favorite products on AttireIdyll.",
    openGraph: {
      title: "AttireIdyll - Best Online Shopping Platform",
      description:
        "Discover amazing deals and shop for your favorite products on AttireIdyll.",
      url: '/',
      type: 'website'
    }
  } as const
}

export default async function PublicLayout({
  children,
  hideHeaderOnMobile = false,
  hideFooter = false
}: PublicLayoutProps) {
  // Get pathname from headers (server-side)
  const headersList = await headers()
  const pathname =
    headersList.get('x-pathname') ||
    headersList.get('referer')?.split('?')[0] ||
    '/'

  // Check for specific pages
  const isProductDetailPage = pathname.startsWith('/product')
  const isCheckOutPage = pathname.startsWith('/checkout')
  const isAuthPage = pathname.startsWith('/auth')
  const isShopPage = pathname.startsWith('/products')

  // For server-side rendering, we use CSS classes for responsive hiding
  // Header visibility logic: show on desktop, hide on mobile for certain pages
  const shouldHideHeaderOnMobile =
    hideHeaderOnMobile || isProductDetailPage || isCheckOutPage
  const shouldHideFooter =
    hideFooter ||
    isCheckOutPage ||
    isAuthPage ||
    isShopPage ||
    isProductDetailPage

  const business = await getBusinessServer()

  return (
    <div className='relative min-h-dvh bg-white dark:bg-secondary flex flex-col'>
      {/* Header - will show on desktop (lg and up) for all pages, conditionally on mobile */}
      <ProgressBar />
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${shouldHideHeaderOnMobile ? 'lg:block hidden' : 'block'
          }`}
      >
        <Header business={business} />
      </header>

      {/* Content container with responsive padding */}
      <div
        className={`flex-grow ${!shouldHideHeaderOnMobile ? 'lg:pt-0 pt-0' : 'lg:pt-8 pt-16'
          }`}
      >
        {children}
      </div>

      {/* Footer - hidden on specific pages */}
      <DynamicFooter business={business} />
      {/* Floating Icons - only on home and products pages */}

      <StickySocialButton />
    </div>
  )
}