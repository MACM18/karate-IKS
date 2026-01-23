"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    rank?: "master" | "advanced" | "intermediate" | "beginner";
  }
>(({ className, rank, ...props }, ref) => {
  const rankStyles = {
    master:
      "border-red-600 bg-gradient-to-br from-red-950/50 to-black shadow-xl shadow-red-900/40 before:absolute before:inset-0 before:border-2 before:border-red-600/30 before:rounded-2xl",
    advanced:
      "border-red-500 bg-gradient-to-br from-red-900/30 to-gray-900 shadow-lg shadow-red-800/30",
    intermediate:
      "border-red-400/50 bg-gradient-to-br from-red-900/20 to-gray-800 shadow-lg shadow-red-700/20",
    beginner:
      "border-red-300/40 bg-gradient-to-br from-red-900/10 to-gray-700 shadow-md shadow-red-600/10",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-2xl border-2 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] overflow-hidden group",
        rank
          ? rankStyles[rank]
          : "border-red-600/40 bg-card/80 shadow-lg shadow-red-900/20",
        className
      )}
      {...props}
    >
      {/* Top accent strip - like a belt */}
      <div className='absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-red-600 to-transparent opacity-70' />

      {props.children}

      {/* Subtle pattern overlay */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(220,38,38,0.1),transparent_50%)] pointer-events-none' />
    </div>
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 p-6 border-b border-red-900/30 bg-linear-to-r from-red-950/20 to-transparent",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-bold tracking-tight uppercase bg-linear-to-r from-red-500 to-red-700 bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground/80", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-4", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0 border-t border-red-900/20 bg-linear-to-r from-transparent to-red-950/10",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
