'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ChevronRight } from 'lucide-react';

const segmentLabels: Record<string, string> = {
  programs: 'Programs',
  funds: 'Funds & Grants',
  about: 'About RINK',
  randd: 'R&D Grant',
  demoday: 'Demo Day & Exposure Visits',
  iprsupport: 'IPR Support',
  researchpreneurship: 'Research Incubation',
  contact: 'Contact Us',
  privacy: 'Privacy',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms of Service',
  cookies: 'Cookie Policy',
  RomiPortal: 'ROMI Portal',
  RomiPortalFeatures: 'ROMI Features',
  technologies: 'Technologies',
  instrumentation: 'Instrumentation',
};

const segmentHrefs: Record<string, string> = {
  about: '/#about-rink',
  privacy: '/privacy/privacy-policy',
};

function formatSegmentName(segment: string): string {
  if (segmentLabels[segment]) return segmentLabels[segment];
  // Convert kebab-case / camelCase / slug to readable Title Case
  return segment
    .replace(/-/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  customItems?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ customItems, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Do not render breadcrumbs on homepage
  if (!pathname || pathname === '/') return null;

  let items: { label: string; href: string }[] = [];

  if (customItems && customItems.length > 0) {
    items = customItems.map((item) => ({
      label: item.label,
      href: item.href || '#',
    }));
  } else {
    const rawSegments = pathname.split('/').filter(Boolean);
    let accumHref = '';
    items = rawSegments.map((segment) => {
      accumHref += `/${segment}`;
      const targetHref = segmentHrefs[segment] || accumHref;
      return {
        label: formatSegmentName(segment),
        href: targetHref,
      };
    });
  }

  return (
    <nav aria-label="Breadcrumb navigation" className={`w-full ${className}`}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex justify-start">
        <ol className="inline-flex items-center gap-1.5 sm:gap-2.5 text-xs sm:text-sm md:text-[15px] font-poppins text-slate-500 bg-white/85 backdrop-blur-md px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full border border-slate-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
          <li className="flex items-center">
            <Link
              href="/"
              onClick={(e) => {
                if (typeof window !== 'undefined') {
                  try {
                    sessionStorage.removeItem('activeSection_/');
                  } catch {}
                  if (pathname === '/') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                  }
                }
              }}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#1b60bb] font-medium transition-colors duration-200"
              title="Home"
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
              <span>Home</span>
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href + index} className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 shrink-0" />
                {isLast ? (
                  <span className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-[350px] md:max-w-[500px]" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-[#1b60bb] font-medium transition-colors duration-200 truncate max-w-[140px] sm:max-w-[220px]"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
