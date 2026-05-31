import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";

// Order/contact submission endpoint — hardened against abuse.
//
// Protections:
//  - Per-IP rate limiting (in-memory sliding window)
//  - Strict input validation + length caps
//  - Honeypot field to trap bots
//  - HTML escaping to prevent injection into the email body
//  - Minimal time-to-submit check (bots submit instantly)
//
// If a RESEND_API_KEY is configured, the order is emailed to CONTACT_EMAIL via
// Resend. Otherwise it responds { delivered: false } and the client falls back
// to opening WhatsApp + the visitor's email app.

type OrderPayload = {
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  budget?: string;
  deadline?: string;
  details?: string;
  // anti-bot
  company?: string; // honeypot: must stay empty
  startedAt?: number; // client timestamp when the form was opened
  recaptchaToken?: string; // Google reCAPTCHA token
};

// ---- Simple in-memory rate limiter (per serverless instance) ----
// For production-grade limiting across all instances, Cloudflare's WAF /
// Rate Limiting rules (see SECURITY.md) are the real defense. This adds a
// cheap second layer.
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5; // max 5 submissions per IP per minute
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);

  // opportunistic cleanup to avoid unbounded growth
  if (hits.size > 5000) {
    for (const [key, list] of hits) {
      const fresh = list.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
  }
  return timestamps.length > MAX_REQUESTS;
}

function getClientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("cf-connecting-ip") || // Cloudflare
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reject control chars / header-injection attempts in short fields.
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, max);
}

export async function POST(req: Request) {
  const ip = getClientIp(req);

  if (rateLimited(ip)) {
    return NextResponse.json(
      { delivered: false, error: "Too many requests. Please try again in a minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: OrderPayload;
  try {
    body = (await req.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ delivered: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (clean(body.company, 100) !== "") {
    // Pretend success so bots don't learn they were caught.
    return NextResponse.json({ delivered: true });
  }

  // Time trap: a human takes more than ~2s to fill the form.
  if (typeof body.startedAt === "number" && Date.now() - body.startedAt < 2000) {
    return NextResponse.json({ delivered: true });
  }

  // reCAPTCHA verification (only enforced when keys are configured).
  const captcha = await verifyRecaptcha(body.recaptchaToken, ip);
  if (captcha.configured && !captcha.ok) {
    return NextResponse.json(
      { delivered: false, error: "Please complete the 'I'm not a robot' verification." },
      { status: 400 }
    );
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 150);
  const phone = clean(body.phone, 40);
  const type = clean(body.type, 60);
  const budget = clean(body.budget, 60);
  const deadline = clean(body.deadline, 60);
  const details = clean(body.details, 5000);

  if (!name || !email || !details) {
    return NextResponse.json(
      { delivered: false, error: "Missing required fields" },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { delivered: false, error: "Invalid email address" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL || "mhdalbukhori026@gmail.com";

  // No email provider configured — client handles WhatsApp/email fallback.
  if (!apiKey) {
    return NextResponse.json({ delivered: false, fallback: true });
  }

  const html = `
    <h2>New Website Order</h2>
    <table cellpadding="6" style="font-family:sans-serif;font-size:14px">
      <tr><td><b>Name</b></td><td>${escapeHtml(name)}</td></tr>
      <tr><td><b>Email</b></td><td>${escapeHtml(email)}</td></tr>
      <tr><td><b>Phone</b></td><td>${escapeHtml(phone || "-")}</td></tr>
      <tr><td><b>Website Type</b></td><td>${escapeHtml(type || "-")}</td></tr>
      <tr><td><b>Budget</b></td><td>${escapeHtml(budget || "-")}</td></tr>
      <tr><td><b>Deadline</b></td><td>${escapeHtml(deadline || "-")}</td></tr>
    </table>
    <h3>Details</h3>
    <p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(
      details
    )}</p>
    <hr/>
    <p style="font-family:sans-serif;font-size:12px;color:#888">Submitted from IP: ${escapeHtml(ip)}</p>
  `;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Order <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `New Website Order — ${name}`,
        html,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ delivered: false, fallback: true });
    }
    return NextResponse.json({ delivered: true });
  } catch {
    return NextResponse.json({ delivered: false, fallback: true });
  }
}

// Reject other methods cleanly.
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
