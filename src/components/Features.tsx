import { useLanguage } from "@/context/LanguageContext";
import { Search, FileText, Globe, RefreshCw } from "lucide-react";

export function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Search,
      title: t("feature1Title"),
      description: t("feature1Desc"),
    },
    {
      icon: FileText,
      title: t("feature2Title"),
      description: t("feature2Desc"),
    },
    {
      icon: Globe,
      title: t("feature3Title"),
      description: t("feature3Desc"),
    },
    {
      icon: RefreshCw,
      title: t("feature4Title"),
      description: t("feature4Desc"),
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif font-bold text-foreground sm:text-4xl">
            {t("featuresTitle")}
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 bg-card rounded-xl border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-elegant"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
