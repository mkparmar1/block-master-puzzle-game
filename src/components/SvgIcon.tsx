/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type SvgIconId =
  | 'home'
  | 'journey'
  | 'mission'
  | 'daily'
  | 'records'
  | 'settings'
  | 'pause'
  | 'play'
  | 'undo'
  | 'refresh'
  | 'hammer'
  | 'back'
  | 'close'
  | 'xp'
  | 'stars'
  | 'rank'
  | 'leaderboard'
  | 'theme'
  | 'sound'
  | 'music'
  | 'haptic'
  | 'hint'
  | 'zap';

interface SvgIconProps {
  id: SvgIconId;
  size?: number | string;
  className?: string;
  fill?: string;
}

export const SvgIcon: React.FC<SvgIconProps> = ({ id, size = 24, className = '', fill }) => {
  const s = typeof size === 'number' ? `${size}px` : size;

  // Illustrate highly detailed vector paths
  const renderPaths = () => {
    switch (id) {
      case 'home':
        return (
          <>
            {/* Castle Base */}
            <path d="M4 20h16v-9H4v9z" fill="url(#stone-bevel-grad)" stroke="url(#gold-primary)" strokeWidth="1" />
            {/* Left & Right towers */}
            <path d="M2 20h3V9H2v11zM19 20h3V9h-3v11z" fill="url(#stone-light-grad)" stroke="url(#gold-primary)" strokeWidth="1" />
            {/* Turret Cones */}
            <path d="M1 9l2.5-4L6 9H1z" fill="url(#gem-ruby)" filter="url(#bevel-emboss)" />
            <path d="M18 9l2.5-4L23 9h-5z" fill="url(#gem-ruby)" filter="url(#bevel-emboss)" />
            {/* Castle Roof */}
            <path d="M8 11l4-5 4 5H8z" fill="url(#gem-ruby)" filter="url(#bevel-emboss)" />
            {/* Castle Doorway (glowing gold) */}
            <path d="M9 20v-5a3 3 0 0 1 6 0v5H9z" fill="url(#gold-primary)" filter="url(#gold-glow)" />
          </>
        );
      case 'journey':
        return (
          <>
            {/* Winding path */}
            <path d="M3 18c0-3 3-5 8-5s6-3 8-7" fill="none" stroke="url(#gold-primary)" strokeWidth="3.5" strokeLinecap="round" filter="url(#bevel-emboss)" />
            {/* Nodes */}
            <circle cx="3" cy="18" r="4.5" fill="url(#gem-ruby)" stroke="#fff" strokeWidth="1.2" />
            <circle cx="11" cy="13" r="4.5" fill="url(#gem-sapphire)" stroke="#fff" strokeWidth="1.2" />
            <circle cx="19" cy="6" r="6" fill="url(#gem-topaz)" stroke="url(#gold-primary)" strokeWidth="1.5" filter="url(#gold-glow)" />
          </>
        );
      case 'mission':
        return (
          <>
            {/* Target base plate */}
            <circle cx="12" cy="12" r="10" fill="url(#stone-bevel-grad)" stroke="url(#gold-primary)" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="7" fill="none" stroke="url(#gold-bright)" strokeWidth="1" />
            <circle cx="12" cy="12" r="4" fill="url(#gem-ruby)" filter="url(#bevel-emboss)" />
            {/* Crosshair tips */}
            <path d="M12 1v3M12 20v3M1 12h3M20 12h3" stroke="url(#gold-primary)" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'daily':
        return (
          <>
            {/* Calendar stone block */}
            <rect x="3" y="4" width="18" height="17" rx="3" fill="url(#stone-light-grad)" stroke="url(#gold-primary)" strokeWidth="1.8" />
            {/* Red header strap */}
            <path d="M3 7V4a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v3H3z" fill="url(#gem-ruby)" filter="url(#bevel-emboss)" />
            {/* Binder rings */}
            <rect x="6" y="1" width="2.5" height="5" rx="1" fill="url(#gold-bright)" />
            <rect x="15.5" y="1" width="2.5" height="5" rx="1" fill="url(#gold-bright)" />
            {/* Twinkling star */}
            <path d="M12 9l1.6 2.8 3 .4-2.2 2.1.5 3-2.9-1.5-2.9 1.5.5-3-2.2-2.1 3-.4z" fill="url(#gold-bright)" filter="url(#gold-glow)" />
          </>
        );
      case 'records':
        return (
          <>
            {/* Ledger roll */}
            <path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="url(#stone-bevel-grad)" stroke="url(#gold-primary)" strokeWidth="1.5" />
            {/* Gold binds */}
            <path d="M4 6h16M4 18h16" stroke="url(#gold-primary)" strokeWidth="1.5" />
            {/* Text lines */}
            <line x1="8" x2="16" y1="10" y2="10" stroke="url(#gold-bright)" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" x2="14" y1="14" y2="14" stroke="url(#gold-bright)" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'settings':
        return (
          <>
            {/* Cog Body */}
            <circle cx="12" cy="12" r="6.5" fill="url(#stone-light-grad)" stroke="url(#gold-primary)" strokeWidth="2" />
            {/* Teeth */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <path
                key={angle}
                d="M10.5 2h3v4.5h-3z"
                transform={`rotate(${angle} 12 12)`}
                fill="url(#gold-primary)"
                filter="url(#bevel-emboss)"
              />
            ))}
            {/* Ruby center gem */}
            <circle cx="12" cy="12" r="2.5" fill="url(#gem-ruby)" filter="url(#bevel-emboss)" />
          </>
        );
      case 'pause':
        return (
          <>
            <rect x="4" y="3" width="5" height="18" rx="1.5" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
            <rect x="15" y="3" width="5" height="18" rx="1.5" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
          </>
        );
      case 'play':
        return (
          <path d="M6 3l14 9-14 9z" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
        );
      case 'undo':
        return (
          <path d="M20 18a8 8 0 0 0-14-5.5L3 15M3 8v8h8" fill="none" stroke="url(#gold-primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#bevel-emboss)" />
        );
      case 'refresh':
        return (
          <path d="M21 12a9 9 0 1 1-2.6-6.4L21 8M21 2v7h-7" fill="none" stroke="url(#gold-primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#bevel-emboss)" />
        );
      case 'hammer':
        return (
          <>
            {/* Wooden grain handle */}
            <path d="M5 19l8-8" stroke="#451a03" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M4 20l2-2" stroke="url(#gold-primary)" strokeWidth="5.5" strokeLinecap="round" />
            {/* Stone Head */}
            <rect x="11" y="3" width="8" height="8" rx="1.5" transform="rotate(45 15 7)" fill="url(#stone-bevel-grad)" stroke="url(#gold-primary)" strokeWidth="1" />
            {/* Gold strapping and Ruby core */}
            <circle cx="15" cy="7" r="2" fill="url(#gem-ruby)" filter="url(#bevel-emboss)" />
          </>
        );
      case 'back':
        return (
          <path d="M15 19l-7-7 7-7" fill="none" stroke="url(#gold-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#bevel-emboss)" />
        );
      case 'close':
        return (
          <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="url(#gold-primary)" strokeWidth="4.5" strokeLinecap="round" filter="url(#bevel-emboss)" />
        );
      case 'xp':
        return (
          <>
            {/* Shield */}
            <path d="M12 2L3 6v6c0 5.5 4.5 10 9 10s9-4.5 9-10V6l-9-4z" fill="url(#stone-bevel-grad)" stroke="url(#gold-primary)" strokeWidth="2" />
            {/* Sapphire gem center */}
            <polygon points="12,6 16,11 12,16 8,11" fill="url(#gem-sapphire)" filter="url(#bevel-emboss)" />
          </>
        );
      case 'stars':
        return (
          <path d="M12 2l3.1 6.3 7 1-5.1 5 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5.1-5 7-1z" fill="url(#gold-bright)" filter="url(#gold-glow)" />
        );
      case 'rank':
        return (
          <>
            {/* Crown base */}
            <path d="M2 18l2-9 4 4 4-7 4 7 4-4 2 9z" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
            {/* Gems */}
            <circle cx="12" cy="6" r="1.5" fill="url(#gem-ruby)" />
            <circle cx="8" cy="13" r="1.2" fill="url(#gem-emerald)" />
            <circle cx="16" cy="13" r="1.2" fill="url(#gem-sapphire)" />
          </>
        );
      case 'leaderboard':
        return (
          <>
            <rect x="9" y="5" width="6" height="14" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
            <rect x="3" y="9" width="6" height="10" fill="url(#stone-bevel-grad)" stroke="url(#gold-primary)" strokeWidth="1.2" />
            <rect x="15" y="11" width="6" height="8" fill="url(#stone-bevel-grad)" stroke="url(#gold-primary)" strokeWidth="1.2" />
          </>
        );
      case 'theme':
        return (
          <>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 2.5-1 2.5-2.5 0-.7-.3-1.3-.8-1.8-.5-.5-.8-1.2-.8-1.9 0-1.4 1.1-2.5 2.5-2.5H19c1.7 0 3-1.3 3-3 0-5.5-4.5-10-10-10z" fill="url(#stone-bevel-grad)" stroke="url(#gold-primary)" strokeWidth="1.5" />
            <circle cx="7" cy="8" r="2.2" fill="url(#gem-ruby)" />
            <circle cx="12" cy="6" r="2.2" fill="url(#gem-emerald)" />
            <circle cx="17" cy="9" r="2.2" fill="url(#gem-sapphire)" />
            <circle cx="7" cy="15" r="2.2" fill="url(#gem-topaz)" />
          </>
        );
      case 'sound':
        return (
          <>
            <path d="M11 5L6 9H2v6h4l5 4V5z" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
            <path d="M15 8c1 1 1 3 0 4M17.5 5c2.5 2.5 2.5 6.5 0 9" fill="none" stroke="url(#gold-primary)" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'music':
        return (
          <>
            <path d="M9 17A3 3 0 1 1 6 14a3 3 0 0 1 3 3zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z" fill="url(#gem-sapphire)" filter="url(#bevel-emboss)" />
            <path d="M9 17V5l10-2v12" fill="none" stroke="url(#gold-primary)" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'haptic':
        return (
          <>
            <path d="M8 5a6 6 0 0 0 0 14M16 5a6 6 0 0 1 0 14" fill="none" stroke="url(#gold-primary)" strokeWidth="2" strokeLinecap="round" />
            <rect x="11" y="3" width="2" height="18" rx="0.5" fill="url(#stone-bevel-grad)" stroke="url(#gold-primary)" strokeWidth="1" />
          </>
        );
      case 'hint':
        return (
          <>
            <path d="M9 21h6v-2H9v2zm3-19C7.5 2 4 5.5 4 10c0 2.8 1.4 5.2 3.5 6.7L8.5 20h7l1-3.3C18.6 15.2 20 12.8 20 10c0-4.5-3.5-8-8-8z" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
            <circle cx="12" cy="10" r="2.5" fill="url(#gem-topaz)" filter="url(#gold-glow)" />
          </>
        );
      case 'zap':
        return (
          <path d="M13 2L3 14h9l-1 8 10-12h-9z" fill="url(#gold-primary)" filter="url(#bevel-glow)" />
        );
      default:
        return null;
    }
  };

  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill={fill || 'none'}
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      {renderPaths()}
    </svg>
  );
};
