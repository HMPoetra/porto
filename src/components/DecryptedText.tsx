'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  animateOnHover?: boolean;
  animateOnView?: boolean;
}

const DEFAULT_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function DecryptedText({
  text,
  speed = 35,
  maxIterations = 10,
  characters = DEFAULT_GLYPHS,
  className = '',
  encryptedClassName = 'text-brut-cyan',
  animateOnHover = true,
  animateOnView = true,
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef(false);

  const startDecryption = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    let iteration = 0;
    const targetLength = text.length;

    intervalRef.current = setInterval(() => {
      const revealed = new Set<number>();

      // Calculate how many characters from left are locked
      const lockedCount = Math.floor((iteration / (targetLength * 1.5)) * targetLength);

      for (let i = 0; i < lockedCount; i++) {
        revealed.add(i);
      }

      const nextText = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (revealed.has(index) || iteration >= targetLength * 2) {
            revealed.add(index);
            return char;
          }
          return characters[Math.floor(Math.random() * characters.length)];
        })
        .join('');

      setDisplayText(nextText);
      setRevealedIndices(new Set(revealed));

      if (revealed.size >= targetLength || iteration >= targetLength * 2) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsDecrypted(true);
      }

      iteration++;
    }, speed);
  }, [text, speed, characters]);

  // Trigger on initial view
  useEffect(() => {
    if (!animateOnView) {
      setDisplayText(text);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          startDecryption();
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [animateOnView, startDecryption, text]);

  // Handle text change (e.g. language change)
  useEffect(() => {
    startDecryption();
  }, [text, startDecryption]);

  const handleMouseEnter = () => {
    if (animateOnHover) {
      startDecryption();
    }
  };

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`inline-block select-none cursor-pointer ${className}`}
      title="Click/Hover to re-decrypt"
    >
      {displayText.split('').map((char, i) => {
        const isLocked = revealedIndices.has(i);
        return (
          <span
            key={i}
            className={isLocked ? '' : encryptedClassName}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
}
