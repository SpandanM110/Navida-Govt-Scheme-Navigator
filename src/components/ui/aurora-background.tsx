"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  showRadialGradient?: boolean;
}

export function AuroraBackground({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col h-full items-center justify-center bg-background text-foreground transition-bg overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className={cn(
            `
            [--aurora:repeating-linear-gradient(100deg,hsl(var(--primary))_10%,hsl(var(--accent))_15%,hsl(var(--primary))_20%,hsl(var(--accent))_25%,hsl(var(--primary))_30%)]
            [background-image:var(--aurora)]
            [background-size:300%_200%]
            [background-position:50%_50%]
            absolute
            inset-0
            opacity-30
            blur-[80px]
            will-change-transform
            `,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
          )}
          style={{
            animation: "aurora 60s linear infinite",
          }}
        />
      </div>
      <style>
        {`
          @keyframes aurora {
            from {
              background-position: 50% 50%, 50% 50%;
            }
            to {
              background-position: 350% 50%, 350% 50%;
            }
          }
        `}
      </style>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
