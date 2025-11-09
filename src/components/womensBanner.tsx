'use client';

import React from 'react';

const WomensBanner: React.FC = () => {
    return (
        <div className="banner-outer container-outer mt-4 md:mt-20">
            <div className="container mx-auto px-4">
                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                    {/* Large Banner - Left */}
                    <div className="md:col-span-2">
                        <div className="banner4 banners relative group overflow-hidden rounded-lg shadow-lg">
                            <div className="inner1">
                                <a href="#" className="block">
                                    <img
                                        src="/assets/library/banner14.webp"
                                        alt="Women's Collection"
                                        className="img-responsive w-full h-64 md:h-80 lg:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </a>
                            </div>
                            <div className="inner2 absolute bottom-0 left-0 right-0 p-3 md:p-6 text-white bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                                <div className="promo-text-box">
                                    <h3 className="promo-title text-xl md:text-2xl lg:text-3xl font-bold mb-2">Women's Collection</h3>
                                    <div className="promo-sale text-sm md:text-lg lg:text-xl font-medium">Save up to 20% off</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Two Small Banners - Middle */}
                    <div className="md:col-span-1">
                        <div className="banner5 banners relative group overflow-hidden rounded-lg shadow-lg mb-4 md:mb-0">
                            <div className="inner1">
                                <a href="#" className="block">
                                    <img
                                        src="/assets/library/banner13.webp"
                                        alt="Women's Collection"
                                        className="img-responsive w-full h-48 md:h-56 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </a>
                            </div>
                            <div className="inner2 absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                                <div className="promo-text-box">
                                    <h3 className="promo-title text-lg md:text-xl font-bold mb-1">Women's Collection</h3>
                                    <div className="promo-sale text-sm md:text-base">Save up to 20% off</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <div className="banner6 banners relative group overflow-hidden rounded-lg shadow-lg">
                            <div className="inner1">
                                <a href="#" className="block">
                                    <img
                                        src="/assets/library/banner12.webp"
                                        alt="Women's Collection"
                                        className="img-responsive w-full h-48 md:h-56 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </a>
                            </div>
                            <div className="inner2 absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                                <div className="promo-text-box">
                                    <h3 className="promo-title text-lg md:text-xl font-bold mb-1">Women's Collection</h3>
                                    <div className="promo-sale text-sm md:text-base">Save up to 20% off</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Full-Height Banner */}
                    <div className="md:col-span-1 hidden md:block">
                        <div className="banner7 banners relative group overflow-hidden rounded-lg shadow-lg">
                            <div className="inner1">
                                <a href="#" className="block">
                                    <img
                                        src="/assets/library/banner11.webp"
                                        alt="Women's Collection"
                                        className="img-responsive w-full h-32 md:h-40 lg:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </a>
                            </div>
                            <div className="inner2 absolute bottom-0 left-0 right-0 p-3 md:p-4 text-white bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                                <div className="promo-text-box">
                                    <h3 className="promo-title text-lg md:text-xl font-bold mb-1">Women's Collection</h3>
                                    <div className="promo-sale text-sm md:text-base">Save up to 20% off</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WomensBanner;