// src/components/DynamicCategorySections.js (Server Component)
import { Product } from "@/types/product";
import Link from "next/link";
import ProductCard from "./ui/organisms/product-card";

export default function DynamicCategorySections({ initialProducts }: { initialProducts?: Product[] }) {
    // Handle empty or invalid initialProducts
    if (!initialProducts || initialProducts.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-md mx-auto">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/20 rounded-full blur-xl"></div>
                        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/10 via-purple-600/10 to-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                            <svg className="w-12 h-12 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2m-14 0h2m0 0V9a2 2 0 012-2h2m2 2v4"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                            কোনো প্রোডাক্ট পাওয়া যায়নি
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            দয়া করে পরে আবার চেষ্টা করুন
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Categorize products (directly, no useMemo)
    const categorizedProducts: { category: string; products: Product[]; totalCount: number }[] = [];
    const map = new Map<string, { category: string; products: Product[]; totalCount: number }>();

    initialProducts.forEach((product) => {
        if (!product.sub_category?.length) return;

        const lastCategory = product.sub_category[product.sub_category.length - 1];
        const categoryName = lastCategory?.name?.trim();

        if (!categoryName) return;

        if (!map.has(categoryName)) {
            map.set(categoryName, {
                category: categoryName,
                products: [],
                totalCount: 0,
            });
        }

        const categoryData = map.get(categoryName)!;
        categoryData.products.push(product);
        categoryData.totalCount = categoryData.products.length;
    });

    categorizedProducts.push(...Array.from(map.values()).filter((group) => group.products.length > 0));

    if (categorizedProducts.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-md mx-auto">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-600/20 to-primary/20 rounded-full blur-xl"></div>
                        <div className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/10 via-purple-600/10 to-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
                            <svg className="w-12 h-12 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2m-14 0h2m0 0V9a2 2 0 012-2h2m2 2v4"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
                            কোনো প্রোডাক্ট পাওয়া যায়নি
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            দয়া করে পরে আবার চেষ্টা করুন
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="py-12 space-y-16">
            <div className="md:space-y-16 space-y-6">
                {categorizedProducts.map(({ category, products: catProducts, totalCount }, sectionIndex) => {
                    const maxProducts = 4; // Fixed for server rendering; adjust with CSS for responsiveness
                    const finalProducts = catProducts.slice(0, maxProducts);

                    return (
                        <section
                            key={category}
                            className="group/section bg-secondary relative overflow-hidden py-4 rounded-3xl"
                        >
                            <div className="absolute inset-0 bg-secondary rounded-3xl"></div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

                            <div className="relative space-y-8 lg:container mx-auto px-1 md:px-0">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent rounded-3xl blur-3xl scale-110"></div>
                                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:p-8 p-4 bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-primary/20 shadow-xl dark:shadow-2xl transition-all duration-500 hover:shadow-2xl">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-1.5 h-10 bg-gradient-to-t from-primary to-pink-500 rounded-full shadow-lg shadow-primary/40"></div>
                                                <div>
                                                    <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-gray-800 dark:from-white via-primary dark:via-white to-pink-500 dark:to-white bg-clip-text text-transparent capitalize leading-tight tracking-wide drop-shadow-sm">
                                                        {category}
                                                    </h2>
                                                    <div className="mt-2 h-1 w-20 bg-gradient-to-r from-primary to-pink-500 rounded-full shadow-inner"></div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 mt-4">
                                                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/15 to-pink-500/15 rounded-full border border-primary/30 shadow-sm">
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-md"></span>
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                                        {totalCount} টি প্রোডাক্ট
                                                    </span>
                                                </div>
                                                {totalCount > maxProducts && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-200 text-xs font-medium rounded-full border border-amber-200 dark:border-amber-700 shadow-sm">
                                                        +{totalCount - maxProducts} আরও
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="hidden md:flex flex-1 items-center justify-center">
                                            <div className="relative w-full h-0.5 overflow-hidden rounded-full bg-primary/30">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-[shimmer_2s_linear_infinite]"></div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <Link
                                                href={`/category/${encodeURIComponent(category)}`}
                                                className="group relative inline-flex items-center gap-3 px-7 py-4 bg-gradient-to-r from-primary to-pink-600 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-out overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-pink-600 scale-105 opacity-0 group-hover:opacity-100 blur-xl transition duration-300"></div>
                                                <span className="relative z-10 whitespace-nowrap">সব প্রোডাক্ট দেখুন</span>
                                                <div className="relative z-10 p-1.5 bg-white/20 rounded-full transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2.5}
                                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                        />
                                                    </svg>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="md:hidden w-full">
                                            <Link
                                                href={`/category/${encodeURIComponent(category)}`}
                                                className="w-full text-center group inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-primary to-pink-600 text-white font-medium text-sm rounded-2xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                                            >
                                                <span>সব দেখুন</span>
                                                <svg
                                                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                    />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative group/grid">
                                    <div className="absolute inset-0 bg-secondary rounded-2xl duration-500"></div>
                                    <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-4">
                                        {finalProducts.map((product: Product, index: number) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    );
                })}
            </div>
        </section>
    );
}