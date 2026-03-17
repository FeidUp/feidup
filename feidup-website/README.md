# FeidUp Marketing Website

A professional marketing-focused website for FeidUp, a startup that partners with restaurants to provide free custom packaging funded by advertiser impressions.

## 🎯 Project Overview

FeidUp is a marketing and impressions company that transforms everyday café packaging into high-visibility ad inventory. This website serves to:

- Attract advertisers seeking targeted, real-world impressions
- Recruit café partners interested in free premium co-branded packaging
- Educate stakeholders about FeidUp's unique value proposition

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Fonts**: Inter (body), Fredoka (headings)

## 📁 Project Structure

```
app/
├── page.tsx              # Home page
├── about/
│   └── page.tsx         # About Us page
├── advertisers/
│   └── page.tsx         # For Advertisers page
├── businesses/
│   └── page.tsx         # For Café Partners page
├── contact/
│   └── page.tsx         # Contact page with form
└── api/
    └── contact/
        └── route.ts     # Contact form API endpoint

components/
├── Header.tsx           # Navigation header
├── Footer.tsx           # Footer with links
├── Button.tsx           # Reusable CTA button
└── PlaceholderImage.tsx # Placeholder for illustrations

public/                  # Static assets (logos, images, etc.)
```

## 🎨 Branding

### Color Palette
- **Primary**: Red-orange `hsl(14, 86%, 57%)` (American diner inspired)
- **Secondary**: Cream/off-white `hsl(43, 47%, 95%)`
- **Dark**: `hsl(0, 0%, 10%)`
- **Light**: `hsl(0, 0%, 98%)`

### Typography
- **Headings**: Fredoka (playful bubble font)
- **Body**: Inter (clean sans-serif)

### Design Style
- Playful but professional
- Rounded edges and bold shapes
- High contrast, diner-style accents
- Smooth transitions and animations

## 📧 Email Integration Setup

The contact form currently logs submissions to the console. To enable email functionality:

### Option 1: Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Install the package:
   ```bash
   npm install resend
   ```
3. Add your API key to `.env.local`:
   ```
   RESEND_API_KEY=your_api_key_here
   ```
4. Update `app/api/contact/route.ts` with the Resend code (commented in the file)

### Option 2: EmailJS

1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Install the package:
   ```bash
   npm install @emailjs/browser
   ```
3. Configure in the contact form component

### Option 3: Formspree

1. Sign up at [formspree.io](https://formspree.io)
2. Update the form action endpoint in `app/contact/page.tsx`

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
npm run build
npm start
```

## 📄 Pages Overview

### Home Page (`/`)
- Hero section with clear value proposition
- Value proposition cards for advertisers, cafés, and sustainability
- How it works section
- CTA for both audiences

### About Page (`/about`)
- Long-term vision explanation
- Short-term pilot program details
- Co-branding philosophy
- Core values

### Advertisers Page (`/advertisers`)
- Benefits of real-world impressions
- Location targeting and engagement metrics
- Campaign process overview
- CTA to contact for campaign planning

### Café Partners Page (`/businesses`)
- Free premium packaging benefits
- Co-branding assurance (café identity first)
- Partnership process
- Ideal partner criteria

### Contact Page (`/contact`)
- Contact form with validation
- Fields: name, email, business type, message
- Success/error handling
- Alternative contact information

## 🔧 Customization

### Replace Placeholder Images

Placeholder images are located in `components/PlaceholderImage.tsx`. Replace these with actual images by:

1. Adding images to the `public/` folder
2. Using Next.js `<Image>` component
3. Updating references in page components

### Update Colors

Colors are defined in `app/globals.css` using CSS custom properties. Update the `:root` section to change the theme.

### Modify Navigation

Edit `components/Header.tsx` to add/remove navigation items.

## 📊 SEO

The site includes:
- Semantic HTML structure
- Meta tags for each page
- OpenGraph tags for social sharing
- Keyword-optimized content
- Mobile-responsive design

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The site is compatible with any Next.js hosting platform (Netlify, AWS Amplify, etc.)

## 📝 Content Guidelines

- **No pricing mentions** anywhere on the site
- Position as a marketing/impressions platform, not a packaging company
- Emphasize co-branding (café identity first)
- Trust-building, modern, design-driven tone
- Focus on value per impression and sustainability

## 🤝 Contributing

This is a proprietary project for FeidUp. Internal contributions should follow the established design system and branding guidelines.

## 📞 Support

For questions or issues, contact the FeidUp development team.

---

**Built with ❤️ for FeidUp**

