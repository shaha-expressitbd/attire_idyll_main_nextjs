'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import dynamic from 'next/dynamic'
import { AiOutlineSearch } from 'react-icons/ai'
import { useSidebar } from '@/hooks/useSidebar'
import { useWishlist } from '@/hooks/useWishlist'
import { useProducts } from '@/hooks/useProducts'
import { AnimatePresence } from 'framer-motion'
import ThemeToggler from '../molecules/themeToggler'
import { SidebarToggler } from '../molecules/sidebarToggler'
import { Business } from '@/types/business'

const CartSheet = dynamic(() => import('../organisms/cart-sheet'), {
  ssr: false
})
const WishlistSheet = dynamic(() => import('./WishlistSheet'), { ssr: false })
const SearchDropdown = dynamic(() => import('./SearchDropdown'), { ssr: false })

export default function NavbarClient ({
  businessData
}: {
  businessData: Business
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { toggle } = useSidebar()
  const { openWishlist } = useWishlist()
  const { fetchProducts, hasFetched, products } = useProducts()
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Debounced search term
  const [debounced, setDebounced] = useState('')
  useEffect(() => {
    const t = setTimeout(() => setDebounced(searchTerm), 300)
    return () => clearTimeout(t)
  }, [searchTerm])

  // Filtered search results
  const results = useMemo(() => {
    if (!debounced || !hasFetched) return []
    return (products || []).filter(p =>
      p.name.toLowerCase().includes(debounced.toLowerCase())
    )
  }, [debounced, products, hasFetched])

  return (
    <div
      className={`flex items-center gap-4 transition-colors duration-300 ${
        isScrolled ? 'text-gray-800' : 'text-black dark:text-white'
      }`}
    >
      <div className='flex items-center gap-2 cursor-pointer' onClick={toggle}>
        <SidebarToggler />
        <span>Menu</span>
      </div>

      {/* Search Button */}
      <div ref={searchRef} className='relative'>
        <button
          onClick={() => {
            if (!hasFetched) fetchProducts()
            setShowSearch(v => !v)
          }}
          className='flex items-center gap-1 hover:text-pink-500'
        >
          <AiOutlineSearch className='text-lg' />
          <span>Search</span>
        </button>

        <AnimatePresence>
          {showSearch && (
            <SearchDropdown
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              suggestions={results}
              onClose={() => setShowSearch(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

NavbarClient.RightActions = function RightActions () {
  const router = useRouter()
  return (
    <div className='flex items-center gap-4'>
      <button onClick={() => router.push('/products')} title='Shop'>
        🛍️
      </button>
      <CartSheet />
      <WishlistSheet />
      <ThemeToggler />
    </div>
  )
}

NavbarClient.Mobile = function Mobile ({
  businessData
}: {
  businessData: Business
}) {
  const router = useRouter()
  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white/90 dark:bg-black/90 border-t border-gray-200 py-2 md:hidden'>
      <SidebarToggler />
      <button onClick={() => router.push('/products')} className='text-sm'>
        Shop
      </button>
      <Link
        href='/'
        className='flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full shadow-md'
      >
        🏠
      </Link>
      <Link href='/about' className='text-sm'>
        About
      </Link>
      <ThemeToggler />
    </nav>
  )
}
