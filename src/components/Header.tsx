import { useLanguage } from "@/context/LanguageContext";
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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={navidaLogo} alt="Navida Logo" className="h-10 w-10" />
          <div>
            <h1 className="text-xl font-serif font-semibold text-foreground">
              {t("brand")}
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {t("tagline")}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">
                {language === "en" ? "English" : "हिंदी"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("en")}>
              🇬🇧 English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("hi")}>
              🇮🇳 हिंदी
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
