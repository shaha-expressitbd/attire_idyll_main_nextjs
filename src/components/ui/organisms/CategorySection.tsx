// components/CategorySection.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CategorySection({ categories }: { categories: any[] }) {
    const router = useRouter();

    const handleClick = (name: string) => {
        const slug = name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
        router.push(`/maincategory/${slug}`);
    };

    if (categories.length === 0) return null;

    return (
        <div className="w-full mx-auto space-y-4 mt-10 px-4">
            <div className="grid grid-cols-3 gap-3">
                {categories.slice(0, 3).map((cat) => (
                    <button
                        key={cat._id}
                        onClick={() => handleClick(cat.name)}
                        className="h-12 rounded-lg border border-gray-300 bg-white dark:bg-secondary dark:text-white text-sm font-medium text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition"
                    >
                        {cat.name.toUpperCase()}
                    </button>
                ))}
            </div>

            {categories[3] && (
                <button
                    onClick={() => handleClick(categories[3].name)}
                    className="w-full h-16 rounded-lg border border-gray-300 bg-white dark:bg-secondary dark:text-white text-base font-medium text-gray-700 flex items-center justify-center hover:bg-gray-100 hover:border-gray-400 transition"
                >
                    {categories[3].name.toUpperCase()}
                </button>
            )}
        </div>
    );
}