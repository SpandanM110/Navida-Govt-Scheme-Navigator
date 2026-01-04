import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroPeople from "@/assets/hero-people.jpg";

interface HeroProps {
  onStartCheck: () => void;
}

export function Hero({ onStartCheck }: HeroProps) {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-subtle">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05)_0%,transparent_50%)]" />
      
      <div className="container relative py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Government Scheme Navigator
            </div>
            
            <h1 className="text-4xl font-serif font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t("heroTitle")}{" "}
              <span className="text-gradient-accent">{t("heroTitleAccent")}</span>
            </h1>
            
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              {t("heroDescription")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={onStartCheck}
                className="bg-gradient-accent text-accent-foreground hover:opacity-90 transition-opacity shadow-glow gap-2 text-base"
              >
                {t("startNow")}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 text-base"
              >
                <Play className="h-5 w-5" />
                {t("learnMore")}
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-serif font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Schemes Listed</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-primary">10L+</p>
                <p className="text-sm text-muted-foreground">Citizens Helped</p>
              </div>
              <div>
                <p className="text-3xl font-serif font-bold text-primary">28</p>
                <p className="text-sm text-muted-foreground">States Covered</p>
              </div>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img
                src={heroPeople}
                alt="Diverse Indian citizens benefiting from government schemes"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg p-4 border border-border animate-slide-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">PM-KISAN</p>
                  <p className="text-sm text-muted-foreground">₹6,000 credited</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
