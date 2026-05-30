// Central configuration for the portfolio. Edit these values to update
// content across the entire website.

export const siteConfig = {
  name: "Mhd Al Bukhori",
  shortName: "Al Bukhori",
  role: "Fullstack Web Developer",
  tagline:
    "Fullstack Web Developer, Software Engineer & Data Analyst building reliable digital solutions from front-end to back-end.",
  location: "Binjai, North Sumatra, Indonesia",
  availability: "Available for full-time roles & freelance projects",
  resumeUrl: "/cv-mhd-al-bukhori.pdf",
  profileImage: "/profile.jpeg",

  contact: {
    email: "mhdalbukhori026@gmail.com",
    phone: "+62 877-9019-9115",
    phoneRaw: "6287790199115", // for WhatsApp links (no +, no spaces)
    whatsappDisplay: "0877-9019-9115",
  },

  socials: {
    github: "https://github.com/mhdalbukhori88",
    linkedin: "https://www.linkedin.com/in/mhd-al-bukhori",
    instagram: "https://instagram.com/mhdalbukhori_",
    instagramHandle: "@mhdalbukhori_",
  },

  about: {
    summary:
      "Computer Science student at STMIK Kaputama Binjai majoring in Informatics Engineering, with experience in production, warehouse operations, administration, and information technology services. Currently working as a Freelance Web Developer, Software Engineer, and Data Analyst, focusing on website development, data processing, and digital solution development based on client needs.",
    extended:
      "Also interested in Digital Marketing, particularly in content strategy, branding, audience engagement, and digital business growth. Experienced in warehouse management, inventory control, stock opname, logistics support, asset tracking, equipment maintenance, and administrative operations within internet and network service environments. Skilled in managing operational documents, coordinating workflows, and supporting efficient business processes.",
    closing:
      "Proficient in Microsoft Office, Java, Python, MySQL, PostgreSQL, and data analysis tools. Also experienced in website management, troubleshooting, AI tools, and prompt engineering. Able to work independently or collaboratively with strong problem-solving, communication, teamwork, and time management skills. Passionate about technology, software development, data analysis, digital marketing, and continuous learning.",
  },

  stats: [
    { label: "Tech Disciplines", value: "4+" },
    { label: "Core Languages", value: "Java · Python · JS" },
    { label: "Databases", value: "MySQL · PostgreSQL" },
    { label: "Focus", value: "Fullstack & Data" },
  ],
};

export type SiteConfig = typeof siteConfig;
