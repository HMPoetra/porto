'use client';

import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-9 w-[76px] border-4 border-black bg-brut-paper shadow-brut-xs" />
    );
  }

  const isId = language === 'id';

  return (
    <motion.button
      whileHover={{ y: -2, x: -2 }}
      whileTap={{ y: 2, x: 2 }}
      onClick={toggleLanguage}
      className="group relative flex h-9 items-center justify-between border-4 border-black bg-brut-paper p-0.5 shadow-brut-xs transition-all duration-150 hover:shadow-brut-sm cursor-pointer"
      aria-label={isId ? 'Ganti ke Bahasa Inggris (Switch to English)' : 'Switch to Indonesian (Ganti ke Bahasa Indonesia)'}
      title={isId ? 'Bahasa Indonesia (Klik untuk English)' : 'English (Click for Indonesian)'}
    >
      {/* Indicator Pills */}
      <div className="flex items-center">
        <span
          className={`flex h-6 items-center px-1.5 font-display text-[10px] font-black tracking-wider transition-colors duration-150 ${
            isId
              ? 'border-2 border-black bg-brut-yellow text-black shadow-none'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          ID
        </span>
        <span className="text-[10px] font-black text-black px-0.5 select-none">/</span>
        <span
          className={`flex h-6 items-center px-1.5 font-display text-[10px] font-black tracking-wider transition-colors duration-150 ${
            !isId
              ? 'border-2 border-black bg-brut-cyan text-black shadow-none'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          EN
        </span>
      </div>
    </motion.button>
  );
};

export default LanguageToggle;
