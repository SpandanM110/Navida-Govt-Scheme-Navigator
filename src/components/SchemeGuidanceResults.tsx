import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, ExternalLink, Sparkles, MessageCircle } from "lucide-react";
import type { UserProfileForGuidance } from "@/lib/schemeGuidanceApi";

const CHAT_CONTEXT_KEY = "navida_chat_context";

interface SchemeGuidanceResultsProps {
  guidance: string;
  urls: string[];
  modelName?: string;
  profile?: UserProfileForGuidance | null;
  onStartOver: () => void;
}

/** Strip embedded "Source links" section from guidance (we show it separately) */
function stripSourceLinksSection(text: string): string {
  const markers = [
    "\n---\n**Source links",
    "\n---\n**Source Links",
    "\n---\n**Source links (verify",
  ];
  for (const marker of markers) {
    const idx = text.indexOf(marker);
    if (idx !== -1) return text.slice(0, idx).trim();
  }
  return text;
}

/** Get display label for URL (domain or shortened) */
function getUrlLabel(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname !== "/" ? u.pathname.slice(0, 40) + (u.pathname.length > 40 ? "…" : "") : "";
    return path ? `${host}${path}` : host;
  } catch {
    return url.length > 50 ? url.slice(0, 50) + "…" : url;
  }
}

export function SchemeGuidanceResults({
  guidance,
  urls,
  modelName = "Llama-4-scout-17b-16e-instruct",
  profile,
  onStartOver,
}: SchemeGuidanceResultsProps) {
  const { t, language } = useLanguage();
  const router = useRouter();

  const handleChatToClearDoubts = () => {
    try {
      sessionStorage.setItem(
        CHAT_CONTEXT_KEY,
        JSON.stringify({
          guidance,
          profile: profile
            ? {
                age: profile.age,
                income: profile.income,
                state: profile.state,
                occupation: profile.occupation,
                gender: profile.gender,
                category: profile.category,
                business_owner: profile.business_owner,
              }
            : undefined,
          urls,
        })
      );
      router.push("/chat");
    } catch (e) {
      router.push("/chat");
    }
  };
  const cleanGuidance = stripSourceLinksSection(guidance);

  const renderText = (text: string, lineKey: number) => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);

      let match: RegExpMatchArray | null = null;
      let matchType: "link" | "bold" = "link";
      if (linkMatch && (!boldMatch || linkMatch.index! <= boldMatch.index!)) {
        match = linkMatch;
        matchType = "link";
      } else if (boldMatch) {
        match = boldMatch;
        matchType = "bold";
      }

      if (match) {
        const before = remaining.slice(0, match.index);
        if (before) parts.push(before);
        if (matchType === "link") {
          parts.push(
            <a
              key={`${lineKey}-${keyIdx++}`}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-medium"
            >
              {match[1]}
            </a>
          );
        } else {
          parts.push(<strong key={`${lineKey}-${keyIdx++}`} className="font-semibold">{match[1]}</strong>);
        }
        remaining = remaining.slice((match.index ?? 0) + match[0].length);
      } else {
        parts.push(remaining);
        break;
      }
    }
    return <>{parts}</>;
  };

  return (
    <section className="py-16 bg-gradient-subtle min-h-[80vh]">
      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-4">
            <Sparkles className="h-8 w-8 text-accent" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
            {t("resultsTitle")}
          </h2>
          <p className="text-muted-foreground">
            Personalized guidance based on your profile (Exa Search + {modelName})
          </p>
        </div>

        <Card className="overflow-hidden shadow-elegant border border-border">
          <CardHeader className="bg-gradient-hero text-primary-foreground">
            <CardTitle className="text-xl font-serif">
              Your Scheme Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-6">
            <div className="space-y-4 text-foreground leading-relaxed">
              {!cleanGuidance || !cleanGuidance.trim() ? (
                <p className="text-muted-foreground italic">
                  No guidance was generated. Please try again or check your profile details.
                </p>
              ) : (
                cleanGuidance.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return (
                      <h3 key={i} className="text-lg font-semibold mt-8 mb-2 text-foreground first:mt-0">
                        {renderText(line.slice(3), i)}
                      </h3>
                    );
                  }
                  if (line.startsWith("# ")) {
                    return (
                      <h2 key={i} className="text-xl font-semibold mt-8 mb-2 text-foreground first:mt-0">
                        {renderText(line.slice(2), i)}
                      </h2>
                    );
                  }
                  if (line.startsWith("- ") || line.startsWith("* ")) {
                    return (
                      <div key={i} className="ml-4 flex gap-2">
                        <span className="text-accent flex-shrink-0">•</span>
                        <span className="text-foreground/90">{renderText(line.slice(2), i)}</span>
                      </div>
                    );
                  }
                  if (line.trim()) {
                    return (
                      <p key={i} className="mb-3 text-foreground/90">
                        {renderText(line, i)}
                      </p>
                    );
                  }
                  return <div key={i} className="h-2" />;
                })
              )}
            </div>

            {urls.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                  <ExternalLink className="h-4 w-4 text-accent" />
                  Source Links
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Verify details on official government portals
                </p>
                <div className="flex flex-wrap gap-2">
                  {urls.slice(0, 8).map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted text-sm text-accent hover:underline transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate max-w-[280px]">{getUrlLabel(url)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-4 justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Powered by Exa Search + {modelName}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleChatToClearDoubts}
                  className="gap-2 bg-gradient-accent text-accent-foreground hover:opacity-90"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("chatToClearDoubts")}
                </Button>
                <Button onClick={onStartOver} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  {t("startOver")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
