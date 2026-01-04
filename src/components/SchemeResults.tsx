import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Scheme, UserProfile } from "@/lib/schemes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExternalLink, FileText, Gift, RefreshCw, CheckCircle2 } from "lucide-react";

interface SchemeResultsProps {
  schemes: Scheme[];
  profile: UserProfile;
  onStartOver: () => void;
}

export function SchemeResults({ schemes, profile, onStartOver }: SchemeResultsProps) {
  const { language, t } = useLanguage();
  const isHindi = language === "hi";

  return (
    <section className="py-16 bg-gradient-subtle min-h-[80vh]">
      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-success/10 mb-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
            {t("resultsTitle")}
          </h2>
          {schemes.length > 0 && (
            <p className="text-muted-foreground">
              <span className="text-2xl font-bold text-accent">{schemes.length}</span>{" "}
              {t("schemesFound")}
            </p>
          )}
        </div>

        {schemes.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground mb-6">{t("noResults")}</p>
            <Button onClick={onStartOver} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              {t("startOver")}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {schemes.map((scheme, index) => (
              <Card 
                key={scheme.id} 
                className="overflow-hidden hover:shadow-elegant transition-shadow animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="bg-gradient-hero text-primary-foreground">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl font-serif">
                        {isHindi ? scheme.nameHi : scheme.name}
                      </CardTitle>
                      <CardDescription className="text-primary-foreground/80 mt-1">
                        {scheme.ministry}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      Eligible
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">
                    {isHindi ? scheme.descriptionHi : scheme.description}
                  </p>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="benefits">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Gift className="h-4 w-4 text-accent" />
                          <span>{t("benefits")}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-6">
                          {(isHindi ? scheme.benefitsHi : scheme.benefits).map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="documents">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-accent" />
                          <span>{t("documentsNeeded")}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 pl-6">
                          {(isHindi ? scheme.documentsHi : scheme.documents).map((doc, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-2" />
                              <span className="text-muted-foreground">{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-6 pt-4 border-t border-border">
                    <Button
                      asChild
                      className="w-full bg-gradient-accent text-accent-foreground hover:opacity-90 gap-2"
                    >
                      <a href={scheme.officialLink} target="_blank" rel="noopener noreferrer">
                        {t("applyNow")}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="text-center pt-6">
              <Button onClick={onStartOver} variant="outline" size="lg" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                {t("startOver")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
