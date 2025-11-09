'use client';

import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { Button } from '../atoms/button';
import { Icon } from '../atoms/icon';

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 hidden lg:block">
            <Button
                variant="gradient"
                size="md"
                title="Scroll to top"
                onClick={scrollToTop}
                className="rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow"
            >
                <Icon icon={FiArrowUp} size={24} color="white" />
            </Button>
        </div>
    );
}