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

/** Classic skin — original premium look */
const ClassicCell: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="w-full h-full rounded-md sm:rounded-lg border-t-2 border-l-2 border-white/60 flex items-center justify-center relative"
    style={{
      backgroundColor: color,
      boxShadow: `inset 4px 4px 8px rgba(255,255,255,0.6), inset -4px -4px 8px rgba(0,0,0,0.4), 0 6px 12px rgba(0,0,0,0.3)`,
    }}
  >
    <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-overlay">
      {getIconForColor(color)}
    </div>
    <div className="w-[75%] h-[75%] rounded-md border-2 border-white/30 bg-gradient-to-br from-white/20 to-black/10 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]">
      <div className="w-full h-full flex items-center justify-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
        {getIconForColor(color)}
      </div>
    </div>
    {/* Shine */}
    <div className="absolute top-1 left-1 w-1/3 h-1/3 bg-white/30 rounded-full blur-[2px] -rotate-45" />
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
        'w-full h-full rounded-md sm:rounded-lg transition-all duration-300 relative overflow-hidden',
        !color && 'bg-slate-200/40 dark:bg-slate-800/40 shadow-inner',
        isGhost && 'animate-pulse',
        isInvalid && 'bg-red-500/20'
      )}
    >
      {/* Filled cell — render skin */}
      {color && !isGhost && (
        skin === 'neon' ? <NeonCell color={color} /> :
        skin === 'crystal' ? <CrystalCell color={color} /> :
        skin === 'matrix' ? <MatrixCell color={color} /> :
        skin === 'gold' ? <GoldCell color={color} /> :
        <ClassicCell color={color} />
      )}

      {/* Ghost overlay */}
      {isGhost && (
        <div
          className={cn(
            'absolute inset-0 border-2 border-dashed rounded-md sm:rounded-lg',
            isInvalid ? 'border-red-500/50' : 'border-white/40'
          )}
        />
      )}
    </div>
  );
};
