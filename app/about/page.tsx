"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Layout } from "@/components/Layout";
import { SpotlightCard } from "@/components/ui/spotlight";
import { Users, Target, Award, Heart, Shield, Zap } from "lucide-react";
import { schemes, states } from "@/lib/schemes";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const values = [
  { icon: Heart, title: "Citizen First", description: "Every decision we make puts the welfare of citizens at the center." },
  { icon: Shield, title: "Trust & Security", description: "Your data is protected with enterprise-grade security measures." },
  { icon: Zap, title: "Accessibility", description: "Making government schemes accessible to everyone, everywhere." },
];

const stats = [
  { value: `${schemes.length}+`, label: "Curated Schemes" },
  { value: states.length.toString(), label: "States & UTs" },
  { value: "6", label: "Languages" },
  { value: "Free", label: "Always Free" },
];

export default function AboutPage() {
  const { language } = useLanguage();

  return (
    <Layout>
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {language === "hi" ? "हमारे बारे में" : "About Us"}
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              {language === "hi" 
                ? "नागरिकों को सरकारी योजनाओं से जोड़ना" 
                : "Connecting Citizens with Government Schemes"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === "hi"
                ? "नविदा एक AI-संचालित प्लेटफॉर्म है जो नागरिकों को उनकी पात्रता के अनुसार सरकारी योजनाओं की खोज में मदद करता है।"
                : "Navida is an AI-powered platform that helps citizens discover government schemes they're eligible for, making welfare benefits accessible to all."}
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center p-6 rounded-xl bg-card border border-border"
              >
                <motion.p
                  className="text-4xl font-serif font-bold text-primary mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center mb-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">
                {language === "hi" ? "हमारा मिशन" : "Our Mission"}
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {language === "hi"
                  ? "हमारा मिशन भारत के हर नागरिक को उनके हक की सरकारी योजनाओं तक पहुंचाना है। हम प्रौद्योगिकी का उपयोग करके जटिल पात्रता मानदंडों को सरल बनाते हैं।"
                  : "Our mission is to bridge the gap between government welfare schemes and the citizens who need them most. We use technology to simplify complex eligibility criteria and make benefits accessible."}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {language === "hi"
                  ? "AI और मशीन लर्निंग के माध्यम से, हम व्यक्तिगत सिफारिशें प्रदान करते हैं जो प्रत्येक नागरिक की विशिष्ट आवश्यकताओं और पृष्ठभूमि के अनुरूप हैं।"
                  : "Through AI and machine learning, we provide personalized recommendations tailored to each citizen's unique needs and background."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <SpotlightCard className="p-6 flex flex-col items-center text-center">
                <Users className="h-10 w-10 text-accent mb-3" />
                <h3 className="font-semibold text-foreground">Community</h3>
              </SpotlightCard>
              <SpotlightCard className="p-6 flex flex-col items-center text-center">
                <Target className="h-10 w-10 text-accent mb-3" />
                <h3 className="font-semibold text-foreground">Precision</h3>
              </SpotlightCard>
              <SpotlightCard className="p-6 flex flex-col items-center text-center">
                <Award className="h-10 w-10 text-accent mb-3" />
                <h3 className="font-semibold text-foreground">Excellence</h3>
              </SpotlightCard>
              <SpotlightCard className="p-6 flex flex-col items-center text-center">
                <Shield className="h-10 w-10 text-accent mb-3" />
                <h3 className="font-semibold text-foreground">Security</h3>
              </SpotlightCard>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif font-bold text-foreground text-center mb-12">
              {language === "hi" ? "हमारे मूल्य" : "Our Core Values"}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div key={value.title} variants={itemVariants}>
                  <SpotlightCard className="h-full text-center p-8">
                    <motion.div
                      className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <value.icon className="h-8 w-8 text-accent" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
