"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import navidaLogo from "@/assets/navida-logo.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <motion.img
                src={navidaLogo}
                alt="Navida Logo"
                className="h-10 w-10 rounded-lg bg-primary-foreground/10 p-1"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <span className="text-xl font-serif font-semibold">
                {t("brand")}
              </span>
            </motion.div>
            <p className="text-primary-foreground/70 max-w-md">
              {t("footerText")}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              {[t("privacy"), t("terms"), t("contact")].map((link, index) => (
                <motion.li
                  key={link}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href="#"
                    className="hover:text-primary-foreground transition-colors inline-block"
                  >
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">{t("contact")}</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <motion.li
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                support@navida.gov.in
              </motion.li>
              <motion.li
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Toll Free: 1800-XXX-XXXX
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>© 2026 Navida. Making government services accessible to all.</p>
        </motion.div>
      </div>
    </footer>
  );
}
