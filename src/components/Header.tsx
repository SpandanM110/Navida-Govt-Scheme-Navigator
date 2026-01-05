"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import navidaLogo from "@/assets/navida-logo.png";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <motion.img
            src={navidaLogo}
            alt="Navida Logo"
            className="h-10 w-10"
            whileHover={{ rotate: 5 }}
            transition={{ duration: 0.2 }}
          />
          <div>
            <h1 className="text-xl font-serif font-semibold text-foreground">
              {t("brand")}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {t("tagline")}
            </p>
          </div>
        </motion.div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {language === "en" ? "English" : "हिंदी"}
                </span>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" asChild>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                🇬🇧 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("hi")}>
                🇮🇳 हिंदी
              </DropdownMenuItem>
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
