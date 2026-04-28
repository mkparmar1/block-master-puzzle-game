/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Home, Trophy, Share2, Star, Zap, Target, LayoutGrid } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import confetti from 'canvas-confetti';
import { useThemeStore } from '../store/useThemeStore';
import { usePlayerStore, getRankForXP, getNextRank, xpForScore } from '../store/usePlayerStore';
import { shareScore } from '../lib/shareCard';

interface GameOverScreenProps {
  onRestart: () => void;
  onHome: () => void;
}

function getStarRating(score: number, difficulty: string): number {
  const thresholds: Record<string, [number, number, number]> = {
    easy:   [200,  600,  1200],
    medium: [400,  1000, 2500],
    hard:   [800,  2000, 4500],
  };
  const [one, two, three] = thresholds[difficulty] ?? [400, 1000, 2500];
  if (score >= three) return 3;
  if (score >= two) return 2;
  if (score >= one) return 1;
  return 0;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; accent?: boolean }> = ({
  icon, label, value, accent
}) => (
  <div className="flex flex-col items-center gap-1 p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
    <div className={`${accent ? 'text-amber-500' : 'text-slate-400'}`}>{icon}</div>
    <span className={`text-xl font-black ${accent ? 'text-amber-500' : 'text-slate-900 dark:text-white'}`}>{value}</span>
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center">{label}</span>
  </div>
);

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart, onHome }) => {
  const { score, highScore, difficulty, blocksPlaced, totalLinesCleared, maxCombo, gridSize } = useGameStore();
  const { currentTheme } = useThemeStore();
  const { xp, addXP, addStats } = usePlayerStore();
  const isNewBest = score >= highScore && score > 0;
  const stars = getStarRating(score, difficulty);
  const rank = getRankForXP(xp);
  const nextRank = getNextRank(xp);

  // Award XP for game completion
  useEffect(() => {
    const earned = xpForScore(score, maxCombo, difficulty);
    addXP(earned);
    addStats(blocksPlaced, 1); // blocks placed this game, +1 game played
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = async () => {
    await shareScore({
      score, highScore, stars,
      gridSize,
      difficulty,
      combo: maxCombo,
      theme: currentTheme,
    });
  };

  useEffect(() => {
    if (isNewBest) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
      const colors = currentTheme.blockColors ?? ['#FF5252', '#448AFF', '#FFD740', '#69F0AE', '#E040FB'];
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, colors, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, colors, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
      return () => clearInterval(interval);
    }
  }, [isNewBest, currentTheme]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="w-full max-w-[90vw] sm:max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden border border-white dark:border-slate-800"
      >
        {/* Top gradient bar */}
        <div className="h-1" style={{ background: 'var(--gradient-button)' }} />

        <div className="p-6 text-center">
          {/* Trophy icon */}
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
            className="inline-flex p-4 rounded-full mb-4 border"
            style={{
              background: `rgb(var(--color-primary) / 0.1)`,
              borderColor: `rgb(var(--color-primary) / 0.2)`,
              color: `rgb(var(--color-primary))`,
            }}
          >
            <Trophy size={40} className="drop-shadow-sm" />
          </motion.div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tighter">
            {isNewBest ? '🎉 NEW BEST!' : 'GAME OVER'}
          </h2>

          {/* Star Rating */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 300 }}
            className="flex items-center justify-center gap-1 mb-4"
          >
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ rotate: -30, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.3 + s * 0.1, type: 'spring', stiffness: 400 }}
              >
                <Star
                  size={28}
                  className={s <= stars ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}
                  fill={s <= stars ? 'currentColor' : 'none'}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Main Scores */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white">{score.toLocaleString()}</span>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Best</span>
              <span className="text-3xl font-black tracking-tight" style={{ color: `rgb(var(--color-primary))` }}>
                {highScore.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatCard icon={<LayoutGrid size={16} />} label="Blocks" value={blocksPlaced} />
            <StatCard icon={<Target size={16} />} label="Lines" value={totalLinesCleared} />
            <StatCard icon={<Zap size={16} />} label="Max Combo" value={`${maxCombo}x`} accent={maxCombo >= 3} />
          </div>

          {/* XP / Rank bar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 mb-4"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{rank.emoji}</span>
                <span className="font-black text-slate-800 dark:text-slate-200 text-sm">{rank.title}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{xp.toLocaleString()} XP</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: nextRank ? `${Math.min(100, ((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100)}%` : '100%' }}
                transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'var(--gradient-button)' }}
              />
            </div>
            {nextRank && (
              <p className="text-[9px] text-slate-400 mt-1 text-right">
                {(nextRank.minXP - xp).toLocaleString()} XP to {nextRank.emoji} {nextRank.title}
              </p>
            )}
          </motion.div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRestart}
              className="flex items-center justify-center gap-3 w-full py-4 text-white rounded-2xl font-black shadow-lg transition-all text-lg tracking-tight border border-white/10"
              style={{ background: 'var(--gradient-button)' }}
            >
              <RotateCcw size={22} />
              PLAY AGAIN
            </motion.button>

            <div className="grid grid-cols-2 gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onHome}
                className="flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-bold border border-slate-200 dark:border-white/10 text-sm"
              >
                <Home size={16} />
                HOME
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-2xl font-bold border border-slate-200 dark:border-white/10 text-sm"
              >
                <Share2 size={16} />
                SHARE
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
