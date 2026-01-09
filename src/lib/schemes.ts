// Government Schemes Database with Rule-Based Eligibility Engine

export interface Scheme {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  benefits: string[];
  benefitsHi: string[];
  documents: string[];
  documentsHi: string[];
  officialLink: string;
  ministry: string;
  eligibility: {
    minAge?: number;
    maxAge?: number;
    maxIncome?: number;
    states?: string[];
    occupations?: string[];
    gender?: "male" | "female" | "all";
    category?: string[];
  };
}

export interface UserProfile {
  age: number;
  income: number;
  state: string;
  occupation: string;
  gender: string;
  category: string;
}

export const schemes: Scheme[] = [
  {
    id: "pmkisan",
    name: "PM-KISAN Samman Nidhi",
    nameHi: "पीएम-किसान सम्मान निधि",
    description: "Direct income support of ₹6,000 per year to farmer families in three equal installments.",
    descriptionHi: "किसान परिवारों को तीन समान किस्तों में प्रति वर्ष ₹6,000 की प्रत्यक्ष आय सहायता।",
    benefits: ["₹6,000 annually in 3 installments", "Direct bank transfer", "No intermediaries"],
    benefitsHi: ["3 किस्तों में सालाना ₹6,000", "सीधे बैंक हस्तांतरण", "कोई बिचौलिया नहीं"],
    documents: ["Aadhaar Card", "Bank Account Details", "Land Ownership Papers"],
    documentsHi: ["आधार कार्ड", "बैंक खाता विवरण", "भूमि स्वामित्व दस्तावेज"],
    officialLink: "https://pmkisan.gov.in/",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    eligibility: {
      occupations: ["farmer", "agricultural_laborer"],
      maxIncome: 200000,
    },
  },
  {
    id: "pmuy",
    name: "Pradhan Mantri Ujjwala Yojana",
    nameHi: "प्रधानमंत्री उज्ज्वला योजना",
    description: "Free LPG connections to women from Below Poverty Line (BPL) families.",
    descriptionHi: "गरीबी रेखा से नीचे (बीपीएल) परिवारों की महिलाओं को मुफ्त एलपीजी कनेक्शन।",
    benefits: ["Free LPG connection", "First refill free", "Stove subsidy available"],
    benefitsHi: ["मुफ्त एलपीजी कनेक्शन", "पहला रिफिल मुफ्त", "स्टोव सब्सिडी उपलब्ध"],
    documents: ["BPL Card", "Aadhaar Card", "Bank Account", "Passport Photo"],
    documentsHi: ["बीपीएल कार्ड", "आधार कार्ड", "बैंक खाता", "पासपोर्ट फोटो"],
    officialLink: "https://www.pmuy.gov.in/",
    ministry: "Ministry of Petroleum & Natural Gas",
    eligibility: {
      gender: "female",
      maxIncome: 120000,
      minAge: 18,
    },
  },
  {
    id: "pmjay",
    name: "Ayushman Bharat PM-JAY",
    nameHi: "आयुष्मान भारत पीएम-जय",
    description: "Health insurance cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
    descriptionHi: "द्वितीयक और तृतीयक देखभाल अस्पताल में भर्ती के लिए प्रति परिवार प्रति वर्ष ₹5 लाख का स्वास्थ्य बीमा कवर।",
    benefits: ["₹5 lakh health cover", "Cashless treatment", "1,350+ packages covered"],
    benefitsHi: ["₹5 लाख स्वास्थ्य कवर", "कैशलेस उपचार", "1,350+ पैकेज कवर"],
    documents: ["Ration Card", "Aadhaar Card", "Income Certificate"],
    documentsHi: ["राशन कार्ड", "आधार कार्ड", "आय प्रमाण पत्र"],
    officialLink: "https://pmjay.gov.in/",
    ministry: "Ministry of Health & Family Welfare",
    eligibility: {
      maxIncome: 250000,
    },
  },
  {
    id: "pmay",
    name: "Pradhan Mantri Awas Yojana",
    nameHi: "प्रधानमंत्री आवास योजना",
    description: "Affordable housing for economically weaker sections with interest subsidy on home loans.",
    descriptionHi: "आर्थिक रूप से कमजोर वर्गों के लिए होम लोन पर ब्याज सब्सिडी के साथ किफायती आवास।",
    benefits: ["Subsidy up to ₹2.67 lakh", "20-year loan tenure", "Low interest rates"],
    benefitsHi: ["₹2.67 लाख तक सब्सिडी", "20 साल की ऋण अवधि", "कम ब्याज दरें"],
    documents: ["Income Proof", "Aadhaar Card", "Property Documents", "Bank Statements"],
    documentsHi: ["आय प्रमाण", "आधार कार्ड", "संपत्ति दस्तावेज", "बैंक विवरण"],
    officialLink: "https://pmaymis.gov.in/",
    ministry: "Ministry of Housing & Urban Affairs",
    eligibility: {
      maxIncome: 300000,
      minAge: 21,
      maxAge: 70,
    },
  },
  {
    id: "nsap",
    name: "National Social Assistance Programme",
    nameHi: "राष्ट्रीय सामाजिक सहायता कार्यक्रम",
    description: "Monthly pension for elderly, widows, and disabled persons from BPL families.",
    descriptionHi: "बीपीएल परिवारों के बुजुर्गों, विधवाओं और विकलांग व्यक्तियों के लिए मासिक पेंशन।",
    benefits: ["Monthly pension ₹200-500", "Widow pension", "Disability pension"],
    benefitsHi: ["मासिक पेंशन ₹200-500", "विधवा पेंशन", "विकलांगता पेंशन"],
    documents: ["Age Proof", "BPL Card", "Bank Account", "Disability Certificate (if applicable)"],
    documentsHi: ["आयु प्रमाण", "बीपीएल कार्ड", "बैंक खाता", "विकलांगता प्रमाण पत्र (यदि लागू हो)"],
    officialLink: "https://nsap.nic.in/",
    ministry: "Ministry of Rural Development",
    eligibility: {
      minAge: 60,
      maxIncome: 100000,
    },
  },
  {
    id: "pmsym",
    name: "PM Shram Yogi Maan-dhan",
    nameHi: "पीएम श्रम योगी मान-धन",
    description: "Pension scheme for unorganized workers ensuring ₹3,000 monthly pension after 60 years.",
    descriptionHi: "असंगठित श्रमिकों के लिए पेंशन योजना जो 60 वर्ष के बाद ₹3,000 मासिक पेंशन सुनिश्चित करती है।",
    benefits: ["₹3,000 monthly pension after 60", "Government contribution 50%", "Family pension available"],
    benefitsHi: ["60 के बाद ₹3,000 मासिक पेंशन", "सरकारी योगदान 50%", "पारिवारिक पेंशन उपलब्ध"],
    documents: ["Aadhaar Card", "Bank Account", "Mobile Number"],
    documentsHi: ["आधार कार्ड", "बैंक खाता", "मोबाइल नंबर"],
    officialLink: "https://maandhan.in/",
    ministry: "Ministry of Labour & Employment",
    eligibility: {
      minAge: 18,
      maxAge: 40,
      maxIncome: 180000,
      occupations: ["laborer", "construction_worker", "street_vendor", "domestic_worker", "others"],
    },
  },
  {
    id: "sukanyasamriddhi",
    name: "Sukanya Samriddhi Yojana",
    nameHi: "सुकन्या समृद्धि योजना",
    description: "Savings scheme for girl child with attractive interest rates and tax benefits.",
    descriptionHi: "आकर्षक ब्याज दरों और कर लाभ के साथ बालिका के लिए बचत योजना।",
    benefits: ["8.2% interest rate", "Tax benefits under 80C", "Partial withdrawal for education"],
    benefitsHi: ["8.2% ब्याज दर", "80C के तहत कर लाभ", "शिक्षा के लिए आंशिक निकासी"],
    documents: ["Birth Certificate of Girl", "Parent's ID Proof", "Address Proof"],
    documentsHi: ["बालिका का जन्म प्रमाण पत्र", "माता-पिता का पहचान प्रमाण", "पता प्रमाण"],
    officialLink: "https://www.nsiindia.gov.in/",
    ministry: "Ministry of Finance",
    eligibility: {
      maxAge: 10,
      gender: "female",
    },
  },
  {
    id: "mudra",
    name: "Pradhan Mantri MUDRA Yojana",
    nameHi: "प्रधानमंत्री मुद्रा योजना",
    description: "Loans up to ₹10 lakh for non-corporate small business sector enterprises.",
    descriptionHi: "गैर-कॉर्पोरेट लघु व्यवसाय क्षेत्र के उद्यमों के लिए ₹10 लाख तक का ऋण।",
    benefits: ["Loans without collateral", "Low interest rates", "Three categories: Shishu, Kishore, Tarun"],
    benefitsHi: ["बिना संपार्श्विक के ऋण", "कम ब्याज दरें", "तीन श्रेणियां: शिशु, किशोर, तरुण"],
    documents: ["Business Plan", "Identity Proof", "Address Proof", "Quotation of machinery"],
    documentsHi: ["व्यापार योजना", "पहचान प्रमाण", "पता प्रमाण", "मशीनरी का कोटेशन"],
    officialLink: "https://www.mudra.org.in/",
    ministry: "Ministry of Finance",
    eligibility: {
      minAge: 18,
      occupations: ["self_employed", "small_business", "artisan", "others"],
    },
  },
  // Additional schemes from CSV data
  {
    id: "janaushadhi",
    name: "PM Bhartiya Jan Aushadhi Pariyojana",
    nameHi: "पीएम भारतीय जन औषधि परियोजना",
    description: "Provides affordable quality medicines through Jan Aushadhi Kendras across India.",
    descriptionHi: "पूरे भारत में जन औषधि केंद्रों के माध्यम से किफायती गुणवत्ता वाली दवाइयां प्रदान करता है।",
    benefits: ["Medicines at 50-90% lower cost", "Quality assured generics", "Wide network of stores"],
    benefitsHi: ["50-90% कम कीमत पर दवाइयां", "गुणवत्ता सुनिश्चित जेनेरिक", "दुकानों का व्यापक नेटवर्क"],
    documents: ["Any valid ID", "Prescription from doctor"],
    documentsHi: ["कोई भी वैध पहचान पत्र", "डॉक्टर का प्रिस्क्रिप्शन"],
    officialLink: "https://janaushadhi.gov.in/",
    ministry: "Ministry of Chemicals & Fertilizers",
    eligibility: {},
  },
  {
    id: "mgnrega",
    name: "MGNREGA",
    nameHi: "मनरेगा",
    description: "Guarantees 100 days of wage employment per year to rural households willing to do unskilled manual work.",
    descriptionHi: "ग्रामीण परिवारों को प्रति वर्ष 100 दिनों के वेतन रोजगार की गारंटी जो अकुशल शारीरिक काम करने के इच्छुक हैं।",
    benefits: ["100 days guaranteed work", "Minimum wages assured", "Employment near residence"],
    benefitsHi: ["100 दिन की गारंटीकृत नौकरी", "न्यूनतम मजदूरी सुनिश्चित", "निवास के पास रोजगार"],
    documents: ["Job Card", "Aadhaar Card", "Bank Account"],
    documentsHi: ["जॉब कार्ड", "आधार कार्ड", "बैंक खाता"],
    officialLink: "https://nrega.nic.in/",
    ministry: "Ministry of Rural Development",
    eligibility: {
      minAge: 18,
      occupations: ["laborer", "agricultural_laborer", "unemployed", "others"],
    },
  },
  {
    id: "daynrlm",
    name: "Deendayal Antyodaya Yojana - NRLM",
    nameHi: "दीनदयाल अंत्योदय योजना - एनआरएलएम",
    description: "Empowers rural poor women through Self Help Groups for sustainable livelihoods.",
    descriptionHi: "स्थायी आजीविका के लिए स्वयं सहायता समूहों के माध्यम से ग्रामीण गरीब महिलाओं को सशक्त बनाता है।",
    benefits: ["SHG formation support", "Bank linkage", "Skill development training"],
    benefitsHi: ["एसएचजी गठन सहायता", "बैंक संपर्क", "कौशल विकास प्रशिक्षण"],
    documents: ["Aadhaar Card", "BPL Card", "Bank Account"],
    documentsHi: ["आधार कार्ड", "बीपीएल कार्ड", "बैंक खाता"],
    officialLink: "https://aajeevika.gov.in/",
    ministry: "Ministry of Rural Development",
    eligibility: {
      gender: "female",
      maxIncome: 150000,
      minAge: 18,
    },
  },
  {
    id: "swayam",
    name: "SWAYAM - Free Online Education",
    nameHi: "स्वयं - मुफ्त ऑनलाइन शिक्षा",
    description: "Free online courses from Class 9 to Post Graduation offered by top institutions.",
    descriptionHi: "शीर्ष संस्थानों द्वारा कक्षा 9 से स्नातकोत्तर तक मुफ्त ऑनलाइन पाठ्यक्रम।",
    benefits: ["Free quality education", "Certificates from IITs/IIMs", "Flexible learning"],
    benefitsHi: ["मुफ्त गुणवत्तापूर्ण शिक्षा", "आईआईटी/आईआईएम से प्रमाण पत्र", "लचीला सीखना"],
    documents: ["Valid Email ID", "Mobile Number"],
    documentsHi: ["वैध ईमेल आईडी", "मोबाइल नंबर"],
    officialLink: "https://swayam.gov.in/",
    ministry: "Ministry of Education",
    eligibility: {
      minAge: 14,
    },
  },
  {
    id: "digilocker",
    name: "DigiLocker",
    nameHi: "डिजीलॉकर",
    description: "Cloud-based platform for issuance, verification and storage of authentic documents digitally.",
    descriptionHi: "प्रामाणिक दस्तावेजों के डिजिटल जारी करने, सत्यापन और भंडारण के लिए क्लाउड-आधारित प्लेटफॉर्म।",
    benefits: ["Paperless governance", "Authentic document storage", "Easy document sharing"],
    benefitsHi: ["कागज रहित शासन", "प्रामाणिक दस्तावेज भंडारण", "आसान दस्तावेज साझाकरण"],
    documents: ["Aadhaar Card", "Mobile Number"],
    documentsHi: ["आधार कार्ड", "मोबाइल नंबर"],
    officialLink: "https://www.digilocker.gov.in/",
    ministry: "Ministry of Electronics & IT",
    eligibility: {},
  },
  {
    id: "umang",
    name: "UMANG - Unified Mobile App",
    nameHi: "उमंग - एकीकृत मोबाइल ऐप",
    description: "One app to access multiple government services including PF, pension, scholarships and more.",
    descriptionHi: "पीएफ, पेंशन, छात्रवृत्ति और अन्य सहित कई सरकारी सेवाओं तक पहुंच के लिए एक ऐप।",
    benefits: ["Access 1,600+ services", "Single sign-on", "Available in 13 languages"],
    benefitsHi: ["1,600+ सेवाओं तक पहुंच", "सिंगल साइन-ऑन", "13 भाषाओं में उपलब्ध"],
    documents: ["Aadhaar/Mobile for registration"],
    documentsHi: ["पंजीकरण के लिए आधार/मोबाइल"],
    officialLink: "https://www.umang.gov.in/",
    ministry: "Ministry of Electronics & IT",
    eligibility: {},
  },
  {
    id: "udyam",
    name: "Udyam Registration for MSMEs",
    nameHi: "एमएसएमई के लिए उद्यम पंजीकरण",
    description: "Free, paperless online registration for Micro, Small and Medium Enterprises.",
    descriptionHi: "सूक्ष्म, लघु और मध्यम उद्यमों के लिए मुफ्त, कागज रहित ऑनलाइन पंजीकरण।",
    benefits: ["Zero cost registration", "Access to government schemes", "Priority in procurement"],
    benefitsHi: ["शून्य लागत पंजीकरण", "सरकारी योजनाओं तक पहुंच", "खरीद में प्राथमिकता"],
    documents: ["Aadhaar Card", "PAN Card", "Business details"],
    documentsHi: ["आधार कार्ड", "पैन कार्ड", "व्यापार विवरण"],
    officialLink: "https://www.udyamregistration.gov.in/",
    ministry: "Ministry of MSME",
    eligibility: {
      minAge: 18,
      occupations: ["self_employed", "small_business", "artisan", "others"],
    },
  },
  {
    id: "orunodoi",
    name: "Orunodoi 3.0 (Assam)",
    nameHi: "ओरुणोदोई 3.0 (असम)",
    description: "Monthly financial assistance of ₹1,250 to women-headed families in Assam.",
    descriptionHi: "असम में महिला प्रधान परिवारों को ₹1,250 की मासिक वित्तीय सहायता।",
    benefits: ["₹1,250 monthly assistance", "Direct bank transfer", "Women empowerment"],
    benefitsHi: ["₹1,250 मासिक सहायता", "सीधे बैंक हस्तांतरण", "महिला सशक्तिकरण"],
    documents: ["Aadhaar Card", "Bank Account", "Residence Proof"],
    documentsHi: ["आधार कार्ड", "बैंक खाता", "निवास प्रमाण"],
    officialLink: "https://finance.assam.gov.in/portlets/orunodoi-30",
    ministry: "Government of Assam",
    eligibility: {
      gender: "female",
      maxIncome: 200000,
      minAge: 18,
      states: ["Assam"],
    },
  },
  {
    id: "scsthub",
    name: "National SC-ST Hub",
    nameHi: "राष्ट्रीय एससी-एसटी हब",
    description: "Support for SC/ST entrepreneurs in public procurement and business development.",
    descriptionHi: "सार्वजनिक खरीद और व्यापार विकास में एससी/एसटी उद्यमियों को सहायता।",
    benefits: ["Business support", "Skill development", "Access to government tenders"],
    benefitsHi: ["व्यापार सहायता", "कौशल विकास", "सरकारी निविदाओं तक पहुंच"],
    documents: ["Caste Certificate", "Aadhaar Card", "Business Registration"],
    documentsHi: ["जाति प्रमाण पत्र", "आधार कार्ड", "व्यापार पंजीकरण"],
    officialLink: "https://scsthub.in/",
    ministry: "Ministry of MSME",
    eligibility: {
      category: ["sc", "st"],
      minAge: 18,
    },
  },
];

// Rule-based eligibility engine - deterministic, no AI hallucinations
export function checkEligibility(profile: UserProfile): Scheme[] {
  return schemes.filter((scheme) => {
    const e = scheme.eligibility;

    // Age check
    if (e.minAge && profile.age < e.minAge) return false;
    if (e.maxAge && profile.age > e.maxAge) return false;

    // Income check
    if (e.maxIncome && profile.income > e.maxIncome) return false;

    // Gender check
    if (e.gender && e.gender !== "all" && profile.gender !== e.gender) return false;

    // Occupation check
    if (e.occupations && e.occupations.length > 0) {
      if (!e.occupations.includes(profile.occupation) && !e.occupations.includes("others")) {
        return false;
      }
    }

    // State check (if specified)
    if (e.states && e.states.length > 0) {
      if (!e.states.includes(profile.state)) return false;
    }

    return true;
  });
}

export const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Puducherry"
];

export const occupations = [
  { value: "farmer", label: "Farmer", labelHi: "किसान" },
  { value: "agricultural_laborer", label: "Agricultural Laborer", labelHi: "कृषि मजदूर" },
  { value: "laborer", label: "Daily Wage Laborer", labelHi: "दैनिक मजदूर" },
  { value: "construction_worker", label: "Construction Worker", labelHi: "निर्माण मजदूर" },
  { value: "street_vendor", label: "Street Vendor", labelHi: "स्ट्रीट वेंडर" },
  { value: "domestic_worker", label: "Domestic Worker", labelHi: "घरेलू कामगार" },
  { value: "self_employed", label: "Self Employed", labelHi: "स्वरोजगार" },
  { value: "small_business", label: "Small Business Owner", labelHi: "छोटे व्यापारी" },
  { value: "artisan", label: "Artisan/Craftsman", labelHi: "कारीगर" },
  { value: "student", label: "Student", labelHi: "छात्र" },
  { value: "homemaker", label: "Homemaker", labelHi: "गृहिणी" },
  { value: "retired", label: "Retired", labelHi: "सेवानिवृत्त" },
  { value: "unemployed", label: "Unemployed", labelHi: "बेरोजगार" },
  { value: "others", label: "Others", labelHi: "अन्य" },
];
