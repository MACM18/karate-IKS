"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "strike" | "ghost" | "kata" | "destructive" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group";

    const variantStyles = {
      default:
        "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/70 hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity",
      strike:
        "bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white shadow-lg shadow-red-900/60 hover:shadow-2xl hover:shadow-red-900/80 hover:scale-110 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent_70%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity active:scale-95 border-2 border-red-900/50",
      kata: "bg-black text-red-500 border-2 border-red-600 shadow-lg shadow-red-600/30 hover:bg-red-950 hover:text-white hover:border-red-500 hover:shadow-xl hover:shadow-red-600/50 hover:scale-105 before:absolute before:inset-0 before:border-2 before:border-red-500/50 before:scale-95 before:opacity-0 hover:before:opacity-100 hover:before:scale-100 before:transition-all",
      ghost:
        "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 border border-transparent hover:border-red-200 dark:hover:border-red-900",
      outline:
        "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white shadow-md hover:shadow-lg transition-all",
      destructive:
        "bg-gradient-to-br from-orange-600 to-red-700 text-white shadow-lg shadow-orange-900/50 hover:shadow-xl hover:from-orange-700 hover:to-red-800",
    };

    const sizeStyles = {
      default: "h-11 px-6 py-2.5 text-sm rounded-lg",
      sm: "h-9 px-4 py-2 text-xs rounded-md",
      lg: "h-14 px-10 py-3 text-base rounded-xl",
      icon: "h-11 w-11 rounded-lg",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      >
        <span className='relative z-10 flex items-center gap-2'>
          {children}
        </span>

        {/* Strike effect animation */}
        {variant === "strike" && (
          <span className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <span className='absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-white/40 group-hover:animate-pulse' />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
