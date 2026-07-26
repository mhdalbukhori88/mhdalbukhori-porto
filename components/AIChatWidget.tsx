"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, MessageSquare, X, Send, Trash2, Bot, Globe, CheckCircle2 } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";
import { siteConfig } from "@/lib/site-config";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

export default function AIChatWidget() {
  const { language } = useLanguage();
  const t = translations[language].ai;

  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: t.defaultAnswer,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Proactive greeting bubble after 2.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Update default message when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === "welcome-1") {
        return [
          {
            id: "welcome-1",
            sender: "ai",
            text: t.defaultAnswer,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ];
      }
      return prev;
    });
  }, [language, t.defaultAnswer]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customText?: string) => {
    const messageText = (customText || inputMessage).trim();
    if (!messageText || isLoading) return;

    setShowBubble(false);
    setInputMessage("");

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText, lang: language }),
      });

      const data = await res.json();
      const aiReply = data.reply || t.defaultAnswer;

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: "ai",
        text:
          language === "en"
            ? "I am currently having trouble connecting. Please feel free to email Al Bukhori directly at mhdalbukhori296@gmail.com!"
            : "Maaf, terjadi gangguan jaringan. Anda dapat langsung mengirim email ke mhdalbukhori296@gmail.com!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: t.defaultAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Helper to format bold markdown and links
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Bold text **text**
      const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <span
          key={idx}
          dangerouslySetInnerHTML={{ __html: formatted }}
          className="block min-h-[1.2em]"
        />
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end">
      {/* ── Proactive Greeting Bubble ── */}
      {!isOpen && showBubble && (
        <div className="mb-3 max-w-xs animate-[fadeInUp_0.4s_ease] rounded-2xl border border-[var(--border)] bg-[var(--bg)]/95 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                <Sparkles size={13} />
              </span>
              <span className="font-sans text-xs font-bold text-[var(--text)]">
                {t.headerTitle}
              </span>
            </div>
            <button
              onClick={() => setShowBubble(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text)] p-0.5"
              aria-label="Close bubble"
            >
              <X size={14} />
            </button>
          </div>
          <p className="font-sans text-xs text-[var(--text-muted)] leading-relaxed">
            {t.bubbleWelcome}
          </p>
          <button
            onClick={() => {
              setIsOpen(true);
              setShowBubble(false);
            }}
            className="mt-2.5 w-full rounded-xl bg-accent/15 px-3 py-1.5 font-sans text-xs font-semibold text-accent hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            <MessageSquare size={13} /> Chat Now
          </button>
        </div>
      )}

      {/* ── Main Chat Modal ── */}
      {isOpen ? (
        <div className="flex h-[540px] w-[92vw] max-w-[400px] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg)]/95 shadow-2xl backdrop-blur-2xl animate-[fadeInUp_0.35s_ease]">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--bg-alt)]/60 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-indigo-600 text-white shadow-md">
                  <Bot size={20} />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg)]" />
              </div>
              <div>
                <h3 className="font-sans text-sm font-bold text-[var(--text)] leading-none">
                  {t.headerTitle}
                </h3>
                <span className="font-mono text-[10px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 size={10} /> {t.onlineStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title={t.clearBtn}
                className="p-1.5 text-[var(--text-muted)] hover:text-red-400 transition-colors rounded-lg"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors rounded-lg"
                aria-label="Close AI Chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-bold">
                    <Sparkles size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-accent text-white rounded-tr-none font-medium"
                      : "bg-[var(--bg-alt)] text-[var(--text)] rounded-tl-none border border-[var(--border)]"
                  }`}
                >
                  {renderFormattedText(msg.text)}
                  <span
                    className={`mt-1 block text-[9px] ${
                      msg.sender === "user" ? "text-white/70 text-right" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-accent text-xs p-2">
                <Sparkles size={14} className="animate-spin" />
                <span className="font-mono text-[11px] animate-pulse">
                  {language === "en" ? "AI is thinking..." : "AI sedang berpikir..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="border-t border-[var(--border)] bg-[var(--bg-alt)]/30 px-3 py-2">
            <p className="mb-1.5 text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              {t.quickPromptsTitle}
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {t.prompts.map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(promptText)}
                  disabled={isLoading}
                  className="rounded-lg bg-[var(--bg)] px-2.5 py-1 text-[11px] text-[var(--text)] border border-[var(--border)] hover:border-accent hover:text-accent transition-all text-left font-sans"
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-[var(--border)] p-3 bg-[var(--bg)]"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 rounded-xl bg-[var(--bg-alt)] px-3.5 py-2 text-xs text-[var(--text)] outline-none border border-transparent focus:border-accent transition-all placeholder:text-[var(--text-muted)]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white transition-all disabled:opacity-40 hover:scale-105 active:scale-95"
              aria-label={t.sendBtn}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      ) : (
        /* ── Floating Badge Button ── */
        <button
          onClick={() => {
            setIsOpen(true);
            setShowBubble(false);
          }}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-accent via-indigo-600 to-accent px-4 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
          aria-label="Open AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
          </span>
          <Sparkles size={18} className="animate-pulse" />
          <span className="font-sans text-xs font-bold tracking-wide">
            {t.floatingBadge}
          </span>
        </button>
      )}
    </div>
  );
}
