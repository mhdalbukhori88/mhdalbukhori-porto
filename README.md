w# Mhd Al Bukhori — Portfolio Website

A professional, modern portfolio website for **Mhd Al Bukhori**, Fullstack Web Developer, Software Engineer & Data Analyst. Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion. Ready to deploy on Vercel.

## ✨ Features

- **Modern, professional design** with a dark theme, gradients, and smooth animations
- **Fully responsive** — looks great on mobile, tablet, and desktop
- **Working navigation** — every menu item scrolls to its section
- **Hero** with profile photo, roles, and quick actions
- **About** — full professional summary
- **Skills** — categorized tech stack (Frontend, Backend, Java, Python, Databases, Data Analysis, Digital Marketing, AI)
- **Services** — what you offer to clients
- **Projects** — featured work showcase
- **Experience & Education** — timeline
- **Certificates** — view/download your certificates and CV
- **Order a Website** — a working form that sends orders directly to your **email and WhatsApp**
- **Contact** — email, phone/WhatsApp, GitHub, LinkedIn, Instagram
- **SEO ready** — metadata, sitemap, robots

## 🚀 Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## 📁 Your files

These are served from the `public/` folder:

- `public/cv-mhd-al-bukhori.pdf` — your CV
- `public/profile.jpeg` — your photo
- `public/certificate-1.jpeg` — certificate 1
- `public/certificate-2.pdf` — certificate 2

To update them, just replace these files with the same names.

## ✉️ How the "Order Website" form works

The form **always works**. When a visitor submits an order:

1. It tries to send the order to your email via the `/api/order` endpoint.
2. If no email provider is configured, it automatically **opens WhatsApp** (`0877-9019-9115`) and your **email app** (`mhdalbukhori026@gmail.com`) with the order pre-filled.

There are also dedicated **"Order via WhatsApp"** and **"Order via Email"** buttons.

### Optional: send orders automatically to your email

To have orders emailed to you automatically (no WhatsApp/email app popup):

1. Create a free account at [resend.com](https://resend.com) and get an API key.
2. In Vercel, add these environment variables in the project settings:
   - `RESEND_API_KEY` = your Resend API key
   - `CONTACT_EMAIL` = `mhdalbukhori026@gmail.com`
3. Redeploy. Orders will now arrive directly in your inbox.

## 🌐 Deploy to Vercel

### Option A — via GitHub (recommended)

1. Push this folder to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/mhdalbukhori88/portfolio.git
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Vercel auto-detects Next.js. Click **Deploy**. Done!

### Option B — via Vercel CLI

```bash
npm i -g vercel
vercel
```

Follow the prompts. Your site goes live in seconds.

## 🛠 Editing your content

All your personal info lives in:

- `lib/site-config.ts` — name, contact, socials, about text
- `lib/content.ts` — skills, services, projects, experience, certificates

Edit those files and the whole site updates.

---

Built with ❤️ using Next.js + Tailwind CSS.
