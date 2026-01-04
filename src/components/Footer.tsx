import { useLanguage } from "@/context/LanguageContext";
import navidaLogo from "@/assets/navida-logo.png";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={navidaLogo} alt="Navida Logo" className="h-10 w-10 rounded-lg bg-primary-foreground/10 p-1" />
              <span className="text-xl font-serif font-semibold">{t("brand")}</span>
            </div>
            <p className="text-primary-foreground/70 max-w-md">
              {t("footerText")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  {t("privacy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  {t("terms")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-foreground transition-colors">
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t("contact")}</h4>
            <ul className="space-y-2 text-primary-foreground/70">
              <li>support@navida.gov.in</li>
              <li>Toll Free: 1800-XXX-XXXX</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>© 2026 Navida. Making government services accessible to all.</p>
        </div>
      </div>
    </footer>
  );
}
