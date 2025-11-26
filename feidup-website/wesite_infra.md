# FeidUp Infrastructure Overview

This document explains how FeidUp's website, domain, DNS, and email systems work together. Our current setup follows a modern, stable, and startup-friendly architecture using Vercel, Cloudflare, Squarespace, and Resend.

---

## 🚀 Overview

FeidUp uses a **multi-service architecture**:

- **Vercel** → Hosts and deploys the website
- **Squarespace** → Domain registrar (where the domain was purchased)
- **Cloudflare** → DNS provider, routing, security, Workers, and email forwarding
- **Resend** → Transactional email API (free tier)
- **Cloudflare Worker** → Backend endpoint to send emails using Resend

This structure is clean, cost-effective, and highly scalable.

---

## 🧩 Architecture Breakdown

### 1. Vercel – Website Hosting

Vercel is where the FeidUp website actually lives.

- Builds and deploys the site from GitHub
- Serves the website over its global edge network
- Handles build pipelines and automatic redeployments
- Integrates natively with Cloudflare DNS via CNAME or A records

**→ Vercel = The server that delivers our website.**

---

### 2. Squarespace – Domain Registrar

Squarespace is only used to **own** the domain:

- We purchased `feidup.com` from Squarespace
- DNS is not handled by Squarespace anymore
- Squarespace simply keeps the domain active and renewed

**→ Squarespace = Where we bought the domain.**

---

### 3. Cloudflare – DNS, Security, Email Routing, Workers

We moved DNS to Cloudflare to unlock modern infrastructure capabilities:

#### Cloudflare Provides:

- DNS management
- Free SSL
- DDoS protection
- Firewall
- Caching
- Email Routing
- Workers (serverless backend functions)

Cloudflare points the domain to Vercel by using:

- `A` or `CNAME` records provided by Vercel
- Email DNS records (MX, SPF, DKIM) for Resend
- Worker routes for API endpoints (e.g., contact form)

**→ Cloudflare = The traffic controller + security layer + email router.**

---

### 4. Resend – Free Transactional Email API

Resend handles email sending from:

- Website contact forms
- Advertiser inquiry forms
- Café partner onboarding forms

#### Resend Free Tier:

- 3,000 emails/month
- No credit card required
- No SMTP or Gmail needed

DNS verification (DKIM + SPF) is done in Cloudflare.

**→ Resend = Email delivery system.**

---

### 5. Cloudflare Worker – Email Backend Logic

Instead of using Gmail or a server, we use a Cloudflare Worker:

- Receives POST requests from the website
- Sends emails via Resend's API
- Secure (use encrypted secrets, not app passwords)
- Free tier more than enough for FeidUp

This gives us a **serverless backend** at zero cost.

**→ Worker = The backend API for sending emails.**

---

## 🔗 System Diagram

```
       +-----------------------+
       |      Squarespace      |
       |    (Domain Seller)    |
       +-----------+-----------+
                   |
                   v
       +-----------------------+
       |       Cloudflare      |
       | (DNS + Security +     |
       |  Email Routing + API) |
       +-----------+-----------+
                   |
       +-----------+-----------+
       |                       |
       v                       v
+------------------+    +-----------------+
|     Vercel       |    |   Cloudflare    |
| (Website Hosting)|    |     Worker      |
+------------------+    +-----------------+
        |                       |
        |                       |
        v                       v
  https://feidup.com    Emails via Resend
```

---

## ✅ Summary

Your current setup is:

- **Correct**
- **Modern**
- **Secure**
- **Startup-ready**
- **Mostly free**

### Roles at a glance:

| Service | Purpose |
|---------|---------|
| **Vercel** | Hosts and deploys the website |
| **Squarespace** | Domain registrar |
| **Cloudflare** | DNS, email routing, security, Workers |
| **Resend** | Transactional email sending |
| **Worker** | Backend email logic for contact forms |
