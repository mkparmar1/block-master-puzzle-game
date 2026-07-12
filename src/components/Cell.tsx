/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { usePlayerStore, BlockSkin } from '../store/usePlayerStore';

interface CellProps {
  color: string | null;
  isGhost?: boolean;
  isInvalid?: boolean;
  skinOverride?: BlockSkin;
}

/** Map a block color hex to its gem gradient ID */
function getGemstoneGradId(color: string): string {
  const c = color.toUpperCase();
  if (c.includes('FF5252') || c.includes('FF3B30') || c.includes('RED') || c.includes('EF4444')) return 'gem-ruby';
  if (c.includes('69F0AE') || c.includes('10B981') || c.includes('GREEN') || c.includes('22C55E')) return 'gem-emerald';
  if (c.includes('FFD740') || c.includes('EAB308') || c.includes('YELLOW') || c.includes('F59E0B')) return 'gem-topaz';
  if (c.includes('E040FB') || c.includes('A855F7') || c.includes('PURPLE') || c.includes('D946EF')) return 'gem-amethyst';
  if (c.includes('448AFF') || c.includes('3B82F6') || c.includes('BLUE') || c.includes('1D4ED8')) return 'gem-sapphire';
  if (c.includes('FFAB40') || c.includes('F97316') || c.includes('ORANGE')) return 'gem-amber';
  if (c.includes('40C4FF') || c.includes('06B6D4') || c.includes('CYAN')) return 'gem-aquamarine';
  // Pink/magenta fallback → ruby-pink
  return 'gem-ruby';
}

/* ─── Jungle Jewel Gem Cell ──────────────────────────────────────────
   Matches the reference game style:
   • Gold square frame with beveled border
   • Radial gemstone gradient interior
   • Diamond-cut facet geometry
   • Top specular glare + corner sparkle
────────────────────────────────────────────────────────────────────── */
const JungleGemCell: React.FC<{ color: string }> = ({ color }) => {
  const gradId = getGemstoneGradId(color);
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
      className="w-full h-full relative"
    >
      <svg width="100%" height="100%" viewBox="0 0 44 44" style={{ display: 'block', overflow: 'visible' }}>
        {/* Drop shadow beneath tile */}
        <rect x="2" y="4" width="40" height="40" rx="5" fill="rgba(0,0,0,0.7)" />

        {/* Outer gold frame — bright top, dark bottom (bevel) */}
        <rect x="1" y="1" width="42" height="42" rx="5"
          fill="url(#jj-gold-outer)" stroke="url(#jj-gold-stroke)" strokeWidth="1.2" />

        {/* Inner frame inset — slightly smaller */}
        <rect x="4" y="4" width="36" height="36" rx="3.5"
          fill="url(#jj-gold-inner)" />

        {/* Gem core */}
        <rect x="5.5" y="5.5" width="33" height="33" rx="3"
          fill={`url(#${gradId})`} />

        {/* Diamond facet — top triangle (light) */}
        <polygon points="22,5.5 38.5,5.5 38.5,14 22,22"
          fill="rgba(255,255,255,0.22)" />
        {/* Diamond facet — bottom triangle (dark) */}
        <polygon points="22,22 38.5,30 38.5,38.5 22,38.5"
          fill="rgba(0,0,0,0.22)" />
        {/* Diamond facet — left triangle (mid) */}
        <polygon points="5.5,5.5 22,5.5 22,22 5.5,14"
          fill="rgba(255,255,255,0.14)" />
        {/* Diamond facet — bottom-left (darkest) */}
        <polygon points="5.5,30 22,22 22,38.5 5.5,38.5"
          fill="rgba(0,0,0,0.28)" />

        {/* Centre octagon table highlight */}
        <polygon points="15,15 29,15 33,19 33,25 29,29 15,29 11,25 11,19"
          fill="rgba(255,255,255,0.10)" />

        {/* Top specular glare strip */}
        <rect x="5.5" y="5.5" width="33" height="13" rx="3"
          fill="url(#jj-specular)" />

        {/* Gold frame inner highlight line */}
        <rect x="4" y="4" width="36" height="36" rx="3.5"
          fill="none" stroke="rgba(255,240,120,0.25)" strokeWidth="0.8" />

        {/* Corner sparkle (top-right) */}
        <path d="M34,8 L35.2,10.5 L37.8,11 L35.2,11.5 L34,14 L32.8,11.5 L30.2,11 L32.8,10.5 Z"
          fill="white" opacity="0.9" />
      </svg>
    </motion.div>
  );
};

/** Neon skin — unchanged from original */
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
  </motion.div>
);

/** Crystal skin */
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
        <rect x="2" y="2" width="36" height="18" rx="4" fill="url(#specular-glare)" />
      </svg>
    </motion.div>
  );
};

/** Matrix skin */
const MatrixCell: React.FC<{ color: string }> = ({ color }) => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="w-full h-full rounded-[8px] flex items-center justify-center relative bg-[#020617] overflow-hidden border-2"
    style={{ borderColor: `${color}88`, boxShadow: `0 0 10px ${color}66` }}
  >
    <div
      className="absolute inset-0 opacity-40 pointer-events-none"
      style={{
        backgroundImage: `linear-gradient(0deg, transparent 0%, ${color} 50%, transparent 100%)`,
        backgroundSize: '100% 400%',
      }}
    />
    <div className="absolute inset-0 shadow-[inset_0_0_12px_rgba(0,0,0,0.85)] pointer-events-none" />
  </motion.div>
);

/** Gold skin */
const GoldCell: React.FC<{ color: string }> = () => (
  <motion.div
    initial={{ scale: 0.85, opacity: 0 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ duration: 0.1, ease: 'easeOut' }}
    className="w-full h-full relative"
  >
    <svg width="100%" height="100%" viewBox="0 0 40 40" style={{ display: 'block' }}>
      <rect x="1" y="1" width="38" height="38" rx="6" fill="url(#gold-primary)" stroke="url(#gold-trim-bevel)" strokeWidth="1.5" filter="url(#bevel-emboss)" />
      <rect x="2" y="2" width="36" height="15" rx="3" fill="url(#specular-glare)" />
    </svg>
  </motion.div>
);

/* ─── Empty Cell — Dark Cushion/Pillow ───────────────────────────────
   Matches reference: recessed dark square with subtle inner shadow,
   giving a "pillow" or "cushion" tactile feel
────────────────────────────────────────────────────────────────────── */
const EmptyCell: React.FC = () => (
  <svg width="100%" height="100%" viewBox="0 0 44 44" style={{ display: 'block' }}>
    {/* Outer slight shadow/depth under the cushion */}
    <rect x="1" y="2" width="42" height="42" rx="5.5" fill="rgba(0,0,0,0.4)" />
    {/* Dark cushion base */}
    <rect x="1" y="1" width="42" height="42" rx="5.5" fill="url(#jj-empty-cell)" />
    {/* Inner inset shadow — top and left darker to create depth */}
    <rect x="1" y="1" width="42" height="42" rx="5.5"
      fill="none"
      stroke="rgba(0,0,0,0.55)"
      strokeWidth="3"
      style={{ filter: 'blur(1px)' }}
    />
    {/* Subtle top highlight edge */}
    <rect x="2" y="2" width="40" height="2" rx="2"
      fill="rgba(255,255,255,0.05)" />
    {/* Very subtle inner cross grain */}
    <rect x="3" y="3" width="38" height="38" rx="4"
      fill="none"
      stroke="rgba(255,255,255,0.03)"
      strokeWidth="1" />
  </svg>
);

/* ─── GlobalSvgDefs additions ───────────────────────────────────────
   These inline defs are added alongside GlobalSvgDefs.tsx in the DOM.
   They define the Jungle Jewel gold frame and empty cell gradients.
────────────────────────────────────────────────────────────────────── */
export const JungleJewelDefs: React.FC = () => (
  <svg width="0" height="0" style={{ position: 'fixed', left: -9999, top: -9999 }}>
    <defs>
      {/* Gold outer frame gradient — bright at top, dark at bottom */}
      <linearGradient id="jj-gold-outer" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f5d84a" />
        <stop offset="20%" stopColor="#c9a227" />
        <stop offset="50%" stopColor="#8b6914" />
        <stop offset="80%" stopColor="#5a400a" />
        <stop offset="100%" stopColor="#3d2a05" />
      </linearGradient>

      {/* Gold inner border gradient */}
      <linearGradient id="jj-gold-inner" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8b6914" />
        <stop offset="50%" stopColor="#5a400a" />
        <stop offset="100%" stopColor="#3d2a05" />
      </linearGradient>

      {/* Gold stroke bevel */}
      <linearGradient id="jj-gold-stroke" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fef3a0" stopOpacity="0.9" />
        <stop offset="40%" stopColor="#d4a017" />
        <stop offset="100%" stopColor="#2d1a02" />
      </linearGradient>

      {/* Specular glare for gem tiles */}
      <linearGradient id="jj-specular" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="60%" stopColor="#ffffff" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
      </linearGradient>

      {/* Empty cell cushion gradient — deep dark with purple tones */}
      <linearGradient id="jj-empty-cell" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2a1a38" />
        <stop offset="40%" stopColor="#1e1028" />
        <stop offset="100%" stopColor="#120818" />
      </linearGradient>
    </defs>
  </svg>
);

/* ─── Main Cell Component ──────────────────────────────────────────── */
export const Cell: React.FC<CellProps> = ({ color, isGhost, isInvalid, skinOverride }) => {
  const blockSkin = usePlayerStore((s) => s.blockSkin);
  const skin = skinOverride ?? blockSkin;

  return (
    <div className="w-full h-full relative overflow-hidden transition-all duration-200 rounded-[5px]">
      {/* Empty slot — dark cushion pocket */}
      {!color && !isGhost && <EmptyCell />}

      {/* Filled cell — render skin */}
      {color && !isGhost && (
        skin === 'neon'    ? <NeonCell    color={color} /> :
        skin === 'crystal' ? <CrystalCell color={color} /> :
        skin === 'matrix'  ? <MatrixCell  color={color} /> :
        skin === 'gold'    ? <GoldCell    color={color} /> :
        <JungleGemCell color={color} />
      )}

      {/* Ghost placement preview */}
      {isGhost && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '5px',
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
