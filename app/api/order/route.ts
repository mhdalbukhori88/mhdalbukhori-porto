import { NextResponse } from "next/server";

// Order/contact submission endpoint.
//
// If a RESEND_API_KEY is configured in the environment, the order is emailed
// to CONTACT_EMAIL via Resend. Otherwise the endpoint responds with
// { delivered: false } and the client falls back to opening WhatsApp and the
// visitor's email app automatically — so the form always works, even with no
// backend configuration.

type OrderPayload = {
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  budget?: string;
  deadline?: string;
  details?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: Request) {
  let body: OrderPayload;
  try {
    body = (await req.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ delivered: false, error: "Invalid request" }, { status: 400 });
  }

  const { name, email, phone, type, budget, deadline, details } = body;

  if (!name || !email || !details) {
    return NextResponse.json(
      { delivered: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL || "mhdalbukhori026@gmail.com";

  // No email provider configured — let the client handle WhatsApp/email fallback.
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
