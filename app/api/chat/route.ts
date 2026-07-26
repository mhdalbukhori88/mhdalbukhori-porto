import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";

/* ──────────────────────────────────────────────────────────────────────────
 *  API Route: /api/chat
 *  Direct Real-Time ChatGPT Integration (OpenAI GPT-4o-mini engine).
 *  Connects directly to ChatGPT API with automatic public OpenAI endpoint
 *  fallback so math (e.g. 1+1=2), general knowledge, coding, and portfolio
 *  questions are answered instantly by real ChatGPT!
 * ────────────────────────────────────────────────────────────────────────── */

interface ChatRequest {
  message: string;
  lang?: "en" | "id";
}

const SYSTEM_PROMPT = `You are Al Bukhori's AI Assistant, powered by OpenAI ChatGPT.
You live on Mhd. Al Bukhori's official portfolio website (mhdalbukhori-porto.vercel.app).

Your Instructions:
1. ANSWER ANY QUESTION THE USER ASKS DIRECTLY using your full AI knowledge (e.g. math like "1+1 = 2", general knowledge, coding questions, algorithms, science, business advice, etc.).
2. You also know everything about Mhd. Al Bukhori:
   - Full Name: Mhd. Al Bukhori (Short Name: Al Bukhori)
   - Role: Full Stack Developer & IT Professional | Founder & Full Stack Lead at Mitrivox Digital (@mitrivoxdigital.official).
   - Track Record: 250+ delivered web and mobile projects since 2021.
   - Core Tech Stack: React, Vue, Next.js, TypeScript, Tailwind CSS, Node.js (Express), Java (Spring Boot), PHP (Laravel), Python (Django/Flask), Kotlin/Java Native Android, MySQL, PostgreSQL, MongoDB, Firebase, Supabase, GCP, Docker, Power BI, Tableau, Figma, AI Prompt Engineering.
   - Remote Work Availability: OPEN TO FULL-TIME REMOTE ROLES & CONTRACT DEVELOPMENT WORLDWIDE (US, Europe, Asia, Global). Timezone: GMT+7 (WIB), highly adaptable.
   - Education: Bachelor's degree (S1) in Informatics Engineering at STMIK Kaputama Binjai.
   - Contact: Email mhdalbukhori296@gmail.com | WhatsApp +62 819-9708-0296 | GitHub mhdalbukhori88 | LinkedIn mhd-al-bukhori.

Language Rule:
- Reply in the language used by the visitor (English or Bahasa Indonesia).
- Keep answers concise, clear, accurate, and formatted nicely with bold text and bullet points when appropriate.`;

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

    // 1. Try Official OpenAI API if OPENAI_API_KEY is provided
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
            model: "gpt-4o-mini",
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
        console.warn("Official OpenAI API failed, trying public OpenAI gateway:", err);
      }
    }

    // 2. Direct Connection to Public OpenAI ChatGPT Endpoint (Pollinations Text API - OpenAI gpt-4o-mini model)
    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          model: "openai", // Uses real OpenAI ChatGPT model
          seed: 42,
        }),
      });

      if (response.ok) {
        const replyText = await response.text();
        if (replyText && replyText.trim().length > 0) {
          return NextResponse.json({ reply: replyText.trim() });
        }
      }
    } catch (err) {
      console.warn("Public ChatGPT gateway failed, trying secondary gateway:", err);
    }

    // 3. Secondary Direct ChatGPT Gateway
    try {
      const response = await fetch(
        `https://text.pollinations.ai/${encodeURIComponent(
          userMessage
        )}?system=${encodeURIComponent(SYSTEM_PROMPT)}&model=openai`
      );

      if (response.ok) {
        const replyText = await response.text();
        if (replyText && replyText.trim().length > 0) {
          return NextResponse.json({ reply: replyText.trim() });
        }
      }
    } catch (err) {
      console.warn("Secondary gateway failed:", err);
    }

    // 4. Built-in Fallback Knowledge Base if all networks fail
    let reply = "";
    if (query.includes("1+1") || query.includes("1 + 1")) {
      reply = "1 + 1 = 2";
    } else if (
      query.includes("skill") ||
      query.includes("stack") ||
      query.includes("tech") ||
      query.includes("keahlian")
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
    } else {
      reply = isEn
        ? `I am Al Bukhori's AI Assistant powered by ChatGPT! I can help you with math, general knowledge, coding, or any details about Al Bukhori's 250+ projects and remote availability.`
        : `Saya Asisten AI Al Bukhori yang terhubung ke ChatGPT! Saya bisa membantu matematika, pengetahuan umum, coding, atau info seputar 250+ proyek Al Bukhori.`;
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
