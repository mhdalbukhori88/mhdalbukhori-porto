"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  X,
  ExternalLink,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Sparkles,
  Code,
  Database,
  Layout,
  Wrench,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { competencies } from "@/lib/content";
import Reveal from "./Reveal";

const skillCategories = [
  {
    name: "Frontend Development",
    icon: Layout,
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Vue", "Next.js", "Tailwind CSS", "Bootstrap"],
  },
  {
    name: "Backend & Databases",
    icon: Database,
    skills: ["Node.js", "Express", "Java (Spring)", "PHP (Laravel, CodeIgniter)", "Python (Django, Flask)", "MySQL", "PostgreSQL", "MongoDB", "Firebase", "Supabase"],
  },
  {
    name: "Mobile, Cloud & DevOps",
    icon: Code,
    skills: ["Android & iOS Dev (Java, Kotlin)", "GCP", "Vercel", "Netlify", "Docker", "Git/GitHub", "REST API", "GraphQL", "Postman"],
  },
  {
    name: "UI/UX, Data & Productivity",
    icon: Wrench,
    skills: ["Figma", "Google Stitch", "Adobe XD", "Photoshop", "Illustrator", "CorelDRAW", "Canva", "Power BI", "Tableau", "Advanced Excel", "AI Tools & Prompting"],
  },
];

export default function ResumeViewer() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <section id="resume" className="section">
      <Reveal>
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <h1 className="section-title !mb-2">Curriculum Vitae / Resume</h1>
            <p className="max-w-2xl text-base muted">
              Official & updated resume of {siteConfig.name}. Download or view the full PDF version directly.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="btn-outline flex items-center gap-2"
            >
              <Eye size={18} /> Preview PDF
            </button>
            <a
              href={siteConfig.resumeUrl}
              download="Resume_Mhd_Al_Bukhori.pdf"
              className="btn-accent flex items-center gap-2"
            >
              <Download size={18} /> Download CV (PDF)
            </a>
          </div>
        </div>
      </Reveal>

      {/* Resume Spotlight Card */}
      <Reveal delay={100}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] surface-card p-6 sm:p-10 shadow-2xl">
          {/* Header Bar */}
          <div className="flex flex-col gap-6 border-b border-[var(--border)] pb-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <FileText size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                  {siteConfig.name}
                </h2>
                <p className="text-base font-medium text-accent">{siteConfig.role}</p>
                <p className="mt-1 font-mono text-xs muted">
                  {siteConfig.location} • {siteConfig.availability}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-mono muted">
              <span className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5">
                {siteConfig.contact.email}
              </span>
              <span className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5">
                {siteConfig.contact.phone}
              </span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="py-6 border-b border-[var(--border)]">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Sparkles size={18} className="text-accent" /> Professional Summary
            </h3>
            <p className="mt-3 text-sm leading-relaxed muted">
              {siteConfig.about.summary} {siteConfig.about.extended}
            </p>
          </div>

          {/* Technical Skills Matrix */}
          <div className="py-6 border-b border-[var(--border)]">
            <h3 className="mb-4 text-lg font-bold">Technical Skills</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {skillCategories.map((cat) => (
                <div key={cat.name} className="rounded-xl border border-[var(--border)] p-4 bg-[var(--bg)]/40">
                  <div className="flex items-center gap-2 text-sm font-semibold text-accent mb-2.5">
                    <cat.icon size={16} />
                    {cat.name}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.skills.map((s) => (
                      <span key={s} className="tag text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Competencies */}
          <div className="pt-6">
            <h3 className="mb-3 text-lg font-bold">Core Competencies</h3>
            <div className="flex flex-wrap gap-2">
              {competencies.map((comp) => (
                <span
                  key={comp}
                  className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  <CheckCircle size={12} /> {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* PDF Modal Preview */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsPreviewOpen(false)}
          />
          <div className="relative flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-white/20 bg-night shadow-2xl overflow-hidden animate-[fadeInUp_0.25s_ease]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-black/40">
              <div className="flex items-center gap-3">
                <FileText className="text-accent" size={22} />
                <div>
                  <h3 className="text-base font-bold text-white">Resume Mhd. Al Bukhori.pdf</h3>
                  <p className="text-xs text-white/60">Official PDF Document Preview</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/10"
                >
                  Open tab <ExternalLink size={14} />
                </a>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors"
                  aria-label="Close Preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: PDF Iframe */}
            <div className="relative flex-1 bg-neutral-900">
              <iframe
                src={`${siteConfig.resumeUrl}#toolbar=1&navpanes=0`}
                className="h-full w-full border-none"
                title="CV Mhd Al Bukhori Preview"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
