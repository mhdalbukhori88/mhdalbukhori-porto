"use client";

import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Instagram,
  MessageCircle,
  Send,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { SectionHeading, FadeIn } from "./Section";

export default function Contact() {
  const waLink = `https://wa.me/${siteConfig.contact.phoneRaw}?text=${encodeURIComponent(
    `Hi ${siteConfig.name}, I'd like to connect with you.`
  )}`;

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
    {
      icon: Phone,
      label: "Phone / WhatsApp",
      value: siteConfig.contact.whatsappDisplay,
      href: waLink,
    },
    {
      icon: MapPin,
      label: "Location",
      value: siteConfig.location,
      href: undefined,
    },
  ];

  const socials = [
    { icon: Github, label: "GitHub", href: siteConfig.socials.github, value: "mhdalbukhori88" },
    { icon: Linkedin, label: "LinkedIn", href: siteConfig.socials.linkedin, value: "mhd-al-bukhori" },
    { icon: Instagram, label: "Instagram", href: siteConfig.socials.instagram, value: siteConfig.socials.instagramHandle },
  ];

  return (
    <section id="contact" className="section-pad">
      <div className="container-px">
        <SectionHeading
          eyebrow="Contact"
          title="Get In Touch"
          description="Open for full-time roles, freelance projects, and collaborations. Let's talk."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <FadeIn>
            <div className="space-y-4">
              {contactItems.map((item) => {
                const content = (
                  <div className="card flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600/15 text-brand-300">
                      <item.icon size={22} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                        {item.label}
                      </p>
                      <p className="truncate text-sm font-medium text-white/90">{item.value}</p>
                    </div>
                  </div>
                );
                return item.href ? (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="block">
                    {content}
                  </a>
                ) : (
                  <div key={item.label}>{content}</div>
                );
              })}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-7">
              <div>
                <h3 className="font-display text-lg font-semibold text-white">Find me online</h3>
                <div className="mt-4 space-y-3">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition-all hover:border-brand-500/40 hover:bg-brand-500/5"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-brand-300">
                        <s.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/90">{s.label}</p>
                        <p className="text-xs text-white/50">{s.value}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a href={waLink} target="_blank" rel="noreferrer" className="btn-primary !bg-emerald-600 hover:!bg-emerald-500">
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
                <a href={`mailto:${siteConfig.contact.email}`} className="btn-ghost">
                  <Send size={18} />
                  Email Me
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
