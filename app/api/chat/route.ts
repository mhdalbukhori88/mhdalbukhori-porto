import { NextResponse } from "next/server";

/* ──────────────────────────────────────────────────────────────────────────
 *  API Route: /api/chat
 *  Bukhori Assistant — Powered by Google Gemini AI (Free) + Smart Fallback
 *  Answers ANY question like ChatGPT: science, math, geography, coding, etc.
 * ────────────────────────────────────────────────────────────────────────── */

interface ChatRequest {
  message: string;
  lang?: "en" | "id";
}

const SYSTEM_PROMPT = `You are Bukhori Assistant, a smart AI assistant on Mhd. Al Bukhori's portfolio website.
IMPORTANT RULES:
1. Answer ANY question the user asks using your FULL knowledge — geography, science, math, coding, history, business, health, technology, philosophy, etc. Be as helpful and accurate as ChatGPT.
2. You also know Al Bukhori: Founder & Full Stack Lead at Mitrivox Digital, 250+ delivered projects, STMIK Kaputama graduate, Stack: React, Next.js, Vue, Node, Spring Boot, Laravel, Python, Kotlin/Java Android, PostgreSQL, MongoDB, Firebase, Supabase, GCP, Docker.
3. Reply concisely, clearly, and politely in the user's language (Bahasa Indonesia or English).
4. Use markdown formatting: **bold** for emphasis, bullet points for lists.
5. NEVER refuse to answer general knowledge questions. You are a full AI assistant, not just a portfolio bot.`;

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const userMessage = (body.message || "").trim();
    const query = userMessage.toLowerCase();

    const isId =
      body.lang === "id" ||
      /(apa|siapa|bagaimana|berapa|dimana|di mana|tolong|mau|bisa|saya|kamu|halo|hai|selamat|kerja|proyek|pesan|harga|kontak|keahlian|pendidikan|indonesia|jelaskan|ceritakan|mengapa|kenapa)/i.test(
        query
      );

    if (!userMessage) {
      return NextResponse.json({
        reply: isId ? "Silakan masukkan pesan." : "Please enter a message.",
      });
    }

    // ── 1. QUICK GREETINGS (instant) ──
    if (/^(halo|hai|hello|hi|hey|yo)[\s!?.]*$/i.test(query)) {
      return NextResponse.json({
        reply: isId
          ? `Halo! 👋 Saya **Bukhori Assistant**, asisten AI cerdas yang bisa menjawab **segala pertanyaan** — pengetahuan umum, sains, coding, matematika, dan info portofolio Al Bukhori. Silakan tanya apa saja!`
          : `Hello! 👋 I'm **Bukhori Assistant**, a smart AI that can answer **any question** — general knowledge, science, coding, math, and Al Bukhori's portfolio info. Ask me anything!`,
      });
    }

    // ── 2. MATH SOLVER (instant) ──
    if (/^\d+\s*[\+\-\*\/\%\^]\s*\d+/.test(query)) {
      try {
        const expr = query.match(/[\d\+\-\*\/\%\.\s\(\)]+/)?.[0] || "";
        const sanitized = expr.replace(/[^0-9\+\-\*\/\%\.\(\)\s]/g, "");
        const result = Function(`"use strict"; return (${sanitized})`)();
        return NextResponse.json({ reply: `🔢 **${sanitized.trim()}** = **${result}**` });
      } catch {}
    }

    // ── 3. GOOGLE GEMINI AI (Free Tier — Primary AI Engine) ──
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [{ parts: [{ text: userMessage }] }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
              },
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply && reply.trim().length > 0) {
            return NextResponse.json({ reply: reply.trim() });
          }
        }
      } catch {
        // Fallthrough to OpenAI or fallback
      }
    }

    // ── 4. OPENAI API (Optional — if OPENAI_API_KEY is set) ──
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

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
      } catch {
        // Fallthrough
      }
    }

    // ── 5. COMPREHENSIVE SMART KNOWLEDGE BASE (Fallback — always works) ──
    const smartReply = getSmartReply(query, isId);
    if (smartReply) {
      return NextResponse.json({ reply: smartReply });
    }

    // ── 6. FINAL GENERIC FALLBACK ──
    return NextResponse.json({
      reply: isId
        ? `Terima kasih atas pertanyaannya! Saat ini koneksi ke server AI sedang terganggu. Silakan coba lagi dalam beberapa saat, atau tanyakan seputar **keahlian teknis**, **proyek**, atau **layanan** Al Bukhori yang bisa saya jawab langsung!`
        : `Thanks for your question! The AI server connection is currently experiencing issues. Please try again shortly, or ask about Al Bukhori's **skills**, **projects**, or **services** which I can answer instantly!`,
    });
  } catch {
    return NextResponse.json({
      reply: "Maaf, terjadi kendala teknis. Silakan coba lagi!",
    });
  }
}

/* ──────────────────────────────────────────────────────────────────────────
 *  Smart Knowledge Base — Comprehensive built-in answers
 *  Covers: Science, Geography, Math, Technology, Al Bukhori Portfolio
 * ────────────────────────────────────────────────────────────────────────── */

function getSmartReply(query: string, isId: boolean): string | null {
  // ── SCIENCE ──
  if (/(apa itu molekul|what is a molecule|molekul)/i.test(query)) {
    return isId
      ? `🔬 **Molekul** adalah partikel terkecil dari suatu senyawa yang masih memiliki sifat kimia senyawa tersebut. Molekul terdiri dari dua atau lebih atom yang terikat bersama melalui ikatan kimia.\n\n• Contoh: Molekul air (H₂O) terdiri dari 2 atom Hidrogen dan 1 atom Oksigen.\n• Contoh: Molekul oksigen (O₂) terdiri dari 2 atom Oksigen.`
      : `🔬 A **molecule** is the smallest particle of a substance that retains the chemical properties of that substance. It consists of two or more atoms bonded together.\n\n• Example: Water (H₂O) = 2 Hydrogen + 1 Oxygen atoms.\n• Example: Oxygen gas (O₂) = 2 Oxygen atoms.`;
  }

  if (/(apa itu atom|what is an atom|atom)/i.test(query)) {
    return isId
      ? `⚛️ **Atom** adalah unit dasar materi yang membentuk unsur kimia. Atom terdiri dari:\n\n• **Proton** (bermuatan positif) — di inti atom\n• **Neutron** (netral) — di inti atom\n• **Elektron** (bermuatan negatif) — mengorbit inti atom\n\nAtom sangat kecil, berukuran sekitar 0.1 nanometer.`
      : `⚛️ An **atom** is the basic unit of matter. It consists of:\n\n• **Protons** (positive charge) — in the nucleus\n• **Neutrons** (neutral) — in the nucleus\n• **Electrons** (negative charge) — orbiting the nucleus\n\nAtoms are incredibly small, about 0.1 nanometers in diameter.`;
  }

  if (/(apa itu dna|what is dna)/i.test(query)) {
    return isId
      ? `🧬 **DNA (Deoxyribonucleic Acid)** adalah molekul yang menyimpan instruksi genetik untuk perkembangan, fungsi, pertumbuhan, dan reproduksi semua makhluk hidup. DNA memiliki struktur **double helix** (heliks ganda) yang ditemukan oleh Watson & Crick pada tahun 1953.`
      : `🧬 **DNA (Deoxyribonucleic Acid)** is the molecule that carries genetic instructions for development, functioning, growth, and reproduction of all living organisms. It has a **double helix** structure, discovered by Watson & Crick in 1953.`;
  }

  if (/(apa itu sel|what is a cell|sel biologi)/i.test(query)) {
    return isId
      ? `🦠 **Sel** adalah unit struktural dan fungsional terkecil dari makhluk hidup. Sel terdiri dari:\n\n• **Membran sel** — pelindung luar sel\n• **Sitoplasma** — cairan di dalam sel\n• **Inti sel (Nukleus)** — pusat kontrol yang menyimpan DNA\n• **Mitokondria** — pembangkit energi sel\n\nAda dua jenis utama: **Sel Prokariotik** (bakteri) dan **Sel Eukariotik** (hewan, tumbuhan).`
      : `🦠 A **cell** is the smallest structural and functional unit of life. Key components:\n\n• **Cell membrane** — outer boundary\n• **Cytoplasm** — internal fluid\n• **Nucleus** — control center with DNA\n• **Mitochondria** — energy powerhouse\n\nTwo main types: **Prokaryotic** (bacteria) and **Eukaryotic** (animals, plants).`;
  }

  if (/(apa itu fotosintesis|photosynthesis)/i.test(query)) {
    return isId
      ? `🌿 **Fotosintesis** adalah proses di mana tumbuhan mengubah sinar matahari, air (H₂O), dan karbon dioksida (CO₂) menjadi glukosa (C₆H₁₂O₆) dan oksigen (O₂).\n\n**Rumus:** 6CO₂ + 6H₂O + Cahaya → C₆H₁₂O₆ + 6O₂\n\nProses ini terjadi di **kloroplas** yang mengandung pigmen hijau **klorofil**.`
      : `🌿 **Photosynthesis** is the process by which plants convert sunlight, water (H₂O), and carbon dioxide (CO₂) into glucose (C₆H₁₂O₆) and oxygen (O₂).\n\n**Formula:** 6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂\n\nThis occurs in **chloroplasts** containing the green pigment **chlorophyll**.`;
  }

  if (/(apa itu gravitasi|what is gravity|gravitasi)/i.test(query)) {
    return isId
      ? `🍎 **Gravitasi** adalah gaya tarik-menarik antara dua benda yang memiliki massa. Semakin besar massa benda, semakin kuat gaya gravitasinya.\n\n• Ditemukan oleh **Sir Isaac Newton** (1687)\n• Rumus: **F = G × (m₁ × m₂) / r²**\n• Gravitasi bumi: **9.8 m/s²**\n• Gravitasi membuat planet mengorbit matahari dan kita tetap di permukaan bumi.`
      : `🍎 **Gravity** is the force of attraction between two objects with mass. The greater the mass, the stronger the gravitational pull.\n\n• Discovered by **Sir Isaac Newton** (1687)\n• Formula: **F = G × (m₁ × m₂) / r²**\n• Earth's gravity: **9.8 m/s²**\n• Gravity keeps planets orbiting the sun and us on Earth's surface.`;
  }

  // ── GEOGRAPHY ──
  if (/(dimana indonesia|di mana indonesia|where is indonesia|letak indonesia|lokasi indonesia)/i.test(query)) {
    return `🇮🇩 **Indonesia** terletak di **Asia Tenggara**, di antara dua benua (**Asia** dan **Australia**) serta dua samudra (**Pasifik** dan **Hindia**). Indonesia adalah negara kepulauan terbesar di dunia dengan **17.508 pulau**, dilintasi oleh **garis khatulistiwa**.\n\n• **Ibu kota:** Jakarta (sedang berpindah ke Nusantara, Kalimantan Timur)\n• **Luas:** ~1.905.000 km²\n• **Populasi:** ~275 juta jiwa`;
  }

  if (/(ibu kota|capital of|ibukota)/i.test(query)) {
    if (/(indonesia)/i.test(query)) return `🇮🇩 Ibu kota Indonesia saat ini adalah **Jakarta**. Ibu kota baru yang sedang dibangun adalah **Nusantara** di Kalimantan Timur.`;
    if (/(jepang|japan)/i.test(query)) return `🇯🇵 Ibu kota Jepang adalah **Tokyo**.`;
    if (/(amerika|usa|united states)/i.test(query)) return `🇺🇸 Ibu kota Amerika Serikat adalah **Washington, D.C.**`;
    if (/(inggris|england|uk|united kingdom)/i.test(query)) return `🇬🇧 Ibu kota Inggris/United Kingdom adalah **London**.`;
    if (/(prancis|france)/i.test(query)) return `🇫🇷 Ibu kota Prancis adalah **Paris**.`;
    if (/(jerman|germany)/i.test(query)) return `🇩🇪 Ibu kota Jerman adalah **Berlin**.`;
    if (/(korea selatan|south korea)/i.test(query)) return `🇰🇷 Ibu kota Korea Selatan adalah **Seoul**.`;
    if (/(china|tiongkok|cina)/i.test(query)) return `🇨🇳 Ibu kota Tiongkok adalah **Beijing (Peking)**.`;
    if (/(india)/i.test(query)) return `🇮🇳 Ibu kota India adalah **New Delhi**.`;
    if (/(australia)/i.test(query)) return `🇦🇺 Ibu kota Australia adalah **Canberra**.`;
    if (/(malaysia)/i.test(query)) return `🇲🇾 Ibu kota Malaysia adalah **Kuala Lumpur**.`;
    if (/(thailand)/i.test(query)) return `🇹🇭 Ibu kota Thailand adalah **Bangkok**.`;
    if (/(rusia|russia)/i.test(query)) return `🇷🇺 Ibu kota Rusia adalah **Moskow (Moscow)**.`;
    if (/(brasil|brazil)/i.test(query)) return `🇧🇷 Ibu kota Brasil adalah **Brasília**.`;
  }

  if (/(planet|tata surya|solar system)/i.test(query)) {
    return isId
      ? `🪐 **Tata Surya** kita memiliki **8 planet** yang mengorbit Matahari:\n\n1. **Merkurius** — planet terdekat dari Matahari\n2. **Venus** — planet terpanas\n3. **Bumi** — satu-satunya planet berpenghuni\n4. **Mars** — planet merah\n5. **Jupiter** — planet terbesar\n6. **Saturnus** — planet bercincin\n7. **Uranus** — berputar miring\n8. **Neptunus** — planet terjauh`
      : `🪐 Our **Solar System** has **8 planets** orbiting the Sun:\n\n1. **Mercury** — closest to Sun\n2. **Venus** — hottest planet\n3. **Earth** — only inhabited planet\n4. **Mars** — the red planet\n5. **Jupiter** — largest planet\n6. **Saturn** — ringed planet\n7. **Uranus** — tilted rotation\n8. **Neptune** — farthest planet`;
  }

  // ── TECHNOLOGY & PROGRAMMING ──
  if (/(apa itu (react|reactjs)|what is react)/i.test(query)) {
    return isId
      ? `⚛️ **React** (React.js) adalah library JavaScript open-source yang dikembangkan oleh **Meta (Facebook)** untuk membangun antarmuka pengguna (UI). Fitur utama:\n\n• **Component-Based** — UI dibagi menjadi komponen yang dapat digunakan ulang\n• **Virtual DOM** — rendering cepat dan efisien\n• **JSX** — menulis HTML di dalam JavaScript\n• **React Hooks** — state management tanpa class`
      : `⚛️ **React** (React.js) is an open-source JavaScript library developed by **Meta (Facebook)** for building user interfaces. Key features:\n\n• **Component-Based** — reusable UI building blocks\n• **Virtual DOM** — fast and efficient rendering\n• **JSX** — write HTML in JavaScript\n• **React Hooks** — state management without classes`;
  }

  if (/(apa itu (nextjs|next\.js|next js)|what is next)/i.test(query)) {
    return isId
      ? `🚀 **Next.js** adalah framework React full-stack yang dikembangkan oleh **Vercel**. Fitur unggulan:\n\n• **Server-Side Rendering (SSR)** — SEO optimal\n• **Static Site Generation (SSG)** — performa tinggi\n• **API Routes** — backend built-in\n• **App Router** — routing modern berbasis file\n• **Image & Font Optimization** — optimasi otomatis`
      : `🚀 **Next.js** is a full-stack React framework by **Vercel**. Key features:\n\n• **Server-Side Rendering (SSR)** — SEO friendly\n• **Static Site Generation (SSG)** — high performance\n• **API Routes** — built-in backend\n• **App Router** — modern file-based routing\n• **Image & Font Optimization** — automatic optimization`;
  }

  if (/(apa itu (ai|artificial intelligence|kecerdasan buatan))/i.test(query)) {
    return isId
      ? `🤖 **Kecerdasan Buatan (Artificial Intelligence / AI)** adalah cabang ilmu komputer yang membuat mesin mampu meniru kecerdasan manusia — belajar, menalar, dan mengambil keputusan.\n\n• **Machine Learning** — mesin belajar dari data\n• **Deep Learning** — jaringan saraf tiruan berlapis\n• **NLP** — memahami bahasa manusia\n• **Computer Vision** — mengenali gambar\n\nContoh: ChatGPT, Google Gemini, Siri, Tesla Autopilot.`
      : `🤖 **Artificial Intelligence (AI)** is a branch of computer science that enables machines to simulate human intelligence — learning, reasoning, and decision-making.\n\n• **Machine Learning** — learning from data\n• **Deep Learning** — multi-layered neural networks\n• **NLP** — understanding human language\n• **Computer Vision** — image recognition\n\nExamples: ChatGPT, Google Gemini, Siri, Tesla Autopilot.`;
  }

  if (/(apa itu (python|javascript|java|php|html|css|typescript|kotlin|sql))/i.test(query)) {
    const lang = query.match(/(python|javascript|java|php|html|css|typescript|kotlin|sql)/i)?.[0]?.toLowerCase();
    const langInfo: Record<string, string> = {
      python: "🐍 **Python** adalah bahasa pemrograman serbaguna yang mudah dipelajari. Digunakan untuk web development (Django, Flask), data science (Pandas, NumPy), machine learning (TensorFlow, PyTorch), dan otomasi.",
      javascript: "💛 **JavaScript** adalah bahasa pemrograman utama untuk pengembangan web. Berjalan di browser dan server (Node.js). Digunakan untuk membuat website interaktif, aplikasi web, mobile (React Native), dan backend.",
      java: "☕ **Java** adalah bahasa pemrograman berorientasi objek yang powerful dan portable (Write Once, Run Anywhere). Digunakan untuk enterprise applications, Android development, dan backend systems.",
      php: "🐘 **PHP** adalah bahasa pemrograman server-side untuk pengembangan web. Framework populer: Laravel, CodeIgniter, Symfony. Digunakan oleh WordPress, Facebook (awalnya).",
      html: "📄 **HTML (HyperText Markup Language)** adalah bahasa markup standar untuk membuat struktur halaman web. HTML bukan bahasa pemrograman, melainkan bahasa markup yang mendefinisikan elemen-elemen web.",
      css: "🎨 **CSS (Cascading Style Sheets)** adalah bahasa yang digunakan untuk mendesain tampilan visual halaman web — warna, font, layout, animasi, dan responsive design.",
      typescript: "🔷 **TypeScript** adalah superset JavaScript yang menambahkan static typing. Dikembangkan oleh Microsoft. Membuat kode lebih aman dan mudah di-maintain untuk proyek skala besar.",
      kotlin: "🟣 **Kotlin** adalah bahasa pemrograman modern yang dikembangkan oleh JetBrains. Menjadi bahasa resmi untuk pengembangan **Android** oleh Google sejak 2019.",
      sql: "🗃️ **SQL (Structured Query Language)** adalah bahasa standar untuk mengelola database relasional — membuat, membaca, memperbarui, dan menghapus data (CRUD).",
    };
    if (lang && langInfo[lang]) return langInfo[lang];
  }

  // ── HISTORY & GENERAL ──
  if (/(siapa presiden pertama|first president of indonesia)/i.test(query)) {
    return `🇮🇩 Presiden pertama Indonesia adalah **Ir. Soekarno** (1945–1967). Beliau dikenal sebagai **Bapak Proklamator** kemerdekaan Indonesia bersama **Moh. Hatta**, dan memimpin perjuangan kemerdekaan dari penjajahan.`;
  }

  if (/(siapa (anda|kamu)|who are you|siapa bukhori assistant)/i.test(query)) {
    return isId
      ? `Saya **Bukhori Assistant**, asisten AI cerdas di website portofolio Mhd. Al Bukhori. Saya terhubung dengan **Google Gemini AI** sehingga bisa menjawab **segala pertanyaan** — pengetahuan umum, sains, coding, matematika, geografi, dan tentunya info portofolio Al Bukhori. Silakan tanya apa saja! 🚀`
      : `I'm **Bukhori Assistant**, a smart AI on Mhd. Al Bukhori's portfolio website. I'm powered by **Google Gemini AI** and can answer **any question** — general knowledge, science, coding, math, geography, and of course Al Bukhori's portfolio info. Ask me anything! 🚀`;
  }

  // ── AL BUKHORI PORTFOLIO ──
  if (/(skill|keahlian|stack|teknologi|framework|frontend|backend|database|mobile|android)/i.test(query)) {
    return isId
      ? `💻 **Tech Stack Mhd. Al Bukhori:**\n\n• **Frontend:** React, Vue, Next.js, TypeScript, Tailwind CSS\n• **Backend:** Node.js, Spring Boot, Laravel, Django, Flask\n• **Mobile:** Kotlin, Java (Android Native)\n• **Database:** PostgreSQL, MySQL, MongoDB, Firebase, Supabase\n• **Cloud & DevOps:** GCP, Docker, Vercel, Netlify\n• **Data & Design:** Power BI, Tableau, Figma, AI Prompt Engineering`
      : `💻 **Mhd. Al Bukhori's Tech Stack:**\n\n• **Frontend:** React, Vue, Next.js, TypeScript, Tailwind CSS\n• **Backend:** Node.js, Spring Boot, Laravel, Django, Flask\n• **Mobile:** Kotlin, Java (Android Native)\n• **Database:** PostgreSQL, MySQL, MongoDB, Firebase, Supabase\n• **Cloud & DevOps:** GCP, Docker, Vercel, Netlify\n• **Data & Design:** Power BI, Tableau, Figma, AI Prompt Engineering`;
  }

  if (/(proyek|project|portofolio|mitrivox|250|pengalaman|experience)/i.test(query)) {
    return isId
      ? `🚀 **250+ Proyek & Mitrivox Digital:**\n\nAl Bukhori adalah Pendiri & Full Stack Lead di **Mitrivox Digital** (@mitrivoxdigital.official). Sejak 2021, telah menyelesaikan 250+ proyek web & mobile end-to-end untuk klien lokal & internasional — enterprise systems, e-commerce, aplikasi Android native, dashboard analytics, dan masih banyak lagi.`
      : `🚀 **250+ Projects & Mitrivox Digital:**\n\nAl Bukhori is the Founder & Full Stack Lead at **Mitrivox Digital** (@mitrivoxdigital.official). Since 2021, he has delivered 250+ end-to-end web and mobile projects for global clients — enterprise systems, e-commerce, native Android apps, analytics dashboards, and more.`;
  }

  if (/(remote|hire|rekrut|available|kerja)/i.test(query)) {
    return isId
      ? `🌐 **Ketersediaan Kerja Remote:**\n\nMhd. Al Bukhori **terbuka untuk peran remote full-time & kontrak** di seluruh dunia (US, EU, Asia).\n• Zona Waktu: GMT+7 (WIB), fleksibel dengan zona waktu global\n• Terbiasa dengan Git, Jira, Slack & alur kerja asinkron`
      : `🌐 **Remote Availability:**\n\nMhd. Al Bukhori is **open to full-time remote roles & contract work** worldwide (US, EU, Asia).\n• Timezone: GMT+7 (WIB), flexible with global hours\n• Experienced with Git, Jira, Slack & async workflows`;
  }

  if (/(kontak|contact|email|whatsapp|wa|hubungi)/i.test(query)) {
    return isId
      ? `📬 **Kontak Mhd. Al Bukhori:**\n\n• **Email:** mhdalbukhori296@gmail.com\n• **WhatsApp:** +62 819-9708-0296\n• **LinkedIn:** linkedin.com/in/mhd-al-bukhori\n• **GitHub:** github.com/mhdalbukhori88\n• **Lokasi:** Binjai, Sumatera Utara, Indonesia`
      : `📬 **Contact Mhd. Al Bukhori:**\n\n• **Email:** mhdalbukhori296@gmail.com\n• **WhatsApp:** +62 819-9708-0296\n• **LinkedIn:** linkedin.com/in/mhd-al-bukhori\n• **GitHub:** github.com/mhdalbukhori88\n• **Location:** Binjai, North Sumatra, Indonesia`;
  }

  if (/(pesan|order|harga|jasa|proposal|quote|service|biaya)/i.test(query)) {
    return isId
      ? `📝 **Pemesanan Proyek:**\n\nAjukan pemesanan melalui formulir **#order** di website ini, atau hubungi:\n• **WhatsApp:** +62 819-9708-0296\n• **Email:** mhdalbukhori296@gmail.com`
      : `📝 **Order a Project:**\n\nSubmit requirements via the **#order** section, or reach out:\n• **WhatsApp:** +62 819-9708-0296\n• **Email:** mhdalbukhori296@gmail.com`;
  }

  if (/(pendidikan|education|kuliah|stmik|kaputama|lulusan)/i.test(query)) {
    return isId
      ? `🎓 **Pendidikan:**\n\nMhd. Al Bukhori — S1 Teknik Informatika, **STMIK Kaputama Binjai**.`
      : `🎓 **Education:**\n\nMhd. Al Bukhori — Bachelor's in Informatics Engineering, **STMIK Kaputama Binjai**.`;
  }

  return null;
}
