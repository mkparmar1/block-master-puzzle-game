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

  // Render vector geometry based on ID
  const renderPaths = () => {
    switch (id) {
      case 'home':
        return (
          <>
            {/* Castle Roof */}
            <path d="M12 2L2 11h3v9h14v-9h3L12 2z" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
            {/* Castle Doorway */}
            <path d="M10 20v-6h4v6h-4z" fill="#0f172a" />
            <path d="M10 14h4v1.5h-4V14z" fill="url(#gold-bright)" />
          </>
        );
      case 'journey':
        return (
          <>
            {/* Winding road path */}
            <path d="M4 20c0-4 3-7 8-7s8-3 8-7" fill="none" stroke="url(#gold-primary)" strokeWidth="4" strokeLinecap="round" />
            {/* Nodes */}
            <circle cx="4" cy="20" r="3.5" fill="url(#gem-ruby)" stroke="url(#gold-primary)" strokeWidth="1.5" />
            <circle cx="12" cy="13" r="3.5" fill="url(#gem-sapphire)" stroke="url(#gold-primary)" strokeWidth="1.5" />
            <circle cx="20" cy="6" r="4.5" fill="url(#gem-topaz)" stroke="url(#gold-primary)" strokeWidth="2" filter="url(#gold-glow)" />
          </>
        );
      case 'mission':
        return (
          <>
            {/* Target Rings */}
            <circle cx="12" cy="12" r="9.5" fill="none" stroke="url(#gold-primary)" strokeWidth="2" />
            <circle cx="12" cy="12" r="6.5" fill="none" stroke="url(#gold-primary)" strokeWidth="1.5" />
            <circle cx="12" cy="12" r="3.5" fill="url(#gem-ruby)" filter="url(#bevel-emboss)" />
            {/* Crosshair lines */}
            <path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="url(#gold-primary)" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'daily':
        return (
          <>
            {/* Calendar Tablet */}
            <rect x="3" y="4" width="18" height="17" rx="3" fill="url(#stone-light-grad)" stroke="url(#gold-primary)" strokeWidth="2" />
            {/* Header bar */}
            <rect x="3" y="4" width="18" height="5" rx="1" fill="url(#gold-primary)" />
            {/* Ring links */}
            <rect x="6" y="2" width="2" height="4" rx="1" fill="#cbd5e1" />
            <rect x="16" y="2" width="2" height="4" rx="1" fill="#cbd5e1" />
            {/* Central glowing star */}
            <path d="M12 10l1.5 3 3.5.5-2.5 2.5.6 3.5-3.1-1.8-3.1 1.8.6-3.5-2.5-2.5 3.5-.5z" fill="url(#gold-bright)" filter="url(#gold-glow)" />
          </>
        );
      case 'records':
        return (
          <>
            {/* Podium/Rankings Scroll */}
            <rect x="4" y="3" width="14" height="18" rx="1" fill="url(#stone-dark-grad)" stroke="url(#gold-primary)" strokeWidth="2" />
            <path d="M18 3h2v18h-2V3z" fill="url(#gold-primary)" />
            {/* Horizontal lines */}
            <line x1="7" y1="7" x2="15" y2="7" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="7" y1="12" x2="15" y2="12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <line x1="7" y1="17" x2="13" y2="17" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'settings':
        return (
          <>
            {/* Gear body */}
            <circle cx="12" cy="12" r="6" fill="url(#stone-light-grad)" stroke="url(#gold-primary)" strokeWidth="2.5" />
            {/* Teeth */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <path
                key={angle}
                d="M11 3h2v3h-2z"
                transform={`rotate(${angle} 12 12)`}
                fill="url(#gold-primary)"
                filter="url(#bevel-emboss)"
              />
            ))}
            {/* Center Core */}
            <circle cx="12" cy="12" r="2.5" fill="#0f172a" />
          </>
        );
      case 'pause':
        return (
          <>
            {/* Two beveled vertical gemstones */}
            <rect x="5" y="3" width="5" height="18" rx="1.5" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
            <rect x="14" y="3" width="5" height="18" rx="1.5" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
          </>
        );
      case 'play':
        return (
          <>
            {/* Beveled crystal triangle */}
            <path d="M6 3l14 9-14 9z" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
          </>
        );
      case 'undo':
        return (
          <>
            {/* Curved arrow */}
            <path d="M20 18a8 8 0 0 0-14-5.5L3 15M3 9v7h7" fill="none" stroke="url(#gold-primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#bevel-emboss)" />
          </>
        );
      case 'refresh':
        return (
          <>
            {/* Double rotating arrow */}
            <path d="M21 12a9 9 0 1 1-2.6-6.4L21 8M21 3v6h-6" fill="none" stroke="url(#gold-primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#bevel-emboss)" />
          </>
        );
      case 'hammer':
        return (
          <>
            {/* Tactile sledgehammer illustration */}
            {/* Handle */}
            <path d="M6 18l8-8" stroke="#713f12" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M5 19l2-2" stroke="url(#gold-primary)" strokeWidth="5.5" strokeLinecap="round" />
            {/* Metal Head */}
            <path d="M12 6l6-6 4 4-6 6z" fill="url(#stone-light-grad)" stroke="#475569" strokeWidth="1" />
            <rect x="12" y="4" width="8" height="8" rx="2" transform="rotate(45 16 8)" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
          </>
        );
      case 'back':
        return (
          <>
            {/* Arrow crest */}
            <path d="M15 19l-7-7 7-7" fill="none" stroke="url(#gold-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#bevel-emboss)" />
          </>
        );
      case 'close':
        return (
          <>
            {/* Beveled Gold X */}
            <path d="M18 6L6 18M6 6l12 12" fill="none" stroke="url(#gold-primary)" strokeWidth="4" strokeLinecap="round" filter="url(#bevel-emboss)" />
          </>
        );
      case 'xp':
        return (
          <>
            {/* Shield crest */}
            <path d="M12 2L3 6v6c0 5.5 4.5 10 9 10s9-4.5 9-10V6l-9-4z" fill="url(#stone-dark-grad)" stroke="url(#gold-primary)" strokeWidth="2.5" />
            {/* Inner gem */}
            <polygon points="12,7 16,11 12,15 8,11" fill="url(#gem-sapphire)" filter="url(#bevel-emboss)" />
          </>
        );
      case 'stars':
        return (
          <path d="M12 2l3.1 6.3 7 1-5.1 5 1.2 6.9-6.2-3.3-6.2 3.3 1.2-6.9-5.1-5 7-1z" fill="url(#gold-bright)" filter="url(#gold-glow)" />
        );
      case 'rank':
        return (
          <>
            {/* Golden crown */}
            <path d="M2 18l2-9 4 4 4-7 4 7 4-4 2 9z" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
            {/* Base bar */}
            <rect x="2" y="17" width="20" height="3" rx="1" fill="url(#stone-dark-grad)" stroke="url(#gold-primary)" strokeWidth="1" />
            {/* Gems */}
            <circle cx="12" cy="6" r="1.5" fill="url(#gem-ruby)" />
            <circle cx="8" cy="13" r="1.5" fill="url(#gem-emerald)" />
            <circle cx="16" cy="13" r="1.5" fill="url(#gem-sapphire)" />
          </>
        );
      case 'leaderboard':
        return (
          <>
            {/* Rankings podium */}
            {/* Center column (1st) */}
            <rect x="9" y="5" width="6" height="14" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
            {/* Left column (2nd) */}
            <rect x="3" y="9" width="6" height="10" fill="url(#stone-light-grad)" stroke="url(#gold-primary)" strokeWidth="1.5" />
            {/* Right column (3rd) */}
            <rect x="15" y="11" width="6" height="8" fill="url(#stone-light-grad)" stroke="url(#gold-primary)" strokeWidth="1.5" />
            {/* Star on 1st */}
            <path d="M12 7.5l.8 1.6 1.8.2-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.2z" fill="#fff" />
          </>
        );
      case 'theme':
        return (
          <>
            {/* Stone Palette */}
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 2.5-1 2.5-2.5 0-.7-.3-1.3-.8-1.8-.5-.5-.8-1.2-.8-1.9 0-1.4 1.1-2.5 2.5-2.5H19c1.7 0 3-1.3 3-3 0-5.5-4.5-10-10-10z" fill="url(#stone-dark-grad)" stroke="url(#gold-primary)" strokeWidth="2" />
            {/* Color blobs */}
            <circle cx="7" cy="8" r="2.5" fill="url(#gem-ruby)" />
            <circle cx="12" cy="6" r="2.5" fill="url(#gem-emerald)" />
            <circle cx="17" cy="9" r="2.5" fill="url(#gem-sapphire)" />
            <circle cx="7" cy="15" r="2.5" fill="url(#gem-topaz)" />
          </>
        );
      case 'sound':
        return (
          <>
            {/* Megaphone speaker */}
            <path d="M11 5L6 9H2v6h4l5 4V5z" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
            {/* Waves */}
            <path d="M15.5 7.5c1.5 1.5 1.5 4.5 0 6M18 5c3 3 3 8 0 11" fill="none" stroke="url(#gold-primary)" strokeWidth="2.5" strokeLinecap="round" />
          </>
        );
      case 'music':
        return (
          <>
            {/* Double Note */}
            <path d="M9 17A3 3 0 1 1 6 14a3 3 0 0 1 3 3zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z" fill="url(#gem-sapphire)" filter="url(#bevel-emboss)" />
            <path d="M9 17V5l10-2v12" fill="none" stroke="url(#gold-primary)" strokeWidth="3" strokeLinecap="round" />
          </>
        );
      case 'haptic':
        return (
          <>
            {/* Vibration waves */}
            <path d="M8 5a6 6 0 0 0 0 14M16 5a6 6 0 0 1 0 14" fill="none" stroke="url(#gold-primary)" strokeWidth="2.5" strokeLinecap="round" />
            {/* Phone device slot */}
            <rect x="10" y="3" width="4" height="18" rx="1" fill="url(#stone-light-grad)" stroke="url(#gold-primary)" strokeWidth="1.5" />
          </>
        );
      case 'hint':
        return (
          <>
            {/* Lightbulb shape */}
            <path d="M9 21h6v-2H9v2zm3-19C7.5 2 4 5.5 4 10c0 2.8 1.4 5.2 3.5 6.7L8.5 20h7l1-3.3C18.6 15.2 20 12.8 20 10c0-4.5-3.5-8-8-8z" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
          </>
        );
      case 'zap':
        return (
          <>
            {/* Lightning bolt */}
            <path d="M13 2L3 14h9l-1 8 10-12h-9z" fill="url(#gold-primary)" filter="url(#bevel-emboss)" />
          </>
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
