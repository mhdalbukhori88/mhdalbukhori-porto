import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

/* ──────────────────────────────────────────────────────────────────────────
 *  API Route: /api/chat
 *  Intelligent AI assistant response handler for Al Bukhori's portfolio.
 *  Supports bilingual queries (English & Indonesian).
 * ────────────────────────────────────────────────────────────────────────── */

interface ChatRequest {
  message: string;
  lang?: "en" | "id";
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const query = (body.message || "").trim().toLowerCase();
    const isEn = body.lang === "en" || /[a-z]/i.test(query) && !/(apa|siapa|bagaimana|berapa|dimana|tolong|mau|bisa|saya|kamu)/i.test(query);

    let reply = "";

    // 1. Tech Stack / Skills query
    if (
      query.includes("skill") ||
      query.includes("stack") ||
      query.includes("tech") ||
      query.includes("keahlian") ||
      query.includes("kemampuan") ||
      query.includes("react") ||
      query.includes("node") ||
      query.includes("spring") ||
      query.includes("laravel")
    ) {
      reply = isEn
        ? `💻 **Mhd. Al Bukhori's Core Tech Stack:**\n\n` +
          `• **Frontend & Web:** React, Vue, Next.js, TypeScript, Tailwind CSS, Bootstrap.\n` +
          `• **Backend & APIs:** Node.js (Express), Java (Spring Boot), PHP (Laravel, CodeIgniter), Python (Django, Flask).\n` +
          `• **Mobile App Dev:** Native Android (Java, Kotlin), iOS.\n` +
          `• **Database & BaaS:** PostgreSQL, MySQL, MongoDB, Firebase, Supabase.\n` +
          `• **Cloud & DevOps:** Google Cloud Platform (GCP), Docker, Vercel, Netlify.\n` +
          `• **Data & Design:** Power BI, Tableau, SQL, Figma, Adobe XD, AI Prompt Engineering.`
        : `💻 **Keahlian Teknis & Tech Stack Utama Mhd. Al Bukhori:**\n\n` +
          `• **Frontend & Web:** React, Vue, Next.js, TypeScript, Tailwind CSS, Bootstrap.\n` +
          `• **Backend & API:** Node.js (Express), Java (Spring Boot), PHP (Laravel, CodeIgniter), Python (Django, Flask).\n` +
          `• **Pengembangan Mobile:** Native Android (Java, Kotlin), iOS.\n` +
          `• **Database & BaaS:** PostgreSQL, MySQL, MongoDB, Firebase, Supabase.\n` +
          `• **Cloud & DevOps:** Google Cloud Platform (GCP), Docker, Vercel, Netlify.\n` +
          `• **Data & Desain:** Power BI, Tableau, SQL, Figma, Adobe XD, AI Prompt Engineering.`;
    }
    // 2. Remote Work / Availability / Hire query
    else if (
      query.includes("remote") ||
      query.includes("hire") ||
      query.includes("job") ||
      query.includes("work") ||
      query.includes("role") ||
      query.includes("kerja") ||
      query.includes("rekrut") ||
      query.includes("karir") ||
      query.includes("lowongan")
    ) {
      reply = isEn
        ? `🌐 **Remote Work Availability:**\n\n` +
          `Yes! Al Bukhori is **actively open to Full-Time Remote Roles & Contract Development** for companies in the US, Europe, Asia, and globally.\n\n` +
          `• **Timezone:** GMT+7 (WIB) — adaptable for overlapping US/EU business hours.\n` +
          `• **Experience:** 250+ delivered projects with proven asynchronous communication and Git workflow.\n` +
          `• **Role Types:** Full Stack Lead, Senior Frontend Developer, Backend Engineer, Mobile Developer.\n\n` +
          `📬 Contact directly via email: **${siteConfig.contact.email}** or WhatsApp: **${siteConfig.contact.phone}**.`
        : `🌐 **Ketersediaan Kerja Remote:**\n\n` +
          `Ya! Al Bukhori **sangat terbuka untuk Posisi Remote Purna Waktu (Full-Time Remote) & Proyek Kontrak** bagi perusahaan domestik maupun mancanegara (AS, Eropa, Asia).\n\n` +
          `• **Zona Waktu:** GMT+7 (WIB) — fleksibel untuk komunikasi jam kerja global.\n` +
          `• **Pengalaman:** 250+ proyek sukses dengan standar alur kerja Git & komunikasi asinkron.\n` +
          `• **Posisi:** Full Stack Lead, Frontend Engineer, Backend Developer, Mobile App Developer.\n\n` +
          `📬 Kontak langsung via Email: **${siteConfig.contact.email}** atau WhatsApp: **${siteConfig.contact.phone}**.`;
    }
    // 3. Mitrivox Digital / Software House / 250+ Projects query
    else if (
      query.includes("mitrivox") ||
      query.includes("software house") ||
      query.includes("project") ||
      query.includes("proyek") ||
      query.includes("250") ||
      query.includes("portfolio") ||
      query.includes("portofolio")
    ) {
      reply = isEn
        ? `🚀 **Mitrivox Digital & Track Record:**\n\n` +
          `Al Bukhori is the **Founder & Full Stack Lead at Mitrivox Digital** (${siteConfig.socials.softwareHouse.handle}).\n\n` +
          `Since 2021, he has successfully delivered **250+ web and mobile applications**, including e-commerce platforms, SaaS web apps, enterprise dashboards, and mobile solutions.\n\n` +
          `🔗 Visit Instagram: [Mitrivox Digital](${siteConfig.socials.softwareHouse.url})`
        : `🚀 **Mitrivox Digital & Rekam Jejak Proyek:**\n\n` +
          `Al Bukhori adalah **Founder & Full Stack Lead di Mitrivox Digital** (${siteConfig.socials.softwareHouse.handle}).\n\n` +
          `Sejak 2021, beliau telah menyelesaikan **250+ proyek aplikasi web dan mobile**, termasuk platform e-commerce, web app SaaS, dashboard perusahaan, dan aplikasi mobile.\n\n` +
          `🔗 Kunjungi Instagram: [Mitrivox Digital](${siteConfig.socials.softwareHouse.url})`;
    }
    // 4. Order / Pricing / Quote query
    else if (
      query.includes("order") ||
      query.includes("pesan") ||
      query.includes("harga") ||
      query.includes("price") ||
      query.includes("cost") ||
      query.includes("biaya") ||
      query.includes("quote") ||
      query.includes("proposal")
    ) {
      reply = isEn
        ? `📋 **How to Order a Project / Get a Quote:**\n\n` +
          `You can easily submit your project requirements using the **Order Form** section on this website, or reach out directly:\n\n` +
          `1. Scroll to the **Order** section on this site\n` +
          `2. Fill in your project type, budget estimate, and target timeline\n` +
          `3. Or chat directly via WhatsApp: **${siteConfig.contact.phone}**\n\n` +
          `We offer flexible pricing options ranging from landing pages to custom full-stack enterprise solutions!`
        : `📋 **Cara Pemesanan Proyek & Estimasi Harga:**\n\n` +
          `Anda dapat dengan mudah mengirimkan spesifikasi proyek Anda melalui **Formulir Pesanan (Order Form)** di website ini, atau menghubungi langsung:\n\n` +
          `1. Gulir ke bagian **Order** di website ini\n` +
          `2. Isi jenis proyek, estimasi anggaran, dan target pengerjaan\n` +
          `3. Atau hubungi via WhatsApp: **${siteConfig.contact.phone}**\n\n` +
          `Mitrivox Digital melayani pengerjaan landing page, sistem web kustom, aplikasi mobile, hingga solusi enterprise full-stack!`;
    }
    // 5. Contact / Socials query
    else if (
      query.includes("contact") ||
      query.includes("email") ||
      query.includes("whatsapp") ||
      query.includes("kontak") ||
      query.includes("hubungi") ||
      query.includes("lokasi") ||
      query.includes("location")
    ) {
      reply = isEn
        ? `📬 **Contact Information:**\n\n` +
          `• **Email:** ${siteConfig.contact.email}\n` +
          `• **WhatsApp:** ${siteConfig.contact.phone}\n` +
          `• **Location:** ${siteConfig.location}\n` +
          `• **GitHub:** ${siteConfig.socials.github}\n` +
          `• **LinkedIn:** ${siteConfig.socials.linkedin}\n` +
          `• **Mitrivox Digital:** ${siteConfig.socials.softwareHouse.url}`
        : `📬 **Informasi Kontak:**\n\n` +
          `• **Email:** ${siteConfig.contact.email}\n` +
          `• **WhatsApp:** ${siteConfig.contact.phone}\n` +
          `• **Lokasi:** ${siteConfig.location}\n` +
          `• **GitHub:** ${siteConfig.socials.github}\n` +
          `• **LinkedIn:** ${siteConfig.socials.linkedin}\n` +
          `• **Mitrivox Digital:** ${siteConfig.socials.softwareHouse.url}`;
    }
    // Default Fallback
    else {
      reply = isEn
        ? `👋 **Hello! I'm Al Bukhori's AI Portfolio Assistant.**\n\n` +
          `I can help you explore:\n` +
          `1. **Technical Skills** (React, Next.js, Node, Java Spring, Laravel, Kotlin)\n` +
          `2. **250+ Delivered Projects & Mitrivox Digital**\n` +
          `3. **Remote Job Hiring & Availability**\n` +
          `4. **Project Ordering & Custom Quotes**\n\n` +
          `Feel free to ask a specific question or select one of the suggested prompts below!`
        : `👋 **Halo! Saya Asisten Portofolio AI Al Bukhori.**\n\n` +
          `Saya dapat membantu Anda mengeksplorasi:\n` +
          `1. **Keahlian Teknis** (React, Next.js, Node, Java Spring, Laravel, Kotlin)\n` +
          `2. **250+ Proyek Selesai & Mitrivox Digital**\n` +
          `3. **Perekrutan Kerjasama Remote (Full-Time/Contract)**\n` +
          `4. **Pemesanan Proyek & Estimasi Harga**\n\n` +
          `Silakan ajukan pertanyaan atau pilih salah satu tombol saran di bawah ini!`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { reply: "Sorry, I encountered an issue processing your message. Please try again or email mhdalbukhori296@gmail.com directly!" },
      { status: 500 }
    );
  }
}
