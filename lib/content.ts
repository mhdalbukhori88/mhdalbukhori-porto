// Structured content: skills, services, experience, certificates, projects.

import {
  Code2,
  Database,
  LineChart,
  Megaphone,
  Server,
  Layout,
  Wrench,
  Bot,
  Boxes,
  FileSpreadsheet,
  Globe,
  ShieldCheck,
} from "lucide-react";

export type SkillCategory = {
  title: string;
  icon: typeof Code2;
  skills: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend Development",
    icon: Layout,
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Next.js", "Tailwind CSS", "Responsive Design"],
  },
  {
    title: "Backend Development",
    icon: Server,
    skills: ["Node.js", "REST APIs", "PHP", "Authentication", "Server Logic", "API Integration"],
  },
  {
    title: "Programming Languages",
    icon: Code2,
    skills: ["Java", "Python", "JavaScript", "TypeScript", "PHP", "SQL"],
  },
  {
    title: "Databases",
    icon: Database,
    skills: ["MySQL", "PostgreSQL", "Database Design", "Query Optimization", "Data Modeling"],
  },
  {
    title: "Data Analysis",
    icon: LineChart,
    skills: ["Python (Pandas)", "Excel", "Data Processing", "Visualization", "Reporting", "Insights"],
  },
  {
    title: "Digital Marketing",
    icon: Megaphone,
    skills: ["Content Strategy", "Branding", "Audience Engagement", "SEO Basics", "Business Growth"],
  },
  {
    title: "AI & Tools",
    icon: Bot,
    skills: ["AI Tools", "Prompt Engineering", "Automation", "Troubleshooting", "Git & GitHub"],
  },
  {
    title: "Office & Operations",
    icon: FileSpreadsheet,
    skills: ["Microsoft Word", "Excel", "PowerPoint", "Documentation", "Workflow Coordination"],
  },
];

export type Service = {
  title: string;
  description: string;
  icon: typeof Code2;
  features: string[];
};

export const services: Service[] = [
  {
    title: "Website Development",
    description:
      "Custom websites for individuals, communities, and companies. Built end-to-end, front-end and back-end, fully responsive and fast.",
    icon: Globe,
    features: ["Company Profile", "Landing Pages", "Web Applications", "E-Commerce"],
  },
  {
    title: "Fullstack Engineering",
    description:
      "Complete web solutions from database design to user interface. I handle the entire stack so your project stays consistent and reliable.",
    icon: Code2,
    features: ["Frontend & Backend", "REST APIs", "Database Design", "Deployment"],
  },
  {
    title: "Data Analysis",
    description:
      "Turn raw data into clear, actionable insight using Python and SQL. Reports, dashboards, and data processing tailored to your needs.",
    icon: LineChart,
    features: ["Data Processing", "Reporting", "Visualization", "Insights"],
  },
  {
    title: "Digital Marketing",
    description:
      "Content strategy, branding, and audience engagement to grow your digital presence and convert visitors into customers.",
    icon: Megaphone,
    features: ["Content Strategy", "Branding", "SEO", "Growth"],
  },
  {
    title: "Maintenance & Support",
    description:
      "Website management, troubleshooting, and ongoing technical support to keep your digital products running smoothly.",
    icon: Wrench,
    features: ["Bug Fixing", "Updates", "Optimization", "Monitoring"],
  },
  {
    title: "Operations & Admin Tech",
    description:
      "Inventory control, stock opname, asset tracking, and document management systems backed by hands-on operational experience.",
    icon: Boxes,
    features: ["Inventory Systems", "Asset Tracking", "Documentation", "Workflows"],
  },
];

export type ExperienceItem = {
  role: string;
  org: string;
  period: string;
  description: string;
  current?: boolean;
};

export const experiences: ExperienceItem[] = [
  {
    role: "Freelance Web Developer, Software Engineer & Data Analyst",
    org: "Self-employed",
    period: "Present",
    description:
      "Building websites and digital solutions for clients end-to-end. Developing software, processing and analyzing data, and delivering solutions tailored to client needs across front-end and back-end.",
    current: true,
  },
  {
    role: "IT & Network Services / Operations",
    org: "Internet & Network Service Environment",
    period: "Experience",
    description:
      "Worked in warehouse management, inventory control, stock opname, logistics support, asset tracking, and equipment maintenance. Managed operational documents and coordinated workflows to support efficient business processes.",
  },
  {
    role: "Production, Warehouse & Administration",
    org: "Operational Roles",
    period: "Experience",
    description:
      "Hands-on experience in production, warehouse operations, and administration, building a strong foundation in process discipline, reliability, and teamwork.",
  },
];

export type EducationItem = {
  school: string;
  degree: string;
  period: string;
  description: string;
};

export const education: EducationItem[] = [
  {
    school: "STMIK Kaputama Binjai",
    degree: "Informatics Engineering (Computer Science)",
    period: "Currently enrolled",
    description:
      "Studying Informatics Engineering with focus on software development, databases, and computer science fundamentals.",
  },
];

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

export type Project = {
  title: string;
  category: string;
  description: string;
  tech: string[];
  icon: typeof Code2;
};

export const projects: Project[] = [
  {
    title: "Company Profile Website",
    category: "Web Development",
    description:
      "Responsive company profile site with a modern UI, content sections, and contact integration, built fullstack and deployment-ready.",
    tech: ["Next.js", "Tailwind CSS", "Node.js"],
    icon: Globe,
  },
  {
    title: "Inventory & Stock Management",
    category: "Fullstack App",
    description:
      "Web application for inventory control, stock opname, and asset tracking, inspired by real operational warehouse experience.",
    tech: ["Java", "MySQL", "REST API"],
    icon: Boxes,
  },
  {
    title: "Data Analysis Dashboard",
    category: "Data Analyst",
    description:
      "Data processing pipeline and reporting dashboard turning raw datasets into clear visual insights for decision-making.",
    tech: ["Python", "Pandas", "PostgreSQL"],
    icon: LineChart,
  },
  {
    title: "Business Landing Page",
    category: "Digital Marketing",
    description:
      "Conversion-focused landing page combining clean design, branding, and content strategy to drive audience engagement.",
    tech: ["Next.js", "SEO", "Tailwind CSS"],
    icon: Megaphone,
  },
];

export const valueProps = [
  {
    icon: Code2,
    title: "End-to-End Ownership",
    description: "Frontend and backend handled by one developer for consistent, reliable delivery.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable & Detail-Oriented",
    description: "Strong process discipline from real operational and administrative experience.",
  },
  {
    icon: Bot,
    title: "Modern & AI-Assisted",
    description: "Up-to-date with modern frameworks, AI tools, and prompt engineering workflows.",
  },
];
