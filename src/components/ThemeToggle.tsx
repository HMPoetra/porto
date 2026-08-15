'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Placeholder to prevent layout shift
    return (
      <div className="h-9 w-[94px] border-4 border-black bg-brut-paper shadow-brut-xs" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <motion.button
      whileHover={{ y: -2, x: -2 }}
      whileTap={{ y: 2, x: 2 }}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="group relative flex h-9 items-center justify-between border-4 border-black bg-brut-paper p-0.5 shadow-brut-xs transition-all duration-150 hover:shadow-brut-sm cursor-pointer"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      title={isDark ? 'Light Mode' : 'Dark Mode'}
    >
      <div className="flex items-center">
        {/* LIGHT Option */}
        <span
          className={`flex h-6 items-center px-1.5 font-display text-[9px] font-black tracking-wider transition-colors duration-150 ${
            !isDark
              ? 'border-2 border-black bg-brut-yellow text-black shadow-none'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          LIGHT
        </span>

        <span className="text-[9px] font-black text-black px-0.5 select-none">/</span>

        {/* DARK Option */}
        <span
          className={`flex h-6 items-center px-1.5 font-display text-[9px] font-black tracking-wider transition-colors duration-150 ${
            isDark
              ? 'border-2 border-black bg-brut-pink text-black shadow-none'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          DARK
        </span>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
