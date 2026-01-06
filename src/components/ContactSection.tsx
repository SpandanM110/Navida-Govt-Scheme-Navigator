"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function ContactSection() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    en: {
      title: "Contact Us",
      subtitle: "Get In Touch",
      description: "Have questions or feedback? We'd love to hear from you. Reach out through any of the channels below.",
      form: {
        name: "Your Name",
        email: "Email Address",
        message: "Your Message",
        submit: "Send Message",
        sending: "Sending...",
      },
      contact: {
        email: "support@navida.gov.in",
        phone: "1800-XXX-XXXX (Toll Free)",
        address: "Ministry of Electronics & IT, New Delhi",
      },
      success: "Message sent successfully! We'll get back to you soon.",
    },
    hi: {
      title: "संपर्क करें",
      subtitle: "संपर्क में रहें",
      description: "प्रश्न या प्रतिक्रिया है? हम आपसे सुनना चाहेंगे। नीचे दिए गए किसी भी माध्यम से संपर्क करें।",
      form: {
        name: "आपका नाम",
        email: "ईमेल पता",
        message: "आपका संदेश",
        submit: "संदेश भेजें",
        sending: "भेज रहे हैं...",
      },
      contact: {
        email: "support@navida.gov.in",
        phone: "1800-XXX-XXXX (टोल फ्री)",
        address: "इलेक्ट्रॉनिक्स और आईटी मंत्रालय, नई दिल्ली",
      },
      success: "संदेश सफलतापूर्वक भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।",
    },
  };

  const t = content[language];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: language === "hi" ? "सफलता!" : "Success!",
      description: t.success,
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
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
          <motion.p
            className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {t.description}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Info */}
          <motion.div className="space-y-6" variants={itemVariants}>
            <SpotlightCard>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-1">Email</h3>
                  <p className="text-muted-foreground">{t.contact.email}</p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-1">
                    {language === "hi" ? "फ़ोन" : "Phone"}
                  </h3>
                  <p className="text-muted-foreground">{t.contact.phone}</p>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground mb-1">
                    {language === "hi" ? "पता" : "Address"}
                  </h3>
                  <p className="text-muted-foreground">{t.contact.address}</p>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants}>
            <SpotlightCard>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    {t.form.name}
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder={t.form.name}
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    {t.form.email}
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder={t.form.email}
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground mb-2">
                    {t.form.message}
                  </label>
                  <Textarea
                    required
                    rows={4}
                    placeholder={t.form.message}
                    className="bg-background resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t.form.sending : t.form.submit}
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </SpotlightCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
