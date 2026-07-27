import { NextResponse } from "next/server";

/* ──────────────────────────────────────────────────────────────────────────
 *  API Route: /api/chat
 *  Ultra-Fast AI Assistant with Instant Knowledge Matcher (0ms latency)
 *  and 3.5s Timeout-Protected LLM Fallback.
 * ────────────────────────────────────────────────────────────────────────── */

interface ChatRequest {
  message: string;
  lang?: "en" | "id";
}

const SYSTEM_PROMPT = `You are Bukhori AI Executive, the official executive AI assistant for Mhd. Al Bukhori on his portfolio website (mhdalbukhori-porto.vercel.app).
Answer any question directly using full AI knowledge (math, coding, general advice, etc.).
You also know Al Bukhori (Founder & Full Stack Lead at Mitrivox Digital, 250+ delivered projects, STMIK Kaputama graduate, Tech Stack: React, Next.js, Vue, Node, Spring Boot, Laravel, Python, Kotlin/Java Android, PostgreSQL, MongoDB, Firebase, Supabase, GCP, Docker).
Reply concise, clear, and formatted nicely in the visitor's language (English or Indonesian).`;

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const userMessage = (body.message || "").trim();
    const query = userMessage.toLowerCase();

    // Determine language preference
    const isId =
      body.lang === "id" ||
      /(apa|siapa|bagaimana|berapa|dimana|tolong|mau|bisa|saya|kamu|halo|hai|selamat|kerja|proyek|pesan|harga|kontak|keahlian|pendidikan)/i.test(
        query
      );

    if (!userMessage) {
      return NextResponse.json({
        reply: isId ? "Silakan masukkan pesan." : "Please enter a message.",
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // 1. FAST-PATH INSTANT RESPONSES (0ms Latency for Common Queries)
    // ────────────────────────────────────────────────────────────────────────

    // Greetings
    if (/^(halo|hai|hello|hi|pagi|siang|sore|malam|hey|greetings|permisi)/i.test(query)) {
      return NextResponse.json({
        reply: isId
          ? `Halo! 👋 Saya **Bukhori AI Executive**, asisten AI resmi Mhd. Al Bukhori. Ada yang bisa saya bantu terkait **keahlian teknis**, **250+ proyek**, **Mitrivox Digital**, **layanan jasa**, atau **ketersediaan kerja remote**?`
          : `Hello! 👋 I am **Bukhori AI Executive**, the official AI concierge for Mhd. Al Bukhori. How can I assist you with his **technical skills**, **250+ delivered projects**, **Mitrivox Digital**, or **remote job availability**?`,
      });
    }

    // Technical Skills / Tech Stack
    if (
      /(skill|keahlian|stack|teknologi|framework|bahasa|frontend|backend|database|mobile|android|react|vue|node|spring|laravel|kotlin)/i.test(
        query
      )
    ) {
      return NextResponse.json({
        reply: isId
          ? `💻 **Keahlian Teknis & Tech Stack Utama Mhd. Al Bukhori:**\n\n` +
            `• **Frontend & Web:** React, Vue, Next.js, TypeScript, Tailwind CSS, Bootstrap.\n` +
            `• **Backend & APIs:** Node.js (Express), Java (Spring Boot), PHP (Laravel, CodeIgniter), Python (Django, Flask).\n` +
            `• **Mobile App Dev:** Native Android (Java, Kotlin), iOS.\n` +
            `• **Database & BaaS:** PostgreSQL, MySQL, MongoDB, Firebase, Supabase.\n` +
            `• **Cloud & DevOps:** Google Cloud Platform (GCP), Docker, Vercel, Netlify.\n` +
            `• **Data & Desain:** Power BI, Tableau, SQL, Figma, AI Prompt Engineering.`
          : `💻 **Mhd. Al Bukhori's Core Tech Stack:**\n\n` +
            `• **Frontend & Web:** React, Vue, Next.js, TypeScript, Tailwind CSS, Bootstrap.\n` +
            `• **Backend & APIs:** Node.js (Express), Java (Spring Boot), PHP (Laravel, CodeIgniter), Python (Django, Flask).\n` +
            `• **Mobile App Dev:** Native Android (Java, Kotlin), iOS.\n` +
            `• **Database & BaaS:** PostgreSQL, MySQL, MongoDB, Firebase, Supabase.\n` +
            `• **Cloud & DevOps:** Google Cloud Platform (GCP), Docker, Vercel, Netlify.\n` +
            `• **Data & Design:** Power BI, Tableau, SQL, Figma, AI Prompt Engineering.`,
      });
    }

    // 250+ Projects & Mitrivox Digital
    if (
      /(proyek|project|portofolio|mitrivox|250|karya|aplikasi|pengalaman|experience|track record)/i.test(
        query
      )
    ) {
      return NextResponse.json({
        reply: isId
          ? `🚀 **250+ Proyek Selesai & Mitrivox Digital:**\n\n` +
            `Al Bukhori adalah Pendiri & Full Stack Lead di **Mitrivox Digital** (@mitrivoxdigital.official).\n` +
            `Sejak 2021, ia telah menyelesaikan lebih dari 250 proyek web & mobile end-to-end untuk klien lokal maupun internasional, mulai dari sistem enterprise, e-commerce, hingga aplikasi mobile Android native.`
          : `🚀 **250+ Delivered Projects & Mitrivox Digital:**\n\n` +
            `Al Bukhori is the Founder & Full Stack Lead at **Mitrivox Digital** (@mitrivoxdigital.official).\n` +
            `Since 2021, he has delivered 250+ end-to-end web and mobile projects for global clients, ranging from enterprise systems and e-commerce to native Android apps.`,
      });
    }

    // Remote Work & Availability
    if (
      /(remote|full-time|fulltime|kerja remote|gmt\+7|lowongan|hire|rekrut)/i.test(
        query
      )
    ) {
      return NextResponse.json({
        reply: isId
          ? `🌐 **Ketersediaan Kerja Remote:**\n\n` +
            `Mhd. Al Bukhori **Terbuka untuk Peran Remote Full-Time & Pengembangan Kontrak** di seluruh dunia (AS, Eropa, Asia, Global).\n` +
            `• Zona Waktu: GMT+7 (WIB), sangat fleksibel dengan zona waktu global.\n` +
            `• Kolaborasi: Terbiasa dengan alur kerja remote asinkron, Git, Jira, Slack, & komunikasi profesional.`
          : `🌐 **Remote Work Availability:**\n\n` +
            `Mhd. Al Bukhori is **Open to Full-Time Remote Roles & Contract Development** worldwide (US, Europe, Asia, Global).\n` +
            `• Timezone: GMT+7 (WIB), highly adaptable to US/EU hours.\n` +
            `• Collaboration: Experienced in asynchronous remote workflows, Git, Jira, Slack, & clear documentation.`,
      });
    }

    // Order / Pricing / Proposal Services
    if (
      /(pesan|order|harga|biaya|tarif|jasa|buat|proposal|quote|kontrak|service)/i.test(
        query
      )
    ) {
      return NextResponse.json({
        reply: isId
          ? `📝 **Pemesanan Proyek / Konsultasi:**\n\n` +
            `Anda dapat mengajukan pemesanan proyek langsung melalui formulir di bagian **#order** pada website ini.\n` +
            `Atau hubungi via WhatsApp: **+62 819-9708-0296** / Email: **mhdalbukhori296@gmail.com** untuk penawaran khusus dan estimasi biaya.`
          : `📝 **Order a Project / Proposal:**\n\n` +
            `You can submit project requirements directly via the **#order** section on this website.\n` +
            `Or reach out via WhatsApp: **+62 819-9708-0296** / Email: **mhdalbukhori296@gmail.com** for a customized proposal and quote.`,
      });
    }

    // Contact Information
    if (
      /(kontak|contact|email|whatsapp|wa|telepon|hubungi|lokasi|alamat|binjai)/i.test(
        query
      )
    ) {
      return NextResponse.json({
        reply: isId
          ? `📬 **Informasi Kontak Mhd. Al Bukhori:**\n\n` +
            `• **Email:** mhdalbukhori296@gmail.com\n` +
            `• **WhatsApp / Telegram:** +62 819-9708-0296\n` +
            `• **LinkedIn:** linkedin.com/in/mhd-al-bukhori\n` +
            `• **GitHub:** github.com/mhdalbukhori88\n` +
            `• **Lokasi:** Binjai, Sumatera Utara, Indonesia (GMT+7)`
          : `📬 **Contact Mhd. Al Bukhori:**\n\n` +
            `• **Email:** mhdalbukhori296@gmail.com\n` +
            `• **WhatsApp / Telegram:** +62 819-9708-0296\n` +
            `• **LinkedIn:** linkedin.com/in/mhd-al-bukhori\n` +
            `• **GitHub:** github.com/mhdalbukhori88\n` +
            `• **Location:** Binjai, North Sumatra, Indonesia (GMT+7)`,
      });
    }

    // Education
    if (
      /(pendidikan|lulusan|kuliah|stmik|kaputama|s1|informatika|gelar|education)/i.test(
        query
      )
    ) {
      return NextResponse.json({
        reply: isId
          ? `🎓 **Latar Belakang Pendidikan:**\n\n` +
            `Mhd. Al Bukhori menyelesaikan pendidikan S1 Teknik Informatika di **STMIK Kaputama Binjai**.`
          : `🎓 **Education Background:**\n\n` +
            `Mhd. Al Bukhori holds a Bachelor's degree (S1) in Informatics Engineering from **STMIK Kaputama Binjai**.`,
      });
    }

    // Math evaluation (e.g., 1+1, 10*5)
    if (/^(\d+\s*[\+\-\*\/\^]\s*\d+)/.test(query)) {
      try {
        const mathExpr = query.match(/(\d+\s*[\+\-\*\/\^]\s*\d+)/)?.[0];
        if (mathExpr) {
          const sanitized = mathExpr.replace(/[^0-9\+\-\*\/\.]/g, "");
          const result = Function(`"use strict"; return (${sanitized})`)();
          return NextResponse.json({ reply: `${mathExpr} = ${result}` });
        }
      } catch {
        // ignore math parse error
      }
    }

    // ────────────────────────────────────────────────────────────────────────
    // 2. TIMEOUT-PROTECTED NETWORK LLM CALL (Max 3.5 Seconds Timeout)
    // ────────────────────────────────────────────────────────────────────────
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    // Option A: Official OpenAI API if key available
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
            max_tokens: 350,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return NextResponse.json({ reply });
        }
      } catch (err) {
        // Fallthrough on error or timeout
      }
    }

    // Option B: Public Pollinations Gateway with Timeout
    try {
      const response = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          model: "openai",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (response.ok) {
        const replyText = await response.text();
        if (replyText && replyText.trim().length > 0) {
          return NextResponse.json({ reply: replyText.trim() });
        }
      }
    } catch (err) {
      clearTimeout(timeoutId);
    }

    // ────────────────────────────────────────────────────────────────────────
    // 3. EFFICIENT INSTANT FALLBACK (Guarantees zero-hang experience)
    // ────────────────────────────────────────────────────────────────────────
    const fallbackReply = isId
      ? `Saya Asisten AI Al Bukhori. Al Bukhori adalah Full Stack Developer & Founder Mitrivox Digital dengan 250+ proyek web/mobile (React, Next.js, Node, Spring, Laravel, Kotlin). Ada yang ingin Anda tanyakan seputar portofolio atau jasa pengembangannya?`
      : `I am Al Bukhori's AI Assistant. Al Bukhori is a Full Stack Developer & Founder of Mitrivox Digital with 250+ delivered web/mobile projects (React, Next.js, Node, Spring, Laravel, Kotlin). Feel free to ask about his skills or remote availability!`;

    return NextResponse.json({ reply: fallbackReply });
  } catch (error) {
    return NextResponse.json({
      reply:
        "Terjadi kendala jaringan. Anda dapat langsung berkonsultasi via email ke mhdalbukhori296@gmail.com!",
    });
  }
}
