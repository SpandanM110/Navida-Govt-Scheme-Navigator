"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface ParticleProps {
  delay: number;
  duration: number;
  x: number;
  y: number;
  size: number;
}

function Particle({ delay, duration, x, y, size }: ParticleProps) {
  return (
    <motion.div
      className="absolute rounded-full bg-accent/30"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0.5],
        y: [0, -100, -200],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({
  count = 20,
  className,
}: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      x: Math.random() * 100,
      y: 50 + Math.random() * 50,
      size: 4 + Math.random() * 8,
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <Particle key={particle.id} {...particle} />
      ))}
    </div>
  );
}
