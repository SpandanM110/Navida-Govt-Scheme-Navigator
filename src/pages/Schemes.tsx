"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Layout } from "@/components/Layout";
import { SpotlightCard } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { schemes as allSchemes } from "@/lib/schemes";
import { Search, Filter, ExternalLink, Users, Briefcase, GraduationCap, Heart, Home, Sprout } from "lucide-react";

const categories = [
  { id: "all", label: "All Schemes", icon: Filter },
  { id: "agriculture", label: "Agriculture", icon: Sprout },
  { id: "health", label: "Health", icon: Heart },
  { id: "housing", label: "Housing", icon: Home },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "women", label: "Women", icon: Users },
  { id: "education", label: "Education", icon: GraduationCap },
];

// Map schemes to categories based on ministry
function getSchemeCategory(ministry: string): string {
  const m = ministry.toLowerCase();
  if (m.includes("agriculture")) return "agriculture";
  if (m.includes("health")) return "health";
  if (m.includes("housing") || m.includes("urban")) return "housing";
  if (m.includes("labour") || m.includes("employment")) return "employment";
  if (m.includes("women") || m.includes("child")) return "women";
  if (m.includes("education")) return "education";
  return "other";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Schemes() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredSchemes = allSchemes.filter((scheme) => {
    const matchesSearch =
      scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.nameHi.includes(searchQuery) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const schemeCategory = getSchemeCategory(scheme.ministry);
    const matchesCategory = activeCategory === "all" || schemeCategory === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          {/* Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.span
              className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {language === "hi" ? "सभी योजनाएं" : "All Schemes"}
            </motion.span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              {language === "hi" ? "सरकारी योजनाएं खोजें" : "Explore Government Schemes"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === "hi"
                ? "500+ सरकारी योजनाएं ब्राउज़ करें और अपने लिए सही योजना खोजें"
                : "Browse through 500+ government schemes and find the right ones for you"}
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={language === "hi" ? "योजना खोजें..." : "Search schemes..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.p
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {language === "hi"
              ? `${filteredSchemes.length} योजनाएं मिलीं`
              : `Found ${filteredSchemes.length} schemes`}
          </motion.p>

          {/* Schemes Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {filteredSchemes.map((scheme) => (
                <motion.div
                  key={scheme.id}
                  variants={cardVariants}
                  layout
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <SpotlightCard className="h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {getSchemeCategory(scheme.ministry)}
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                        Active
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {language === "hi" ? scheme.nameHi : scheme.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1 line-clamp-3">
                      {language === "hi" ? scheme.descriptionHi : scheme.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">{scheme.ministry}</span>
                      <Button size="sm" variant="ghost" className="gap-1" asChild>
                        <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer">
                          Apply <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredSchemes.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground text-lg">
                {language === "hi" ? "कोई योजना नहीं मिली" : "No schemes found"}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
