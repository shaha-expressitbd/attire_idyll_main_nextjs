'use client'

import { usePathname } from 'next/navigation'
import { CartSheet } from '@/components/ui/organisms/cart-sheet'
import { WishlistSheet } from '@/components/ui/organisms/WishlistSheet'

const DynamicFloatingIcons = function DynamicFloatingIcons() {
    const pathname = usePathname()

    // Paths where floating icons should be rendered
    const showIconsPaths = [
        '/',
        '/products',
        '/category',
        // Add more paths as needed
    ]

    // Check if current path matches any show path
    const shouldShow = showIconsPaths.includes(pathname)

    if (!shouldShow) {
        return null
    }

    return (
        <div className="md:hidden fixed right-3 bottom-1/3 -translate-y-1/2 z-50 flex flex-col gap-3">
            <div className="max-w-8 bg-secondary p-1.5 rounded-full aspect-square">
                <CartSheet />
            </div>
            <div className="max-w-8 bg-secondary p-1.5 rounded-full aspect-square">
                <WishlistSheet />
            </div>
        </div>
    )
}

export default DynamicFloatingIcons