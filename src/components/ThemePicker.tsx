/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { THEMES } from '../lib/themes';
import { useThemeStore } from '../store/useThemeStore';
import { SvgIcon } from './SvgIcon';
import { SvgCard } from './SvgCard';

export const ThemePicker: React.FC = () => {
  const { themeId, setTheme, isUnlocked } = useThemeStore();

  return (
    <div className="grid grid-cols-3 gap-3">
      {THEMES.map((theme) => {
        const unlocked = isUnlocked(theme.id);
        const active = themeId === theme.id;

        return (
          <motion.div
            key={theme.id}
            whileHover={unlocked ? { scale: 1.05 } : {}}
            whileTap={unlocked ? { scale: 0.95 } : {}}
            onClick={() => unlocked && setTheme(theme.id)}
            className={`cursor-pointer relative overflow-hidden ${!unlocked ? 'opacity-70' : ''}`}
          >
            <SvgCard className="p-3" variant={active ? 'gold-border' : 'stone'}>
              <div className="flex flex-col items-center gap-2 text-center">
                {/* Color swatch strip */}
                <div className="flex gap-1 w-full justify-center opacity-90 drop-shadow-sm">
                  {(theme.blockColors ?? ['#3b82f6', '#6366f1', '#8b5cf6'])
                    .slice(0, 4)
                    .map((c, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: c, boxShadow: `0 0 6px ${c}` }}
                      />
                    ))}
                </div>

                <span className="text-2xl mt-1 drop-shadow-md">{theme.emoji}</span>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest text-center leading-tight mt-1 ${
                    active ? 'text-amber-950' : 'text-slate-400'
                  }`}
                >
                  {theme.name}
                </span>
              </div>
            </SvgCard>

            {/* Lock overlay */}
            <AnimatePresence>
              {!unlocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm rounded-2xl gap-1.5 p-2"
                >
                  <SvgIcon id="close" size={15} />
                  <span className="text-[8px] text-slate-400 text-center font-black leading-tight tracking-wider">
                    {theme.unlockCondition}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
