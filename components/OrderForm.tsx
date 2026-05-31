"use client";

import { useState, useRef } from "react";
import { Send, MessageCircle, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import Reveal from "./Reveal";

const websiteTypes = [
  "Company Profile",
  "Landing Page",
  "E-Commerce / Online Store",
  "Web Application",
  "Personal / Portfolio",
  "Community / Organization",
  "Other",
];

const budgets = ["Under Rp 1 Juta", "Rp 1 - 3 Juta", "Rp 3 - 7 Juta", "Rp 7 Juta+", "Let's discuss"];

type Status = "idle" | "sending" | "success" | "error";

export default function OrderForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: websiteTypes[0],
    budget: budgets[0],
    deadline: "",
    details: "",
    company: "", // honeypot — must stay empty
  });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const startedAt = useRef<number>(Date.now());

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const buildMessage = () =>
    `Hi ${siteConfig.name}, I'd like to order a website.\n\n` +
    `Name: ${form.name}\n` +
    `Email: ${form.email}\n` +
    `Phone: ${form.phone}\n` +
    `Website Type: ${form.type}\n` +
    `Budget: ${form.budget}\n` +
    `Target Deadline: ${form.deadline || "Flexible"}\n\n` +
    `Project Details:\n${form.details}`;

  const openWhatsApp = () => {
    const text = encodeURIComponent(buildMessage());
    window.open(`https://wa.me/${siteConfig.contact.phoneRaw}?text=${text}`, "_blank");
  };

  const openEmail = () => {
    const subject = encodeURIComponent(`Website Order — ${form.name || "New Client"}`);
    const body = encodeURIComponent(buildMessage());
    window.open(`mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.details) {
      setStatus("error");
      setMessage("Please fill in your name, email, and project details.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, startedAt: startedAt.current }),
      });
      const data = await res.json();
      if (res.ok && data.delivered) {
        setStatus("success");
        setMessage("Your order has been sent. I'll get back to you very soon!");
      } else {
        setStatus("success");
        setMessage("Opening WhatsApp and your email app so you can send the order directly. Thank you!");
        openWhatsApp();
        setTimeout(openEmail, 600);
      }
    } catch {
      setStatus("success");
      setMessage("Opening WhatsApp and your email app so you can send the order directly. Thank you!");
      openWhatsApp();
      setTimeout(openEmail, 600);
    }
  };

  return (
    <section id="order" className="section">
      <Reveal>
        <h1 className="section-title">Order a Website</h1>
        <p className="-mt-6 mb-10 max-w-2xl text-base muted">
          Need a website for yourself, your community, or your company? Fill in the form and it goes
          straight to my email and WhatsApp.
        </p>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div className="flex h-full flex-col justify-between gap-6 rounded-lg p-7 surface-card">
            <div>
              <h3 className="font-sans text-xl font-bold">How it works</h3>
              <ol className="mt-5 space-y-4">
                {[
                  "Fill in the order form with your project details.",
                  "I receive it instantly via email & WhatsApp.",
                  "We discuss scope, timeline, and pricing.",
                  "I build and deliver your website end-to-end.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed muted">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="space-y-3">
              <button onClick={openWhatsApp} className="btn-accent w-full !bg-emerald-600 hover:!bg-emerald-500">
                <MessageCircle size={18} /> Order via WhatsApp
              </button>
              <button onClick={openEmail} className="btn-outline w-full">
                <Mail size={18} /> Order via Email
              </button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={handleSubmit} className="rounded-lg p-7 surface-card">
            {/* Honeypot field — hidden from humans, bots tend to fill it. */}
            <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
              <label>
                Company
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name *">
                <input type="text" required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your name" className="form-input" />
              </Field>
              <Field label="Email *">
                <input type="email" required value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className="form-input" />
              </Field>
              <Field label="Phone / WhatsApp">
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="08xxxxxxxxxx" className="form-input" />
              </Field>
              <Field label="Target Deadline">
                <input type="text" value={form.deadline} onChange={(e) => update("deadline", e.target.value)} placeholder="e.g. 2 weeks" className="form-input" />
              </Field>
              <Field label="Website Type">
                <select value={form.type} onChange={(e) => update("type", e.target.value)} className="form-input">
                  {websiteTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Budget Range">
                <select value={form.budget} onChange={(e) => update("budget", e.target.value)} className="form-input">
                  {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Project Details *">
                <textarea required rows={5} value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="Tell me about your website: goals, pages, features, references..." className="form-input resize-none" />
              </Field>
            </div>

            {message && (
              <div className={`mt-4 flex items-start gap-2 rounded-md border p-3 text-sm ${status === "error" ? "border-red-500/40 bg-red-500/10 text-red-400" : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"}`}>
                {status === "error" ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
                <span>{message}</span>
              </div>
            )}

            <button type="submit" disabled={status === "sending"} className="btn-accent mt-5 w-full disabled:opacity-70">
              {status === "sending" ? (<><Loader2 size={18} className="animate-spin" /> Sending...</>) : (<><Send size={18} /> Send Order</>)}
            </button>
            <p className="mt-3 text-center text-xs muted">
              Delivered to {siteConfig.contact.email} &amp; WhatsApp {siteConfig.contact.whatsappDisplay}
            </p>
          </form>
        </Reveal>
      </div>

      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid var(--border);
          background-color: var(--bg);
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          color: var(--text);
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input::placeholder {
          color: var(--text-muted);
          opacity: 0.7;
        }
        .form-input:focus {
          border-color: #5000ca;
        }
        .form-input option {
          color: #272822;
          background: #fff;
        }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-xs muted">{label}</span>
      {children}
    </label>
  );
}
