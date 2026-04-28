/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'motion/react';

export const ScoreBoard: React.FC = () => {
  const { score, highScore } = useGameStore();

  return (
    <div className="flex justify-between items-center w-full max-w-md px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-white dark:border-slate-800 shadow-xl mx-auto mb-2 sm:mb-3">
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
          <Star size={12} style={{ color: 'rgb(var(--color-primary))' }} />
          Score
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={score}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-2xl font-black text-slate-900 dark:text-white tracking-tight"
          >
            {score.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />

      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
          <Trophy size={12} className="text-amber-500 fill-amber-500/10" />
          Best
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={highScore}
            initial={{ y: 2, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            className="text-2xl font-black tracking-tight" style={{ color: 'rgb(var(--color-primary))' }}
          >
            {highScore.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
