import React from 'react'
import Link from 'next/link'
import { FaFacebookF, FaInstagram, FaPhone, FaWhatsapp } from 'react-icons/fa'
import { Business } from '@/types/business'
import Image from './ui/atoms/image'
import { CiMail } from 'react-icons/ci'

interface FooterProps {
  business: Business
}

const Footer = function Footer({ business }: FooterProps) {

  return (
    <footer className="w-full bg-white dark:bg-black font-hebrew">
      {/* Thin green top border */}


      <div className="px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* === Contact Us === */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">
              Contact Us
            </h4>

            <div className="space-y-2 text-gray-800 dark:text-gray-200 text-sm md:text-base">
              <Link href='/'>
                <Image
                  src={business?.alterImage?.secure_url || '/assets/logo.png'}
                  alt="attireidyll Logo"

                  sizes='(max-width: 768px) 240px, 240px'
                  className='w-60'
                  loading='lazy'
                  variant="small"
                />
              </Link>
              <p className="break-all leading-relaxed">
                {business?.location}<br />

              </p>

              <p className="flex items-center gap-1">
                <span> <FaPhone /> </span>
                <Link
                  href={`tel:${business?.phone}`}
                  className="hover:text-primary transition-colors"
                  prefetch={false}
                >
                  (+88) {business?.phone || '1122334455'}
                </Link>
              </p>

              <p className="flex items-center gap-1 break-all">
                <span> <CiMail /> </span>
                <Link
                  href={`mailto:${business?.email || ''}`}
                  className="hover:text-primary transition-colors"
                  prefetch={false}
                >
                  {business?.email || 'help@gmail.com'}
                </Link>
              </p>
            </div>
          </div>

          {/* === Information === */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">
              Information
            </h4>
            <ul className="space-y-3 text-gray-800 dark:text-gray-200">
              <li><Link href="/refund-policy" className="hover:text-primary transition-colors">Returns and Exchange</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms and Conditions</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQs</Link></li>

            </ul>
          </div>

          {/* === Customer Care === */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">
              Customer Care
            </h4>
            <ul className="space-y-3 text-gray-800 dark:text-gray-200">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/store" className="hover:text-primary transition-colors">Store Location</Link></li>
              <li><Link href="/shipping-info" className="hover:text-primary transition-colors">Shipping Info</Link></li>

            </ul>
          </div>

          {/* === Newsletter + Social === */}
          <div>
            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">
              Signup For Our Newsletter
            </h4>

            {/* Newsletter Form */}
            <form className="flex mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800 dark:text-gray-200 bg-white dark:bg-secondary text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 text-white rounded-r-md hover:bg-teal-600 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </form>

            {/* Social Icons */}
            <div className="flex gap-4 text-gray-800 dark:text-gray-200">
              <Link
                href={business?.social?.facebook || "https://facebook.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                prefetch={false}
              >
                <FaFacebookF size={20} />
              </Link>

              <Link
                href={business?.social?.whatsapp ? `https://wa.me/${business.social.whatsapp}` : "https://wa.me/8801907349009"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                prefetch={false}
              >
                <FaWhatsapp size={20} />
              </Link>

              <Link
                href={business?.social?.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                prefetch={false}
              >
                <FaInstagram size={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 border-t border-gray-200 dark:border-gray-800 pt-6'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-row items-center gap-1 text-sm text-gray-800 dark:text-gray-200'>
              <p>© 2025 Powered by</p>
              <a href='https://calquick.app' aria-label='Calquick'>
                <img
                  src='https://calquick.app/images/logo/logo.png'
                  alt='CalQuick logo'

                  sizes='70px'
                  className='w-[80px] dark:hidden'
                  loading='lazy'
                />
              </a>
              <a href='https://calquick.app' aria-label='Calquick'>
                <img
                  src='https://calquick.app/images/logo/logo-white.png'
                  alt='CalQuick logo'
                  sizes='70px'
                  className='w-[80px] hidden dark:block'
                  loading='lazy'
                />
              </a>
            </div>
            <div className='flex gap-2 text-sm text-gray-800 dark:text-gray-200'>
              <span className='font-semibold'>Trade License Number:</span>
              <span></span>
            </div>
          </div>

          <div className='w-full mt-7 border-t border-gray-800 pt-6 md:mb-0 mb-20'>
            <div className='container mx-auto'>
              <a
                href='https://www.sslcommerz.com/'
                target='_blank'
                rel='noopener noreferrer'
                className='block'
              >
                <img
                  src='https://cloudecalquick.xyz/cdn-cgi/image/width=3840,quality=100,format=webp/v2/api/files/upload/images/SSLCommerz-Pay-With-logo-All-Size-03-734829.webp'
                  alt='SSLCommerz Payment Methods'
                  width={1600}
                  height={100}
                  sizes='100vw'
                  className='w-full'
                  loading='lazy'
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer >
  )
}

export default Footer
