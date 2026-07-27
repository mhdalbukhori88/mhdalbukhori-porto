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

  // Helper to format bold markdown cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong class='font-bold text-indigo-600 dark:text-indigo-400'>$1</strong>");
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
      {/* ── Proactive Modern Greeting Bubble ── */}
      {!isOpen && showBubble && (
        <div className="mb-3 w-[290px] sm:w-[310px] animate-[fadeInUp_0.4s_cubic-bezier(0.16,1,0.3,1)] rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 p-[1.5px] shadow-sm">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400">
                  <Sparkles size={13} className="animate-pulse" />
                </div>
              </div>
              <div>
                <span className="block text-xs font-bold text-slate-900 dark:text-white tracking-tight">
                  {t.headerTitle}
                </span>
                <span className="flex items-center gap-1 text-[9px] font-mono text-emerald-500 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Online
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowBubble(false)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-all"
              aria-label="Close bubble"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {t.bubbleWelcome}
          </p>

          <button
            onClick={() => {
              setIsOpen(true);
              setShowBubble(false);
            }}
            className="mt-3 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <MessageSquare size={14} className="group-hover:rotate-12 transition-transform" />
            <span>Chat Now</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* ── Main High-End Chat Modal ── */}
      {isOpen ? (
        <div className="flex h-[520px] sm:h-[540px] w-[calc(100vw-2.5rem)] sm:w-[380px] flex-col overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl animate-[fadeInUp_0.35s_cubic-bezier(0.16,1,0.3,1)]">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-indigo-500/20 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-4 py-3.5 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-sm border border-white/20">
                  <Bot size={20} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-indigo-600" />
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-snug tracking-tight">
                  {t.headerTitle}
                </h3>
                <span className="font-mono text-[10px] text-emerald-200 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={10} /> {t.onlineStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title={t.clearBtn}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 transition-all rounded-xl cursor-pointer"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 transition-all rounded-xl cursor-pointer"
                aria-label="Close AI Chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/60 dark:border-indigo-800/60">
                    <Sparkles size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-tr-none font-medium shadow-md shadow-indigo-500/20"
                      : "bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                >
                  {renderFormattedText(msg.text)}
                  <span
                    className={`mt-1 block text-[9px] font-mono ${
                      msg.sender === "user" ? "text-white/70 text-right" : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/50 w-fit animate-pulse">
                <Sparkles size={14} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                <span className="font-mono text-[11px] font-semibold">
                  {language === "en" ? "Generating answer..." : "Mengetik jawaban..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 px-3.5 py-2.5">
            <p className="mb-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
              {t.quickPromptsTitle}
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {t.prompts.map((promptText, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(promptText)}
                  disabled={isLoading}
                  className="rounded-xl bg-white dark:bg-slate-800 px-3 py-1 text-[11px] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all text-left font-medium active:scale-95 disabled:opacity-50 shadow-2xs cursor-pointer"
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
            className="flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 p-3 bg-white dark:bg-slate-900"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 rounded-2xl bg-slate-100 dark:bg-slate-800 px-4 py-2.5 text-xs text-slate-900 dark:text-white outline-none border border-slate-200 dark:border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white transition-all disabled:opacity-30 hover:scale-105 active:scale-95 shadow-md shadow-indigo-500/25 cursor-pointer"
              aria-label={t.sendBtn}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      ) : (
        /* ── Floating Compact Action Button ── */
        <button
          onClick={() => {
            setIsOpen(true);
            setShowBubble(false);
          }}
          className="group relative inline-flex h-11 items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 px-6 text-white shadow-[0_8px_25px_rgba(79,70,229,0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_30px_rgba(79,70,229,0.6)] active:scale-95 border border-white/25 cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <span className="relative flex h-2.5 w-2.5 shrink-0 ml-0.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <Sparkles size={16} className="shrink-0 animate-pulse text-amber-300" />
          <span className="font-sans text-xs font-bold tracking-wide whitespace-nowrap mr-0.5">
            {t.floatingBadge}
          </span>
        </button>
      )}
    </div>
  );
}
