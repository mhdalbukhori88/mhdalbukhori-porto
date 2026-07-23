"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  X,
  ExternalLink,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Code,
  Database,
  Layout,
  Wrench,
  Printer,
  Globe,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Award,
} from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { competencies, timeline } from "@/lib/content";
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

const technicalSkillsMatrix = [
  { label: "Frontend", items: "HTML, CSS, JavaScript, TypeScript, React, Vue, Next.js, Tailwind CSS, Bootstrap" },
  { label: "Backend", items: "Node.js, Express, Java (Spring), PHP (Laravel, CodeIgniter), Python (Django, Flask)" },
  { label: "Mobile Development", items: "Java, Kotlin (Android & iOS app development)" },
  { label: "Database & BaaS", items: "MySQL, PostgreSQL, MongoDB, Firebase, Supabase" },
  { label: "Cloud & Deployment", items: "Google Cloud Platform (GCP), Vercel, Netlify, Docker, hosting & domain management" },
  { label: "Version Control & API", items: "Git, GitHub, REST API, GraphQL, Postman" },
  { label: "UI/UX & Graphic Design", items: "Figma, Google Stitch, Adobe XD, Photoshop, Illustrator, CorelDRAW, Canva" },
  { label: "Data Analysis", items: "Advanced Microsoft Excel, SQL, Power BI, Tableau" },
  { label: "Content & Productivity", items: "Filmora, CapCut, Microsoft Office (Word, Excel, PowerPoint)" },
  { label: "AI & Automation", items: "AI Tools, Prompt Engineering, Data Processing & Analysis" },
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
              Official &amp; updated resume of {siteConfig.name}. Preview online or download the PDF file directly.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="btn-outline flex items-center gap-2"
            >
              <Eye size={18} /> Preview Resume
            </button>
            <a
              href={siteConfig.resumeUrl}
              download="Resume_Mhd_Al_Bukhori.pdf"
              className="btn-accent flex items-center gap-2"
            >
              <Download size={18} /> Download Resume (PDF)
            </a>
          </div>
        </div>
      </Reveal>

      {/* Resume Overview Spotlight Card */}
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
                <div key={cat.name} className="rounded-xl border border-[var(--border)] p-4 bg-[var(--bg)]/40 transition-all duration-300 hover:border-accent/50 hover:bg-accent/5">
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
                  className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition-all duration-200 hover:scale-105 hover:bg-accent/20"
                >
                  <CheckCircle2 size={12} /> {comp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* 100% Reliable Native Resume Document Modal (Guaranteed No Browser Blocking) */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setIsPreviewOpen(false)}
          />
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl border border-white/20 bg-night text-white shadow-2xl overflow-hidden animate-[fadeInUp_0.25s_ease] my-auto">
            {/* Modal Navigation Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 bg-black/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white sm:text-base">
                    Resume Mhd. Al Bukhori.pdf
                  </h3>
                  <p className="text-xs text-emerald-400 font-mono">Verified Full Document</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/10"
                >
                  Open PDF <ExternalLink size={14} />
                </a>
                <a
                  href={siteConfig.resumeUrl}
                  download="Resume_Mhd_Al_Bukhori.pdf"
                  className="hidden sm:flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-light transition-colors"
                >
                  Download <Download size={14} />
                </a>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/20 transition-colors ml-1"
                  aria-label="Close Preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: Clean Document Viewer */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-neutral-950 text-neutral-200 font-sans space-y-6">
              {/* Document Header */}
              <div className="border-b border-neutral-800 pb-6 text-center sm:text-left flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Mhd. Al Bukhori
                  </h1>
                  <p className="text-lg font-semibold text-accent mt-1">Full Stack Developer</p>
                  <p className="text-xs text-emerald-400 font-mono mt-1">
                    Open to Remote Work | GMT+7 (WIB)
                  </p>
                </div>
                <div className="text-xs font-mono space-y-1 text-neutral-300 bg-neutral-900/80 p-3 rounded-lg border border-neutral-800">
                  <p className="flex items-center gap-2">
                    <Mail size={13} className="text-accent" /> {siteConfig.contact.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={13} className="text-accent" /> {siteConfig.contact.phone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-accent" /> Binjai, Indonesia
                  </p>
                  <p className="flex items-center gap-2 pt-1 border-t border-neutral-800">
                    <Globe size={13} className="text-accent" /> mhdalbukhori-porto.vercel.app
                  </p>
                </div>
              </div>

              {/* Professional Summary Section */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-2">
                  Professional Summary
                </h2>
                <p className="text-sm leading-relaxed text-neutral-300 bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/80">
                  Full Stack Developer and IT professional currently completing a Bachelor&apos;s degree (S1) in Informatics Engineering at STMIK Kaputama Binjai, with hands-on freelance experience since 2021 delivering 250+ end-to-end web and mobile projects for clients across diverse needs. Proficient in building responsive frontend interfaces (React, Vue, Next.js) and scalable backend systems (Node.js, Java Spring, PHP Laravel, Python Django/Flask), backed by strong database and cloud expertise (MySQL, PostgreSQL, MongoDB, Firebase, Supabase, Google Cloud Platform, Vercel, Netlify, Docker). Also experienced in native mobile app development for Android and iOS using Java and Kotlin. Complements technical development skills with strong data analysis capability, including advanced Microsoft Excel, SQL, Power BI, and Tableau, as well as graphic design and UI/UX design using Figma, Adobe XD, Photoshop, Illustrator, CorelDRAW, and Canva.
                </p>
              </div>

              {/* Technical Skills Section */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-3">
                  Technical Skills Matrix
                </h2>
                <div className="space-y-2 text-sm bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/80">
                  {technicalSkillsMatrix.map((item) => (
                    <div key={item.label} className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-1 sm:gap-2">
                      <span className="font-semibold text-white text-xs font-mono">{item.label}:</span>
                      <span className="text-neutral-300 text-xs">{item.items}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Experience Section */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-3">
                  Professional Experience
                </h2>
                <div className="space-y-4">
                  {timeline.map((item, idx) => (
                    <div key={idx} className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-neutral-800 pb-2 mb-2">
                        <div>
                          <h3 className="font-bold text-white text-base">{item.title}</h3>
                          <p className="text-xs font-semibold text-accent">{item.place}</p>
                        </div>
                        <span className="font-mono text-xs text-neutral-400">{item.date}</span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed mb-2">{item.description}</p>
                      {item.bullets && item.bullets.length > 0 && (
                        <ul className="space-y-1 text-xs text-neutral-400 pl-1">
                          {item.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="flex items-start gap-2">
                              <span className="text-accent mt-0.5">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education & Achievements */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-widest text-accent font-bold mb-3">
                  Education &amp; Core Competencies
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/80">
                    <h3 className="font-bold text-white text-sm">Bachelor of Informatics Engineering (S1)</h3>
                    <p className="text-xs text-accent">STMIK Kaputama Binjai (In Progress)</p>
                  </div>
                  <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-800/80">
                    <h3 className="font-bold text-white text-sm">Natural Sciences (IPA) — SMA Negeri 5 Binjai</h3>
                    <p className="text-xs text-accent">Final Score: 97.14 | Chairman of Student Council (Ketua OSIS)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/60 px-5 py-3 shrink-0">
              <span className="text-xs text-neutral-400 font-mono">
                Official Document • Mhd. Al Bukhori
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline !py-2 !px-4 text-xs flex items-center gap-1.5"
                >
                  <ExternalLink size={14} /> Open Raw PDF
                </a>
                <a
                  href={siteConfig.resumeUrl}
                  download="Resume_Mhd_Al_Bukhori.pdf"
                  className="btn-accent !py-2 !px-4 text-xs flex items-center gap-1.5"
                >
                  <Download size={14} /> Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
