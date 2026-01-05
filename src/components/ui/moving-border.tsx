"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface MovingBorderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: React.ReactNode;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
}

export function MovingBorderButton({
  borderRadius = "1rem",
  children,
  containerClassName,
  borderClassName,
  duration = 2500,
  className,
  ...props
}: MovingBorderButtonProps) {
  return (
    <button
      className={cn(
        "relative h-12 px-8 overflow-hidden bg-transparent p-[2px] text-base font-medium",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <motion.div
          className={cn(
            "absolute inset-[-1000%] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--accent))_0%,hsl(var(--primary))_50%,hsl(var(--accent))_100%)]",
            borderClassName
          )}
          style={{
            animation: `spin ${duration}ms linear infinite`,
          }}
        />
      </div>
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center bg-background text-foreground",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </button>
  );
}
