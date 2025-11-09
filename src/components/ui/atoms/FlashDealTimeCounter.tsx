"use client";
import React, { useEffect, useState, useRef } from "react";

interface FlashDealTimeCounterProps {
    endDate: string;
    variant?: "default" | "productDetails";
}

export const FlashDealTimeCounter = React.memo(({ endDate, variant = "default" }: FlashDealTimeCounterProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        completed: false
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const end = new Date(endDate);
            const diff = end.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, completed: true });
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ days, hours, minutes, seconds, completed: false });

            timerRef.current = setTimeout(updateTimer, 1000);
        };

        updateTimer();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [endDate]);

    if (timeLeft.completed) {
        return (
            <div className="relative overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-pink-600 px-3 py-2 rounded-xl text-center shadow-lg">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
                    <span className="relative text-sm font-semibold text-white">Deal Expired</span>
                </div>
            </div>
        );
    }

    // Product Details variant - Advanced Neon Design
    if (variant === "productDetails") {
        return (
            <div className="relative group">
                {/* Glowing Background Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

                <div className="relative bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 rounded-xl p-4 shadow-2xl border border-purple-500/30">
                    {/* Animated particles background */}
                    <div className="absolute inset-0 overflow-hidden rounded-xl">
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-60"></div>
                        <div className="absolute top-3 right-2 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
                        <div className="absolute bottom-2 left-6 w-3 h-3 bg-blue-400 rounded-full animate-bounce opacity-50" style={{ animationDelay: '0.5s' }}></div>
                    </div>

                    <div className="relative">
                        <div className="text-center mb-3">
                            <div className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-sm font-bold animate-pulse">
                                ⚡ FLASH SALE ENDS IN ⚡
                            </div>
                        </div>

                        <div className="flex justify-center items-center space-x-2">
                            {[
                                { value: timeLeft.days, label: 'DAYS', color: 'from-red-500 to-orange-500' },
                                { value: timeLeft.hours, label: 'HRS', color: 'from-yellow-500 to-red-500' },
                                { value: timeLeft.minutes, label: 'MIN', color: 'from-green-500 to-yellow-500' },
                                { value: timeLeft.seconds, label: 'SEC', color: 'from-blue-500 to-purple-500' }
                            ].map((item, index) => (
                                <div key={item.label} className="flex items-center">
                                    <div className="relative group/item">
                                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-lg blur opacity-60 group-hover/item:opacity-100 transition animate-pulse`}></div>
                                        <div className="relative bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/20">
                                            <div className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-b ${item.color} text-center`}>
                                                {item.value.toString().padStart(2, "0")}
                                            </div>
                                            <div className="text-[8px] text-gray-300 dark:text-white text-center font-medium tracking-wider">
                                                {item.label}
                                            </div>
                                        </div>
                                    </div>
                                    {index < 3 && (
                                        <div className="text-purple-400 mx-1 animate-pulse text-lg font-bold">:</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-3 relative">
                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 animate-pulse rounded-full"
                                    style={{ width: `${100 - (timeLeft.days * 2)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default variant - Glassmorphism Design with Mobile Row Layout
    return (
        <div className="relative group">
            {/* Floating Elements Background */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-30 animate-bounce"></div>
                <div className="absolute top-1/2 -left-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-40 animate-pulse"></div>
            </div>

            {/* Main Timer Container */}
            <div className="relative backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/30 dark:border-gray-600/30 rounded-2xl md:p-3 p-1 shadow-2xl">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-2xl"></div>

                <div className="relative">
                    {/* Header */}
                    <div className="text-center mb-2">
                        <div className="text-[10px] sm:text-xs font-semibold text-whitetracking-wide text-black dark:text-white">
                            🔥 ENDS IN
                        </div>
                    </div>

                    {/* Timer Display - Always Row Layout */}
                    <div className="flex items-center justify-center space-x-1.5">
                        {[
                            { value: timeLeft.days, label: 'D', gradient: 'from-red-400 to-pink-500 text-black dark:text-white' },
                            { value: timeLeft.hours, label: 'H', gradient: 'from-orange-400 to-red-500 text-black dark:text-white' },
                            { value: timeLeft.minutes, label: 'M', gradient: 'from-yellow-400 to-orange-500 text-black dark:text-white' },
                            { value: timeLeft.seconds, label: 'S', gradient: 'from-green-400 to-blue-500 text-black dark:text-white' }
                        ].map((item, index) => (
                            <div key={item.label} className="flex items-center">
                                {/* Time Box */}
                                <div className="relative group/box">
                                    {/* Glow effect */}
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-lg opacity-20 group-hover/box:opacity-40 blur transition-all animate-pulse`}></div>

                                    {/* Main box */}
                                    <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-white/40 dark:border-gray-600/40 shadow-lg min-w-[28px] sm:min-w-[32px]">
                                        <div className="px-1.5 py-1 text-center">
                                            {/* Number */}
                                            <div className={`text-sm sm:text-base font-bold bg-gradient-to-b ${item.gradient} text-transparent bg-clip-text`}>
                                                {item.value.toString().padStart(2, "0")}
                                            </div>
                                            {/* Label */}
                                            <div className="text-[8px] sm:text-[9px] text-gray-500 dark:text-white font-bold leading-none">
                                                {item.label}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Separator */}
                                {index < 3 && (
                                    <div className="text-gray-400 dark:text-gray-500 mx-0.5 text-xs font-bold animate-pulse">
                                        :
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Animated Border */}
                    <div className="absolute -inset-[1px] rounded-2xl opacity-50">
                        <div className="h-full w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-sm animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
});