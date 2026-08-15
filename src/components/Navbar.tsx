'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const NAV_DEFINITIONS = [
  { key: 'home' as const, href: '#home', color: 'hover:bg-brut-yellow', sectionId: 'home' },
  { key: 'about' as const, href: '#about', color: 'hover:bg-brut-pink', sectionId: 'about' },
  { key: 'skills' as const, href: '#skills', color: 'hover:bg-brut-cyan', sectionId: 'skills' },
  { key: 'experience' as const, href: '#experience', color: 'hover:bg-brut-orange', sectionId: 'experience' },
  { key: 'projects' as const, href: '#projects', color: 'hover:bg-brut-lime', sectionId: 'projects' },
  { key: 'certifications' as const, href: '#certifications', color: 'hover:bg-brut-yellow', sectionId: 'certifications' },
  { key: 'contact' as const, href: '#contact', color: 'hover:bg-brut-orange', sectionId: 'contact' },
];

const ACTIVE_COLORS: Record<string, string> = {
  '#home': 'bg-brut-yellow',
  '#about': 'bg-brut-pink',
  '#skills': 'bg-brut-cyan',
  '#experience': 'bg-brut-orange',
  '#projects': 'bg-brut-lime',
  '#certifications': 'bg-brut-yellow',
  '#contact': 'bg-brut-orange',
};

const Navbar = () => {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent scroll when mobile menu open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Scroll spy for accurate active section detection
  useEffect(() => {
    if (!mounted) return;

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 180;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 1. If at top of the page -> 'home'
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }

      // 2. If near bottom of the page -> 'contact'
      if (window.scrollY + windowHeight >= documentHeight - 120) {
        setActiveSection('contact');
        return;
      }

      // 3. Check each section from bottom to top
      const sectionIds = ['contact', 'certifications', 'projects', 'experience', 'skills', 'about'];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            return;
          }
        }
      }

      setActiveSection('home');
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy(); // Initial check

    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [mounted]);

  if (!mounted) return null;

  const navLinks = NAV_DEFINITIONS.map((def) => ({
    ...def,
    name: t.nav[def.key],
  }));

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    setActiveSection(targetId); // Instant visual feedback

    if (targetId === 'home' || href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 90;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-[999] transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'
        }`}
    >
      <motion.div
        initial={{ y: -120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'circOut' }}
        className="container mx-auto px-4 md:px-6"
      >
        <div
          className={`mx-auto flex items-center justify-between border-4 border-black bg-brut-paper px-4 py-2 transition-all duration-300 md:px-6 ${isScrolled ? 'max-w-5xl shadow-brut' : 'max-w-7xl shadow-brut-lg'
            }`}
        >
          {/* Logo */}
          <button
            onClick={(e) => handleNavClick(e, '#home')}
            className="group relative z-[1001] cursor-pointer border-4 border-black bg-brut-yellow px-3 py-1 font-display text-xl tracking-tighter text-black shadow-brut-xs transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brut-pink hover:shadow-brut-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            aria-label="Back to top"
          >
            H<span className="text-brut-red">.</span>MP
          </button>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link, i) => {
              const isActive = activeSection === link.sectionId;
              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative border-2 px-3 py-2 font-display text-[11px] tracking-widest text-black transition-all duration-150 ${isActive
                      ? `${ACTIVE_COLORS[link.href]} border-black shadow-brut-xs`
                      : `border-transparent ${link.color} hover:border-black`
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="active-indicator"
                      className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 bg-black"
                    />
                  )}
                </motion.a>
              );
            })}
          </div>

          {/* Right side: Mobile Toggle */}
          <div className="relative z-[1001] flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="cursor-pointer border-4 border-black bg-brut-cyan p-1.5 text-black shadow-brut-xs transition-all duration-150 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} strokeWidth={3} /> : <Menu size={22} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 right-4 left-4 z-[1000] md:hidden"
          >
            <div className="border-4 border-black bg-brut-paper p-4 shadow-brut-xl">
              <div className="flex flex-col gap-3">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.sectionId;
                  return (
                    <button
                      key={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full cursor-pointer border-4 border-black px-4 py-3 text-left font-display text-sm tracking-widest text-black shadow-brut-xs transition-all duration-150 active:translate-x-1 active:translate-y-1 active:shadow-none ${isActive ? ACTIVE_COLORS[link.href] : `bg-brut-paper ${link.color}`
                        }`}
                    >
                      {link.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
