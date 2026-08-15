'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-brut-bg p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="w-full max-w-md border-4 border-black bg-brut-paper p-8 shadow-brut-xl text-center"
      >
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center border-4 border-black bg-brut-red shadow-brut-sm">
            <FaExclamationTriangle className="text-2xl text-black" />
          </div>
        </div>

        <h1 className="mb-2 font-display text-4xl text-black">
          SYSTEM{' '}
          <span className="inline-block -rotate-2 border-4 border-black bg-brut-red px-2 shadow-brut-sm">
            ERROR
          </span>
        </h1>

        <p className="mb-8 text-sm font-semibold text-black">
          Something went wrong. Our engineers have been notified.
        </p>

        {error.digest && (
          <div className="mb-6 border-2 border-black bg-black px-3 py-2">
            <p className="font-mono text-[10px] text-brut-lime">
              Error ID: {error.digest}
            </p>
          </div>
        )}

        <button
          onClick={reset}
          className="brut-btn bg-brut-yellow text-xs"
        >
          <FaRedo />
          Try Again
        </button>
      </motion.div>
    </main>
  );
}
