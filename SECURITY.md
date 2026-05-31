# Security Guide — Mhd Al Bukhori Portfolio

This document explains the security measures already built into the code and the
steps you (the owner) need to take in Cloudflare and your email provider to fully
protect the site against DDoS and phishing.

---

## ✅ What's already done in the code

| Protection | Where | What it does |
|---|---|---|
| **Security headers** | `next.config.mjs` | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and a Content-Security-Policy (CSP). Blocks clickjacking, MIME sniffing, and limits what the page can load. |
| **Hide tech stack** | `next.config.mjs` | Removes the `X-Powered-By: Next.js` header so attackers don't know the stack. |
| **Rate limiting** | `app/api/order/route.ts` | Max 5 form submissions per IP per minute → returns HTTP 429. Slows down spam/abuse bots. |
| **Honeypot field** | `OrderForm.tsx` + API | A hidden "company" field invisible to humans. Bots fill it → silently rejected. |
| **Time trap** | API | Submissions faster than 2 seconds (bots) are silently rejected. |
| **Input validation** | API | Strict length caps, email format check, control-character stripping, HTML escaping → prevents injection into the email. |
| **Method lock** | API | Only `POST` is allowed; `GET` returns 405. |

After deploying, verify your headers at <https://securityheaders.com> — aim for an **A** rating.

---

## 🛡️ Step 1 — Put the site behind Cloudflare (DDoS protection)

> Real DDoS protection lives at the network edge, not in code. Cloudflare's free
> plan already absorbs most volumetric attacks. **This requires a custom domain.**

1. **Buy a domain** (e.g. from Niagahoster, Namecheap, or Cloudflare Registrar) — for example `mhdalbukhori.com`.
2. Create a free account at <https://dash.cloudflare.com> → **Add a site** → enter your domain.
3. Cloudflare scans your DNS. Choose the **Free** plan.
4. Cloudflare gives you **2 nameservers**. Go to your domain registrar and replace the existing nameservers with Cloudflare's. (Propagation takes minutes to a few hours.)
5. In **Vercel** → your project → **Settings → Domains** → add your domain. Vercel shows a `CNAME` (or `A`) record.
6. In **Cloudflare → DNS**, add that record:
   - Type `CNAME`, Name `@` (or `www`), Target = the value Vercel gave you.
   - Set the **proxy status to "Proxied" (orange cloud)** — this is what routes traffic through Cloudflare's DDoS shield.

### Recommended Cloudflare settings (all free)

- **SSL/TLS** → set encryption mode to **Full (strict)**.
- **SSL/TLS → Edge Certificates** → turn on **Always Use HTTPS** and **Automatic HTTPS Rewrites**.
- **Security → Settings** → set Security Level to **Medium** or **High**.
- **Security → Bots** → enable **Bot Fight Mode** (free) — blocks automated bots.
- **Security → DDoS** → the managed HTTP DDoS ruleset is on by default; leave it enabled.
- **Security → WAF → Rate limiting rules** → add a rule:
  - If `URI Path` contains `/api/order` → when requests exceed **10 per minute per IP**, **Block** for 1 minute.
  - (Free plan includes one rate-limiting rule.)
- **Speed → Optimization** → enable caching; under **Caching → Configuration** turn on standard caching for static assets.
- Optional: **Security → WAF → Custom rules** → block or challenge traffic from countries you don't serve, if you only expect Indonesian visitors.

After this, all traffic is filtered by Cloudflare before reaching Vercel, giving you DDoS mitigation, bot filtering, and an extra rate-limit layer.

---

## 📧 Step 2 — Stop phishing / spoofing of your email

Phishing "through your email" usually means someone **spoofs your address** (sends
mail pretending to be you). You stop that with three DNS records. If you use a
custom domain email, add these in **Cloudflare → DNS**:

1. **SPF** (says which servers may send mail for your domain):
   ```
   Type: TXT   Name: @   Value: v=spf1 include:_spf.google.com ~all
   ```
   (Use the `include:` value your email provider documents — the example is for Google Workspace.)

2. **DKIM** (cryptographically signs your mail): enable DKIM in your email
   provider's admin console; it gives you a `TXT` record to paste into Cloudflare DNS.

3. **DMARC** (tells receivers what to do with spoofed mail):
   ```
   Type: TXT   Name: _dmarc   Value: v=DMARC1; p=quarantine; rua=mailto:mhdalbukhori026@gmail.com; pct=100; adkim=s; aspf=s
   ```
   Start with `p=quarantine`; once you confirm legitimate mail passes, you can move to `p=reject` for the strongest protection.

> **Note:** Your current Gmail address (`...@gmail.com`) is already protected by
> Google's own SPF/DKIM/DMARC — you don't need to do anything for it. The records
> above are only needed if you later use email on your **own custom domain**.

### Protect the form itself from being used to send spam
- The form does **not** send mail directly from the browser — it goes through the
  server (`/api/order`) which is rate-limited and validated. Good.
- When you enable Resend (see README), verify your sending domain in Resend and
  add its DKIM records so your order emails don't land in spam.

---

## 🔒 Step 3 — About "locking the code so no one can inspect it"

I want to be honest with you so you're not relying on false security:

**It is technically impossible to hide the front-end code of any public website.**
The browser *must* download the HTML, CSS, and JavaScript in order to display the
page, so anyone can open DevTools and read it. This is true for Google, Facebook,
and every site on the internet. Blocking right-click or the F12 key:

- can be bypassed in seconds (disable JS, use “view-source:”, or a proxy),
- breaks accessibility and normal browser features,
- is widely considered bad practice and looks unprofessional to the very employers you want to impress.

**What actually matters — and is already handled:**

- ✅ Your **secrets** (API keys, the `RESEND_API_KEY`) live only in **server-side
  environment variables** and are **never** sent to the browser.
- ✅ Your **server logic** in `app/api/` runs on the server — visitors only ever
  see its JSON responses, never the code.
- ✅ The client code Next.js ships is **minified**, so it's not human-friendly anyway.
- ✅ Your **source repository** is what holds the readable code — keep that private
  if you wish (GitHub → repo **Settings → Change visibility → Private**). That hides
  the source from other developers without breaking the live site.

So: make the **GitHub repo private** if you want your source hidden, and rely on the
points above for real protection. Trying to block "inspect" on the live page would
only add fake security.

---

## 🔁 Quick checklist

- [ ] Deploy the latest code to Vercel (security headers + form hardening are in it).
- [ ] (Optional) Enable reCAPTCHA "I'm not a robot" — see below.
- [ ] Test headers at <https://securityheaders.com>.
- [ ] Add a custom domain and route DNS through Cloudflare (orange cloud / Proxied).
- [ ] Enable SSL Full (strict), Always Use HTTPS, Bot Fight Mode, and a rate-limit rule on `/api/order`.
- [ ] (Custom-domain email only) add SPF, DKIM, DMARC records.
- [ ] Make the GitHub repo **private** if you don't want the source visible.

---

## 🤖 Step 4 — Enable reCAPTCHA "I'm not a robot" (optional but recommended)

The code already supports Google reCAPTCHA v2. It stays **hidden and inactive**
until you add keys, so the site works fine without it. Once you add the keys, a
"I'm not a robot" checkbox appears in the order form, and the visitor must pass it
before the order is sent or before WhatsApp/Email opens.

### Get your keys (free)

1. Go to <https://www.google.com/recaptcha/admin/create>.
2. Label: `Portfolio`. Type: **reCAPTCHA v2 → "I'm not a robot" Checkbox**.
3. Domains: add `localhost` (for testing) and your live domain
   (e.g. `mhdalbukhori-porto.vercel.app` and your custom domain).
4. Submit. You get a **Site Key** (public) and a **Secret Key** (private).

### Add them to Vercel

In **Vercel → your project → Settings → Environment Variables**, add:

| Name | Value | Note |
|---|---|---|
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | your Site Key | public — shown in the browser |
| `RECAPTCHA_SECRET_KEY` | your Secret Key | private — server only |

Then **redeploy**. The checkbox now appears automatically and every submission is
verified against Google on the server (`/api/order` and `/api/verify`).

> Tip: for local testing, create a `.env.local` file with the same two variables.
> Never commit it — `.gitignore` already ignores `.env*` files.
