/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SvgIcon, SvgIconId } from './SvgIcon';

interface SvgBadgeProps {
  type: 'xp' | 'rank' | 'star' | 'combo' | 'mission';
  value: string | number;
  className?: string;
}

export const SvgBadge: React.FC<SvgBadgeProps> = ({ type, value, className = '' }) => {
  let fillUrl = 'url(#stone-dark-grad)';
  let borderColor = '#fbbf24';
  let iconId: SvgIconId = 'xp';

  if (type === 'rank') {
    iconId = 'rank';
  } else if (type === 'star') {
    iconId = 'stars';
  } else if (type === 'combo') {
    iconId = 'play';
    borderColor = '#ef4444';
  } else if (type === 'mission') {
    iconId = 'mission';
    borderColor = '#10b981';
  }

  return (
    <div className={`relative inline-flex items-center justify-center px-4 py-1.5 min-w-[70px] ${className}`}>
      {/* Background Plate */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 24" style={{ overflow: 'visible' }}>
          {/* Hexagon Beveled stone */}
          <polygon points="4,0 96,0 100,12 96,24 4,24 0,12" fill={fillUrl} stroke={borderColor} strokeWidth="1.2" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-1.5">
        <SvgIcon id={iconId} size={14} />
        <span className="font-black text-white text-[11px] tracking-wide leading-none">{value}</span>
      </div>
    </div>
  );
};
