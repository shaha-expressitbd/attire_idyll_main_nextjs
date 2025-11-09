'use client'

import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'
import { memo } from 'react'

interface StickySocialButtonProps {
  phoneNumber: string
}

const StickyWhatsApp = memo(({ phoneNumber }: StickySocialButtonProps) => {
  return (
    <div className='fixed right-2 md:right-4 bottom-48 md:bottom-20 z-50'>
      <Link
        href={`https://wa.me/${phoneNumber}`}
        target='_blank'
        rel='noopener noreferrer'
        aria-label='Chat on WhatsApp'
        className='
          flex items-center justify-center
          rounded-full
          bg-gradient-to-r from-green-500 to-green-700
          p-1.5
          shadow-xl hover:shadow-2xl
          hover:scale-110 transition-transform duration-300 ease-in-out
        '
      >
        <FaWhatsapp className='text-white w-7 h-7 md:w-10 md:h-10' />
      </Link>
    </div>
  )
})

StickyWhatsApp.displayName = 'StickyWhatsApp'

export default StickyWhatsApp
