/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Flame, Calendar, Play, Trophy, Globe, Target, Gift, LayoutGrid, Zap } from 'lucide-react';
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

  return (
    <div className="flex flex-col min-h-full py-5 px-5 relative safe-area-inset overflow-y-auto overflow-x-hidden no-scrollbar" style={{ background: 'linear-gradient(160deg, #0F172A 0%, #0d1f5c 50%, #1E3A8A 100%)', isolation: 'isolate' }}>
      {/* Ambient Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[100px] pointer-events-none z-[-1]" />
      <div className="absolute bottom-[20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none z-[-1]" />
      
      {/* Particles / Glowing dots */}
      <div className="absolute inset-0 pointer-events-none opacity-20 z-[-1]" style={{
        backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(255,255,255,0.15) 2px, transparent 0)',
        backgroundSize: '80px 80px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto relative z-10 flex flex-col pb-6"
      >
        {/* Header */}
        <div className="flex flex-col mb-6 mt-2">
          <div className="flex items-center gap-4 w-full mb-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-3 rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
            >
              <ChevronLeft size={24} className="text-white drop-shadow-md" />
            </motion.button>
          </div>
          <div className="text-left mt-2">
            <h1 className="text-4xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 24px rgba(59,130,246,0.8)' }}>
              DAILY CHALLENGE
            </h1>
            <p className="text-sm font-bold mt-1 text-blue-300 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]">
              {todayLabel}
            </p>
          </div>
        </div>

        {/* Hero Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-[2rem] p-6 mb-6 overflow-hidden text-white border border-blue-400/30 shadow-[0_8px_32px_rgba(59,130,246,0.25)] bg-slate-800/50 backdrop-blur-xl"
        >
          {/* Shine Animation */}
          <div className="absolute inset-0 w-full h-full" style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            animation: 'glow-sweep 3s infinite linear'
          }} />

          <div className="flex items-start justify-between mb-8 relative z-10">
            <div>
              <div className="text-blue-300 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5 drop-shadow-md">
                TODAY'S PUZZLE
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-400/20 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
                  <Calendar size={18} className="text-blue-400" />
                </div>
                <span className="font-black text-xl tracking-tight">{todayLabel}</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2 relative z-10">
            <div className="flex flex-col items-center justify-center py-2 bg-slate-900/40 rounded-xl border border-white/5 relative overflow-hidden">
              <Flame size={18} className="text-orange-400 mb-1 drop-shadow-[0_0_8px_rgba(251,146,60,0.8)] animate-flame" />
              <p className="text-2xl font-black text-white">{dailyStreak}</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">Streak</p>
            </div>
            
            <div className="flex flex-col items-center justify-center py-2 bg-slate-900/40 rounded-xl border border-white/5 relative overflow-hidden">
              <LayoutGrid size={18} className="text-cyan-400 mb-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              <p className="text-2xl font-black text-white">8×8</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">Grid</p>
            </div>
            
            <div className="flex flex-col items-center justify-center py-2 bg-slate-900/40 rounded-xl border border-white/5 relative overflow-hidden">
              <Zap size={18} className="text-purple-400 mb-1 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
              <p className="text-2xl font-black text-white">Med</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">Difficulty</p>
            </div>
          </div>
        </motion.div>

        {/* Already played banner */}
        {alreadyPlayed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 bg-green-500/20 backdrop-blur-md rounded-2xl border border-green-400/40 shadow-[0_0_16px_rgba(74,222,128,0.2)] mb-6"
          >
            <div className="p-2 bg-green-500/30 rounded-full border border-green-400/50">
              <Trophy size={20} className="text-green-300 drop-shadow-[0_0_8px_rgba(134,239,172,0.8)]" />
            </div>
            <p className="text-green-100 font-bold text-sm leading-tight">
              Challenge completed!<br/><span className="text-green-300/80 text-xs font-medium">Come back tomorrow for a new puzzle.</span>
            </p>
          </motion.div>
        )}

        {/* Today's Reward */}
        {!alreadyPlayed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3 px-1">
              <Gift size={16} className="text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-300">Today's Reward</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md shadow-inner">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-amber-400/20 blur-md" />
                <span className="text-lg font-black text-amber-400 relative z-10" style={{ textShadow: '0 0 10px rgba(251,191,36,0.5)' }}>+50</span>
                <span className="text-[8px] font-black uppercase text-amber-500 relative z-10">XP</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-white">Daily Bonus XP</h4>
                <p className="text-xs text-slate-400 font-medium leading-tight mt-0.5">Complete today's puzzle to earn bonus XP and build your streak!</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">How it works</p>
          <div className="space-y-2.5">
            {[
              { icon: Globe, text: "Same exact puzzle for all players globally.", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { icon: Target, text: "Score as high as possible on the daily board.", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
              { icon: Flame, text: "Play consecutive days to build your streak.", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
              { icon: Gift, text: "Unlock Forest Zen theme at 7-day streak.", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-700/40 backdrop-blur-sm">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.bg} ${item.border} border`}>
                   <item.icon size={16} className={`${item.color} drop-shadow-[0_0_6px_currentColor]`} />
                </div>
                <span className="text-xs text-slate-300 font-semibold leading-tight">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 w-full mb-4"
        >
          <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="relative flex items-center justify-center gap-3 w-full py-5 text-white rounded-full font-black text-[17px] shadow-[0_8px_32px_rgba(6,182,212,0.4)] transition-all tracking-wide border border-white/20 overflow-hidden"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}
          >
            {/* Pulse effect */}
            <div className="absolute inset-0 w-full h-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', animation: 'glow-sweep 2.5s infinite linear' }} />
            <Play size={22} fill="currentColor" className="relative z-10 drop-shadow-md" />
            <span className="relative z-10" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              {alreadyPlayed ? 'PLAY AGAIN' : "START TODAY'S CHALLENGE"}
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};
