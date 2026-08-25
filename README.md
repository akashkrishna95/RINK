# ✦ RINK (Research Innovation Network Kerala) - Official Web Portal ✦

[![Build Status](https://img.shields.io/badge/Build-Passing-1b60bb?style=flat-square)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css)](#)

The official repository for the **Research Innovation Network Kerala (RINK)** web portal. This platform is designed by the **Kerala Startup Mission (KSUM)** to bridge the gap between breakthrough laboratory research and commercial enterprise, empowering the research fraternity to build and scale deep-tech ventures.

---

## 🚀 Overview

The RINK web portal is a highly optimized, visually stunning Next.js application that serves as the central hub for researchers, innovators, investors, and partner institutions. It combines a premium, corporate aesthetic with top-tier technical performance, designed to look state-of-the-art while running butter-smooth on all devices, including budget smartphones with 4GB of RAM.

---

## 🎨 Visual Identity & Theme

The website is styled using a modern, pristine **Light Corporate Theme** modeled after `rink.startupmission.in`:
*   **Color Palette**: Sleek white backgrounds, slate grays (`text-slate-800`, `text-slate-600`), and official brand blues (`#1b60bb` and `#153156`).
*   **Typography**: Clean, optimized typography utilizing only two Google Fonts:
    *   **Barlow**: Used for body descriptions, metadata, and clean sans-serif text layout.
    *   **Bricolage Grotesque** (`font-helios` / `font-clash`): A premium, snug-tracking font used for page headings and section titles.
*   **Redesigned Footer**: Completely rebuilt to match the official light model:
    *   Full-color brand logos (no filters or inversion).
    *   Structured Address with a bold campus header (*G3B, Thejaswini, Technopark Campus*).
    *   *For more details* dedicated contact block header.
    *   Tactile Back-to-Top scroll button featuring a light blue circle that inverts to dark blue with a white arrow on hover.
    *   Balanced mobile layout ensuring Navigate, Connect, and Scroll columns center perfectly.

---

## ⚙️ Core Performance Features

The site has been heavily optimized for maximum speed, responsiveness, and zero-latency interactions:

### 1. GPU Hardware Acceleration
All interactive elements (buttons, links, and cards) leverage CSS 3D transforms (`translate3d(0,0,0)`) to offload rendering onto the GPU. This eliminates any screen stutter during hover animations.

### 2. Text Rendering Stabilization (Anti-Aliasing Fix)
All links in the header navigation and footer utilize a hardware-accelerated composite layer. This prevents the browser from switching between subpixel and grayscale text antialiasing during transitions, eliminating any text boldness changes or flickering.

### 3. Deferred Offscreen Rendering (`content-visibility: auto`)
All heavy page modules (the Interactive Map grid, Partner Logos carousel, and Technology/Program listings) use `content-visibility: auto` along with a height fallback (`contain-intrinsic-size`). The browser skips rendering these sections until they are about to scroll into view, resulting in extremely fast initial paint speeds and low RAM usage.

### 4. Advanced Service Worker Caching (`sw.js`)
A customized service worker handles network requests in the background:
*   **Pre-caching**: Automatically caches all critical layout assets (backgrounds, logos, banners).
*   **Image Caching**: Dynamically caches Google Drive images (`googleusercontent.com`) and static assets using a **Stale-While-Revalidate** pattern.
*   **Speed**: Delivers instant loading on return visits.

### 5. Skeleton UI Loading Screens
All data-heavy routes (such as `/programs` and `/funds`) use pulsing skeleton loaders during SSR streaming to provide visual loading indicators and completely eliminate layout shifts.

### 6. Local Network Warning Suppression
Client-side subscriptions to PocketBase real-time events check the origin before connecting. If the website is loaded from a public domain but configured with a local database endpoint, the SSE subscription is bypassed, completely preventing the browser's *"Local Network Access"* warning prompt.

---

## 🛠️ Technology Stack

*   **Core Framework**: [Next.js 16 (Turbopack)](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) for strict static typing
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) (Optimized with `once: true` viewport limits)
*   **Maps**: [React Leaflet](https://react-leaflet.js.org/) (Mobile optimized with instant views; desktop maps animate via `flyTo`)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Database**: [Pocketbase](https://pocketbase.io/)

---

## 📁 Key Directories

```
├── app/                  # Next.js pages (Home, About, Funds, Programs, Privacy)
│   ├── funds/loading.tsx # Funds page skeleton UI loader
│   └── programs/loading.tsx # Programs page skeleton UI loader
├── HomePage/             # Core Homepage components
│   ├── Navbar.tsx        # Hardware-accelerated header navigation
│   ├── Footer.tsx        # Redesigned light theme footer
│   ├── InteractiveMap.tsx# Kerala Leaflet map component
│   └── TechnologyCard.tsx# Optimized GPU-accelerated card component
├── public/               # Static assets & service worker
│   └── sw.js             # Service worker cache script
├── hooks/                # Custom React hooks (Real-time PocketBase sync)
└── tailwind.config.ts    # Custom configurations and font mappings
```

---

## 🚀 Running Locally

To launch this project on your local machine:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/akashkrishna95/RINK.git
    cd RINK
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    # or
    npm install
    ```

3.  **Start the development server**
    ```bash
    pnpm dev
    # or
    npm run dev
    ```

4.  **Open the application**: Visit [http://localhost:3000](http://localhost:3000) with your browser.

---
*Developed with precision for the Kerala Startup Mission.*
