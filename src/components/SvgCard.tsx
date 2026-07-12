/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SvgCardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'stone' | 'gold-border' | 'alert';
}

export const SvgCard: React.FC<SvgCardProps> = ({ className = '', children, variant = 'stone' }) => {
  let outerBorder = '#fbbf24'; // Gold trim
  let fillUrl = 'url(#stone-dark-grad)'; // Stone texture

  if (variant === 'gold-border') {
    outerBorder = '#fbbf24';
  } else if (variant === 'alert') {
    outerBorder = '#ef4444';
  }

  return (
    <div className={`relative ${className}`}>
      {/* Background Vector Plate */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          {/* Base shadow */}
          <rect x="-1" y="2.5" width="102" height="100" rx="8" fill="rgba(0,0,0,0.65)" />
          {/* Main Stone Slab */}
          <rect x="0" y="0" width="100" height="100" rx="8" fill={fillUrl} stroke="#1e293b" strokeWidth="1" />
          {/* Inner Inset Bevel */}
          <rect x="2" y="2" width="96" height="96" rx="7" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          {/* Golden Filigree Frame */}
          <rect x="3.5" y="3.5" width="93" height="93" rx="6" fill="none" stroke={outerBorder} strokeWidth="1.2" />
          {/* Decorative Corner Ornaments */}
          {/* Top-Left */}
          <path d="M2 10V2h8" fill="none" stroke={outerBorder} strokeWidth="2" strokeLinecap="round" />
          {/* Top-Right */}
          <path d="M98 10V2h-8" fill="none" stroke={outerBorder} strokeWidth="2" strokeLinecap="round" />
          {/* Bottom-Left */}
          <path d="M2 90v8h8" fill="none" stroke={outerBorder} strokeWidth="2" strokeLinecap="round" />
          {/* Bottom-Right */}
          <path d="M98 90v8h-8" fill="none" stroke={outerBorder} strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
