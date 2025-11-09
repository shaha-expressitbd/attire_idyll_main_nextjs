
import React, { useState, useEffect } from 'react';

interface RangePriceFilterProps {
    minPrice?: number;
    maxPrice?: number;
    priceRange: [number, number];
    setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
}

const RangePriceFilter: React.FC<RangePriceFilterProps> = ({
    minPrice: initialMinPrice = 1250,
    maxPrice: initialMaxPrice = 2500,
    priceRange,
    setPriceRange
}) => {
    // Use API price range if available, fallback to props
    const MIN_PRICE = initialMinPrice;
    const MAX_PRICE = initialMaxPrice;

    // Debug logging
    console.log('RangePriceFilter - MIN_PRICE:', MIN_PRICE, 'MAX_PRICE:', MAX_PRICE);
    console.log('RangePriceFilter - priceRange:', priceRange);
    console.log('RangePriceFilter - initialMinPrice:', initialMinPrice, 'initialMaxPrice:', initialMaxPrice);

    // State for range sliders
    const [minSliderValue, setMinSliderValue] = useState<number>(priceRange[0]);
    const [maxSliderValue, setMaxSliderValue] = useState<number>(priceRange[1]);

    useEffect(() => {
        setMinSliderValue(priceRange[0]);
        setMaxSliderValue(priceRange[1]);
    }, [priceRange]);

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.min(Number(e.target.value), maxSliderValue - 1);
        setMinSliderValue(value);
        setPriceRange([value, maxSliderValue]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(Number(e.target.value), minSliderValue + 1);
        setMaxSliderValue(value);
        setPriceRange([minSliderValue, value]);
    };

    return (
        <div className="space-y-3">
            <span className="font-semibold text-black dark:text-white">Filter by Price</span>
            <div className="flex flex-col gap-2">
                <div className="relative w-full h-[6px] bg-gray-300 rounded">
                    {/* Active range between min and max */}
                    <div
                        className="absolute h-[6px] bg-pink-500 rounded z-[1]"
                        style={{
                            left: `${((minSliderValue - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`,
                            right: `${100 - ((maxSliderValue - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100}%`
                        }}
                    />

                    {/* Min Range Slider */}
                    <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        value={minSliderValue}
                        className="absolute w-full h-2.5 bg-transparent appearance-none z-[2] cursor-pointer"
                        onChange={handleMinChange}
                    />

                    {/* Max Range Slider */}
                    <input
                        type="range"
                        min={MIN_PRICE}
                        max={MAX_PRICE}
                        value={maxSliderValue}
                        className="absolute w-full h-2.5 bg-transparent appearance-none z-[2] cursor-pointer"
                        onChange={handleMaxChange}
                    />
                </div>

                <div className="flex justify-between text-sm text-gray-700">
                    <span>Min: ৳{minSliderValue}</span>
                    <span>Max: ৳{maxSliderValue}</span>
                </div>
            </div>




        </div>
    );
};

export default RangePriceFilter;
