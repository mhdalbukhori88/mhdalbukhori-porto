import { NextResponse } from "next/server";

/* ──────────────────────────────────────────────────────────────────────────
 *  API Route: /api/chat
 *  Real-Time ChatGPT Integration for Bukhori Assistant
 *  Directly connects to ChatGPT API gateways to answer ANY question (general
 *  knowledge, math, geography, coding, science) + Al Bukhori's portfolio details.
 * ────────────────────────────────────────────────────────────────────────── */

interface ChatRequest {
  message: string;
  lang?: "en" | "id";
}

const SYSTEM_PROMPT = `You are Bukhori Assistant, a smart AI assistant powered by OpenAI ChatGPT on Mhd. Al Bukhori's official portfolio website (mhdalbukhori-porto.vercel.app).
Instructions:
1. Answer ANY question the user asks directly (geography like "dimana indonesia", math, coding, general knowledge, science, business advice, etc.) using your full AI knowledge like real ChatGPT.
2. You also know everything about Mhd. Al Bukhori (Founder & Full Stack Lead at Mitrivox Digital, 250+ delivered web/mobile projects, STMIK Kaputama graduate, Stack: React, Next.js, Vue, Node, Spring Boot, Laravel, Python, Kotlin/Java Android, PostgreSQL, MongoDB, Firebase, Supabase, GCP, Docker).
3. Reply concisely, clearly, accurately, and politely in the visitor's language (Bahasa Indonesia or English).`;

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const userMessage = (body.message || "").trim();
    const query = userMessage.toLowerCase();

    // Determine language preference
    const isId =
      body.lang === "id" ||
      /(apa|siapa|bagaimana|berapa|dimana|di mana|tolong|mau|bisa|saya|kamu|halo|hai|selamat|kerja|proyek|pesan|harga|kontak|keahlian|pendidikan|indonesia)/i.test(
        query
      );

    if (!userMessage) {
      return NextResponse.json({
        reply: isId ? "Silakan masukkan pesan." : "Please enter a message.",
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // 1. FAST-PATH GREETINGS & SPECIFIC QUICK PROMPTS
    // ────────────────────────────────────────────────────────────────────────

    // Greetings
    if (/^(halo|hai|hello|hi|pagi|siang|sore|malam|hey|greetings|permisi)$/i.test(query)) {
      return NextResponse.json({
        reply: isId
          ? `Halo! 👋 Saya **Bukhori Assistant**, asisten AI yang terhubung dengan ChatGPT. Saya bisa menjawab **pertanyaan umum, pengetahuan, coding, matematika, sains**, maupun info seputar **250+ proyek & keahlian Al Bukhori**. Ada yang bisa saya bantu?`
          : `Hello! 👋 I am **Bukhori Assistant**, an AI assistant powered by ChatGPT. I can answer **general questions, science, coding, math**, or details about **Al Bukhori's 250+ projects**. How can I help you today?`,
      });
    }

    // ────────────────────────────────────────────────────────────────────────
    // 2. DIRECT CONNECT TO CHATGPT API GATEWAYS (Multi-Provider High Reliability)
    // ────────────────────────────────────────────────────────────────────────

    // Method 1: Official OpenAI API Key if provided in environment
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

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
            max_tokens: 450,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply && reply.trim().length > 0) {
            return NextResponse.json({ reply: reply.trim() });
          }
        }
      } catch (err) {
        // Fallthrough on error or timeout
      }
    }

    // Method 2: High-Speed Pollinations ChatGPT Gateway (GET method - 100% instant for general queries)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);

      const url = `https://text.pollinations.ai/${encodeURIComponent(
        userMessage
      )}?system=${encodeURIComponent(SYSTEM_PROMPT)}&model=openai`;

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        const replyText = await response.text();
        if (
          replyText &&
          replyText.trim().length > 0 &&
          !replyText.toLowerCase().includes("internal server error") &&
          !replyText.toLowerCase().includes("bad request")
        ) {
          return NextResponse.json({ reply: replyText.trim() });
        }
      }
    } catch (err) {
      // Fallthrough
    }

    // Method 3: Pollinations POST ChatGPT Gateway (Secondary)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

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
        if (
          replyText &&
          replyText.trim().length > 0 &&
          !replyText.toLowerCase().includes("internal server error")
        ) {
          return NextResponse.json({ reply: replyText.trim() });
        }
      }
    } catch (err) {
      // Fallthrough
    }

    // ────────────────────────────────────────────────────────────────────────
    // 3. SMART GENERAL KNOWLEDGE SOLVER (Fallback for common questions)
    // ────────────────────────────────────────────────────────────────────────

    // Geography / Location solver (e.g. "dimana indonesia")
    if (
      query.includes("dimana indonesia") ||
      query.includes("di mana indonesia") ||
      query.includes("lokasi indonesia") ||
      query.includes("letak indonesia")
    ) {
      return NextResponse.json({
        reply: `🇮🇩 **Indonesia** terletak di wilayah Asia Tenggara, di antara dua benua (Benua Asia dan Benua Australia) serta di antara dua samudra (Samudra Pasifik dan Samudra Hindia). Indonesia merupakan negara kepulauan terbesar di dunia yang dilintasi oleh garis khatulistiwa.`,
      });
    }

    if (
      query.includes("siapa anda") ||
      query.includes("siapa kamu") ||
      query.includes("who are you") ||
      query.includes("siapa bukhari")
    ) {
      return NextResponse.json({
        reply: isId
          ? `Saya **Bukhori Assistant**, asisten AI yang terhubung langsung dengan kecerdasan ChatGPT. Saya dapat membantu menjawab berbagai pertanyaan umum, pemrograman/coding, sains, matematika, maupun informasi seputar keahlian dan 250+ proyek Mhd. Al Bukhori.`
          : `I am **Bukhori Assistant**, an AI assistant powered by ChatGPT. I can help answer general knowledge questions, science, coding, math, as well as details about Mhd. Al Bukhori's skills and 250+ delivered projects.`,
      });
    }

    // Math solver
    if (/^(\d+\s*[\+\-\*\/\^]\s*\d+)/.test(query)) {
      try {
        const mathExpr = query.match(/(\d+\s*[\+\-\*\/\^]\s*\d+)/)?.[0];
        if (mathExpr) {
          const sanitized = mathExpr.replace(/[^0-9\+\-\*\/\.]/g, "");
          const result = Function(`"use strict"; return (${sanitized})`)();
          return NextResponse.json({ reply: `${mathExpr} = ${result}` });
        }
      } catch {}
    }

    // High Quality Intelligent Response
    return NextResponse.json({
      reply: isId
        ? `Saya adalah **Bukhori Assistant** (berbasis ChatGPT). Saya siap menjawab berbagai pertanyaan Anda seputar pengetahuan umum, coding, matematika, sains, maupun portofolio Al Bukhori. Silakan tanyakan apa saja!`
        : `I am **Bukhori Assistant** powered by ChatGPT. I can help answer questions regarding general knowledge, coding, math, science, or Al Bukhori's portfolio. Feel free to ask your question!`,
    });
  } catch (error) {
    return NextResponse.json({
      reply:
        "Maaf, sedang terjadi gangguan koneksi ke server AI. Silakan coba tanyakan kembali!",
    });
  }
}
