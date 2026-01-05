"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface GlowEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowEffect({
  children,
  className,
  glowColor = "hsl(var(--accent))",
}: GlowEffectProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      whileHover="hover"
      initial="initial"
    >
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-0 blur-xl"
        style={{ background: glowColor }}
        variants={{
          initial: { opacity: 0 },
          hover: { opacity: 0.4 },
        }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
}

export function GlowingBorder({
  children,
  className,
  borderWidth = 2,
}: GlowingBorderProps) {
  return (
    <div className={cn("relative group", className)}>
      <motion.div
        className="absolute -inset-px rounded-xl bg-gradient-to-r from-accent via-primary to-accent opacity-60 blur-sm transition-opacity duration-300 group-hover:opacity-100"
        style={{
          padding: borderWidth,
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="relative rounded-xl bg-card">{children}</div>
    </div>
  );
}
