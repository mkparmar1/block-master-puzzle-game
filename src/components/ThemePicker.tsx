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
        
        let cardStyle = '';
        if (active) {
          cardStyle = 'border-transparent shadow-[0_0_15px_rgba(99,102,241,0.5)] bg-slate-800/80';
        } else if (unlocked) {
          cardStyle = 'border-slate-700/50 bg-slate-900/60 shadow-lg';
        } else {
          cardStyle = 'border-slate-800/50 bg-slate-900/40 opacity-70 grayscale-[0.3]';
        }

        return (
          <motion.button
            key={theme.id}
            whileHover={unlocked ? { scale: 1.05 } : {}}
            whileTap={unlocked ? { scale: 0.95 } : {}}
            onClick={() => unlocked && setTheme(theme.id)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all overflow-hidden backdrop-blur-md',
              cardStyle
            )}
            style={{
              background: active ? 'linear-gradient(135deg, rgba(59,130,246,0.3) 0%, rgba(99,102,241,0.1) 100%)' : undefined,
              borderColor: active ? 'rgba(99,102,241,0.6)' : undefined,
            }}
          >
            {active && (
              <div className="absolute inset-0 pointer-events-none rounded-2xl border-[1.5px] border-indigo-400/80 mix-blend-overlay" />
            )}
            
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
              className={cn(
                'text-[10px] font-black uppercase tracking-widest text-center leading-tight mt-1',
                active ? 'text-indigo-200 drop-shadow-[0_0_4px_rgba(165,180,252,0.6)]' : 'text-slate-400'
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
                  className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm rounded-2xl gap-1.5 p-2 border border-slate-800"
                >
                  <Lock size={16} className="text-slate-400 drop-shadow-lg" />
                  <span className="text-[9px] text-slate-300 text-center font-bold leading-tight tracking-wider">
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

