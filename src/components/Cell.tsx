/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Heart, Sun, Wind, Moon, Flame, Zap } from 'lucide-react';
import { usePlayerStore, BlockSkin } from '../store/usePlayerStore';

// Local utility for tailwind class merging
function cn(...classes: any[]) {
  return classes.filter(Boolean).filter(c => typeof c === 'string').join(' ');
}


interface CellProps {
  color: string | null;
  isGhost?: boolean;
  isInvalid?: boolean;
  skinOverride?: BlockSkin; // allow tutorial to use classic always
}

const getIconForColor = (color: string | null) => {
  if (!color) return null;
  const c = color.toUpperCase();
  if (c.includes('FF5252')) return <Heart className="w-1/2 h-1/2 text-white/80" strokeWidth={3} />;
  if (c.includes('69F0AE')) return <Leaf className="w-1/2 h-1/2 text-white/80" strokeWidth={3} />;
  if (c.includes('FFD740')) return <Sun className="w-1/2 h-1/2 text-white/80" strokeWidth={3} />;
  if (c.includes('E040FB')) return <Wind className="w-1/2 h-1/2 text-white/80" strokeWidth={3} />;
  if (c.includes('448AFF')) return <Moon className="w-1/2 h-1/2 text-white/80" strokeWidth={3} />;
  if (c.includes('FFAB40')) return <Flame className="w-1/2 h-1/2 text-white/80" strokeWidth={3} />;
  if (c.includes('40C4FF')) return <Zap className="w-1/2 h-1/2 text-white/80" strokeWidth={3} />;
  return null;
};

/** Classic skin — premium 3D look optimised for dark backgrounds */
const ClassicCell: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    initial={{ scale: 0.75, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.12, ease: [0.34, 1.56, 0.64, 1] }}
    className="w-full h-full rounded-[6px] flex items-center justify-center relative overflow-hidden"
    style={{
      backgroundColor: color,
      boxShadow: [
        `inset 3px 3px 6px rgba(255,255,255,0.45)`,
        `inset -3px -3px 6px rgba(0,0,0,0.55)`,
        `0 0 10px ${color}88`,
        `0 0 22px ${color}44`,
        `0 4px 14px rgba(0,0,0,0.55)`,
      ].join(', '),
      border: `1px solid ${color}cc`,
    }}
  >
    {/* top-left highlight bevel */}
    <div className="absolute inset-0 rounded-[6px] pointer-events-none"
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, transparent 50%)' }} />
    {/* inner icon */}
    <div className="relative z-10 w-[55%] h-[55%] flex items-center justify-center opacity-60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
      {getIconForColor(color)}
    </div>
    {/* Shine spot */}
    <div className="absolute top-[10%] left-[10%] w-[28%] h-[28%] bg-white/40 rounded-full blur-[3px]" />
  </motion.div>
);

/** Neon skin — dark fill with glowing neon border */
const NeonCell: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="w-full h-full rounded-md sm:rounded-lg flex items-center justify-center relative overflow-hidden"
    style={{
      backgroundColor: `${color}22`,
      border: `2px solid ${color}`,
      boxShadow: `0 0 8px ${color}99, 0 0 20px ${color}44, inset 0 0 8px ${color}33`,
    }}
  >
    {/* Neon scan line */}
    <div
      className="absolute inset-0 opacity-20"
      style={{
        background: `linear-gradient(transparent 45%, ${color}88 50%, transparent 55%)`,
        animation: 'shimmer 3s linear infinite',
      }}
    />
    <div className="opacity-60 absolute inset-0 flex items-center justify-center">{getIconForColor(color)}</div>
  </motion.div>
);

/** Crystal skin — frosted glass with high-end refraction refraction */
const CrystalCell: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="w-full h-full rounded-md sm:rounded-lg relative overflow-hidden ring-1 ring-white/30"
    style={{
      background: `linear-gradient(135deg, ${color}66 0%, ${color}33 50%, ${color}77 100%)`,
      backdropFilter: 'blur(8px)',
      boxShadow: `inset 0 1px 2px rgba(255,255,255,0.6), 0 4px 15px ${color}55`,
    }}
  >
    <div className="absolute inset-0 opacity-40 animate-shine-sweep bg-gradient-to-r from-transparent via-white to-transparent w-full h-full -skew-x-12" />
    <div className="absolute inset-0 flex items-center justify-center opacity-40 mix-blend-overlay scale-110">
      {getIconForColor(color)}
    </div>
    <div className="absolute inset-2 border border-white/20 rounded-sm sm:rounded-md pointer-events-none" />
  </motion.div>
);

/** Matrix skin — digital rain glitch effect */
const MatrixCell: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="w-full h-full rounded-md sm:rounded-lg flex items-center justify-center relative bg-black overflow-hidden border-2"
    style={{ borderColor: `${color}88` }}
  >
    <div 
      className="absolute inset-0 opacity-40 animate-matrix"
      style={{ 
        backgroundImage: `linear-gradient(0deg, transparent 0%, ${color} 50%, transparent 100%)`,
        backgroundSize: '100% 400%',
        fontFamily: 'monospace',
        fontSize: '8px',
        color: color,
        display: 'flex',
        flexWrap: 'wrap',
        lineHeight: '6px',
        justifyContent: 'center',
        padding: '2px'
      }}
    >
      01101110 1010110 01101110 1010110
    </div>
    <div className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] filter brightness-125">
      {getIconForColor(color)}
    </div>
    <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]" />
  </motion.div>
);

/** Liquid Gold / Chrome — flowing metallic finish */
const GoldCell: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="w-full h-full rounded-md sm:rounded-lg flex items-center justify-center relative overflow-hidden"
    style={{
      background: `linear-gradient(135deg, #1e293b 0%, ${color} 40%, #ffffff 50%, ${color} 60%, #0f172a 100%)`,
      backgroundSize: '300% 300%',
      border: '1.5px solid rgba(255,255,255,0.4)',
      boxShadow: `0 6px 20px ${color}66, inset 0 2px 5px rgba(255,255,255,0.8)`
    }}
  >
    <div className="absolute inset-0 animate-glow-flow opacity-60 bg-gradient-to-tr from-transparent via-white/50 to-transparent" />
    <div className="relative z-10 drop-shadow-lg scale-90 filter brightness-90 contrast-125">
      {getIconForColor(color)}
    </div>
    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
  </motion.div>
);

export const Cell: React.FC<CellProps> = ({ color, isGhost, isInvalid, skinOverride }) => {
  const blockSkin = usePlayerStore((s) => s.blockSkin);
  const skin = skinOverride ?? blockSkin;

  return (
    <div
      className={cn(
        'w-full h-full relative overflow-hidden transition-all duration-200',
      )}
      style={{
        borderRadius: '6px',
        ...((!color && !isGhost) ? {
          background: 'rgba(255,255,255,0.025)',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.04)',
        } : {}),
        ...(isInvalid ? { background: 'rgba(239,68,68,0.15)' } : {}),
      }}
    >
      {/* Filled cell — render skin */}
      {color && !isGhost && (
        skin === 'neon' ? <NeonCell color={color} /> :
        skin === 'crystal' ? <CrystalCell color={color} /> :
        skin === 'matrix' ? <MatrixCell color={color} /> :
        skin === 'gold' ? <GoldCell color={color} /> :
        <ClassicCell color={color} />
      )}

      {/* Ghost placement preview */}
      {isGhost && (
        <div
          style={{
            position: 'absolute', inset: 0, borderRadius: '6px',
            border: `2px dashed ${isInvalid ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.5)'}`,
            background: isInvalid ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.07)',
            animation: 'pulse 1.2s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
};
