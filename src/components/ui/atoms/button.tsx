"use client";

import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "flat" | "edge" | "outline" | "outline-flat" | "outline-edge" | "link" | "gradient" | "custom";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "none";
  title: string;
  type?: "button" | "submit" | "reset";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "none", children, className, title, type = "button", ...props }, ref) => {
    const baseStyles = "font-semibold transition-all duration-200 w-fit cursor-pointer";

    const variantStyles: Record<string, string> = {
      default: "rounded bg-primary text-white",
      flat: "rounded-none bg-primary text-text",
      edge: "rounded-full border border-primary",
      outline: "border border-primary rounded",
      "outline-flat": "border border-primary rounded-none",
      "outline-edge": "border border-primary rounded-full",
      ghost: "shadow-none border-none rounded-none bg-transparent",
      link: "text-primary hover:underline p-0",
      gradient: "w-full bg-gradient-to-r from-primary to-red-800 text-white font-semibold py-3 px-4 rounded-xl hover:from-primary/90 hover:to-primary transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
      custom: "w-full bg-primary shadow-lg py-2 rounded-full font-medium text-white",
    };

    const sizeStyles: Record<string, string> = {
      none: "",
      xs: "p-1 text-xs",
      sm: "px-3 py-1 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-lg",
      xl: "px-8 py-4 text-xl",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={twMerge(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        aria-label={title}
        title={title}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button"; // ⬅️ For better debugging in React DevTools
