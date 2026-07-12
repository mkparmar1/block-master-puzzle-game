/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { useGameStore } from '../store/useGameStore';
import confetti from 'canvas-confetti';
import { useThemeStore } from '../store/useThemeStore';
import { usePlayerStore, getRankForXP, getNextRank, xpForScore } from '../store/usePlayerStore';
import { shareScore } from '../lib/shareCard';
import { SvgIcon } from '../components/SvgIcon';
import { SvgButton } from '../components/SvgButton';
import { SvgCard } from '../components/SvgCard';
import { SvgProgressBar } from '../components/SvgProgressBar';

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

const StatCard: React.FC<{ iconId: any; label: string; value: string | number; accent?: boolean }> = ({
  iconId, label, value, accent
}) => (
  <SvgCard className="p-3" variant={accent ? 'gold-border' : 'stone'}>
    <div className="flex flex-col items-center gap-1 text-center">
      <SvgIcon id={iconId} size={18} />
      <span className={`text-xl font-black ${accent ? 'text-amber-950' : 'text-white'}`}>{value}</span>
      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center ${accent ? 'text-amber-950/70' : 'text-slate-500'}`}>{label}</span>
    </div>
  </SvgCard>
);

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ onRestart, onHome }) => {
  const { score, highScore, difficulty, blocksPlaced, totalLinesCleared, maxCombo, gridSize } = useGameStore();
  const { currentTheme } = useThemeStore();
  const { xp, addXP, stars, addStars } = usePlayerStore();

  const earnedXP = xpForScore(score);
  const earnedStars = score >= 500 ? Math.floor(score / 500) * 2 : 0;
  const starsCount = getStarRating(score, difficulty);

  const rank = getRankForXP(xp);
  const nextRank = getNextRank(xp);
  const isNewBest = score > 0 && score >= highScore;

  useEffect(() => {
    addXP(earnedXP);
    if (earnedStars > 0) {
      addStars(earnedStars);
    }
    const { addStats } = usePlayerStore.getState();
    addStats(blocksPlaced, 1);
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

  // Calculate rank XP progress percentage
  const progressPercent = nextRank ? Math.min(100, ((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100) : 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="w-full max-w-[90vw] sm:max-w-sm"
      >
        <SvgCard className="p-6 text-center" variant="gold-border">
          {/* Trophy icon */}
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
            className="inline-flex p-4 rounded-full mb-4 border border-amber-400/40 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
          >
            <SvgIcon id="leaderboard" size={40} />
          </motion.div>

          <h2 className="text-3xl font-black text-white mb-1 tracking-tighter" style={{ textShadow: '0 0 15px rgba(251,191,36,0.3)' }}>
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
                <SvgIcon
                  id="stars"
                  size={28}
                  className={s <= starsCount ? 'text-amber-400' : 'text-slate-700'}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Main Scores */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <SvgCard className="p-4" variant="stone">
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Score</span>
              <span className="text-3xl font-black text-white">{score.toLocaleString()}</span>
            </SvgCard>
            <SvgCard className="p-4" variant="stone">
              <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Best</span>
              <span className="text-3xl font-black tracking-tight text-amber-400">
                {highScore.toLocaleString()}
              </span>
            </SvgCard>
          </div>

          {/* Session Stats */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatCard iconId="theme" label="Blocks" value={blocksPlaced} />
            <StatCard iconId="mission" label="Lines" value={totalLinesCleared} />
            <StatCard iconId="zap" label="Max Combo" value={`${maxCombo}x`} accent={maxCombo >= 3} />
          </div>

          {/* XP / Rank bar */}
          <SvgCard className="p-3 mb-4" variant="stone">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{rank.emoji}</span>
                <span className="font-black text-white text-sm">{rank.title}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">{xp.toLocaleString()} XP</span>
            </div>
            <SvgProgressBar progress={progressPercent} height={6} />
            {nextRank && (
              <p className="text-[9px] text-slate-400 mt-1 text-right">
                {(nextRank.minXP - xp).toLocaleString()} XP to {nextRank.emoji} {nextRank.title}
              </p>
            )}
          </SvgCard>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <SvgButton
              onClick={onRestart}
              id="gameover-restart-btn"
              className="w-full py-4 rounded-2xl"
              variant="gold"
            >
              <SvgIcon id="refresh" size={22} className="text-amber-950" />
              PLAY AGAIN
            </SvgButton>

            <div className="grid grid-cols-2 gap-2">
              <SvgButton
                onClick={onHome}
                id="gameover-home-btn"
                className="w-full py-3 rounded-2xl"
                variant="stone"
              >
                <SvgIcon id="home" size={16} />
                HOME
              </SvgButton>
              <SvgButton
                onClick={handleShare}
                id="gameover-share-btn"
                className="w-full py-3 rounded-2xl"
                variant="stone"
              >
                <SvgIcon id="journey" size={16} />
                SHARE
              </SvgButton>
            </div>
          </div>
        </SvgCard>
      </motion.div>
    </div>
  );
};
