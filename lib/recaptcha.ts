// Server-side Google reCAPTCHA v2 verification.
//
// If RECAPTCHA_SECRET_KEY is not set, verification is skipped (returns ok) so
// the site keeps working before you configure keys. Once you set the secret in
// Vercel, every order submission is verified against Google.

export async function verifyRecaptcha(
  token: string | undefined | null,
  ip?: string
): Promise<{ ok: boolean; configured: boolean }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Not configured — don't block submissions.
  if (!secret) return { ok: true, configured: false };

  // Configured but no token from the client → fail.
  if (!token) return { ok: false, configured: true };

  try {
    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", token);
    if (ip && ip !== "unknown") params.append("remoteip", ip);

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = (await res.json()) as { success?: boolean };
    return { ok: data.success === true, configured: true };
  } catch {
    return { ok: false, configured: true };
  }
}
