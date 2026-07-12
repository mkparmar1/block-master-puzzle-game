/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'motion/react';
import { SvgCard } from './SvgCard';
import { SvgIcon } from './SvgIcon';

export const ScoreBoard: React.FC = () => {
  const { score, highScore } = useGameStore();

  return (
    <SvgCard className="w-full max-w-md mx-auto mb-2" variant="gold-border">
      <div className="flex justify-between items-center px-5 py-3">
        {/* Score */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <SvgIcon id="stars" size={14} />
            <span className="gs-label-xs">Score</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={score}
              initial={{ y: 10, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="gs-score-value text-white font-black text-2xl"
            >
              {score.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Divider */}
        <div style={{ width: 2, height: 35, background: 'linear-gradient(to bottom, transparent, rgba(251,191,36,0.35), transparent)' }} />

        {/* Best */}
        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="gs-label-xs">Best</span>
            <SvgIcon id="leaderboard" size={14} />
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={highScore}
              initial={{ y: 2, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              className="gs-best-value text-amber-400 font-black text-2xl"
            >
              {highScore.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </SvgCard>
  );
};
