"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function FAQSection() {
  const { language } = useLanguage();

  const content = {
    en: {
      title: "Frequently Asked Questions",
      subtitle: "Got Questions? We've Got Answers",
      faqs: [
        {
          question: "How does Navida work?",
          answer: "Navida uses a rule-based eligibility engine to match your profile with government schemes. Simply answer a few questions about your age, income, occupation, and location, and we'll show you all the schemes you qualify for.",
        },
        {
          question: "Is this service free?",
          answer: "Yes, Navida is completely free to use. Our mission is to make government welfare accessible to all citizens without any cost.",
        },
        {
          question: "How accurate is the eligibility check?",
          answer: "Our eligibility engine uses official government criteria to determine your eligibility. However, we recommend verifying the final eligibility on the official scheme websites before applying.",
        },
        {
          question: "Can I apply for schemes directly through Navida?",
          answer: "Currently, Navida helps you discover eligible schemes and provides direct links to official government portals where you can complete your application.",
        },
        {
          question: "Is my personal information secure?",
          answer: "Yes, we take privacy seriously. Your information is used only to check eligibility and is not stored permanently or shared with third parties.",
        },
        {
          question: "What languages are supported?",
          answer: "Currently, Navida supports English and Hindi. We are working to add more regional languages to serve more citizens.",
        },
      ],
    },
    hi: {
      title: "अक्सर पूछे जाने वाले प्रश्न",
      subtitle: "प्रश्न हैं? हमारे पास जवाब हैं",
      faqs: [
        {
          question: "नविदा कैसे काम करता है?",
          answer: "नविदा आपकी प्रोफाइल को सरकारी योजनाओं से मिलाने के लिए नियम-आधारित पात्रता इंजन का उपयोग करता है। बस अपनी आयु, आय, व्यवसाय और स्थान के बारे में कुछ सवालों का जवाब दें, और हम आपको सभी पात्र योजनाएं दिखाएंगे।",
        },
        {
          question: "क्या यह सेवा मुफ्त है?",
          answer: "हां, नविदा पूरी तरह से मुफ्त है। हमारा मिशन बिना किसी लागत के सभी नागरिकों के लिए सरकारी कल्याण को सुलभ बनाना है।",
        },
        {
          question: "पात्रता जांच कितनी सटीक है?",
          answer: "हमारा पात्रता इंजन आपकी पात्रता निर्धारित करने के लिए आधिकारिक सरकारी मानदंडों का उपयोग करता है। हालांकि, आवेदन करने से पहले आधिकारिक योजना वेबसाइटों पर अंतिम पात्रता सत्यापित करने की सिफारिश की जाती है।",
        },
        {
          question: "क्या मैं नविदा के माध्यम से सीधे योजनाओं के लिए आवेदन कर सकता हूं?",
          answer: "वर्तमान में, नविदा आपको पात्र योजनाओं की खोज में मदद करता है और आधिकारिक सरकारी पोर्टलों के सीधे लिंक प्रदान करता है जहां आप अपना आवेदन पूरा कर सकते हैं।",
        },
        {
          question: "क्या मेरी व्यक्तिगत जानकारी सुरक्षित है?",
          answer: "हां, हम गोपनीयता को गंभीरता से लेते हैं। आपकी जानकारी केवल पात्रता जांचने के लिए उपयोग की जाती है और स्थायी रूप से संग्रहीत या तीसरे पक्षों के साथ साझा नहीं की जाती।",
        },
        {
          question: "कौन सी भाषाएं समर्थित हैं?",
          answer: "वर्तमान में, नविदा अंग्रेजी और हिंदी का समर्थन करता है। हम अधिक नागरिकों की सेवा के लिए अधिक क्षेत्रीय भाषाओं को जोड़ने पर काम कर रहे हैं।",
        },
      ],
    },
  };

  const t = content[language as keyof typeof content] || content.en;

  return (
    <section id="faq" className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-sm font-medium text-primary mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.subtitle}
          </motion.span>
          <motion.h2
            className="text-3xl font-serif font-bold text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t.title}
          </motion.h2>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {t.faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-medium text-card-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
