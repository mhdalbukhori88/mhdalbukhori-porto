// Structured content adapted to the template layout:
// Expertise (3 cards), Career History (timeline), Projects, Certificates.

import {
  Code2,
  Database,
  LineChart,
  Globe,
  Boxes,
  Sparkles,
  Palette,
} from "lucide-react";

/* ===== Expertise: 3 cards with tech chips ===== */
export type Expertise = {
  title: string;
  icon: typeof Code2;
  description: string;
  stack: string[];
};

export const expertise: Expertise[] = [
  {
    title: "Frontend & Mobile Development",
    icon: Globe,
    description:
      "Building highly responsive web user interfaces and native mobile applications for Android & iOS with modern frameworks and robust UI patterns.",
    stack: [
      "HTML/CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Vue",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
      "Java (Android)",
      "Kotlin (Android & iOS)",
    ],
  },
  {
    title: "Backend, Cloud & Database Systems",
    icon: Code2,
    description:
      "Architecting scalable backend services, RESTful & GraphQL APIs, microservices, and database solutions with cloud hosting & containerization.",
    stack: [
      "Node.js",
      "Express",
      "Java (Spring)",
      "PHP (Laravel, CodeIgniter)",
      "Python (Django, Flask)",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "Supabase",
      "GCP",
      "Vercel",
      "Netlify",
      "Docker",
    ],
  },
  {
    title: "UI/UX, Data Analytics & AI Tools",
    icon: Sparkles,
    description:
      "Transforming complex requirements into intuitive Figma designs and converting raw datasets into actionable Power BI, Tableau, and SQL dashboards, enhanced by AI prompt engineering.",
    stack: [
      "Figma",
      "Google Stitch",
      "Adobe XD",
      "Photoshop",
      "Illustrator",
      "CorelDRAW",
      "Canva",
      "Power BI",
      "Tableau",
      "Advanced Excel",
      "SQL",
      "AI Tools & Prompting",
    ],
  },
];

/* ===== Career History timeline ===== */
export type TimelineItem = {
  title: string;
  place: string;
  date: string;
  type?: string;
  description: string;
  bullets?: string[];
};

export const timeline: TimelineItem[] = [
  {
    title: "Freelance Full Stack Developer & Graphic Designer",
    place: "Self-Employed — Remote / Binjai, Indonesia",
    date: "2021 – Present",
    type: "Work Experience",
    description:
      "Delivered 250+ freelance web and mobile development projects end-to-end based on client requirements across frontend, backend, database design, UI/UX, and cloud hosting.",
    bullets: [
      "Delivered 250+ web development projects from concept and UI/UX design to production deployment.",
      "Developed frontend & backend features, including database structures and REST/GraphQL API integration.",
      "Created graphic design assets for client branding using Photoshop, Illustrator, CorelDRAW, and Canva.",
      "Coordinated directly with remote clients from initial requirement gathering through final delivery.",
      "Managed website deployment, hosting, domain configuration, and continuous maintenance.",
    ],
  },
  {
    title: "Warehouse Staff",
    place: "PT. KS Binjai — Binjai, Indonesia (Contract)",
    date: "Jan 2025 – Jul 2025",
    type: "Work Experience",
    description:
      "Managed thousands of spare parts and workshop equipment items, maintaining exact inventory control and technician support.",
    bullets: [
      "Managed and issued thousands of spare parts and workshop equipment items.",
      "Conducted monthly physical stock opnames covering thousands of tools and spare parts.",
      "Maintained storage organization and tracked incoming/outgoing goods in inventory systems.",
    ],
  },
  {
    title: "Warehouse Administration Staff",
    place: "PT. Quantum Nusatama — Binjai, Indonesia (Contract)",
    date: "Nov 2023 – Dec 2024",
    type: "Work Experience",
    description:
      "Managed logistics and data operations for 5,000+ network equipment units per month supporting 40 field technicians.",
    bullets: [
      "Managed receiving, storage, and distribution of 5,000+ network equipment units/month (modems, routers, ONTs).",
      "Prepared precon cables and fiber optic installation materials for 40 field technicians.",
      "Updated device data and serial numbers in the OSS system and processed BAST documents.",
      "Maintained technician tools (Splicer, OTDR, OPM) and generated daily inventory status reports.",
    ],
  },
  {
    title: "Production Staff",
    place: "Aneka Kreatif Studio — Binjai, Indonesia (Permanent)",
    date: "Jul 2021 – Sep 2023",
    type: "Work Experience",
    description:
      "Operated digital and offset printing machinery while handling prepress design edits and finishing processes.",
    bullets: [
      "Operated digital & offset printing machines producing ~500 print outputs per day.",
      "Edited prepress design files using CorelDRAW and Photoshop prior to printing.",
      "Handled quality control, finishing processes (cutting, laminating, binding), and equipment maintenance.",
    ],
  },
  {
    title: "Bachelor of Informatics Engineering (S1)",
    place: "STMIK Kaputama Binjai — Binjai, Indonesia",
    date: "In Progress",
    type: "Education",
    description:
      "Pursuing S1 degree focusing on software engineering, web & mobile technologies, database architectures, and IT infrastructure.",
  },
  {
    title: "Natural Sciences (IPA)",
    place: "SMA Negeri 5 Binjai — Binjai, Indonesia",
    date: "Jul 2018 – May 2021",
    type: "Education",
    description:
      "Graduated with Final Score: 97.14. Served as Chairman of Student Council (Ketua OSIS). Active in Scout Organization (Pramuka), English Club, and City-Level Science Olympiad (OSK Biologi).",
  },
];

/* ===== Projects ===== */
export type Project = {
  title: string;
  category: string;
  description: string;
  tech: string[];
  icon: typeof Code2;
};

export const projects: Project[] = [
  {
    title: "End-to-End Client Web & Mobile Platforms (250+ Projects)",
    category: "Full Stack Development",
    description:
      "Over 250 freelance web applications and mobile apps delivered with responsive UI/UX (React, Vue, Next.js, Kotlin), robust APIs (Node, Spring, Laravel), and automated cloud deployments.",
    tech: ["React", "Next.js", "Node.js", "PHP Laravel", "Java Spring", "PostgreSQL", "Firebase"],
    icon: Globe,
  },
  {
    title: "Network Equipment & Asset Management System",
    category: "Operations & Software",
    description:
      "Operational tracking system for 5,000+ network devices, inventory logging, serial number tracking, OSS data integration, and technician equipment dispatching.",
    tech: ["Java", "MySQL", "OSS Integration", "Data Logging", "Excel/SQL"],
    icon: Boxes,
  },
  {
    title: "AI Tools & Smart Workflow Integration",
    category: "AI & Innovation",
    description:
      "Custom workflow tools leveraging AI prompt engineering, data processing scripts, and modern developer tooling to optimize digital design and development pipelines.",
    tech: ["Python", "Prompt Engineering", "AI Tools", "REST API", "Tailwind CSS"],
    icon: Sparkles,
  },
  {
    title: "Data Analytics & Executive Dashboards",
    category: "Data Analysis",
    description:
      "Interactive analytics dashboards turning complex operational data and stock counts into clear visual metrics using Power BI, Tableau, Advanced Excel, and SQL queries.",
    tech: ["Power BI", "Tableau", "SQL", "Advanced Excel", "Data Processing"],
    icon: LineChart,
  },
];

/* ===== Core Competencies ===== */
export const competencies = [
  "Problem-Solving",
  "Communication & Negotiation",
  "Team Collaboration",
  "Time Management",
  "Attention to Detail",
  "Document & Administrative Management",
  "Analytical Thinking",
  "Adaptability",
  "Discipline & Reliability",
];

/* ===== Certificates ===== */
export type Certificate = {
  title: string;
  issuer: string;
  image?: string;
  file: string;
  type: "image" | "pdf";
};

export const certificates: Certificate[] = [
  {
    title: "Professional Certificate 1",
    issuer: "Issued credential",
    image: "/certificate-1.jpeg",
    file: "/certificate-1.jpeg",
    type: "image",
  },
  {
    title: "Professional Certificate 2",
    issuer: "Issued credential",
    file: "/certificate-2.pdf",
    type: "pdf",
  },
];

