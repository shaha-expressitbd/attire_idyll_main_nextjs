import React from "react";

interface ProductHeaderProps {
    name: string;
}

export function ProductHeader({ name }: ProductHeaderProps) {
    return (
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mt-6 break-all">
            {name}
        </h1>
    );
}