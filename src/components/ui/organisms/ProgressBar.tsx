// components/ProgressBar.tsx
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

const ProgressBar: React.FC = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Configure NProgress (optional: disable spinner)
        NProgress.configure({ showSpinner: false });

        // Start progress bar on route change
        NProgress.start();

        // Complete progress bar after a slight delay to ensure smooth animation
        const timer = setTimeout(() => {
            NProgress.done();
        }, 300);

        return () => {
            clearTimeout(timer);
            NProgress.done();
        };
    }, [pathname, searchParams]); // Trigger effect on pathname or searchParams change

    // Trigger progress bar on any navigation (link clicks, back/forward)
    useEffect(() => {
        const handleStart = () => NProgress.start();
        const handleComplete = () => NProgress.done();

        // Listen for link clicks that would navigate
        const handleLinkClick = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.closest('a[href]')) {
                handleStart();
            }
        };

        // Listen for browser navigation events
        window.addEventListener('beforeunload', handleStart);
        document.addEventListener('click', handleLinkClick);

        return () => {
            window.removeEventListener('beforeunload', handleStart);
            document.removeEventListener('click', handleLinkClick);
        };
    }, []);

    return null;
};

export default ProgressBar;