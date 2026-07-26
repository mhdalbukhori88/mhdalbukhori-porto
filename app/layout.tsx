import type { Metadata } from "next";
import { Lato, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import AIChatWidget from "@/components/AIChatWidget";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} | ${siteConfig.role}`,
  description: siteConfig.tagline,
  keywords: [
    "Software Engineer",
    "Full Stack Developer",
    "AI Enthusiast",
    "UI/UX Designer",
    "Figma Designer",
    "Fullstack Web Developer",
    "AI Integration",
    "Mhd Al Bukhori",
    "Next.js Developer",
    "TypeScript Developer",
    "Software Engineer Indonesia",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.tagline,
    type: "website",
    locale: "id_ID",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.variable} ${mono.variable} theme-dark dark`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <AIChatWidget />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
