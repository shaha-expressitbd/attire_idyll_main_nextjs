// components/DeliveryInfoForm.tsx
"use client";
import React, { useState, useEffect } from "react";

import { FaBackward } from "react-icons/fa";

interface PaymentMethod {
    name: string;
    logo: string;
}

interface Props {
    formData: {
        name: string;
        phone: string;
        address: string;
        delivery_area: string;
        note: string;
        paymentMethod: string;
    };
    formErrors: {
        name: string;
        phone: string;
        address: string;
        delivery_area: string;
        note: string;
    };
    insideFee: number;
    subDhakaFee: number;
    outsideFee: number;
    isLoading: boolean;
    handleChange: React.ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >;
    handlePaymentMethodChange: (method: string) => void;
    handleSubmit: (e?: React.FormEvent) => void;
    onBack: () => void;
    availablePaymentMethods: PaymentMethod[];
}

const DeliveryInfoForm: React.FC<Props> = ({
    formData,
    formErrors,
    insideFee,
    subDhakaFee,
    outsideFee,
    isLoading,
    handleChange,
    handlePaymentMethodChange,
    handleSubmit,
    onBack,
    availablePaymentMethods,
}) => {
    const [isNoteVisible, setIsNoteVisible] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener("resize", checkIfMobile);
        return () => window.removeEventListener("resize", checkIfMobile);
    }, []);

    // Ensure consistent rendering during hydration
    const noteVisibility = isNoteVisible || !isMobile;

    return (
        <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-secondary">

            <button
                type="button"
                onClick={onBack}
                className="fixed top-1 left-2 z-50 md:hidden flex items-center justify-center w-8 h-10 bg-white dark:bg-secondary rounded-full shadow-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-white hover:text-primary transition-colors"
            >
                <FaBackward className="text-sm text-primary" />
            </button>
            <div className="flex gap-2 items-center mb-3 justify-center">
                <p className="text-gray-500 dark:text-white">
                    DELIVERY <span className="text-gray-700 dark:text-white font-medium">INFORMATION</span>
                </p>
                <p className="w-8 sm:w-12 h-0.5 bg-gray-700"></p>
            </div>

            <p className="text-xs text-gray-500 dark:text-white -mt-2 lg:mt-4">
                অর্ডার কনফার্ম করতে আপনার নাম, ঠিকানা, মোবাইল নাম্বার লিখে অর্ডার কনফার্ম করুন।
            </p>

            <div className="md:space-y-6 space-y-2">
                <div>
                    <label
                        htmlFor="name"
                        className="block mt-1 lg:mt-4 md:mb-2 text-sm font-semibold text-black dark:text-white"
                    >
                        আপনার নাম*
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter Full Name"
                        className={`w-full mb-1 px-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white dark:bg-secondary text-gray-800 dark:text-white ${formErrors.name
                            ? "border-red-300 bg-red-50 focus:border-red-300"
                            : "border-red-100 focus:border-red-300 hover:border-gray-300"
                            }`}
                    />
                    {formErrors.name && (
                        <p className="mt-2 text-red-600 dark:text-primary text-sm flex items-center">
                            {formErrors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="phone"
                        className="block md:mb-2 text-sm font-semibold text-black dark:text-white mt-[-8px] sm:mt-0"
                    >
                        ফোন নাম্বার*
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="tel"
                        pattern="[0-9]*"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter Contact Number"
                        className={`w-full px-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white dark:bg-secondary text-gray-800 dark:text-white ${formErrors.phone
                            ? "border-red-300 bg-red-50 focus:border-red-300"
                            : "border-red-100 focus:border-red-300 hover:border-gray-300"
                            }`}
                    />
                    {formErrors.phone && (
                        <p className="mt-2 text-red-600 dark:text-primary text-sm flex items-center">
                            {formErrors.phone}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="address"
                        className="block md:mb-2 text-sm font-semibold text-black dark:text-white mt-[-6px] sm:mt-0"
                    >
                        ডেলিভারি ঠিকানা*
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter Delivery Address"
                        rows={2}
                        className={`w-full px-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none bg-white dark:bg-secondary text-gray-800 dark:text-white ${formErrors.address
                            ? "border-red-300 bg-red-50 focus:border-red-300"
                            : "border-red-100 focus:border-red-300 hover:border-gray-300"
                            }`}
                    />
                    {formErrors.address && (
                        <p className="mt-2 text-red-600 dark:text-primary text-sm flex items-center">
                            {formErrors.address}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="delivery_area"
                        className="block md:mb-2 text-sm font-semibold text-black dark:text-white mt-[-8px] sm:mt-0"
                    >
                        ডেলিভারি এলাকা*
                    </label>
                    <select
                        id="delivery_area"
                        name="delivery_area"
                        value={formData.delivery_area}
                        onChange={handleChange}
                        className={`w-full py-2 lg:px-4 lg:py-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-sm text-gray-800 dark:text-white dark:bg-secondary ${formErrors.delivery_area
                            ? "border-red-300 focus:border-red-300"
                            : "border-red-100 focus:border-red-300 hover:border-gray-300"
                            }`}
                    >
                        <option value="" disabled hidden>
                            Select Delivery Area
                        </option>
                        <option value="inside_dhaka"> ঢাকার ভিতরে - ৳{insideFee}</option>
                        <option value="sub_dhaka"> সাব-ঢাকা - ৳{subDhakaFee}</option>
                        <option value="outside_dhaka"> ঢাকার বাইরে - ৳{outsideFee}</option>
                    </select>
                    {formErrors.delivery_area && (
                        <p className="mt-2 text-red-600 dark:text-primary text-sm flex items-center">
                            {formErrors.delivery_area}
                        </p>
                    )}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label
                            htmlFor="note"
                            className="block text-sm font-bold text-black dark:text-white"
                        >
                            গ্রাহক নোট (optional)
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsNoteVisible(!isNoteVisible)}
                            className="md:hidden ml-2 p-1 rounded-lg bg-gray-100 dark:bg-gray-600"
                        >
                            {isNoteVisible ? 'আড়াল করুন' : 'নোট যোগ করুন'}

                        </button>
                    </div>

                    {(noteVisibility) && (
                        <textarea
                            id="note"
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            placeholder="Enter Your Note"
                            rows={2}
                            className={`w-full px-4 py-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none bg-white dark:bg-secondary text-gray-800 dark:text-white ${formErrors.note
                                ? "border-red-300 bg-red-50 focus:border-red-300"
                                : "border-red-100 focus:border-red-300 hover:border-gray-300"
                                }`}
                        />)}
                    {formErrors.note && (
                        <p className="mt-2 text-red-600 text-sm flex items-center">
                            ⚠️ {formErrors.note}
                        </p>
                    )}
                </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-green-50 p-2 md:p-6 rounded-xl border border-green-200">
                <div className={`flex justify-between ${availablePaymentMethods.length === 0 ? 'flex-row' : 'flex-col'}`}>
                    <div className={`flex flex-row items-center gap-3 justify-between mb-2 md:mb-6 ${availablePaymentMethods.length === 0 ? 'flex-col' : 'flex-row'}`}>
                        <h3 className="font-semibold text-gray-800 mb-1">পেমেন্ট পদ্ধতি</h3>
                        <p className="text-sm text-gray-600">নিরাপদ ও সুবিধাজনক</p>
                    </div>

                    <div className={`grid gap-4 ${availablePaymentMethods.length === 0 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-2 w-full'}`}>
                        {/* COD */}
                        <label
                            className={`flex items-center p-3 border border-gray-300 rounded-lg dark:border-gray-600 cursor-pointer transition-colors ${formData.paymentMethod === "cashOnDelivery"
                                ? "bg-indigo-50 dark:bg-indigo-900 border-indigo-500"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                }`}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cashOnDelivery"
                                checked={formData.paymentMethod === "cashOnDelivery"}
                                onChange={() => handlePaymentMethodChange("cashOnDelivery")}
                                className="mr-3 accent-indigo-600"
                                disabled={isLoading}
                            />
                            <img src="/assets/cod.png" alt="Cash on Delivery" width={50} height={32} />
                            <span className="text-gray-700 dark:text-gray-200">COD</span>
                        </label>

                        {/* Dynamic SSL Methods */}
                        {availablePaymentMethods.map((method) => (
                            <label
                                key={method.name}
                                className={`flex items-center p-3 border border-gray-300 rounded-lg dark:border-gray-600 cursor-pointer transition-colors ${formData.paymentMethod === method.name
                                    ? "bg-indigo-50 dark:bg-indigo-900 border-indigo-500"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value={method.name}
                                    checked={formData.paymentMethod === method.name}
                                    onChange={() => handlePaymentMethodChange(method.name)}
                                    className="mr-3 accent-indigo-600"
                                    disabled={isLoading}
                                />
                                <div className="flex items-center">
                                    {method.logo && (
                                        <img
                                            src={method.logo}
                                            alt={`${method.name} logo`}
                                            width={32}
                                            height={32}
                                            className="mr-2 object-contain"
                                            onError={(e) => {
                                                e.currentTarget.src = "/fallback-image.png";
                                            }}
                                        />
                                    )}
                                    <span className="text-black dark:text-white">{method.name}</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 bg-white dark:bg-secondary p-4 rounded-xl border border-blue-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow duration-200">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        defaultChecked
                        className="w-3 h-3 rounded-md border-2 border-gray-200 text-red-300 focus:ring-2 focus:ring-red-300 bg-white dark:bg-secondary mt-1"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-white">
                        I agree to our{" "}
                        <a href="/terms-of-service" className="text-primary hover:underline">Terms & Conditions</a>,{" "}
                        <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>, and{" "}
                        <a href="/refund-policy" className="text-primary hover:underline">Return & Refund Policy</a>
                    </span>
                </label>
            </div>

        </form >
    );
};

export default DeliveryInfoForm;
