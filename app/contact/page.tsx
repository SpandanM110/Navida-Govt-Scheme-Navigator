"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Layout } from "@/components/Layout";
import { SpotlightCard } from "@/components/ui/spotlight";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "support@navida.gov.in",
    description: "We respond within 24 hours",
  },
  {
    icon: Phone,
    title: "Toll Free",
    value: "1800-XXX-XXXX",
    description: "Available 9 AM - 6 PM IST",
  },
  {
    icon: MapPin,
    title: "Address",
    value: "New Delhi, India",
    description: "Ministry of Electronics & IT",
  },
  {
    icon: Clock,
    title: "Working Hours",
    value: "Mon - Sat",
    description: "9:00 AM - 6:00 PM IST",
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

export default function ContactPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: language === "hi" ? "संदेश भेजा गया!" : "Message Sent!",
      description: language === "hi"
        ? "हम जल्द ही आपसे संपर्क करेंगे।"
        : "We'll get back to you soon.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <MessageSquare className="h-4 w-4" />
              {language === "hi" ? "संपर्क करें" : "Get in Touch"}
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              {language === "hi" ? "हमसे संपर्क करें" : "Contact Us"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {language === "hi"
                ? "कोई प्रश्न है? हम मदद के लिए यहां हैं"
                : "Have a question? We're here to help"}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SpotlightCard className="p-8">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                  {language === "hi" ? "हमें संदेश भेजें" : "Send us a Message"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {language === "hi" ? "नाम" : "Name"}
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === "hi" ? "आपका नाम" : "Your name"}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {language === "hi" ? "ईमेल" : "Email"}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={language === "hi" ? "आपका ईमेल" : "Your email"}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {language === "hi" ? "विषय" : "Subject"}
                    </Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={language === "hi" ? "विषय" : "Subject"}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {language === "hi" ? "संदेश" : "Message"}
                    </Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === "hi" ? "आपका संदेश..." : "Your message..."}
                      rows={5}
                      required
                    />
                  </div>
                  <ShimmerButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <motion.div
                        className="h-5 w-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        {language === "hi" ? "भेजें" : "Send Message"}
                      </>
                    )}
                  </ShimmerButton>
                </form>
              </SpotlightCard>
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {contactInfo.map((info) => (
                <motion.div key={info.title} variants={itemVariants}>
                  <SpotlightCard className="p-6">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <info.icon className="h-6 w-6 text-accent" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                        <p className="text-foreground">{info.value}</p>
                        <p className="text-sm text-muted-foreground">{info.description}</p>
                      </div>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}

              <motion.div variants={itemVariants}>
                <SpotlightCard className="p-6 h-48 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-10 w-10 mx-auto mb-3 text-accent" />
                    <p>{language === "hi" ? "नक्शा जल्द आ रहा है" : "Map coming soon"}</p>
                  </div>
                </SpotlightCard>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
