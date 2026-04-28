/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, Settings, Calendar, Flame, Stars, Map, Target, Star } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { usePlayerStore, getRankForXP, getNextRank } from '../store/usePlayerStore';
import { useThemeStore } from '../store/useThemeStore';
import { StarShop } from '../components/StarShop';

interface HomeScreenProps {
  onStart: () => void;
  onLeaderboard: () => void;
  onDaily: () => void;
  onQuests: () => void;
  onJourney: () => void;
  onSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onSettings, onLeaderboard, onDaily, onQuests, onJourney }) => {
  const { highScore, dailyStreak } = useGameStore();
  const { xp, stars } = usePlayerStore();
  const { currentTheme } = useThemeStore();
  const [showShop, setShowShop] = React.useState(false);

  const rank = getRankForXP(xp);
  const nextRank = getNextRank(xp);
  const progress = nextRank 
    ? ((xp - rank.minXP) / (nextRank.minXP - rank.minXP)) * 100 
    : 100;

  return (
    <div className="flex flex-col items-center justify-start min-h-full py-4 px-5 relative">
      {/* Animated Background Blocks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: '110%', 
              rotate: Math.random() * 360 
            }}
            animate={{ 
              y: '-10%', 
              rotate: Math.random() * 360 + 360 
            }}
            transition={{ 
              duration: 15 + Math.random() * 20, 
              repeat: Infinity, 
              ease: 'linear',
              delay: i * 1.2
            }}
            className="absolute w-8 h-8 sm:w-12 sm:h-12 rounded-xl opacity-30"
            style={{
              background: `rgb(var(--color-primary) / 0.1)`,
              border: `1px solid rgb(var(--color-primary) / 0.15)`,
            }}
          />
        ))}
      </div>

      {/* Top Player Status Bar */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="fixed top-0 left-0 right-0 p-4 z-50 flex justify-center items-start gap-2"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="w-full max-w-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-4 flex items-center gap-4"
        >
          <div className="relative">
            <div className="text-3xl sm:text-4xl">{rank.emoji}</div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-1 border border-dashed border-primary/30 rounded-full"
              style={{ borderColor: `rgb(var(--color-primary) / 0.3)` }}
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Rank</p>
                <h3 className="text-sm font-black text-slate-800 dark:text-white leading-tight">{rank.title}</h3>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400">{xp.toLocaleString()} XP</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'var(--gradient-button)' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Home Star Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowShop(true)}
          className="flex items-center gap-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-4 h-[72px]"
        >
          <Star size={24} fill="#f59e0b" className="text-amber-500" />
          <span className="font-black text-amber-600 dark:text-amber-500 text-xl">{stars}</span>
        </motion.button>
      </motion.div>

      <StarShop isOpen={showShop} onClose={() => setShowShop(false)} />

      {/* Logo Area */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-4 sm:mb-8 relative z-10 flex flex-col items-center mt-10 sm:mt-12"
      >
        {/* New Animated App Logo */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-6 relative">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-full h-full relative z-10 drop-shadow-[0_10px_25px_rgba(59,130,246,0.4)]"
          >
            <img src="/logos.png" alt="Block Master Logo" className="w-full h-full object-contain" />
          </motion.div>
          
          {/* Logo Glow Aura */}
          <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse pointer-events-none" />
        </div>

        <div
          className="inline-block mb-3 px-4 py-1 rounded-full text-white text-[10px] font-black tracking-[0.2em] uppercase"
          style={{ 
            background: `rgb(var(--color-primary) / 0.1)`, 
            border: `1px solid rgb(var(--color-primary) / 0.25)`, 
            color: `rgb(var(--color-primary))` 
          }}
        >
          Official Edition v1.4.1
        </div>

        <h1 className="text-5xl sm:text-7xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter drop-shadow-sm sr-only">
          BLOCK MASTER
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-semibold tracking-[0.3em] text-[10px] uppercase">The Ultimate Challenge</p>
      </motion.div>

      {/* Main Play Button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="relative group z-10 mb-5 sm:mb-8"
      >
        <div
          className="absolute -inset-8 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition duration-1000"
          style={{ background: 'var(--gradient-button)' }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={onStart}
          className="relative flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 bg-white dark:bg-slate-900 rounded-full shadow-2xl border-[10px] border-white/50 dark:border-slate-800/50"
          style={{ color: `rgb(var(--color-primary))` }}
        >
          <Play size={52} fill="currentColor" className="ml-2" />
        </motion.button>
      </motion.div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm flex flex-col items-center gap-4 relative z-10"
      >
        {/* Streak & Score row */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <motion.button
            whileHover={{ y: -2 }}
            onClick={onLeaderboard}
            className="flex flex-col p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/20 shadow-lg text-left"
          >
            <Trophy size={18} className="text-amber-500 mb-2" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Best Score</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{highScore.toLocaleString()}</span>
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            onClick={onDaily}
            className="flex flex-col p-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-white/20 shadow-lg text-left"
          >
            <Flame size={18} className="text-orange-500 mb-2 animate-flame" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Streak</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{dailyStreak} Days</span>
          </motion.button>
        </div>

        {/* Journey Mode Start */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onJourney}
          className="w-full py-5 rounded-[2rem] text-white font-black text-lg tracking-tight shadow-xl flex items-center justify-center gap-3 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
        >
           <Map size={22} />
           JOURNEY MODE
        </motion.button>

        {/* Daily Challenge Start */}
        <div className="grid grid-cols-2 gap-3 w-full">
           <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDaily}
            className="py-4 rounded-3xl text-white font-black text-sm tracking-tight shadow-xl flex flex-col items-center justify-center gap-1"
            style={{ background: 'var(--gradient-button)' }}
          >
            <Calendar size={18} />
            DAILY
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onQuests}
            className="py-4 rounded-3xl text-white font-black text-sm tracking-tight shadow-xl flex flex-col items-center justify-center gap-1"
            style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}
          >
            <Target size={18} />
            MISSIONS
          </motion.button>
        </div>

        {/* Settings/Info row */}
        <div className="flex gap-4">
          <motion.button whileHover={{ scale: 1.1 }} onClick={onLeaderboard} className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/20 text-slate-500">
            <Trophy size={20} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} onClick={onSettings} className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-white/20 text-slate-500">
            <Settings size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="mt-4 mb-2 pb-safe text-[10px] font-black text-slate-400 dark:text-slate-600 tracking-[0.4em] uppercase">
        Premium Edition v1.4.1
      </div>
    </div>
  );
};
