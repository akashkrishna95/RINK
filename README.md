# Research Innovation Network Kerala (RINK) - Web Portal

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwind-css)](#)

The official web portal for the **Research Innovation Network Kerala (RINK)**, an initiative led by the **Kerala Startup Mission (KSUM)**. RINK serves as the primary bridge between breakthrough institutional research, academic laboratories, and commercial enterprise, enabling deep-tech venture creation and technology transfer across Kerala.

---

## 📦 Implemented Modules & Features

### 1. Core Homepage & Navigation
- **Hero Banner**: Presentation of RINK's vision, key metrics, and direct action triggers.
- **Interactive Kerala Map (`InteractiveMap.tsx`)**: Custom Leaflet map visualizing research institutes, incubators, and university hubs across Kerala with district-level filtering and facility detail drawers.
- **About RINK Section (`AboutRink.tsx`)**: Segmented overview highlighting R&D Grants, Commercialization Support, Research Incubation Programs, and Ecosystem Collaborations.
- **Featured Technologies Catalog (`FeaturedTechnologies.tsx`)**: Interactive catalog allowing users to search and filter laboratory technologies ready for commercial licensing.
- **Partner & Institutional Networks (`InstitutionsGrid.tsx`, `PartnerInstitutes.tsx`)**: Directory displaying participating universities, R&D labs, and visited institutions.
- **Navigation & Footer**: Hardware-accelerated header navbar and structured light-theme footer with contact details and back-to-top interaction.

### 2. Core Portal Pages (`/app`)
- **Programs Directory (`/programs`)**: Comprehensive listing of incubation, acceleration, and commercialization programs with streaming skeleton loading UI.
- **Grants & Funding (`/funds`)**: Detailed overview of R&D seed funds, scheme guidelines, eligibility criteria, and application pathways with streaming loaders.
- **About RINK (`/about`)**: Detailed breakdown of governance, institutional objectives, and ecosystem milestones.
- **Contact Hub (`/contact`)**: Inquiry submission interface and official contact points.
- **Privacy & Compliance (`/privacy`)**: Data privacy framework and institutional compliance guidelines.

### 3. ROMI Portal (Research Operations & Market Intelligence) (`/RomiPortal`)
- **Portal Workspace**: Dedicated workspace for researchers, innovators, and institutional administrators.
- **Researchpreneurship Suite**: Guidance modules and tools tailored for converting lab research into commercial startups.
- **Technology Repository & Assessment**: Tools for listing, tracking, and evaluating technology readiness levels (TRL).
- **Analytics & Visualizations**: Interactive gauge metrics and data visualizations (`RomiGauge.tsx`).
- **State Persistence**: Custom storage handling (`useRomiStorage.ts`) for user workflows.

### 4. Technical & Performance Infrastructure
- **GPU Hardware Acceleration**: CSS 3D transform layers on interactive components for optimal rendering performance.
- **Subpixel Antialiasing Stabilization**: Composite layer locking on navigation links to maintain text rendering stability during hover states.
- **Deferred Offscreen Rendering**: `content-visibility: auto` and intrinsic size bounds applied to heavy grids and carousels for fast initial paint times.
- **Custom Service Worker (`sw.js`)**: Background caching utilizing Stale-While-Revalidate strategies for static assets and remote media resources.
- **Skeleton UI Loaders**: Dynamic route streaming loaders (`/funds/loading.tsx`, `/programs/loading.tsx`) preventing layout shifts.

---

## 🤖 ROMI AI Engine Status

> [!IMPORTANT]
> **Backend Integration Status**:
> The frontend interfaces and analytical components for **ROMI AI** are integrated into the web portal. However, the **ROMI AI backend API is currently in active development**. 
>
> - **Deployment Roadmap**: The backend service will be deployed and connected to the production frontend upon final review and verification by **RINK officials**.
> - **Testing Phase**: ROMI AI requires deep API testing specifically focused on **Market Study** generation, commercial viability scoring, and competitive landscape analysis before public release.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router with Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI & Animation**: [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Interactive Maps**: [React Leaflet](https://react-leaflet.js.org/)
- **Database & Real-time API**: [PocketBase](https://pocketbase.io/)

---

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── about/                # Institutional overview page
│   ├── contact/              # Contact hub page
│   ├── funds/                # Funding & R&D grants directory + skeleton loader
│   ├── privacy/              # Privacy policy page
│   ├── programs/             # Incubation & acceleration programs + skeleton loader
│   └── RomiPortal/           # ROMI portal workspace & sub-features
├── HomePage/                 # Core homepage modular components
│   ├── AboutRink/            # Grants, incubation, and collaboration tabs
│   ├── InteractiveMap.tsx    # Leaflet interactive map of Kerala institutes
│   ├── FeaturedTechnologies.tsx # Searchable technology transfer catalog
│   ├── InstitutionsGrid.tsx  # Network directory grid
│   └── Navbar.tsx / Footer.tsx # Core navigation components
├── components/               # Shared UI & utility components
├── hooks/                    # Custom React hooks (PocketBase real-time sync)
├── public/                   # Static assets & Service Worker (sw.js)
└── tailwind.config.ts        # Tailwind configuration
```

---

## 🚀 Local Development

### Prerequisites

- Node.js (v18+)
- `pnpm` or `npm`

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/akashkrishna95/RINK.git
   cd RINK
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.
