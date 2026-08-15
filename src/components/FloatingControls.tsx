'use client';

import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const FloatingControls = () => {
  return (
    <motion.aside
      aria-label="Language & Theme Preferences"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="fixed bottom-6 left-6 z-[99] flex items-center gap-2 border-4 border-black bg-brut-paper p-1.5 shadow-brut transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brut-lg"
    >
      <LanguageToggle />
      <ThemeToggle />
    </motion.aside>
  );
};

export default FloatingControls;
