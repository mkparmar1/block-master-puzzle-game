/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock } from 'lucide-react';
import { THEMES } from '../lib/themes';
import { useThemeStore } from '../store/useThemeStore';
import { cn } from '../lib/utils';

export const ThemePicker: React.FC = () => {
  const { themeId, setTheme, isUnlocked } = useThemeStore();

  return (
    <div className="grid grid-cols-3 gap-3">
      {THEMES.map((theme) => {
        const unlocked = isUnlocked(theme.id);
        const active = themeId === theme.id;
        return (
          <motion.button
            key={theme.id}
            whileHover={unlocked ? { scale: 1.05 } : {}}
            whileTap={unlocked ? { scale: 0.95 } : {}}
            onClick={() => unlocked && setTheme(theme.id)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all overflow-hidden',
              active
                ? 'border-current shadow-lg'
                : 'border-slate-200 dark:border-slate-700',
              !unlocked && 'opacity-60 cursor-not-allowed'
            )}
            style={{
              background: active
                ? theme.vars['--gradient-button']
                : undefined,
              borderColor: active ? 'transparent' : undefined,
            }}
          >
            {/* Color swatch strip */}
            <div className="flex gap-1 w-full">
              {(theme.blockColors ?? ['#3b82f6', '#6366f1', '#8b5cf6'])
                .slice(0, 4)
                .map((c, i) => (
                  <div
                    key={i}
                    className="flex-1 h-2 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
            </div>

            <span className="text-xl">{theme.emoji}</span>
            <span
              className={cn(
                'text-[10px] font-black uppercase tracking-widest text-center leading-tight',
                active ? 'text-white' : 'text-slate-600 dark:text-slate-300'
              )}
            >
              {theme.name}
            </span>

            {/* Lock overlay */}
            <AnimatePresence>
              {!unlocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-[2px] rounded-2xl gap-1 p-2"
                >
                  <Lock size={14} className="text-white" />
                  <span className="text-[8px] text-white/80 text-center font-semibold leading-tight">
                    {theme.unlockCondition}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
};
