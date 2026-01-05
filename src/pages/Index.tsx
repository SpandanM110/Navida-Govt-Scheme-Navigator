import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { EligibilityChecker } from "@/components/EligibilityChecker";
import { SchemeResults } from "@/components/SchemeResults";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { Scheme, UserProfile } from "@/lib/schemes";

type View = "home" | "checker" | "results";

const Index = () => {
  const [view, setView] = useState<View>("home");
  const [results, setResults] = useState<Scheme[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const handleStartCheck = () => {
    setView("checker");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResults = (schemes: Scheme[], profile: UserProfile) => {
    setResults(schemes);
    setUserProfile(profile);
    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStartOver = () => {
    setResults([]);
    setUserProfile(null);
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
          </>
        )}
        
        {view === "checker" && (
          <EligibilityChecker 
            onResults={handleResults} 
            onBack={handleBackToHome}
          />
        )}
        
        {view === "results" && userProfile && (
          <SchemeResults 
            schemes={results} 
            profile={userProfile}
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
