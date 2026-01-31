"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Target, MapPin, Globe, Zap } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight";
import { schemes, states } from "@/lib/schemes";

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

export function AboutSection() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "About Navida",
      subtitle: "Bridging Citizens & Government Welfare",
      description: "Navida is an AI-powered platform designed to help Indian citizens discover and access government welfare schemes they are eligible for. We believe every citizen deserves to benefit from the programs meant for them.",
      stats: [
        { icon: Target, value: `${schemes.length}+`, label: "Curated Schemes" },
        { icon: MapPin, value: states.length.toString(), label: "States & UTs" },
        { icon: Globe, value: "6", label: "Languages" },
        { icon: Zap, value: "Free", label: "Always Free" },
      ],
      mission: "Our Mission",
      missionText: "To make government welfare accessible to every Indian citizen through technology, breaking barriers of language, literacy, and awareness.",
      vision: "Our Vision",
      visionText: "A India where no eligible citizen misses out on government benefits due to lack of information or complex procedures.",
    },
    hi: {
      title: "नविदा के बारे में",
      subtitle: "नागरिकों और सरकारी कल्याण को जोड़ना",
      description: "नविदा एक AI-संचालित प्लेटफॉर्म है जो भारतीय नागरिकों को उन सरकारी कल्याण योजनाओं की खोज और पहुंच में मदद करने के लिए डिज़ाइन किया गया है जिनके लिए वे पात्र हैं। हम मानते हैं कि हर नागरिक को उनके लिए बनाए गए कार्यक्रमों से लाभ उठाने का अधिकार है।",
      stats: [
        { icon: Target, value: `${schemes.length}+`, label: "क्यूरेटेड योजनाएं" },
        { icon: MapPin, value: states.length.toString(), label: "राज्य और केंद्रशासित" },
        { icon: Globe, value: "6", label: "भाषाएं" },
        { icon: Zap, value: "मुफ्त", label: "हमेशा मुफ्त" },
      ],
      mission: "हमारा मिशन",
      missionText: "प्रौद्योगिकी के माध्यम से हर भारतीय नागरिक के लिए सरकारी कल्याण को सुलभ बनाना, भाषा, साक्षरता और जागरूकता की बाधाओं को तोड़ना।",
      vision: "हमारी दृष्टि",
      visionText: "एक ऐसा भारत जहां कोई भी पात्र नागरिक जानकारी की कमी या जटिल प्रक्रियाओं के कारण सरकारी लाभों से वंचित न रहे।",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <section id="about" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-sm font-medium text-primary mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.subtitle}
          </motion.span>
          <motion.h2
            className="text-3xl font-serif font-bold text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t.title}
          </motion.h2>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto text-center mb-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t.description}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {t.stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <SpotlightCard className="text-center py-8">
                <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                <p className="text-3xl font-serif font-bold text-foreground mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission & Vision */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <SpotlightCard className="h-full">
              <h3 className="text-xl font-serif font-bold text-foreground mb-4">
                {t.mission}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.missionText}
              </p>
            </SpotlightCard>
          </motion.div>
          <motion.div variants={itemVariants}>
            <SpotlightCard className="h-full">
              <h3 className="text-xl font-serif font-bold text-foreground mb-4">
                {t.vision}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.visionText}
              </p>
            </SpotlightCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
