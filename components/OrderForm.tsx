"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  MessageCircle,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading, FadeIn } from "./Section";

const websiteTypes = [
  "Company Profile",
  "Landing Page",
  "E-Commerce / Online Store",
  "Web Application",
  "Personal / Portfolio",
  "Community / Organization",
  "Other",
];

const budgets = [
  "Under Rp 1 Juta",
  "Rp 1 - 3 Juta",
  "Rp 3 - 7 Juta",
  "Rp 7 Juta+",
  "Let's discuss",
];

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
  });
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

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
    window.open(
      `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`,
      "_blank"
    );
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
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.delivered) {
        setStatus("success");
        setMessage("Your order has been sent. I'll get back to you very soon!");
      } else {
        // Server has no email provider configured — fall back to WhatsApp + email client.
        setStatus("success");
        setMessage(
          "Opening WhatsApp and your email app so you can send the order directly. Thank you!"
        );
        openWhatsApp();
        setTimeout(openEmail, 600);
      }
    } catch {
      setStatus("success");
      setMessage(
        "Opening WhatsApp and your email app so you can send the order directly. Thank you!"
      );
      openWhatsApp();
      setTimeout(openEmail, 600);
    }
  };

  return (
    <section id="order" className="section-pad section-glow">
      <div className="container-px">
        <SectionHeading
          eyebrow="Order a Website"
          title="Let's Build Your Website"
          description="Need a website for yourself, your community, or your company? Fill in the form and it goes straight to my email and WhatsApp."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          {/* Info side */}
          <FadeIn>
            <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-600/15 to-brand-400/5 p-7">
              <div>
                <h3 className="font-display text-xl font-bold text-white">
                  How it works
                </h3>
                <ol className="mt-5 space-y-4">
                  {[
                    "Fill in the order form with your project details.",
                    "I receive it instantly via email & WhatsApp.",
                    "We discuss scope, timeline, and pricing.",
                    "I build and deliver your website end-to-end.",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-white/75">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="space-y-3">
                <button onClick={openWhatsApp} className="btn-primary w-full !bg-emerald-600 hover:!bg-emerald-500">
                  <MessageCircle size={18} />
                  Order via WhatsApp
                </button>
                <button onClick={openEmail} className="btn-ghost w-full">
                  <Mail size={18} />
                  Order via Email
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Form side */}
          <FadeIn delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-7"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name *">
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your name"
                    className="form-input"
                  />
                </Field>
                <Field label="Email *">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@email.com"
                    className="form-input"
                  />
                </Field>
                <Field label="Phone / WhatsApp">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="form-input"
                  />
                </Field>
                <Field label="Target Deadline">
                  <input
                    type="text"
                    value={form.deadline}
                    onChange={(e) => update("deadline", e.target.value)}
                    placeholder="e.g. 2 weeks"
                    className="form-input"
                  />
                </Field>
                <Field label="Website Type">
                  <select
                    value={form.type}
                    onChange={(e) => update("type", e.target.value)}
                    className="form-input"
                  >
                    {websiteTypes.map((t) => (
                      <option key={t} value={t} className="bg-ink-900">
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Budget Range">
                  <select
                    value={form.budget}
                    onChange={(e) => update("budget", e.target.value)}
                    className="form-input"
                  >
                    {budgets.map((b) => (
                      <option key={b} value={b} className="bg-ink-900">
                        {b}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="mt-4">
                <Field label="Project Details *">
                  <textarea
                    required
                    rows={5}
                    value={form.details}
                    onChange={(e) => update("details", e.target.value)}
                    placeholder="Tell me about your website: goals, pages, features, references..."
                    className="form-input resize-none"
                  />
                </Field>
              </div>

              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 flex items-start gap-2 rounded-xl border p-3 text-sm ${
                    status === "error"
                      ? "border-red-500/30 bg-red-500/10 text-red-200"
                      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  }`}
                >
                  {status === "error" ? (
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  ) : (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                  )}
                  <span>{message}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Order
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-xs text-white/40">
                Your order is delivered to {siteConfig.contact.email} &amp; WhatsApp{" "}
                {siteConfig.contact.whatsappDisplay}
              </p>
            </form>
          </FadeIn>
        </div>
      </div>

      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(255, 255, 255, 0.03);
          padding: 0.7rem 0.9rem;
          font-size: 0.875rem;
          color: #e6edf7;
          outline: none;
          transition: all 0.2s;
        }
        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }
        .form-input:focus {
          border-color: rgba(51, 128, 252, 0.5);
          background-color: rgba(255, 255, 255, 0.05);
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/50">
        {label}
      </span>
      {children}
    </label>
  );
}
