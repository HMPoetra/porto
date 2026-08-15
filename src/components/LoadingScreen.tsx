'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false); // Default false agar tidak muncul di awal
  const [statusText, setStatusText] = useState('INITIALIZING...');

  const phrases = [
    "REBOOTING SYSTEM...",
    "RE-STABILIZING ASSETS...",
    "RELOADING NEBULA...",
    "SYNCING DATA...",
    "RESTORE COMPLETE"
  ];

  useEffect(() => {
    // Cek apakah halaman di-refresh
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    const isRefresh = navigation && navigation.type === 'reload';

    if (isRefresh) {
      setIsLoading(true);

      // Simulasi loading progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsLoading(false), 500);
            return 100;
          }
          return Math.min(100, prev + Math.floor(Math.random() * 15) + 5);
        });
      }, 150);

      const textInterval = setInterval(() => {
        setStatusText(phrases[Math.floor(Math.random() * phrases.length)]);
      }, 600);

      return () => {
        clearInterval(interval);
        clearInterval(textInterval);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-brut-yellow"
          data-loading="true"
        >
          {/* Garis diagonal brutalist */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #000 0 10px, transparent 10px 30px)',
            }}
          />

          <div className="relative w-[280px] border-4 border-black bg-brut-paper p-6 shadow-brut-xl md:w-[420px] md:p-8">
            <div className="mb-6 flex items-center justify-between border-b-4 border-black pb-4">
              <span className="font-display text-3xl tracking-tighter text-black md:text-4xl">
                H<span className="text-brut-pink">.</span>MP
              </span>
              <span className="border-4 border-black bg-brut-cyan px-2 py-1 font-mono text-xs font-black text-black">
                {progress}%
              </span>
            </div>

            <motion.span
              key={statusText}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-2 block font-mono text-[11px] font-black tracking-[0.15em] text-black uppercase"
            >
              {statusText}
            </motion.span>

            {/* Progress bar berkotak */}
            <div className="h-6 w-full border-4 border-black bg-brut-paper p-0.5">
              <motion.div
                className="h-full bg-brut-pink"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <p className="mt-4 border-t-4 border-black pt-3 text-center text-[9px] font-bold tracking-widest text-black uppercase">
              System Reboot Detected — Restoring Session
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
