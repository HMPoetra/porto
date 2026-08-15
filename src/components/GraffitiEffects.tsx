'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';

const CLICK_COLORS = [
  '#FFD600', // Brut Yellow
  '#FF5CA8', // Brut Pink
  '#00E0C6', // Brut Cyan
  '#A3FF3C', // Brut Lime
  '#B98CFF', // Brut Violet
  '#FF8A3C', // Brut Orange
  '#4D7CFF', // Brut Blue
];

interface ClickRipple {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function GraffitiEffects() {
  const [ripples, setRipples] = useState<ClickRipple[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Framer motion scroll progress tracking
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Capture phase pointerdown handler to ensure click ripple ALWAYS fires on every element
  const handlePointerDown = useCallback((e: PointerEvent | MouseEvent) => {
    const eventId = Date.now() + Math.random();
    const x = e.clientX;
    const y = e.clientY;
    const randomColor = CLICK_COLORS[Math.floor(Math.random() * CLICK_COLORS.length)];

    const newRipple: ClickRipple = { id: eventId, x, y, color: randomColor };

    setRipples((prev) => [...prev.slice(-4), newRipple]);

    // Fast cleanup after subtle 450ms animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== eventId));
    }, 450);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    // Use capture phase so nothing can intercept or block the ripple
    window.addEventListener('pointerdown', handlePointerDown, { capture: true, passive: true });
    return () => window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
  }, [isClient, handlePointerDown]);

  if (!isClient) return null;

  return (
    <>
      {/* 1. SCROLL PROGRESS BAR (Slim & Minimalist) */}
      <div className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-1.5 bg-black/5">
        <motion.div
          className="h-full bg-gradient-to-r from-brut-yellow via-brut-pink to-brut-cyan border-b border-black"
          style={{ scaleX, transformOrigin: '0%' }}
        />
      </div>

      {/* 2. SUBTLE CLICK RIPPLE (Ultra High Z-Index & Capture Guaranteed) */}
      <div className="fixed inset-0 z-[999999] pointer-events-none overflow-hidden">
        <AnimatePresence>
          {ripples.map((ripple) => (
            <div key={ripple.id} className="absolute inset-0 pointer-events-none">
              {/* Outer expanding geometric ring with dynamic randomized color */}
              <motion.div
                initial={{ scale: 0.2, opacity: 0.9 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="absolute border-2 border-black rounded-full shadow-brut-xs pointer-events-none"
                style={{
                  left: ripple.x - 14,
                  top: ripple.y - 14,
                  width: 28,
                  height: 28,
                  backgroundColor: ripple.color,
                }}
              />

              {/* Inner crisp black center dot */}
              <motion.div
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute rounded-full bg-black pointer-events-none"
                style={{
                  left: ripple.x - 3,
                  top: ripple.y - 3,
                  width: 6,
                  height: 6,
                }}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
