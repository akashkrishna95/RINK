# RINK - Research Innovation Network Kerala

A premium, fully responsive website for RINK built with Next.js 16, React, TypeScript, Tailwind CSS, and Framer Motion.

## 🎨 Design Features

- **Premium Branding**: Custom denim color theme (#1b60bb primary) with elegant typography
- **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **Interactive Elements**: Smooth animations and transitions using Framer Motion
- **Accessibility**: Semantic HTML and ARIA labels throughout
- **Performance**: Optimized images, lazy loading, and hardware-accelerated animations

## 📱 Sections Included

### 1. **Navbar**
- Logo with RINK branding
- Navigation links (Home, Events, Contact Us)
- Responsive layout

### 2. **Hero Section**
- Eye-catching headline with gradient overlay background
- Descriptive subheading highlighting key value propositions
- Premium "Romi" chatbot trigger with animated tooltip
- Interactive chatbot drawer (50vh, glassmorphic design)

### 3. **Action Cards Grid**
- 3 feature cards showcasing:
  - Technologies (License breakthrough IP)
  - Instrumentation (Access advanced core labs)
  - Research Incubation Program (Turn research into startups)
- Responsive layout (3 columns desktop, 2+1 mobile)
- Smooth hover animations with arrow transitions
- Color-coded cards with specific color schemes

### 4. **Institutions Grid**
- Left column: Description + Institution logos grid
- Right column: 3D Kerala map image
- Interactive logo tooltips on hover
- "See More" expandable grid
- Gradient background

### 5. **Featured Technologies Carousel**
- Infinite scrolling carousel with hover pause
- Technology cards featuring:
  - Product images with sector badges
  - RINK verified badge (featured items)
  - Institution information
  - IP status (Patented/Patent Filed/Not Specified)
  - "View Details" button
- Responsive card scaling on interaction
- 5-second idle timeout for auto-resume

### 6. **About RINK Section**
- Left: Decorative lightbulb image (overlay on mobile)
- Right: About RINK content with key message
- Feature grid (2x2):
  - Research Incubation Programs
  - Demo Day & Exposure Visits
  - IPR Support
  - Research Incubation Programs
- Bottom marquee with KSUM/RINK repeating text

### 7. **Partner Institutes**
- Filterable logo grid by category
- Glassmorphic design with hover effects
- Dynamic category extraction from data
- Grayscale to color transition on hover
- Floating tooltips on logo hover
- Masonry grid layout with smooth animations

### 8. **Premium Footer**
- 4-column layout:
  - NAVIGATE (About, Programs, Results, Contact)
  - CONNECT (LinkedIn, Instagram, YouTube)
  - CONTACT (Address, Email, Phone)
  - Back-to-Top button
- Copyright & policy links
- Massive "RINK" text at bottom (20-25vw)
- Floating WhatsApp button (fixed position)
- Denim-900 background with light text

## 🛠 Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **Fonts**: Montserrat (headings), Poppins (body), System UI (navigation)
- **Language**: TypeScript

## 📐 Color Theme (Denim)

```
denim-50:  #eff9ff (Background)
denim-100: #daf1ff
denim-200: #bde7ff
denim-300: #90daff
denim-400: #5cc4fe
denim-500: #36a8fb
denim-600: #1f8af1
denim-700: #1872dd
denim-800: #1b60bb (Primary)
denim-900: #1b4f8d
denim-950: #153156 (Deep)
```

## 🎯 Key Components

- `Navbar.tsx` - Navigation header
- `HeroSection.tsx` - Hero banner with chatbot
- `ActionCardsGrid.tsx` - 3-card feature grid
- `InstitutionsGrid.tsx` - Institution grid with map
- `FeaturedTechnologies.tsx` - Technology carousel
- `AboutRink.tsx` - About section with features
- `PartnerInstitutes.tsx` - Partner logo grid
- `Footer.tsx` - Premium footer

## 🚀 Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Building for Production

```bash
pnpm build
pnpm start
```

## 🎭 Animations & Interactions

- **Smooth page transitions** with entrance animations
- **Card hover effects** with lift and shadow changes
- **Arrow icon animations** that translate on hover
- **Chatbot drawer** slides up from bottom (50vh)
- **Carousel auto-scroll** with 5-second idle timeout
- **Filter transitions** with Framer Motion layout animation
- **Marquee text** continuously scrolling
- **WhatsApp button** fixed at bottom-right with hover scale

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (md breakpoint)
- **Tablet**: 768px - 1024px (md to lg)
- **Desktop**: > 1024px (lg+)

Mobile-first approach ensures excellent UX on all devices.

## ✅ Best Practices Implemented

- ✓ Semantic HTML elements
- ✓ ARIA labels for accessibility
- ✓ Optimized images with Next.js Image component
- ✓ Hardware-accelerated animations
- ✓ No layout shifts (proper aspect ratios)
- ✓ Mobile-first responsive design
- ✓ Clean, modular component architecture
- ✓ TypeScript for type safety
- ✓ Proper error handling
- ✓ SEO metadata

## 🔗 Links

- **Live**: Deploy to Vercel for production
- **Repository**: Add your GitHub repo link
- **Design Reference**: Based on provided RINK brand guidelines

## 📄 License

Premium brand website for Kerala Startup Mission RINK Initiative.

---

Built with ❤️ using modern web technologies.
