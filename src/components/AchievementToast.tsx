/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Achievement } from '../lib/achievements';

interface AchievementToastProps {
  achievements: Achievement[];
  onDone: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievements, onDone }) => {
  const [current, setCurrent] = React.useState(0);

  useEffect(() => {
    if (achievements.length === 0) return;
    setCurrent(0);
  }, [achievements]);

  useEffect(() => {
    if (achievements.length === 0) return;
    const timer = setTimeout(() => {
      if (current < achievements.length - 1) {
        setCurrent((c) => c + 1);
      } else {
        onDone();
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [current, achievements, onDone]);

  const achievement = achievements[current];

  return (
    <AnimatePresence mode="wait">
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed top-safe z-[200] left-1/2 -translate-x-1/2 mt-4 px-1 w-full max-w-sm"
          style={{ top: 'max(env(safe-area-inset-top, 0px), 16px)' }}
        >
          <div className="mx-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-4 shadow-[0_8px_32px_rgba(245,158,11,0.4)] border border-white/20">
            <div className="flex items-center gap-4">
              {/* Animated emoji */}
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 5, 0], scale: [1, 1.2, 1.2, 1.1, 1] }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl flex-shrink-0 filter drop-shadow-lg"
              >
                {achievement.emoji}
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] font-black text-white/70 uppercase tracking-[0.2em]">
                    Achievement Unlocked!
                  </span>
                </div>
                <p className="font-black text-white text-base leading-tight truncate">
                  {achievement.title}
                </p>
                <p className="text-white/80 text-xs font-medium truncate">
                  {achievement.description}
                </p>
                {achievement.unlockThemeId && (
                  <p className="text-white/60 text-[10px] font-bold mt-1">
                    🎨 New theme unlocked!
                  </p>
                )}
              </div>

              {/* Progress dots */}
              {achievements.length > 1 && (
                <div className="flex flex-col gap-1 flex-shrink-0">
                  {achievements.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === current ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
