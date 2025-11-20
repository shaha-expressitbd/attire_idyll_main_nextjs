'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa'
import { memo } from 'react'

const StickySocialButton = memo(() => {
  const pathname = usePathname()

  // শুধুমাত্র হোম পেজে দেখাবে
  if (pathname !== '/') return null

  const socialLinks = [
    {
      href: 'https://www.facebook.com/attireidyllbd',
      icon: <FaFacebookF className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      gradient: 'from-blue-600 to-blue-800',
      label: 'Facebook',
    },
    {
      href: 'https://www.instagram.com/attire_idyll/',
      icon: <FaInstagram className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      gradient: 'from-pink-500 to-purple-600',
      label: 'Instagram',
    },
    {
      href: 'https://wa.me/8801709503503',
      icon: <FaWhatsapp className="w-5 h-5 md:w-6 md:h-6 text-white" />,
      gradient: 'from-green-500 to-green-700',
      label: 'WhatsApp',
    },
  ]

  return (
    <div className="fixed right-2 md:right-4 bottom-24 md:bottom-20 z-50 flex flex-col gap-2 md:gap-3">
      {socialLinks.map((link, index) => (
        <Link
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          className={`
            group relative
            flex items-center justify-center
            w-10 h-10 md:w-12 md:h-12
            rounded-full
            bg-gradient-to-r ${link.gradient}
            p-2
            shadow-lg hover:shadow-2xl
            transform hover:scale-110
            transition-all duration-300 ease-in-out
            border border-white/30
          `}
        >
          {link.icon}
          {/* টুলটিপ (অপশনাল) */}
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 
            bg-black text-white text-xs px-2 py-1 rounded opacity-0 
            group-hover:opacity-100 transition-opacity whitespace-nowrap
            pointer-events-none">
            {link.label}
          </span>
        </Link>
      ))}
    </div>
  )
})

StickySocialButton.displayName = 'StickySocialButton'

export default StickySocialButton