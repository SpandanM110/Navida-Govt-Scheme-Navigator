"use client";

import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import heroPeople from "@/assets/hero-people.jpg";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { GlowEffect } from "@/components/ui/glow-effect";
import { SpotlightCard } from "@/components/ui/spotlight";

interface HeroProps {
  onStartCheck: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9, x: 50 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const floatingCardVariants = {
  hidden: { opacity: 0, x: -50, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function Hero({ onStartCheck }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* HD Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Aurora Effect */}
      <motion.div
        className="absolute inset-0 opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 30%, hsl(var(--primary) / 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, hsl(var(--accent) / 0.2) 0%, transparent 50%)",
          }}
        />
      </motion.div>

      {/* Floating Particles */}
      <FloatingParticles count={25} />

      <div className="container relative py-16 md:py-24 lg:py-32 z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-primary border border-primary/20"
              variants={itemVariants}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <Sparkles className="h-4 w-4" />
              Government Scheme Navigator
            </motion.div>

            <motion.h1
              className="text-4xl font-serif font-bold tracking-tight sm:text-5xl lg:text-6xl"
              variants={itemVariants}
            >
              {t("heroTitle")}{" "}
              <motion.span
                className="text-gradient-accent inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {t("heroTitleAccent")}
              </motion.span>
            </motion.h1>

            <motion.p
              className="max-w-lg text-lg text-muted-foreground leading-relaxed"
              variants={itemVariants}
            >
              {t("heroDescription")}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <GlowEffect>
                <ShimmerButton onClick={onStartCheck} className="shadow-glow">
                  {t("startNow")}
                  <ArrowRight className="h-5 w-5" />
                </ShimmerButton>
              </GlowEffect>

            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex gap-8 pt-4"
              variants={containerVariants}
            >
              {[
                { value: "500+", label: "Schemes Listed" },
                { value: "10L+", label: "Citizens Helped" },
                { value: "28", label: "States Covered" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={statVariants}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-default"
                >
                  <motion.p
                    className="text-3xl font-serif font-bold text-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <GlowEffect glowColor="hsl(var(--primary))">
              <div className="relative rounded-2xl overflow-hidden shadow-elegant border border-border/50">
                <motion.img
                  src={heroPeople}
                  alt="Diverse Indian citizens benefiting from government schemes"
                  className="w-full h-auto object-cover"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
              </div>
            </GlowEffect>

            {/* Floating Card */}
            <motion.div
              variants={floatingCardVariants}
              initial="hidden"
              animate="visible"
              className="absolute -bottom-6 -left-6"
            >
              <SpotlightCard className="p-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <svg
                      className="h-6 w-6 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <p className="font-semibold text-card-foreground">
                      PM-KISAN
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₹6,000 credited
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>

            {/* Additional floating element */}
            <motion.div
              className="absolute -top-4 -right-4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <motion.div
                className="h-16 w-16 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-8 w-8 text-accent" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
