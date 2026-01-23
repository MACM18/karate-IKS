"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "white"
    | "yellow"
    | "orange"
    | "green"
    | "blue"
    | "purple"
    | "brown"
    | "red"
    | "black"
    | "default"
    | "outline"
    | "achievement";
  glow?: boolean;
}

function Badge({
  className,
  variant = "default",
  glow = false,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border-2 transition-all duration-300 shadow-lg";

  // Belt rank variants
  const variantStyles = {
    // Belt ranks
    white: "bg-white text-gray-900 border-gray-300 shadow-gray-400/50",
    yellow:
      "bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 border-yellow-600 shadow-yellow-600/50",
    orange:
      "bg-gradient-to-br from-orange-400 to-orange-600 text-white border-orange-700 shadow-orange-600/50",
    green:
      "bg-gradient-to-br from-green-500 to-green-700 text-white border-green-800 shadow-green-600/50",
    blue: "bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-800 shadow-blue-600/50",
    purple:
      "bg-gradient-to-br from-purple-500 to-purple-700 text-white border-purple-800 shadow-purple-600/50",
    brown:
      "bg-gradient-to-br from-amber-700 to-amber-900 text-white border-amber-950 shadow-amber-800/50",
    red: "bg-gradient-to-br from-red-600 to-red-800 text-white border-red-900 shadow-red-700/60 hover:shadow-red-700/80",
    black:
      "bg-gradient-to-br from-gray-900 to-black text-red-500 border-red-600 shadow-red-900/70 hover:shadow-red-900/90 font-extrabold",

    // General variants
    default:
      "bg-gradient-to-br from-red-600 to-red-700 text-white border-red-800 shadow-red-900/50",
    outline:
      "bg-transparent text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950/30",
    achievement:
      "bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-yellow-900 border-yellow-600 shadow-yellow-500/60 animate-pulse",
  };

  const glowEffect = glow
    ? "shadow-2xl ring-2 ring-red-500/50 ring-offset-2 ring-offset-background"
    : "";

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        glowEffect,
        "hover:scale-110 hover:shadow-xl",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
