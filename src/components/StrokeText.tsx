'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface StrokeTextProps {
  text: string;
  badgeText?: string;
  className?: string;
}

export default function StrokeText({
  text,
  badgeText = 'I?',
  className = '',
}: StrokeTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex flex-wrap items-center gap-3 cursor-pointer select-none ${className}`}
      title="Hover to replay stroke effect"
    >
      {/* Animated Stroke Text Container */}
      <div className="relative inline-block pointer-events-none">
        {/* Layer 1: Animated Hollow Stroke Outline (Draws first) */}
        <motion.span
          initial={{ opacity: 1 }}
          animate={{
            opacity: [0.3, 1, 0.8],
          }}
          transition={{ duration: 1 }}
          className="font-display leading-none tracking-tight block text-transparent pointer-events-none"
          style={{
            WebkitTextStroke: '3px #000000',
            filter: isHovered ? 'drop-shadow(3px 3px 0px #00E0C6)' : 'none',
            transition: 'filter 0.2s ease',
          }}
        >
          {text}
        </motion.span>

        {/* Layer 2: Animated Solid Fill Sweep (Wipes in over the stroke) */}
        <motion.span
          initial={{ clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }}
          animate={{
            clipPath: isHovered
              ? [
                  'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                  'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                ]
              : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display leading-none tracking-tight absolute inset-0 text-black block pointer-events-none"
          style={{
            WebkitTextStroke: '1px #000000',
          }}
        >
          {text}
        </motion.span>
      </div>

      {/* Trailing Badge with spring wobble & pop */}
      {badgeText && (
        <motion.span
          initial={{ scale: 0.7, rotate: 0, opacity: 0 }}
          animate={{
            scale: 1,
            rotate: isHovered ? 4 : -2,
            opacity: 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 15,
            delay: 0.4,
          }}
          whileHover={{ scale: 1.15, rotate: 6 }}
          className="inline-block border-4 border-black bg-brut-yellow px-3 py-1 font-display leading-none text-black shadow-brut-sm hover:bg-brut-pink transition-colors pointer-events-auto"
        >
          {badgeText}
        </motion.span>
      )}
    </div>
  );
}
