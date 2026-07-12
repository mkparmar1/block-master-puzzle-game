/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SvgCardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'stone' | 'gold-border' | 'alert' | 'silver-border' | 'bronze-border';
}

export const SvgCard: React.FC<SvgCardProps> = ({ className = '', children, variant = 'stone' }) => {
  let outerBorder = 'url(#gold-primary)'; // Luxury chrome gold
  let fillUrl = 'url(#stone-dark-grad)'; // Heavy dark stone texture

  if (variant === 'gold-border') {
    outerBorder = 'url(#gold-bright)';
  } else if (variant === 'silver-border') {
    outerBorder = 'url(#gem-diamond)';
  } else if (variant === 'bronze-border') {
    outerBorder = 'url(#gem-amber)';
  } else if (variant === 'alert') {
    outerBorder = 'url(#gem-ruby)';
  }

  return (
    <div className={`relative ${className}`}>
      {/* Background Vector Plate */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          {/* Base outer shadow */}
          <rect x="-1" y="2.5" width="102" height="100" rx="8" fill="rgba(0,0,0,0.7)" />
          
          {/* Main Stone Slab */}
          <rect x="0" y="0" width="100" height="100" rx="8" fill={fillUrl} stroke="#0f172a" strokeWidth="1" />

          {/* Illustrated cracks in the stone */}
          <path d="M 5,22 L 15,24 L 18,32" fill="none" stroke="#020617" strokeWidth="0.8" opacity="0.75" />
          <path d="M 95,78 L 88,80 L 85,73 L 80,75" fill="none" stroke="#020617" strokeWidth="0.8" opacity="0.75" />
          <path d="M 45,6 L 47,16 L 43,23" fill="none" stroke="#020617" strokeWidth="0.6" opacity="0.5" />
          <path d="M 12,87 L 18,90 L 21,84" fill="none" stroke="#020617" strokeWidth="0.6" opacity="0.5" />

          {/* Inner ambient glow layer */}
          <rect x="2" y="2" width="96" height="96" rx="7" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

          {/* Golden Filigree Frame */}
          <rect x="3.5" y="3.5" width="93" height="93" rx="6" fill="none" stroke={outerBorder} strokeWidth="1.2" />

          {/* Corner Plates with highlighted center rivets */}
          {/* Top-Left */}
          <path d="M 2,12 L 12,12 L 12,2 L 2,2 Z" fill={outerBorder} filter="url(#bevel-emboss)" />
          <circle cx="7" cy="7" r="1" fill="#3d2003" />

          {/* Top-Right */}
          <path d="M 98,12 L 88,12 L 88,2 L 98,2 Z" fill={outerBorder} filter="url(#bevel-emboss)" />
          <circle cx="93" cy="7" r="1" fill="#3d2003" />

          {/* Bottom-Left */}
          <path d="M 2,88 L 12,88 L 12,98 L 2,98 Z" fill={outerBorder} filter="url(#bevel-emboss)" />
          <circle cx="7" cy="93" r="1" fill="#3d2003" />

          {/* Bottom-Right */}
          <path d="M 98,88 L 88,88 L 88,98 L 98,98 Z" fill={outerBorder} filter="url(#bevel-emboss)" />
          <circle cx="93" cy="93" r="1" fill="#3d2003" />
        </svg>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
