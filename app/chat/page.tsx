"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  MessageCircle,
  Plus,
  History,
  ChevronRight,
  ChevronDown,
  LogOut,
  FileDown,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { exportReportAsPdf } from "@/lib/export-report-pdf";

const CHAT_CONTEXT_KEY = "navida_chat_context";
const CHAT_MESSAGES_KEY = "navida_chat_messages";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatContext {
  guidance: string;
  profile?: Record<string, unknown>;
  urls?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  scheme_context?: string | null;
  created_at: string;
  updated_at: string;
}

function formatSessionDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

export default function ChatPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [schemeContext, setSchemeContext] = useState<string | null>(null);
  const [hasContext, setHasContext] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Supabase session state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsOpen, setSessionsOpen] = useState(false);
  const [supabaseAvailable, setSupabaseAvailable] = useState<boolean | null>(null);

  // End chat confirmation & PDF export context (from eligibility flow)
  const [endChatOpen, setEndChatOpen] = useState(false);
  const [exportContext, setExportContext] = useState<{
    guidance?: string;
    profile?: Record<string, unknown>;
    urls?: string[];
  } | null>(null);

  const handleTranscript = useCallback((transcript: string) => {
    setInput((prev) => prev + (prev ? " " : "") + transcript);
  }, []);

  const handleVoiceError = useCallback(
    (error: string) => {
      toast({
        variant: "destructive",
        title: language === "hi" ? "आवाज़ त्रुटि" : "Voice Error",
        description: error,
      });
    },
    [toast, language]
  );

  const { isListening, isSupported, interimTranscript, startListening, stopListening } =
    useVoiceInput({
      language,
      onTranscript: handleTranscript,
      onError: handleVoiceError,
    });

  // Fetch sessions from API (user is always signed in on /chat)
  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/chat-sessions");
      if (res.status === 503) {
        setSupabaseAvailable(false);
        return;
      }
      if (!res.ok) return;
      setSupabaseAvailable(true);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      setSupabaseAvailable(false);
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Create a new session and optionally save initial messages
  const createSession = useCallback(
    async (title: string, schemeCtx?: string | null): Promise<string | null> => {
      try {
        const res = await fetch("/api/chat-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, scheme_context: schemeCtx || undefined }),
        });
        if (res.status === 503) return null;
        if (!res.ok) return null;
        const data = await res.json();
        const id = data.session?.id;
        if (id) {
          setSessions((prev) => [
            { id, title, scheme_context: schemeCtx, created_at: data.session.created_at, updated_at: data.session.created_at },
            ...prev,
          ]);
          return id;
        }
        return null;
      } catch {
        return null;
      }
    },
    []
  );

  // Save a message to the current session
  const saveMessageToSession = useCallback(
    async (sessionId: string, role: "user" | "assistant", content: string) => {
      try {
        const res = await fetch(`/api/chat-sessions/${sessionId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role, content }),
        });
        if (res.status === 503 || !res.ok) return;
      } catch {
        // Ignore - sessionStorage fallback
      }
    },
    []
  );

  // Load a session's messages
  const loadSession = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat-sessions/${sessionId}`);
      if (!res.ok) return;
      const data = await res.json();
      const msgs = (data.messages || []).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      setMessages(msgs);
      setCurrentSessionId(sessionId);
      setSchemeContext(data.session?.scheme_context || null);
      setHasContext(!!data.session?.scheme_context);
      setSessionsOpen(false);
    } catch {
      toast({
        variant: "destructive",
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "सत्र लोड नहीं हो सका" : "Could not load session",
      });
    }
  }, [language, toast]);

  // Start a new chat
  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentSessionId(null);
    setSchemeContext(null);
    setHasContext(false);
    setExportContext(null);
    const welcome =
      language === "hi"
        ? "नमस्ते! मैं नविदा हूं। मैं आपको सरकारी योजनाओं के बारे में जानकारी देने में मदद कर सकता हूं। आप मुझसे पूछ सकते हैं जैसे 'क्या मैं किसान योजना के लिए पात्र हूं?'"
        : "Hello! I'm Navida. I can help you with government schemes. Ask me questions like 'Am I eligible for farmer schemes?' or 'What documents do I need?'";
    setMessages([{ role: "assistant", content: welcome }]);
    setSessionsOpen(false);
  }, [language]);

  // End chat with optional PDF export
  const handleEndChat = useCallback(
    (exportPdf: boolean) => {
      if (exportPdf && messages.length > 0) {
        try {
          exportReportAsPdf({
            schemeContext: exportContext?.guidance || schemeContext,
            messages,
            profile: exportContext?.profile,
            urls: exportContext?.urls,
            language,
          });
          toast({
            title: language === "hi" ? "रिपोर्ट तैयार" : "Report ready",
            description:
              language === "hi"
                ? "प्रिंट विंडो में 'Save as PDF' चुनें"
                : "Choose 'Save as PDF' in the print window",
          });
        } catch (e) {
          toast({
            variant: "destructive",
            title: language === "hi" ? "त्रुटि" : "Error",
            description:
              e instanceof Error ? e.message : (language === "hi" ? "PDF निर्यात विफल" : "PDF export failed"),
          });
        }
      }
      setEndChatOpen(false);
      startNewChat();
    },
    [messages, exportContext, schemeContext, language, toast, startNewChat]
  );

  // Restore scheme context and/or persisted messages on mount
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || isInitialized) return;
    try {
      // 1. Fresh "Chat to clear doubts" redirect - always start fresh with scheme context
      const raw = sessionStorage.getItem(CHAT_CONTEXT_KEY);
      if (raw) {
        sessionStorage.removeItem(CHAT_CONTEXT_KEY);
        const ctx: ChatContext = JSON.parse(raw);
        setExportContext({
          guidance: ctx.guidance,
          profile: ctx.profile,
          urls: ctx.urls,
        });
        const contextText = [
          ctx.guidance,
          ctx.profile
            ? `\nUser profile: Age ${ctx.profile.age}, Income ₹${ctx.profile.income}, State: ${ctx.profile.state}, Occupation: ${ctx.profile.occupation}, Gender: ${ctx.profile.gender}, Category: ${ctx.profile.category}`
            : "",
        ]
          .filter(Boolean)
          .join("\n");
        setSchemeContext(contextText);
        setHasContext(true);
        const welcome =
          language === "hi"
            ? "नमस्ते! मैंने आपकी योजना मार्गदर्शन देख ली है। आप अपने संदेह दूर करने के लिए मुझसे पूछ सकते हैं। जैसे 'इस योजना के लिए कौन से दस्तावेज़ चाहिए?' या 'आवेदन कैसे करें?'"
            : "Hello! I've seen your scheme guidance. You can ask me to clear your doubts. For example: 'What documents do I need for this scheme?' or 'How do I apply?'";
        setMessages([{ role: "assistant", content: welcome }]);
        setIsInitialized(true);
        return;
      }

      // 2. Restore persisted chat from sessionStorage (fallback when Supabase not configured)
      const storedMessages = sessionStorage.getItem(CHAT_MESSAGES_KEY);
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages) as Message[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          setIsInitialized(true);
          return;
        }
      }

      // 3. Generic welcome (first visit, no scheme context)
      const welcome =
        language === "hi"
          ? "नमस्ते! मैं नविदा हूं। मैं आपको सरकारी योजनाओं के बारे में जानकारी देने में मदद कर सकता हूं। आप मुझसे पूछ सकते हैं जैसे 'क्या मैं किसान योजना के लिए पात्र हूं?'"
          : "Hello! I'm Navida. I can help you with government schemes. Ask me questions like 'Am I eligible for farmer schemes?' or 'What documents do I need?'";
      setMessages([{ role: "assistant", content: welcome }]);
    } catch {
      setHasContext(false);
    } finally {
      setIsInitialized(true);
    }
  }, [language, isInitialized]);

  // Persist messages to sessionStorage (fallback when Supabase not configured)
  useEffect(() => {
    if (typeof window === "undefined" || messages.length === 0) return;
    try {
      sessionStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";
    let sessionId = currentSessionId;

    try {
      // Create session on first user message if Supabase is available and we don't have one
      if (supabaseAvailable && !sessionId) {
        const title = userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? "…" : "");
        const newId = await createSession(title, schemeContext);
        if (newId) {
          sessionId = newId;
          setCurrentSessionId(newId);
        }
      }

      // Save user message to Supabase session
      if (sessionId) {
        saveMessageToSession(sessionId, "user", userMessage.content);
      }

      const response = await fetch("/api/scheme-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language,
          schemeContext: schemeContext || undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error("Sign in required to chat. Please sign in and try again.");
        }
        if (response.status === 429) {
          throw new Error(err.error || "Rate limit exceeded. Try again in 24 hours.");
        }
        throw new Error(err.error || "Failed to get response");
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      const updateAssistant = (content: string) => {
        assistantContent = content;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content } : m
            );
          }
          return [...prev, { role: "assistant", content }];
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, idx);
          textBuffer = textBuffer.slice(idx + 1);
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

      // Save assistant message to Supabase session after streaming completes
      if (sessionId && assistantContent) {
        saveMessageToSession(sessionId, "assistant", assistantContent);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        variant: "destructive",
        title: language === "hi" ? "त्रुटि" : "Error",
        description:
          language === "hi"
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

  // When landing with scheme context and Supabase is available, create session immediately
  useEffect(() => {
    if (
      !isInitialized ||
      !hasContext ||
      !schemeContext ||
      !supabaseAvailable ||
      currentSessionId
    )
      return;
    const title = language === "hi" ? "योजना मार्गदर्शन" : "Scheme guidance";
    const welcome =
      language === "hi"
        ? "नमस्ते! मैंने आपकी योजना मार्गदर्शन देख ली है। आप अपने संदेह दूर करने के लिए मुझसे पूछ सकते हैं। जैसे 'इस योजना के लिए कौन से दस्तावेज़ चाहिए?' या 'आवेदन कैसे करें?'"
        : "Hello! I've seen your scheme guidance. You can ask me to clear your doubts. For example: 'What documents do I need for this scheme?' or 'How do I apply?'";
    createSession(title, schemeContext).then((id) => {
      if (id) {
        setCurrentSessionId(id);
        saveMessageToSession(id, "assistant", welcome);
      }
    });
  }, [isInitialized, hasContext, schemeContext, supabaseAvailable, currentSessionId, createSession, language, saveMessageToSession]);

  return (
    <Layout>
      <section className="py-8 md:py-12 min-h-[85vh]">
        <div className="container max-w-4xl">
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-2 mb-4">
                    <ArrowLeft className="h-4 w-4" />
                    {language === "hi" ? "वापस जाएं" : "Back"}
                  </Button>
                </Link>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-foreground">
                      {language === "hi" ? "संदेह दूर करें" : "Clear Your Doubts"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      {language === "hi"
                        ? "योजनाओं के बारे में पूछें - Llama 3.3 70B"
                        : "Ask about schemes - Llama 3.3 70B"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sessions sidebar toggle, end chat & new chat */}
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setEndChatOpen(true)}
                  >
                    <LogOut className="h-4 w-4" />
                    {language === "hi" ? "सत्र समाप्त करें" : "End chat"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={startNewChat}
                >
                  <Plus className="h-4 w-4" />
                  {language === "hi" ? "नया चैट" : "New chat"}
                </Button>
                {supabaseAvailable && (
                  <Button
                    variant={sessionsOpen ? "secondary" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setSessionsOpen((o) => !o)}
                  >
                    <History className="h-4 w-4" />
                    {language === "hi" ? "इतिहास" : "History"}
                    {sessionsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Sessions list (collapsible) */}
            <AnimatePresence>
              {supabaseAvailable && sessionsOpen && (
                <motion.aside
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden md:w-[220px] md:shrink-0 order-2 md:order-1"
                >
                  <Card className="p-3 border border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                      {language === "hi" ? "पिछले चैट" : "Previous chats"}
                    </p>
                    {sessionsLoading ? (
                      <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {language === "hi" ? "लोड हो रहा है..." : "Loading..."}
                      </div>
                    ) : sessions.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-2">
                        {language === "hi" ? "अभी तक कोई चैट नहीं" : "No chats yet"}
                      </p>
                    ) : (
                      <div className="space-y-1 max-h-[300px] overflow-y-auto">
                        {sessions.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => loadSession(s.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                              currentSessionId === s.id
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted text-foreground"
                            }`}
                          >
                            <span className="block truncate">{s.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatSessionDate(s.updated_at)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </Card>
                </motion.aside>
              )}
            </AnimatePresence>

            <motion.div
              className="flex-1 min-w-0 order-1 md:order-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="overflow-hidden shadow-elegant border border-border">
                <div className="border-b border-border bg-gradient-hero text-primary-foreground px-4 py-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">
                    {language === "hi" ? "नविदा सहायक" : "Navida Assistant"}
                  </span>
                </div>

                <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-2 ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {msg.role === "assistant" && (
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-foreground"
                          }`}
                        >
                          {msg.role === "assistant" ? (
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <span className="block">{children}</span>,
                                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                ul: ({ children }) => <ul className="list-disc list-inside space-y-0.5">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal list-inside space-y-0.5">{children}</ol>,
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          ) : (
                            msg.content
                          )}
                        </div>
                        {msg.role === "user" && (
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-secondary-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === "user" && (
                      <div className="flex gap-2 justify-start">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        </div>
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <span className="text-sm text-muted-foreground">
                            {language === "hi" ? "लिख रहा हूं..." : "Typing..."}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {(isListening || interimTranscript) && (
                  <div className="px-4 py-2 bg-primary/5 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                      {interimTranscript ||
                        (language === "hi" ? "सुन रहा हूं..." : "Listening...")}
                    </div>
                  </div>
                )}

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        language === "hi"
                          ? "अपना सवाल लिखें..."
                          : "Type your question..."
                      }
                      disabled={isLoading}
                      className="flex-1"
                    />
                    {isSupported && (
                      <Button
                        variant={isListening ? "destructive" : "outline"}
                        size="icon"
                        onClick={() =>
                          isListening ? stopListening() : startListening()
                        }
                        disabled={isLoading}
                      >
                        {isListening ? "Stop" : "Mic"}
                      </Button>
                    )}
                    <Button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {isSupported && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      {language === "hi"
                        ? "🎤 बोलने के लिए माइक बटन दबाएं"
                        : "🎤 Press mic to speak"}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* End chat confirmation */}
      <AlertDialog open={endChatOpen} onOpenChange={setEndChatOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "hi" ? "सत्र समाप्त करें?" : "End this session?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "hi"
                ? "आप बाद में एक नया सत्र शुरू कर सकते हैं। रिपोर्ट को PDF के रूप में डाउनलोड करने का विकल्प भी है।"
                : "You can start a new one later. You can also export the report as PDF."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "hi" ? "रद्द करें" : "Cancel"}
            </AlertDialogCancel>
            <Button
              variant="outline"
              onClick={() => handleEndChat(false)}
              className="gap-2"
            >
              {language === "hi" ? "बिना PDF समाप्त करें" : "End without PDF"}
            </Button>
            <AlertDialogAction
              onClick={() => handleEndChat(true)}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              {language === "hi" ? "PDF निर्यात करें और समाप्त करें" : "Export PDF & End"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
