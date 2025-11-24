# FeidUp Website - Quick Setup Guide

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (optional, for version control)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the site.

### 3. Configure Email Service (Optional but Recommended)

The contact form currently logs submissions to the console. To enable actual email delivery:

#### Using Resend (Recommended)

```bash
# Install Resend
npm install resend

# Create .env.local file
cp .env.example .env.local

# Add your Resend API key to .env.local
RESEND_API_KEY=re_xxxxxxxxxxxx
```

Then update `app/api/contact/route.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, businessType, message } = body;

  await resend.emails.send({
    from: 'FeidUp Contact <onboarding@resend.dev>',
    to: ['your-email@feidup.com'],
    subject: `New ${businessType} inquiry from ${name}`,
    replyTo: email,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Business Type:</strong> ${businessType}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
  });

  return NextResponse.json({ message: "Success" }, { status: 200 });
}
```

## 🎨 Customization

### Replace Placeholder Images

1. Add your images to the `public/` folder (e.g., `public/images/hero-cup.png`)
2. Update page components to use real images:

```tsx
import Image from "next/image";

// Replace PlaceholderImage with:
<Image 
  src="/images/hero-cup.png" 
  alt="Branded Coffee Cup"
  width={600}
  height={400}
  className="rounded-3xl shadow-2xl"
/>
```

### Update Branding Colors

Edit `app/globals.css` to change the color palette:

```css
:root {
  --color-brand-red: 14 86% 57%; /* Your primary color */
  --color-brand-cream: 43 47% 95%; /* Your secondary color */
}
```

### Modify Content

All page content is in the `app/` directory:
- Home: `app/page.tsx`
- About: `app/about/page.tsx`
- Advertisers: `app/advertisers/page.tsx`
- Cafés: `app/businesses/page.tsx`
- Contact: `app/contact/page.tsx`

## 🌐 Deployment

### Deploy to Vercel (Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables

Don't forget to add your environment variables in the deployment platform:
- `RESEND_API_KEY` (or your chosen email service key)

## 📱 Testing

### Test Locally
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Check for Errors
```bash
npm run lint
```

## 📊 Pages Overview

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | Main landing page with CTAs |
| About | `/about` | Company vision and values |
| Advertisers | `/advertisers` | Benefits for brands |
| Cafés | `/businesses` | Benefits for café partners |
| Contact | `/contact` | Contact form |

## 🔧 Common Tasks

### Add a New Page

1. Create a new folder in `app/` (e.g., `app/pricing/`)
2. Add `page.tsx` inside the folder
3. Update navigation in `components/Header.tsx`

### Update Navigation

Edit `components/Header.tsx`:

```tsx
const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  // Add your new page here
  { name: "New Page", href: "/new-page" },
];
```

### Change Fonts

Update `app/layout.tsx`:

```tsx
import { YourFont } from "next/font/google";

const yourFont = YourFont({
  variable: "--font-your-font",
  subsets: ["latin"],
});
```

## 🐛 Troubleshooting

### "Module not found" errors
```bash
npm install
```

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Styling not working
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## 📞 Support

For issues specific to this project, refer to the main README.md or contact the development team.

---

**Happy Building! 🚀**
