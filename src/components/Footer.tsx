'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion';
import { FaCode, FaGamepad } from 'react-icons/fa';
import { useLanguage } from '@/context/LanguageContext';

const INITIAL_REPEAT = 4;

type RibbonProps = {
  baseVelocity: number;
  ribbonClass: string;
  itemHoverClass: string;
  borderClass: string;
  items: { label: string; Icon: React.ElementType }[];
};

const Ribbon = ({ baseVelocity, ribbonClass, itemHoverClass, borderClass, items }: RibbonProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 60, stiffness: 300 });

  const velocityFactor = useTransform(smoothVelocity, [0, 1200], [0, 5], { clamp: false });
  const rawSkew = useTransform(smoothVelocity, [-2500, 0, 2500], [4, 0, -4], { clamp: true });
  const skewX = useSpring(rawSkew, { damping: 40, stiffness: 250 });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (isPaused || prefersReducedMotion) return;

    const factor = velocityFactor.get();
    if (factor < -0.05) direction.current = -1;
    else if (factor > 0.05) direction.current = 1;

    const boost = 1 + Math.min(Math.abs(factor), 6);
    const dt = Math.min(delta, 50) / 1000;

    baseX.set(baseX.get() + direction.current * baseVelocity * boost * dt);
  });

  return (
    <div
      className={`relative flex overflow-hidden ${borderClass} ${ribbonClass}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-hidden="true"
    >
      <motion.div className="flex whitespace-nowrap" style={{ x, skewX }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {Array.from({ length: INITIAL_REPEAT }).map((_, r) =>
              items.map(({ label, Icon }) => (
                <span key={`${copy}-${r}-${label}`} className="flex items-center">
                  <span
                    className={`flex items-center gap-2 border-2 border-transparent px-3 py-1.5 font-display text-[11px] tracking-[0.3em] transition-colors duration-150 ${itemHoverClass}`}
                  >
                    <Icon className="shrink-0 text-sm" />
                    {label}
                  </span>
                  <span className="px-2 text-sm">★</span>
                </span>
              ))
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const tickerItems = [
    { label: t.footer.tickerDay, Icon: FaCode },
    { label: t.footer.tickerNight, Icon: FaGamepad },
  ];

  return (
    <footer className="relative z-10 border-t-4 border-black bg-black">
      <Ribbon
        baseVelocity={4}
        ribbonClass="bg-brut-yellow text-black"
        itemHoverClass="hover:border-black hover:bg-black hover:text-brut-yellow"
        borderClass="border-b-4 border-black"
        items={tickerItems}
      />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Left: Copyright */}
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="border-4 border-black bg-brut-pink px-3 py-1.5 font-display text-lg tracking-tighter text-black">
              H<span className="text-brut-paper">.</span>MP
            </span>
            <div className="text-xs font-bold text-brut-paper">
              © {currentYear} {t.footer.allRights}
            </div>
          </div>

          {/* Right: Tech Stack & Quote */}
          <div className="flex flex-col items-center gap-3 md:items-end">
            <div className="flex items-center gap-2 border-4 border-brut-paper bg-black px-3 py-1.5">
              <FaCode className="text-brut-cyan" />
              <span className="text-[11px] font-bold text-brut-paper">
                Next.js, TypeScript &amp; Tailwind CSS
              </span>
            </div>
            <div className="flex items-center gap-2 border-4 border-brut-paper bg-black px-3 py-1.5">
              <FaGamepad className="text-brut-lime" />
              <span className="text-[11px] font-bold text-brut-paper">
                {t.footer.quote}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Ribbon
        baseVelocity={-3}
        ribbonClass="bg-brut-cyan text-black"
        itemHoverClass="hover:border-black hover:bg-black hover:text-brut-cyan"
        borderClass="border-t-4 border-black"
        items={tickerItems}
      />
    </footer>
  );
};

export default Footer;
