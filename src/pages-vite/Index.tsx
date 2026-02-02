import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AboutSection } from "@/components/AboutSection";
import { SchemesSection } from "@/components/SchemesSection";
import { FAQSection } from "@/components/FAQSection";
import { ContactSection } from "@/components/ContactSection";
import { EligibilityChecker } from "@/components/EligibilityChecker";
import { SchemeGuidanceResults } from "@/components/SchemeGuidanceResults";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import type { UserProfileForGuidance } from "@/lib/schemeGuidanceApi";

type View = "home" | "checker" | "results";

const Index = () => {
  const [view, setView] = useState<View>("home");
  const [guidance, setGuidance] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [modelName, setModelName] = useState<string>("Llama-4-scout-17b-16e-instruct");
  const [profile, setProfile] = useState<UserProfileForGuidance | null>(null);

  const handleStartCheck = () => {
    setView("checker");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResults = (
    newGuidance: string,
    newUrls: string[],
    newProfile: UserProfileForGuidance,
    newModelName?: string
  ) => {
    setGuidance(newGuidance);
    setUrls(newUrls);
    setProfile(newProfile);
    setModelName(newModelName || "Llama-4-scout-17b-16e-instruct");
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartOver = () => {
    setGuidance("");
    setUrls([]);
    setProfile(null);
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setView("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {view === "home" && (
          <>
            <Hero onStartCheck={handleStartCheck} />
            <Features />
            <AboutSection />
            <SchemesSection />
            <FAQSection />
            <ContactSection />
          </>
        )}

        {view === "checker" && (
          <EligibilityChecker onResults={handleResults} onBack={handleBackToHome} />
        )}

        {view === "results" && (
          <SchemeGuidanceResults
            guidance={guidance}
            urls={urls}
            modelName={modelName}
            profile={profile}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <Footer />
      <Chatbot />
    </div>
  );
};

export default Index;
