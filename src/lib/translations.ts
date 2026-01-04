export type Language = "en" | "hi";

export const translations = {
  en: {
    // Navigation & Brand
    brand: "Navida",
    tagline: "Your Guide to Government Welfare",
    
    // Hero Section
    heroTitle: "Discover Government Schemes",
    heroTitleAccent: "You Deserve",
    heroDescription: "Navida helps you find and apply for government welfare programs based on your profile. Simple questions, clear guidance, in your language.",
    startNow: "Check My Eligibility",
    learnMore: "Learn More",
    
    // Features
    featuresTitle: "How Navida Helps You",
    feature1Title: "Smart Matching",
    feature1Desc: "Answer simple questions and get matched with schemes you qualify for.",
    feature2Title: "Complete Guidance",
    feature2Desc: "Get documents list, application steps, and official links.",
    feature3Title: "Your Language",
    feature3Desc: "Access information in Hindi, English, and more regional languages.",
    feature4Title: "Always Updated",
    feature4Desc: "Latest schemes and eligibility criteria from official sources.",
    
    // Eligibility Form
    eligibilityTitle: "Tell Us About Yourself",
    eligibilitySubtitle: "Answer a few simple questions to find schemes for you",
    age: "Your Age",
    agePlaceholder: "Enter your age",
    income: "Annual Family Income (₹)",
    incomePlaceholder: "Enter annual income",
    state: "State",
    statePlaceholder: "Select your state",
    occupation: "Occupation",
    occupationPlaceholder: "Select your occupation",
    gender: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    category: "Category",
    categoryGeneral: "General",
    categoryOBC: "OBC",
    categorySC: "SC",
    categoryST: "ST",
    findSchemes: "Find My Schemes",
    back: "Back",
    next: "Next",
    
    // Results
    resultsTitle: "Schemes You Qualify For",
    noResults: "No schemes found matching your profile. Try adjusting your details.",
    documentsNeeded: "Documents Needed",
    benefits: "Benefits",
    applyNow: "Apply Now",
    viewDetails: "View Details",
    startOver: "Start Over",
    schemesFound: "schemes found for you",
    
    // Footer
    footerText: "Making government services accessible to all citizens",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    contact: "Contact Us",
  },
  hi: {
    // Navigation & Brand
    brand: "नविदा",
    tagline: "सरकारी कल्याण के लिए आपका मार्गदर्शक",
    
    // Hero Section
    heroTitle: "सरकारी योजनाएं खोजें",
    heroTitleAccent: "जो आपके हक की हैं",
    heroDescription: "नविदा आपकी प्रोफाइल के आधार पर सरकारी कल्याण योजनाओं को खोजने और आवेदन करने में मदद करता है। सरल प्रश्न, स्पष्ट मार्गदर्शन, आपकी भाषा में।",
    startNow: "मेरी पात्रता जांचें",
    learnMore: "और जानें",
    
    // Features
    featuresTitle: "नविदा कैसे मदद करता है",
    feature1Title: "स्मार्ट मिलान",
    feature1Desc: "सरल प्रश्नों का उत्तर दें और पात्र योजनाओं से जुड़ें।",
    feature2Title: "पूर्ण मार्गदर्शन",
    feature2Desc: "दस्तावेजों की सूची, आवेदन चरण और आधिकारिक लिंक प्राप्त करें।",
    feature3Title: "आपकी भाषा",
    feature3Desc: "हिंदी, अंग्रेजी और अन्य क्षेत्रीय भाषाओं में जानकारी प्राप्त करें।",
    feature4Title: "हमेशा अपडेटेड",
    feature4Desc: "आधिकारिक स्रोतों से नवीनतम योजनाएं और पात्रता मानदंड।",
    
    // Eligibility Form
    eligibilityTitle: "अपने बारे में बताएं",
    eligibilitySubtitle: "अपने लिए योजनाएं खोजने के लिए कुछ सरल प्रश्नों का उत्तर दें",
    age: "आपकी आयु",
    agePlaceholder: "अपनी आयु दर्ज करें",
    income: "वार्षिक पारिवारिक आय (₹)",
    incomePlaceholder: "वार्षिक आय दर्ज करें",
    state: "राज्य",
    statePlaceholder: "अपना राज्य चुनें",
    occupation: "व्यवसाय",
    occupationPlaceholder: "अपना व्यवसाय चुनें",
    gender: "लिंग",
    genderMale: "पुरुष",
    genderFemale: "महिला",
    genderOther: "अन्य",
    category: "श्रेणी",
    categoryGeneral: "सामान्य",
    categoryOBC: "ओबीसी",
    categorySC: "एससी",
    categoryST: "एसटी",
    findSchemes: "मेरी योजनाएं खोजें",
    back: "वापस",
    next: "आगे",
    
    // Results
    resultsTitle: "आपके लिए पात्र योजनाएं",
    noResults: "आपकी प्रोफाइल से मेल खाने वाली कोई योजना नहीं मिली। अपने विवरण समायोजित करें।",
    documentsNeeded: "आवश्यक दस्तावेज",
    benefits: "लाभ",
    applyNow: "अभी आवेदन करें",
    viewDetails: "विवरण देखें",
    startOver: "फिर से शुरू करें",
    schemesFound: "योजनाएं आपके लिए मिलीं",
    
    // Footer
    footerText: "सभी नागरिकों के लिए सरकारी सेवाओं को सुलभ बनाना",
    privacy: "गोपनीयता नीति",
    terms: "सेवा की शर्तें",
    contact: "संपर्क करें",
  },
};

export function t(key: keyof typeof translations.en, lang: Language): string {
  return translations[lang][key] || translations.en[key] || key;
}
