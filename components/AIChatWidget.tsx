"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, MessageSquare, X, Send, Trash2, Bot, CheckCircle2, ChevronRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { translations } from "@/lib/translations";

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

  // Proactive greeting bubble after 2s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 2000);
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

  // Helper to format bold markdown and links cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-accent-light'>$1</strong>");
      return (
        <span
          key={idx}
          dangerouslySetInnerHTML={{ __html: formatted }}
          className="block min-h-[1.25em]"
        />
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end font-sans">
      {/* ── Proactive Glassmorphic Greeting Bubble ── */}
      {!isOpen && showBubble && (
        <div className="mb-3.5 w-80 animate-[fadeInUp_0.4s_cubic-bezier(0.16,1,0.3,1)] rounded-3xl border border-accent/30 bg-[var(--bg)]/95 p-4.5 shadow-[0_15px_35px_rgba(0,0,0,0.3)] backdrop-blur-2xl ring-1 ring-accent/20">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--border)]/60">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-accent via-indigo-500 to-emerald-400 p-[1.5px] shadow-sm">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[var(--bg)] text-accent">
                  <Sparkles size={13} className="animate-pulse" />
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold text-[var(--text)] tracking-tight">
                  {t.headerTitle}
                </span>
                <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowBubble(false)}
              className="rounded-full p-1 text-[var(--text-muted)] hover:bg-[var(--bg-alt)] hover:text-[var(--text)] transition-all"
              aria-label="Close bubble"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-xs text-[var(--text)]/90 leading-relaxed font-normal">
            {t.bubbleWelcome}
          </p>

          <button
            onClick={() => {
              setIsOpen(true);
              setShowBubble(false);
            }}
            className="mt-3.5 w-full rounded-2xl bg-gradient-to-r from-accent via-indigo-600 to-accent bg-[length:200%_auto] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <MessageSquare size={14} className="group-hover:rotate-12 transition-transform" />
            <span>Chat Now</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* ── Main High-End Chat Modal ── */}
      {isOpen ? (
        <div className="flex h-[560px] w-[92vw] max-w-[410px] flex-col overflow-hidden rounded-3xl border border-accent/30 bg-[var(--bg)]/95 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl animate-[fadeInUp_0.35s_cubic-bezier(0.16,1,0.3,1)]">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] bg-gradient-to-r from-[var(--bg-alt)]/80 via-[var(--bg-alt)]/40 to-transparent px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent via-indigo-600 to-accent text-white shadow-md shadow-accent/20">
                  <Bot size={22} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[var(--bg)]" />
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text)] leading-snug">
                  {t.headerTitle}
                </h3>
                <span className="font-mono text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={10} /> {t.onlineStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title={t.clearBtn}
                className="p-2 text-[var(--text-muted)] hover:text-red-400 hover:bg-red-500/10 transition-all rounded-xl"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-alt)] transition-all rounded-xl"
                aria-label="Close AI Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent font-bold border border-accent/20">
                    <Sparkles size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[84%] rounded-2xl px-4 py-3 leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-accent to-indigo-600 text-white rounded-tr-none font-medium shadow-md shadow-accent/20"
                      : "bg-[var(--bg-alt)]/90 text-[var(--text)] rounded-tl-none border border-[var(--border)]"
                  }`}
                >
                  {renderFormattedText(msg.text)}
                  <span
                    className={`mt-1.5 block text-[9px] font-mono ${
                      msg.sender === "user" ? "text-white/70 text-right" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-accent text-xs p-2.5 rounded-xl bg-accent/10 border border-accent/20 w-fit animate-pulse">
                <Sparkles size={15} className="animate-spin text-accent" />
                <span className="font-mono text-[11px] font-semibold">
                  {language === "en" ? "AI is generating answer..." : "AI sedang mengetik jawaban..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="border-t border-[var(--border)] bg-[var(--bg-alt)]/40 px-3.5 py-2.5">
            <p className="mb-1.5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
              {t.quickPromptsTitle}
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {t.prompts.map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(promptText)}
                  disabled={isLoading}
                  className="rounded-xl bg-[var(--bg)] px-3 py-1.5 text-[11px] text-[var(--text)] border border-[var(--border)] hover:border-accent hover:text-accent hover:bg-accent/5 transition-all text-left font-medium active:scale-95 disabled:opacity-50"
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
              className="flex-1 rounded-2xl bg-[var(--bg-alt)] px-4 py-2.5 text-xs text-[var(--text)] outline-none border border-[var(--border)] focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder:text-[var(--text-muted)]"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-indigo-600 text-white transition-all disabled:opacity-30 hover:scale-105 active:scale-95 shadow-md shadow-accent/25"
              aria-label={t.sendBtn}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        /* ── Floating Glowing Badge Button ── */
        <button
          onClick={() => {
            setIsOpen(true);
            setShowBubble(false);
          }}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-accent via-indigo-600 to-accent bg-[length:200%_auto] px-4.5 py-3.5 text-white shadow-2xl shadow-accent/30 transition-all duration-300 hover:scale-105 hover:shadow-accent/50 active:scale-95 border border-white/20"
          aria-label="Open AI Assistant"
        >
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
          </span>
          <Sparkles size={18} className="animate-pulse text-amber-300" />
          <span className="font-sans text-xs font-bold tracking-wide">
            {t.floatingBadge}
          </span>
        </button>
      )}
    </div>
  );
}
