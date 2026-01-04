import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { MessageCircle, Send, X, Mic, MicOff, Bot, User, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scheme-chat`;

export function Chatbot() {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTranscript = useCallback((transcript: string) => {
    setInput((prev) => prev + (prev ? " " : "") + transcript);
  }, []);

  const handleVoiceError = useCallback((error: string) => {
    toast({
      variant: "destructive",
      title: language === "hi" ? "आवाज़ त्रुटि" : "Voice Error",
      description: error,
    });
  }, [toast, language]);

  const { isListening, isSupported, interimTranscript, startListening, stopListening } = useVoiceInput({
    language,
    onTranscript: handleTranscript,
    onError: handleVoiceError,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = language === "hi" 
        ? "नमस्ते! मैं नविदा हूं। मैं आपको सरकारी योजनाओं के बारे में जानकारी देने में मदद कर सकता हूं। आप मुझसे पूछ सकते हैं जैसे 'क्या मैं किसान योजना के लिए पात्र हूं?' या 'महिलाओं के लिए कौन सी योजनाएं हैं?'"
        : "Hello! I'm Navida. I can help you find government schemes you may be eligible for. Ask me questions like 'Am I eligible for farmer schemes?' or 'What schemes are there for women?'";
      
      setMessages([{ role: "assistant", content: welcomeMessage }]);
    }
  }, [isOpen, language, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      const updateAssistant = (content: string) => {
        assistantContent = content;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content } : m));
          }
          return [...prev, { role: "assistant", content }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              updateAssistant(assistantContent);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" 
          ? "जवाब प्राप्त करने में समस्या। कृपया पुनः प्रयास करें।" 
          : "Failed to get response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[360px] h-[500px] flex flex-col shadow-2xl z-50 border-border/50 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <span className="font-semibold">
            {language === "hi" ? "नविदा सहायक" : "Navida Assistant"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {message.content}
              </div>
              {message.role === "user" && (
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex gap-2 justify-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Voice indicator */}
      {(isListening || interimTranscript) && (
        <div className="px-4 py-2 bg-primary/5 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            {interimTranscript || (language === "hi" ? "सुन रहा हूं..." : "Listening...")}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === "hi" ? "अपना सवाल लिखें..." : "Type your question..."}
            disabled={isLoading}
            className="flex-1"
          />
          {isSupported && (
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              onClick={toggleVoice}
              disabled={isLoading}
              className="flex-shrink-0"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {isSupported && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {language === "hi" 
              ? "🎤 बोलने के लिए माइक बटन दबाएं" 
              : "🎤 Press mic button to speak"}
          </p>
        )}
      </div>
    </Card>
  );
}
