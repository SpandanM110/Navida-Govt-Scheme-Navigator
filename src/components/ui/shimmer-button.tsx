"use client";

import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";
import React from "react";

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
  borderRadius?: string;
  background?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = "hsl(var(--accent))",
  borderRadius = "0.75rem",
  background = "var(--gradient-accent)",
  onClick,
  type = "button",
  disabled,
}: ShimmerButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative inline-flex h-12 items-center justify-center overflow-hidden px-8 text-base font-medium text-accent-foreground transition-all",
        className
      )}
      style={{
        borderRadius,
        background,
      }}
    >
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ borderRadius }}
      >
        <span
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${shimmerColor}40, transparent)`,
            animation: "shimmer 2s infinite",
          }}
        />
      </span>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <style>
        {`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}
      </style>
    </motion.button>
  );
}
