"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { schemes } from "@/lib/schemes";
import { ExternalLink, CheckCircle } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function SchemesSection() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Popular Schemes",
      subtitle: "Explore Government Welfare Programs",
      viewAll: "View All Schemes",
      benefits: "Key Benefits",
      apply: "Learn More",
    },
    hi: {
      title: "लोकप्रिय योजनाएं",
      subtitle: "सरकारी कल्याण कार्यक्रम देखें",
      viewAll: "सभी योजनाएं देखें",
      benefits: "मुख्य लाभ",
      apply: "और जानें",
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  // Show first 6 schemes
  const displaySchemes = schemes.slice(0, 6);

  return (
    <section id="schemes" className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
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
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {displaySchemes.map((scheme) => (
            <motion.div
              key={scheme.id}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <SpotlightCard className="h-full flex flex-col">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {language === "hi" ? scheme.nameHi : scheme.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {language === "hi" ? scheme.descriptionHi : scheme.description}
                  </p>
                  <p className="text-xs text-primary/80 mb-4">{scheme.ministry}</p>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-foreground">{t.benefits}:</p>
                    <ul className="space-y-1">
                      {(language === "hi" ? scheme.benefitsHi : scheme.benefits)
                        .slice(0, 2)
                        .map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-auto"
                  asChild
                >
                  <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer">
                    {t.apply}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button variant="outline" size="lg" asChild>
            <a href="/schemes">
              {t.viewAll}
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
