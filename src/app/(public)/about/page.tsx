import React from 'react';

interface TitleProps {
    text1: string;
    text2: string;
}

const Title: React.FC<TitleProps> = ({ text1, text2 }) => (
    <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
            {text1} <span className="text-primary">{text2}</span>
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mt-3 rounded-full"></div>
    </div>
);

const NewsLetter: React.FC = () => (
    <div className="bg-gradient-to-r from-[#FFD5DF] to-[#FFEBF0] p-8 rounded-2xl shadow-lg">
        <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                নিউজলেটার সাবস্ক্রাইব করুন
            </h3>
            <p className="text-gray-600 mb-6">
                আমাদের নতুন কালেকশন এবং বিশেষ অফারের খবর পেতে সাবস্ক্রাইব করুন
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="আপনার ইমেইল ঠিকানা"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-medium">
                    সাবস্ক্রাইব
                </button>
            </div>
        </div>
    </div>
);

const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#FFEBF0] to-[#FFD5DF]">
            <div className="mx-auto container px-4 py-8">
                {/* Hero Section */}
                <div className="my-8 sm:py-20 lg:py-16">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        {/* Image Container */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl w-full">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent z-10"></div>
                                <img

                                    className="w-full md:h-[800px] h-[500px] transform hover:scale-105 transition-transform duration-700 object-cover"
                                    src="/assets/about_img.webp"
                                    alt="AttireIdyll"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#FFD5DF] rounded-full opacity-60"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#FFEBF0] rounded-full opacity-80"></div>
                        </div>

                        {/* Content Container */}
                        <div className="lg:w-1/2 space-y-8">
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                                    আমরা <span className="text-primary">কারা</span>
                                </h1>
                                <div className="w-24 h-1 bg-primary mx-auto lg:mx-0 rounded-full"></div>
                            </div>

                            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#FFD5DF]/50">
                                <p className="text-gray-700 text-justify leading-relaxed">
                                    AttireIdyll-এ আপনাকে স্বাগতম! আমরা বাংলাদেশের একটি গর্বিত
                                    ব্র্যান্ড। আমাদের যাত্রা শুরু হয়েছিল একটি স্বপ্ন
                                    নিয়ে—নারীদের জন্য এমন ফ্যাশন সরবরাহ করা যা মান, আভিজাত্য এবং
                                    আরামের প্রতিশ্রুতি দেয়।{' '}
                                    <span className="text-primary font-semibold">AttireIdyll</span>{' '}
                                    সেই চাহিদা পূরণে প্রতিশ্রুতিবদ্ধ। আমাদের মূল লক্ষ্য হলো ফ্যাশন
                                    ও আরামকে একসাথে নিয়ে এসে এমন পোশাক তৈরি করা যা প্রতিটি নারীর
                                    ব্যক্তিত্ব ও সৌন্দর্যকে আরও উজ্জ্বল করে তোলে।
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-[#FFD5DF] to-[#FFEBF0] p-6 rounded-2xl shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                    ✨ ফ্যাশনে পা রাখুন নতুন দিগন্তে! ✨
                                </h2>
                                <p className="text-gray-700 text-justify leading-relaxed">
                                    আমাদের এক্সক্লুসিভ নতুন কালেকশন এখন উপলব্ধ! আপনার প্রিয়
                                    ফ্যাশন স্টাইল খুঁজে নিন আর নিজেকে সাজান অনন্যভাবে। ❤️ আমাদের
                                    তিন পিস কালেকশন সাজানো হয়েছে আধুনিক ট্রেন্ড ও ঐতিহ্যের
                                    মিশেলে।
                                </p>
                            </div>

                            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#FFD5DF]/50">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                    ✨ আপনার স্টাইল, আপনার পরিচয়! ✨
                                </h2>
                                <p className="text-gray-700 text-justify leading-relaxed">
                                    AttireIdyll-এ আপনি পাবেন এমন পোশাক যা আপনার আত্মবিশ্বাস বাড়াবে এবং
                                    আপনাকে নতুনভাবে তুলে ধরবে। আমরা জানি, আপনার স্টাইল শুধু আপনার
                                    সৌন্দর্যের প্রকাশ নয়, এটি আপনার আত্মবিশ্বাসেরও প্রতিফলন।
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="md:py-6 py-2">
                    <div className="text-xl py-4 px-2 lg:px-0">
                        <Title text1={'কেন'} text2={'আমাদের বেছে নিবেন'} />
                    </div>

                    <div className="flex flex-col lg:flex-row text-sm mb-20 px-2 lg:px-0">
                        <div className="border border-[#FFD5DF]/50 bg-white/60 backdrop-blur-sm px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:shadow-lg transition-all duration-300 rounded-l-2xl lg:rounded-r-none rounded-r-2xl">
                            <b className="text-primary text-lg">গুণগত মান নিশ্চিতকরণ:</b>
                            <p className="text-gray-600 leading-relaxed">
                                আমরা প্রতিটি পণ্য সাবধানে নির্বাচন ও যাচাই করি, যাতে এটি আমাদের
                                কঠোর মান নিয়ন্ত্রণের মাপকাঠি পূরণ করে।
                            </p>
                        </div>
                        <div className="border border-[#FFD5DF]/50 bg-gradient-to-br from-[#FFD5DF]/40 to-[#FFEBF0]/40 backdrop-blur-sm px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover-shadow-lg transition-all duration-300 rounded-none">
                            <b className="text-primary text-lg">সুবিধা:</b>
                            <p className="text-gray-600 leading-relaxed">
                                আমাদের ব্যবহারকারী-বান্ধব ইন্টারফেস এবং ঝামেলামুক্ত অর্ডার
                                প্রক্রিয়ার মাধ্যমে কেনাকাটা এখন আগের যেকোনো সময়ের চেয়ে সহজ।
                            </p>
                        </div>
                        <div className="border border-[#FFD5DF]/50 bg-white/60 backdrop-blur-sm px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 hover:shadow-lg transition-all duration-300 rounded-r-2xl lg:rounded-l-none rounded-l-2xl">
                            <b className="text-primary text-lg">অসাধারণ গ্রাহক সেবা:</b>
                            <p className="text-gray-600 leading-relaxed">
                                আমাদের নিবেদিত পেশাদারদের দল সবসময় আপনার পাশে রয়েছে। আপনার
                                সন্তুষ্টি নিশ্চিত করাই আমাদের সর্বোচ্চ অগ্রাধিকার।
                            </p>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="py-6 md:py-10">
                    <NewsLetter />
                </div>
            </div>
        </div>
    );
};

export default About;