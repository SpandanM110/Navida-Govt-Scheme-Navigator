import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { states, occupations, checkEligibility, Scheme, UserProfile } from "@/lib/schemes";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EligibilityCheckerProps {
  onResults: (schemes: Scheme[], profile: UserProfile) => void;
  onBack: () => void;
}

export function EligibilityChecker({ onResults, onBack }: EligibilityCheckerProps) {
  const { language, t } = useLanguage();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    age: "",
    income: "",
    state: "",
    occupation: "",
    gender: "",
    category: "general",
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = () => {
    const profile: UserProfile = {
      age: parseInt(formData.age) || 0,
      income: parseInt(formData.income) || 0,
      state: formData.state,
      occupation: formData.occupation,
      gender: formData.gender,
      category: formData.category,
    };
    
    const eligibleSchemes = checkEligibility(profile);
    onResults(eligibleSchemes, profile);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.age && formData.gender;
      case 2:
        return formData.income && formData.occupation;
      case 3:
        return formData.state;
      default:
        return true;
    }
  };

  return (
    <section className="py-16 bg-gradient-subtle min-h-[80vh]">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
            {t("eligibilityTitle")}
          </h2>
          <p className="text-muted-foreground">{t("eligibilitySubtitle")}</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Step {step} of {totalSteps}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-elegant border border-border p-8">
          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="age">{t("age")}</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder={t("agePlaceholder")}
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="0"
                  max="120"
                />
              </div>

              <div className="space-y-3">
                <Label>{t("gender")}</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">{t("genderMale")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">{t("genderFemale")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="cursor-pointer">{t("genderOther")}</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>{t("category")}</Label>
                <RadioGroup
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  className="flex flex-wrap gap-4"
                >
                  {[
                    { value: "general", label: t("categoryGeneral") },
                    { value: "obc", label: t("categoryOBC") },
                    { value: "sc", label: t("categorySC") },
                    { value: "st", label: t("categoryST") },
                  ].map((cat) => (
                    <div key={cat.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={cat.value} id={cat.value} />
                      <Label htmlFor={cat.value} className="cursor-pointer">{cat.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {/* Step 2: Income & Occupation */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="income">{t("income")}</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder={t("incomePlaceholder")}
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>{t("occupation")}</Label>
                <Select
                  value={formData.occupation}
                  onValueChange={(value) => setFormData({ ...formData, occupation: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("occupationPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {occupations.map((occ) => (
                      <SelectItem key={occ.value} value={occ.value}>
                        {language === "hi" ? occ.labelHi : occ.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: State */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <Label>{t("state")}</Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("statePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrev} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="gap-2 bg-gradient-accent text-accent-foreground hover:opacity-90"
              >
                {t("next")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid()}
                className="gap-2 bg-gradient-accent text-accent-foreground hover:opacity-90"
              >
                <Search className="h-4 w-4" />
                {t("findSchemes")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
