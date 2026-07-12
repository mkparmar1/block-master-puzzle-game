/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';

interface SvgProgressBarProps {
  progress: number;
  className?: string;
  height?: number;
}

export const SvgProgressBar: React.FC<SvgProgressBarProps> = ({ progress, className = '', height = 16 }) => {
  const p = Math.max(0, Math.min(100, progress));

  return (
    <div className={`relative w-full rounded-full overflow-hidden ${className}`} style={{ height }}>
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 10" style={{ display: 'block' }}>
        {/* Track Background (inset stone pocket) */}
        <rect x="0" y="0" width="100" height="10" rx="5" fill="url(#stone-dark-grad)" stroke="#1e293b" strokeWidth="0.5" filter="url(#inset-shadow)" />
      </svg>
      {/* Golden Fill */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${p}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          background: 'var(--gradient-gold)',
          borderRight: '1.5px solid #fbbf24',
          boxShadow: '0 0 12px rgba(251,191,36,0.5)',
        }}
      >
        {/* Shine sweeping across the filled area */}
        <div className="absolute inset-0 w-full h-full" style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation: 'glow-sweep 2.5s infinite ease-in-out'
        }} />
      </motion.div>
    </div>
  );
};
