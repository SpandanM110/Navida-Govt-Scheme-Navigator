"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface NavLink {
  href: string;
  labelKey: string;
  sectionId?: string; // For smooth scrolling on home page
}

const navLinks: NavLink[] = [
  { href: "/", labelKey: "navHome" },
  { href: "/schemes", labelKey: "navSchemes", sectionId: "schemes" },
  { href: "/about", labelKey: "navAbout", sectionId: "about" },
  { href: "/faq", labelKey: "navFaq", sectionId: "faq" },
  { href: "/contact", labelKey: "navContact", sectionId: "contact" },
];

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (link: NavLink, e: React.MouseEvent) => {
    // If we're on the home page and the link has a section ID, smooth scroll
    if (pathname === "/" && link.sectionId) {
      e.preventDefault();
      const element = document.getElementById(link.sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (link.sectionId && pathname !== "/") {
      // If not on home page but link has section, navigate to home then scroll
      e.preventDefault();
      router.push("/");
      setTimeout(() => {
        const element = document.getElementById(link.sectionId!);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.img
              src="/images/navida-logo.png"
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
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={(e) => handleNavClick(link, e)}
              >
                <motion.div
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors relative",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t(link.labelKey)}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-primary rounded-full"
                      layoutId="activeNav"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Auth */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                {language === "hi" ? "साइन इन" : "Sign In"}
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button size="sm" className="bg-primary text-primary-foreground">
                {language === "hi" ? "साइन अप" : "Sign Up"}
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          {/* Language Switcher - Multilingual support */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {language === "en" && "English"}
                    {language === "hi" && "हिंदी"}
                    {language === "bn" && "বাংলা"}
                    {language === "ta" && "தமிழ்"}
                    {language === "te" && "తెలుగు"}
                    {language === "mr" && "मराठी"}
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                🇬🇧 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("hi")}>
                🇮🇳 हिंदी
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("bn")}>
                🇮🇳 বাংলা
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ta")}>
                🇮🇳 தமிழ்
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("te")}>
                🇮🇳 తెలుగు
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("mr")}>
                🇮🇳 मराठी
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-muted/50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-border bg-background"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container py-4 space-y-1">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => {
                        handleNavClick(link, e);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {t(link.labelKey)}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
