import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

/* ──────────────────────────────────────────────────────────────────────────
 *  API Route: /api/chat
 *  Multi-LLM Integration (OpenAI ChatGPT / Anthropic Claude / Gemini API)
 *  with built-in portfolio knowledge base & graceful fallback.
 * ────────────────────────────────────────────────────────────────────────── */

interface ChatRequest {
  message: string;
  lang?: "en" | "id";
}

const SYSTEM_PROMPT = `You are an intelligent, friendly, and highly capable AI Assistant on Mhd. Al Bukhori's official portfolio website (mhdalbukhori-porto.vercel.app).

Primary Identity & Mission:
- You represent Mhd. Al Bukhori (Founder & Full Stack Lead at Mitrivox Digital) to recruiters, international remote job employers, and software clients worldwide.
- You answer questions about Al Bukhori's technical skills, 250+ delivered projects, software house services, pricing, contact, and global remote job availability.
- CRITICAL: YOU ARE ALSO FULLY CAPABLE OF ANSWERING GENERAL KNOWLEDGE, CODING, SOFTWARE ARCHITECTURE, AND OUT-OF-CONTEXT QUESTIONS (e.g., explaining algorithms, debugging code, tech advice, writing code snippets, general world facts, etc.).

Al Bukhori's Key Profile Data:
- Full Name: Mhd. Al Bukhori (Short Name: Al Bukhori)
- Current Role: Full Stack Developer & IT Professional | Founder & Full Stack Lead at Mitrivox Digital (@mitrivoxdigital.official)
- Track Record: 250+ delivered web & mobile projects since 2021.
- Core Stack: React, Vue, Next.js, TypeScript, Tailwind CSS, Node.js (Express), Java (Spring Boot), PHP (Laravel), Python (Django/Flask), Kotlin/Java Native Android, MySQL, PostgreSQL, MongoDB, Firebase, Supabase, GCP, Docker, Power BI, Tableau, SQL, Figma, AI Prompt Engineering.
- Remote Work Status: OPEN TO FULL-TIME REMOTE ROLES & CONTRACT DEVELOPMENT WORLDWIDE (US, Europe, Asia, Global). Timezone: GMT+7 (WIB), adaptable for global business hours.
- Education: Bachelor's degree (S1) in Informatics Engineering at STMIK Kaputama Binjai.
- Contact: Email mhdalbukhori296@gmail.com | WhatsApp +62 819-9708-0296 | GitHub: mhdalbukhori88 | LinkedIn: mhd-al-bukhori.

Language Guidelines:
- If the user messages in English, reply in fluent professional English.
- If the user messages in Bahasa Indonesia, reply in friendly professional Bahasa Indonesia.
- Use clear formatting with bold text and bullet points when appropriate.`;

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const userMessage = (body.message || "").trim();
    const query = userMessage.toLowerCase();
    const isEn =
      body.lang === "en" ||
      (/[a-z]/i.test(query) &&
        !/(apa|siapa|bagaimana|berapa|dimana|tolong|mau|bisa|saya|kamu)/i.test(
          query
        ));

    if (!userMessage) {
      return NextResponse.json({ reply: "Please enter a message." });
    }

    // 1. Try OpenAI ChatGPT API (if OPENAI_API_KEY is configured)
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // or gpt-3.5-turbo
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 600,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (err) {
        console.warn("OpenAI API call failed, falling back to built-in engine:", err);
      }
    }

    // 2. Try Anthropic Claude API (if ANTHROPIC_API_KEY is configured)
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-5-haiku-20241022",
            max_tokens: 600,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userMessage }],
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.content?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (err) {
        console.warn("Anthropic API call failed, falling back to built-in engine:", err);
      }
    }

    // 3. Try Gemini API (if GEMINI_API_KEY is configured)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}` },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to built-in engine:", err);
      }
    }

    // 4. Built-in Smart Knowledge Base Engine (Fallback & Instant Response)
    let reply = "";

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
    } else if (
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
    } else if (
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
    } else if (
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
    } else if (
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
    } else {
      reply = isEn
        ? `💡 **Al Bukhori's AI Assistant:**\n\n` +
          `I am equipped to answer questions about **Al Bukhori's portfolio** (250+ projects, React, Next.js, Node, Spring, Laravel, Kotlin, remote hiring) as well as **general coding, tech concepts, and software architecture**!\n\n` +
          `Feel free to ask your question or try one of the quick prompt buttons below.`
        : `💡 **Asisten AI Al Bukhori:**\n\n` +
          `Saya dapat membantu menjawab pertanyaan seputar **portofolio Al Bukhori** (250+ proyek, React, Next.js, Node, Spring, Laravel, Kotlin, rekrutmen remote) maupun **pengetahuan umum, pengkodean (coding), dan arsitektur perangkat lunak**!\n\n` +
          `Silakan ajukan pertanyaan Anda atau gunakan tombol pertanyaan di bawah.`;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      {
        reply:
          "Sorry, I encountered an issue processing your message. Please try again or email mhdalbukhori296@gmail.com directly!",
      },
      { status: 500 }
    );
  }
}
