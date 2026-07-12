/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Leaf, Heart, Sun, Wind, Moon, Flame, Zap } from 'lucide-react';
import { usePlayerStore, BlockSkin } from '../store/usePlayerStore';

interface CellProps {
  color: string | null;
  isGhost?: boolean;
  isInvalid?: boolean;
  skinOverride?: BlockSkin;
}

const getIconForColor = (color: string | null) => {
  if (!color) return null;
  const c = color.toUpperCase();
  if (c.includes('FF5252') || c.includes('FF3B30') || c.includes('RED') || c.includes('EF4444')) {
    return <Heart className="w-full h-full text-white/90" strokeWidth={3.5} />;
  }
  if (c.includes('69F0AE') || c.includes('10B981') || c.includes('GREEN') || c.includes('22C55E')) {
    return <Leaf className="w-full h-full text-white/90" strokeWidth={3.5} />;
  }
  if (c.includes('FFD740') || c.includes('EAB308') || c.includes('YELLOW') || c.includes('F59E0B')) {
    return <Sun className="w-full h-full text-white/90" strokeWidth={3.5} />;
  }
  if (c.includes('E040FB') || c.includes('A855F7') || c.includes('PURPLE') || c.includes('D946EF')) {
    return <Wind className="w-full h-full text-white/90" strokeWidth={3.5} />;
  }
  if (c.includes('448AFF') || c.includes('3B82F6') || c.includes('BLUE') || c.includes('1D4ED8')) {
    return <Moon className="w-full h-full text-white/90" strokeWidth={3.5} />;
  }
  if (c.includes('FFAB40') || c.includes('F97316') || c.includes('ORANGE')) {
    return <Flame className="w-full h-full text-white/90" strokeWidth={3.5} />;
  }
  if (c.includes('40C4FF') || c.includes('06B6D4') || c.includes('CYAN')) {
    return <Zap className="w-full h-full text-white/90" strokeWidth={3.5} />;
  }
  return null;
};

function getGemstoneGradId(color: string): string {
  const c = color.toUpperCase();
  if (c.includes('FF5252') || c.includes('FF3B30') || c.includes('RED') || c.includes('EF4444')) return 'gem-ruby';
  if (c.includes('69F0AE') || c.includes('10B981') || c.includes('GREEN') || c.includes('22C55E')) return 'gem-emerald';
  if (c.includes('FFD740') || c.includes('EAB308') || c.includes('YELLOW') || c.includes('F59E0B')) return 'gem-topaz';
  if (c.includes('E040FB') || c.includes('A855F7') || c.includes('PURPLE') || c.includes('D946EF')) return 'gem-amethyst';
  if (c.includes('448AFF') || c.includes('3B82F6') || c.includes('BLUE') || c.includes('1D4ED8')) return 'gem-sapphire';
  if (c.includes('FFAB40') || c.includes('F97316') || c.includes('ORANGE')) return 'gem-amber';
  if (c.includes('40C4FF') || c.includes('06B6D4') || c.includes('CYAN')) return 'gem-aquamarine';
  return 'gem-diamond';
}

/** Classic skin — brilliant 12-facet cut crystal gemstone with golden bezel claw frame */
const ClassicCell: React.FC<{ color: string }> = ({ color }) => {
  const gradId = getGemstoneGradId(color);
  return (
    <motion.div
      initial={{ scale: 0.75, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-full h-full relative"
    >
      <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: 'block', overflow: 'visible' }}>
        {/* Drop shadow */}
        <rect x="1" y="2.5" width="38" height="38" rx="6" fill="rgba(0,0,0,0.55)" />
        
        {/* Golden outer bezel rim */}
        <rect x="1" y="1" width="38" height="38" rx="6" fill="url(#gold-primary)" stroke="url(#gold-trim-bevel)" strokeWidth="1" />
        
        {/* Volumetric Gem Base */}
        <rect x="3.5" y="3.5" width="33" height="33" rx="4.5" fill={`url(#${gradId})`} />

        {/* ── 12 Facet Brilliant Cut Geometry ── */}
        {/* Octagonal flat table (center) */}
        <polygon points="12,12 28,12 32,16 32,24 28,28 12,28 8,24 8,16" fill="rgba(255,255,255,0.12)" />
        
        {/* Surrounding crown facets */}
        <polygon points="3.5,3.5 36.5,3.5 28,12 12,12" fill="rgba(255,255,255,0.2)" />
        <polygon points="3.5,36.5 36.5,36.5 28,28 12,28" fill="rgba(0,0,0,0.3)" />
        <polygon points="3.5,3.5 12,12 12,28 3.5,36.5" fill="rgba(255,255,255,0.08)" />
        <polygon points="36.5,3.5 28,12 28,28 36.5,36.5" fill="rgba(0,0,0,0.18)" />

        {/* Corner triangles */}
        <polygon points="3.5,3.5 12,12 8,16" fill="rgba(255,255,255,0.25)" />
        <polygon points="36.5,3.5 28,12 32,16" fill="rgba(255,255,255,0.15)" />
        <polygon points="3.5,36.5 12,28 8,24" fill="rgba(0,0,0,0.22)" />
        <polygon points="36.5,36.5 28,28 32,24" fill="rgba(0,0,0,0.32)" />

        {/* Specular glare shine sheet */}
        <rect x="4" y="4" width="32" height="12" rx="2" fill="url(#specular-glare)" pointerEvents="none" />
        
        {/* Claw Bezels at corners */}
        <path d="M 3.5,3.5 L 7,7" stroke="url(#gold-bright)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 36.5,3.5 L 33,7" stroke="url(#gold-bright)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 3.5,36.5 L 7,33" stroke="url(#gold-bright)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 36.5,36.5 L 33,33" stroke="url(#gold-bright)" strokeWidth="2" strokeLinecap="round" />

        {/* Star sparkle */}
        <path d="M30,7 L31.2,9.3 L33.5,10 L31.2,10.7 L30,13 L28.8,10.7 L26.5,10 L28.8,9.3 Z" fill="white" opacity="0.85" />
      </svg>

      {/* Inner Icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-85 pointer-events-none">
        <div className="w-[50%] h-[50%] drop-shadow-[0_2px_3px_rgba(0,0,0,0.55)]">
          {getIconForColor(color)}
        </div>
      </div>
    </motion.div>
  );
};

/** Neon skin — dark fill with glowing neon border and gold corners */
const NeonCell: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="w-full h-full rounded-[8px] flex items-center justify-center relative overflow-hidden"
    style={{
      backgroundColor: `${color}18`,
      border: `2px solid ${color}`,
      boxShadow: `0 0 10px ${color}aa, 0 0 24px ${color}33, inset 0 0 10px ${color}44`,
    }}
  >
    <div className="absolute inset-[1px] border border-white/20 rounded-[6px] pointer-events-none" />
    <div
      className="absolute inset-0 opacity-20 pointer-events-none"
      style={{
        background: `linear-gradient(transparent 45%, ${color}88 50%, transparent 55%)`,
        animation: 'shimmer 2.5s linear infinite',
      }}
    />
    <div className="opacity-70 absolute z-10 w-[50%] h-[50%] flex items-center justify-center drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
      {getIconForColor(color)}
    </div>
  </motion.div>
);

/** Crystal skin — frosted glass with high-end refraction */
const CrystalCell: React.FC<{ color: string }> = ({ color }) => {
  const gradId = getGemstoneGradId(color);
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.1, ease: 'easeOut' }}
      className="w-full h-full relative"
    >
      <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: 'block' }}>
        <rect x="1" y="1" width="38" height="38" rx="6" fill={`url(#${gradId})`} opacity="0.8" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect x="3.5" y="3.5" width="33" height="33" rx="4.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        {/* Specular glare */}
        <rect x="2" y="2" width="36" height="18" rx="4" fill="url(#specular-glare)" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center opacity-60 mix-blend-overlay scale-110 pointer-events-none">
        {getIconForColor(color)}
      </div>
    </motion.div>
  );
};

/** Matrix skin — digital rain glitch effect with glowing emerald outlines */
const MatrixCell: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="w-full h-full rounded-[8px] flex items-center justify-center relative bg-[#020617] overflow-hidden border-2"
    style={{ borderColor: `${color}88`, boxShadow: `0 0 10px ${color}66` }}
  >
    <div 
      className="absolute inset-0 opacity-40 animate-matrix pointer-events-none"
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
      01 10
    </div>
    <div className="relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] filter brightness-125 scale-90">
      {getIconForColor(color)}
    </div>
    <div className="absolute inset-0 shadow-[inset_0_0_12px_rgba(0,0,0,0.85)] pointer-events-none" />
  </motion.div>
);

/** Liquid Gold / Chrome — flowing metallic finish */
const GoldCell: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="w-full h-full relative"
  >
    <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: 'block' }}>
      <rect x="1" y="1" width="38" height="38" rx="6" fill="url(#gold-primary)" stroke="url(#gold-trim-bevel)" strokeWidth="1.5" filter="url(#bevel-emboss)" />
      {/* Specular Glare */}
      <rect x="2" y="2" width="36" height="15" rx="3" fill="url(#specular-glare)" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center opacity-85 pointer-events-none">
      <div className="w-[50%] h-[50%] drop-shadow-[0_2px_3px_rgba(71,39,18,0.6)] text-amber-950">
        {getIconForColor(color)}
      </div>
    </div>
  </motion.div>
);

export const Cell: React.FC<CellProps> = ({ color, isGhost, isInvalid, skinOverride }) => {
  const blockSkin = usePlayerStore((s) => s.blockSkin);
  const skin = skinOverride ?? blockSkin;

  return (
    <div className="w-full h-full relative overflow-hidden transition-all duration-200 rounded-[8px]">
      {/* Empty slot - Tactile Vector pocket */}
      {!color && !isGhost && (
        <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: 'block' }}>
          <rect
            x="0.5"
            y="0.5"
            width="39"
            height="39"
            rx="6"
            fill="url(#stone-bevel-grad)"
            filter="url(#inset-shadow)"
            stroke="#090d16"
            strokeWidth="0.8"
          />
        </svg>
      )}

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
            position: 'absolute',
            inset: 0,
            borderRadius: '8px',
            border: `2px dashed ${isInvalid ? 'rgba(239,68,68,0.85)' : 'rgba(16,185,129,0.85)'}`,
            background: isInvalid ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.12)',
            boxShadow: isInvalid ? '0 0 10px rgba(239,68,68,0.45)' : '0 0 10px rgba(16,185,129,0.45)',
            animation: 'pulse 1.2s ease-in-out infinite',
          }}
        />
      )}
    </div>
  );
};
