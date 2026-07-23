// Central configuration for the portfolio. Edit these values to update
// content across the entire website.

export const siteConfig = {
  name: "Mhd. Al Bukhori",
  shortName: "Al Bukhori",
  role: "Full Stack Developer & IT Professional",
  tagline:
    "Full Stack Developer & IT professional with 250+ delivered projects. Proficient in React, Vue, Next.js, Node.js, Spring, Laravel, Django, Mobile App Dev (Android/iOS), Data Analytics & UI/UX Design.",
  location: "Binjai, Indonesia",
  availability: "Open to Remote Work | GMT+7 (WIB)",
  resumeUrl: "/cv-mhd-al-bukhori.pdf",
  profileImage: "/profile.jpeg",

  contact: {
    email: "mhdalbukhori296@gmail.com",
    phone: "+62 819-9708-0296",
    phoneRaw: "6281997080296", // for WhatsApp links (no +, no spaces)
    whatsappDisplay: "0819-9708-0296",
  },

  socials: {
    github: "https://github.com/mhdalbukhori88",
    linkedin: "https://linkedin.com/in/mhd-al-bukhori",
    instagram: "https://instagram.com/mhdalbukhori_",
    instagramHandle: "@mhdalbukhori_",
    softwareHouse: {
      name: "Golden Tech Indonesia",
      handle: "@goldentech.id",
      url: "https://www.instagram.com/goldentech.id",
    },
    website: "https://mhdalbukhori-porto.vercel.app",
  },

  about: {
    summary:
      "Full Stack Developer and IT professional currently completing a Bachelor's degree (S1) in Informatics Engineering at STMIK Kaputama Binjai, with hands-on freelance experience since 2021 delivering 250+ end-to-end web and mobile projects.",
    extended:
      "Proficient in modern frontend (React, Vue, Next.js, Tailwind CSS), scalable backend frameworks (Node.js, Java Spring, PHP Laravel, Python Django/Flask), native mobile app dev (Java, Kotlin), databases & BaaS (MySQL, PostgreSQL, MongoDB, Firebase, Supabase), cloud & DevOps (GCP, Docker, Vercel, Netlify), data analytics (Power BI, Tableau, Advanced Excel, SQL), UI/UX design (Figma, Adobe XD), and AI prompt engineering.",
    closing:
      "Combines strong technical expertise, operational discipline, and asynchronous remote collaboration skills to build complete, reliable, and high-performance digital products.",
  },

  stats: [
    { label: "Delivered Projects", value: "250+ Web & Mobile" },
    { label: "Core Stacks", value: "React · Next.js · Node · Spring · Laravel" },
    { label: "Cloud & Databases", value: "GCP · Firebase · Postgres · MySQL" },
    { label: "Design & Analytics", value: "Figma · Power BI · Tableau · AI" },
  ],
};

export type SiteConfig = typeof siteConfig;
