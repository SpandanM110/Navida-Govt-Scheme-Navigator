"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Layout } from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

const faqs = [
  {
    question: "What is Navida?",
    questionHi: "नविदा क्या है?",
    answer: "Navida is an AI-powered platform that helps Indian citizens discover and apply for government welfare schemes they're eligible for. We simplify the complex eligibility criteria and provide personalized recommendations.",
    answerHi: "नविदा एक AI-संचालित प्लेटफॉर्म है जो भारतीय नागरिकों को उन सरकारी कल्याण योजनाओं की खोज करने और आवेदन करने में मदद करता है जिनके लिए वे पात्र हैं।",
  },
  {
    question: "How does the eligibility checker work?",
    questionHi: "पात्रता जांचकर्ता कैसे काम करता है?",
    answer: "Our eligibility checker uses AI-powered web search (Exa) and Llama-4-scout-17b-16e-instruct to analyze your profile (age, income, occupation, state, etc.) and matches it against government scheme criteria to find the ones you qualify for.",
    answerHi: "हमारा पात्रता जांचकर्ता AI-संचालित वेब खोज और Llama-4-scout-17b-16e-instruct का उपयोग करके आपकी प्रोफ़ाइल का विश्लेषण करता है और सरकारी योजना मानदंडों से मिलाता है।",
  },
  {
    question: "Is my personal information safe?",
    questionHi: "क्या मेरी व्यक्तिगत जानकारी सुरक्षित है?",
    answer: "Yes, we take data security very seriously. All your information is encrypted and we never share your data with third parties. We comply with all Indian data protection regulations.",
    answerHi: "हां, हम डेटा सुरक्षा को बहुत गंभीरता से लेते हैं। आपकी सभी जानकारी एन्क्रिप्टेड है और हम कभी भी आपका डेटा तीसरे पक्ष के साथ साझा नहीं करते हैं।",
  },
  {
    question: "Which government schemes are covered?",
    questionHi: "कौन सी सरकारी योजनाएं शामिल हैं?",
    answer: "We cover schemes from all major ministries including Agriculture, Health, Education, Housing, Employment, Women & Child Development, Social Justice, and more. Both Central and State government schemes are included.",
    answerHi: "हम कृषि, स्वास्थ्य, शिक्षा, आवास, रोजगार, महिला एवं बाल विकास, सामाजिक न्याय सहित सभी प्रमुख मंत्रालयों की योजनाओं को कवर करते हैं।",
  },
  {
    question: "Can I apply for schemes directly through Navida?",
    questionHi: "क्या मैं नविदा के माध्यम से सीधे योजनाओं के लिए आवेदन कर सकता हूं?",
    answer: "We provide direct links to official government portals where you can apply for schemes. We also guide you through the required documents and application process.",
    answerHi: "हम आधिकारिक सरकारी पोर्टलों के सीधे लिंक प्रदान करते हैं जहां आप योजनाओं के लिए आवेदन कर सकते हैं।",
  },
  {
    question: "Is the service free to use?",
    questionHi: "क्या यह सेवा मुफ्त है?",
    answer: "Yes, Navida is completely free to use. Our mission is to make government welfare schemes accessible to all citizens regardless of their background.",
    answerHi: "हां, नविदा का उपयोग पूरी तरह से मुफ्त है।",
  },
  {
    question: "What languages are supported?",
    questionHi: "कौन सी भाषाएं समर्थित हैं?",
    answer: "Navida supports 6 languages: English, Hindi, Bengali, Tamil, Telugu, and Marathi.",
    answerHi: "नविदा 6 भाषाओं का समर्थन करता है: अंग्रेजी, हिंदी, बंगाली, तमिल, तेलुगु और मराठी।",
  },
  {
    question: "How do I use the voice assistant?",
    questionHi: "मैं वॉयस असिस्टेंट का उपयोग कैसे करूं?",
    answer: "Click on the chat bubble in the bottom right corner, then click the microphone icon to speak your question. Our AI supports 6 languages: English, Hindi, Bengali, Tamil, Telugu, and Marathi.",
    answerHi: "नीचे दाएं कोने में चैट बबल पर क्लिक करें, फिर अपना प्रश्न बोलने के लिए माइक्रोफोन आइकन पर क्लिक करें। AI 6 भाषाओं का समर्थन करता है।",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function FAQPage() {
  const { language } = useLanguage();

  return (
    <Layout>
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <HelpCircle className="h-4 w-4" />
              {language === "hi" ? "सहायता केंद्र" : "Help Center"}
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              {language === "hi" ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === "hi"
                ? "नविदा के बारे में सामान्य प्रश्नों के उत्तर खोजें"
                : "Find answers to common questions about Navida and government schemes"}
            </p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <AccordionItem
                    value={`item-${index}`}
                    className="bg-card border border-border rounded-xl px-6 overflow-hidden"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      <span className="text-foreground font-medium">
                        {language === "hi" ? faq.questionHi : faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {language === "hi" ? faq.answerHi : faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground mb-6">
              {language === "hi"
                ? "अभी भी प्रश्न हैं? हमारे AI असिस्टेंट से बात करें"
                : "Still have questions? Chat with our AI assistant"}
            </p>
            <ShimmerButton className="gap-2">
              <MessageCircle className="h-5 w-5" />
              {language === "hi" ? "चैट शुरू करें" : "Start Chat"}
            </ShimmerButton>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
