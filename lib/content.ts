// Structured content adapted to the template layout:
// Expertise (3 cards), Career History (timeline), Projects, Certificates.

import {
  Code2,
  Database,
  LineChart,
  Megaphone,
  Globe,
  Boxes,
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
    title: "Fullstack Web Development",
    icon: Code2,
    description:
      "I build complete web applications from scratch, handling both front-end and back-end. From responsive interfaces to server logic and databases, I deliver the entire stack end-to-end.",
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind",
      "Node.js",
      "PHP",
      "REST API",
    ],
  },
  {
    title: "Software Engineering & Data",
    icon: Database,
    description:
      "Backed by Java and Python, I develop software and turn raw data into clear insight. I design databases, process data, and build reports and dashboards for better decisions.",
    stack: [
      "Java",
      "Python",
      "MySQL",
      "PostgreSQL",
      "Pandas",
      "Excel",
      "SQL",
      "Data Analysis",
    ],
  },
  {
    title: "Digital Marketing & AI",
    icon: Megaphone,
    description:
      "I help brands grow online with content strategy, branding, and audience engagement, and stay current by leveraging modern AI tools and prompt engineering in my workflow.",
    stack: [
      "Content Strategy",
      "Branding",
      "SEO",
      "AI Tools",
      "Prompt Engineering",
      "MS Office",
    ],
  },
];

/* ===== Career History timeline ===== */
export type TimelineItem = {
  title: string;
  place: string;
  date: string;
  description: string;
};

export const timeline: TimelineItem[] = [
  {
    title: "Freelance Web Developer & Software Engineer",
    place: "Self-employed",
    date: "Present",
    description:
      "Building websites and digital solutions for clients end-to-end — front-end, back-end, and data processing tailored to client needs.",
  },
  {
    title: "Data Analyst (Freelance)",
    place: "Remote",
    date: "Present",
    description:
      "Processing and analyzing data, building reports and visual insights using Python and SQL to support decision-making.",
  },
  {
    title: "IT & Network Services / Operations",
    place: "Internet & Network Service Environment",
    date: "Experience",
    description:
      "Warehouse management, inventory control, stock opname, asset tracking, equipment maintenance, and administrative operations.",
  },
  {
    title: "Informatics Engineering Student",
    place: "STMIK Kaputama Binjai",
    date: "Currently enrolled",
    description:
      "Studying Computer Science with focus on software development, databases, and computer science fundamentals.",
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
    title: "Company Profile Website",
    category: "Web Development",
    description:
      "Responsive company profile website with a modern UI, content sections, and contact integration. Built fullstack and deployment-ready.",
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
