'use client';

import { motion } from 'framer-motion';

/**
 * Dekorasi latar Neo Brutalism: bentuk geometris flat berbingkai hitam tebal.
 * Posisi sengaja ditulis statis (bukan acak) supaya render server dan client
 * identik dan komposisinya tetap seimbang di setiap kunjungan.
 */

type Shape = {
  id: string;
  kind: 'square' | 'circle' | 'triangle' | 'cross' | 'stripes';
  top: string;
  left: string;
  size: number;
  color: string;
  rotate: number;
  duration: number;
};

const SHAPES: Shape[] = [
  { id: 's1', kind: 'square',   top: '8%',  left: '4%',  size: 64,  color: '#FFD600', rotate: 12,  duration: 9 },
  { id: 's2', kind: 'circle',   top: '18%', left: '88%', size: 80,  color: '#FF5CA8', rotate: 0,   duration: 11 },
  { id: 's3', kind: 'triangle', top: '34%', left: '92%', size: 56,  color: '#00E0C6', rotate: -8,  duration: 8 },
  { id: 's4', kind: 'cross',    top: '46%', left: '6%',  size: 48,  color: '#A3FF3C', rotate: 0,   duration: 10 },
  { id: 's5', kind: 'stripes',  top: '62%', left: '90%', size: 72,  color: '#4D7CFF', rotate: 6,   duration: 12 },
  { id: 's6', kind: 'square',   top: '74%', left: '3%',  size: 56,  color: '#FF8A3C', rotate: -14, duration: 9 },
  { id: 's7', kind: 'circle',   top: '88%', left: '85%', size: 60,  color: '#B98CFF', rotate: 0,   duration: 13 },
  { id: 's8', kind: 'triangle', top: '92%', left: '12%', size: 50,  color: '#FFD600', rotate: 20,  duration: 10 },
];

const ShapeGlyph = ({ shape }: { shape: Shape }) => {
  const { kind, size, color } = shape;

  if (kind === 'circle') {
    return (
      <div
        className="rounded-full border-4 border-black"
        style={{ width: size, height: size, background: color }}
      />
    );
  }

  if (kind === 'triangle') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <polygon
          points="50,6 96,94 4,94"
          fill={color}
          stroke="#000"
          strokeWidth={10}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === 'cross') {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <path
          d="M35 5 H65 V35 H95 V65 H65 V95 H35 V65 H5 V35 H35 Z"
          fill={color}
          stroke="#000"
          strokeWidth={8}
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === 'stripes') {
    return (
      <div
        className="border-4 border-black"
        style={{
          width: size,
          height: size,
          background: `repeating-linear-gradient(45deg, ${color} 0 8px, #000 8px 12px)`,
        }}
      />
    );
  }

  return (
    <div
      className="border-4 border-black"
      style={{ width: size, height: size, background: color }}
    />
  );
};

const BackgroundParticles = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {SHAPES.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{ top: shape.top, left: shape.left, rotate: shape.rotate }}
          animate={{ y: [0, -18, 0] }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <ShapeGlyph shape={shape} />
        </motion.div>
      ))}
    </div>
  );
};

export default BackgroundParticles;
