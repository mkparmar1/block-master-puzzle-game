/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockCondition: string;
  // CSS variable values
  vars: {
    '--color-primary': string;
    '--color-primary-dark': string;
    '--color-accent': string;
    '--color-bg': string;
    '--color-bg-dark': string;
    '--color-surface': string;
    '--color-surface-dark': string;
    '--color-border': string;
    '--color-border-dark': string;
    '--color-glow': string;
    '--gradient-bg': string;
    '--gradient-bg-dark': string;
    '--gradient-button': string;
    '--gradient-header': string;
  };
  // Block color overrides (null = use defaults)
  blockColors: string[] | null;
}

export const THEMES: Theme[] = [
  {
    id: 'ocean',
    name: 'Ocean Deep',
    emoji: '🌊',
    description: 'Cool teal waves',
    unlockCondition: 'Default theme',
    vars: {
      '--color-primary': '59 130 246',        // blue-500
      '--color-primary-dark': '37 99 235',    // blue-600
      '--color-accent': '99 102 241',         // indigo-500
      '--color-bg': '248 250 252',            // slate-50
      '--color-bg-dark': '2 6 23',            // slate-950
      '--color-surface': '255 255 255',
      '--color-surface-dark': '15 23 42',     // slate-900
      '--color-border': '226 232 240',        // slate-200
      '--color-border-dark': '30 41 59',      // slate-800
      '--color-glow': '59 130 246',
      '--gradient-bg': 'radial-gradient(at 0% 0%, rgba(99,102,241,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(59,130,246,0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(147,51,234,0.1) 0px, transparent 50%)',
      '--gradient-bg-dark': 'radial-gradient(at 0% 0%, rgba(99,102,241,0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(59,130,246,0.1) 0px, transparent 50%)',
      '--gradient-button': 'linear-gradient(135deg, #3b82f6, #6366f1)',
      '--gradient-header': 'linear-gradient(135deg, #3b82f6, #6366f1)',
    },
    blockColors: null,
  },
  {
    id: 'sunset',
    name: 'Sunset Blaze',
    emoji: '🌅',
    description: 'Fiery orange & crimson',
    unlockCondition: 'Score 500+ points',
    vars: {
      '--color-primary': '249 115 22',        // orange-500
      '--color-primary-dark': '234 88 12',    // orange-600
      '--color-accent': '239 68 68',          // red-500
      '--color-bg': '255 251 235',            // amber-50
      '--color-bg-dark': '28 5 0',
      '--color-surface': '255 255 255',
      '--color-surface-dark': '30 10 0',
      '--color-border': '254 215 170',        // orange-200
      '--color-border-dark': '67 20 7',
      '--color-glow': '249 115 22',
      '--gradient-bg': 'radial-gradient(at 0% 0%, rgba(251,146,60,0.2) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(239,68,68,0.15) 0px, transparent 50%)',
      '--gradient-bg-dark': 'radial-gradient(at 0% 0%, rgba(249,115,22,0.12) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(239,68,68,0.1) 0px, transparent 50%)',
      '--gradient-button': 'linear-gradient(135deg, #f97316, #ef4444)',
      '--gradient-header': 'linear-gradient(135deg, #f97316, #dc2626)',
    },
    blockColors: ['#FF5252', '#FF9100', '#FFD740', '#FF6D00', '#E040FB', '#FF6B35', '#FFB300'],
  },
  {
    id: 'forest',
    name: 'Forest Zen',
    emoji: '🌲',
    description: 'Sage greens & earth',
    unlockCondition: '7-day daily streak',
    vars: {
      '--color-primary': '34 197 94',         // green-500
      '--color-primary-dark': '22 163 74',    // green-600
      '--color-accent': '16 185 129',         // emerald-500
      '--color-bg': '240 253 244',            // green-50
      '--color-bg-dark': '2 15 5',
      '--color-surface': '255 255 255',
      '--color-surface-dark': '5 30 10',
      '--color-border': '187 247 208',        // green-200
      '--color-border-dark': '20 60 25',
      '--color-glow': '34 197 94',
      '--gradient-bg': 'radial-gradient(at 0% 0%, rgba(34,197,94,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(16,185,129,0.15) 0px, transparent 50%)',
      '--gradient-bg-dark': 'radial-gradient(at 0% 0%, rgba(34,197,94,0.1) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(16,185,129,0.08) 0px, transparent 50%)',
      '--gradient-button': 'linear-gradient(135deg, #22c55e, #10b981)',
      '--gradient-header': 'linear-gradient(135deg, #16a34a, #059669)',
    },
    blockColors: ['#22c55e', '#16a34a', '#86efac', '#10b981', '#6ee7b7', '#34d399', '#a7f3d0'],
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    emoji: '🌌',
    description: 'Deep space & nebula',
    unlockCondition: 'Reach combo x10',
    vars: {
      '--color-primary': '168 85 247',        // purple-500
      '--color-primary-dark': '147 51 234',   // purple-600
      '--color-accent': '236 72 153',         // pink-500
      '--color-bg': '250 245 255',            // purple-50
      '--color-bg-dark': '5 0 20',
      '--color-surface': '255 255 255',
      '--color-surface-dark': '15 5 40',
      '--color-border': '233 213 255',        // purple-200
      '--color-border-dark': '40 15 80',
      '--color-glow': '168 85 247',
      '--gradient-bg': 'radial-gradient(at 0% 0%, rgba(168,85,247,0.2) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(236,72,153,0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(99,102,241,0.15) 0px, transparent 50%)',
      '--gradient-bg-dark': 'radial-gradient(at 0% 0%, rgba(168,85,247,0.15) 0px, transparent 50%), radial-gradient(at 100% 30%, rgba(236,72,153,0.1) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(99,102,241,0.12) 0px, transparent 50%)',
      '--gradient-button': 'linear-gradient(135deg, #a855f7, #ec4899)',
      '--gradient-header': 'linear-gradient(135deg, #9333ea, #db2777)',
    },
    blockColors: ['#a855f7', '#ec4899', '#8b5cf6', '#6366f1', '#c084fc', '#f472b6', '#818cf8'],
  },
  {
    id: 'arctic',
    name: 'Arctic',
    emoji: '❄️',
    description: 'Ice blue & pearl white',
    unlockCondition: 'Hard mode 3,000+ pts',
    vars: {
      '--color-primary': '6 182 212',         // cyan-500
      '--color-primary-dark': '8 145 178',    // cyan-600
      '--color-accent': '148 163 184',        // slate-400
      '--color-bg': '240 249 255',            // sky-50
      '--color-bg-dark': '0 10 20',
      '--color-surface': '255 255 255',
      '--color-surface-dark': '5 20 35',
      '--color-border': '186 230 253',        // sky-200
      '--color-border-dark': '15 50 80',
      '--color-glow': '6 182 212',
      '--gradient-bg': 'radial-gradient(at 0% 0%, rgba(6,182,212,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(148,163,184,0.15) 0px, transparent 50%)',
      '--gradient-bg-dark': 'radial-gradient(at 0% 0%, rgba(6,182,212,0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(56,189,248,0.08) 0px, transparent 50%)',
      '--gradient-button': 'linear-gradient(135deg, #06b6d4, #0284c7)',
      '--gradient-header': 'linear-gradient(135deg, #0891b2, #0369a1)',
    },
    blockColors: ['#06b6d4', '#0ea5e9', '#38bdf8', '#67e8f9', '#a5f3fc', '#7dd3fc', '#bae6fd'],
  },
  {
    id: 'inferno',
    name: 'Inferno',
    emoji: '🔥',
    description: 'Red hot & molten gold',
    unlockCondition: 'Board clear x3',
    vars: {
      '--color-primary': '239 68 68',         // red-500
      '--color-primary-dark': '220 38 38',    // red-600
      '--color-accent': '245 158 11',         // amber-500
      '--color-bg': '255 241 242',
      '--color-bg-dark': '25 0 0',
      '--color-surface': '255 255 255',
      '--color-surface-dark': '40 5 5',
      '--color-border': '254 202 202',        // red-200
      '--color-border-dark': '80 15 15',
      '--color-glow': '239 68 68',
      '--gradient-bg': 'radial-gradient(at 0% 0%, rgba(239,68,68,0.2) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(245,158,11,0.15) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(220,38,38,0.1) 0px, transparent 50%)',
      '--gradient-bg-dark': 'radial-gradient(at 0% 0%, rgba(239,68,68,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(245,158,11,0.12) 0px, transparent 50%)',
      '--gradient-button': 'linear-gradient(135deg, #ef4444, #f59e0b)',
      '--gradient-header': 'linear-gradient(135deg, #dc2626, #d97706)',
    },
    blockColors: ['#ef4444', '#f59e0b', '#dc2626', '#b45309', '#fbbf24', '#f97316', '#fcd34d'],
  },
  {
    id: 'liquid_glass',
    name: 'Liquid Glass',
    emoji: '💎',
    description: 'Translucent & refractive',
    unlockCondition: 'Reach Journey Level 15',
    vars: {
      '--color-primary': '186 230 253',       // sky-200 (light blue)
      '--color-primary-dark': '125 211 252',   // sky-300
      '--color-accent': '255 255 255',
      '--color-bg': '240 249 255',
      '--color-bg-dark': '2 15 30',
      '--color-surface': '255 255 255',
      '--color-surface-dark': '10 30 50',
      '--color-border': '224 242 254',
      '--color-border-dark': '20 60 100',
      '--color-glow': '186 230 253',
      '--gradient-bg': 'radial-gradient(at 0% 0%, rgba(186,230,253,0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(255,255,255,0.2) 0px, transparent 50%)',
      '--gradient-bg-dark': 'radial-gradient(at 0% 0%, rgba(186,230,253,0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255,255,255,0.05) 0px, transparent 50%)',
      '--gradient-button': 'linear-gradient(135deg, #bae6fd, #7dd3fc)',
      '--gradient-header': 'linear-gradient(135deg, #bae6fd, #7dd3fc)',
    },
    blockColors: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7'],
  },
  {
    id: 'cyber_matrix',
    name: 'Cyber Matrix',
    emoji: '📟',
    description: 'Digital grid & neon green',
    unlockCondition: 'Reach Journey Level 30',
    vars: {
      '--color-primary': '34 197 94',         // green-500
      '--color-primary-dark': '21 128 61',    // green-700
      '--color-accent': '0 0 0',
      '--color-bg': '240 253 244',
      '--color-bg-dark': '5 10 5',
      '--color-surface': '255 255 255',
      '--color-surface-dark': '0 5 0',
      '--color-border': '34 197 94',
      '--color-border-dark': '21 128 61',
      '--color-glow': '34 197 94',
      '--gradient-bg': 'radial-gradient(at 0% 0%, rgba(34,197,94,0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0,0,0,0.05) 0px, transparent 50%)',
      '--gradient-bg-dark': 'radial-gradient(at 0% 0%, rgba(34,197,94,0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(0,0,0,0.3) 0px, transparent 50%)',
      '--gradient-button': 'linear-gradient(135deg, #22c55e, #15803d)',
      '--gradient-header': 'linear-gradient(135deg, #16a34a, #14532d)',
    },
    blockColors: ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16'],
  },
];

export const DEFAULT_THEME_ID = 'ocean';

export function applyTheme(theme: Theme, isDark: boolean): void {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  // Apply dark/light body gradient
  document.body.style.backgroundImage = isDark
    ? theme.vars['--gradient-bg-dark']
    : theme.vars['--gradient-bg'];
}

export function getThemeById(id: string): Theme {
  return THEMES.find((t) => t.id === id) ?? THEMES[0];
}
