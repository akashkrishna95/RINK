'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronRight, Mail } from 'lucide-react';

const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ');

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export default function TechnologiesNavbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const isActive = (href: string) => pathname.startsWith(href);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/RomiPortal', label: 'ROMI AI', isScroll: false },
    { href: '/technologies', label: 'Technologies', isScroll: false },
    { href: '/technologies/institutions', label: 'Institutions', isScroll: false },
    { href: '/technologies/sectors', label: 'Sector', isScroll: false },
    { href: '/events', label: 'Events', isScroll: false },
    { href: '/about#contact', label: 'Contact' },
  ];

  return (
    <nav className="w-full bg-[#F4F7FB] sticky top-0 z-50">
      <div className="w-full max-w-[1400px] mx-auto px-5 md:px-8 py-4 flex items-center justify-between relative z-50">
        
        {/* Brand Logos */}
        <Link
          href="/"
          onClick={() => setIsMobileMenuOpen(false)}
          className="flex items-center gap-3 md:gap-4 z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b60bb] rounded-sm group cursor-pointer bg-transparent border-none p-0"
        >
          {/* KSUM Logo */}
          <Image
            src="/images/ksum-logo.svg"
            alt="Kerala Startup Mission Logo"
            width={120}
            height={40}
            style={{ width: 'auto' }}
            className="h-8 md:h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
            priority
          />
          {/* Divider */}
          <div className="w-px h-8 md:h-10 bg-[#1b60bb]/20"></div>
          {/* RINK Logo */}
          <Image
            src="/images/rink-logo.svg"
            alt="Research Innovation Network Kerala Logo"
            width={160}
            height={40}
            style={{ width: 'auto' }}
            className="h-8 md:h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-90"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => 
              link.isScroll ? (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href.replace('#', ''))}
                  className="relative font-helios text-[16px] font-medium text-[#1b60bb] hover:text-[#113a70] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b60bb] rounded-sm px-1 py-1.5 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1b60bb] group-hover:w-full transition-all duration-300" />
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative font-helios text-[16px] font-medium text-[#1b60bb] hover:text-[#113a70] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b60bb] rounded-sm px-1 py-1.5 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1b60bb] group-hover:w-full transition-all duration-300" />
                </Link>
              )
            )}
          </div>

          {/* Browse Technologies Button */}
          <Link
            href="/technologies/browse_technologies"
            className={`font-helios text-[15px] px-6 py-2 rounded-full border-2 transition-all duration-300 ${
              isActive('/technologies/browse_technologies')
                ? 'bg-transparent text-[#1b60bb] border-[#1b60bb]' // the image shows it is an outline button
                : 'bg-transparent text-[#1b60bb] border-[#1b60bb] hover:bg-[#1b60bb] hover:text-white'
            }`}
          >
            Browse Technologies
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 -mr-2 text-[#1b60bb] hover:bg-[#1b60bb]/5 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b60bb]"
            aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Enterprise Mobile Menu Panel */}
      <div className={cn(
        "absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg overflow-hidden transition-all duration-300 ease-in-out lg:hidden",
        isMobileMenuOpen ? "max-h-[calc(100vh-80px)] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="flex flex-col h-full max-h-[calc(100vh-80px)] overflow-y-auto">
          {/* Navigation Links */}
          <nav className="flex flex-col w-full">
            {navLinks.map((link) => 
              link.isScroll ? (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href.replace('#', ''))}
                  className="flex items-center justify-between px-6 py-5 border-b border-gray-100 font-helios font-semibold text-base text-[#1b60bb] hover:bg-gray-50 active:bg-gray-100 transition-colors w-full text-left"
                >
                  {link.label}
                  <ChevronRight size={18} className="text-[#1b60bb]/40" />
                </button>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-6 py-5 border-b border-gray-100 font-helios font-semibold text-base text-[#1b60bb] hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  {link.label}
                  <ChevronRight size={18} className="text-[#1b60bb]/40" />
                </Link>
              )
            )}
            
            {/* Mobile CTA */}
            <Link
              href="/technologies/browse_technologies"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-6 py-5 border-b border-gray-100 font-helios font-semibold text-base text-white bg-[#1b60bb] active:bg-[#113a70] transition-colors"
            >
              Browse Technologies
              <ChevronRight size={18} className="text-white/70" />
            </Link>
          </nav>
          
          {/* Contact & Support Section */}
          <div className="px-6 py-8 bg-gray-50 mt-auto">
              <h3 className="font-helios text-xs font-bold tracking-wider uppercase text-gray-500 mb-6">
                Connect & Support
              </h3>

              <div className="flex flex-col gap-5">
                <a href="mailto:rink@startupmission.in" className="flex items-center gap-4 text-[#1b60bb] hover:text-[#113a70] transition-colors group">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-[#1b60bb] transition-colors" />
                  <div className="flex flex-col">
                    <span className="font-helios text-xs text-gray-500 font-medium">Email</span>
                    <span className="font-avenir font-medium text-[15px]">rink@startupmission.in</span>
                  </div>
                </a>

                <a href="https://linkedin.com/company/research-innovation-network-kerala/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-[#1b60bb] hover:text-[#113a70] transition-colors group">
                  <LinkedinIcon className="w-5 h-5 text-gray-400 group-hover:text-[#1b60bb] transition-colors" />
                  <div className="flex flex-col">
                    <span className="font-helios text-xs text-gray-500 font-medium">Social</span>
                    <span className="font-avenir font-medium text-[15px]">LinkedIn Profile</span>
                  </div>
                </a>
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
