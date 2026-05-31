import { NextResponse } from "next/server";
import { verifyRecaptcha } from "@/lib/recaptcha";

// Lightweight endpoint used by the WhatsApp / Email buttons to confirm the
// visitor passed the "I'm not a robot" check before opening those apps.

function getClientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function POST(req: Request) {
  let token: string | undefined;
  try {
    const body = (await req.json()) as { token?: string };
    token = body.token;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { ok, configured } = await verifyRecaptcha(token, getClientIp(req));
  return NextResponse.json({ ok, configured });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
