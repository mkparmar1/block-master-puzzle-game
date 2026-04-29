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
    <div
      className="gs-scoreboard flex justify-between items-center w-full max-w-md px-5 py-3 mx-auto mb-2"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '1.4rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Score */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <Star size={11} fill="#3b82f6" style={{ color: '#3b82f6', filter: 'drop-shadow(0 0 4px #3b82f6)' }} />
          <span className="gs-label-xs">Score</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={score}
            initial={{ y: 10, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="gs-score-value"
          >
            {score.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.08)' }} />

      {/* Best */}
      <div className="flex flex-col items-end gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="gs-label-xs">Best</span>
          <Trophy size={11} fill="#fbbf24" style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 4px rgba(251,191,36,0.8))' }} />
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={highScore}
            initial={{ y: 2, scale: 0.9, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            className="gs-best-value"
          >
            {highScore.toLocaleString()}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};
