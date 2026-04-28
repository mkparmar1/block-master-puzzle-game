/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { THEMES, Theme, applyTheme, getThemeById, DEFAULT_THEME_ID } from '../lib/themes';
import { useGameStore } from './useGameStore';
import { usePlayerStore } from './usePlayerStore';

interface ThemeState {
  themeId: string;
  isDark: boolean;
  // Legacy field kept for GameScreen compat
  currentTheme: Theme;
  setTheme: (id: string) => void;
  toggleDark: () => void;
  applyCurrentTheme: () => void;
  isUnlocked: (id: string) => boolean;
}

export { THEMES } from '../lib/themes';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      themeId: DEFAULT_THEME_ID,
      isDark: false,
      currentTheme: getThemeById(DEFAULT_THEME_ID),

      setTheme: (id) => {
        if (!get().isUnlocked(id)) return;
        const theme = getThemeById(id);
        set({ themeId: id, currentTheme: theme });
        applyTheme(theme, get().isDark);
        if (get().isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleDark: () => {
        const next = !get().isDark;
        set({ isDark: next });
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        applyTheme(get().currentTheme, next);
      },

      applyCurrentTheme: () => {
        const { currentTheme, isDark } = get();
        applyTheme(currentTheme, isDark);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      isUnlocked: (id: string): boolean => {
        if (id === DEFAULT_THEME_ID) return true;
        try {
          // Use a helper to get state safely
          const getG = () => useGameStore.getState();
          const getP = () => usePlayerStore.getState();

          const highScore = getG()?.highScore ?? 0;
          const dailyStreak = getG()?.dailyStreak ?? 0;
          const boardClears = getG()?.boardClears ?? 0;
          const maxCombo = getG()?.maxCombo ?? 0;
          const highestLevel = getP()?.highestLevel ?? 1;

          switch (id) {
            case 'sunset':  return highScore >= 500;
            case 'forest':  return dailyStreak >= 7;
            case 'galaxy':  return maxCombo >= 10;
            case 'arctic':  return highScore >= 3000;
            case 'inferno': return boardClears >= 3;
            case 'liquid_glass': return highestLevel >= 15;
            case 'cyber_matrix': return highestLevel >= 30;
            default:        return false;
          }
        } catch (err) {
          console.warn('Theme unlock check failed during init:', err);
          return false;
        }
      },
    }),
    { name: 'block-master-theme-v2' }
  )
);
