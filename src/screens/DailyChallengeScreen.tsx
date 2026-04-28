/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Flame, Calendar, Play, Trophy } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { getTodayLabel, getTodayChallengeId } from '../lib/dailySeed';

interface DailyChallengeScreenProps {
  onBack: () => void;
  onStart: () => void;
}

export const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({ onBack, onStart }) => {
  const { startGame, dailyStreak, lastDailyDate } = useGameStore();

  const todayLabel = getTodayLabel();

  const todayDateId = getTodayChallengeId();

  const alreadyPlayed = lastDailyDate === todayDateId;

  const handleStart = () => {
    // Daily challenge: medium difficulty, 8x8 grid, seeded blocks
    startGame(8, 'medium', true);
    onStart();
  };

  const streakEmoji = dailyStreak >= 7 ? '🔥' : dailyStreak >= 3 ? '⚡' : '📅';

  return (
    <div className="flex flex-col min-h-full py-5 px-5 relative safe-area-inset">
      {/* Animated Background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgb(var(--color-primary)), transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto relative z-10"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack}
            className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 shadow-lg"
          >
            <ChevronLeft size={24} />
          </motion.button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">DAILY CHALLENGE</h1>
            <p className="text-xs text-slate-400 font-semibold">{todayLabel}</p>
          </div>
        </div>

        {/* Hero Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-[2rem] p-6 mb-6 overflow-hidden text-white border border-white/10"
          style={{ background: 'var(--gradient-button)' }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 shimmer" />

          <div className="flex items-start justify-between mb-8 relative">
            <div>
              <div className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                Today's Puzzle
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-white/80" />
                <span className="font-black text-lg">{todayLabel}</span>
              </div>
            </div>
            <div className="text-4xl animate-flame">{streakEmoji}</div>
          </div>

          <div className="grid grid-cols-3 gap-4 relative">
            <div className="text-center">
              <p className="text-3xl font-black">{dailyStreak}</p>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wide">Day Streak</p>
            </div>
            <div className="text-center border-x border-white/20">
              <p className="text-3xl font-black">8×8</p>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wide">Grid</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black">Med</p>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-wide">Difficulty</p>
            </div>
          </div>
        </motion.div>

        {/* Streak info */}
        {dailyStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4"
          >
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
              <Flame size={20} className="text-orange-500 animate-flame" />
            </div>
            <div>
              <p className="font-black text-slate-800 dark:text-slate-200 text-sm">
                {dailyStreak}-Day Streak! 🔥
              </p>
              <p className="text-xs text-slate-400">
                {dailyStreak >= 7 ? 'Forest Zen theme unlocked!' : `${7 - dailyStreak} more days for Forest Zen theme`}
              </p>
            </div>
          </motion.div>
        )}

        {/* Already played banner */}
        {alreadyPlayed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800 mb-4"
          >
            <Trophy size={20} className="text-green-500 flex-shrink-0" />
            <p className="text-green-700 dark:text-green-300 font-bold text-sm">
              You've completed today's challenge! Come back tomorrow.
            </p>
          </motion.div>
        )}

        {/* Rules */}
        <div className="p-4 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">How it works</p>
          <ul className="space-y-2">
            {[
              'Every player worldwide gets the same puzzle today',
              'Score as high as you can on an 8×8 Medium grid',
              'Play daily to build your streak',
              '7-day streak unlocks the Forest Zen theme',
            ].map((rule, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                <span className="text-blue-400 font-black">{i + 1}.</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="flex items-center justify-center gap-4 w-full py-5 text-white rounded-[2.5rem] font-black text-xl shadow-[0_20px_40px_rgba(59,130,246,0.3)] transition-all tracking-tight border border-white/10"
          style={{ background: 'var(--gradient-button)' }}
        >
          <Play size={24} fill="currentColor" />
          {alreadyPlayed ? 'PLAY AGAIN' : "START TODAY'S CHALLENGE"}
        </motion.button>
      </motion.div>
    </div>
  );
};
